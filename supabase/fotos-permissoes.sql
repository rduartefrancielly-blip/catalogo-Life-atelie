-- =====================================================================
-- Life Ateliê · Deixa o sistema apagar fotos que não são mais usadas
-- Cole este arquivo inteiro em: Supabase → SQL Editor → New query → Run
--
-- O armazenamento do Supabase só apaga uma foto se quem pede também
-- puder "ver" a lista de fotos. Sem isto, fotos trocadas ou removidas
-- continuam guardadas ocupando espaço (o catálogo funciona normalmente).
-- Não mexe em produtos, fotos, clientes, vendas nem orçamentos.
-- Pode rodar mais de uma vez.
-- =====================================================================

-- Administradora: fotos do catálogo
drop policy if exists "admin ve fotos" on storage.objects;
create policy "admin ve fotos" on storage.objects
  for select to authenticated
  using (bucket_id = 'fotos' and public.eh_admin());

-- Equipe de vendas: fotos dos orçamentos (só se os orçamentos já estiverem instalados)
drop policy if exists "equipe ve fotos de orcamento" on storage.objects;
do $$
begin
  if to_regprocedure('public.pode_orcar()') is not null then
    create policy "equipe ve fotos de orcamento" on storage.objects
      for select to authenticated
      using (bucket_id = 'fotos' and name like 'orcamentos/%' and public.pode_orcar());
  end if;
end $$;

select 'Permissões das fotos prontas ✓' as resultado;
