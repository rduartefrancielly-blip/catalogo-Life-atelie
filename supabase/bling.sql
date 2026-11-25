-- =====================================================================
-- Life Ateliê · Integração com o Bling (enviar vendas direto, pela API)
-- Cole este arquivo inteiro em: Supabase → SQL Editor → New query → Run
-- Só ADICIONA coisas novas. Pode rodar mais de uma vez sem perder dados.
-- =====================================================================

-- Conexão com a conta do Bling (uma só). Ninguém lê esta tabela pelo site:
-- só a função "bling" do Supabase, com a chave secreta do servidor.
create table if not exists public.bling_conexao (
  id             integer primary key default 1 check (id = 1),
  access_token   text,
  refresh_token  text,
  expira_em      timestamptz,
  conectado_em   timestamptz,
  renovado_em    timestamptz,
  estado         text,        -- código de segurança do "Conectar ao Bling" (vale 15 minutos)
  estado_em      timestamptz,
  volta          text         -- página para onde voltar depois de autorizar
);
alter table public.bling_conexao enable row level security;
revoke all on public.bling_conexao from anon, authenticated;

-- Venda enviada: id e número do pedido no Bling, ou o motivo de não ter ido
alter table public.vendas add column if not exists bling_id bigint;
alter table public.vendas add column if not exists bling_numero text;
alter table public.vendas add column if not exists bling_erro text;

-- Cliente já cadastrada no Bling (para não procurar nem cadastrar de novo)
alter table public.clientes add column if not exists bling_contato_id bigint;

-- Vendedora que vai nos pedidos enviados ao Bling (o código do Bling, escolhido na aba Bling)
alter table public.bling_conexao add column if not exists vendedor_id bigint;
alter table public.bling_conexao add column if not exists vendedor_nome text;

-- Orçamento ligado ao cadastro da cliente (se a aba Orçamentos já estiver instalada)
do $$
begin
  if to_regclass('public.orcamentos') is not null then
    alter table public.orcamentos add column if not exists cliente_id uuid;
  end if;
end $$;

-- ---------------------------------------------------------------------
-- Estoque entre o sistema e o Bling: botões "Trazer do Bling" / "Enviar para o Bling" e automático
-- ---------------------------------------------------------------------
alter table public.bling_conexao add column if not exists estoque_auto       boolean not null default false;
alter table public.bling_conexao add column if not exists estoque_chave      text;        -- chave do agendamento (só o banco e a função conhecem)
alter table public.bling_conexao add column if not exists funcao_url         text;        -- endereço da função "bling" (a própria função grava)
alter table public.bling_conexao add column if not exists estoque_rodando_em timestamptz; -- uma sincronização por vez
alter table public.bling_conexao add column if not exists estoque_lido_em    timestamptz; -- quando o estoque daqui foi lido pela última vez
alter table public.bling_conexao add column if not exists estoque_sinc_em    timestamptz; -- última sincronização que terminou
alter table public.bling_conexao add column if not exists estoque_resumo     jsonb;       -- o que mudou e o que ficou para conferir
-- quem manda no automático: 'trazer' (o Bling manda, o estoque vem para cá) ou 'enviar' (o sistema manda)
alter table public.bling_conexao add column if not exists estoque_direcao    text not null default 'trazer';
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'bling_conexao_estoque_direcao_ok') then
    alter table public.bling_conexao add constraint bling_conexao_estoque_direcao_ok check (estoque_direcao in ('trazer', 'enviar'));
  end if;
end $$;

-- Agendamento dentro do banco (pg_cron) que chama a função pela internet (pg_net)
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema pg_catalog;

-- A cada 5 minutos, com o automático ligado:
--   trazer (o Bling manda): confere o Bling toda vez (se a última deu erro, espera 1 hora para tentar de novo);
--   enviar (o sistema manda): só quando o estoque daqui mudou, ou ficou algo para a próxima, ou já faz 1 hora.
select cron.schedule('life-bling-estoque', '*/5 * * * *', $job$
  select net.http_post(
    url := c.funcao_url || '/estoque-automatico',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-life-chave', c.estoque_chave),
    body := '{}'::jsonb,
    timeout_milliseconds := 15000
  )
  from public.bling_conexao c
  where c.id = 1
    and c.estoque_auto
    and c.refresh_token is not null
    and c.funcao_url is not null
    and c.estoque_chave is not null
    and (c.estoque_rodando_em is null or c.estoque_rodando_em < now() - interval '3 minutes')
    and (
      c.estoque_lido_em is null
      or c.estoque_lido_em < now() - interval '1 hour'
      or coalesce((c.estoque_resumo ->> 'faltam')::int, 0) > 0
      or (c.estoque_direcao = 'trazer' and (c.estoque_resumo ->> 'erro') is null)
      or (c.estoque_direcao = 'enviar' and exists (select 1 from public.produtos p where p.atualizado_em > c.estoque_lido_em))
    );
$job$);

-- A tela confere se o agendamento existe (só a função do servidor pode perguntar)
create or replace function public.bling_estoque_agenda() returns text
language sql stable security definer set search_path = '' as $$
  select j.schedule from cron.job j where j.jobname = 'life-bling-estoque' limit 1;
$$;
revoke all on function public.bling_estoque_agenda() from public, anon, authenticated;
grant execute on function public.bling_estoque_agenda() to service_role;

-- Trazer do Bling: grava a quantidade como um "Ajuste" do estoque, pelo mesmo caminho dos botões − e +
-- (ajustar_estoque), em nome da administradora, para ficar no histórico. Só a função do servidor pode chamar.
create or replace function public.bling_trazer_quantidade(p_produto uuid, p_variacao text, p_quantidade integer, p_motivo text, p_email text default null)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_email text;
  v_id    uuid;
begin
  select trim(a.email) into v_email from public.admins a
   where p_email is not null and lower(trim(a.email)) = lower(trim(p_email)) limit 1;
  if v_email is null then
    select trim(a.email) into v_email from public.admins a order by a.email limit 1;
  end if;
  if v_email is null then raise exception 'Nenhuma administradora cadastrada (tabela admins).'; end if;
  select u.id into v_id from auth.users u where lower(u.email) = lower(v_email) limit 1;
  -- age como a administradora logada (as regras do estoque conferem o login por estes dados)
  perform set_config('request.jwt.claims', json_build_object('email', v_email, 'sub', v_id, 'role', 'authenticated')::text, true);
  perform set_config('request.jwt.claim.email', v_email, true);
  perform set_config('request.jwt.claim.sub', coalesce(v_id::text, ''), true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);
  perform public.ajustar_estoque(p_produto => p_produto, p_variacao => coalesce(p_variacao, ''), p_tipo => 'ajuste', p_quantidade => p_quantidade, p_motivo => p_motivo);
end $$;
revoke all on function public.bling_trazer_quantidade(uuid, text, integer, text, text) from public, anon, authenticated;
grant execute on function public.bling_trazer_quantidade(uuid, text, integer, text, text) to service_role;

select 'Bling pronto ✓' as resultado;
