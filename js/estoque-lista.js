// Leitor de listas de estoque (texto copiado de PDF, planilha, sistema ou WhatsApp).
// Para cada linha, descobre qual produto do catálogo é e qual a quantidade.
// Regra de ouro: na dúvida, não chuta — a linha vai para "não entendi".
(function (raiz) {
  // Palavras que não ajudam a identificar a peça
  const VAZIAS = new Set(["bolsa", "bolsas", "porta", "celular", "personalizavel", "personalizaveis", "personalizada", "mochila", "mochilas",
    "de", "da", "do", "das", "dos", "e", "com", "em", "a", "o", "c", "cor", "modelo", "couro", "legitimo"]);
  // Jeitos comuns de escrever (já sem acento e em minúsculas)
  const SINONIMOS = { vm: "vermelho", verm: "vermelho", vd: "verde", az: "azul", pto: "preto", off: "offwhite", ofwhite: "offwhite",
    grande: "g", gde: "g", grd: "g", media: "m", medio: "m", pequena: "p", pequeno: "p", peq: "p" };
  // Cor "genérica" seguida da específica: "Vermelho Cereja" também pode vir só como "cereja" ou só como "vermelha"
  const GENERICAS = new Set(["vermelh", "verde", "azul"]);
  // Cabeçalhos de tabela e palavras de unidade/quantidade
  const CABECALHO = new Set(["produt", "descrica", "descricao", "item", "iten", "cor", "core", "qtd", "qtde", "quant", "quantidade", "estoque", "saldo",
    "codig", "cod", "sku", "prec", "valor", "unitari", "un", "und", "unid", "unidade", "pc", "pcs", "pec", "modelo", "referencia", "ref", "gtin", "ean"]);
  // Linhas que nunca são produto
  const IGNORAR = /\b(total|subtotal|soma|pagina|relatorio|emitido|impresso)\b|\bdata\s*:/i;
  const NOMES_COLUNA_QTD = [/saldo\s*fisico/, /^(quantidade|qtd|qtde|quant)\.?$/, /^(estoque|saldo)( atual| disponivel)?$/];

  const semAcento = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "");

  // "preta"/"preto"/"pretas" → "pret"; "tags" → "tag"; mantém letras de tamanho (P, M, G) e números
  function radical(t) {
    if (/^\d+$/.test(t) || t.length <= 2) return t;
    if (t.length >= 4 && t.endsWith("s")) t = t.slice(0, -1);
    if (t.length > 3 && /[ao]$/.test(t)) t = t.slice(0, -1);
    return t;
  }

  // Texto digitalizado (OCR) troca letras: "se1a" → sela, "rnusgo" → musgo, "B1A" → bia, "lsis" → isis.
  // Só aceita o conserto se o resultado for uma palavra conhecida do catálogo.
  function reparar(w, conhecidas) {
    if (!conhecidas || conhecidas.has(radical(w)) || SINONIMOS[w]) return w;
    const vs = new Set([w]);
    for (const v of [...vs]) { vs.add(v.replace(/0/g, "o").replace(/1/g, "l").replace(/5/g, "s")); vs.add(v.replace(/0/g, "o").replace(/1/g, "i").replace(/5/g, "s")); }
    for (const v of [...vs]) vs.add(v.replace(/rn/g, "m"));
    for (const v of [...vs]) if (v.startsWith("l")) vs.add("i" + v.slice(1));
    for (const v of vs) if (v !== w && /^[a-z]{3,}$/.test(v) && (conhecidas.has(radical(v)) || SINONIMOS[v])) return v;
    return w;
  }

  // Texto → palavras comparáveis
  function palavras(s, conhecidas) {
    const brutas = semAcento(s).toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean)
      .map((w) => reparar(w, conhecidas));
    // junta "mouse pad" e "off white"
    const juntas = [];
    for (let i = 0; i < brutas.length; i++) {
      const seguinte = radical(brutas[i + 1] || "");
      if (brutas[i] === "mouse" && seguinte === "pad") { juntas.push("mousepad"); i++; }
      else if (brutas[i] === "off" && seguinte === "white") { juntas.push("offwhite"); i++; }
      else juntas.push(brutas[i]);
    }
    return juntas.map((t) => SINONIMOS[t] || t).filter((t) => t && !VAZIAS.has(t)).map(radical);
  }

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
  function limparNumeros(linha, conhecidas) {
    return linha
      .replace(/r\$\s*-?[\d.]+(,\d{1,2})?/gi, " ")           // preços com R$
      .replace(/-?\b\d{1,3}(\.\d{3})*,\d{2}\b/g, " ")         // 1.234,56
      .replace(/\b\d+\.\d{2}\b/g, " ")                        // 489.90
      .replace(/\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b/g, " ")      // datas
      .replace(/\b\d{1,2}:\d{2}\b/g, " ")                     // horas
      .replace(/\b\d+([.,]\d+)?(\s*x\s*\d+([.,]\d+)?){1,2}\s*(cm|mm)?\b/gi, " ") // dimensões (22 x 18 cm)
      .replace(/\b\d+([.,]\d+)?\s*(cm|mm)\b/gi, " ")          // medidas
      .replace(/\b\d+([.,]\d+)?(kg|g)\b/gi, " ")              // peso (450g)
      .replace(/\b\d+\s*(cores?|modelos?|itens?|tipos?|varia[cç](ao|oes|ões)|tamanhos?)\b/gi, " ") // "7 cores" em título
      // palavras com letras e números: quantidade ("x2", "2un"), palavra de OCR ("se1a") ou código (BLSP08)
      .replace(/\b(?=[\w-]*[a-z])(?=[\w-]*\d)[\w-]+\b/gi, (m) => {
        if (/^(x\d+|\d+x|\d+(un|und|unid|pc|pcs))$/i.test(m)) return m.replace(/(\d+)/, " $1 ");
        const r = reparar(semAcento(m).toLowerCase(), conhecidas);
        return /^[a-z]+$/.test(r) ? " " + r + " " : " ";
      });
  }

  // Quantidade escrita numa célula de planilha/sistema: "2", "2,00", "-1,00" (negativo vira 0)
  function qtdDaCelula(c) {
    const m = String(c || "").trim().match(/^(-?\d{1,4})([.,]0+)?$/);
    return m ? Math.max(0, Number(m[1])) : null;
  }

  function lerQuantidade(linha) {
    const t = semAcento(limparNumeros(linha)).toLowerCase();
    const chave = t.match(/\b(?:qtd|qtde|quant|quantidade|estoque|saldo|disp|disponivel)\.?\s*[:=-]?\s*(\d{1,4})\b/)
      || t.match(/\b(\d{1,4})\s*(?:un|und|unid|unidades?|pc|pcs|peca|pecas)\b/)
      || t.match(/\bx\s*(\d{1,4})\b/) || t.match(/\b(\d{1,4})\s*x\b/);
    if (chave) return Number(chave[1]);
    const nums = t.match(/\b\d{1,4}\b/g);
    if (nums) return Number(nums[nums.length - 1]);
    const ocr = semAcento(linha).match(/\(\s*([lIoO])\s*\)\s*$/); // "(l)" = 1, "(O)" = 0 em texto digitalizado
    return ocr ? (/[lI]/.test(ocr[1]) ? 1 : 0) : null;
  }

  // Tabela com cabeçalho (planilha, sistema): descobre as colunas de quantidade, nome e código
  function detectarColunas(brutas) {
    for (const l of brutas.slice(0, 20)) {
      for (const sep of ["\t", ";", "|"]) {
        if (!l.includes(sep)) continue;
        const cels = l.split(sep).map((c) => semAcento(c).toLowerCase().replace(/\s+/g, " ").trim());
        for (const re of NOMES_COLUNA_QTD) {
          const i = cels.findIndex((c) => re.test(c));
          if (i < 0) continue;
          const iNome = cels.findIndex((c) => /^(produto|descri\S*|nome|item)\b/.test(c));
          // "CÃ³digo" (acentos trocados ao exportar) também vale
          const iCodigo = cels.findIndex((c) => /^c.{0,3}digo\b|^cod\.?$|^sku$|^refer/.test(c));
          return { sep, i, iNome, iCodigo };
        }
      }
    }
    return null;
  }

  // "Bolsa Sara G-Off White" → "Bolsa Sara G - Off White"; "Helena M- sela" → "Helena M - Sela"
  function arrumarNome(nome) {
    const t = String(nome || "").replace(/\s+/g, " ").trim().replace(/\s*-\s*/g, " - ");
    const [modelo, ...resto] = t.split(" - ");
    const cor = resto.join(" - ");
    return cor ? `${modelo} - ${cor.charAt(0).toUpperCase()}${cor.slice(1)}` : modelo;
  }

  // Peça que não está no catálogo: nome e código como escritos na lista (para cadastrar, se a pessoa quiser)
  function sugerirCadastro(bruta, texto, colunas) {
    if (colunas && colunas.iNome >= 0) {
      const cels = bruta.split(colunas.sep);
      const nome = arrumarNome(cels[colunas.iNome]);
      const codigo = colunas.iCodigo >= 0 ? String(cels[colunas.iCodigo] || "").trim() : "";
      if (/[a-z]{3}/i.test(nome)) return { nome, codigo: codigo || null };
      return null;
    }
    // Sem colunas: tira código do início e quantidade/preço do fim
    let resto = texto.replace(/^[A-Z0-9][A-Z0-9-]*\d[A-Z0-9-]*\s+/, "");
    const codigo = texto.length !== resto.length ? texto.slice(0, texto.length - resto.length).trim() : null;
    resto = resto.replace(/r\$\s*[\d.,]+/gi, " ").replace(/[\s.:=-]*(qtd|qtde|quantidade)?[\s.:=-]*\d{1,4}\s*(un|und|unid|unidades?|pcs?|pecas?)?\s*$/i, "").replace(/[\s.:-]+$/, "");
    const nome = arrumarNome(resto);
    return nome.split(" ").length >= 2 ? { nome, codigo } : null;
  }

  // Prepara o catálogo: palavras de cada produto, com a marcação de modelo e de pares de cor
  function prepararCatalogo(produtos) {
    const catalogo = produtos.map((p) => {
      const ts = palavras(p.nome);
      const tk = ts.map((t, k) => ({ t, modelo: k === 0, tamanho: k > 0 && t.length === 1, grupo: null }));
      tk.forEach((x, k) => {
        if (GENERICAS.has(x.t) && tk[k + 1] && !tk[k + 1].tamanho) { x.grupo = k; tk[k + 1].grupo = k; }
      });
      const vars = (Array.isArray(p.variacoes) ? p.variacoes : []).map((v, i) => ({ i, tk: palavras(v.nome || "") })).filter((v) => v.tk.length);
      return { p, tk, modelo: ts[0], codigo: (p.codigo || "").trim().toUpperCase(), vars };
    }).filter((c) => c.tk.length);
    catalogo.vocabulario = new Set(catalogo.flatMap((c) => c.tk.map((x) => x.t)).filter((t) => t.length >= 2));
    catalogo.porModelo = new Map();
    catalogo.forEach((c) => catalogo.porModelo.set(c.modelo, (catalogo.porModelo.get(c.modelo) || []).concat(c)));
    return catalogo;
  }

  // Confere se a linha descreve o produto. Cada palavra da linha vale para uma única palavra do produto.
  function casar(c, linha, ignorarTamanho, vocabulario) {
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
    // Sobrou na linha uma palavra que existe no catálogo (ex.: "Off White" em "Sara G - Off White & Café")
    // e que esta peça não tem? Então a linha descreve outra peça.
    const proprias = new Set(c.tk.map((x) => x.t));
    const sobras = linha.filter((l, i) => !usados.has(i));
    if (vocabulario && sobras.some((l) => l.length >= 2 && vocabulario.has(l) && !proprias.has(l))) return null;
    return { n: nota.filter(Boolean).length, exatas: nota.reduce((a, b) => a + b, 0), faltando, semTamanho, sobras };
  }

  const melhorPrimeiro = (a, b) => b.s.n - a.s.n || b.s.exatas - a.s.exatas || a.s.faltando - b.s.faltando;
  const empata = (a, b) => a.s.n === b.s.n && a.s.exatas === b.s.exatas && a.s.faltando === b.s.faltando;
  const temTamanho = (tokens) => tokens.some((t) => t === "p" || t === "m" || t === "g");

  function acharPorNome(catalogo, tokensLinha) {
    if (!tokensLinha.length) return null;
    let cands = catalogo.map((c) => ({ c, s: casar(c, tokensLinha, false, catalogo.vocabulario) })).filter((x) => x.s);
    // A linha não diz o tamanho (P, M, G)? Se o modelo só existe num tamanho, é ele; se existem vários, pergunta.
    // Se a linha DIZ o tamanho, ele é obrigatório (Sara G nunca vira Sara P).
    if (!cands.length && !temTamanho(tokensLinha))
      cands = catalogo.map((c) => ({ c, s: casar(c, tokensLinha, true, catalogo.vocabulario) })).filter((x) => x.s && x.s.semTamanho);
    // Só o nome do modelo ("nina 1") e o modelo só tem uma peça no catálogo → é ela
    if (!cands.length) {
      const sig = tokensLinha.filter((t) => !CABECALHO.has(t));
      const unicos = sig.length === 1 ? catalogo.porModelo.get(sig[0]) : null;
      if (unicos && unicos.length === 1) return { c: unicos[0], por: "nome", sobras: [] };
    }
    if (!cands.length) return null;
    cands.sort(melhorPrimeiro);
    const iguais = cands.filter((x) => empata(x, cands[0]));
    return iguais.length > 1 ? { ambiguo: iguais.map((x) => x.c.p) } : { c: cands[0].c, por: "nome", sobras: cands[0].s.sobras };
  }

  // Acha o produto da linha: código primeiro (se o nome concordar); depois nome (o mais específico vence; empate = dúvida)
  function acharProduto(catalogo, linhaOriginal, tokensLinha) {
    const maius = " " + semAcento(linhaOriginal).toUpperCase().replace(/[^A-Z0-9-]+/g, " ") + " ";
    const porCodigo = catalogo.filter((c) => c.codigo && maius.includes(" " + c.codigo + " "));
    const peloNome = acharPorNome(catalogo, tokensLinha);
    if (porCodigo.length === 1) {
      const c = porCodigo[0];
      // O código só vale se o nome escrito na linha (quando houver) for o da mesma peça
      if (!tokensLinha.length || (peloNome && peloNome.c === c) || casar(c, tokensLinha, !temTamanho(tokensLinha), catalogo.vocabulario))
        return { c, por: "código", sobras: [] };
      return { conflito: c.p, codigo: c.codigo, nome: peloNome && peloNome.c ? peloNome.c.p : null };
    }
    if (porCodigo.length > 1)
      return peloNome && peloNome.c && porCodigo.includes(peloNome.c) ? peloNome : { ambiguo: porCodigo.map((c) => c.p) };
    return peloNome;
  }

  // Lê a lista inteira
  function lerLista(texto, produtos) {
    const catalogo = prepararCatalogo(produtos);
    const modelos = new Set(catalogo.map((c) => c.modelo));
    produtos.forEach((p) => palavras(p.categoria || "").forEach((t) => t.length > 1 && modelos.add(t)));
    // Palavras conhecidas (para consertar texto digitalizado)
    const conhecidas = new Set([...catalogo.vocabulario, ...modelos, ...[...VAZIAS].map(radical), "mouse", "pad", "off", "white", "total", "subtotal", "outr"]);
    // Códigos do catálogo saem da linha antes de ler o nome (ex.: "ISIS-P-SELA" não é a cor Sela)
    const codigos = [...new Set(catalogo.map((c) => c.codigo).filter(Boolean))].sort((a, b) => b.length - a.length)
      .map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const reCodigos = codigos.length ? new RegExp(`(^|[^A-Z0-9-])(${codigos.join("|")})(?=$|[^A-Z0-9-])`, "gi") : null;

    const brutas = String(texto || "").split(/\r?\n/).filter((l) => l.trim());
    const colunas = detectarColunas(brutas);
    let contexto = []; // título de seção ("CARMEM", "SARA P") que vale para as linhas seguintes

    const resultado = brutas.map((bruta) => {
      const texto = bruta.replace(/[\t;|]+/g, "  ").replace(/\s+/g, " ").trim();
      if (IGNORAR.test(semAcento(texto))) return { texto, status: "ignorada" };
      let quantidade = null;
      if (colunas) {
        const cels = bruta.split(colunas.sep);
        if (cels.length > colunas.i) quantidade = qtdDaCelula(cels[colunas.i]);
      }
      if (quantidade == null) quantidade = lerQuantidade(texto);
      const semCodigo = reCodigos ? semAcento(texto).replace(reCodigos, "$1 ") : texto;
      const tokens = palavras(limparNumeros(semCodigo, conhecidas), conhecidas).filter((t) => !/^\d+$/.test(t));
      if (tokens.some((t) => t === "total" || t === "subtotal")) return { texto, status: "ignorada" };
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
      // "Helena G ..." dentro da seção "HELENA M": o título deixa de valer (não dá mais para saber o tamanho)
      const tamLinha = tokens.filter((t) => t === "p" || t === "m" || t === "g");
      const tamTitulo = contexto.filter((t) => t === "p" || t === "m" || t === "g");
      if (citados.length && tamLinha.length && tamTitulo.length && !tamLinha.some((t) => tamTitulo.includes(t))) contexto = [];
      if ((!achado || achado.ambiguo || achado.conflito) && contexto.length && !citados.length) {
        const comContexto = acharProduto(catalogo, texto, [...contexto, ...tokens]);
        // Com título, toda palavra da linha precisa ser da peça (linha embaralhada não herda o título)
        const sobrou = comContexto && comContexto.c && (comContexto.sobras || [])
          .some((l) => tokens.includes(l) && l.length >= 3 && !CABECALHO.has(l));
        if (comContexto && !sobrou) achado = comContexto;
      }
      if (!achado) return { texto, quantidade, status: "sem_produto", sugestao: quantidade == null ? null : sugerirCadastro(bruta, texto, colunas) };
      if (achado.conflito) return { texto, quantidade, status: "conflito", produto: achado.conflito, codigo: achado.codigo, nomeLista: achado.nome };
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

  const api = { lerLista, lerQuantidade, palavras, arrumarNome };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else raiz.LifeEstoque = api;
})(typeof window !== "undefined" ? window : globalThis);
