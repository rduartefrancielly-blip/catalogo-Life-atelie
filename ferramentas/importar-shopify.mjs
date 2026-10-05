// Converte produtos do products.json da loja (Shopify) para o formato do catálogo.
// Regra: nada é inventado. O texto do site é só reorganizado em campos:
//   "Características do couro"            → materiais
//   "Medidas"                              → medidas
//   "Detalhes do produto" / "Especificações" e listas com marcadores → características
//   todo o resto (incluindo "Como usar", "Espaço interno", "Ocasiões") → descrição
import { readFileSync } from "node:fs";

export const SITE = "https://www.lifeatelie.com.br/products/";

const ENTIDADES = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", "#39": "'", ndash: "–", mdash: "—", hellip: "…", bull: "•" };

// HTML → linhas de texto. Parágrafos separados por linha em branco; itens de lista viram "• item".
export function htmlParaLinhas(html) {
  let t = String(html || "")
    .replace(/\r/g, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/(p|div|h\d|ul|ol)>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&(#?\w+);/g, (m, e) => ENTIDADES[e] ?? (e.startsWith("#") ? String.fromCharCode(Number(e.slice(1))) : m));
  const linhas = t.split("\n").map((l) => l.replace(/[ \t\u00a0]+/g, " ").trim());
  // Em alguns produtos o marcador "•" fica numa linha e o texto do item na seguinte
  const saida = [];
  for (let i = 0; i < linhas.length; i++) {
    if (linhas[i] !== "•") { saida.push(linhas[i]); continue; }
    let j = i + 1;
    while (j < linhas.length && !linhas[j]) j++;
    if (j < linhas.length) { saida.push("• " + linhas[j]); i = j; }
  }
  return saida;
}

const TITULOS = {
  "como usar": "descricao",
  "espaço interno": "descricao",
  "ocasiões": "descricao",
  "características do couro": "materiais",
  "medidas": "medidas",
  "detalhes do produto": "caracteristicas",
  "especificações": "caracteristicas",
};
const chave = (l) => l.toLowerCase().replace(/:$/, "").trim();
const ehTitulo = (l) => chave(l) in TITULOS;
const ehMedida = (l) => /^[•\s]*[A-Za-zÀ-ú ]{2,30}:\s*\S/.test(l);
const ehMarcador = (l) => l.startsWith("•");
const semMarcador = (l) => l.replace(/^•\s*/, "").trim();
const espacarUnidades = (l) => l.replace(/(\d)(cm|mm|g|kg)\b/g, "$1 $2");

export function separarTexto(html) {
  const linhas = htmlParaLinhas(html);
  const desc = []; // linhas da descrição (com "" como separador de parágrafo)
  const materiais = [];
  const medidas = [];
  const carac = [];
  let i = 0;
  const pular = () => { while (i < linhas.length && !linhas[i]) i++; };
  // próxima linha não vazia a partir de j
  const proxima = (j) => { while (j < linhas.length && !linhas[j]) j++; return linhas[j] || ""; };

  while (i < linhas.length) {
    const l = linhas[i];
    if (!l) { desc.push(""); i++; continue; }
    if (!ehTitulo(l)) {
      if (ehMarcador(l)) carac.push(semMarcador(l));
      else desc.push(l);
      i++;
      continue;
    }
    const destino = TITULOS[chave(l)];
    i++;
    if (destino === "descricao") {
      desc.push("", l); // mantém o subtítulo na descrição
      continue;
    }
    if (destino === "materiais") {
      pular();
      // texto até o fim do parágrafo
      while (i < linhas.length && linhas[i] && !ehTitulo(linhas[i])) materiais.push(linhas[i++]);
      continue;
    }
    if (destino === "medidas") {
      pular();
      while (i < linhas.length && (ehMedida(linhas[i]) || (!linhas[i] && ehMedida(proxima(i))))) {
        if (linhas[i]) medidas.push(espacarUnidades(semMarcador(linhas[i])));
        i++;
      }
      continue;
    }
    if (destino === "caracteristicas") {
      pular();
      while (i < linhas.length && (ehMarcador(linhas[i]) || (!linhas[i] && ehMarcador(proxima(i))))) {
        if (linhas[i]) carac.push(semMarcador(linhas[i]));
        i++;
      }
      continue;
    }
  }

  const descricao = desc.join("\n").replace(/\n{3,}/g, "\n\n").replace(/^\n+|\n+$/g, "")
    // subtítulo colado ao texto que vem logo abaixo dele
    .replace(new RegExp(`(^|\\n\\n)(${Object.keys(TITULOS).filter((k) => TITULOS[k] === "descricao").join("|")})\\n\\n`, "gi"), "$1$2\n");
  const caracteristicas = carac.filter(Boolean);
  let mat = materiais.join(" ").trim();
  // Sem seção própria: usa a característica que fala do couro (como no site)
  if (!mat) mat = caracteristicas.find((c) => /couro/i.test(c)) || "";
  return {
    descricao: descricao || null,
    materiais: mat || null,
    medidas: medidas.join("\n") || null,
    caracteristicas: caracteristicas.join("\n") || null,
  };
}

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function normalizarNome(titulo) {
  const t = String(titulo).replace(/\s+/g, " ").trim().replace(/\s*-\s*/g, " - ");
  const [modelo, ...resto] = t.split(" - ");
  return resto.length ? `${modelo} - ${capital(resto.join(" - "))}` : modelo;
}

export function categoriaDe(nome) {
  if (/^Tag\b/i.test(nome)) return "Tags personalizáveis";
  if (/^Mouse ?pad/i.test(nome)) return "Mousepads";
  if (/^Mochila/i.test(nome)) return "Mochilas";
  if (/Porta Celular Bia/i.test(nome)) return "Bia (porta-celular)";
  const m = nome.match(/^Bolsa ([A-Za-zÀ-ú]+)/);
  return m ? capital(m[1].toLowerCase()) : null;
}

// Converte um produto do Shopify. avisos recebe as inconsistências encontradas.
export function converter(p, ordem, avisos = []) {
  const nome = normalizarNome(p.title);
  const v = p.variants[0];
  let preco = Number(v.price);
  if (!(preco > 0)) {
    avisos.push(`${nome}: preço no site é R$ ${v.price} — ficou "sem preço"`);
    preco = null;
  }
  let antigo = v.compare_at_price == null ? null : Number(v.compare_at_price);
  if (antigo != null && !(preco != null && antigo > preco)) {
    if (antigo !== preco) avisos.push(`${nome}: "preço de" no site (R$ ${v.compare_at_price}) não é maior que o preço — ignorado`);
    antigo = null;
  }
  if (p.variants.length > 1) avisos.push(`${nome}: tem ${p.variants.length} variações no site — conferir`);
  const disponivel = p.variants.some((x) => x.available);
  const fotos = [...new Set(p.images.map((im) => im.src))].map((url) => ({ url }));
  return {
    nome,
    categoria: categoriaDe(nome),
    codigo: v.sku || null,
    preco,
    preco_antigo: antigo,
    ...separarTexto(p.body_html),
    fotos,
    variacoes: [{ nome: "", quantidade: disponivel ? null : 0 }],
    visivel: true,
    destaque: false,
    ordem,
    origem_url: SITE + p.handle,
  };
}

export function lerPaginas(arquivos) {
  return arquivos.flatMap((a) => JSON.parse(readFileSync(a, "utf8")).products || []);
}
