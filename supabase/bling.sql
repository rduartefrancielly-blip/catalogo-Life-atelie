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

select 'Bling pronto ✓' as resultado;
