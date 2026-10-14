// Leitor de listas de estoque (texto copiado de PDF, planilha ou WhatsApp).
// Para cada linha, descobre qual produto do catálogo é e qual a quantidade.
// Regra de ouro: na dúvida, não chuta — a linha vai para "não entendi".
(function (raiz) {
  // Palavras que não ajudam a identificar a peça
  const VAZIAS = new Set(["bolsa", "bolsas", "porta", "celular", "personalizavel", "personalizaveis", "personalizada", "mochila", "mochilas",
    "de", "da", "do", "das", "dos", "e", "com", "em", "a", "o", "cor", "modelo", "couro", "legitimo"]);
  // Jeitos comuns de escrever (já sem acento e em minúsculas)
  const SINONIMOS = { vm: "vermelho", verm: "vermelho", vd: "verde", az: "azul", pto: "preto", off: "offwhite", ofwhite: "offwhite",
    grande: "g", gde: "g", grd: "g", media: "m", medio: "m", pequena: "p", pequeno: "p", peq: "p" };
  // Cor "genérica" seguida da específica: "Vermelho Cereja" também pode vir só como "cereja" ou só como "vermelha"
  const GENERICAS = new Set(["vermelh", "verde", "azul"]);
  // Cabeçalhos de tabela ("Produto  Cor  Qtd")
  const CABECALHO = new Set(["produt", "descrica", "descricao", "item", "iten", "cor", "core", "qtd", "qtde", "quant", "quantidade", "estoque", "saldo", "codig", "cod", "sku", "prec", "valor", "unitari", "un", "modelo", "referencia", "ref"]);
  // Linhas que nunca são produto
  const IGNORAR = /\b(total|subtotal|soma|pagina|relatorio|emitido|impresso)\b|\bdata\s*:/i;

  const semAcento = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "");

  // Texto → palavras comparáveis
  function normalizar(s) {
    return semAcento(s).toLowerCase()
      .replace(/&/g, " ")
      .replace(/mouse\s*-?\s*pad/g, "mousepad")
      .replace(/off\s*-?\s*white/g, "offwhite")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }
  // "preta"/"preto"/"pretas" → "pret"; "tags" → "tag"; mantém letras de tamanho (P, M, G) e números
  function radical(t) {
    if (/^\d+$/.test(t) || t.length <= 2) return t;
    if (t.length >= 4 && t.endsWith("s")) t = t.slice(0, -1);
    if (t.length > 3 && /[ao]$/.test(t)) t = t.slice(0, -1);
    return t;
  }
  const palavras = (s) => normalizar(s).split(" ")
    .map((t) => SINONIMOS[t] || t)
    .filter((t) => t && !VAZIAS.has(t))
    .flatMap((t) => normalizar(t).split(" ")) // sinônimo pode virar mais de uma palavra
    .map(radical);

  function distancia(a, b) {
    if (Math.abs(a.length - b.length) > 1) return 9;
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }

  // Compara uma palavra do produto com uma da linha (2 = igual, 1 = parecida, 0 = não)
  function combina(doProduto, daLinha, modelo) {
    if (doProduto === daLinha) return 2;
    const minimo = modelo ? 5 : 4; // nome de modelo exige mais letras para aceitar erro de digitação
    if (doProduto.length >= minimo && daLinha.length >= minimo && distancia(doProduto, daLinha) <= 1) return 1;
    // abreviação de cor ("marin" → marinho); nome de modelo não aceita abreviação
    if (!modelo && daLinha.length >= 3 && doProduto.length > daLinha.length && doProduto.startsWith(daLinha)) return 1;
    return 0;
  }

  // Remove da linha o que é número mas não é quantidade
  function limparNumeros(linha) {
    return linha
      .replace(/r\$\s*[\d.]+(,\d{1,2})?/gi, " ")             // preços com R$
      .replace(/\b\d{1,3}(\.\d{3})*,\d{2}\b/g, " ")          // 1.234,56
      .replace(/\b\d+\.\d{2}\b/g, " ")                       // 489.90
      .replace(/\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b/g, " ")     // datas
      .replace(/\b\d+([.,]\d+)?(\s*x\s*\d+([.,]\d+)?){1,2}\s*(cm|mm)?\b/gi, " ") // dimensões (22 x 18 cm)
      .replace(/\b\d+([.,]\d+)?\s*(cm|mm)\b/gi, " ")         // medidas
      .replace(/\b\d+([.,]\d+)?(kg|g)\b/gi, " ")             // peso (450g)
      // códigos com letras e números (BLSP08), mas não "x2", "2x", "2un", "3pcs"
      .replace(/\b(?=[\w-]*[a-z])(?=[\w-]*\d)[\w-]+\b/gi, (m) =>
        /^(x\d+|\d+x|\d+(un|und|unid|pc|pcs|pç|pçs))$/i.test(m) ? m.replace(/(\d+)/, " $1 ") : " ");
  }

  function lerQuantidade(linha) {
    const t = semAcento(limparNumeros(linha)).toLowerCase();
    const chave = t.match(/\b(?:qtd|qtde|quant|quantidade|estoque|saldo|disp|disponivel)\.?\s*[:=-]?\s*(\d{1,4})\b/)
      || t.match(/\b(\d{1,4})\s*(?:un|und|unid|unidades?|pc|pcs|peca|pecas)\b/)
      || t.match(/\bx\s*(\d{1,4})\b/) || t.match(/\b(\d{1,4})\s*x\b/);
    if (chave) return Number(chave[1]);
    const nums = t.match(/\b\d{1,4}\b/g);
    return nums ? Number(nums[nums.length - 1]) : null;
  }

  // Prepara o catálogo: palavras de cada produto, com a marcação de modelo e de pares de cor
  function prepararCatalogo(produtos) {
    return produtos.map((p) => {
      const ts = palavras(p.nome);
      const tk = ts.map((t, k) => ({ t, modelo: k === 0, tamanho: k > 0 && t.length === 1, grupo: null }));
      tk.forEach((x, k) => {
        if (GENERICAS.has(x.t) && tk[k + 1] && !tk[k + 1].tamanho) { x.grupo = k; tk[k + 1].grupo = k; }
      });
      const vars = (Array.isArray(p.variacoes) ? p.variacoes : []).map((v, i) => ({ i, tk: palavras(v.nome || "") })).filter((v) => v.tk.length);
      return { p, tk, modelo: ts[0], codigo: (p.codigo || "").trim().toUpperCase(), vars };
    }).filter((c) => c.tk.length);
  }

  // Confere se a linha descreve o produto. Cada palavra da linha vale para uma única palavra do produto.
  function casar(c, linha, ignorarTamanho) {
    const usados = new Set();
    const nota = c.tk.map(() => 0);
    const tenta = (k, aceita) => {
      const j = linha.findIndex((l, i) => !usados.has(i) && aceita(c.tk[k], l));
      if (j >= 0) { usados.add(j); return true; }
      return false;
    };
    c.tk.forEach((x, k) => { if (tenta(k, (pt, l) => pt.t === l)) nota[k] = 2; });                       // iguais primeiro
    c.tk.forEach((x, k) => { if (!nota[k] && tenta(k, (pt, l) => combina(pt.t, l, pt.modelo) > 0)) nota[k] = 1; }); // depois parecidas
    let faltando = 0, semTamanho = false;
    for (let k = 0; k < c.tk.length; k++) {
      if (nota[k]) continue;
      const x = c.tk[k];
      if (x.tamanho && ignorarTamanho) { semTamanho = true; continue; }
      if (x.grupo == null) return null;                                   // palavra obrigatória faltando
      if (!c.tk.some((y, m) => y.grupo === x.grupo && nota[m])) return null; // nenhuma das cores do par
      faltando++;
    }
    return { n: nota.filter(Boolean).length, exatas: nota.reduce((a, b) => a + b, 0), faltando, semTamanho };
  }

  const melhorPrimeiro = (a, b) => b.s.n - a.s.n || b.s.exatas - a.s.exatas || a.s.faltando - b.s.faltando;
  const empata = (a, b) => a.s.n === b.s.n && a.s.exatas === b.s.exatas && a.s.faltando === b.s.faltando;

  // Acha o produto da linha: código primeiro; depois nome (o mais específico vence; empate = ambíguo)
  function acharProduto(catalogo, linhaOriginal, tokensLinha) {
    const maius = " " + semAcento(linhaOriginal).toUpperCase().replace(/[^A-Z0-9-]+/g, " ") + " ";
    const porCodigo = catalogo.filter((c) => c.codigo && maius.includes(" " + c.codigo + " "));
    if (porCodigo.length === 1) return { c: porCodigo[0], por: "código" };
    if (porCodigo.length > 1) {
      const peloNome = acharPorNome(catalogo, tokensLinha);
      return peloNome && peloNome.c && porCodigo.includes(peloNome.c) ? peloNome : { ambiguo: porCodigo.map((c) => c.p) };
    }
    return acharPorNome(catalogo, tokensLinha);
  }

  function acharPorNome(catalogo, tokensLinha) {
    if (!tokensLinha.length) return null;

    let cands = catalogo.map((c) => ({ c, s: casar(c, tokensLinha, false) })).filter((x) => x.s);
    // Faltou só a letra do tamanho (P, M, G)? Se só existe um tamanho, é ele; se existem vários, pergunta.
    if (!cands.length) cands = catalogo.map((c) => ({ c, s: casar(c, tokensLinha, true) })).filter((x) => x.s && x.s.semTamanho);
    if (!cands.length) return null;
    cands.sort(melhorPrimeiro);
    const iguais = cands.filter((x) => empata(x, cands[0]));
    return iguais.length > 1 ? { ambiguo: iguais.map((x) => x.c.p) } : { c: cands[0].c, por: "nome" };
  }

  // Lê a lista inteira
  function lerLista(texto, produtos) {
    const catalogo = prepararCatalogo(produtos);
    const modelos = new Set(catalogo.map((c) => c.modelo));
    produtos.forEach((p) => palavras(p.categoria || "").forEach((t) => t.length > 1 && modelos.add(t)));
    // Códigos do catálogo saem da linha antes de ler o nome (ex.: "ISIS-P-SELA" não é a cor Sela)
    const codigos = [...new Set(catalogo.map((c) => c.codigo).filter(Boolean))].sort((a, b) => b.length - a.length)
      .map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const reCodigos = codigos.length ? new RegExp(`(^|[^A-Z0-9-])(${codigos.join("|")})(?=$|[^A-Z0-9-])`, "gi") : null;

    const linhas = String(texto || "").split(/\r?\n/).map((l) => l.replace(/[\t;|]+/g, "  ").replace(/\s+/g, " ").trim()).filter(Boolean);
    let contexto = []; // título de seção ("CARMEM", "SARA P") que vale para as linhas seguintes

    const resultado = linhas.map((texto) => {
      if (IGNORAR.test(semAcento(texto))) return { texto, status: "ignorada" };
      const quantidade = lerQuantidade(texto);
      const semCodigo = reCodigos ? semAcento(texto).replace(reCodigos, "$1 ") : texto;
      const tokens = palavras(limparNumeros(semCodigo)).filter((t) => !/^\d+$/.test(t));
      const temCodigo = reCodigos ? new RegExp(reCodigos.source, "i").test(semAcento(texto)) : false;
      if (!temCodigo && (!tokens.length || tokens.every((t) => CABECALHO.has(t)))) return { texto, status: "ignorada" };

      // Linha sem quantidade que não é uma peça = título de seção. Título sem modelo conhecido zera o anterior.
      if (quantidade == null && !temCodigo) {
        const proprio = acharProduto(catalogo, texto, tokens);
        if (!proprio || proprio.ambiguo) {
          contexto = tokens.some((t) => modelos.has(t)) ? tokens : [];
          return { texto, status: contexto.length ? "titulo" : "ignorada" };
        }
      }

      let achado = acharProduto(catalogo, texto, tokens);
      // O título vale só para linhas que não citam outro modelo ("Sara preto" debaixo de "CARMEM" não é Carmem)
      const citados = tokens.filter((t) => modelos.has(t));
      if (citados.length && !citados.some((t) => contexto.includes(t))) contexto = [];
      if ((!achado || achado.ambiguo) && contexto.length && !citados.length) {
        const comContexto = acharProduto(catalogo, texto, [...contexto, ...tokens]);
        if (comContexto) achado = comContexto;
      }
      if (!achado) return { texto, quantidade, status: "sem_produto" };
      if (achado.ambiguo) return { texto, quantidade, status: "ambiguo", opcoes: achado.ambiguo };
      if (quantidade == null) return { texto, status: "sem_quantidade", produto: achado.c.p };

      // Produto com cores cadastradas como variações
      let variacao = 0;
      if (achado.c.vars.length) {
        const casadas = achado.c.vars.filter((v) => v.tk.every((t) => tokens.some((l) => combina(t, l, false))));
        if (casadas.length !== 1) return { texto, quantidade, status: "sem_variacao", produto: achado.c.p };
        variacao = casadas[0].i;
      }
      return { texto, quantidade, status: "ok", produto: achado.c.p, variacao, por: achado.por };
    });

    // Junta por produto/variação (mesma peça em mais de uma linha → soma)
    const porItem = new Map();
    for (const r of resultado.filter((x) => x.status === "ok")) {
      const chave = r.produto.id + "|" + r.variacao;
      const atual = porItem.get(chave);
      if (atual) { atual.quantidade += r.quantidade; atual.linhas.push(r.texto); }
      else porItem.set(chave, { produto: r.produto, variacao: r.variacao, quantidade: r.quantidade, linhas: [r.texto] });
    }
    return { linhas: resultado, itens: [...porItem.values()] };
  }

  const api = { lerLista, lerQuantidade, palavras };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else raiz.LifeEstoque = api;
})(typeof window !== "undefined" ? window : globalThis);
