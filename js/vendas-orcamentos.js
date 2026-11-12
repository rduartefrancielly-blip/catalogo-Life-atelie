// Life Ateliê · Vendas: aba Orçamentos (criar, salvar como rascunho, prévia e envio pelo WhatsApp).
// Usa o núcleo de vendas.js (banco, clientes, catálogo, avisos) e as regras de orcamento-lib.js.
(function () {
  "use strict";
  const N = window.LifeVendasNucleo;
  const L = window.OrcamentoLib;
  const A = window.OrcamentoArte;
  const { E, V, $, esc, sb } = N;
  const T = () => window.LifeVendasTelas;
  const TZ = "America/Sao_Paulo";
  const TABELA = "orcamentos";
  const PILL = { rascunho: "neutro", enviado: "wait", aprovado: "ok", recusado: "out" };

  const O = { lista: [], carregado: false, semTabela: false, loja: { whatsapp: "", instagram: "" }, filtro: "todos" };
  let editando = null;          // orçamento salvo que está no formulário (ou null = novo)
  let sujo = false;             // há alterações no formulário ainda não salvas
  let enviandoFotos = 0;        // fotos ainda subindo
  let salvando = false;
  let atual = null;             // orçamento aberto na prévia

  const dataHora = (iso) => new Date(iso).toLocaleString("pt-BR", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).replace(",", " às");
  const pill = (st) => `<span class="pill ${PILL[st] || "neutro"}">${esc(L.statusNome(st))}</span>`;
  const msg = (texto, tipo) => N.setMsg($("orcMsg"), texto, tipo);
  const ehErroDeTabela = (e) => /orcamentos/i.test(String((e && e.message) || "")) && /(does not exist|schema cache|not find|relation)/i.test(String((e && e.message) || ""));

  // =====================================================================
  // DADOS
  // =====================================================================
  async function carregar() {
    try {
      O.lista = await N.todos(() => sb.from(TABELA).select("*").order("criado_em", { ascending: false }).order("id"));
      O.semTabela = false;
    } catch (e) {
      if (ehErroDeTabela(e)) { O.semTabela = true; O.lista = []; }
      else { N.setMsg($("orcListaMsg"), "Não consegui carregar os orçamentos: " + N.traduzirErro(e), "warn"); }
    }
    O.carregado = true;
    $("orcSemTabela").hidden = !O.semTabela;
    renderLista();
  }
  async function carregarLoja() {
    const { data } = await sb.from("config").select("whatsapp,instagram").eq("id", 1).maybeSingle();
    if (data) O.loja = { whatsapp: data.whatsapp || "", instagram: data.instagram || "" };
  }

  async function gravar(dados, id) {
    if (O.semClienteId && "cliente_id" in dados) { dados = Object.assign({}, dados); delete dados.cliente_id; }
    const q = id ? sb.from(TABELA).update(dados).eq("id", id) : sb.from(TABELA).insert(dados);
    let { data, error } = await q.select().single();
    if (error && "cliente_id" in dados && /cliente_id/.test(String(error.message || ""))) {
      O.semClienteId = true; // falta rodar o SQL novo: segue sem ligar o orçamento ao cadastro
      return gravar(dados, id);
    }
    if (error) throw error;
    const i = O.lista.findIndex((o) => o.id === data.id);
    if (i >= 0) O.lista[i] = data; else O.lista.unshift(data);
    return data;
  }

  // =====================================================================
  // FORMULÁRIO
  // =====================================================================
  const itensEl = $("orcItens");
  const fotoDoProduto = (id) => { const p = E.produtos.find((x) => x.id === id); const f = p && Array.isArray(p.fotos) ? p.fotos[0] : null; return f ? f.url || null : null; };
  const miniatura = (url) => (url ? window.Life.miniatura({ url }) : "");
  // "Bolsa Alice - Preto" → nome "Bolsa Alice", cor "Preto"
  function nomeSemCor(nomeProduto, cor) {
    const n = String(nomeProduto || "");
    if (!cor) return n;
    const i = n.toLowerCase().lastIndexOf(String(cor).toLowerCase());
    return i > 0 ? n.slice(0, i).replace(/[\s\-–—]+$/, "") : n;
  }

  function linhaHtml() {
    return `<div class="orc-item-grade">
        <div class="orc-foto">
          <div class="orc-foto-quadro"></div>
          <label class="orc-foto-btn">Foto<input type="file" accept="image/*" class="oi-arquivo"></label>
          <button type="button" class="link-btn oi-tirar-foto" hidden>tirar</button>
        </div>
        <div class="orc-campos">
          <div class="oc-nome"><label>Produto</label><input type="text" class="oi-nome" placeholder="Ex.: Bolsa Alice" autocomplete="off" maxlength="120"></div>
          <div class="oc-cor"><label>Cor</label><input type="text" class="oi-cor" placeholder="Ex.: Preta" autocomplete="off" maxlength="60"></div>
          <div class="oc-qtd"><label>Qtd</label><input type="number" class="oi-qtd" min="1" step="1" value="1" inputmode="numeric"></div>
          <div class="oc-valor"><label>Valor unitário (R$)</label><input type="text" class="oi-valor" inputmode="decimal" placeholder="0,00" autocomplete="off"></div>
        </div>
        <button type="button" class="icon-btn danger oi-remover" title="Tirar este produto do orçamento" aria-label="Tirar este produto do orçamento">✕</button>
      </div>
      <div class="field-hint oi-total"></div>`;
  }
  function mostrarFoto(row) {
    const url = row.dataset.foto || "";
    const q = row.querySelector(".orc-foto-quadro");
    const nome = row.querySelector(".oi-nome").value.trim();
    q.innerHTML = url ? `<img src="${esc(miniatura(url))}" alt="${esc("Foto de " + (nome || "produto"))}" loading="lazy">` : '<span aria-hidden="true">Sem foto</span>';
    row.querySelector(".oi-tirar-foto").hidden = !url;
    row.querySelector(".orc-foto-btn").firstChild.textContent = url ? "Trocar foto" : "Pôr foto";
  }
  function addItem(pre) {
    const row = document.createElement("div");
    row.className = "item-row orc-item";
    row.innerHTML = linhaHtml();
    pre = pre || {};
    row.querySelector(".oi-nome").value = pre.nome || "";
    row.querySelector(".oi-cor").value = pre.cor || "";
    row.querySelector(".oi-qtd").value = pre.quantidade || 1;
    row.querySelector(".oi-valor").value = pre.valor_unitario != null && pre.valor_unitario !== "" ? L.valorCampo(pre.valor_unitario) : "";
    row.dataset.foto = pre.foto || "";
    row.dataset.produto = pre.produto_id || "";
    row.addEventListener("input", (e) => {
      if (e.target.classList.contains("oi-nome") && row.dataset.produto) row.dataset.produto = ""; // renomeou à mão: deixa de ser do catálogo
      e.target.removeAttribute("aria-invalid");
      marcarSujo(); atualizarTotais();
    });
    row.querySelector(".oi-remover").addEventListener("click", () => {
      row.remove();
      if (!itensEl.children.length) addItem();
      marcarSujo(); atualizarTotais();
    });
    row.querySelector(".oi-tirar-foto").addEventListener("click", () => { row.dataset.foto = ""; mostrarFoto(row); marcarSujo(); });
    row.querySelector(".oi-arquivo").addEventListener("change", (e) => enviarFotoDaLinha(row, e.target));
    itensEl.appendChild(row);
    mostrarFoto(row);
    atualizarTotais();
    return row;
  }
  const linhaVazia = (row) => L.itemVazio(lerLinha(row));
  function lerLinha(row) {
    return {
      nome: row.querySelector(".oi-nome").value, cor: row.querySelector(".oi-cor").value,
      quantidade: Number(row.querySelector(".oi-qtd").value), valor_unitario: row.querySelector(".oi-valor").value,
      foto: row.dataset.foto || null, produto_id: row.dataset.produto || null,
    };
  }
  function lerForm() {
    return {
      cliente_nome: $("orcCliente").value, cliente_whatsapp: $("orcWhats").value,
      itens: [...itensEl.children].map(lerLinha), frete: $("orcFrete").value, observacoes: $("orcObs").value,
      ajuste_tipo: $("orcAjusteTipo").value || null, ajuste_valor: $("orcAjusteValor").value, ajuste_descricao: $("orcAjusteDesc").value,
    };
  }
  const ajusteDoForm = (f) => ({ tipo: f.ajuste_tipo, valor: f.ajuste_valor, descricao: f.ajuste_descricao });

  // mostra/esconde os campos do ajuste conforme o tipo escolhido
  function mostrarAjuste() {
    const tipo = $("orcAjusteTipo").value;
    $("orcAjusteValorCampo").hidden = !tipo;
    $("orcAjusteDescCampo").hidden = !tipo;
    $("orcAjusteValorRotulo").textContent = tipo === "desconto_pct" ? "Desconto (%)" : tipo === "desconto_valor" ? "Desconto (R$)" : "Acréscimo (R$)";
    $("orcAjusteValor").placeholder = tipo === "desconto_pct" ? "Ex.: 5" : "Ex.: 50,00";
  }

  function atualizarTotais() {
    const f = lerForm();
    const c = L.calcular(f.itens, f.frete, ajusteDoForm(f));
    [...itensEl.children].forEach((row, i) => {
      const it = f.itens[i], hint = row.querySelector(".oi-total");
      const v = L.lerValor(it.valor_unitario);
      if (L.itemVazio(it)) hint.textContent = "";
      else if (String(it.valor_unitario).trim() !== "" && (isNaN(v) || v < 0)) { hint.textContent = "Valor inválido. Use, por exemplo, 489,90."; hint.className = "field-hint warn oi-total"; return; }
      else hint.textContent = (Number.isInteger(it.quantidade) && it.quantidade > 0 ? it.quantidade : 0) + " × " + L.brl(isNaN(v) ? 0 : v) + " = " + L.brl(c.linhas[i].total);
      hint.className = "field-hint oi-total";
    });
    const fv = L.lerValor(f.frete), freteRuim = String(f.frete).trim() !== "" && (isNaN(fv) || fv < 0);
    // conferência do ajuste: avisa na hora se o valor não serve
    const erroAjuste = L.validar(Object.assign({}, f, { cliente_nome: "x", cliente_whatsapp: "", frete: "" }), "rascunho").find((e) => e.campo === "ajuste_valor");
    const h = $("orcAjusteHint");
    h.textContent = erroAjuste ? erroAjuste.msg : c.ajuste.tipo ? (c.ajuste.valor < 0 ? "Desconto de " : "Acréscimo de ") + L.brl(Math.abs(c.ajuste.valor)) + " sobre os produtos." : "";
    h.className = "field-hint" + (erroAjuste ? " warn" : c.ajuste.tipo ? " ok" : "");
    $("orcTotais").innerHTML =
      `<div><span>Subtotal dos produtos${c.pecas ? " (" + c.pecas + (c.pecas === 1 ? " peça" : " peças") + ")" : ""}</span><b>${esc(L.brl(c.subtotal))}</b></div>` +
      (c.ajuste.tipo ? `<div class="orc-ajuste-linha${c.ajuste.valor < 0 ? " desconto" : ""}"><span>${esc(c.ajuste.rotulo)}</span><b>${esc(L.valorAjuste(c.ajuste.valor))}</b></div>` : "") +
      `<div><span>Frete</span><b>${freteRuim ? '<span class="warn">valor inválido</span>' : esc(L.brl(c.frete))}</b></div>` +
      `<div class="orc-total-final"><span>Total</span><b>${esc(L.brl(c.total))}</b></div>`;
  }

  function marcarSujo() { sujo = true; msg(""); }
  function podeDescartar() {
    if (!sujo) return true;
    return window.confirm("O orçamento que está no formulário tem alterações que ainda não foram salvas. Descartar essas alterações?");
  }
  function preencher(o, modo) {
    editando = modo === "editar" ? o : null;
    $("orcCliente").value = (o && o.cliente_nome) || "";
    $("orcWhats").value = o && o.cliente_whatsapp ? L.whatsBonito(o.cliente_whatsapp) : "";
    $("orcFrete").value = o && Number(o.frete) ? L.valorCampo(o.frete) : "";
    $("orcObs").value = (o && o.observacoes) || "";
    $("orcAjusteTipo").value = (o && o.ajuste_tipo) || "";
    $("orcAjusteValor").value = o && o.ajuste_tipo && Number(o.ajuste_valor) ? (o.ajuste_tipo === "desconto_pct" ? String(Number(o.ajuste_valor)).replace(".", ",") : L.valorCampo(o.ajuste_valor)) : "";
    $("orcAjusteDesc").value = (o && o.ajuste_tipo && o.ajuste_descricao) || "";
    mostrarAjuste();
    itensEl.innerHTML = "";
    ((o && o.itens) || []).forEach((it) => addItem(it));
    if (!itensEl.children.length) addItem();
    document.querySelectorAll("#orcCard [aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    $("orcEditBanner").hidden = !editando && modo !== "copia";
    $("orcEditTexto").innerHTML = editando
      ? "Editando o orçamento <b>" + esc(L.numeroTexto(o.numero)) + "</b> de <b>" + esc(o.cliente_nome) + "</b> " + pill(o.status)
      : modo === "copia" ? "Cópia do orçamento <b>" + esc(L.numeroTexto(o.numero)) + "</b>: ajuste o que precisar. Ainda não foi salva." : "";
    $("orcTitulo").textContent = editando ? "Editar orçamento" : "Novo orçamento";
    $("orcSalvar").textContent = editando && editando.status !== "rascunho" ? "Salvar alterações" : "Salvar rascunho";
    sujo = modo === "copia";
    atualizarWhatsHint();
    atualizarCadastro();
    atualizarTotais();
    msg("");
  }
  function novo() { if (!podeDescartar()) return; preencher(null); $("orcCliente").focus(); }

  // ---------- cliente ----------
  const clientePorNome = (nome) => { const n = V.norm(nome); return n ? E.clientes.find((c) => V.norm(c.nome) === n) || null : null; };
  function atualizarWhatsHint() {
    const tel = $("orcWhats").value.trim(), h = $("orcWhatsHint");
    h.className = "field-hint";
    if (!tel) { h.textContent = ""; return; }
    if (L.whatsDigitos(tel)) { h.textContent = "WhatsApp: " + L.whatsBonito(tel); h.className = "field-hint ok"; }
    else { h.textContent = "Falta o DDD ou algum número. Ex.: (31) 99999-9999."; h.className = "field-hint warn"; }
  }
  $("orcCliente").addEventListener("input", (e) => {
    e.target.removeAttribute("aria-invalid");
    const c = clientePorNome(e.target.value);
    if (c && c.telefone && !$("orcWhats").value.trim()) { $("orcWhats").value = L.whatsBonito(c.telefone); atualizarWhatsHint(); }
    marcarSujo();
    atualizarCadastro();
  });

  // ---------- cadastro da cliente (CPF e endereço, para lançar a venda) ----------
  const temCadastro = (c) => !!c && ["documento", "cep", "rua", "cidade"].some((k) => String(c[k] || "").trim());
  const resumoCadastro = (c) => [c.documento ? "CPF/CNPJ " + c.documento : "", V.enderecoLinha(c)].filter(Boolean).join(" · ");
  function atualizarCadastro() {
    const nome = $("orcCliente").value.trim(), el = $("orcCadastro");
    if (!nome) { el.innerHTML = ""; return; }
    const c = clientePorNome(nome);
    el.innerHTML = temCadastro(c)
      ? `<span class="orc-cad-ok">✓ No cadastro: ${esc(resumoCadastro(c))}</span><button type="button" class="link-btn" data-cad>editar</button>`
      : `<button type="button" class="btn ghost small" data-cad>Colar dados da cliente</button><span class="orc-cad-dica">CPF e endereço que ela mandar: entram no cadastro para a venda.</span>`;
  }
  $("orcCadastro").addEventListener("click", (e) => { if (e.target.closest("[data-cad]")) abrirCadastroDoForm(); });
  function abrirCadastroDoForm() {
    const nome = $("orcCliente").value.trim(), w = $("orcWhats").value;
    T().abrirCliente(clientePorNome(nome), {
      prefill: { nome, telefone: L.whatsDigitos(w) ? L.whatsBonito(w) : w.trim() }, colar: true,
      aoSalvar: (d) => {
        if (d.nome && d.nome !== $("orcCliente").value.trim()) { $("orcCliente").value = d.nome; marcarSujo(); }
        if (!L.whatsDigitos($("orcWhats").value) && L.whatsDigitos(d.telefone)) { $("orcWhats").value = L.whatsBonito(d.telefone); marcarSujo(); }
        atualizarWhatsHint(); atualizarCadastro();
      },
    });
  }
  const clienteDoOrcamento = (o) => (o.cliente_id && E.clientes.find((c) => c.id === o.cliente_id)) || clientePorNome(o.cliente_nome);
  // do orçamento já salvo (prévia): se o nome ou o WhatsApp mudarem no cadastro, o orçamento acompanha
  function abrirCadastroDoOrcamento(o) {
    T().abrirCliente(clienteDoOrcamento(o), {
      prefill: { nome: o.cliente_nome, telefone: o.cliente_whatsapp ? L.whatsBonito(o.cliente_whatsapp) : "" }, colar: true,
      aoSalvar: async (d) => {
        const dados = {};
        if (d.nome && d.nome !== o.cliente_nome) dados.cliente_nome = d.nome;
        if (d.id && d.id !== o.cliente_id) dados.cliente_id = d.id;
        if (!L.whatsDigitos(o.cliente_whatsapp) && L.whatsDigitos(d.telefone)) dados.cliente_whatsapp = L.whatsDigitos(d.telefone);
        if (Object.keys(dados).length) {
          try {
            const salvo = await gravar(dados, o.id);
            if (atual && atual.id === o.id) { atual = salvo; $("orcPrevia").innerHTML = previaHtml(salvo); atualizarVendaPrevia(salvo); }
            if (editando && editando.id === o.id && !sujo) preencher(salvo, "editar");
            renderLista();
          } catch (e) { N.aviso("A cliente foi salva, mas não consegui atualizar o orçamento: " + N.traduzirErro(e), true); }
        }
        atualizarCadastro();
        if (atual && atual.id === o.id) N.setMsg($("orcPreviaMsg"), "Dados de " + d.nome + " salvos no cadastro.", "ok");
      },
    });
  }
  $("orcWhats").addEventListener("input", (e) => { e.target.removeAttribute("aria-invalid"); atualizarWhatsHint(); marcarSujo(); });
  $("orcWhats").addEventListener("blur", (e) => { if (L.whatsDigitos(e.target.value)) e.target.value = L.whatsBonito(e.target.value); });
  $("orcFrete").addEventListener("input", (e) => { e.target.removeAttribute("aria-invalid"); marcarSujo(); atualizarTotais(); });
  $("orcObs").addEventListener("input", marcarSujo);
  $("orcAjusteTipo").addEventListener("change", () => {
    mostrarAjuste(); $("orcAjusteValor").removeAttribute("aria-invalid"); marcarSujo(); atualizarTotais();
    if ($("orcAjusteTipo").value) $("orcAjusteValor").focus();
  });
  $("orcAjusteValor").addEventListener("input", (e) => { e.target.removeAttribute("aria-invalid"); marcarSujo(); atualizarTotais(); });
  $("orcAjusteDesc").addEventListener("input", () => { marcarSujo(); atualizarTotais(); });
  $("orcAddItem").addEventListener("click", () => addItem().querySelector(".oi-nome").focus());
  $("orcNovo").addEventListener("click", novo);

  // ---------- busca no catálogo ----------
  const busca = $("orcBusca"), resultados = $("orcResultados");
  let achados = [];
  function renderBusca() {
    const q = busca.value.trim();
    if (!q) { resultados.hidden = true; resultados.innerHTML = ""; return; }
    achados = V.buscar(E.itens, q, { limite: 8, incluirOcultos: N.ehAdmin(), incluirTags: true });
    resultados.hidden = false;
    if (!achados.length) { resultados.innerHTML = '<div class="orc-nada">Nada encontrado no catálogo. Use "+ Adicionar produto" para escrever à mão.</div>'; return; }
    resultados.innerHTML = achados.map((it, i) => {
      const foto = fotoDoProduto(it.produto_id);
      return `<button type="button" class="orc-achado" role="option" data-i="${i}">
        <span class="orc-achado-foto">${foto ? `<img src="${esc(miniatura(foto))}" alt="" loading="lazy">` : ""}</span>
        <span class="orc-achado-txt"><b>${esc(it.nome)}</b><small>${it.preco != null ? esc(L.brl(it.preco)) : "sem preço"} · ${esc(V.estoqueTexto(it))}</small></span>
      </button>`;
    }).join("");
  }
  busca.addEventListener("input", renderBusca);
  busca.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && achados.length && !resultados.hidden) { e.preventDefault(); escolher(0); }
    if (e.key === "Escape") { busca.value = ""; renderBusca(); }
  });
  resultados.addEventListener("click", (e) => { const b = e.target.closest("[data-i]"); if (b) escolher(Number(b.dataset.i)); });
  document.addEventListener("click", (e) => { if (!e.target.closest(".orc-busca")) resultados.hidden = true; });
  function escolher(i) {
    const it = achados[i];
    if (!it) return;
    const p = E.produtos.find((x) => x.id === it.produto_id) || {};
    const dados = { nome: nomeSemCor(p.nome || it.nome, it.cor) || it.nome, cor: it.cor || "", quantidade: 1, valor_unitario: it.preco, foto: fotoDoProduto(it.produto_id), produto_id: it.produto_id };
    const vazia = [...itensEl.children].find(linhaVazia);
    let row;
    if (vazia) { vazia.remove(); row = addItem(dados); } else row = addItem(dados);
    itensEl.appendChild(row); // fica no fim da lista
    busca.value = ""; renderBusca();
    marcarSujo(); atualizarTotais();
    msg(it.nome + " entrou no orçamento" + (it.preco == null ? ". Esse produto está sem preço no catálogo: preencha o valor." : "."), it.preco == null ? "warn" : "ok");
    busca.focus();
  }

  // ---------- fotos ----------
  function comprimir(arquivo, maximo) {
    return createImageBitmap(arquivo).then((img) => {
      const k = Math.min(1, maximo / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      return new Promise((ok, erro) => c.toBlob((b) => (b ? ok(b) : erro(new Error("imagem inválida"))), "image/jpeg", 0.85));
    });
  }
  async function enviarFotoDaLinha(row, input) {
    const arq = input.files && input.files[0];
    input.value = "";
    if (!arq) return;
    if (!/^image\//.test(arq.type)) { msg("Esse arquivo não é uma foto. Escolha uma imagem (JPG ou PNG).", "warn"); return; }
    enviandoFotos++;
    const q = row.querySelector(".orc-foto-quadro");
    q.innerHTML = '<span aria-hidden="true">Enviando…</span>';
    msg("Enviando a foto…");
    try {
      const blob = await comprimir(arq, 1200);
      const caminho = "orcamentos/" + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ".jpg";
      const { error } = await sb.storage.from("fotos").upload(caminho, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
      if (error) throw error;
      row.dataset.foto = sb.storage.from("fotos").getPublicUrl(caminho).data.publicUrl;
      marcarSujo();
      msg("Foto adicionada.", "ok");
    } catch (e) {
      const t = String((e && e.message) || "");
      msg(/row-level|policy|permission|unauthorized|403/i.test(t)
        ? "Não consegui guardar a foto: falta liberar as fotos dos orçamentos (rode o arquivo supabase/orcamentos.sql no Supabase)."
        : "Não consegui enviar a foto: " + N.traduzirErro(e), "warn");
    } finally {
      enviandoFotos--;
      mostrarFoto(row);
    }
  }

  // ---------- validação na tela ----------
  const CAMPO_EL = { cliente_nome: () => $("orcCliente"), cliente_whatsapp: () => $("orcWhats"), frete: () => $("orcFrete"), ajuste_valor: () => $("orcAjusteValor"), itens: () => $("orcBusca") };
  const CAMPO_ITEM = { nome: ".oi-nome", quantidade: ".oi-qtd", valor_unitario: ".oi-valor" };
  function mostrarErros(erros) {
    document.querySelectorAll("#orcCard [aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    if (!erros.length) return true;
    let primeiro = null;
    erros.forEach((er) => {
      const el = er.idx != null ? itensEl.children[er.idx] && itensEl.children[er.idx].querySelector(CAMPO_ITEM[er.campo]) : CAMPO_EL[er.campo] && CAMPO_EL[er.campo]();
      if (el) { el.setAttribute("aria-invalid", "true"); if (!primeiro) primeiro = el; }
    });
    msg(erros.length === 1 ? erros[0].msg : "Falta arrumar " + erros.length + " coisas: " + erros.map((e) => e.msg).join(" "), "warn");
    if (primeiro) primeiro.focus();
    return false;
  }

  // Salva o que está no formulário. modo "rascunho" ou "envio" (para a prévia, tudo precisa estar completo).
  async function salvarForm(modo) {
    if (salvando) return null;
    if (O.semTabela) { msg("Antes, a administradora precisa rodar o arquivo supabase/orcamentos.sql no Supabase (veja o aviso no alto da aba).", "warn"); return null; }
    if (enviandoFotos) { msg("Espere a foto terminar de enviar.", "warn"); return null; }
    const f = lerForm();
    if (!mostrarErros(L.validar(f, modo))) return null;
    const dados = L.normalizar(f);
    dados.cliente_id = (clientePorNome(dados.cliente_nome) || {}).id || null;
    salvando = true;
    ["orcSalvar", "orcVer", "orcCopiarForm"].forEach((id) => { $(id).disabled = true; });
    try {
      const salvo = await gravar(dados, editando && editando.id);
      const eraNovo = !editando;
      editando = salvo;
      sujo = false;
      preencher(salvo, "editar");
      renderLista();
      msg(eraNovo ? "Orçamento " + L.numeroTexto(salvo.numero) + " salvo como rascunho." : "Alterações salvas.", "ok");
      return salvo;
    } catch (e) {
      if (ehErroDeTabela(e)) { O.semTabela = true; $("orcSemTabela").hidden = false; }
      msg("Não consegui salvar: " + N.traduzirErro(e) + " Nada se perdeu do que está no formulário.", "warn");
      return null;
    } finally {
      salvando = false;
      ["orcSalvar", "orcVer", "orcCopiarForm"].forEach((id) => { $(id).disabled = false; });
    }
  }
  $("orcSalvar").addEventListener("click", () => salvarForm("rascunho"));
  $("orcVer").addEventListener("click", async () => {
    const salvo = sujo || !editando ? await salvarForm("envio") : (mostrarErros(L.validar(lerForm(), "envio")) ? editando : null);
    if (salvo) abrirPrevia(salvo);
  });
  $("orcCopiarForm").addEventListener("click", async () => {
    const salvo = sujo || !editando ? await salvarForm("envio") : (mostrarErros(L.validar(lerForm(), "envio")) ? editando : null);
    if (salvo) copiarTexto(salvo, $("orcMsg"));
  });

  // =====================================================================
  // LISTA DE ORÇAMENTOS
  // =====================================================================
  const resumoItens = (o) => (o.itens || []).map((it) => L.nomeDoItem(it) + (it.quantidade > 1 ? " × " + it.quantidade : "")).join("; ");
  const palha = (o) => V.norm([o.cliente_nome, o.cliente_whatsapp, "#" + o.numero, "nº " + o.numero, String(o.numero), L.statusNome(o.status), resumoItens(o), o.observacoes, o.venda_numero ? "vendido venda " + o.venda_numero : ""].join(" "));
  function renderLista() {
    const contagem = { todos: O.lista.length };
    L.STATUS.forEach((s) => { contagem[s.id] = O.lista.filter((o) => o.status === s.id).length; });
    $("orcFiltro").innerHTML = [{ id: "todos", nome: "Todos" }].concat(L.STATUS)
      .map((s) => `<button type="button" class="chip${O.filtro === s.id ? " on" : ""}" data-f="${s.id}" aria-pressed="${O.filtro === s.id}">${esc(s.nome)} · ${contagem[s.id] || 0}</button>`).join("");
    const soma = (st) => O.lista.filter((o) => o.status === st).reduce((t, o) => t + L.contaDe(o).total, 0);
    N.renderTiles($("orcResumo"), [
      { k: "Orçamentos", v: String(O.lista.length), s: contagem.rascunho + (contagem.rascunho === 1 ? " rascunho" : " rascunhos") },
      { k: "Aguardando resposta", v: L.brl(soma("enviado")), s: contagem.enviado + (contagem.enviado === 1 ? " enviado" : " enviados") },
      { k: "Aprovados", v: L.brl(soma("aprovado")), s: contagem.aprovado + (contagem.aprovado === 1 ? " orçamento" : " orçamentos") },
    ]);
    const tokens = V.norm($("orcPesquisa").value).split(" ").filter(Boolean);
    const lista = O.lista.filter((o) => (O.filtro === "todos" || o.status === O.filtro) && tokens.every((t) => palha(o).includes(t)));
    const el = $("orcLista");
    if (!O.carregado) { el.innerHTML = '<div class="empty-state">Carregando os orçamentos…</div>'; return; }
    if (!lista.length) {
      el.innerHTML = `<div class="empty-state">${O.semTabela ? "Os orçamentos aparecem aqui depois do passo do banco (aviso no alto da aba)." : O.lista.length ? "Nenhum orçamento neste filtro." : "Nenhum orçamento ainda. Monte o primeiro no formulário acima."}</div>`;
      return;
    }
    el.innerHTML = lista.map((o) => {
      const c = L.contaDe(o);
      const n = (o.itens || []).length;
      return `<div class="sale-row orc-row" data-id="${esc(o.id)}">
        <div class="sale-main">
          <div><span class="sale-num">${esc(L.numeroTexto(o.numero))}</span><span class="sale-name">${esc(o.cliente_nome)}</span>${pill(o.status)}</div>
          <div class="sale-sub">${n} ${n === 1 ? "produto" : "produtos"}${n ? ": " + esc(resumoItens(o)) : ""}</div>
          <div class="sale-sub">Criado em ${esc(dataHora(o.criado_em))}${o.cliente_whatsapp ? " · " + esc(L.whatsBonito(o.cliente_whatsapp)) : ""}</div>
        </div>
        <div class="sale-money">
          <div class="sale-value">${esc(L.brl(c.total))}</div>
          <div class="sale-comm">${[c.ajuste.tipo ? (c.ajuste.valor < 0 ? "desconto de " : "acréscimo de ") + esc(L.brl(Math.abs(c.ajuste.valor))) : "", c.frete ? "frete de " + esc(L.brl(c.frete)) : "sem frete"].filter(Boolean).join(" · ")}</div>
          <select class="status-select orc-status" aria-label="Situação do orçamento ${esc(L.numeroTexto(o.numero))}">${L.STATUS.map((s) => `<option value="${s.id}"${s.id === o.status ? " selected" : ""}>${esc(s.nome)}</option>`).join("")}</select>
          <div class="sale-tools">
            <button type="button" class="btn ghost" data-act="ver">Ver e enviar</button>
            <button type="button" class="btn ghost" data-act="copiar">Copiar</button>
            <button type="button" class="btn ghost" data-act="duplicar">Duplicar</button>
            ${o.venda_numero ? `<span class="pill ok">Venda nº ${esc(String(o.venda_numero))}</span>` : o.status === "aprovado" ? '<button type="button" class="btn" data-act="vender">Lançar venda</button>' : ""}
          </div>
        </div>
        <div class="client-actions">
          <button type="button" class="icon-btn" data-act="editar" title="Editar orçamento" aria-label="Editar orçamento ${esc(L.numeroTexto(o.numero))}">✎</button>
          <button type="button" class="icon-btn danger" data-act="excluir" title="Excluir orçamento" aria-label="Excluir orçamento ${esc(L.numeroTexto(o.numero))}">✕</button>
        </div>
      </div>`;
    }).join("");
  }
  $("orcFiltro").addEventListener("click", (e) => { const b = e.target.closest("[data-f]"); if (b) { O.filtro = b.dataset.f; renderLista(); } });
  $("orcPesquisa").addEventListener("input", renderLista);

  $("orcLista").addEventListener("change", async (e) => {
    if (!e.target.classList.contains("orc-status")) return;
    const o = O.lista.find((x) => x.id === e.target.closest("[data-id]").dataset.id);
    if (o) await mudarStatus(o, e.target.value);
  });
  $("orcLista").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const o = O.lista.find((x) => x.id === b.closest("[data-id]").dataset.id);
    if (!o) return;
    const act = b.dataset.act;
    if (act === "ver") abrirPrevia(o);
    else if (act === "copiar") copiarTexto(o, $("orcListaMsg"));
    else if (act === "editar") { if (!podeDescartar()) return; preencher(o, "editar"); irParaFormulario(); }
    else if (act === "vender") lancarVenda(o);
    else if (act === "duplicar") {
      if (!podeDescartar()) return;
      preencher(Object.assign({}, o, { status: "rascunho" }), "copia");
      irParaFormulario();
      msg("Cópia carregada. Troque a cliente ou os produtos e salve.", "ok");
    } else if (act === "excluir") {
      N.armConfirm(b, () => excluir(o));
    }
  });
  function irParaFormulario() { $("orcCard").scrollIntoView({ behavior: "smooth", block: "start" }); setTimeout(() => $("orcCliente").focus({ preventScroll: true }), 300); }

  async function excluir(o) {
    const { error } = await sb.from(TABELA).delete().eq("id", o.id);
    if (error) { N.aviso("Não consegui excluir: " + N.traduzirErro(error), true); return; }
    O.lista = O.lista.filter((x) => x.id !== o.id);
    // apaga as fotos enviadas só para este orçamento (as do catálogo e as usadas em outro orçamento ficam)
    const marca = "/storage/v1/object/public/fotos/";
    const emUso = new Set(O.lista.flatMap((x) => (x.itens || []).map((it) => it.foto)));
    const apagar = (o.itens || []).map((it) => it.foto).filter((u) => u && u.includes(marca + "orcamentos/") && !emUso.has(u)).map((u) => decodeURIComponent(u.split(marca)[1].split("?")[0]));
    if (apagar.length) sb.storage.from("fotos").remove(apagar).catch(() => {});
    if (editando && editando.id === o.id) { sujo = false; preencher(null); }
    renderLista();
    N.aviso("Orçamento " + L.numeroTexto(o.numero) + " excluído.");
  }

  async function mudarStatus(o, status, silencioso) {
    if (o.status === status) return o;
    const dados = { status };
    if (status === "enviado" && !o.enviado_em) dados.enviado_em = new Date().toISOString();
    try {
      const salvo = await gravar(dados, o.id);
      if (editando && editando.id === o.id) { editando = salvo; if (!sujo) preencher(salvo, "editar"); }
      if (atual && atual.id === o.id) { atual = salvo; $("orcStatusPrevia").value = salvo.status; atualizarVendaPrevia(salvo); }
      renderLista();
      if (!silencioso) N.aviso("Orçamento " + L.numeroTexto(o.numero) + ": " + L.statusNome(status) + ".");
      return salvo;
    } catch (e) {
      N.aviso("Não consegui mudar a situação: " + N.traduzirErro(e), true);
      renderLista();
      return o;
    }
  }
  // Depois de mandar para a cliente, um rascunho passa a "Enviado"
  async function marcarEnviado(o, msgEl, texto) {
    if (o.status !== "rascunho") { if (texto) N.setMsg(msgEl, texto, "ok"); return; }
    await mudarStatus(o, "enviado", true);
    if (texto) N.setMsg(msgEl, texto + " O orçamento passou para Enviado.", "ok");
  }

  // =====================================================================
  // PRÉVIA E ENVIO
  // =====================================================================
  const dlg = $("dlgOrc");
  $("orcStatusPrevia").innerHTML = L.STATUS.map((s) => `<option value="${s.id}">${esc(s.nome)}</option>`).join("");

  function previaHtml(o) {
    const c = L.contaDe(o);
    const loja = O.loja;
    const contato = [loja.whatsapp ? "WhatsApp " + L.whatsBonito(loja.whatsapp) : "", loja.instagram ? "@" + String(loja.instagram).replace(/^@/, "") : ""].filter(Boolean).join(" · ");
    return `<article class="orc-folha" aria-label="Orçamento ${esc(L.numeroTexto(o.numero))} para ${esc(o.cliente_nome)}">
      <header class="orc-folha-topo">
        <div class="brand" aria-label="Life Ateliê"><span class="brand-life">LIFE</span><span class="brand-script">Ateliê</span></div>
        <div class="orc-folha-titulo">Orçamento</div>
        <div class="orc-folha-meta">${esc(L.numeroTexto(o.numero))} · ${esc(L.dataBR(o.criado_em))}</div>
      </header>
      <div class="orc-folha-para"><span>Para</span><b>${esc(o.cliente_nome)}</b>${o.cliente_whatsapp ? `<small>${esc(L.whatsBonito(o.cliente_whatsapp))}</small>` : ""}</div>
      <ul class="orc-folha-itens">${c.linhas.map((l) => `<li>
          <div class="orc-folha-foto">${l.foto ? `<img src="${esc(miniatura(l.foto))}" alt="${esc(L.nomeDoItem(l))}">` : `<span aria-hidden="true">${esc((String(l.nome).replace(/^(bolsa|mochila|tag|mouse pad)\s+/i, "").charAt(0) || "L").toUpperCase())}</span>`}</div>
          <div class="orc-folha-desc">
            <b>${esc(l.nome)}</b>
            ${l.cor ? `<span>Cor: ${esc(l.cor)}</span>` : ""}
            <span>Quantidade: ${esc(String(l.quantidade))}</span>
            <span>Valor: ${esc(L.brl(L.lerValor(l.valor_unitario) || 0))} cada</span>
          </div>
          <div class="orc-folha-valor">${esc(L.brl(l.total))}</div>
        </li>`).join("")}</ul>
      <dl class="orc-folha-totais">
        <div><dt>Subtotal dos produtos</dt><dd>${esc(L.brl(c.subtotal))}</dd></div>
        ${c.ajuste.tipo ? `<div class="orc-folha-ajuste${c.ajuste.valor < 0 ? " desconto" : ""}"><dt>${esc(c.ajuste.rotulo)}</dt><dd>${esc(L.valorAjuste(c.ajuste.valor))}</dd></div>` : ""}
        <div><dt>Frete</dt><dd>${esc(L.brl(c.frete))}</dd></div>
        <div class="orc-folha-total"><dt>Total</dt><dd>${esc(L.brl(c.total))}</dd></div>
      </dl>
      ${o.observacoes ? `<div class="orc-folha-obs"><span>Observações</span><p>${esc(o.observacoes)}</p></div>` : ""}
      <footer class="orc-folha-rodape">Life Ateliê · bolsas em couro legítimo${contato ? "<br>" + esc(contato) : ""}</footer>
    </article>`;
  }

  const podeCopiarImagem = () => !!(navigator.clipboard && navigator.clipboard.write && window.ClipboardItem && window.isSecureContext);
  const podeCompartilharArquivo = () => {
    try { return !!(navigator.canShare && navigator.canShare({ files: [new File(["x"], "x.png", { type: "image/png" })] })); } catch (e) { return false; }
  };
  const celular = () => /android|iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /macintosh/i.test(navigator.userAgent));

  function abrirPrevia(o) {
    atual = o;
    $("orcPrevia").innerHTML = previaHtml(o);
    $("orcStatusPrevia").value = o.status;
    $("orcCopiarImagem").hidden = !podeCopiarImagem() || celular();
    $("orcCompartilhar").hidden = !podeCompartilharArquivo();
    $("orcWhatsBtn").disabled = !L.whatsDigitos(o.cliente_whatsapp);
    $("orcDicaEnvio").textContent = !L.whatsDigitos(o.cliente_whatsapp)
      ? "Este orçamento está sem WhatsApp válido. Toque em Editar e preencha o número com DDD."
      : celular()
        ? "Mais prático no celular: \"Enviar pelo WhatsApp\" manda o texto. Para mandar a imagem, toque em \"Enviar imagem\" e escolha a conversa da cliente."
        : "Mais prático no computador: \"Copiar imagem\" (ou \"Copiar texto\") e cole com Ctrl+V na conversa da cliente no WhatsApp Web.";
    N.setMsg($("orcPreviaMsg"), "");
    atualizarVendaPrevia(o);
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
  }

  async function copiarTexto(o, msgEl) {
    const ok = await N.copiar(L.textoWhats(o));
    if (!ok) { N.setMsg(msgEl, "Não consegui copiar sozinho. Abra o orçamento em \"Ver e enviar\" e use \"Enviar pelo WhatsApp\".", "warn"); return; }
    N.aviso("Orçamento copiado. Cole na conversa da cliente.");
    await marcarEnviado(o, msgEl, "Texto do orçamento " + L.numeroTexto(o.numero) + " copiado: cole na conversa da cliente (Ctrl+V ou segurar o dedo e Colar).");
  }

  async function comBotao(botao, trabalho) {
    const original = botao.textContent;
    botao.disabled = true; botao.textContent = "Preparando…";
    try { await trabalho(); }
    catch (e) { N.setMsg($("orcPreviaMsg"), String((e && e.message) || "Algo deu errado.") + " Tente de novo.", "warn"); }
    finally { botao.disabled = false; botao.textContent = original; }
  }
  const avisoFotos = (n) => (n ? " (" + n + (n === 1 ? " foto não pôde" : " fotos não puderam") + " entrar na imagem e " + (n === 1 ? "aparece" : "aparecem") + " com a inicial do produto)" : "");

  $("orcWhatsBtn").addEventListener("click", async () => {
    if (!atual) return;
    N.abrirWhats(atual.cliente_whatsapp, L.textoWhats(atual), $("orcPreviaMsg"), "Abrindo a conversa com " + atual.cliente_nome.split(" ")[0] + " no WhatsApp…");
    await marcarEnviado(atual);
  });
  $("orcCopiarTexto").addEventListener("click", () => atual && copiarTexto(atual, $("orcPreviaMsg")));
  $("orcCopiarImagem").addEventListener("click", (e) => comBotao(e.currentTarget, async () => {
    let falt = 0;
    // a promessa vai direto para o ClipboardItem (o Safari exige isso dentro do toque)
    const png = A.gerarImagem(atual, O.loja).then((r) => { falt = r.fotosFaltando; return r.blob; });
    await navigator.clipboard.write([new window.ClipboardItem({ "image/png": png })]);
    await marcarEnviado(atual, $("orcPreviaMsg"), "Imagem copiada" + avisoFotos(falt) + ": cole com Ctrl+V na conversa da cliente no WhatsApp Web.");
  }));
  $("orcCompartilhar").addEventListener("click", (e) => comBotao(e.currentTarget, async () => {
    const r = await A.gerarImagem(atual, O.loja);
    const arquivo = new File([r.blob], A.nomeArquivo(atual) + ".png", { type: "image/png" });
    try {
      await navigator.share({ files: [arquivo], title: "Orçamento Life Ateliê" });
    } catch (err) {
      if (err && err.name === "AbortError") return; // desistiu de enviar
      throw new Error("O celular não deixou compartilhar a imagem. Use \"Baixar imagem\" e anexe na conversa.");
    }
    await marcarEnviado(atual, $("orcPreviaMsg"), "Imagem enviada" + avisoFotos(r.fotosFaltando) + ".");
  }));
  $("orcBaixarImagem").addEventListener("click", (e) => comBotao(e.currentTarget, async () => {
    const r = await A.gerarImagem(atual, O.loja);
    N.baixarArquivo(r.blob, A.nomeArquivo(atual) + ".png", "image/png");
    N.setMsg($("orcPreviaMsg"), "Imagem baixada" + avisoFotos(r.fotosFaltando) + ". Anexe na conversa da cliente.", "ok");
  }));
  $("orcBaixarPdf").addEventListener("click", (e) => comBotao(e.currentTarget, async () => {
    const r = await A.gerarPdf(atual, O.loja);
    N.baixarArquivo(r.blob, A.nomeArquivo(atual) + ".pdf", "application/pdf");
    N.setMsg($("orcPreviaMsg"), "PDF baixado" + avisoFotos(r.fotosFaltando) + ". Anexe na conversa da cliente.", "ok");
  }));
  $("orcEditarPrevia").addEventListener("click", () => {
    if (!atual) return;
    if (!(editando && editando.id === atual.id) && !podeDescartar()) return;
    dlg.close();
    preencher(atual, "editar");
    irParaFormulario();
  });
  $("orcStatusPrevia").addEventListener("change", async (e) => { if (atual) await mudarStatus(atual, e.target.value); });

  // =====================================================================
  // VENDA: orçamento aprovado e pago → vira venda (pelo formulário de vendas, que baixa o estoque e calcula a comissão)
  // =====================================================================
  function atualizarVendaPrevia(o) {
    const vendido = !!o.venda_numero;
    $("orcVenderBtn").hidden = vendido || o.status !== "aprovado";
    $("orcVendaInfo").innerHTML = vendido
      ? `Venda <b>nº ${esc(String(o.venda_numero))}</b> lançada${o.venda_em ? " em " + esc(L.dataBR(o.venda_em)) : ""} ✓`
      : o.status === "enviado" ? "Quando ela aprovar, mude a situação para Aprovado para lançar a venda." : "";
  }
  $("orcDadosCliente").addEventListener("click", () => atual && abrirCadastroDoOrcamento(atual));
  $("orcVenderBtn").addEventListener("click", () => atual && lancarVenda(atual));

  // item do orçamento → linha do formulário de vendas (produto do estoque + cor)
  function linhaDeVenda(it) {
    const doProduto = it.produto_id ? E.itens.filter((i) => i.produto_id === it.produto_id) : [];
    const item = doProduto.length > 1 ? doProduto.find((i) => V.chaveCor(i.cor) === V.chaveCor(it.cor)) || null : doProduto[0] || null;
    const qtd = Number(it.quantidade) || 1;
    if (item) return item.ehTag ? { produto: N.TAG_PRODUTO, cor: N.corTagNome(item.cor) || item.cor, qtd } : { produto: item.modelo, cor: item.cor, qtd };
    const s = V.separarNome(it.nome); // escrito à mão: "Bolsa Alice" → "Alice"
    return { produto: s.modelo || it.nome, cor: it.cor || s.cor || "", qtd };
  }
  function dadosDaVenda(o, observacao) {
    const c = L.contaDe(o);
    const obs = ["Orçamento " + L.numeroTexto(o.numero)];
    if (c.ajuste.tipo) obs.push(c.ajuste.rotulo + ": " + L.valorAjuste(c.ajuste.valor));
    if (c.frete) obs.push("Frete " + L.brl(c.frete) + " (fora do valor da venda)");
    const extra = observacao != null ? observacao : o.observacoes;
    if (extra) obs.push(String(extra).replace(/\s+/g, " ").trim());
    return {
      nome: o.cliente_nome, linhas: (o.itens || []).filter((it) => !L.itemVazio(it)).map(linhaDeVenda),
      valor: L.arred(c.total - c.frete), pagamento: "", parcelas: 1, pct: N.currentPct(), obs: obs.join(" · ").slice(0, 500),
    };
  }
  let lancando = false;
  async function lancarVenda(o) {
    if (o.venda_numero || lancando) return;
    if (editando && editando.id === o.id && sujo) { N.aviso("Salve as alterações do orçamento antes de lançar a venda.", true); return; }
    if (dlg.open) dlg.close();
    lancando = true;
    try {
      // dados da cliente escritos na observação (CPF, endereço, CEP…) vão para o cadastro dela
      const daObs = window.LerCliente.dadosNaObservacao(o.observacoes || "");
      const cad = daObs.achou ? await cadastroPelaObservacao(o, daObs.campos) : { html: "", nome: "" };
      const c = L.contaDe(o);
      const nomeVenda = cad.nome || (clienteDoOrcamento(o) || {}).nome || o.cliente_nome;
      const html = `Venda do orçamento <b>${esc(L.numeroTexto(o.numero))}</b> de <b>${esc(nomeVenda)}</b>: confira, escolha a forma de pagamento e toque em <b>Registrar venda</b>.` +
        (c.frete ? ` O frete (${esc(L.brl(c.frete))}) ficou fora do valor, na observação.` : "") + cad.html;
      N.lancarDoOrcamento(Object.assign(dadosDaVenda(o, daObs.resto), { nome: nomeVenda }), { html, chave: o.id, aoRegistrar: (res) => marcarVendido(o, res) });
    } finally { lancando = false; }
  }
  const NOME_DADO = { documento: "CPF/CNPJ", email: "e-mail", telefone: "telefone", cep: "CEP", rua: "endereço", numero: "endereço", complemento: "endereço", bairro: "endereço", cidade: "endereço", uf: "endereço" };
  async function cadastroPelaObservacao(o, campos) {
    const quais = [...new Set(["documento", "rua", "numero", "complemento", "bairro", "cidade", "uf", "cep", "telefone", "email"].filter((k) => campos[k]).map((k) => NOME_DADO[k]))].join(", ");
    let c = clienteDoOrcamento(o), aviso = "";
    if (!c && campos.documento) { // o CPF já está cadastrado em outro nome: usa esse cadastro (não duplica)
      const d = window.LerCliente.acharDuplicadas({ nome: o.cliente_nome, documento: campos.documento }, E.clientes).find((x) => x.forte);
      if (d) { c = d.cliente; aviso = ` Ela já estava cadastrada como <b>${esc(c.nome)}</b> (mesmo CPF/CNPJ): a venda vai nesse cadastro.`; }
    }
    const invalidos = window.LerCliente.validarCadastro(Object.assign({ nome: o.cliente_nome }, campos)).map((x) => x.campo);
    invalidos.forEach((k) => delete campos[k]); // dado com formato errado não vai para o cadastro
    try {
      const r = c ? await sb.from("clientes").update(campos).eq("id", c.id).select().single() : await sb.from("clientes").insert(Object.assign({ nome: o.cliente_nome }, campos)).select().single();
      if (r.error) throw r.error;
      await N.recarregar(["clientes"]);
      if (r.data && r.data.id && r.data.id !== o.cliente_id) gravar({ cliente_id: r.data.id }, o.id).catch(() => {});
      atualizarCadastro();
      return {
        nome: (r.data && r.data.nome) || "",
        html: ` <br>Os dados que estavam na observação (${esc(quais)}) foram para o cadastro de ${esc((r.data && r.data.nome) || o.cliente_nome)}.` + aviso +
          (invalidos.length ? ` Não usei: ${esc(invalidos.map((k) => NOME_DADO[k] || k).join(", "))} (formato errado, confira).` : ""),
      };
    } catch (e) {
      return { nome: "", html: ` <br>Não consegui levar os dados da observação para o cadastro: ${esc(N.traduzirErro(e))}.` };
    }
  }
  async function marcarVendido(o, res) {
    const numero = res && res.numero;
    if (!numero) return "";
    try {
      await gravar({ venda_numero: numero, venda_em: new Date().toISOString() }, o.id);
      renderLista();
      return "Orçamento " + L.numeroTexto(o.numero) + " marcado como vendido.";
    } catch (e) {
      if (/venda_numero|venda_em|column|schema cache/i.test(String((e && e.message) || ""))) return "Para o orçamento ficar marcado como vendido, rode de novo o arquivo supabase/orcamentos.sql no Supabase.";
      return "Não consegui marcar o orçamento como vendido: " + N.traduzirErro(e);
    }
  }

  // =====================================================================
  // INÍCIO DA ABA
  // =====================================================================
  let primeiraVez = true;
  function aoAbrir() {
    if (primeiraVez) {
      primeiraVez = false;
      preencher(null);
      renderLista();
      carregarLoja().catch(() => {});
      carregar();
    }
    atualizarCadastro(); // o cadastro pode ter mudado em outra aba
  }
  // não deixa sair da página com um orçamento sem salvar
  window.addEventListener("beforeunload", (e) => { if (sujo) { e.preventDefault(); e.returnValue = ""; } });

  window.LifeOrcamentos = { aoAbrir, recarregar: carregar };
})();
