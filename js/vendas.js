// Life Ateliê - tela de vendas, estoque, tags e clientes (usa o mesmo banco do catálogo).
(function () {
  "use strict";
  const { cfg, esc, configurado } = window.Life;
  const V = window.VendasLib;
  const $ = (id) => document.getElementById(id);
  // window.__sbTeste só existe nos testes automáticos (banco de mentira na memória)
  const sb = window.__sbTeste || (configurado() ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null);
  const TZ = "America/Sao_Paulo";

  const E = {
    papel: "", email: "", produtos: [], itens: [], mapaItens: new Map(), clientes: [], vendas: [], tags: [], mov: [], movFim: false,
    ajustes: { tag_valor_minimo: 399, comissao_padrao: 3, estoque_baixo: 1, telefone_fabrica: "" }, leitor: null,
  };
  const F = { vendas: { de: "", ate: "", busca: "", status: "todas" }, tags: { st: "a_fazer", busca: "", sel: new Set() }, estoque: { filtro: "todos", busca: "", ocultos: false } };
  let R = null; // rascunho da venda em andamento
  let lives = []; // rascunhos lidos da live
  let comLive = 3;

  // ---------- utilidades ----------
  const ler = (k, padrao) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? padrao : v; } catch (e) { return padrao; } };
  const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento: segue sem salvar */ } };
  const apagar = (k) => { try { localStorage.removeItem(k); } catch (e) { /* idem */ } };
  const uuid = () => (window.crypto && crypto.randomUUID ? crypto.randomUUID() : "k" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
  const num = (s) => { const n = V.lerValor(s); return isNaN(n) ? null : n; };
  const dia = (iso) => new Date(iso).toLocaleDateString("sv-SE", { timeZone: TZ });
  const dataHora = (iso) => new Date(iso).toLocaleString("pt-BR", { timeZone: TZ, day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  const dataCurta = (iso) => new Date(iso).toLocaleDateString("pt-BR", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "2-digit" });
  const hoje = () => dia(new Date());
  const somaDias = (iso, n) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return d.toLocaleDateString("sv-SE"); };
  const ehAdmin = () => E.papel === "admin";

  let avisoTimer = 0;
  function aviso(texto, erro) {
    const a = $("aviso");
    a.textContent = texto;
    a.className = "aviso" + (erro ? " erro-aviso" : "");
    a.hidden = false;
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(() => { a.hidden = true; }, erro ? 6000 : 3500);
  }
  function traduzirErro(e) {
    const m = String((e && e.message) || e || "");
    if (/failed to fetch|networkerror|load failed|network request/i.test(m)) return "Sem conexão com a internet. Nada foi registrado. Tente de novo.";
    if (/jwt|not authenticated|permission denied/i.test(m)) return "Sua sessão acabou ou você não tem permissão. Saia e entre de novo.";
    return m || "Algo deu errado.";
  }
  async function copiar(texto) {
    try {
      if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(texto); return true; }
    } catch (e) { /* tenta o jeito antigo */ }
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
    vendas.forEach((v) => { v.itens = porVenda.get(v.id) || []; v.tags = tagsVenda.get(v.id) || []; v.valor_total = Number(v.valor_total); v.comissao_valor = Number(v.comissao_valor); });
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

  // ---------- entrar ----------
  function mostrarLogin(msg) {
    $("app").hidden = true;
    $("tela-login").hidden = false;
    $("login-erro").textContent = msg || "";
  }
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
    comLive = ler("life-com-live", E.ajustes.comissao_padrao) === 5 ? 5 : 3;
    prepararRascunho();
    iniciarAbas();
    renderTudo();
  }

  // ---------- abas ----------
  const ABAS = ["vender", "vendas", "tags", "estoque", "mais"];
  function iniciarAbas() {
    $("abas").addEventListener("click", (e) => { const b = e.target.closest("[data-aba]"); if (b) abrirAba(b.dataset.aba); });
    let aba = "vender";
    try { aba = sessionStorage.getItem("life-aba") || "vender"; } catch (e) { /* sem armazenamento */ }
    abrirAba(ABAS.includes(aba) ? aba : "vender");
  }
  function abrirAba(nome) {
    ABAS.forEach((a) => { $("sec-" + a).hidden = a !== nome; });
    document.querySelectorAll("#abas [data-aba]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.aba === nome)));
    try { sessionStorage.setItem("life-aba", nome); } catch (e) { /* sem armazenamento */ }
    if (nome === "estoque" && !E.mov.length && !E.movFim) carregarMov(true);
    window.scrollTo({ top: 0 });
  }
  function renderTudo() {
    renderCliente(); renderResultados(); renderItens(); renderPagamento(); atualizarResumo();
    renderDatalistClientes(); renderVendas(); renderTags(); renderEstoque(); renderMais(); renderLive();
    atualizarEmblemas();
  }

  // =====================================================================
  // VENDER · rascunho
  // =====================================================================
  const CAMPOS_CLIENTE = ["nome", "telefone", "documento", "email", "cep", "rua", "numero", "complemento", "bairro", "cidade", "uf"];
  function rascunhoNovo() {
    const cliente = {};
    CAMPOS_CLIENTE.forEach((k) => { cliente[k] = ""; });
    return { chave: uuid(), cliente, itens: [], tagsVenda: [], pagamento: "", parcelas: 1, comissao: Number(E.ajustes.comissao_padrao) || 3, valorManual: null, obs: "", origem: "manual" };
  }
  function prepararRascunho() {
    const salvo = ler("life-rascunho-v2", null);
    R = salvo && salvo.chave && Array.isArray(salvo.itens) ? Object.assign(rascunhoNovo(), salvo) : rascunhoNovo();
    R.cliente = Object.assign(rascunhoNovo().cliente, R.cliente);
  }
  const salvarRascunho = () => gravar("life-rascunho-v2", R);
  const rascunhoVazio = () => !R.cliente.nome.trim() && !R.itens.length && !R.tagsVenda.length && !R.obs.trim();

  function itensPayload(r) { return r.itens.map((i) => ({ preco_unit: i.preco == null ? 0 : Number(i.preco), quantidade: Number(i.quantidade) || 0 })); }
  function totaisDe(r) { return V.totais(itensPayload(r), r.valorManual); }
  function vendaParaTexto(r) {
    const t = totaisDe(r);
    return {
      cliente_nome: r.cliente.nome.trim(), cliente: r.cliente, valor_total: t.total, pagamento: r.pagamento, parcelas: r.pagamento === "credito" ? Number(r.parcelas) || 1 : null,
      observacao: r.obs.trim(),
      itens: r.itens.map((i) => ({ quantidade: i.quantidade, modelo: i.modelo || i.descricao || i.nome, descricao: i.nome, cor: i.cor, codigo: i.codigo, preco_unit: i.preco == null ? 0 : i.preco, tag: i.tag })),
      tags_venda: r.tagsVenda,
    };
  }
  function payloadDe(r) {
    const t = totaisDe(r);
    const c = r.cliente;
    const limpo = (s) => String(s || "").trim();
    return {
      chave: r.chave, cliente_nome: limpo(c.nome), origem: r.origem || "manual",
      cliente: { telefone: limpo(c.telefone), email: limpo(c.email), documento: limpo(c.documento), cep: limpo(c.cep), rua: limpo(c.rua), numero: limpo(c.numero), complemento: limpo(c.complemento), bairro: limpo(c.bairro), cidade: limpo(c.cidade), uf: limpo(c.uf) },
      valor_total: t.total, pagamento: r.pagamento, parcelas: r.pagamento === "credito" ? Number(r.parcelas) || 1 : null,
      comissao_pct: Number(r.comissao) || 0, observacao: limpo(r.obs) || null,
      itens: r.itens.map((i) => ({
        produto_id: i.produto_id || null, variacao: i.variacao || "", codigo: i.codigo || null, descricao: i.nome, quantidade: Number(i.quantidade),
        preco_unit: i.preco == null ? 0 : Number(i.preco),
        tag: i.tag ? { iniciais: limpo(i.tag.iniciais).toUpperCase(), cor: i.tag.cor || "" } : null,
      })),
      tags_venda: r.tagsVenda.map((t2) => ({ iniciais: limpo(t2.iniciais).toUpperCase(), cor: t2.cor || "", origem: t2.origem || "brinde" })),
    };
  }
  const estoqueDe = (i) => (i.produto_id ? E.mapaItens.get(i.produto_id + "|" + (i.variacao || "")) : null);
  function validar(r) {
    const p = [];
    if (!r.cliente.nome.trim()) p.push("Escreva o nome da cliente.");
    if (!r.itens.length) p.push("Adicione ao menos um produto.");
    r.itens.forEach((i) => {
      const e = estoqueDe(i);
      if (e && e.qtd != null && i.quantidade > e.qtd) p.push(e.qtd <= 0 ? i.nome + " está esgotado." : "Estoque insuficiente: restam " + e.qtd + " de " + i.nome + ".");
      if (!(i.quantidade >= 1)) p.push("A quantidade de " + i.nome + " precisa ser 1 ou mais.");
    });
    if (!r.pagamento) p.push("Escolha a forma de pagamento.");
    if (r.itens.length && !(totaisDe(r).total > 0)) p.push("Falta o valor da venda: informe o preço dos produtos.");
    if (r.pagamento === "credito" && !(Number(r.parcelas) >= 1)) p.push("Escolha o número de parcelas.");
    if (!(Number(r.comissao) >= 0)) p.push("Comissão inválida.");
    return p;
  }

  // ---- cliente ----
  function renderCliente() {
    CAMPOS_CLIENTE.forEach((k) => { $(k === "nome" ? "cli-nome" : "cli-" + k).value = R.cliente[k] || ""; });
    $("obs").value = R.obs || "";
    $("obs-conta").textContent = String((R.obs || "").length);
    mostrarDicaCliente();
  }
  function renderDatalistClientes() {
    $("lista-clientes").innerHTML = E.clientes.map((c) => `<option value="${esc(c.nome)}"></option>`).join("");
  }
  function clienteExistente(nome) {
    const n = V.norm(nome);
    return n ? E.clientes.find((c) => V.norm(c.nome) === n) || null : null;
  }
  function mostrarDicaCliente() {
    const c = clienteExistente(R.cliente.nome);
    const d = $("cli-dica");
    if (!c) { d.hidden = true; return; }
    const compras = E.vendas.filter((v) => v.cliente_id === c.id && v.status === "confirmada").length;
    d.hidden = false;
    d.textContent = "Cliente já cadastrada · " + compras + (compras === 1 ? " compra" : " compras") + (c.telefone ? " · " + c.telefone : "") + ". Os dados que faltarem serão completados.";
  }
  function preencherDaCliente(c) {
    const mapa = { telefone: c.telefone, documento: c.documento, email: c.email, cep: c.cep, rua: c.rua, numero: c.numero, complemento: c.complemento, bairro: c.bairro, cidade: c.cidade, uf: c.uf };
    Object.keys(mapa).forEach((k) => { if (!R.cliente[k] && mapa[k]) R.cliente[k] = mapa[k]; });
    R.cliente.nome = c.nome;
  }
  CAMPOS_CLIENTE.forEach((k) => {
    const el = $(k === "nome" ? "cli-nome" : "cli-" + k);
    el.addEventListener("input", () => { R.cliente[k] = el.value; esconderResultadoVenda(); salvarRascunho(); atualizarResumo(); if (k === "nome") mostrarDicaCliente(); });
  });
  $("cli-nome").addEventListener("change", () => {
    const c = clienteExistente($("cli-nome").value);
    if (c) { preencherDaCliente(c); renderCliente(); salvarRascunho(); atualizarResumo(); if (CAMPOS_CLIENTE.slice(1).some((k) => R.cliente[k])) $("cli-detalhes").open = true; }
  });
  $("obs").addEventListener("input", () => { R.obs = $("obs").value; $("obs-conta").textContent = String(R.obs.length); salvarRascunho(); atualizarResumo(); });

  // ---- busca de produtos ----
  function selEstoque(it) {
    if (it.qtd == null) return '<span class="sel-estoque">sem controle</span>';
    if (it.qtd <= 0) return '<span class="sel-estoque zero">Esgotado</span>';
    if (it.qtd <= E.ajustes.estoque_baixo) return `<span class="sel-estoque baixo">${it.qtd === 1 ? "Última peça" : "Restam " + it.qtd}</span>`;
    return `<span class="sel-estoque ok">${it.qtd} em estoque</span>`;
  }
  const capaDe = (produtoId) => {
    const p = E.produtos.find((x) => x.id === produtoId);
    const f = p && Array.isArray(p.fotos) && p.fotos[0];
    return f ? window.Life.miniatura(f) : "";
  };
  function renderResultados() {
    const q = $("busca-produto").value.trim();
    const ul = $("res-produtos");
    if (!q) { ul.innerHTML = ""; return; }
    const achados = V.buscar(E.itens, q, { limite: 12, incluirOcultos: ehAdmin() });
    if (!achados.length) { ul.innerHTML = '<li class="vazio">Nada encontrado. Confira o nome ou o código.</li>'; return; }
    ul.innerHTML = achados.map((it) => {
      const capa = capaDe(it.produto_id);
      return `<li><button type="button" class="resultado" data-chave="${esc(it.chave)}"${V.esgotado(it) ? " disabled" : ""}>
        ${capa ? `<img src="${esc(capa)}" alt="" loading="lazy">` : '<span class="sem-foto"></span>'}
        <span><span class="nome">${esc(it.nome)}</span><br><span class="info">${esc(it.codigo || "sem código")}${it.visivel ? "" : " · oculto no catálogo"}</span><br>${selEstoque(it)}</span>
        <span class="preco">${it.preco == null ? "sem preço" : esc(V.brl(it.preco))}</span></button></li>`;
    }).join("");
  }
  $("busca-produto").addEventListener("input", renderResultados);
  $("res-produtos").addEventListener("click", (e) => {
    const b = e.target.closest(".resultado");
    if (!b || b.disabled) return;
    const it = E.mapaItens.get(b.dataset.chave);
    if (it) adicionarItem(it);
  });
  function adicionarItem(it) {
    esconderResultadoVenda();
    const ja = R.itens.find((x) => x.chave === it.chave);
    if (ja) {
      if (it.qtd != null && ja.quantidade + 1 > it.qtd) aviso("Só há " + it.qtd + " em estoque de " + it.nome + ".", true);
      else ja.quantidade += 1;
    } else {
      const novo = { chave: it.chave, produto_id: it.produto_id, variacao: it.variacao, nome: it.nome, modelo: it.modelo, cor: it.cor, codigo: it.codigo, preco: it.preco, quantidade: 1, tag: null, travaTag: false };
      if (it.ehTag) { novo.tag = { iniciais: "", cor: it.cor }; novo.travaTag = true; }
      R.itens.push(novo);
    }
    $("busca-produto").value = "";
    renderResultados(); renderItens(); atualizarResumo(); salvarRascunho();
    aviso("Adicionado: " + it.nome);
  }

  // ---- itens da venda ----
  function coresDeTag(selecionada) {
    return V.PALETA_TAG.filter((c) => c.nome !== "Bordô").map((c) =>
      `<button type="button" class="cor" data-cor="${esc(c.nome)}" aria-pressed="${V.norm(c.nome) === V.norm(selecionada) ? "true" : "false"}"><i style="background:${c.hex}"></i>${esc(c.nome)}</button>`).join("");
  }
  function htmlTag(tag, idx, travada, tipo) {
    return `<div class="tag-campos" data-tipo-tag="${tipo}">
      <label>Iniciais da tag<input type="text" class="tag-iniciais" maxlength="8" autocapitalize="characters" value="${esc(tag.iniciais || "")}" placeholder="Ex.: MS"></label>
      <div><p class="rotulo" style="margin-top:0">Cor da tag</p><div class="cores"${travada ? ' data-travada="1"' : ""}>${coresDeTag(tag.cor)}</div></div>
      <p class="estado">${tag.iniciais ? "Vai para a fábrica com as iniciais " + esc(String(tag.iniciais).toUpperCase()) + "." : "Sem iniciais ainda: a tag fica como “a fazer” e você completa depois na aba Tags."}</p></div>`;
  }
  function renderItens() {
    $("itens-vazio").hidden = R.itens.length > 0;
    $("itens-venda").innerHTML = R.itens.map((i, idx) => {
      const e = estoqueDe(i);
      const max = e && e.qtd != null ? e.qtd : null;
      const avisoEst = max != null && i.quantidade > max ? `<p class="aviso-estoque">Só há ${max} em estoque.</p>` : max != null && max <= E.ajustes.estoque_baixo ? `<p class="aviso-estoque">${max === 1 ? "Última peça em estoque." : "Estoque baixo: restam " + max + "."}</p>` : "";
      const tagBox = i.travaTag
        ? `<div class="tag-item"><p class="rotulo" style="margin:0">Tag personalizada (comprada como produto)</p>${htmlTag(i.tag, idx, true, "item")}</div>`
        : `<div class="tag-item"><label class="interruptor"><input type="checkbox" class="tag-liga"${i.tag ? " checked" : ""}><span>Incluir tag personalizada neste produto</span></label>${i.tag ? htmlTag(i.tag, idx, false, "item") : ""}</div>`;
      return `<li class="item-venda" data-i="${idx}">
        <div class="topo"><div><div class="nome">${esc(i.nome)}</div><div class="sub">${esc(i.codigo || "sem código")}${e ? " · " + V.estoqueTexto(e) : " · fora do catálogo"}</div></div><button type="button" class="remover" data-acao="remover">Remover</button></div>
        <div class="linha">
          <div class="contador"><button type="button" data-acao="menos" aria-label="Diminuir"${i.quantidade <= 1 ? " disabled" : ""}>−</button><input type="number" class="qtd" min="1" step="1" inputmode="numeric" value="${i.quantidade}" aria-label="Quantidade"><button type="button" data-acao="mais" aria-label="Aumentar"${max != null && i.quantidade >= max ? " disabled" : ""}>+</button></div>
          <label>Preço unitário (R$)<input type="text" class="preco" inputmode="decimal" value="${i.preco == null ? "" : Number(i.preco).toFixed(2).replace(".", ",")}" placeholder="0,00"></label>
          <span class="subtotal">${V.brl((i.preco || 0) * i.quantidade)}</span>
        </div>
        ${i.preco == null ? '<p class="sem-preco">Este produto está sem preço no catálogo. Digite o valor.</p>' : ""}${avisoEst}${tagBox}</li>`;
    }).join("");
    $("tags-venda").innerHTML = R.tagsVenda.map((t, idx) =>
      `<li class="item-venda" data-t="${idx}"><div class="topo"><div><div class="nome">Tag da venda</div><div class="sub">Não está ligada a um produto</div></div><button type="button" class="remover" data-acao="remover-tag">Remover</button></div>${htmlTag(t, idx, false, "venda")}</li>`).join("");
  }
  function atualizarSubtotais() {
    document.querySelectorAll("#itens-venda .item-venda").forEach((li) => {
      const i = R.itens[Number(li.dataset.i)];
      if (i) li.querySelector(".subtotal").textContent = V.brl((i.preco || 0) * i.quantidade);
    });
  }
  const itemDeLi = (el) => { const li = el.closest("[data-i]"); return li ? R.itens[Number(li.dataset.i)] : null; };
  $("itens-venda").addEventListener("click", (e) => {
    const li = e.target.closest("[data-i]");
    if (!li) return;
    const i = R.itens[Number(li.dataset.i)];
    const acao = e.target.closest("[data-acao]");
    const cor = e.target.closest(".cor");
    if (cor) { if (!i.tag) return; i.tag.cor = cor.dataset.cor; renderItens(); atualizarResumo(); salvarRascunho(); return; }
    if (!acao) return;
    if (acao.dataset.acao === "remover") R.itens.splice(Number(li.dataset.i), 1);
    else if (acao.dataset.acao === "mais") i.quantidade = Number(i.quantidade) + 1;
    else if (acao.dataset.acao === "menos") i.quantidade = Math.max(1, Number(i.quantidade) - 1);
    renderItens(); atualizarResumo(); salvarRascunho();
  });
  $("itens-venda").addEventListener("change", (e) => {
    const i = itemDeLi(e.target);
    if (!i) return;
    if (e.target.classList.contains("tag-liga")) {
      i.tag = e.target.checked ? { iniciais: "", cor: "" } : null;
      renderItens(); atualizarResumo(); salvarRascunho();
    } else if (e.target.classList.contains("qtd")) {
      i.quantidade = Math.max(1, parseInt(e.target.value, 10) || 1);
      renderItens(); atualizarResumo(); salvarRascunho();
    }
  });
  $("itens-venda").addEventListener("input", (e) => {
    const i = itemDeLi(e.target);
    if (!i) return;
    esconderResultadoVenda();
    if (e.target.classList.contains("preco")) { const n = num(e.target.value); i.preco = n == null ? null : n; atualizarSubtotais(); atualizarResumo(); salvarRascunho(); }
    else if (e.target.classList.contains("qtd")) { const q = parseInt(e.target.value, 10); if (q >= 1) { i.quantidade = q; atualizarSubtotais(); atualizarResumo(); salvarRascunho(); } }
    else if (e.target.classList.contains("tag-iniciais")) {
      i.tag.iniciais = e.target.value.toUpperCase(); e.target.value = i.tag.iniciais;
      const est = e.target.closest(".tag-campos").querySelector(".estado");
      est.textContent = i.tag.iniciais ? "Vai para a fábrica com as iniciais " + i.tag.iniciais + "." : "Sem iniciais ainda: a tag fica como “a fazer” e você completa depois na aba Tags.";
      atualizarResumo(); salvarRascunho();
    }
  });
  // tags da venda (sem produto)
  $("add-tag-venda").addEventListener("click", () => { R.tagsVenda.push({ iniciais: "", cor: "", origem: "brinde" }); renderItens(); atualizarResumo(); salvarRascunho(); });
  $("tags-venda").addEventListener("click", (e) => {
    const li = e.target.closest("[data-t]");
    if (!li) return;
    const idx = Number(li.dataset.t);
    if (e.target.closest("[data-acao=remover-tag]")) R.tagsVenda.splice(idx, 1);
    else if (e.target.closest(".cor")) R.tagsVenda[idx].cor = e.target.closest(".cor").dataset.cor;
    else return;
    renderItens(); atualizarResumo(); salvarRascunho();
  });
  $("tags-venda").addEventListener("input", (e) => {
    const li = e.target.closest("[data-t]");
    if (!li || !e.target.classList.contains("tag-iniciais")) return;
    const t = R.tagsVenda[Number(li.dataset.t)];
    t.iniciais = e.target.value.toUpperCase(); e.target.value = t.iniciais;
    atualizarResumo(); salvarRascunho();
  });

  // ---- pagamento, comissão, valor ----
  function renderPagamento() {
    document.querySelectorAll("#seg-pagamento [data-pag]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.pag === R.pagamento)));
    $("box-parcelas").hidden = R.pagamento !== "credito";
    $("parcelas").value = String(R.parcelas || 1);
    const padrao = Number(R.comissao) === 3 ? "3" : Number(R.comissao) === 5 ? "5" : "outro";
    document.querySelectorAll("#seg-comissao [data-com]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.com === padrao)));
    $("box-com-outro").hidden = padrao !== "outro";
    if (padrao === "outro") $("com-outro").value = String(R.comissao).replace(".", ",");
    $("box-valor").hidden = R.valorManual == null;
    $("valor-manual").value = R.valorManual == null ? "" : String(R.valorManual).replace(".", ",");
  }
  $("seg-pagamento").addEventListener("click", (e) => {
    const b = e.target.closest("[data-pag]");
    if (!b) return;
    esconderResultadoVenda();
    R.pagamento = b.dataset.pag;
    if (R.pagamento === "credito" && !R.parcelas) R.parcelas = 1;
    renderPagamento(); atualizarResumo(); salvarRascunho();
  });
  $("parcelas").addEventListener("change", () => { R.parcelas = Number($("parcelas").value) || 1; atualizarResumo(); salvarRascunho(); });
  $("seg-comissao").addEventListener("click", (e) => {
    const b = e.target.closest("[data-com]");
    if (!b) return;
    if (b.dataset.com === "outro") { if (R.comissao === 3 || R.comissao === 5) R.comissao = 0; $("box-com-outro").hidden = false; $("com-outro").focus(); }
    else R.comissao = Number(b.dataset.com);
    renderPagamento(); atualizarResumo(); salvarRascunho();
  });
  $("com-outro").addEventListener("input", () => { const n = num($("com-outro").value); R.comissao = n == null ? 0 : Math.min(100, Math.max(0, n)); atualizarResumo(); salvarRascunho(); });
  $("alterar-valor").addEventListener("click", () => {
    R.valorManual = R.valorManual == null ? totaisDe(R).soma : null;
    renderPagamento(); atualizarResumo(); salvarRascunho();
    if (R.valorManual != null) $("valor-manual").focus();
  });
  $("valor-manual").addEventListener("input", () => { const n = num($("valor-manual").value); R.valorManual = n == null ? 0 : n; atualizarResumo(); salvarRascunho(); });

  function atualizarResumo() {
    const t = totaisDe(R);
    $("total-venda").textContent = V.brl(t.total);
    const nota = $("total-nota");
    nota.hidden = !t.ajustado;
    nota.textContent = t.ajustado ? "Valor ajustado. A soma dos produtos é " + V.brl(t.soma) + "." : "";
    $("comissao-nota").textContent = "Comissão de " + String(R.comissao).replace(".", ",") + "%: " + V.brl(V.comissao(t.total, R.comissao));
    $("alterar-valor").textContent = R.valorManual == null ? "Alterar valor total (desconto ou acerto)" : "Voltar ao valor da soma dos produtos";
    const tags = R.itens.filter((i) => i.tag).length + R.tagsVenda.length;
    const av = $("aviso-tag");
    const minimo = Number(E.ajustes.tag_valor_minimo);
    if (!tags && t.total >= minimo && R.itens.length) { av.hidden = false; av.textContent = "Compras a partir de " + V.brl(minimo) + " ganham tag personalizada. É opcional: ative em cada produto, se a cliente quiser."; }
    else if (tags && R.itens.length && t.total < minimo && R.itens.every((i) => !i.travaTag)) { av.hidden = false; av.textContent = "Atenção: a tag costuma ser para compras a partir de " + V.brl(minimo) + ". Pode registrar mesmo assim."; }
    else av.hidden = true;
    $("texto-venda").textContent = V.montarTexto(vendaParaTexto(R), formatoTexto()) || "(preencha a venda para ver o texto)";
  }
  function esconderResultadoVenda() {
    if ($("resultado-venda").hidden) return;
    $("resultado-venda").hidden = true;
    $("estado-venda").className = "estado-venda";
    $("estado-venda").innerHTML = '<span class="selo rascunho">Rascunho</span><span>Nada foi registrado ainda. O estoque só muda quando você confirmar.</span>';
  }

  // ---- texto para copiar (formato configurável) ----
  const formatoTexto = () => Object.assign({ modelo: V.MODELO_TEXTO, item: V.MODELO_ITEM }, ler("life-formato-texto-v1", {}));
  $("copiar-texto").addEventListener("click", async () => {
    const ok = await copiar($("texto-venda").textContent);
    $("copiar-msg").textContent = ok ? "Texto copiado. A venda ainda NÃO foi registrada." : "Não consegui copiar. Segure o texto acima e escolha Copiar.";
  });
  $("abrir-formato").addEventListener("click", (e) => { e.preventDefault(); abrirAba("mais"); setTimeout(() => $("mais-texto").scrollIntoView({ behavior: "smooth" }), 50); });

  // ---- limpar e registrar ----
  $("limpar-venda").addEventListener("click", () => {
    if (!rascunhoVazio() && !window.confirm("Limpar o rascunho? Nada foi registrado, então nada será desfeito no estoque.")) return;
    R = rascunhoNovo(); salvarRascunho(); esconderResultadoVenda(); $("venda-erro").textContent = ""; $("copiar-msg").textContent = "";
    renderCliente(); renderItens(); renderPagamento(); atualizarResumo();
  });
  function resumoParaConfirmar(r) {
    const t = totaisDe(r);
    const efeitos = r.itens.map((i) => {
      const e = estoqueDe(i);
      if (!e) return `<li>${esc(i.nome)}: fora do catálogo, não mexe no estoque</li>`;
      if (e.qtd == null) return `<li>${esc(i.nome)}: sem controle de estoque</li>`;
      return `<li>${esc(i.nome)}: ${e.qtd} → <strong>${e.qtd - i.quantidade}</strong></li>`;
    }).join("");
    const nTags = r.itens.filter((i) => i.tag).length + r.tagsVenda.length;
    const pag = V.PAGAMENTOS[r.pagamento] + (r.pagamento === "credito" ? " em " + (r.parcelas || 1) + "x" : "");
    return `<ul class="lista-simples">${r.itens.map((i) => `<li><span class="esq">${i.quantidade}x ${esc(i.nome)}${i.tag ? `<small>Tag ${esc(i.tag.iniciais || "sem iniciais")} · ${esc(i.tag.cor || "cor a escolher")}</small>` : ""}</span><span>${V.brl((i.preco || 0) * i.quantidade)}</span></li>`).join("")}</ul>
      <p><strong>${esc(r.cliente.nome.trim())}</strong> · ${esc(pag)} · <strong>${V.brl(t.total)}</strong> · comissão ${String(r.comissao).replace(".", ",")}%</p>
      <div class="efeito"><strong>O que vai acontecer no estoque</strong><ul>${efeitos}</ul>${nTags ? `<p style="margin:8px 0 0">${nTags} ${nTags === 1 ? "tag vai" : "tags vão"} para a lista “a fazer” da fábrica.</p>` : ""}</div>`;
  }
  let confirmando = null; // {r, depois} para uma venda, ou {acao} para vários passos
  function abrirJanelaConfirmar(titulo, html) {
    $("dc-titulo").textContent = titulo;
    $("dc-corpo").innerHTML = html;
    $("dc-erro").textContent = "";
    $("dc-ok").disabled = false; $("dc-ok").textContent = "Sim, registrar";
    $("dlg-confirmar").showModal();
  }
  function abrirConfirmacao(r, depois, titulo) {
    confirmando = { r, depois };
    abrirJanelaConfirmar(titulo || "Registrar esta venda?", resumoParaConfirmar(r));
  }
  function abrirConfirmacaoLivre(titulo, html, acao) {
    confirmando = { acao };
    abrirJanelaConfirmar(titulo, html);
  }
  $("dc-voltar").addEventListener("click", () => $("dlg-confirmar").close());
  $("dc-ok").addEventListener("click", async () => {
    if (!confirmando) return;
    const { r, depois, acao } = confirmando;
    $("dc-ok").disabled = true; $("dc-ok").textContent = "Registrando…";
    try {
      if (acao) await acao((t) => { $("dc-ok").textContent = t; });
      else {
        const res = await registrar(r);
        $("dlg-confirmar").close();
        confirmando = null;
        await depois(res);
        return;
      }
      $("dlg-confirmar").close();
      confirmando = null;
    } catch (e) {
      $("dc-erro").textContent = traduzirErro(e);
      $("dc-ok").disabled = false; $("dc-ok").textContent = "Tentar de novo";
      recarregar(["produtos"]).then(() => { renderResultados(); }).catch(() => {});
    }
  });
  async function registrar(r) {
    const { data, error } = await sb.rpc("confirmar_venda", { p: payloadDe(r) });
    if (error) throw new Error(error.message);
    return data;
  }
  $("registrar-venda").addEventListener("click", () => {
    const problemas = validar(R);
    $("venda-erro").textContent = problemas.join(" ");
    if (problemas.length) { $("venda-erro").scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    const rr = R;
    abrirConfirmacao(rr, async (res) => {
      const textoVenda = V.montarTexto(Object.assign(vendaParaTexto(rr), { numero: res.numero }), formatoTexto());
      if (R === rr) { R = rascunhoNovo(); salvarRascunho(); }
      await recarregar(["produtos", "clientes", "vendas", "tags"]);
      renderTudo();
      mostrarResultadoVenda(res, textoVenda);
    });
  });
  function mostrarResultadoVenda(res, texto) {
    const box = $("resultado-venda");
    box.hidden = false;
    box.className = "caixa ok-venda";
    box.innerHTML = `<h2>Venda #${esc(res.numero)} registrada</h2>
      <p>${res.repetida ? "Esta venda já tinha sido registrada antes (não foi duplicada)." : "O estoque foi atualizado" + (res.tags ? " e " + res.tags + (res.tags === 1 ? " tag foi para a fábrica." : " tags foram para a fábrica.") : ".")}</p>
      <div class="acoes-linha"><button type="button" class="botao botao-sec" id="rv-copiar">Copiar texto</button><button type="button" class="botao" id="rv-nova">Nova venda</button></div>
      <p class="progresso" id="rv-msg"></p>`;
    $("rv-copiar").addEventListener("click", async () => { $("rv-msg").textContent = (await copiar(texto)) ? "Texto copiado." : "Não consegui copiar."; });
    $("rv-nova").addEventListener("click", () => { esconderResultadoVenda(); window.scrollTo({ top: 0, behavior: "smooth" }); $("cli-nome").focus(); });
    const est = $("estado-venda");
    est.className = "estado-venda registrada";
    est.innerHTML = `<span class="selo ok">Registrada</span><span>Venda #${esc(res.numero)} confirmada. Abaixo já está o rascunho em branco para a próxima.</span>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // modo nova venda / colar da live
  document.querySelectorAll(".modo [data-modo]").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll(".modo [data-modo]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $("modo-manual").hidden = b.dataset.modo !== "manual";
    $("modo-live").hidden = b.dataset.modo !== "live";
  }));
  function irParaModo(m) { document.querySelector(`.modo [data-modo=${m}]`).click(); }

  // =====================================================================
  // As telas de live, vendas, tags, estoque e ajustes ficam em vendas-telas.js
  // e usam este núcleo.
  // =====================================================================
  window.LifeVendasNucleo = {
    E, F, V, $, esc, sb, ler, gravar, apagar, uuid, num, dia, dataHora, dataCurta, hoje, somaDias, ehAdmin, aviso, traduzirErro, copiar, baixarArquivo,
    recarregar, renderTudo, abrirAba, get R() { return R; }, set R(v) { R = v; }, salvarRascunho, rascunhoNovo, rascunhoVazio, validar, payloadDe,
    totaisDe, vendaParaTexto, abrirConfirmacao, abrirConfirmacaoLivre, registrar, formatoTexto, irParaModo, renderCliente, renderItens, renderPagamento, atualizarResumo,
    esconderResultadoVenda, mostrarResultadoVenda, estoqueDe, carregarMov, atualizarEmblemas, iniciar, setLives: (l) => { lives = l; }, getLives: () => lives,
    get comLive() { return comLive; }, set comLive(v) { comLive = v; }, resumoParaConfirmar, coresDeTag, clienteExistente, preencherDaCliente,
  };

  function renderVendas() { if (window.LifeVendasTelas) window.LifeVendasTelas.renderVendas(); }
  function renderTags() { if (window.LifeVendasTelas) window.LifeVendasTelas.renderTags(); }
  function renderEstoque() { if (window.LifeVendasTelas) window.LifeVendasTelas.renderEstoque(); }
  function renderMais() { if (window.LifeVendasTelas) window.LifeVendasTelas.renderMais(); }
  function renderLive() { if (window.LifeVendasTelas) window.LifeVendasTelas.renderLive(); }
  function carregarMov(reset) { return window.LifeVendasTelas ? window.LifeVendasTelas.carregarMov(reset) : Promise.resolve(); }
  function atualizarEmblemas() { if (window.LifeVendasTelas) window.LifeVendasTelas.atualizarEmblemas(); }

  // vendas-telas.js é carregado logo depois deste arquivo; a tela só inicia quando a página terminou de carregar
  window.addEventListener("DOMContentLoaded", iniciar);
})();
