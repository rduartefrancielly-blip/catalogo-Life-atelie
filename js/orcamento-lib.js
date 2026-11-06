// Life Ateliê · Orçamentos: regras que não dependem da tela nem do banco
// (contas, validação, WhatsApp e o texto da mensagem). Também roda no Node, para os testes.
(function (raiz) {
  "use strict";

  const STATUS = [
    { id: "rascunho", nome: "Rascunho" },
    { id: "enviado", nome: "Enviado" },
    { id: "aprovado", nome: "Aprovado" },
    { id: "recusado", nome: "Recusado" },
  ];
  const statusNome = (id) => (STATUS.find((s) => s.id === id) || STATUS[0]).nome;
  const AJUSTES = [
    { id: "desconto_pct", nome: "Desconto em %", sinal: -1 },
    { id: "desconto_valor", nome: "Desconto em R$", sinal: -1 },
    { id: "acrescimo_valor", nome: "Acréscimo em R$", sinal: 1 },
  ];

  const arred = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  const brl = (n) => Number(n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace(/\s/g, " ");
  const soDigitos = (s) => String(s == null ? "" : s).replace(/\D/g, "");
  const limpo = (s) => String(s == null ? "" : s).replace(/\s+/g, " ").trim();

  // "1.234,56" / "1234,56" / "1234.56" / "R$ 89,9" → número; vazio ou inválido → NaN
  function lerValor(s) {
    if (typeof s === "number") return isFinite(s) ? s : NaN;
    let t = String(s == null ? "" : s).replace(/R\$/gi, "").replace(/\s/g, "");
    if (!t) return NaN;
    if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
    if (!/^-?\d+(\.\d+)?$/.test(t)) return NaN;
    return Number(t);
  }
  const valorCampo = (n) => (n == null || n === "" || isNaN(n) ? "" : Number(n).toFixed(2).replace(".", ","));

  // ---------- WhatsApp ----------
  // Aceita "(31) 99468-5463", "31994685463", "+55 31 99468-5463", "031 99468 5463".
  // Devolve só os números com o 55 na frente, ou "" quando não dá para usar.
  function whatsDigitos(tel) {
    let d = soDigitos(tel);
    if ((d.length === 12 || d.length === 13) && d.startsWith("55")) d = d.slice(2); // +55
    else if (d.startsWith("0")) d = d.replace(/^0+/, ""); // 0 antes do DDD (031...)
    if (d.length !== 10 && d.length !== 11) return "";
    if (d[0] === "0" || d[1] === "0") return ""; // DDD de 11 a 99
    if (d.length === 11 && d[2] !== "9") return ""; // celular: 9 + 8 números
    return "55" + d;
  }
  function whatsBonito(tel) {
    const d = whatsDigitos(tel);
    if (!d) return limpo(tel);
    const n = d.slice(2), ddd = n.slice(0, 2), resto = n.slice(2);
    return "(" + ddd + ") " + resto.slice(0, resto.length - 4) + "-" + resto.slice(-4);
  }

  // ---------- Contas ----------
  const qtdDe = (it) => { const q = Number(it.quantidade); return Number.isInteger(q) && q > 0 ? q : 0; };
  const valorDe = (it) => { const v = lerValor(it.valor_unitario); return isNaN(v) || v < 0 ? 0 : v; };
  // ajuste: { tipo: "desconto_pct" | "desconto_valor" | "acrescimo_valor", valor, descricao } (vale sobre os produtos, não sobre o frete)
  function calcular(itens, frete, ajuste) {
    const linhas = (itens || []).map((it) => Object.assign({}, it, { total: arred(qtdDe(it) * valorDe(it)) }));
    const subtotal = arred(linhas.reduce((t, l) => t + l.total, 0));
    let f = lerValor(frete);
    if (isNaN(f) || f < 0) f = 0;
    f = arred(f);
    const aj = ajusteDe(ajuste, subtotal);
    return { linhas, subtotal, ajuste: aj, frete: f, total: arred(Math.max(0, subtotal + aj.valor) + f), pecas: linhas.reduce((t, l) => t + qtdDe(l), 0) };
  }
  // devolve { tipo, valor (com sinal: desconto negativo), pct, rotulo } — ou valor 0 quando não há ajuste
  function ajusteDe(ajuste, subtotal) {
    const tipo = ajuste && AJUSTES.find((a) => a.id === ajuste.tipo);
    let v = ajuste ? lerValor(ajuste.valor) : NaN;
    if (!tipo || isNaN(v) || v <= 0) return { tipo: null, valor: 0, pct: null, rotulo: "" };
    let reais = tipo.id === "desconto_pct" ? arred((subtotal * Math.min(v, 100)) / 100) : arred(v);
    if (tipo.sinal < 0) reais = Math.min(reais, subtotal);
    const desc = limpo(ajuste.descricao);
    const base = desc || (tipo.sinal < 0 ? "Desconto" : "Acréscimo");
    const pct = tipo.id === "desconto_pct" ? Number(v.toFixed(2)) : null;
    return { tipo: tipo.id, valor: tipo.sinal * reais, pct, rotulo: base + (pct != null ? " (" + String(pct).replace(".", ",") + "%)" : "") };
  }
  // conta de um orçamento salvo (com o ajuste guardado nele)
  const contaDe = (o) => calcular(o.itens, o.frete, { tipo: o.ajuste_tipo, valor: o.ajuste_valor, descricao: o.ajuste_descricao });
  const valorAjuste = (v) => (v < 0 ? "− " : "+ ") + brl(Math.abs(v));

  // "Bolsa Alice" + "Preto" → "Bolsa Alice – Preto" (sem repetir a cor se já estiver no nome)
  function nomeDoItem(it) {
    const nome = limpo(it.nome), cor = limpo(it.cor);
    if (!cor) return nome;
    const sem = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    return sem(nome).endsWith(sem(cor)) ? nome : nome + " – " + cor;
  }

  // Item sem nada preenchido é ignorado (linha em branco que sobrou no formulário)
  const itemVazio = (it) => !limpo(it.nome) && !limpo(it.cor) && !it.foto && limpo(it.valor_unitario) === "";

  // ---------- Validação ----------
  // modo "rascunho": basta o nome da cliente (e o que estiver preenchido precisa estar certo)
  // modo "envio": tudo o que a cliente vai ver precisa estar completo
  function validar(orc, modo) {
    const erros = [];
    const envio = modo === "envio";
    if (!limpo(orc.cliente_nome)) erros.push({ campo: "cliente_nome", msg: "Escreva o nome da cliente." });
    const tel = limpo(orc.cliente_whatsapp);
    if (tel && !whatsDigitos(tel)) erros.push({ campo: "cliente_whatsapp", msg: "O WhatsApp precisa ter DDD e número, por exemplo (31) 99999-9999." });
    else if (!tel && envio) erros.push({ campo: "cliente_whatsapp", msg: "Escreva o WhatsApp da cliente com DDD, por exemplo (31) 99999-9999." });
    const itens = (orc.itens || []).map((it, i) => ({ it, i })).filter((x) => !itemVazio(x.it));
    if (!itens.length && envio) erros.push({ campo: "itens", msg: "Adicione pelo menos um produto ao orçamento." });
    itens.forEach(({ it, i }) => {
      const n = "Produto " + (i + 1);
      if (!limpo(it.nome)) erros.push({ campo: "nome", idx: i, msg: n + ": escreva o nome do produto." });
      const q = Number(it.quantidade);
      if (!(Number.isInteger(q) && q >= 1)) erros.push({ campo: "quantidade", idx: i, msg: n + ": a quantidade precisa ser 1 ou mais." });
      const vTxt = limpo(it.valor_unitario);
      const v = lerValor(it.valor_unitario);
      if (vTxt === "" ? envio : isNaN(v) || v < 0) erros.push({ campo: "valor_unitario", idx: i, msg: n + ": " + (vTxt === "" ? "informe o valor unitário." : "o valor unitário não é um número válido (ex.: 489,90).") });
    });
    const aTxt = limpo(orc.ajuste_valor);
    if (orc.ajuste_tipo && aTxt !== "") {
      const a = lerValor(orc.ajuste_valor);
      const sub = calcular(orc.itens).subtotal;
      if (isNaN(a) || a < 0) erros.push({ campo: "ajuste_valor", msg: "O valor do ajuste não é um número válido. Use, por exemplo, 10 ou 25,00." });
      else if (orc.ajuste_tipo === "desconto_pct" && a > 100) erros.push({ campo: "ajuste_valor", msg: "O desconto em % não pode passar de 100%." });
      else if (orc.ajuste_tipo === "desconto_valor" && a > sub) erros.push({ campo: "ajuste_valor", msg: "O desconto (" + brl(a) + ") é maior que o valor dos produtos (" + brl(sub) + ")." });
    }
    const fTxt = limpo(orc.frete);
    if (fTxt !== "") { const f = lerValor(orc.frete); if (isNaN(f) || f < 0) erros.push({ campo: "frete", msg: "O frete não é um valor válido. Use, por exemplo, 25,00 (ou deixe em branco)." }); }
    return erros;
  }

  // Deixa o orçamento pronto para gravar (números de verdade, sem linhas vazias)
  function normalizar(orc) {
    const itens = (orc.itens || []).filter((it) => !itemVazio(it)).map((it) => {
      const v = lerValor(it.valor_unitario);
      const q = Number(it.quantidade);
      return {
        nome: limpo(it.nome), cor: limpo(it.cor) || null, foto: it.foto || null,
        quantidade: Number.isInteger(q) && q > 0 ? q : 1, valor_unitario: isNaN(v) ? null : arred(v),
        produto_id: it.produto_id || null,
      };
    });
    const f = lerValor(orc.frete);
    const a = lerValor(orc.ajuste_valor);
    const temAjuste = !!AJUSTES.find((x) => x.id === orc.ajuste_tipo) && !isNaN(a) && a > 0;
    return {
      ajuste_tipo: temAjuste ? orc.ajuste_tipo : null,
      ajuste_valor: temAjuste ? arred(a) : 0,
      ajuste_descricao: temAjuste ? limpo(orc.ajuste_descricao) || null : null,
      cliente_nome: limpo(orc.cliente_nome),
      cliente_whatsapp: whatsDigitos(orc.cliente_whatsapp) || limpo(orc.cliente_whatsapp) || null,
      itens,
      frete: isNaN(f) || f < 0 ? 0 : arred(f),
      observacoes: String(orc.observacoes == null ? "" : orc.observacoes).trim() || null,
    };
  }

  // ---------- Textos ----------
  const dataBR = (iso) => {
    const d = iso ? new Date(iso) : new Date();
    return d.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric" });
  };
  const primeiroNome = (nome) => limpo(nome).split(" ")[0] || "";
  const numeroTexto = (n) => (n == null ? "" : "nº " + n);

  // Mensagem do WhatsApp (o *texto* fica em negrito no WhatsApp)
  function textoWhats(orc) {
    const c = contaDe(orc);
    const nome = primeiroNome(orc.cliente_nome);
    const linhas = [];
    linhas.push("Olá" + (nome ? ", " + nome : "") + "! Tudo bem?");
    linhas.push("Segue o seu orçamento da *Life Ateliê*:");
    linhas.push("");
    linhas.push("*Orçamento" + (orc.numero != null ? " " + numeroTexto(orc.numero) : "") + "* · " + dataBR(orc.criado_em));
    linhas.push("");
    c.linhas.filter((l) => !itemVazio(l)).forEach((l, i) => {
      linhas.push((i + 1) + ". *" + nomeDoItem(l) + "*");
      linhas.push("   " + qtdDe(l) + " × " + brl(valorDe(l)) + " = " + brl(l.total));
    });
    linhas.push("");
    linhas.push("Subtotal: " + brl(c.subtotal));
    if (c.ajuste.valor) linhas.push(c.ajuste.rotulo + ": " + valorAjuste(c.ajuste.valor));
    linhas.push("Frete: " + brl(c.frete));
    linhas.push("*Total: " + brl(c.total) + "*");
    const obs = String(orc.observacoes || "").trim();
    if (obs) { linhas.push(""); linhas.push("Observações: " + obs); }
    linhas.push("");
    linhas.push("Qualquer dúvida, é só me chamar por aqui.");
    return linhas.join("\n");
  }

  const api = { AJUSTES, contaDe, valorAjuste, STATUS, statusNome, arred, brl, lerValor, valorCampo, whatsDigitos, whatsBonito, calcular, nomeDoItem, itemVazio, validar, normalizar, textoWhats, dataBR, numeroTexto };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else raiz.OrcamentoLib = api;
})(typeof window !== "undefined" ? window : globalThis);
