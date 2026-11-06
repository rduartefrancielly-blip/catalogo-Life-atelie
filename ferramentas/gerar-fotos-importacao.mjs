// Gera js/fotos-importacao.json: as fotos que cada produto recebeu na importação do site,
// na mesma ordem. O admin usa para saber de onde veio cada foto já copiada para o banco
// (o botão antigo "Copiar fotos para o banco" não guardava a origem) e conferir o que mudou no site.
// Uso: node ferramentas/gerar-fotos-importacao.mjs
import { writeFileSync } from "node:fs";
import { PRODUTOS as PAGINA_1 } from "./produtos-site.mjs";
import { lerPaginas, converter } from "./importar-shopify.mjs";

const PAGINAS_2_A_5 = lerPaginas([2, 3, 4, 5].map((n) => new URL(`./site/pagina-${n}.json`, import.meta.url)))
  .map((p, i) => converter(p, PAGINA_1.length + i, []));

const PREFIXO = "https://cdn.shopify.com/s/files/1/0681/1628/3443/files/";
const fotos = {};
for (const p of [...PAGINA_1, ...PAGINAS_2_A_5]) {
  const handle = decodeURIComponent(p.origem_url.split("/products/")[1]).toLowerCase();
  fotos[handle] = p.fotos.map((f) => (f.url.startsWith(PREFIXO) ? f.url.slice(PREFIXO.length) : f.url));
}
const saida = JSON.stringify({ prefixo: PREFIXO, fotos });
writeFileSync(new URL("../js/fotos-importacao.json", import.meta.url), saida + "\n");
console.log(`js/fotos-importacao.json: ${Object.keys(fotos).length} produtos, ${Object.values(fotos).flat().length} fotos (${Math.round(saida.length / 1024)} KB)`);
