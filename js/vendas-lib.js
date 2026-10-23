// Life Ateliê - regras de vendas que não dependem da tela nem do banco:
// busca de produtos, leitura do texto da live, texto para copiar e planilha do Bling.
window.VendasLib = (function () {
  "use strict";

  // ---------- Utilidades ----------
  const semAcento = (s) => String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "");
  const norm = (s) => semAcento(s).trim().replace(/\s+/g, " ").toLowerCase();
  const escRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const brl = (n) => Number(n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace(/ /g, " ");
  const soDigitos = (s) => String(s == null ? "" : s).replace(/\D/g, "");
  const ARTIGOS = ["de", "da", "do", "dos", "das", "e"];
  const titulo = (s) =>
    String(s).trim().split(/\s+/).map((w) => {
      const l = w.toLowerCase();
      return ARTIGOS.includes(l) ? l : l.charAt(0).toUpperCase() + l.slice(1);
    }).join(" ");
  function lerValor(s) {
    s = String(s == null ? "" : s).replace(/R\$/gi, "").replace(/\s/g, "");
    if (!s) return NaN;
    if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
    const n = parseFloat(s);
    return isFinite(n) ? n : NaN;
  }
  const arred = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

  const PAGAMENTOS = { pix: "Pix", credito: "Cartão de crédito", aguardando: "Aguardando pagamento" };
  const UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

  // Cores de tag: as do catálogo (produtos "Tag Personalizável") e as que já existiam no sistema antigo.
  const PALETA_TAG = [
    { nome: "Preta", hex: "#1A1714" }, { nome: "Café", hex: "#4A3222" }, { nome: "Sela", hex: "#B5835A" },
    { nome: "Fendi", hex: "#AFA28C" }, { nome: "Off White", hex: "#F0EBE1" }, { nome: "Jabuticaba", hex: "#3A1530" },
    { nome: "Vermelho Cereja", hex: "#6E1423" }, { nome: "Verde Militar", hex: "#58603C" }, { nome: "Azul Marinho", hex: "#1C2C4A" },
    { nome: "Azul Cielo", hex: "#8DB8D8" }, { nome: "Bronze", hex: "#9A6A3A" }, { nome: "Dourado", hex: "#C9A24A" },
    { nome: "Caramelo", hex: "#C68642" }, { nome: "Dourado Light", hex: "#E0C170" }, { nome: "Dourado Velho", hex: "#A6822E" },
    { nome: "Bordô", hex: "#6E1423" },
  ];
  const hexDaCor = (nome) => {
    const k = norm(nome);
    const f = PALETA_TAG.find((c) => norm(c.nome) === k);
    return f ? f.hex : "#E6DDD1";
  };
  function textoSobre(hex) {
    hex = String(hex || "#E6DDD1").replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    const r = parseInt(hex.substr(0, 2), 16) / 255, g = parseInt(hex.substr(2, 2), 16) / 255, b = parseInt(hex.substr(4, 2), 16) / 255;
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) > 0.5 ? "#2B2118" : "#FFFFFF";
  }

  // ---------- Cores: "Preto" e "Preta", "e" e "&" valem o mesmo ----------
  function chaveCor(c) {
    return norm(c)
      .replace(/\s*&\s*/g, " & ")
      .replace(/\s+e\s+/g, " & ")
      .replace(/\bpreto\b/g, "preta")
      .replace(/\bdourado\b/g, "dourada")
      .replace(/\bvermelha\b/g, "vermelho")
      .replace(/\bbordo\b/g, "vermelho cereja");
  }
  const ALIAS_COR = {
    "verde": "verde militar", "militar": "verde militar", "musgo": "verde musgo",
    "marinho": "azul marinho", "azul": "azul marinho",
    "bordo": "vermelho cereja", "cereja": "vermelho cereja", "carmim": "vermelho carmim",
    "off": "off white", "off cafe": "off white & cafe", "off sela": "off white & sela",
    "jabuticada": "jabuticaba", "multicolorida": "multicolor",
  };

  // ---------- Catálogo → itens vendáveis (um por produto + variação) ----------
  const ehTagProduto = (p) => /^tag\b/i.test(String(p.categoria || "")) || /^tag\b/i.test(String(p.nome || ""));
  function separarNome(nome) {
    const s = String(nome || "").replace(/^\s*Bolsa\s+/i, "").replace(/\s+/g, " ").trim();
    const i = s.indexOf(" - ");
    if (i !== -1) return { modelo: s.slice(0, i).trim(), cor: s.slice(i + 3).trim() };
    // "Bolsa Nina Multicolor" (sem hífen): separa a cor final quando ela é conhecida
    const palavras = s.split(" ");
    for (let n = Math.min(3, palavras.length - 1); n >= 1; n--) {
      const fim = palavras.slice(-n).join(" ");
      const k = chaveCor(fim);
      if (k === "multicolor" || ALIAS_COR[k] || PALETA_TAG.some((c) => chaveCor(c.nome) === k)) {
        return { modelo: palavras.slice(0, -n).join(" "), cor: fim };
      }
    }
    return { modelo: s, cor: "" };
  }
  function montarItens(produtos) {
    const itens = [];
    (produtos || []).forEach((p) => {
      const vars = Array.isArray(p.variacoes) && p.variacoes.length ? p.variacoes : [{ nome: "", quantidade: null }];
      const { modelo, cor } = separarNome(p.nome);
      vars.forEach((v) => {
        const variacao = String(v.nome || "").trim();
        const preco = v.preco != null && v.preco !== "" ? Number(v.preco) : p.preco == null || p.preco === "" ? null : Number(p.preco);
        const qtd = v.quantidade == null || v.quantidade === "" ? null : Number(v.quantidade);
        itens.push({
          chave: p.id + "|" + variacao,
          produto_id: p.id,
          variacao,
          nome: p.nome + (variacao ? " — " + variacao : ""),
          modelo,
          cor: cor || variacao,
          categoria: p.categoria || "",
          codigo: p.sku_bling || p.codigo || "",
          codigoSite: p.codigo || "",
          sku_bling: p.sku_bling || "",
          preco,
          qtd, // null = não controla estoque
          visivel: p.visivel !== false,
          ehTag: ehTagProduto(p),
        });
      });
    });
    return itens;
  }
  const esgotado = (it) => it.qtd != null && it.qtd <= 0;
  const estoqueTexto = (it) => (it.qtd == null ? "sem controle" : it.qtd <= 0 ? "esgotado" : it.qtd + " em estoque");

  // na busca, "preta" acha "Preto" (e "dourado"/"dourada", "vermelho"/"vermelha")
  const neutro = (s) => norm(s).replace(/\b(pret|dourad|vermelh)[oa]\b/g, "$1_");

  function buscar(itens, consulta, opcoes) {
    const o = Object.assign({ limite: 40, incluirOcultos: false, incluirTags: true }, opcoes);
    const q = neutro(consulta);
    const lista = itens.filter((it) => (o.incluirOcultos || it.visivel) && (o.incluirTags || !it.ehTag));
    if (!q) return lista.slice(0, o.limite);
    const partes = q.split(" ");
    const pontuados = [];
    lista.forEach((it) => {
      const palha = neutro([it.nome, it.codigo, it.codigoSite, it.categoria, it.modelo, it.cor, it.variacao].join(" "));
      if (!partes.every((t) => palha.includes(t))) return;
      let pts = 0;
      if (norm(it.codigo) === q || norm(it.codigoSite) === q) pts += 100;
      if (norm(it.modelo).startsWith(partes[0])) pts += 10;
      if (norm(it.nome).includes(q)) pts += 5;
      if (!esgotado(it)) pts += 20;
      pontuados.push([pts, it]);
    });
    pontuados.sort((a, b) => b[0] - a[0] || a[1].nome.localeCompare(b[1].nome, "pt-BR"));
    return pontuados.slice(0, o.limite).map((x) => x[1]);
  }

  // ---------- Venda: contas ----------
  function totais(itens, valorManual) {
    const soma = arred((itens || []).reduce((t, i) => t + Number(i.preco_unit || 0) * Number(i.quantidade || 0), 0));
    const total = valorManual != null && valorManual !== "" && !isNaN(valorManual) ? arred(valorManual) : soma;
    return { soma, total, ajustado: total !== soma };
  }
  const comissao = (total, pct) => arred((Number(total) * Number(pct)) / 100);

  // ---------- Texto para copiar ----------
  // Formato do sistema antigo (pode ser mudado em Cadastro > Formato do texto)
  const MODELO_TEXTO = [
    "Pedido {numero} - {data}",
    "Cliente: {cliente}",
    "CPF/CNPJ: {documento}",
    "Telefone: {telefone}",
    "E-mail: {email}",
    "Endereço: {endereco}",
    "Itens:",
    "{itens}",
    "Valor total: {total}",
    "Pagamento: {pagamento}",
    "Tag: {tags}",
    "Obs.: {observacao}",
  ].join("\n");
  const MODELO_ITEM = "- {codigo} | {produto} - {cor} x{qtd}";
  const marcadores = (s) => (String(s).match(/\{(\w+)\}/g) || []).map((m) => m.slice(1, -1));
  function montarTexto(v, cfg) {
    cfg = Object.assign({ modelo: MODELO_TEXTO, item: MODELO_ITEM }, cfg || {});
    const itens = (v.itens || []).map((i) => {
      const dados = {
        qtd: i.quantidade, produto: i.modelo || i.descricao, cor: i.cor || "", codigo: i.codigo || "", preco: brl(i.preco_unit),
        subtotal: brl(Number(i.preco_unit || 0) * Number(i.quantidade || 0)), tag: i.tag ? tagTexto(i.tag) : "",
      };
      const linha = String(cfg.item).replace(/\{(\w+)\}/g, (m, k) => (k in dados ? dados[k] : m));
      return linha
        .replace(/\s+/g, " ")
        .replace(/^(- )?\|\s*/, "$1") // sem código: "- | Alice" vira "- Alice"
        .replace(/\s+-\s+(x\d+)\s*$/, " $1") // sem cor: "Alice - x1" vira "Alice x1"
        .replace(/\s+-\s*$/, "")
        .trim();
    });
    const tags = [];
    (v.itens || []).forEach((i) => i.tag && tags.push(tagTexto(i.tag)));
    (v.tags_venda || []).forEach((t) => tags.push(tagTexto(t)));
    const pag = v.pagamento ? PAGAMENTOS[v.pagamento] + (v.pagamento === "credito" && v.parcelas ? " em " + v.parcelas + "x" : "") : "";
    const dados = {
      numero: v.numero ? "#" + v.numero : "", cliente: v.cliente_nome || "", telefone: (v.cliente || {}).telefone || "",
      documento: (v.cliente || {}).documento || "", email: (v.cliente || {}).email || "",
      endereco: enderecoLinha(v.cliente || {}), itens: itens.join("\n"), tags: tags.join(", "), total: v.valor_total != null ? brl(v.valor_total) : "",
      pagamento: pag, parcelas: v.parcelas || "", observacao: v.observacao || "", data: v.data || "",
    };
    const saida = [];
    String(cfg.modelo).split("\n").forEach((linha) => {
      const ms = marcadores(linha);
      if (ms.length && ms.every((k) => !String(dados[k] == null ? "" : dados[k]).trim())) return;
      saida.push(linha.replace(/\{(\w+)\}/g, (m, k) => (k in dados ? dados[k] : m)));
    });
    return saida.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }
  const tagTexto = (t) => [t.iniciais ? String(t.iniciais).toUpperCase() : "sem iniciais", t.cor ? "(" + t.cor + ")" : ""].filter(Boolean).join(" ");
  function enderecoLinha(i) {
    const p = [];
    if (i.rua) p.push(i.rua + (i.numero ? ", " + i.numero : "") + (i.complemento ? " - " + i.complemento : ""));
    if (i.bairro) p.push(i.bairro);
    const cu = [i.cidade, i.uf].filter(Boolean).join("/");
    if (cu) p.push(cu);
    if (i.cep) p.push("CEP " + i.cep);
    return p.join(" · ");
  }

  // ---------- Planilha de vendas (para o Bling) ----------
  // Valor de cada unidade: preço cadastrado ajustado proporcionalmente ao total cobrado.
  // Como cada unidade só tem centavos, sobra às vezes 1 ou 2 centavos: ela vai para um item de
  // quantidade 1 (assim a soma fecha) ou, se não houver, sai separada em "ajuste".
  function ratear(venda) {
    const itens = venda.itens || [];
    const soma = itens.reduce((t, i) => t + Number(i.preco_unit || 0) * i.quantidade, 0);
    const qtdTotal = itens.reduce((t, i) => t + i.quantidade, 0) || 1;
    const unit = itens.map((i) => arred(soma > 0 ? (Number(i.preco_unit || 0) * Number(venda.valor_total)) / soma : Number(venda.valor_total) / qtdTotal));
    let resto = arred(Number(venda.valor_total) - itens.reduce((t, i, k) => t + unit[k] * i.quantidade, 0));
    if (resto !== 0) {
      let alvo = -1;
      itens.forEach((i, k) => { if (i.quantidade === 1 && (alvo === -1 || unit[k] > unit[alvo])) alvo = k; });
      if (alvo !== -1) { unit[alvo] = arred(unit[alvo] + resto); resto = 0; }
    }
    return { unit, ajuste: resto };
  }
  const csvNum = (n) => (n == null || n === "" || isNaN(n) ? "" : Number(n).toFixed(2).replace(".", ","));
  const dataBR = (iso) => {
    const d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  };
  function csvVendas(vendas, clientes) {
    const mapa = new Map((clientes || []).map((c) => [c.id, c]));
    const linhas = [[
      "Número do pedido", "Data", "Cliente", "CPF/CNPJ", "E-mail", "Telefone", "CEP", "Endereço", "Número", "Complemento", "Bairro", "Cidade", "UF",
      "Código (SKU)", "Descrição", "Quantidade", "Valor unitário", "Total do pedido", "Forma de pagamento", "Parcelas", "Situação do pagamento",
      "Comissão %", "Comissão R$", "Observações", "Ajuste de centavos",
    ]];
    vendas.forEach((v) => {
      const c = mapa.get(v.cliente_id) || {};
      const { unit: un, ajuste } = ratear(v);
      (v.itens || []).forEach((i, k) => {
        const p = k === 0;
        linhas.push([
          v.numero_legado || v.numero, dataBR(v.criado_em), v.cliente_nome, c.documento || "", c.email || "", c.telefone || "", c.cep || "", c.rua || "",
          c.numero || "", c.complemento || "", c.bairro || "", c.cidade || "", c.uf || "", i.codigo || "", i.descricao, i.quantidade, csvNum(un[k]),
          p ? csvNum(v.valor_total) : "", p ? PAGAMENTOS[v.pagamento] : "", p ? v.parcelas || "" : "", p ? (v.pagamento === "aguardando" ? "Aguardando pagamento" : "Pago") : "",
          p ? v.comissao_pct : "", p ? csvNum(v.comissao_valor) : "", p ? v.observacao || "" : "", p && ajuste ? csvNum(ajuste) : "",
        ]);
      });
    });
    return linhas;
  }
  function paraCsv(linhas) {
    const cel = (x) => {
      const s = String(x == null ? "" : x);
      return /[;"\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    return "﻿" + linhas.map((l) => l.map(cel).join(";")).join("\r\n");
  }

  // ---------- Leitura do texto da live ----------
  function criarLeitor(ctx) {
    const itensEstoque = ctx.itens.filter((i) => !i.ehTag);
    const tagProdutos = ctx.itens.filter((i) => i.ehTag);

    // Léxico de cores: as do catálogo + as palavras que ela costuma usar
    const mapaCor = {}; // texto normalizado → nome para mostrar
    const chaveParaNome = {};
    const registrar = (nome) => {
      const k = chaveCor(nome);
      if (!chaveParaNome[k]) chaveParaNome[k] = nome;
      return k;
    };
    itensEstoque.forEach((i) => i.cor && registrar(i.cor));
    tagProdutos.forEach((i) => i.cor && registrar(i.cor));
    PALETA_TAG.forEach((c) => registrar(c.nome));
    const variantes = (k) => {
      const out = new Set([k]);
      if (k.includes(" & ")) out.add(k.replace(/ & /g, " e "));
      [...out].forEach((v) => {
        if (/\bpreta\b/.test(v)) out.add(v.replace(/\bpreta\b/g, "preto"));
        if (/\bdourada\b/.test(v)) out.add(v.replace(/\bdourada\b/g, "dourado"));
        if (/\bvermelho\b/.test(v)) out.add(v.replace(/\bvermelho\b/g, "vermelha"));
      });
      return [...out];
    };
    Object.keys(chaveParaNome).forEach((k) => variantes(k).forEach((v) => { mapaCor[v] = chaveParaNome[k]; }));
    Object.keys(ALIAS_COR).forEach((a) => {
      const k = chaveCor(ALIAS_COR[a]);
      const nome = chaveParaNome[k] || titulo(ALIAS_COR[a]);
      variantes(chaveCor(a)).forEach((v) => { if (!mapaCor[v]) mapaCor[v] = nome; });
      variantes(norm(a)).forEach((v) => { if (!mapaCor[v]) mapaCor[v] = nome; });
    });

    function acharCor(texto) {
      const t = norm(texto);
      let melhor = null;
      Object.keys(mapaCor).sort((a, b) => b.length - a.length).forEach((k) => {
        const m = new RegExp("(^|[^a-z0-9])(" + escRe(k) + ")(?=$|[^a-z0-9])").exec(t);
        if (!m) return;
        const ini = m.index + m[1].length, fim = ini + k.length;
        if (!melhor || ini < melhor.ini || (ini === melhor.ini && fim > melhor.fim)) melhor = { cor: mapaCor[k], ini, fim };
      });
      return melhor;
    }

    // Léxico de modelos (nome completo, primeira ou última palavra quando não ambígua)
    const nomes = {};
    itensEstoque.forEach((i) => { if (i.modelo) nomes[norm(i.modelo)] = i.modelo; });
    const lexModelo = { mapa: {}, ambiguos: [] };
    (function () {
      const ks = Object.keys(nomes), primeira = {}, ultima = {};
      ks.forEach((k) => {
        lexModelo.mapa[k] = nomes[k];
        const w = k.split(" ");
        primeira[w[0]] = (primeira[w[0]] || 0) + 1;
        ultima[w[w.length - 1]] = (ultima[w[w.length - 1]] || 0) + 1;
      });
      ks.forEach((k) => {
        const w = k.split(" ");
        if (w.length < 2) return;
        if (primeira[w[0]] === 1 && w[0].length >= 3 && !lexModelo.mapa[w[0]]) lexModelo.mapa[w[0]] = nomes[k];
        const l = w[w.length - 1];
        if (ultima[l] === 1 && l.length >= 3 && !lexModelo.mapa[l]) lexModelo.mapa[l] = nomes[k];
      });
      lexModelo.ambiguos = Object.keys(primeira).filter((w) => primeira[w] > 1 && w.length >= 3);
    })();

    function detectarItens(texto) {
      const t = norm(texto), hits = [];
      Object.keys(lexModelo.mapa).sort((a, b) => b.length - a.length).forEach((k) => {
        const re = new RegExp("(^|[^a-z0-9])(" + escRe(k) + ")(?=$|[^a-z0-9])", "g");
        let m;
        while ((m = re.exec(t))) {
          const s = m.index + m[1].length, e = s + k.length;
          if (hits.some((h) => s < h.fim && e > h.ini)) continue;
          hits.push({ produto: lexModelo.mapa[k], ini: s, fim: e });
        }
      });
      hits.sort((a, b) => a.ini - b.ini);
      const itens = hits.map((h, i) => {
        const proximo = i + 1 < hits.length ? hits[i + 1].ini : t.length, anterior = i > 0 ? hits[i - 1].fim : 0;
        const depois = t.slice(h.fim, proximo), antes = t.slice(anterior, h.ini);
        const c = acharCor(depois);
        let cor = c ? c.cor : "";
        if (!cor && i === 0) { const cb = acharCor(antes); cor = cb ? cb.cor : ""; }
        let qtd = 1;
        const qm = antes.slice(-18).match(/(\d{1,2})\s*(?:x\s*)?(?:bolsas?|mochilas?|unidades?|un)?\s*(?:da|de|do)?\s*$/);
        if (qm) qtd = parseInt(qm[1], 10) || 1;
        else { const qa = depois.match(/\bx\s*(\d{1,2})\b/); if (qa) qtd = parseInt(qa[1], 10) || 1; }
        return { produto: h.produto, cor, qtd };
      });
      const ambiguos = lexModelo.ambiguos.filter((w) =>
        new RegExp("(^|[^a-z0-9])" + escRe(w) + "(?=$|[^a-z0-9])").test(t) && !itens.some((it) => norm(it.produto).indexOf(w) === 0));
      return { itens, ambiguos };
    }

    const ROTULOS = [
      ["nome", /^(?:nome(?: completo)?|cliente|nome da cliente)$/], ["documento", /^(?:cpf(?: ?\/ ?cnpj)?|cnpj|documento)$/],
      ["telefone", /^(?:telefone|tel|celular|whats(?:app)?|zap|fone|contato|telefone ?\/ ?whats(?:app)?)$/], ["email", /^e-?mail$/], ["cep", /^cep$/],
      ["rua", /^(?:endereco|end|rua|avenida|logradouro)$/], ["numero", /^(?:numero|num|n|no)$/], ["complemento", /^(?:complemento|comp|apto|apartamento|bloco)$/],
      ["bairro", /^bairro$/], ["cidade", /^cidade$/], ["uf", /^(?:uf|estado)$/],
      ["produto", /^(?:produto|produtos|bolsa|modelo|item|itens|pedido|compra|comprou)$/], ["cor", /^(?:cor|cor da bolsa|cor do produto)$/],
      ["qtd", /^(?:quantidade|qtd|qtde)$/],
      ["tagCor", /^(?:cor da tag|cor tag|cor da tag personalizada|tag - cor|tag cor)$/],
      ["tagIniciais", /^(?:tag|tags|iniciais|inicial|iniciais da tag|tag personalizada|letras|tag - iniciais)$/],
      ["pagamento", /^(?:pagamento|forma de pagamento|forma|pagar|pago)$/], ["valor", /^(?:valor|total|preco|valor total)$/],
      ["parcelas", /^(?:parcelas|parcelamento)$/], ["obs", /^(?:obs|observacao|observacoes)$/],
    ];
    const chaveRotulo = (r) => {
      const n = norm(r).replace(/\s*-\s*/g, " - ");
      for (const [k, re] of ROTULOS) if (re.test(n)) return k;
      return null;
    };

    function lerTagTrecho(seg) {
      const s = String(seg).replace(/\b([A-ZÀ-Ú])\.\s*/g, "$1");
      const c = acharCor(s);
      let cor = c ? c.cor : "";
      let resto = s.replace(/\b(tags?|iniciais|inicial|personalizada|personalizado|cor|letras?|quero|com|as|na|no|da|de|do)\b/gi, " ");
      if (c) {
        Object.keys(mapaCor).sort((a, b) => b.length - a.length).forEach((k) => {
          resto = resto.replace(new RegExp("(^|[^A-Za-zÀ-ú])" + escRe(k).replace(/ /g, "\\s+") + "(?=$|[^A-Za-zÀ-ú])", "i"), " ");
        });
      }
      const maius = (resto.match(/\b[A-ZÀ-Ú]{1,5}\b/g) || []).filter((w) => !mapaCor[norm(w)]);
      let iniciais = "";
      if (maius.length) iniciais = maius.every((w) => w.length === 1) ? maius.join("") : maius[0];
      else {
        const toks = norm(resto).split(/[^a-z]+/).filter(Boolean).filter((w) => !["a", "o", "e", "os", "as", "para", "minha", "meu", "bolsa"].includes(w));
        const sing = toks.filter((w) => w.length === 1);
        if (sing.length >= 2 && sing.length === toks.length) iniciais = sing.join("");
        else { const tk = toks.find((w) => w.length <= 5); iniciais = tk || ""; }
      }
      return { iniciais: iniciais.toUpperCase(), cor };
    }
    function lerTags(texto, soltas) {
      const out = [];
      String(texto).split(/;|,|\s\+\s|\s e (?=[A-ZÀ-Ú]{1,5}\b)/).forEach((seg) => {
        const t = lerTagTrecho(seg);
        if (t.iniciais) out.push(t); else if (t.cor && soltas) soltas.push(t.cor);
      });
      return out;
    }

    const soPagamento = (linha) => {
      const n = norm(linha);
      if (!/pix|cartao|credito|parcel|aguardando|debito|\bpago\b|vezes|\d\s*x\b/.test(n)) return false;
      const resto = n.replace(/\d+\s*x\b/g, " ").replace(/\b(pago|pagar|pagamento|forma|no|na|em|de|o|a|via|cartao|credito|debito|pix|parcelado|parcelas?|vezes|x|vista|aguardando|depois|link|vou|fazer|por)\b/g, " ").replace(/[\d\s.,!:;-]+/g, "");
      return resto === "";
    };
    function detectarPagamento(texto) {
      const t = norm(texto), out = { pagamento: "", parcelas: null, naoSuportado: "" };
      if (/\bpix\b/.test(t)) out.pagamento = "pix";
      else if (/credito|cartao|parcel|\b\d{1,2}\s*(?:x|vezes)\b/.test(t)) {
        out.pagamento = "credito";
        const m = t.match(/(\d{1,2})\s*(?:x|vezes)/);
        out.parcelas = m ? Math.min(6, Math.max(1, parseInt(m[1], 10))) : 1;
      } else if (/aguardando|pendente|depois|mais tarde|link/.test(t)) out.pagamento = "aguardando";
      else { const u = t.match(/debito|dinheiro|boleto|transferencia/); if (u) out.naoSuportado = u[0]; }
      return out;
    }
    const pareceNome = (linha) => {
      const s = linha.trim();
      if (s.length < 5 || s.length > 60 || /\d/.test(s) || !/^[A-Za-zÀ-ÿ'’.\- ]+$/.test(s)) return false;
      if (s.split(/\s+/).length < 2) return false;
      if (/\b(pix|cartao|credito|tag|cpf|cnpj|rua|avenida|bolsa|mochila|obrigad|bom dia|boa tarde|boa noite|ola|cep|bairro|cidade|pagamento|produto|cor)\b/.test(norm(s))) return false;
      if (detectarItens(s).itens.length || acharCor(s)) return false;
      return true;
    };

    function lerCauda(texto) {
      const out = {};
      const toks = String(texto).split(/\s*[,;–—]\s*|\s+-\s+/).map((s) => s.trim()).filter(Boolean);
      if (!toks.length) return { out, resto: "" };
      const ult = toks[toks.length - 1];
      let m;
      if (/^[A-Za-z]{2}$/.test(ult) && UFS.includes(ult.toUpperCase())) {
        out.uf = ult.toUpperCase(); toks.pop();
        if (toks.length) out.cidade = toks.pop();
      } else if ((m = ult.match(/^(.+?)\s*\/\s*([A-Za-z]{2})$/)) && UFS.includes(m[2].toUpperCase())) {
        out.cidade = m[1].trim(); out.uf = m[2].toUpperCase(); toks.pop();
      }
      const resto = [];
      toks.forEach((t) => {
        if (/^(apto|ap|apartamento|bloco|casa|fundos|sala|conj|conjunto|loja)\b/i.test(t)) out.complemento = out.complemento ? out.complemento + ", " + t : t;
        else resto.push(t);
      });
      if (out.cidade && resto.length) out.bairro = resto.pop();
      return { out, resto: resto.join(", ") };
    }
    function extrairCliente(textos) {
      const achou = {}, sobras = [], vistos = {};
      textos.forEach((t) => {
        let r = String(t || ""), m;
        if (!achou.email && (m = r.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/))) { achou.email = m[0]; r = r.replace(m[0], " "); }
        if (!achou.documento && (m = r.match(/\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/) || r.match(/cnpj\D{0,4}(\d{14})\b/i))) { achou.documento = m[1] || m[0]; r = r.replace(m[0], " "); }
        if (!achou.documento && (m = r.match(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/) || r.match(/cpf\D{0,4}(\d{11})\b/i))) { achou.documento = m[1] || m[0]; r = r.replace(m[0], " "); }
        if (!achou.cep && (m = r.match(/\b\d{5}-\d{3}\b/) || r.match(/cep\D{0,4}(\d{8})\b/i))) { achou.cep = m[1] || m[0]; r = r.replace(m[0], " "); }
        if (!achou.telefone && (m = r.match(/(?:\+?55\s?)?\(?\d{2}\)?[\s.-]?9?\d{4}[\s.-]?\d{4}\b/))) { achou.telefone = m[0].trim(); r = r.replace(m[0], " "); }
        if (!achou.rua && (m = r.match(/\b((?:rua|r\.|av\.?|avenida|travessa|tv\.?|alameda|al\.?|estrada|rodovia|pra[cç]a)\s+[^,\n\d]+?)\s*,?\s*(?:n[º°o.]*\s*)?(\d{1,6})\b/i))) { achou.rua = m[1].trim(); achou.numero = m[2]; r = r.replace(m[0], " "); }
        r = r.replace(/\b(cpf|cnpj|cep|tel(?:efone)?|cel(?:ular)?|whats(?:app)?|e-?mail|endere[cç]o)\b\s*[:\-]?/gi, " ")
          .replace(/[ \t]+/g, " ").replace(/(?:\s*[-–—,;|]\s*){2,}/g, ", ").replace(/^[\s,;.\-–—|]+|[\s,;.\-–—|]+$/g, "").trim();
        if (r && !vistos[norm(r)]) { vistos[norm(r)] = true; sobras.push(r); }
      });
      return { achou, sobra: sobras.join("\n") };
    }

    function lerBloco(textoBloco, remetente) {
      const d = { nome: "", info: {}, itens: [], tags: [], pagamento: "", parcelas: null, valor: null, obs: "", problemas: [], bruto: textoBloco, naoSuportado: "" };
      const rot = {}, livres = [];
      textoBloco.split(/\r?\n/).forEach((linha) => {
        linha = linha.replace(/^[\s\-•*]+/, "").trim();
        if (!linha) return;
        const m = linha.match(/^([^:=]{1,32}?)\s*[:=]\s*(.+)$/), k = m ? chaveRotulo(m[1]) : null;
        if (k) rot[k] = rot[k] ? rot[k] + "; " + m[2].trim() : m[2].trim();
        else livres.push(linha);
      });

      let sobra = [];
      const tagTextos = [], soltas = [];
      livres.forEach((l) => { if (/\btags?\b|\binicia/i.test(l)) tagTextos.push(l); else sobra.push(l); });
      if (rot.tagIniciais) tagTextos.unshift(rot.tagIniciais);
      tagTextos.forEach((t) => { d.tags = d.tags.concat(lerTags(t, soltas)); });
      if (rot.tagCor) {
        const cores = [];
        let resto = rot.tagCor, c;
        while ((c = acharCor(resto))) { cores.push(c.cor); resto = norm(resto).slice(c.fim); }
        let ci = 0;
        d.tags.forEach((t) => { if (!t.cor && cores[ci]) t.cor = cores[ci++]; });
        if (!d.tags.length && cores.length) d.problemas.push({ bloqueia: true, texto: "Tem a cor da tag (" + cores.join(", ") + ") mas faltam as iniciais." });
      }

      const textoPag = (rot.pagamento || "") + " " + sobra.filter((l) => /pix|credito|cr[eé]dito|cart[aã]o|parcel|aguardando|pendente|d[eé]bito|dinheiro|boleto|transfer/i.test(l)).join(" ");
      const pag = detectarPagamento(textoPag);
      if (rot.parcelas) { const im = rot.parcelas.match(/\d+/); if (im) { pag.parcelas = Math.min(6, Math.max(1, parseInt(im[0], 10))); if (!pag.pagamento) pag.pagamento = "credito"; } }
      d.pagamento = pag.pagamento; d.parcelas = pag.parcelas; d.naoSuportado = pag.naoSuportado;
      sobra = sobra.filter((l) => !soPagamento(l) && !/^(?:pix|cart[aã]o.*|cr[eé]dito.*|aguardando.*|pagamento.*)$/i.test(l.trim()));

      const textoProd = [rot.produto || "", rot.cor || ""].join(" ");
      const det = rot.produto ? detectarItens(textoProd) : { itens: [], ambiguos: [] };
      let itens = det.itens, ambiguos = det.ambiguos;
      if (!itens.length) {
        const resto2 = [];
        sobra.forEach((l) => {
          const r = detectarItens(l);
          if (r.itens.length) itens = itens.concat(r.itens); else resto2.push(l);
          ambiguos = ambiguos.concat(r.ambiguos);
        });
        sobra = resto2;
      }
      if (!itens.length && rot.produto) {
        const cc = acharCor(rot.produto);
        const nome = cc ? norm(rot.produto).slice(0, cc.ini).trim() : rot.produto;
        itens = [{ produto: titulo(nome || rot.produto), cor: cc ? cc.cor : "", qtd: 1 }];
      }
      if (rot.cor && itens.length) { const lc = acharCor(rot.cor); itens.forEach((it) => { if (!it.cor && lc) it.cor = lc.cor; }); }
      if (rot.qtd && itens.length === 1) { const qn = parseInt(rot.qtd, 10); if (qn >= 1) itens[0].qtd = qn; }
      const pool = soltas.slice();
      sobra.forEach((l) => { const sc = acharCor(l); if (sc && sc.ini === 0 && sc.fim === norm(l).length) pool.push(sc.cor); });
      itens.forEach((it) => { if (!it.cor && pool.length) it.cor = pool.shift(); });
      d.itens = itens;
      ambiguos.forEach((w) => d.problemas.push({ bloqueia: true, texto: 'Qual produto? "' + w + '" tem mais de um modelo no estoque.' }));

      const valores = [];
      ((rot.valor || "") + "\n" + livres.join("\n")).replace(/R\$\s*([\d.]+,\d{2}|\d+(?:[.,]\d{1,2})?)/gi, (todo, n) => { const v = lerValor(n); if (!isNaN(v)) valores.push(v); return todo; });
      if (rot.valor && !isNaN(lerValor(rot.valor))) d.valor = lerValor(rot.valor);
      else if (valores.length) d.valor = Math.max.apply(null, valores);
      if (d.valor == null) {
        const vm = textoBloco.match(/(?:valor|total)\s*(?:de|é|:)?\s*(?:R\$)?\s*([\d.]+,\d{2}|\d+)/i);
        if (vm && !isNaN(lerValor(vm[1]))) d.valor = lerValor(vm[1]);
      }

      const infoTextos = [];
      ["documento", "telefone", "email", "cep"].forEach((k) => { if (rot[k]) infoTextos.push(rot[k]); });
      if (rot.rua) infoTextos.push(rot.rua);
      const ex = extrairCliente(infoTextos.concat(sobra.filter((l) => l !== (rot.nome || ""))));
      Object.keys(ex.achou).forEach((k) => { d.info[k] = ex.achou[k]; });
      ["numero", "complemento", "bairro", "cidade", "uf"].forEach((k) => { if (rot[k]) d.info[k] = rot[k]; });
      ["documento", "telefone", "email", "cep"].forEach((k) => { if (rot[k]) d.info[k] = rot[k]; });
      const manter = [];
      (ex.sobra ? ex.sobra.split("\n") : []).forEach((l) => {
        const cauda = lerCauda(l);
        if (cauda.out.uf || cauda.out.complemento) {
          Object.keys(cauda.out).forEach((k) => { if (!d.info[k]) d.info[k] = cauda.out[k]; });
          if (cauda.resto) manter.push(cauda.resto);
        } else manter.push(l);
      });
      if (d.info.rua && !d.info.numero) { const nm = d.info.rua.match(/^(.*?)[\s,]+(\d{1,6})$/); if (nm) { d.info.rua = nm[1]; d.info.numero = nm[2]; } }

      d.nome = rot.nome ? titulo(rot.nome) : "";
      if (!d.nome) { const idx = manter.findIndex(pareceNome); if (idx !== -1) { d.nome = titulo(manter[idx]); manter.splice(idx, 1); } }
      if (!d.nome && remetente) d.nome = titulo(remetente);
      const lixo = /^(?:oi|ola|olá|bom dia|boa tarde|boa noite|obrigad[ao]|ok|combinado|quero|esse|essa|por favor)\b/i;
      d.obs = ((rot.obs ? rot.obs + ". " : "") + manter.filter((l) => l.length >= 4 && !lixo.test(l)).join(". ")).slice(0, 500);
      return d;
    }

    // Procura o produto do catálogo para (modelo, cor)
    function acharItem(modelo, cor) {
      const m = norm(modelo), c = chaveCor(cor);
      if (!m || !norm(cor)) return null;
      return itensEstoque.find((i) => norm(i.modelo) === m && chaveCor(i.cor) === c) || null;
    }
    const itensDoModelo = (modelo) => itensEstoque.filter((i) => norm(i.modelo) === norm(modelo));
    const corDaTag = (nome) => {
      const k = chaveCor(nome);
      const f = PALETA_TAG.find((c) => chaveCor(c.nome) === k);
      return f ? f.nome : "";
    };

    // Junta tudo: itens do catálogo + tag de cada item + o que falta conferir
    function avaliar(d) {
      const bloqueios = d.problemas.filter((p) => p.bloqueia).map((p) => p.texto);
      const avisos = d.problemas.filter((p) => !p.bloqueia).map((p) => p.texto);
      if (!d.nome) bloqueios.push("Sem nome da cliente.");
      if (!d.itens.length && !d.tags.length) bloqueios.push("Nada para lançar: não achei produto nem tag.");
      const precisa = {};
      d.linhas = d.itens.map((it) => {
        const linha = { produto: it.produto, cor: it.cor, qtd: it.qtd, item: null, tag: null };
        if (itensDoModelo(it.produto).length) {
          if (!it.cor) bloqueios.push("Falta a cor de " + it.produto + ".");
          else {
            const ach = acharItem(it.produto, it.cor);
            if (!ach) bloqueios.push('A cor "' + it.cor + '" não existe no estoque de ' + it.produto + ".");
            else {
              linha.item = ach;
              linha.cor = ach.cor;
              const k = ach.chave;
              precisa[k] = { ach, qtd: (precisa[k] ? precisa[k].qtd : 0) + it.qtd };
            }
          }
        } else avisos.push((it.produto || "Produto") + " fora do catálogo: não desconta nada.");
        return linha;
      });
      Object.keys(precisa).forEach((k) => {
        const n = precisa[k];
        if (n.ach.qtd != null && n.qtd > n.ach.qtd) bloqueios.push("Estoque insuficiente: restam " + n.ach.qtd + " de " + n.ach.nome + ".");
      });
      // tags: a 1ª tag vai no 1º item, a 2ª no 2º... o que sobrar vai como tag da venda
      const tagsVenda = [];
      d.tags.forEach((t, k) => {
        const cor = t.cor ? corDaTag(t.cor) || t.cor : "";
        const tag = { iniciais: t.iniciais, cor };
        if (!cor) bloqueios.push("Falta a cor da tag " + t.iniciais + ".");
        if (d.linhas[k]) d.linhas[k].tag = tag; else tagsVenda.push(Object.assign({ origem: d.linhas.length ? "brinde" : "avulsa" }, tag));
      });
      d.tagsVenda = tagsVenda;
      if (d.tags.length > d.linhas.length && d.linhas.length) avisos.push("Há mais tags que produtos: as extras ficam como tag da venda. Confira.");
      if (d.tags.length && d.linhas.length > 1 && d.tags.length < d.linhas.length) avisos.push("Tag colocada nos primeiros produtos. Confira em Revisar.");

      const soma = arred(d.linhas.reduce((t, l) => t + (l.item && l.item.preco != null ? l.item.preco * l.qtd : 0), 0));
      const todosComPreco = d.linhas.length && d.linhas.every((l) => l.item && l.item.preco != null);
      let valor = d.valor;
      d.valorOrigem = "informado";
      if (d.linhas.length && (valor == null || isNaN(valor))) {
        if (todosComPreco && soma > 0) { valor = soma; d.valorOrigem = "soma dos preços do catálogo"; }
        else bloqueios.push("Falta o valor da venda.");
      }
      d.valorFinal = valor;
      if (d.linhas.length) {
        if (!d.pagamento) avisos.push(d.naoSuportado ? 'Pagamento "' + d.naoSuportado + '" não existe no sistema: ficará aguardando pagamento.' : "Pagamento não informado: ficará aguardando pagamento.");
        if (valor != null && !isNaN(valor) && valor >= ctx.tagMin && !d.tags.length) avisos.push("Compra acima de " + brl(ctx.tagMin) + " sem tag: pode cadastrar as iniciais depois (a tag é opcional).");
      }
      d.bloqueios = bloqueios; d.avisos = avisos; d.pronta = bloqueios.length === 0;
      return d;
    }

    const PADROES_WA = [
      /^\[(\d{1,2}:\d{2}(?::\d{2})?),?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})\]\s*([^:]{1,40}):\s*(.*)$/,
      /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s*(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^:]{1,40}):\s*(.*)$/,
      /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s*(\d{1,2}:\d{2})(?::\d{2})?\s*[-–]\s*([^:]{1,40}):\s*(.*)$/,
    ];
    const prefixoWA = (linha) => {
      for (const re of PADROES_WA) { const m = linha.match(re); if (m) return { remetente: m[3].trim(), texto: m[4] }; }
      return null;
    };
    function dividirBlocos(texto) {
      const linhas = texto.replace(/\r/g, "").split("\n");
      if (linhas.some((l) => prefixoWA(l))) {
        const grupos = [];
        let cur = null;
        linhas.forEach((l) => {
          const p = prefixoWA(l);
          if (p) { if (!cur || cur.remetente !== p.remetente) { cur = { remetente: p.remetente, linhas: [] }; grupos.push(cur); } cur.linhas.push(p.texto); }
          else if (cur) cur.linhas.push(l);
        });
        return grupos.map((g) => ({ texto: g.linhas.join("\n"), remetente: g.remetente }));
      }
      if (linhas.some((l) => /^\s*[-=_*]{3,}\s*$/.test(l))) return texto.split(/^\s*[-=_*]{3,}\s*$/m).map((b) => ({ texto: b, remetente: "" }));
      const nomes = [];
      linhas.forEach((l, i) => { if (/^\s*(?:nome(?: completo)?|cliente)\s*[:=]/i.test(semAcento(l))) nomes.push(i); });
      if (nomes.length >= 2) return nomes.map((ini, k) => ({ texto: linhas.slice(ini, k + 1 < nomes.length ? nomes[k + 1] : linhas.length).join("\n"), remetente: "" }));
      const blocos = [];
      let cur2 = [];
      linhas.forEach((l) => { if (!l.trim()) { if (cur2.length) { blocos.push(cur2.join("\n")); cur2 = []; } } else cur2.push(l); });
      if (cur2.length) blocos.push(cur2.join("\n"));
      return blocos.map((b) => ({ texto: b, remetente: "" }));
    }

    function lerLive(texto) {
      const lidos = dividirBlocos(texto).filter((b) => b.texto.trim()).map((b) => lerBloco(b.texto, b.remetente));
      const juntos = [];
      lidos.forEach((d) => {
        const temDados = d.itens.length || d.tags.length || Object.keys(d.info).length || d.problemas.length;
        if (!temDados) { const prev = juntos[juntos.length - 1]; if (prev && d.valor != null && prev.valor == null) prev.valor = d.valor; return; }
        if (!d.nome && juntos.length) juntos[juntos.length - 1] = lerBloco(juntos[juntos.length - 1].bruto + "\n" + d.bruto, "");
        else juntos.push(d);
      });
      return juntos.map(avaliar);
    }

    return { lerLive, lerBloco, avaliar, acharItem, mapaCor };
  }

  return {
    norm, brl, lerValor, arred, titulo, soDigitos, escRe, PAGAMENTOS, UFS, PALETA_TAG, hexDaCor, textoSobre, chaveCor,
    montarItens, buscar, esgotado, estoqueTexto, totais, comissao, MODELO_TEXTO, MODELO_ITEM, montarTexto, enderecoLinha,
    ratear, csvVendas, paraCsv, dataBR, criarLeitor, separarNome, ehTagProduto,
  };
})();
