// Life Ateliê · Vendas: núcleo (entrar, dados, Início e Vendas no jeito do sistema antigo).
// As outras abas (Live, Estoque, Tags, Cadastro, Bling e backup) ficam em vendas-telas.js.
(function () {
  "use strict";
  const { cfg, esc, configurado } = window.Life;
  const V = window.VendasLib;
  const $ = (id) => document.getElementById(id);
  // window.__sbTeste só existe nos testes automáticos (banco de mentira na memória)
  const sb = window.__sbTeste || (configurado() ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null);
  const TZ = "America/Sao_Paulo";
  const brl = V.brl;

  const E = {
    papel: "", email: "", produtos: [], itens: [], mapaItens: new Map(), clientes: [], vendas: [], tags: [], mov: [], movFim: false,
    ajustes: { tag_valor_minimo: 399, comissao_padrao: 3, estoque_baixo: 1, telefone_fabrica: "" }, leitor: null,
  };
  const TAG_PRODUTO = "Tag personalizada";
  const PAGAMENTOS = { pix: "Pix", credito: "Cartão de crédito", aguardando: "Aguardando pagamento" };

  // ---------- utilidades ----------
  const ler = (k, padrao) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? padrao : v; } catch (e) { return padrao; } };
  const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento: segue sem salvar */ } };
  const apagar = (k) => { try { localStorage.removeItem(k); } catch (e) { /* idem */ } };
  const uuid = () => (window.crypto && crypto.randomUUID ? crypto.randomUUID() : "k" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
  const num = (s) => { const n = V.lerValor(s); return isNaN(n) ? null : n; };
  const fmtEntrada = (n) => Number(n).toFixed(2).replace(".", ",");
  const dia = (iso) => new Date(iso).toLocaleDateString("sv-SE", { timeZone: TZ });
  const mesChave = (iso) => dia(iso).slice(0, 7);
  const hoje = () => dia(new Date());
  const hora = (iso) => new Date(iso).toLocaleTimeString("pt-BR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
  const dataHora = (iso) => new Date(iso).toLocaleString("pt-BR", { timeZone: TZ, day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  const dataCurta = (iso) => new Date(iso).toLocaleDateString("pt-BR", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric" });
  const diaCurto = (k) => k.split("-").reverse().join("/");
  const mesRotulo = (k) => { const [a, m] = k.split("-"); const s = new Date(+a, +m - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }); return s.charAt(0).toUpperCase() + s.slice(1); };
  const diaRotulo = (k) => { const [a, m, d] = k.split("-"); const s = new Date(+a, +m - 1, +d).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }); return s.charAt(0).toUpperCase() + s.slice(1); };
  const somaDias = (k, n) => { const d = new Date(k + "T12:00:00"); d.setDate(d.getDate() + n); return d.toLocaleDateString("sv-SE"); };
  const ehAdmin = () => E.papel === "admin";
  const numeroDe = (v) => (v.numero_legado != null ? v.numero_legado : v.numero);
  const pagTexto = (v) => (v.pagamento === "credito" && v.parcelas ? PAGAMENTOS.credito + " " + v.parcelas + "x" : PAGAMENTOS[v.pagamento] || "");
  const ehTagProduto = (nome) => /^tag\b/.test(V.norm(nome));
  const corTagNome = (c) => { const k = V.chaveCor(c); const f = V.PALETA_TAG.find((x) => V.chaveCor(x.nome) === k); return f ? f.nome : ""; };
  const coresTag = V.PALETA_TAG.filter((c) => c.nome !== "Bordô");

  let avisoTimer = 0;
  function aviso(texto, erro) {
    const a = $("aviso");
    a.textContent = texto;
    a.className = "aviso" + (erro ? " erro-aviso" : "");
    a.hidden = false;
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(() => { a.hidden = true; }, erro ? 6000 : 3500);
  }
  function setMsg(el, texto, tipo) { el.textContent = texto || ""; el.className = "form-msg" + (tipo ? " " + tipo : ""); }
  function armConfirm(btn, ok) {
    if (btn.dataset.armed === "1") { ok(); return; }
    const original = btn.textContent;
    btn.dataset.armed = "1"; btn.textContent = "Confirmar?"; btn.classList.add("armed");
    setTimeout(() => { if (btn.isConnected) { btn.dataset.armed = ""; btn.textContent = original; btn.classList.remove("armed"); } }, 3000);
  }
  function traduzirErro(e) {
    const m = String((e && e.message) || e || "");
    if (/failed to fetch|networkerror|load failed|network request/i.test(m)) return "Sem conexão com a internet. Nada foi registrado. Tente de novo.";
    if (/jwt|not authenticated|permission denied/i.test(m)) return "Sua sessão acabou ou você não tem permissão. Saia e entre de novo.";
    return m || "Algo deu errado.";
  }
  async function copiar(texto) {
    try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(texto); return true; } } catch (e) { /* tenta o jeito antigo */ }
    const ta = document.createElement("textarea");
    ta.value = texto; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;left:-999px;top:0;opacity:0";
    document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, texto.length);
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }
  function baixarArquivo(conteudo, nome, tipo) {
    const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
    const a = document.createElement("a");
    a.href = url; a.download = nome; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }
  function imprimir(html) { $("folha-impressao").innerHTML = html; window.print(); }
  const waNumero = (tel) => { const d = V.soDigitos(tel); if (d.length === 10 || d.length === 11) return "55" + d; if ((d.length === 12 || d.length === 13) && d.indexOf("55") === 0) return d; return ""; };
  function abrirWhats(tel, texto, msgEl, okTxt) {
    const url = "https://wa.me/" + waNumero(tel) + "?text=" + encodeURIComponent(texto);
    let w = null;
    try { w = window.open(url, "_blank"); } catch (e) { /* bloqueado */ }
    if (w) { setMsg(msgEl, okTxt || "Abrindo o WhatsApp...", "ok"); return; }
    copiar(texto).then((ok) => setMsg(msgEl, ok ? "Não consegui abrir o WhatsApp aqui. A mensagem foi copiada: cole na conversa." : "Não consegui abrir o WhatsApp nem copiar a mensagem.", "warn"));
  }
  const miniTag = (iniciais, cor, pequeno) => {
    const hex = V.hexDaCor(cor);
    return `<span class="mini-tag${pequeno ? " sm" : ""}" style="background:${hex};color:${V.textoSobre(hex)}" title="${esc(cor)}">${esc(iniciais || "?")}</span>`;
  };

  // ---------- acesso ao banco (o Supabase devolve no máximo 1000 linhas por vez) ----------
  async function todos(montar) {
    const tam = 1000;
    let ini = 0, saida = [];
    for (;;) {
      const { data, error } = await montar().range(ini, ini + tam - 1);
      if (error) throw error;
      saida = saida.concat(data || []);
      if (!data || data.length < tam) break;
      ini += tam;
    }
    return saida;
  }
  const busca = {
    produtos: () => todos(() => sb.from("produtos").select("id,nome,categoria,codigo,sku_bling,preco,variacoes,visivel,fotos").order("nome").order("id")),
    clientes: () => todos(() => sb.from("clientes").select("*").order("nome").order("id")),
    vendas: () => todos(() => sb.from("vendas").select("*").order("criado_em", { ascending: false }).order("id")),
    itens: () => todos(() => sb.from("venda_itens").select("*").order("venda_id").order("posicao")),
    tags: () => todos(() => sb.from("tags").select("*").order("criado_em", { ascending: false }).order("id")),
  };
  async function carregarAjustes() {
    const { data } = await sb.from("ajustes").select("*").eq("id", 1).single();
    if (data) E.ajustes = Object.assign(E.ajustes, { tag_valor_minimo: Number(data.tag_valor_minimo), comissao_padrao: Number(data.comissao_padrao), estoque_baixo: Number(data.estoque_baixo), telefone_fabrica: data.telefone_fabrica || "" });
  }
  function reindexar() {
    E.itens = V.montarItens(E.produtos);
    E.mapaItens = new Map(E.itens.map((i) => [i.chave, i]));
    E.leitor = V.criarLeitor({ itens: E.itens, tagMin: E.ajustes.tag_valor_minimo });
  }
  function juntarVendas(vendas, itens, tags) {
    const porVenda = new Map(), tagsVenda = new Map();
    itens.forEach((i) => { if (!porVenda.has(i.venda_id)) porVenda.set(i.venda_id, []); porVenda.get(i.venda_id).push(i); });
    tags.forEach((t) => { if (t.venda_id) { if (!tagsVenda.has(t.venda_id)) tagsVenda.set(t.venda_id, []); tagsVenda.get(t.venda_id).push(t); } });
    vendas.forEach((v) => { v.itens = porVenda.get(v.id) || []; v.tags = tagsVenda.get(v.id) || []; v.valor_total = Number(v.valor_total); v.comissao_valor = Number(v.comissao_valor); v.comissao_pct = Number(v.comissao_pct); });
    return vendas;
  }
  async function recarregar(partes) {
    const p = new Set(partes || ["produtos", "clientes", "vendas", "tags"]);
    const jobs = {};
    if (p.has("produtos")) jobs.produtos = busca.produtos();
    if (p.has("clientes")) jobs.clientes = busca.clientes();
    if (p.has("vendas")) { jobs.vendas = busca.vendas(); jobs.itens = busca.itens(); }
    if (p.has("tags") || p.has("vendas")) jobs.tags = busca.tags();
    const chaves = Object.keys(jobs);
    const res = await Promise.all(chaves.map((k) => jobs[k]));
    const r = {};
    chaves.forEach((k, i) => { r[k] = res[i]; });
    if (r.produtos) { E.produtos = r.produtos; reindexar(); }
    if (r.clientes) E.clientes = r.clientes;
    if (r.tags) E.tags = r.tags;
    if (r.vendas) E.vendas = juntarVendas(r.vendas, r.itens || [], E.tags);
    else if (r.tags) E.vendas = juntarVendas(E.vendas, E.vendas.flatMap((v) => v.itens), E.tags);
  }

  // ---------- entrar e sair ----------
  function mostrarLogin(msg) { $("app").hidden = true; $("tela-login").hidden = false; $("login-erro").textContent = msg || ""; }
  async function iniciar() {
    if (!sb) return mostrarLogin("O sistema ainda não foi ligado ao banco de dados (arquivo js/config.js).");
    const { data } = await sb.auth.getSession();
    if (data && data.session) entrar(); else mostrarLogin();
  }
  $("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const botao = e.submitter || e.target.querySelector("button");
    botao.disabled = true;
    $("login-erro").textContent = "";
    const { error } = await sb.auth.signInWithPassword({ email: $("login-email").value.trim(), password: $("login-senha").value });
    botao.disabled = false;
    if (error) return ($("login-erro").textContent = "E-mail ou senha incorretos.");
    entrar();
  });
  $("sair").addEventListener("click", async () => { await sb.auth.signOut(); location.reload(); });

  async function entrar() {
    const { data: papel, error } = await sb.rpc("papel_atual");
    if (error || !papel) {
      await sb.auth.signOut();
      return mostrarLogin(error ? "Não consegui verificar a conta: " + traduzirErro(error) : "Esta conta ainda não tem permissão para vender. Peça para a administradora liberar.");
    }
    const { data: u } = await sb.auth.getUser();
    E.papel = papel;
    E.email = (u && u.user && u.user.email) || "";
    $("tela-login").hidden = true;
    $("app").hidden = false;
    $("carregando").hidden = false;
    $("quem").textContent = E.email;
    $("link-admin").hidden = !ehAdmin();
    try {
      await carregarAjustes();
      await recarregar(["produtos", "clientes", "vendas", "tags"]);
    } catch (e) {
      $("carregando").textContent = "Não consegui carregar os dados: " + traduzirErro(e);
      return;
    }
    $("carregando").hidden = true;
    const com = ler("life-comissao", E.ajustes.comissao_padrao);
    const r = document.querySelector('input[name="comm"][value="' + (com === 5 ? 5 : 3) + '"]');
    if (r) r.checked = true;
    iniciarAbas();
    resetSaleForm();
    renderTudo();
  }

  // ---------- abas ----------
  const ABAS = ["home", "sales", "live", "stock", "tags", "reg", "bling"];
  function iniciarAbas() {
    $("abas").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) showTab(b.dataset.tab); });
    document.addEventListener("click", (e) => { const g = e.target.closest("[data-go]"); if (g) showTab(g.dataset.go); });
    let aba = "home";
    try { aba = sessionStorage.getItem("life-aba") || "home"; } catch (e) { /* sem armazenamento */ }
    showTab(ABAS.includes(aba) ? aba : "home", true);
  }
  function showTab(nome, semRolar) {
    ABAS.forEach((a) => { const p = $("panel" + a.charAt(0).toUpperCase() + a.slice(1)); p.classList.toggle("active", a === nome); });
    document.querySelectorAll("#abas [data-tab]").forEach((b) => b.classList.toggle("active", b.dataset.tab === nome));
    try { sessionStorage.setItem("life-aba", nome); } catch (e) { /* sem armazenamento */ }
    if (nome === "stock" && !E.mov.length && !E.movFim) T().carregarMov(true);
    if (nome === "home") renderHome();
    if (!semRolar) window.scrollTo({ top: 0 });
  }
  const T = () => window.LifeVendasTelas;
  function renderTudo() {
    $("countClients").textContent = String(E.clientes.length);
    $("countSales").textContent = String(E.vendas.filter((v) => v.status === "confirmada").length);
    renderDatalists(); renderQuickProducts(); renderHome(); renderSales();
    updateSaleClientInfo(); refreshAllItemRows(); updateTagBox();
    T().renderTudo();
  }
  function renderDatalists() {
    $("clientsDatalist").innerHTML = E.clientes.map((c) => `<option value="${esc(c.nome)}"></option>`).join("");
    const mods = [...new Set(E.itens.filter((i) => !i.ehTag && (i.visivel || ehAdmin())).map((i) => i.modelo))].sort((a, b) => a.localeCompare(b, "pt-BR"));
    $("saleModelsDatalist").innerHTML = mods.map((m) => `<option value="${esc(m)}"></option>`).join("") + `<option value="${esc(TAG_PRODUTO)}"></option>`;
  }

  // =====================================================================
  // INÍCIO
  // =====================================================================
  function renderHome() {
    const conf = E.vendas.filter((v) => v.status === "confirmada");
    const h = hoje();
    const dh = conf.filter((v) => dia(v.criado_em) === h);
    const totalHoje = dh.reduce((t, v) => t + v.valor_total, 0), comHoje = dh.reduce((t, v) => t + v.comissao_valor, 0);
    const hr = Number(new Date().toLocaleString("pt-BR", { timeZone: TZ, hour: "2-digit", hour12: false }));
    $("homeHi").textContent = (hr < 12 ? "Bom dia" : hr < 18 ? "Boa tarde" : "Boa noite") + " · " + diaRotulo(h);
    $("homeToday").textContent = brl(totalHoje);
    $("homeTodaySub").textContent = dh.length ? dh.length + (dh.length === 1 ? " venda" : " vendas") + " · comissão " + brl(comHoje) : "Nenhuma venda registrada hoje ainda.";
    const mes = conf.filter((v) => mesChave(v.criado_em) === h.slice(0, 7));
    const receber = conf.filter((v) => v.pagamento === "aguardando").reduce((t, v) => t + v.valor_total, 0);
    const pecas = E.itens.filter((i) => !i.ehTag && i.visivel).reduce((t, i) => t + (i.qtd || 0), 0);
    const q = (k, v, s) => `<div class="q"><div class="k">${esc(k)}</div><div class="v">${esc(v)}</div><div class="s">${esc(s)}</div></div>`;
    $("homeSummary").innerHTML = q("Este mês", brl(mes.reduce((t, v) => t + v.valor_total, 0)), mes.length + (mes.length === 1 ? " venda" : " vendas")) +
      q("A receber", brl(receber), "aguardando pagamento") + q("Em estoque", String(pecas), pecas === 1 ? "peça" : "peças");
    // o que fazer agora
    const tagsFazer = E.tags.filter((t) => t.status === "a_fazer");
    const semIniciais = tagsFazer.filter((t) => !t.iniciais);
    const aguardando = conf.filter((v) => v.pagamento === "aguardando");
    const naoBling = conf.filter((v) => v.bling_status === "nao");
    const visiveis = E.itens.filter((i) => !i.ehTag && i.visivel);
    const esgotadas = visiveis.filter(V.esgotado), baixo = visiveis.filter((i) => i.qtd != null && i.qtd > 0 && i.qtd <= E.ajustes.estoque_baixo);
    const linhas = [];
    if (semIniciais.length) linhas.push(["alert", semIniciais.length + (semIniciais.length === 1 ? " tag sem iniciais" : " tags sem iniciais"), "Complete as iniciais na aba Tags para poder mandar para a fábrica.", "tags", "Abrir"]);
    if (tagsFazer.length) linhas.push(["warn", tagsFazer.length + (tagsFazer.length === 1 ? " tag para fazer" : " tags para fazer"), "Escolha as tags do dia e envie o pedido para a fábrica.", "tags", "Abrir"]);
    if (aguardando.length) linhas.push(["warn", aguardando.length + (aguardando.length === 1 ? " venda aguardando pagamento" : " vendas aguardando pagamento"), brl(receber) + " a receber. Use \"Marcar como pago\" na aba Vendas.", "sales", "Abrir"]);
    if (naoBling.length) linhas.push(["", naoBling.length + (naoBling.length === 1 ? " venda ainda não lançada no Bling" : " vendas ainda não lançadas no Bling"), "Baixe a planilha na aba Bling e backup.", "bling", "Abrir"]);
    if (esgotadas.length || baixo.length) linhas.push(["", esgotadas.length + (esgotadas.length === 1 ? " cor esgotada" : " cores esgotadas") + " · " + baixo.length + " com estoque baixo", "Veja o que repor na aba Estoque.", "stock", "Abrir"]);
    $("homeAlerts").innerHTML = linhas.length
      ? `<div class="todo-list">${linhas.map(([cls, t, s, go, b]) => `<div class="todo-row"><span class="todo-dot ${cls}"></span><div class="todo-main"><div class="todo-title">${esc(t)}</div><div class="todo-sub">${esc(s)}</div></div><button type="button" class="btn ghost small" data-go="${go}">${b}</button></div>`).join("")}</div>`
      : '<div class="todo-list"><div class="todo-empty"><b>Tudo em dia</b>Nada pendente por aqui.</div></div>';
  }
  $("homeNewSale").addEventListener("click", () => { resetSaleForm(); showTab("sales"); $("saleClient").focus(); });
  $("homeLive").addEventListener("click", () => { showTab("live"); $("liveText").focus(); });

  // =====================================================================
  // FORMULÁRIO DE VENDA (como no sistema antigo)
  // =====================================================================
  const saleClient = $("saleClient"), saleItemsEl = $("saleItems"), saleValue = $("saleValue"), salePayment = $("salePayment");
  const saleInstallments = $("saleInstallments"), installHint = $("installHint"), saleNote = $("saleNote"), noteCount = $("noteCount");
  const commReadout = $("commReadout"), saleMsg = $("saleMsg"), valueHint = $("valueHint");
  const saleTagsBox = $("saleTagsBox"), saleTagRows = $("saleTagRows"), saleTagsNote = $("saleTagsNote");
  const saleTagForceWrap = $("saleTagForceWrap"), forceTagBtn = $("forceTagBtn"), saleClientInfo = $("saleClientInfo");
  let saleValueTouched = false, saleTagsForced = false, editingId = null, formChave = uuid(), itemSeq = 0, enviando = false;

  salePayment.innerHTML = '<option value="">Escolha…</option>' + Object.entries(PAGAMENTOS).map(([k, t]) => `<option value="${k}">${t}</option>`).join("");
  saleInstallments.innerHTML = [1, 2, 3, 4, 5, 6].map((n) => `<option value="${n}">${n}x</option>`).join("");

  const currentPct = () => { const r = document.querySelector('input[name="comm"]:checked'); return r ? parseInt(r.value, 10) : 3; };
  function updateCommReadout() {
    const v = num(saleValue.value);
    commReadout.textContent = saleValue.value.trim() && v != null && v >= 0 ? "Comissão: " + brl(V.comissao(v, currentPct())) : "";
  }
  function updatePaymentUI() {
    const credito = salePayment.value === "credito";
    saleInstallments.hidden = !credito;
    const v = num(saleValue.value), n = parseInt(saleInstallments.value, 10) || 1;
    if (credito && saleValue.value.trim() && v != null && v > 0) installHint.textContent = n + "x de " + brl(Math.round((v * 100) / n) / 100);
    else if (salePayment.value === "aguardando") installHint.textContent = "Fica pendente até você marcar como paga.";
    else installHint.textContent = "";
  }

  // catálogo. "Bia" vale para "Porta Celular Bia" e "Isis" para "Isis P" quando só existe um modelo com essa palavra
  function modeloReal(txt) {
    const n = V.norm(txt);
    if (!n) return txt;
    const mods = [...new Set(E.itens.filter((i) => !i.ehTag).map((i) => i.modelo))];
    const exato = mods.find((m) => V.norm(m) === n);
    if (exato) return exato;
    if (n.split(" ").length === 1) {
      const c = mods.filter((m) => { const w = V.norm(m).split(" "); return w[0] === n || w[w.length - 1] === n; });
      if (c.length === 1) return c[0];
    }
    return txt;
  }
  const acharLinha = (prod, cor) => E.leitor.acharItem(modeloReal(prod), cor);
  const itensDoModelo = (m) => { const real = V.norm(modeloReal(m)); return E.itens.filter((i) => !i.ehTag && V.norm(i.modelo) === real && (i.visivel || ehAdmin())); };
  const tagProdutoPorCor = (cor) => E.itens.find((i) => i.ehTag && V.chaveCor(i.cor) === V.chaveCor(cor)) || null;
  function precoUnico(itens) { const ps = [...new Set(itens.map((i) => i.preco).filter((p) => p != null))]; return ps.length === 1 ? ps[0] : null; }
  function precoDaLinha(prod, cor) {
    if (ehTagProduto(prod)) { const tp = cor ? tagProdutoPorCor(cor) : null; if (tp && tp.preco != null) return tp.preco; const ps = E.itens.filter((i) => i.ehTag && i.preco != null).map((i) => i.preco); return cor ? null : (new Set(ps).size === 1 ? ps[0] : null); }
    const achado = cor ? acharLinha(prod, cor) : null;
    if (achado) return achado.preco;
    return cor ? null : precoUnico(itensDoModelo(prod));
  }
  function linhasDoForm() {
    return [...saleItemsEl.children].map((row) => ({ row, produto: row.querySelector(".item-product").value.trim().replace(/\s+/g, " "), cor: row.querySelector(".item-color").value.trim().replace(/\s+/g, " "), qtd: parseInt(row.querySelector(".item-qty").value, 10) || 1 }));
  }
  function suggestedTotal() {
    let total = 0, known = 0, unknown = 0;
    linhasDoForm().forEach((l) => {
      if (!V.norm(l.produto)) return;
      const p = precoDaLinha(l.produto, l.cor);
      if (p == null) unknown++; else { total += p * l.qtd; known++; }
    });
    return { total: V.arred(total), known, unknown };
  }
  function applySuggestedPrice() {
    const s = suggestedTotal(), cur = num(saleValue.value);
    valueHint.innerHTML = "";
    if (s.known && !s.unknown) {
      if (!saleValueTouched) {
        saleValue.value = fmtEntrada(s.total);
        updateCommReadout(); updatePaymentUI(); updateTagBox();
        valueHint.textContent = "Preço sugerido pelo cadastro dos produtos.";
      } else if (cur == null || Math.abs(cur - s.total) > 0.004) {
        valueHint.innerHTML = "Preço sugerido: " + esc(brl(s.total)) + '<button type="button" class="link-btn" id="useSuggested">usar</button>';
        $("useSuggested").addEventListener("click", () => { saleValue.value = fmtEntrada(s.total); saleValueTouched = false; updateCommReadout(); updatePaymentUI(); updateTagBox(); applySuggestedPrice(); });
      }
    }
  }

  function refreshItemRow(row) {
    const prodV = row.querySelector(".item-product").value, corV = row.querySelector(".item-color").value;
    const qtd = parseInt(row.querySelector(".item-qty").value, 10) || 1, hint = row.querySelector(".field-hint");
    const chips = row.querySelector(".color-chips"), dl = row.querySelector("datalist");
    hint.className = "field-hint";
    if (ehTagProduto(prodV)) {
      const nome = corTagNome(corV);
      dl.innerHTML = coresTag.map((p) => `<option value="${esc(p.nome)}"></option>`).join("");
      chips.innerHTML = coresTag.map((p) => `<button type="button" class="chip${nome && p.nome === nome ? " on" : ""}" data-color="${esc(p.nome)}"><i class="chip-dot" style="background:${p.hex}"></i>${esc(p.nome)}</button>`).join("");
      const tp = nome ? tagProdutoPorCor(nome) : null;
      if (!V.norm(corV)) hint.textContent = "Tag sob encomenda (não desconta do estoque). Escolha a cor.";
      else if (!nome) { hint.textContent = "Essa cor não existe nas tags — escolha uma das cores acima."; hint.className = "field-hint warn"; }
      else hint.textContent = "Tag " + nome + (qtd > 1 ? " × " + qtd : "") + (tp && tp.preco != null ? " · " + brl(tp.preco) + " cada" : "") + ': digite as iniciais na caixa "Tag personalizada" abaixo.';
      return;
    }
    const itens = itensDoModelo(prodV).sort((a, b) => a.cor.localeCompare(b.cor, "pt-BR"));
    dl.innerHTML = itens.map((i) => `<option value="${esc(i.cor)}" label="${i.qtd == null ? "sem controle" : "restam " + i.qtd}"></option>`).join("");
    const quer = V.chaveCor(corV);
    chips.innerHTML = itens.map((i) => `<button type="button" class="chip${V.chaveCor(i.cor) === quer && corV.trim() ? " on" : ""}${i.qtd === 0 ? " off" : ""}" data-color="${esc(i.cor)}">${esc(i.cor)}${i.qtd == null ? "" : " · " + i.qtd}</button>`).join("");
    const nomeProd = itens.length ? itens[0].modelo : prodV.trim();
    if (!V.norm(prodV)) { hint.textContent = ""; return; }
    if (!itens.length) { hint.textContent = "Produto fora do estoque — não desconta nada."; return; }
    if (!V.norm(corV)) {
      const total = itens.reduce((s, i) => s + (i.qtd || 0), 0);
      hint.textContent = nomeProd + ": " + total + (total === 1 ? " peça" : " peças") + " em " + itens.length + (itens.length === 1 ? " cor" : " cores");
      return;
    }
    const item = acharLinha(prodV, corV);
    if (!item) hint.textContent = "Essa cor não está no estoque de " + nomeProd + " — não desconta nada.";
    else if (item.qtd == null) hint.textContent = nomeProd + " " + item.cor + ": sem controle de estoque";
    else if (item.qtd === 0) { hint.textContent = "Esgotado: " + nomeProd + " " + item.cor + "."; hint.className = "field-hint warn"; }
    else if (qtd > item.qtd) { hint.textContent = "Restam " + item.qtd + " de " + nomeProd + " " + item.cor + " — quantidade maior que o disponível."; hint.className = "field-hint warn"; }
    else hint.textContent = "Restam " + item.qtd + " de " + nomeProd + " " + item.cor;
  }
  function refreshAllItemRows() { [...saleItemsEl.children].forEach(refreshItemRow); }
  function updateItemRemoveButtons() { const rows = [...saleItemsEl.children]; rows.forEach((r) => { r.querySelector(".remove-item").disabled = rows.length <= 1; }); }
  function onItemsChanged() { applySuggestedPrice(); updateTagBox(); }

  function createItemRow() {
    itemSeq++;
    const listId = "colors-" + itemSeq;
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML =
      '<div class="item-fields">' +
        '<div><label>Produto</label><input type="text" class="item-product" list="saleModelsDatalist" placeholder="Ex.: Alice" autocomplete="off"></div>' +
        '<div><label>Cor</label><input type="text" class="item-color" list="' + listId + '" placeholder="Ex.: Preta" autocomplete="off"><datalist id="' + listId + '"></datalist></div>' +
        '<div><label>Qtd</label><input type="number" class="item-qty" min="1" step="1" value="1" inputmode="numeric"></div>' +
        '<button type="button" class="icon-btn danger remove-item" title="Remover produto">✕</button>' +
      "</div>" +
      '<div class="color-chips"></div><div class="field-hint"></div>';
    row.addEventListener("input", () => { setMsg(saleMsg, ""); refreshItemRow(row); onItemsChanged(); });
    row.querySelector(".color-chips").addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      row.querySelector(".item-color").value = b.getAttribute("data-color");
      refreshItemRow(row); onItemsChanged();
    });
    row.querySelector(".remove-item").addEventListener("click", () => { row.remove(); updateItemRemoveButtons(); onItemsChanged(); });
    return row;
  }
  function addItemRow(pre) {
    const row = createItemRow();
    if (pre) {
      row.querySelector(".item-product").value = pre.produto || "";
      row.querySelector(".item-color").value = pre.cor || "";
      row.querySelector(".item-qty").value = pre.qtd || 1;
    }
    saleItemsEl.appendChild(row);
    updateItemRemoveButtons();
    refreshItemRow(row);
    return row;
  }
  $("addItemBtn").addEventListener("click", () => addItemRow().querySelector(".item-product").focus());

  function renderQuickProducts() {
    const vendidos = {};
    E.vendas.forEach((v) => v.itens.forEach((i) => {
      const it = i.produto_id ? E.mapaItens.get(i.produto_id + "|" + (i.variacao || "")) : null;
      const m = it ? (it.ehTag ? TAG_PRODUTO : it.modelo) : V.separarNome(i.descricao).modelo;
      vendidos[m] = (vendidos[m] || 0) + i.quantidade;
    }));
    const nomes = [...new Set(E.itens.filter((i) => !i.ehTag && i.visivel).map((i) => i.modelo))];
    const lista = nomes.sort((a, b) => (vendidos[b] || 0) - (vendidos[a] || 0) || a.localeCompare(b, "pt-BR")).slice(0, 8);
    $("quickProducts").innerHTML = lista.map((n) => `<button type="button" class="chip" data-product="${esc(n)}">${esc(n)}</button>`).join("") +
      `<button type="button" class="chip tag-chip" data-product="${esc(TAG_PRODUTO)}"><i class="chip-dot" style="background:var(--gold)"></i>${esc(TAG_PRODUTO)}</button>`;
  }
  $("quickProducts").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    const row = [...saleItemsEl.children].find((r) => !r.querySelector(".item-product").value.trim()) || addItemRow();
    row.querySelector(".item-product").value = b.getAttribute("data-product");
    refreshItemRow(row); onItemsChanged();
    row.querySelector(".item-color").focus();
  });

  // ---- caixa de tag da venda ----
  function createTagRow(tag, onChange, onRemove) {
    tag = tag || {};
    const linked = tag.src === "item";
    const cor = tag.cor || (linked ? "" : coresTag[0].nome);
    const row = document.createElement("div");
    row.className = "tag-row";
    row.dataset.src = linked ? "item" : "";
    const sw = linked ? "" : coresTag.map((p) => `<button type="button" class="swatch${V.chaveCor(p.nome) === V.chaveCor(cor) ? " selected" : ""}" data-cor="${esc(p.nome)}" title="${esc(p.nome)}" style="background:${p.hex}"></button>`).join("");
    row.innerHTML =
      '<div class="tag-row-top">' + (linked ? '<span class="pill ok">Comprada</span>' : "") +
      '<input type="text" class="tag-initials-input" maxlength="8" placeholder="' + (linked ? "Iniciais da tag comprada" : "Iniciais (ex.: AB)") + '" value="' + esc(tag.iniciais || "") + '" autocomplete="off">' +
      (linked ? "" : '<button type="button" class="icon-btn danger remove-tag-row" title="Remover tag">✕</button>') + "</div>" +
      '<input type="hidden" class="tag-color-input" value="' + esc(cor) + '">' +
      (linked
        ? '<div class="color-name"><i class="chip-dot" style="background:' + (cor ? V.hexDaCor(cor) : "transparent") + '"></i>Cor da tag: <b>' + esc(cor || "escolha a cor no produto acima") + "</b> · definida no produto</div>"
        : '<div class="swatches">' + sw + '</div><div class="color-name">Cor da tag: <b>' + esc(cor) + "</b></div>");
    const rm = row.querySelector(".remove-tag-row");
    if (rm) rm.addEventListener("click", () => { row.remove(); if (onRemove) onRemove(); });
    row.querySelector(".tag-initials-input").addEventListener("input", (e) => { e.target.value = e.target.value.toUpperCase(); if (onChange) onChange(); });
    const box = row.querySelector(".swatches");
    if (box) box.addEventListener("click", (e) => {
      const b = e.target.closest(".swatch");
      if (!b) return;
      row.querySelector(".tag-color-input").value = b.getAttribute("data-cor");
      row.querySelectorAll(".swatch").forEach((s) => s.classList.toggle("selected", s === b));
      row.querySelector(".color-name b").textContent = b.getAttribute("data-cor");
      if (onChange) onChange();
    });
    return row;
  }
  function setLinkedTagColor(row, cor) {
    const input = row.querySelector(".tag-color-input");
    if (input.value === (cor || "")) return;
    input.value = cor || "";
    const b = row.querySelector(".color-name b"), dot = row.querySelector(".color-name .chip-dot");
    if (b) b.textContent = cor || "escolha a cor no produto acima";
    if (dot) dot.style.background = cor ? V.hexDaCor(cor) : "transparent";
  }
  function readTagRows() {
    const out = [];
    [...saleTagRows.children].forEach((row) => {
      const ini = row.querySelector(".tag-initials-input").value.trim().toUpperCase();
      const comprada = row.dataset.src === "item";
      if (!ini && !comprada) return;
      out.push({ iniciais: ini, cor: row.querySelector(".tag-color-input").value, comprada });
    });
    return out;
  }
  function syncBoughtTagRows() {
    const cores = [];
    linhasDoForm().forEach((l) => {
      if (!ehTagProduto(l.produto)) return;
      const q = Math.min(20, Math.max(1, l.qtd));
      for (let k = 0; k < q; k++) cores.push(corTagNome(l.cor));
    });
    const linked = [...saleTagRows.children].filter((r) => r.dataset.src === "item");
    cores.forEach((c, j) => {
      let r = linked[j];
      if (!r) { r = createTagRow({ src: "item", cor: c }, updateTagBox, updateTagBox); saleTagRows.appendChild(r); }
      setLinkedTagColor(r, c);
    });
    linked.slice(cores.length).forEach((r) => { if (!r.querySelector(".tag-initials-input").value.trim()) r.remove(); });
    return cores.length;
  }
  function updateTagBox() {
    const v = num(saleValue.value), min = E.ajustes.tag_valor_minimo;
    const eligible = v != null && v >= min;
    const bought = syncBoughtTagRows();
    const freeRows = [...saleTagRows.children].filter((r) => r.dataset.src !== "item");
    const hasContent = [...saleTagRows.children].some((r) => r.querySelector(".tag-initials-input").value.trim());
    const show = eligible || saleTagsForced || hasContent || bought > 0;
    saleTagsBox.hidden = !show;
    saleTagForceWrap.hidden = show;
    forceTagBtn.textContent = "+ Adicionar tag (compra abaixo de " + brl(min) + ")";
    if ((eligible || saleTagsForced) && !freeRows.length) saleTagRows.appendChild(createTagRow(null, updateTagBox, updateTagBox));
    const txt = bought + (bought === 1 ? " tag comprada" : " tags compradas");
    if (bought && eligible) saleTagsNote.textContent = txt + " + direito à tag de brinde (compra de " + brl(v) + ")";
    else if (bought) saleTagsNote.textContent = txt + ": digite as iniciais";
    else saleTagsNote.textContent = eligible ? "Compra de " + brl(v) + ": tem direito à tag personalizada" : "Abaixo de " + brl(min) + ": fora da regra, mas você pode dar a tag";
  }
  $("addSaleTagBtn").addEventListener("click", () => { const row = createTagRow(null, updateTagBox, updateTagBox); saleTagRows.appendChild(row); row.querySelector(".tag-initials-input").focus(); });
  forceTagBtn.addEventListener("click", () => { saleTagsForced = true; updateTagBox(); });

  // ---- informações da cliente ----
  const clienteExistente = (nome) => { const n = V.norm(nome); return n ? E.clientes.find((c) => V.norm(c.nome) === n) || null : null; };
  const vendasDa = (c) => E.vendas.filter((v) => v.status === "confirmada" && (v.cliente_id === c.id || V.norm(v.cliente_nome) === V.norm(c.nome)));
  const temDados = (c) => ["telefone", "email", "documento", "cep", "rua", "numero", "bairro", "cidade", "observacoes"].some((k) => String(c[k] || "").trim());
  function updateSaleClientInfo() {
    const nome = saleClient.value.trim(), c = clienteExistente(nome);
    if (!nome) { saleClientInfo.innerHTML = ""; return; }
    if (!c) { saleClientInfo.innerHTML = '<div class="info-card">Cliente nova: depois complete os dados na aba Cadastro.</div>'; return; }
    const linhas = [];
    if (c.telefone) linhas.push("<b>Tel:</b> " + esc(c.telefone));
    if (c.email) linhas.push("<b>E-mail:</b> " + esc(c.email));
    if (c.documento) linhas.push("<b>CPF/CNPJ:</b> " + esc(c.documento));
    const end = V.enderecoLinha(c);
    if (end) linhas.push("<b>Endereço:</b> " + esc(end));
    if (c.observacoes) linhas.push("<b>Obs.:</b> " + esc(c.observacoes));
    const ultima = vendasDa(c)[0];
    saleClientInfo.innerHTML = '<div class="info-card">' + (temDados(c) ? linhas.join("<br>") + "<br>" : "Sem dados de cadastro.<br>") +
      '<button type="button" class="btn ghost" data-open-reg="1">' + (temDados(c) ? "Editar dados" : "Cadastrar dados") + "</button>" +
      (ultima ? '<button type="button" class="btn ghost" data-repeat="1">Repetir a última compra</button>' : "") + "</div>";
    const ob = saleClientInfo.querySelector("[data-open-reg]");
    if (ob) ob.addEventListener("click", () => { showTab("reg"); T().abrirCliente(c); });
    const rb = saleClientInfo.querySelector("[data-repeat]");
    if (rb) rb.addEventListener("click", () => repetirUltima(c));
  }
  function linhasDaVenda(v) {
    const mapa = new Map();
    v.itens.forEach((i) => {
      const it = i.produto_id ? E.mapaItens.get(i.produto_id + "|" + (i.variacao || "")) : null;
      let produto, cor;
      if (it && it.ehTag) { produto = TAG_PRODUTO; cor = corTagNome(it.cor) || it.cor; }
      else if (it) { produto = it.modelo; cor = it.cor; }
      else { const s = V.separarNome(i.descricao); produto = s.modelo; cor = s.cor; }
      const k = V.norm(produto) + "|" + V.chaveCor(cor);
      if (!mapa.has(k)) mapa.set(k, { produto, cor, qtd: 0 });
      mapa.get(k).qtd += i.quantidade;
    });
    return [...mapa.values()];
  }
  function repetirUltima(c) {
    const ultima = vendasDa(c)[0];
    if (!ultima) return;
    saleItemsEl.innerHTML = "";
    linhasDaVenda(ultima).forEach((l) => addItemRow(l));
    updateItemRemoveButtons();
    saleValueTouched = false; saleValue.value = "";
    onItemsChanged();
    setMsg(saleMsg, "Produtos da última compra carregados. Confira o valor e o pagamento.", "ok");
  }
  saleClient.addEventListener("input", () => { setMsg(saleMsg, ""); updateSaleClientInfo(); });
  saleValue.addEventListener("input", () => { saleValueTouched = true; updateCommReadout(); updatePaymentUI(); updateTagBox(); applySuggestedPrice(); });
  salePayment.addEventListener("change", updatePaymentUI);
  saleInstallments.addEventListener("change", updatePaymentUI);
  saleNote.addEventListener("input", () => { noteCount.textContent = saleNote.value.length + "/500"; });
  document.querySelectorAll('input[name="comm"]').forEach((r) => r.addEventListener("change", () => { gravar("life-comissao", Number(r.value)); updateCommReadout(); }));

  // ---- registrar / editar ----
  function setSaleEditUI(v) {
    editingId = v ? v.id : null;
    $("saleEditBanner").hidden = !v;
    if (v) $("saleEditName").textContent = v.cliente_nome;
    $("saleFormTitle").textContent = v ? "Editar venda" : "Nova venda";
    $("saleBtn").textContent = v ? "Salvar alterações" : "Registrar venda";
  }
  $("saleEditCancel").addEventListener("click", () => { resetSaleForm(); setMsg(saleMsg, ""); });
  function resetSaleForm() {
    setSaleEditUI(null);
    formChave = uuid();
    saleClient.value = "";
    saleItemsEl.innerHTML = "";
    addItemRow();
    saleValue.value = ""; saleValueTouched = false;
    salePayment.value = ""; saleInstallments.value = "1";
    saleNote.value = ""; noteCount.textContent = "0/500";
    saleTagRows.innerHTML = ""; saleTagsForced = false; saleTagsBox.hidden = true;
    valueHint.innerHTML = "";
    updateSaleClientInfo(); updateCommReadout(); updatePaymentUI(); updateTagBox();
  }
  // preenche o formulário (usado ao revisar uma venda da live, repetir ou editar)
  function preencherForm(d) {
    saleClient.value = d.nome || "";
    saleItemsEl.innerHTML = "";
    (d.linhas && d.linhas.length ? d.linhas : [{}]).forEach((l) => addItemRow(l));
    updateItemRemoveButtons();
    saleValue.value = d.valor != null ? fmtEntrada(d.valor) : ""; saleValueTouched = d.valor != null;
    salePayment.value = d.pagamento || ""; saleInstallments.value = String(d.parcelas || 1);
    const r = document.querySelector('input[name="comm"][value="' + (d.pct === 5 ? 5 : 3) + '"]'); if (r) r.checked = true;
    saleNote.value = d.obs || ""; noteCount.textContent = saleNote.value.length + "/500";
    saleTagRows.innerHTML = ""; saleTagsForced = false;
    syncBoughtTagRows();
    const compradas = [...saleTagRows.children].filter((r2) => r2.dataset.src === "item");
    (d.tagsCompradas || []).forEach((t, k) => { if (compradas[k]) compradas[k].querySelector(".tag-initials-input").value = t.iniciais || ""; });
    (d.tagsLivres || []).forEach((t) => { saleTagRows.appendChild(createTagRow({ iniciais: t.iniciais, cor: t.cor }, updateTagBox, updateTagBox)); });
    if ((d.tagsLivres || []).length) saleTagsForced = true;
    valueHint.innerHTML = "";
    updateSaleClientInfo(); refreshAllItemRows(); updateCommReadout(); updatePaymentUI(); updateTagBox();
    if (d.valor == null) applySuggestedPrice();
  }

  // monta o pedido para o banco (usado pelo formulário e pela live)
  function precificar(itens, valor) {
    const conhecido = itens.reduce((t, i) => t + (i.preco != null ? i.preco * i.quantidade : 0), 0);
    const qtdSem = itens.filter((i) => i.preco == null).reduce((t, i) => t + i.quantidade, 0);
    const qtdCom = itens.filter((i) => i.preco != null).reduce((t, i) => t + i.quantidade, 0);
    const media = qtdCom ? conhecido / qtdCom : 0;
    const estimado = qtdSem ? (valor > conhecido ? (valor - conhecido) / qtdSem : media || valor / itens.reduce((t, i) => t + i.quantidade, 0)) : 0;
    const base = itens.map((i) => ({ preco_unit: i.preco != null ? i.preco : estimado, quantidade: i.quantidade }));
    const { unit } = V.ratear({ valor_total: valor, itens: base });
    return itens.map((i, k) => Object.assign({}, i, { preco_unit: unit[k] }));
  }
  function montarPedido(d, chave, origem) {
    const itens = [];
    let kTag = 0;
    d.linhas.forEach((l) => {
      if (ehTagProduto(l.produto)) {
        const nome = corTagNome(l.cor) || l.cor;
        const tp = tagProdutoPorCor(nome);
        for (let k = 0; k < l.qtd; k++) {
          const t = (d.tagsCompradas || [])[kTag++] || {};
          itens.push({ produto_id: tp ? tp.produto_id : null, variacao: tp ? tp.variacao : "", codigo: tp ? tp.codigo : null, descricao: tp ? tp.nome : "Tag Personalizável - " + nome,
            quantidade: 1, preco: tp ? tp.preco : null, tag: { iniciais: t.iniciais || "", cor: t.cor || nome } });
        }
      } else {
        const it = acharLinha(l.produto, l.cor);
        itens.push(it ? { produto_id: it.produto_id, variacao: it.variacao, codigo: it.codigo, descricao: it.nome, quantidade: l.qtd, preco: it.preco, tag: null }
          : { produto_id: null, variacao: "", codigo: null, descricao: String(l.produto + " " + (l.cor || "")).trim(), quantidade: l.qtd, preco: null, tag: null });
      }
    });
    const info = d.info || {};
    const limpo = (s) => String(s || "").trim();
    return {
      chave, cliente_nome: d.nome, origem,
      cliente: { telefone: limpo(info.telefone), email: limpo(info.email), documento: limpo(info.documento), cep: limpo(info.cep), rua: limpo(info.rua), numero: limpo(info.numero), complemento: limpo(info.complemento), bairro: limpo(info.bairro), cidade: limpo(info.cidade), uf: limpo(info.uf) },
      valor_total: d.valor, pagamento: d.pagamento, parcelas: d.pagamento === "credito" ? Number(d.parcelas) || 1 : null, comissao_pct: d.pct,
      observacao: limpo(d.obs).slice(0, 500) || null,
      itens: precificar(itens, d.valor).map((i) => ({ produto_id: i.produto_id, variacao: i.variacao, codigo: i.codigo, descricao: i.descricao, quantidade: i.quantidade, preco_unit: i.preco_unit,
        tag: i.tag ? { iniciais: String(i.tag.iniciais || "").toUpperCase(), cor: i.tag.cor || "" } : null })),
      tags_venda: (d.tagsLivres || []).map((t) => ({ iniciais: String(t.iniciais || "").toUpperCase(), cor: t.cor || "", origem: "brinde" })),
    };
  }
  async function enviarVenda(pedido, editId) {
    const { data, error } = editId ? await sb.rpc("editar_venda", { p_id: editId, p: pedido }) : await sb.rpc("confirmar_venda", { p: pedido });
    if (error) throw new Error(error.message);
    return data;
  }

  function lerFormulario() {
    const aviso2 = (texto, foco) => { setMsg(saleMsg, texto, "warn"); if (foco) foco.focus(); return null; };
    const nome = saleClient.value.trim().replace(/\s+/g, " ");
    if (!nome) return aviso2("Digite o nome da cliente.", saleClient);
    const linhas = [], rows = linhasDoForm();
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i], pEl = r.row.querySelector(".item-product"), cEl = r.row.querySelector(".item-color"), qEl = r.row.querySelector(".item-qty");
      if (!r.produto && !r.cor && rows.length > 1) continue;
      if (!r.produto) return aviso2("Informe o produto.", pEl);
      if (ehTagProduto(r.produto)) {
        if (!r.cor) return aviso2("Escolha a cor da tag.", cEl);
        if (!corTagNome(r.cor)) return aviso2('A cor "' + r.cor + '" não existe nas tags. Escolha uma das cores.', cEl);
      } else if (itensDoModelo(r.produto).length && !r.cor) return aviso2("Escolha a cor de " + r.produto + ".", cEl);
      const q = parseInt(qEl.value, 10);
      if (!(q >= 1)) return aviso2("A quantidade deve ser 1 ou mais.", qEl);
      if (!ehTagProduto(r.produto)) {
        const it = acharLinha(r.produto, r.cor);
        if (it && it.qtd != null && q > it.qtd + (editando() ? devolvido(it) : 0)) return aviso2("Estoque insuficiente: restam " + (it.qtd + (editando() ? devolvido(it) : 0)) + " de " + it.nome + " (pedido: " + q + ").", qEl);
      }
      linhas.push({ produto: r.produto, cor: r.cor, qtd: q });
    }
    if (!linhas.length) return aviso2("Informe o produto.", rows[0].row.querySelector(".item-product"));
    const valor = num(saleValue.value);
    if (valor == null || valor < 0) return aviso2("Informe o valor da venda.", saleValue);
    if (!salePayment.value) return aviso2("Escolha a forma de pagamento.", salePayment);
    const tags = readTagRows();
    return {
      nome, linhas, valor, pagamento: salePayment.value, parcelas: salePayment.value === "credito" ? parseInt(saleInstallments.value, 10) || 1 : null,
      pct: currentPct(), obs: saleNote.value.slice(0, 500).trim(), tagsCompradas: tags.filter((t) => t.comprada), tagsLivres: tags.filter((t) => !t.comprada),
    };
  }
  const editando = () => (editingId ? E.vendas.find((v) => v.id === editingId) : null);
  function devolvido(it) {
    const v = editando();
    if (!v || v.origem === "legado") return 0;
    return v.itens.filter((i) => i.baixou_estoque && i.produto_id === it.produto_id && (i.variacao || "") === (it.variacao || "")).reduce((t, i) => t + i.quantidade, 0);
  }
  function textoParcial(d, extra) {
    const c = clienteExistente(d.nome) || {};
    return V.montarTexto({
      numero: extra && extra.numero, data: dataCurta(new Date().toISOString()), cliente_nome: d.nome, cliente: c, valor_total: d.valor, pagamento: d.pagamento, parcelas: d.parcelas, observacao: d.obs,
      itens: d.linhas.map((l) => { const it = ehTagProduto(l.produto) ? null : acharLinha(l.produto, l.cor); return { quantidade: l.qtd, modelo: it ? it.modelo : l.produto, descricao: it ? it.nome : l.produto, cor: it ? it.cor : l.cor, codigo: it ? it.codigo : "", preco_unit: it && it.preco != null ? it.preco : 0 }; }),
      tags_venda: d.tagsCompradas.concat(d.tagsLivres).map((t) => ({ iniciais: t.iniciais, cor: t.cor })),
    }, formatoTexto());
  }
  const formatoTexto = () => Object.assign({ modelo: V.MODELO_TEXTO, item: V.MODELO_ITEM }, ler("life-formato-texto-v2", {}));

  $("saleCopyBtn").addEventListener("click", async () => {
    const d = lerFormulario();
    if (!d) return;
    const ok = await copiar(textoParcial(d));
    setMsg(saleMsg, ok ? "Texto copiado. A venda ainda NÃO foi registrada." : "Não consegui copiar o texto.", ok ? "ok" : "warn");
  });
  async function handleSale() {
    if (enviando) return;
    const d = lerFormulario();
    if (!d) return;
    const eraEdicao = editingId;
    enviando = true; $("saleBtn").disabled = true;
    try {
      const pedido = montarPedido(d, formChave, "manual");
      const res = await enviarVenda(pedido, eraEdicao);
      const linhaUnica = d.linhas.length === 1 && !ehTagProduto(d.linhas[0].produto) ? acharLinha(d.linhas[0].produto, d.linhas[0].cor) : null;
      await recarregar(["produtos", "clientes", "vendas", "tags"]);
      let msg = (eraEdicao ? "Venda atualizada" : "Venda registrada") + (res && res.repetida ? " (já estava registrada, não foi duplicada)" : "") + (d.linhas.length > 1 ? " com " + d.linhas.length + " produtos" : "");
      const novo = linhaUnica ? E.mapaItens.get(linhaUnica.chave) : null;
      if (novo && novo.qtd != null) msg += " — restam " + novo.qtd + " de " + novo.modelo + " " + novo.cor + ".";
      else msg += ".";
      const semIniciais = [...d.tagsCompradas, ...d.tagsLivres].filter((t) => !t.iniciais).length;
      if (semIniciais) msg += " Falta cadastrar as iniciais da tag (aba Tags).";
      else if (d.tagsCompradas.length || d.tagsLivres.length) msg += ' A tag já está na lista "A fazer" da aba Tags.';
      resetSaleForm();
      renderTudo();
      setMsg(saleMsg, msg, "ok");
      saleClient.focus();
    } catch (e) {
      setMsg(saleMsg, traduzirErro(e), "warn");
      recarregar(["produtos"]).then(() => { refreshAllItemRows(); }).catch(() => {});
    } finally { enviando = false; $("saleBtn").disabled = false; }
  }
  $("saleBtn").addEventListener("click", handleSale);

  function startEditSale(id) {
    const v = E.vendas.find((x) => x.id === id);
    if (!v) return;
    setSaleEditUI(v);
    formChave = uuid();
    const sentTags = v.tags.filter((t) => t.status !== "a_fazer" && t.status !== "cancelada");
    const abertas = v.tags.filter((t) => t.status === "a_fazer");
    const ehItemTag = (t) => { const i = v.itens.find((x) => x.id === t.venda_item_id); const it = i && i.produto_id ? E.mapaItens.get(i.produto_id + "|" + (i.variacao || "")) : null; return !!(it && it.ehTag); };
    const compradas = abertas.filter(ehItemTag), livres = abertas.filter((t) => !ehItemTag(t));
    const c = E.clientes.find((x) => x.id === v.cliente_id);
    preencherForm({
      nome: v.cliente_nome, linhas: linhasDaVenda(v), valor: v.valor_total, pagamento: v.pagamento, parcelas: v.parcelas, pct: v.comissao_pct, obs: v.observacao || "",
      tagsCompradas: compradas.map((t) => ({ iniciais: t.iniciais || "", cor: t.cor })), tagsLivres: livres.map((t) => ({ iniciais: t.iniciais || "", cor: t.cor })),
    });
    setMsg(saleMsg, sentTags.length ? "Já enviada(s) à fábrica e mantida(s) como estão: " + sentTags.map((t) => (t.iniciais || "?") + " (" + t.cor + ")").join(", ") + "." : "", sentTags.length ? "ok" : "");
    if (c) updateSaleClientInfo();
    showTab("sales", true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function novaVendaPara(nome) {
    resetSaleForm();
    saleClient.value = nome;
    updateSaleClientInfo();
    showTab("sales");
    saleItemsEl.querySelector(".item-product").focus();
  }

  // =====================================================================
  // HISTÓRICO DE VENDAS
  // =====================================================================
  const salesMonth = $("salesMonth"), salesDay = $("salesDay"), salesComm = $("salesComm"), salesBling = $("salesBling"), salesSearch = $("salesSearch");
  const salesDayClear = $("salesDayClear"), salesPdfBtn = $("salesPdfBtn"), salesPdfMsg = $("salesPdfMsg");
  let ultimaLista = null;
  const ehPendente = (v) => v.pagamento === "aguardando";
  function palhaDe(v) {
    if (!v._h) {
      const c = E.clientes.find((x) => x.id === v.cliente_id) || {};
      v._h = V.norm([v.cliente_nome, "#" + numeroDe(v), String(numeroDe(v)), v.numero, v.observacao, pagTexto(v), ehPendente(v) ? "aguardando pendente" : "", c.telefone, c.documento, c.email, c.cidade,
        v.itens.map((i) => i.descricao + " " + (i.codigo || "")).join(" "), v.tags.map((t) => "tag " + (t.iniciais || "") + " " + t.cor).join(" ")].join(" "));
    }
    return v._h;
  }
  function textoDaVenda(v) {
    const c = E.clientes.find((x) => x.id === v.cliente_id) || {};
    return V.montarTexto({
      numero: numeroDe(v), data: dataCurta(v.criado_em), cliente_nome: v.cliente_nome, cliente: c, valor_total: v.valor_total, pagamento: v.pagamento, parcelas: v.parcelas, observacao: v.observacao || "",
      itens: v.itens.map((i) => { const it = i.produto_id ? E.mapaItens.get(i.produto_id + "|" + (i.variacao || "")) : null; const s = V.separarNome(i.descricao); return { quantidade: i.quantidade, modelo: it ? (it.ehTag ? TAG_PRODUTO : it.modelo) : s.modelo, descricao: i.descricao, cor: it ? it.cor : s.cor, codigo: i.codigo, preco_unit: Number(i.preco_unit) }; }),
      tags_venda: v.tags.filter((t) => t.status !== "cancelada").map((t) => ({ iniciais: t.iniciais, cor: t.cor })),
    }, formatoTexto());
  }
  async function atualizarVenda(id, dados, msg) {
    const { error } = await sb.from("vendas").update(dados).eq("id", id);
    if (error) throw error;
    await recarregar(["vendas"]);
    renderTudo();
    if (msg) aviso(msg);
  }
  function renderClientResults(tokens) {
    const box = $("salesClientResults");
    box.innerHTML = "";
    if (!tokens.length) return;
    const achadas = E.clientes.filter((c) => { const h = V.norm([c.nome, c.telefone, c.documento, c.email, c.cidade].join(" ")); return tokens.every((t) => h.includes(t)); }).slice(0, 5);
    if (!achadas.length) return;
    const t = document.createElement("div");
    t.className = "results-title"; t.textContent = achadas.length === 1 ? "Cliente encontrada" : "Clientes encontradas";
    box.appendChild(t);
    achadas.forEach((c) => {
      const minhas = vendasDa(c), total = minhas.reduce((s, v) => s + v.valor_total, 0);
      const contato = [c.telefone, c.email].filter(Boolean).join(" · "), end = V.enderecoLinha(c);
      const card = document.createElement("div");
      card.className = "client-card";
      card.innerHTML = '<div class="cc-main"><div><span class="cc-name">' + esc(c.nome) + "</span></div>" + (contato ? '<div class="cc-sub">' + esc(contato) + "</div>" : "") + (end ? '<div class="cc-sub">' + esc(end) + "</div>" : "") +
        '<div class="cc-sub">' + minhas.length + (minhas.length === 1 ? " compra" : " compras") + " · " + brl(total) + "</div></div>" +
        '<div class="cc-actions"><button type="button" class="btn ghost" data-act="reg">Cadastro</button><button type="button" class="btn" data-act="new">Nova venda</button></div>';
      card.querySelector('[data-act="reg"]').addEventListener("click", () => { showTab("reg"); T().abrirCliente(c); });
      card.querySelector('[data-act="new"]').addEventListener("click", () => novaVendaPara(c.nome));
      box.appendChild(card);
    });
  }
  function renderTiles(el, tiles) {
    el.innerHTML = tiles.map((t) => `<div class="stat${t.alert ? " alert" : ""}"><div class="k">${esc(t.k)}</div><div class="v">${esc(t.v)}</div>${t.s ? `<div class="s">${esc(t.s)}</div>` : ""}</div>`).join("");
  }
  function renderSales() {
    const prev = salesMonth.value || "all";
    const chaves = [...new Set(E.vendas.map((v) => mesChave(v.criado_em)))].sort().reverse();
    salesMonth.innerHTML = '<option value="all">Todos os meses</option>' + chaves.map((k) => `<option value="${k}">${esc(mesRotulo(k))}</option>`).join("");
    salesMonth.value = prev === "all" || chaves.includes(prev) ? prev : "all";
    const mes = salesMonth.value, dsel = salesDay.value;
    salesMonth.disabled = !!dsel; salesDayClear.hidden = !dsel;
    const q = V.norm(salesSearch.value), tokens = q ? q.split(" ") : [], blingSel = salesBling.value, mostrarCanc = $("salesCanceled").checked;
    const base = E.vendas.filter((v) => {
      if (v.status === "cancelada" && !mostrarCanc) return false;
      if (dsel) { if (dia(v.criado_em) !== dsel) return false; } else if (mes !== "all" && mesChave(v.criado_em) !== mes) return false;
      const noBling = v.bling_status === "exportada" || v.bling_status === "enviada";
      if (blingSel === "yes" && !noBling) return false;
      if (blingSel === "no" && noBling) return false;
      if (tokens.length) { const h = palhaDe(v); if (!tokens.every((t) => h.includes(t))) return false; }
      return true;
    });
    renderClientResults(tokens);
    const commSel = salesComm.value;
    const lista = base.filter((v) => commSel === "all" || String(v.comissao_pct) === commSel);
    const ativas = lista.filter((v) => v.status === "confirmada");
    const total = ativas.reduce((s, v) => s + v.valor_total, 0), comm = ativas.reduce((s, v) => s + v.comissao_valor, 0);
    const porPct = (p) => base.filter((v) => v.status === "confirmada" && v.comissao_pct === p).reduce((s, v) => s + v.comissao_valor, 0);
    const pend = ativas.filter(ehPendente).reduce((s, v) => s + v.valor_total, 0);
    const escopo = dsel ? diaCurto(dsel) : mes === "all" ? "todas as vendas" : mesRotulo(mes);
    renderTiles($("salesSummary"), [
      { k: "Vendas", v: String(ativas.length), s: escopo }, { k: "Total vendido", v: brl(total), s: escopo },
      { k: "A receber", v: brl(pend), s: "aguardando pagamento", alert: pend > 0 }, { k: "Comissão total", v: brl(comm), s: "3%: " + brl(porPct(3)) + " · 5%: " + brl(porPct(5)) },
    ]);
    ultimaLista = { lista, escopo, total, comm, pend, c3: porPct(3), c5: porPct(5) };
    salesPdfBtn.hidden = !ativas.length;
    const el = $("salesList");
    el.innerHTML = "";
    if (!lista.length) {
      const vazio = document.createElement("div");
      vazio.className = "empty-state";
      vazio.textContent = E.vendas.length ? "Nenhuma venda encontrada neste filtro." : "Nenhuma venda registrada ainda.";
      el.appendChild(vazio);
      return;
    }
    const totaisDia = {};
    lista.forEach((v) => { if (v.status !== "confirmada") return; const k = dia(v.criado_em), t = totaisDia[k] || (totaisDia[k] = { n: 0, soma: 0 }); t.n++; t.soma += v.valor_total; });
    let ultimoDia = "";
    lista.forEach((v) => {
      const dk = dia(v.criado_em);
      if (dk !== ultimoDia) {
        ultimoDia = dk;
        const t = totaisDia[dk] || { n: 0, soma: 0 };
        const head = document.createElement("div");
        head.className = "day-head";
        head.innerHTML = "<span>" + esc(diaRotulo(dk)) + "</span><span>" + t.n + (t.n === 1 ? " venda" : " vendas") + " · " + brl(t.soma) + "</span>";
        el.appendChild(head);
      }
      const cancelada = v.status === "cancelada", pend2 = ehPendente(v) && !cancelada;
      const tagsVivas = v.tags.filter((t) => t.status !== "cancelada");
      const chips = tagsVivas.length ? '<span class="chips-inline">' + tagsVivas.map((t) => miniTag(t.iniciais, t.cor, true)).join("") + "</span>" : "";
      const semIni = !cancelada && tagsVivas.some((t) => !t.iniciais && t.status === "a_fazer") ? ' <span class="pill wait">Tag sem iniciais</span>' : "";
      const noBling = v.bling_status === "exportada" || v.bling_status === "enviada";
      const pagoSel = pend2 ? '<select class="paid-select" aria-label="Marcar como pago"><option value="">Marcar como pago…</option><option value="pix">Pix</option>' + [1, 2, 3, 4, 5, 6].map((n) => `<option value="c${n}">Crédito ${n}x</option>`).join("") + "</select>" : "";
      const row = document.createElement("div");
      row.className = "sale-row" + (cancelada ? " cancelada" : "");
      row.innerHTML = '<div class="sale-main"><div><span class="sale-num">#' + esc(numeroDe(v)) + '</span><span class="sale-name">' + esc(v.cliente_nome) + "</span>" + chips + semIni +
          (cancelada ? ' <span class="pill out">Cancelada</span>' : noBling ? ' <span class="pill ok">No Bling</span>' : "") + (v.origem === "legado" ? ' <span class="pill neutro">Antiga</span>' : "") + "</div>" +
        v.itens.map((i) => '<div class="sale-sub">' + esc(i.descricao) + " × " + i.quantidade + "</div>").join("") +
        '<div class="sale-sub">' + (pend2 ? '<span class="pill wait">Aguardando pagamento</span>' : esc(pagTexto(v))) + " · " + hora(v.criado_em) + (v.origem === "live" ? " · live" : "") + "</div>" +
        (v.observacao ? '<div class="sale-note">' + esc(v.observacao) + "</div>" : "") + (cancelada && v.cancelada_motivo ? '<div class="sale-note">Cancelada: ' + esc(v.cancelada_motivo) + "</div>" : "") + "</div>" +
        '<div class="sale-money"><div class="sale-value">' + brl(v.valor_total) + '</div><div class="sale-comm">comissão ' + String(v.comissao_pct).replace(".", ",") + "% · " + brl(v.comissao_valor) + "</div>" + pagoSel +
        (cancelada ? "" : '<div class="sale-tools">' + (pend2 ? '<button type="button" class="btn ghost" data-act="charge">Cobrar</button>' : "") + '<button type="button" class="btn ghost" data-act="copy">Copiar</button>' +
          '<button type="button" class="btn ghost" data-act="bling">' + (noBling ? "✓ No Bling" : "Marcar no Bling") + "</button></div>") + "</div>" +
        (cancelada ? "" : '<div class="client-actions"><button type="button" class="icon-btn" data-act="edit" title="Editar venda">✎</button><button type="button" class="icon-btn danger" data-act="remove" title="Excluir venda (devolve ao estoque)">✕</button></div>');
      const on = (sel, fn) => { const b = row.querySelector(sel); if (b) b.addEventListener("click", () => fn(b)); };
      on('[data-act="edit"]', () => startEditSale(v.id));
      on('[data-act="remove"]', (b) => armConfirm(b, async () => {
        const { error } = await sb.rpc("cancelar_venda", { p_id: v.id, p_motivo: "Excluída na tela de vendas" });
        if (error) { aviso(traduzirErro(error), true); return; }
        await recarregar(["produtos", "vendas", "tags"]); renderTudo(); aviso("Venda excluída. O estoque foi devolvido.");
      }));
      const ps = row.querySelector(".paid-select");
      if (ps) ps.addEventListener("change", async () => {
        if (!ps.value) return;
        const dados = ps.value === "pix" ? { pagamento: "pix", parcelas: null } : { pagamento: "credito", parcelas: parseInt(ps.value.slice(1), 10) || 1 };
        try { await atualizarVenda(v.id, Object.assign(dados, { pago_em: new Date().toISOString() }), "Pagamento registrado."); } catch (e) { aviso(traduzirErro(e), true); }
      });
      on('[data-act="charge"]', () => {
        const c = E.clientes.find((x) => x.id === v.cliente_id) || {}, primeiro = String(v.cliente_nome || "").split(" ")[0];
        const texto = "Olá, " + primeiro + "! Tudo bem? Passando para lembrar do pagamento da sua compra (#" + numeroDe(v) + ") no valor de " + brl(v.valor_total) + ". Posso te ajudar com a forma de pagamento? Obrigada!";
        if (!waNumero(c.telefone)) { copiar(texto).then((ok) => setMsg(salesPdfMsg, ok ? "Sem telefone cadastrado: a mensagem de cobrança foi copiada." : "Sem telefone cadastrado e não consegui copiar a mensagem.", "warn")); return; }
        abrirWhats(c.telefone, texto, salesPdfMsg, "Abrindo o WhatsApp com a cobrança de " + primeiro + "...");
      });
      on('[data-act="copy"]', async () => {
        const texto = textoDaVenda(v), antigo = row.querySelector(".copy-box");
        if (antigo) antigo.remove();
        if (await copiar(texto)) setMsg(salesPdfMsg, "Pedido #" + numeroDe(v) + " copiado. Cole no Bling.", "ok");
        else { const ta = document.createElement("textarea"); ta.className = "copy-box"; ta.readOnly = true; ta.value = texto; ta.style.flexBasis = "100%"; row.appendChild(ta); ta.focus(); ta.select(); setMsg(salesPdfMsg, "Não consegui copiar sozinho: o texto do pedido está selecionado, é só copiar.", "warn"); }
      });
      on('[data-act="bling"]', async () => {
        try { await atualizarVenda(v.id, noBling ? { bling_status: "nao", bling_em: null } : { bling_status: "exportada", bling_em: new Date().toISOString() }); } catch (e) { aviso(traduzirErro(e), true); }
      });
      el.appendChild(row);
    });
  }
  [salesBling, salesMonth, salesDay, salesComm, $("salesCanceled")].forEach((e) => e.addEventListener("change", renderSales));
  salesSearch.addEventListener("input", renderSales);
  $("salesToday").addEventListener("click", () => { salesDay.value = hoje(); renderSales(); });
  salesDayClear.addEventListener("click", () => { salesDay.value = ""; renderSales(); });
  salesPdfBtn.addEventListener("click", () => {
    if (!ultimaLista) return;
    const ativas = ultimaLista.lista.filter((v) => v.status === "confirmada").slice().sort((a, b) => new Date(a.criado_em) - new Date(b.criado_em));
    imprimir(`<h1>Vendas · Life Ateliê</h1><p>${esc(ultimaLista.escopo)} · ${ativas.length} vendas · total ${esc(brl(ultimaLista.total))} · comissões ${esc(brl(ultimaLista.comm))} (3%: ${esc(brl(ultimaLista.c3))} · 5%: ${esc(brl(ultimaLista.c5))}) · a receber ${esc(brl(ultimaLista.pend))}</p>
      <table class="tp-table"><thead><tr><th>Nº</th><th>Data</th><th>Cliente</th><th>Produtos</th><th>Pagamento</th><th>Total</th><th>Comissão</th></tr></thead><tbody>${ativas.map((v) => `<tr><td>#${esc(numeroDe(v))}</td><td>${esc(dataCurta(v.criado_em))}</td><td>${esc(v.cliente_nome)}</td><td>${esc(v.itens.map((i) => i.quantidade + "x " + i.descricao).join("; "))}</td><td>${esc(pagTexto(v))}</td><td>${esc(brl(v.valor_total))}</td><td>${esc(brl(v.comissao_valor))}</td></tr>`).join("")}</tbody></table>`);
  });

  // =====================================================================
  // exportado para as outras abas
  // =====================================================================
  window.LifeVendasNucleo = {
    E, V, $, esc, sb, brl, ler, gravar, apagar, uuid, num, fmtEntrada, dia, mesChave, hoje, hora, dataHora, dataCurta, diaCurto, somaDias, mesRotulo, ehAdmin, numeroDe, pagTexto, aviso, setMsg, armConfirm,
    traduzirErro, copiar, baixarArquivo, imprimir, abrirWhats, waNumero, miniTag, recarregar, renderTudo, showTab, ehTagProduto, corTagNome, coresTag, tagProdutoPorCor, montarPedido, enviarVenda,
    preencherForm, novaVendaPara, resetSaleForm, startEditSale, clienteExistente, vendasDa, formatoTexto, textoDaVenda, renderTiles, renderSales, renderHome, refreshAllItemRows, PAGAMENTOS, TAG_PRODUTO,
    get currentPct() { return currentPct; },
  };

  // vendas-telas.js é carregado logo depois deste arquivo; a tela só inicia quando a página terminou de carregar
  window.addEventListener("DOMContentLoaded", iniciar);
})();
