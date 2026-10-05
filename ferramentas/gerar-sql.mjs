// Gera supabase/produtos-iniciais.sql a partir de ferramentas/produtos-site.mjs
// Uso: node ferramentas/gerar-sql.mjs
import { writeFileSync } from "node:fs";
import { PRODUTOS } from "./produtos-site.mjs";

const WHATSAPP = "5531994685463";

const txt = (v) => (v == null ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const num = (v) => (v == null ? "null" : Number(v).toFixed(2));
const json = (v) => `${txt(JSON.stringify(v))}::jsonb`;

const linhas = PRODUTOS.map((p) => `insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select ${txt(p.nome)}, ${txt(p.categoria)}, ${txt(p.codigo)}, ${num(p.preco)}, ${num(p.preco_antigo)},
  ${txt(p.descricao)},
  ${txt(p.materiais)}, ${txt(p.medidas)}, ${txt(p.caracteristicas)},
  ${json(p.fotos)}, ${json(p.variacoes)}, ${p.visivel}, ${p.destaque}, ${p.ordem}, ${txt(p.origem_url)}
where not exists (select 1 from public.produtos where origem_url = ${txt(p.origem_url)});`);

const sql = `-- =====================================================================
-- Carga inicial: ${PRODUTOS.length} produtos copiados de lifeatelie.com.br
-- Rode DEPOIS do esquema.sql (Supabase → SQL Editor → New query → Run).
-- Pode rodar de novo: produtos que já existem (mesmo link do site) são pulados.
-- Arquivo gerado por ferramentas/gerar-sql.mjs — não edite à mão.
-- =====================================================================

update public.config set whatsapp = '${WHATSAPP}' where id = 1 and coalesce(whatsapp, '') = '';

${linhas.join("\n\n")}
`;

writeFileSync(new URL("../supabase/produtos-iniciais.sql", import.meta.url), sql);
console.log(`supabase/produtos-iniciais.sql: ${PRODUTOS.length} produtos`);
