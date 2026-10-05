// Gera os arquivos SQL de carga de produtos.
// Uso: node ferramentas/gerar-sql.mjs
//
// Página 1 do site: ferramentas/produtos-site.mjs (transcrita do texto colado no chat).
// Páginas 2 a 5:    ferramentas/site/pagina-N.json (arquivos products.json da loja),
//                   convertidas por ferramentas/importar-shopify.mjs.
import { writeFileSync } from "node:fs";
import { PRODUTOS as PAGINA_1 } from "./produtos-site.mjs";
import { lerPaginas, converter } from "./importar-shopify.mjs";

const WHATSAPP = "5531994685463";

const avisos = [];
const PAGINAS_2_A_5 = lerPaginas([2, 3, 4, 5].map((n) => new URL(`./site/pagina-${n}.json`, import.meta.url)))
  .map((p, i) => converter(p, PAGINA_1.length + i, avisos));

const txt = (v) => (v == null ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const num = (v) => (v == null ? "null" : Number(v).toFixed(2));
const json = (v) => `${txt(JSON.stringify(v))}::jsonb`;

const insert = (p) => `insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select ${txt(p.nome)}, ${txt(p.categoria)}, ${txt(p.codigo)}, ${num(p.preco)}, ${num(p.preco_antigo)},
  ${txt(p.descricao)},
  ${txt(p.materiais)}, ${txt(p.medidas)}, ${txt(p.caracteristicas)},
  ${json(p.fotos)}, ${json(p.variacoes)}, ${p.visivel}, ${p.destaque}, ${p.ordem}, ${txt(p.origem_url)}
where not exists (select 1 from public.produtos where origem_url = ${txt(p.origem_url)});`;

function arquivo(nome, titulo, produtos, comConfig) {
  const sql = `-- =====================================================================
-- ${titulo}
-- ${produtos.length} produtos copiados de lifeatelie.com.br
-- Rode DEPOIS do esquema.sql (Supabase → SQL Editor → New query → Run).
-- Pode rodar de novo: produtos que já existem (mesmo link do site) são pulados.
-- Arquivo gerado por ferramentas/gerar-sql.mjs — não edite à mão.
-- =====================================================================
${comConfig ? `\nupdate public.config set whatsapp = '${WHATSAPP}' where id = 1 and coalesce(whatsapp, '') = '';\n` : ""}
${produtos.map(insert).join("\n\n")}

select count(*) as total_de_produtos from public.produtos;
`;
  writeFileSync(new URL(`../supabase/${nome}`, import.meta.url), sql);
  console.log(`supabase/${nome}: ${produtos.length} produtos (${Math.round(sql.length / 1024)} KB)`);
}

// Instalação do zero: tudo de uma vez
arquivo("produtos-iniciais.sql", "Carga completa do catálogo (páginas 1 a 5 do site)", [...PAGINA_1, ...PAGINAS_2_A_5], true);

// Para quem já rodou a carga da página 1: os 100 novos, em duas partes menores
const meio = Math.ceil(PAGINAS_2_A_5.length / 2);
arquivo("novos-produtos-parte-1.sql", "Produtos novos — parte 1 de 2 (páginas 2 a 5 do site)", PAGINAS_2_A_5.slice(0, meio), false);
arquivo("novos-produtos-parte-2.sql", "Produtos novos — parte 2 de 2 (páginas 2 a 5 do site)", PAGINAS_2_A_5.slice(meio), false);

if (avisos.length) console.log("\nAvisos:\n- " + avisos.join("\n- "));
