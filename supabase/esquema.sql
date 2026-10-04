-- =====================================================================
-- Catálogo Life Ateliê — banco de dados (Supabase)
-- Cole este arquivo inteiro em: Supabase → SQL Editor → New query → Run
-- Pode rodar mais de uma vez sem perder dados.
-- =====================================================================

-- Quem pode entrar na área administrativa (e-mails das contas criadas em
-- Authentication → Users). Adicione aqui cada pessoa que vai editar.
create table if not exists public.admins (
  email text primary key
);

create or replace function public.eh_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Produtos ------------------------------------------------------------
create table if not exists public.produtos (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  categoria       text,
  preco           numeric(10,2),          -- null = "Consulte o valor"
  preco_antigo    numeric(10,2),          -- preço "de" (riscado)
  descricao       text,
  materiais       text,
  medidas         text,
  caracteristicas text,                   -- uma por linha
  -- [{ "url": "...", "alt": "..." }] — a primeira é a capa
  fotos           jsonb not null default '[]'::jsonb,
  -- [{ "nome": "Caramelo", "quantidade": 2, "preco": null }]
  -- nome vazio = produto sem variação. quantidade null = não informada.
  variacoes       jsonb not null default '[{"nome":"","quantidade":null}]'::jsonb,
  visivel         boolean not null default true,
  destaque        boolean not null default false,
  ordem           integer not null default 0,
  origem_url      text,                   -- página do produto no site
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now()
);

create or replace function public.tocar_atualizado() returns trigger
language plpgsql as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;

drop trigger if exists produtos_atualizado on public.produtos;
create trigger produtos_atualizado before update on public.produtos
  for each row execute function public.tocar_atualizado();

-- Configurações da loja (uma linha só) --------------------------------
create table if not exists public.config (
  id                int primary key default 1 check (id = 1),
  whatsapp          text,                 -- 55 + DDD + número
  instagram         text,
  mostrar_esgotados boolean not null default true
);
insert into public.config (id) values (1) on conflict do nothing;

-- Segurança: clientes só leem; só admins alteram -----------------------
alter table public.admins   enable row level security;
alter table public.produtos enable row level security;
alter table public.config   enable row level security;

drop policy if exists "admins leem" on public.admins;
create policy "admins leem" on public.admins for select using (public.eh_admin());

drop policy if exists "publico ve produtos visiveis" on public.produtos;
create policy "publico ve produtos visiveis" on public.produtos
  for select using (visivel or public.eh_admin());

drop policy if exists "admin altera produtos" on public.produtos;
create policy "admin altera produtos" on public.produtos
  for all using (public.eh_admin()) with check (public.eh_admin());

drop policy if exists "publico le config" on public.config;
create policy "publico le config" on public.config for select using (true);

drop policy if exists "admin altera config" on public.config;
create policy "admin altera config" on public.config
  for update using (public.eh_admin()) with check (public.eh_admin());

-- Fotos (Storage) ------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "admin envia fotos" on storage.objects;
create policy "admin envia fotos" on storage.objects
  for insert with check (bucket_id = 'fotos' and public.eh_admin());

drop policy if exists "admin altera fotos" on storage.objects;
create policy "admin altera fotos" on storage.objects
  for update using (bucket_id = 'fotos' and public.eh_admin());

drop policy if exists "admin apaga fotos" on storage.objects;
create policy "admin apaga fotos" on storage.objects
  for delete using (bucket_id = 'fotos' and public.eh_admin());
