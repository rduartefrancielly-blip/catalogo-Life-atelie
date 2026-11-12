// Life Ateliê · Vendas: abas Estoque, Tags, Cadastro e Bling e backup (usam o núcleo de vendas.js).
(function () {
  "use strict";
  const N = window.LifeVendasNucleo;
  const { E, V, $, esc, sb, brl } = N;
  const pill = (txt, cls) => `<span class="pill ${cls}">${esc(txt)}</span>`;
  const CAMPOS = ["telefone", "documento", "email", "cep", "rua", "numero", "complemento", "bairro", "cidade", "uf"];

  // =====================================================================
  // ESTOQUE
  // =====================================================================
  const FS = { filtro: "todos", abertos: {} };
  const baixo = (i) => i.qtd != null && i.qtd > 0 && i.qtd <= E.ajustes.estoque_baixo;
  const itensEstoque = () => E.itens.filter((i) => !i.ehTag && ($("stockHidden").checked || i.visivel));
  function renderStock() {
    const todos = itensEstoque();
    const esg = todos.filter(V.esgotado), bx = todos.filter(baixo);
    const pecas = todos.reduce((s, i) => s + (i.qtd || 0), 0);
    const modelos = new Set(todos.map((i) => i.modelo)).size;
    N.renderTiles($("stockSummary"), [
      { k: "Em estoque", v: String(pecas), s: "peças em " + modelos + (modelos === 1 ? " produto" : " produtos") },
      { k: "Esgotados", v: String(esg.length), s: esg.length === 1 ? "cor zerada" : "cores zeradas", alert: esg.length > 0 },
      { k: "Estoque baixo", v: String(bx.length), s: "até " + E.ajustes.estoque_baixo + (E.ajustes.estoque_baixo === 1 ? " peça" : " peças"), alert: bx.length > 0 },
    ]);
    $("stockDot").hidden = !bx.length; $("stockDot").textContent = String(bx.length);
    document.querySelectorAll("#stockFilter .chip").forEach((c) => c.classList.toggle("on", c.dataset.f === FS.filtro));
    let lista = V.buscar(todos, $("stockSearch").value, { limite: 3000, incluirOcultos: true, incluirTags: false });
    if (FS.filtro === "esgotados") lista = lista.filter(V.esgotado); else if (FS.filtro === "baixo") lista = lista.filter(baixo);
    const grupos = new Map();
    lista.slice().sort((a, b) => a.modelo.localeCompare(b.modelo, "pt-BR") || a.cor.localeCompare(b.cor, "pt-BR")).forEach((i) => { if (!grupos.has(i.modelo)) grupos.set(i.modelo, []); grupos.get(i.modelo).push(i); });
    const box = $("stockList");
    box.innerHTML = "";
    if (!grupos.size) { box.innerHTML = '<div class="empty-state">Nenhum produto neste filtro.</div>'; return; }
    const filtrando = !!$("stockSearch").value.trim() || FS.filtro !== "todos";
    grupos.forEach((its, modelo) => {
      const total = its.reduce((s, i) => s + (i.qtd || 0), 0), preco = its.map((i) => i.preco).find((p) => p != null);
      const det = document.createElement("details");
      det.className = "stock-group";
      if (filtrando || FS.abertos[modelo]) det.open = true;
      det.innerHTML = '<summary><span class="oname">' + esc(modelo) + '</span><span class="ometa">' + (preco != null ? brl(preco) + " · " : "") + total + (total === 1 ? " peça" : " peças") + "</span></summary><div class=\"stock-body\"></div>";
      det.addEventListener("toggle", () => { if (!filtrando) FS.abertos[modelo] = det.open; });
      const corpo = det.querySelector(".stock-body");
      its.forEach((i) => {
        const row = document.createElement("div");
        row.className = "stock-row" + (V.esgotado(i) ? " esgotado" : "");
        row.innerHTML = '<div class="stock-info"><div class="pname">' + esc(i.cor || i.nome) + (i.variacao && i.cor !== i.variacao ? " · " + esc(i.variacao) : "") + (V.esgotado(i) ? '<span class="pill out">Esgotado</span>' : baixo(i) ? '<span class="pill low">Baixo</span>' : "") + (i.visivel ? "" : '<span class="pill neutro">Oculto</span>') + "</div>" +
          '<div class="pmeta">' + esc(i.codigo || "sem código") + (i.preco != null ? " · " + esc(brl(i.preco)) : "") + "</div></div>" +
          '<div class="qty-ctl"><button type="button" class="step" data-act="minus" aria-label="Diminuir"' + (i.qtd == null || i.qtd <= 0 ? " disabled" : "") + '>−</button><input type="number" min="0" step="1" value="' + (i.qtd == null ? "" : i.qtd) + '" placeholder="–" aria-label="Unidades em estoque"><button type="button" class="step" data-act="plus" aria-label="Aumentar"' + (i.qtd == null ? " disabled" : "") + ">+</button></div>";
        row.querySelector('[data-act="minus"]').addEventListener("click", () => ajustar(i, "saida", 1, "Saída manual (−1) na tela de estoque"));
        row.querySelector('[data-act="plus"]').addEventListener("click", () => ajustar(i, "entrada", 1, "Entrada manual (+1) na tela de estoque"));
        row.querySelector(".qty-ctl input").addEventListener("change", (e) => {
          const n = parseInt(e.target.value, 10);
          if (isNaN(n) || n < 0) { N.setMsg($("stockMsg"), "Digite a quantidade certa (0 ou mais).", "warn"); renderStock(); return; }
          if (n !== i.qtd) ajustar(i, "ajuste", n, i.qtd == null ? "Controle de estoque iniciado na tela de estoque" : "Quantidade corrigida na tela de estoque");
        });
        corpo.appendChild(row);
      });
      box.appendChild(det);
    });
  }
  async function ajustar(item, tipo, qtd, motivo) {
    const { error } = await sb.rpc("ajustar_estoque", { p_produto: item.produto_id, p_variacao: item.variacao, p_tipo: tipo, p_quantidade: qtd, p_motivo: motivo });
    if (error) { N.setMsg($("stockMsg"), N.traduzirErro(error), "warn"); renderStock(); return; }
    await N.recarregar(["produtos"]);
    N.setMsg($("stockMsg"), item.nome + ": estoque atualizado.", "ok");
    N.renderTudo();
    if (E.mov.length || E.movFim) carregarMov(true);
  }
  $("stockSearch").addEventListener("input", renderStock);
  $("stockHidden").addEventListener("change", renderStock);
  $("stockFilter").addEventListener("click", (e) => { const b = e.target.closest("[data-f]"); if (b) { FS.filtro = b.dataset.f; renderStock(); } });

  const TIPO_MOV = { venda: "Venda", cancelamento: "Cancelamento", entrada: "Entrada", saida: "Saída", ajuste: "Ajuste", importacao: "Importação" };
  async function carregarMov(reset) {
    const tipo = $("histType").value, pagina = 200;
    if (reset) { E.mov = []; E.movFim = false; }
    if (E.movFim) return renderHist();
    let q = sb.from("movimentos_estoque").select("*").order("criado_em", { ascending: false }).order("id");
    if (tipo) q = q.eq("tipo", tipo);
    const { data, error } = await q.range(E.mov.length, E.mov.length + pagina - 1);
    if (error) { $("histList").innerHTML = '<li class="form-msg warn">' + esc(N.traduzirErro(error)) + "</li>"; return; }
    E.mov = E.mov.concat(data || []);
    if (!data || data.length < pagina) E.movFim = true;
    renderHist();
  }
  function renderHist() {
    const q = V.norm($("histSearch").value);
    const lista = E.mov.filter((m) => !q || V.norm((m.produto_nome || "") + " " + (m.produto_codigo || "") + " " + (m.variacao || "") + " " + (m.motivo || "")).includes(q));
    $("histList").innerHTML = lista.length ? lista.slice(0, 150).map((m) => {
      const d = m.quantidade_delta;
      return '<li><div class="h1"><b>' + esc(m.produto_nome || "Produto removido") + (m.variacao ? " · " + esc(m.variacao) : "") + '</b><span class="' + (d > 0 ? "mais" : d < 0 ? "menos" : "") + '">' + (d == null ? "" : (d > 0 ? "+" : "") + d) + "</span></div>" +
        '<div class="meta">' + esc(TIPO_MOV[m.tipo] || m.tipo) + " · " + esc(N.dataHora(m.criado_em)) + " · " + (m.quantidade_antes == null ? "sem controle" : m.quantidade_antes) + " → " + (m.quantidade_depois == null ? "sem controle" : m.quantidade_depois) + (m.usuario_email ? " · " + esc(m.usuario_email) : "") + "</div>" +
        (m.motivo ? '<div class="meta">' + esc(m.motivo) + "</div>" : "") + "</li>";
    }).join("") : '<li class="empty-state">Nada no histórico com esse filtro.</li>';
    const mais = !E.movFim || lista.length > 150;
    $("histMore").hidden = !mais;
    $("histMore").textContent = lista.length > 150 ? "Mostrando 150 de " + lista.length + ". Refine a busca." : "Ver mais";
    $("histMore").disabled = lista.length > 150;
  }
  $("histSearch").addEventListener("input", () => { renderHist(); if (!E.movFim && $("histSearch").value.trim()) carregarMov(false); });
  $("histType").addEventListener("change", () => carregarMov(true));
  $("histMore").addEventListener("click", () => carregarMov(false));

  // =====================================================================
  // TAGS
  // =====================================================================
  const FT = { sel: new Set() };
  const ST = { a_fazer: "A fazer", enviada: "Enviada", pronta: "Pronta" };
  function tagsFiltradas() {
    const f = $("tagFilter").value, q = V.norm($("tagSearch").value);
    return E.tags.filter((t) => (f === "todas" ? t.status !== "cancelada" : t.status === f) && (!q || V.norm((t.cliente_nome || "") + " " + (t.iniciais || "") + " " + t.cor).includes(q)));
  }
  const numeroDaTag = (t) => { const v = t.venda_id ? E.vendas.find((x) => x.id === t.venda_id) : null; return v ? "#" + N.numeroDe(v) + (v.origem === "legado" ? " (antiga)" : "") : "sem venda"; };
  function renderTags() {
    const lista = tagsFiltradas();
    [...FT.sel].forEach((id) => { if (!lista.some((t) => t.id === id)) FT.sel.delete(id); });
    const fazer = E.tags.filter((t) => t.status === "a_fazer").length;
    $("tagsDot").hidden = !fazer; $("tagsDot").textContent = String(fazer);
    $("tagSelAll").textContent = FT.sel.size && FT.sel.size === lista.length ? "Limpar seleção" : "Selecionar todas";
    $("tagSelCount").textContent = FT.sel.size ? FT.sel.size + (FT.sel.size === 1 ? " selecionada" : " selecionadas") : lista.length + (lista.length === 1 ? " tag" : " tags");
    $("tagWhats").hidden = !E.ajustes.telefone_fabrica;
    $("tagSent").disabled = !FT.sel.size; $("tagCopy").disabled = !FT.sel.size; $("tagPrint").disabled = !FT.sel.size; $("tagWhats").disabled = !FT.sel.size;
    $("tagSent").textContent = FT.sel.size > 1 ? "Marcar " + FT.sel.size + " como enviadas" : "Marcar como enviada";
    const box = $("tagList");
    if (!lista.length) { box.innerHTML = '<div class="empty-state">Nenhuma tag neste filtro.</div>'; return; }
    box.innerHTML = lista.map((t) => {
      const hex = V.hexDaCor(t.cor);
      return `<div class="tag-card" data-id="${esc(t.id)}"><input type="checkbox" class="t-sel" aria-label="Selecionar tag de ${esc(t.cliente_nome)}"${FT.sel.has(t.id) ? " checked" : ""}>
        <span class="tag-preview" style="background:${hex};color:${V.textoSobre(hex)}">${esc(t.iniciais || "?")}</span>
        <div class="tc-main"><div class="nome">${esc(t.cliente_nome)}</div><div class="sub">${esc(t.cor)} · ${esc(numeroDaTag(t))} · ${esc(N.dataCurta(t.criado_em))}${t.origem === "avulsa" ? " · avulsa" : ""}${t.observacao ? " · " + esc(t.observacao) : ""}</div>${t.iniciais ? "" : '<div class="sub" style="color:var(--danger)">Faltam as iniciais</div>'}</div>
        <select class="status-select" aria-label="Situação da tag">${["a_fazer", "enviada", "pronta"].map((s) => `<option value="${s}"${t.status === s ? " selected" : ""}>${ST[s]}</option>`).join("")}</select>
        <button type="button" class="icon-btn" data-ta="editar" title="Editar tag">✎</button>${t.status === "a_fazer" ? '<button type="button" class="icon-btn danger" data-ta="excluir" title="Excluir tag">✕</button>' : ""}</div>`;
    }).join("");
  }
  const selecionadas = () => E.tags.filter((t) => FT.sel.has(t.id));
  const textoLista = (ts) => "Tags personalizadas - Life Ateliê\n\n" + ts.map((t, k) => `${k + 1}. ${t.iniciais || "(sem iniciais)"} - cor ${t.cor} - ${t.cliente_nome}`).join("\n");
  async function mudarStatus(ids, status) {
    const { error } = await sb.from("tags").update({ status, enviada_em: status === "enviada" ? new Date().toISOString() : null }).in("id", ids);
    if (error) throw error;
    await N.recarregar(["tags"]); N.renderTudo();
  }
  $("tagFilter").addEventListener("change", () => { FT.sel.clear(); renderTags(); });
  $("tagSearch").addEventListener("input", renderTags);
  $("tagSelAll").addEventListener("click", () => { const l = tagsFiltradas(); if (FT.sel.size && FT.sel.size === l.length) FT.sel.clear(); else l.forEach((t) => FT.sel.add(t.id)); renderTags(); });
  $("tagList").addEventListener("change", async (e) => {
    const card = e.target.closest("[data-id]");
    if (!card) return;
    const id = card.dataset.id;
    if (e.target.classList.contains("t-sel")) { if (e.target.checked) FT.sel.add(id); else FT.sel.delete(id); renderTags(); return; }
    if (e.target.classList.contains("status-select")) { try { await mudarStatus([id], e.target.value); } catch (err) { N.setMsg($("tagMsg"), N.traduzirErro(err), "warn"); } }
  });
  $("tagList").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-ta]");
    if (!b) return;
    const id = b.closest("[data-id]").dataset.id, t = E.tags.find((x) => x.id === id);
    if (b.dataset.ta === "editar") abrirTag(t);
    else N.armConfirm(b, async () => {
      const { error } = await sb.from("tags").delete().eq("id", id);
      if (error) { N.setMsg($("tagMsg"), N.traduzirErro(error), "warn"); return; }
      await N.recarregar(["tags"]); N.renderTudo();
    });
  });
  $("tagCopy").addEventListener("click", async () => N.setMsg($("tagMsg"), (await N.copiar(textoLista(selecionadas()))) ? "Lista copiada." : "Não consegui copiar.", "ok"));
  $("tagWhats").addEventListener("click", () => window.open("https://wa.me/" + String(E.ajustes.telefone_fabrica || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(textoLista(selecionadas())), "_blank", "noopener"));
  $("tagPrint").addEventListener("click", () => {
    const ts = selecionadas();
    N.imprimir(`<h1>Tags personalizadas · Life Ateliê</h1><p>${esc(N.dataCurta(new Date().toISOString()))} · ${ts.length} ${ts.length === 1 ? "tag" : "tags"}</p>
      <table class="tp-table"><thead><tr><th>#</th><th>Iniciais</th><th>Cor da tag</th><th>Cliente</th><th>Venda</th></tr></thead><tbody>${ts.map((t, k) => `<tr><td>${k + 1}</td><td class="tp-ini">${esc(t.iniciais || "?")}</td><td><span class="tp-sw" style="background:${V.hexDaCor(t.cor)}"></span>${esc(t.cor)}</td><td>${esc(t.cliente_nome)}</td><td>${esc(numeroDaTag(t))}</td></tr>`).join("")}</tbody></table>`);
  });
  $("tagSent").addEventListener("click", async () => {
    const ids = selecionadas().filter((t) => t.status === "a_fazer").map((t) => t.id);
    if (!ids.length) { N.setMsg($("tagMsg"), 'Nenhuma das selecionadas está "a fazer".', "warn"); return; }
    try { await mudarStatus(ids, "enviada"); FT.sel.clear(); renderTags(); N.setMsg($("tagMsg"), ids.length + (ids.length === 1 ? " tag marcada como enviada." : " tags marcadas como enviadas."), "ok"); }
    catch (err) { N.setMsg($("tagMsg"), N.traduzirErro(err), "warn"); }
  });
  // cadastrar / editar tag
  let tagEm = null, corTag = "";
  function desenharCoresTag() {
    $("dtCores").innerHTML = N.coresTag.map((c) => `<button type="button" class="swatch${V.chaveCor(c.nome) === V.chaveCor(corTag) ? " selected" : ""}" data-cor="${esc(c.nome)}" title="${esc(c.nome)}" style="background:${c.hex}"></button>`).join("");
    $("dtCorNome").innerHTML = corTag ? "Cor da tag: <b>" + esc(corTag) + "</b>" : "Escolha a cor da tag";
  }
  function abrirTag(t) {
    tagEm = t || null;
    $("dtTitulo").textContent = t ? "Editar tag" : "Tag avulsa";
    $("dtClienteBox").hidden = !!t;
    $("dtCliente").value = ""; $("dtIniciais").value = t ? t.iniciais || "" : ""; $("dtObs").value = t ? t.observacao || "" : "";
    corTag = t ? t.cor : "";
    desenharCoresTag();
    $("dtErro").textContent = "";
    $("dlgTag").showModal();
  }
  $("dtCores").addEventListener("click", (e) => { const b = e.target.closest(".swatch"); if (b) { corTag = b.dataset.cor; desenharCoresTag(); } });
  $("dtIniciais").addEventListener("input", (e) => { e.target.value = e.target.value.toUpperCase(); });
  $("tagNew").addEventListener("click", () => abrirTag(null));
  $("formTag").addEventListener("submit", async (e) => {
    e.preventDefault();
    const iniciais = $("dtIniciais").value.trim().toUpperCase();
    if (!corTag) { $("dtErro").textContent = "Escolha a cor da tag."; return; }
    if (!tagEm && !$("dtCliente").value.trim()) { $("dtErro").textContent = "Escreva o nome da cliente."; return; }
    const obs = $("dtObs").value.trim() || null;
    const r = tagEm ? await sb.from("tags").update({ iniciais: iniciais || null, cor: corTag, observacao: obs }).eq("id", tagEm.id)
      : await sb.from("tags").insert({ cliente_nome: $("dtCliente").value.trim(), iniciais: iniciais || null, cor: corTag, origem: "avulsa", observacao: obs });
    if (r.error) { $("dtErro").textContent = N.traduzirErro(r.error); return; }
    $("dlgTag").close();
    await N.recarregar(["tags"]); N.renderTudo(); N.aviso("Tag salva.");
  });
  document.querySelectorAll("dialog [data-fechar]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));

  // =====================================================================
  // CADASTRO: clientes, formato do texto e ajustes
  // =====================================================================
  function renderReg() {
    const q = V.norm($("regSearch").value), digitos = V.soDigitos(q);
    const lista = E.clientes.filter((c) => !q || V.norm([c.nome, c.telefone, c.documento, c.email, c.cidade].join(" ")).includes(q) || (digitos.length >= 4 && V.soDigitos([c.telefone, c.documento].join(" ")).includes(digitos)));
    $("regCount").textContent = lista.length + (lista.length === 1 ? " cliente" : " clientes");
    $("regList").innerHTML = "";
    lista.slice(0, 60).forEach((c) => {
      const contato = [c.telefone, c.documento, c.email].filter(Boolean).join(" · "), end = V.enderecoLinha(c), n = N.vendasDa(c).length;
      const card = document.createElement("div");
      card.className = "client-card";
      card.innerHTML = '<div class="cc-main"><div><span class="cc-name">' + esc(c.nome) + "</span></div>" + (contato ? '<div class="cc-sub">' + esc(contato) + "</div>" : '<div class="cc-sub">Sem dados de contato</div>') + (end ? '<div class="cc-sub">' + esc(end) + "</div>" : "") +
        (c.observacoes ? '<div class="cc-sub">' + esc(c.observacoes) + "</div>" : "") + '<div class="cc-sub">' + n + (n === 1 ? " compra" : " compras") + '</div></div><div class="cc-actions"><button type="button" class="btn ghost" data-act="edit">Editar</button><button type="button" class="btn" data-act="new">Nova venda</button></div>';
      card.querySelector('[data-act="edit"]').addEventListener("click", () => abrirCliente(c));
      card.querySelector('[data-act="new"]').addEventListener("click", () => N.novaVendaPara(c.nome));
      $("regList").appendChild(card);
    });
    if (lista.length > 60) { const m = document.createElement("div"); m.className = "empty-state"; m.textContent = "Mostrando 60. Use a busca para achar as outras."; $("regList").appendChild(m); }
    // formato do texto
    const f = N.formatoTexto();
    if (document.activeElement !== $("fmtModelo")) $("fmtModelo").value = f.modelo;
    if (document.activeElement !== $("fmtItem")) $("fmtItem").value = f.item;
    renderPrevia();
    $("formAjustes").hidden = !N.ehAdmin();
    $("cardImportarBling").hidden = !N.ehAdmin();
    if (N.ehAdmin() && !$("formAjustes").contains(document.activeElement)) {
      $("ajTag").value = N.fmtEntrada(E.ajustes.tag_valor_minimo); $("ajComissao").value = String(E.ajustes.comissao_padrao).replace(".", ","); $("ajBaixo").value = E.ajustes.estoque_baixo; $("ajFabrica").value = E.ajustes.telefone_fabrica;
    }
    $("contaInfo").textContent = E.email + " · " + (N.ehAdmin() ? "administradora (vê e altera tudo)" : "vendedora (vende, vê estoque e tags)");
  }
  $("regSearch").addEventListener("input", renderReg);
  $("regNew").addEventListener("click", () => abrirCliente(null));
  const AMOSTRA = { numero: 123, data: "22/10/2026", cliente_nome: "Maria Souza", cliente: { telefone: "(31) 99999-8888", documento: "123.456.789-09", rua: "Rua das Flores", numero: "100", bairro: "Centro", cidade: "Belo Horizonte", uf: "MG" }, valor_total: 489.9, pagamento: "credito", parcelas: 2, observacao: "Entregar na sexta",
    itens: [{ quantidade: 1, modelo: "Alice", descricao: "Bolsa Alice - Preta", cor: "Preta", codigo: "BLAL01", preco_unit: 489.9 }], tags_venda: [{ iniciais: "MS", cor: "Café" }] };
  function renderPrevia() { $("fmtPreview").value = V.montarTexto(AMOSTRA, N.formatoTexto()); }
  const salvarFormato = () => { N.gravar("life-formato-texto-v2", { modelo: $("fmtModelo").value, item: $("fmtItem").value }); renderPrevia(); };
  $("fmtModelo").addEventListener("input", salvarFormato);
  $("fmtItem").addEventListener("input", salvarFormato);
  $("fmtDefault").addEventListener("click", () => { N.apagar("life-formato-texto-v2"); $("fmtModelo").value = V.MODELO_TEXTO; $("fmtItem").value = V.MODELO_ITEM; renderPrevia(); });

  let clienteEm = null, aoSalvarCliente = null;
  let avisoConfirmado = ""; // aviso de "mesmo telefone/e-mail" já mostrado: o segundo "Salvar" confirma
  const campoEl = (k) => $(k === "nome" ? "dclNome" : k === "observacoes" ? "dclObs" : "dcl" + k.charAt(0).toUpperCase() + k.slice(1));
  // op: { prefill: { nome, telefone }, colar: true (cursor no campo de colar), aoSalvar(dados) }
  function abrirCliente(c, op) {
    op = op || {};
    clienteEm = c || null;
    aoSalvarCliente = op.aoSalvar || null;
    $("dclTitulo").textContent = c ? "Editar cliente" : "Nova cliente";
    $("dclNome").value = c ? c.nome : "";
    CAMPOS.forEach((k) => { campoEl(k).value = c ? c[k] || "" : ""; });
    $("dclObs").value = c ? c.observacoes || "" : "";
    const pre = op.prefill || {};
    if (!$("dclNome").value.trim() && pre.nome) $("dclNome").value = pre.nome;
    if (!$("dclTelefone").value.trim() && pre.telefone) $("dclTelefone").value = pre.telefone;
    $("dclColar").value = "";
    $("dclColarMsg").textContent = ""; $("dclColarMsg").className = "field-hint";
    $("dlgCliente").querySelectorAll(".preenchido").forEach((el) => el.classList.remove("preenchido"));
    $("dlgCliente").querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    $("dclErro").textContent = "";
    avisoConfirmado = "";
    // "usar o cadastro existente": traz para cá o que já estava digitado/colado (o novo vale mais)
    if (op.valores) {
      Object.entries(op.valores).forEach(([k, v]) => { if (v && String(v).trim() && k !== "nome") marcar(campoEl(k), v); });
      $("dclColarMsg").textContent = "Os dados que você colou foram colocados no cadastro de " + c.nome + ". Confira e salve."; $("dclColarMsg").className = "field-hint ok";
    }
    if (!$("dlgCliente").open) $("dlgCliente").showModal();
    if (op.colar) $("dclColar").focus();
  }
  $("dlgCliente").addEventListener("close", () => { aoSalvarCliente = null; });

  // ---- colar a mensagem com os dados: preenche os campos sozinho ----
  const NOMES_CAMPO = { nome: "nome", telefone: "telefone", documento: "CPF/CNPJ", email: "e-mail", cep: "CEP", rua: "rua", numero: "número", complemento: "complemento", bairro: "bairro", cidade: "cidade", uf: "UF", observacoes: "observações" };
  function marcar(el, valor) { el.value = valor; el.classList.remove("preenchido"); void el.offsetWidth; el.classList.add("preenchido"); }
  let colarTimer = null;
  function lerColado() {
    const texto = $("dclColar").value.trim(), msg = $("dclColarMsg");
    if (!texto) { msg.textContent = ""; return; }
    const { campos, naoEntendi } = window.LerCliente.ler(texto);
    const achados = window.LerCliente.CAMPOS.filter((k) => campos[k] != null); // na ordem da janela
    achados.forEach((k) => marcar(campoEl(k), k === "observacoes" ? [campoEl(k).value.trim(), campos[k]].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(" · ") : campos[k]));
    msg.className = "field-hint" + (achados.length ? " ok" : " warn");
    msg.textContent = achados.length
      ? "Preenchi: " + achados.map((k) => NOMES_CAMPO[k]).join(", ") + ". Confira antes de salvar." + (naoEntendi.length ? " Não entendi: \"" + naoEntendi.join("\" / \"") + "\"." : "")
      : "Não reconheci os dados nessa mensagem. Preencha os campos abaixo.";
    completarPeloCep().then(avisarFaltando);
  }
  // o que ainda ficou em branco depois de colar (e do CEP)
  function avisarFaltando() {
    const msg = $("dclColarMsg");
    if (!$("dclColar").value.trim() || /Não reconheci/.test(msg.textContent)) return;
    const faltam = ["documento", "telefone", "email", "cep", "rua", "numero", "bairro", "cidade", "uf"].filter((k) => !campoEl(k).value.trim());
    msg.textContent = msg.textContent.replace(/ Não encontrei: .*$/, "") + (faltam.length ? " Não encontrei: " + faltam.map((k) => NOMES_CAMPO[k]).join(", ") + "." : "");
  }
  $("dclColar").addEventListener("input", () => { clearTimeout(colarTimer); colarTimer = setTimeout(lerColado, 350); });
  $("dclColar").addEventListener("paste", () => { clearTimeout(colarTimer); setTimeout(lerColado, 0); });

  // CEP: completa rua, bairro, cidade e UF que estiverem vazios (ViaCEP, serviço gratuito dos Correios)
  let cepConsultado = "";
  async function completarPeloCep() {
    const cep = V.soDigitos($("dclCep").value);
    const faltam = ["rua", "bairro", "cidade", "uf"].filter((k) => !campoEl(k).value.trim());
    if (cep.length !== 8 || !faltam.length || cep === cepConsultado) return;
    cepConsultado = cep;
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 5000);
      const r = await fetch("https://viacep.com.br/ws/" + cep + "/json/", { signal: ctl.signal });
      clearTimeout(t);
      const d = await r.json();
      if (!d || d.erro) return;
      const de = { rua: d.logradouro, bairro: d.bairro, cidade: d.localidade, uf: d.uf };
      const feitos = faltam.filter((k) => de[k] && !campoEl(k).value.trim());
      feitos.forEach((k) => marcar(campoEl(k), de[k]));
      if (feitos.length) { const m = $("dclColarMsg"); m.textContent = (m.textContent ? m.textContent + " " : "") + "Completei pelo CEP: " + feitos.map((k) => NOMES_CAMPO[k]).join(", ") + "."; m.className = "field-hint ok"; }
    } catch (_) { cepConsultado = ""; /* sem internet ou CEP não achado: segue sem completar */ }
  }
  $("dclCep").addEventListener("change", completarPeloCep);

  function usarExistente(x, valores) {
    const aoSalvar = aoSalvarCliente;
    abrirCliente(x, { aoSalvar, valores });
  }
  $("formCliente").addEventListener("submit", async (e) => {
    e.preventDefault();
    const aoSalvar = aoSalvarCliente, erroEl = $("dclErro");
    const dados = { nome: $("dclNome").value.trim().replace(/\s+/g, " ") };
    CAMPOS.forEach((k) => { dados[k] = campoEl(k).value.trim() || null; });
    if (dados.uf) dados.uf = dados.uf.toUpperCase();
    dados.observacoes = $("dclObs").value.trim() || null;
    // 1) campos com formato errado
    $("dlgCliente").querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    const erros = window.LerCliente.validarCadastro(dados);
    if (erros.length) {
      erros.forEach((x) => campoEl(x.campo).setAttribute("aria-invalid", "true"));
      erroEl.textContent = erros.map((x) => x.msg).join(" ");
      campoEl(erros[0].campo).focus();
      return;
    }
    // 2) a mesma pessoa já cadastrada (CPF/CNPJ ou nome = não deixa duplicar; telefone/e-mail = avisa uma vez)
    const dups = window.LerCliente.acharDuplicadas(dados, E.clientes, clienteEm && clienteEm.id);
    const forte = dups.find((d) => d.forte), fraca = dups.find((d) => !d.forte);
    const chaveAviso = fraca ? fraca.cliente.id + "|" + fraca.motivo : "";
    if (forte || (fraca && avisoConfirmado !== chaveAviso)) {
      const d = forte || fraca;
      erroEl.innerHTML = (forte ? "Já existe a cliente <b>" + esc(d.cliente.nome) + "</b> com " + esc(d.motivo) + ". Para não duplicar, use o cadastro dela."
        : "Atenção: <b>" + esc(d.cliente.nome) + "</b> tem " + esc(d.motivo) + ". Se for a mesma pessoa, use o cadastro dela; se não for, toque em Salvar de novo.") +
        ' <button type="button" class="btn ghost small" id="dclUsarExistente">Usar o cadastro de ' + esc(d.cliente.nome) + "</button>";
      $("dclUsarExistente").addEventListener("click", () => usarExistente(d.cliente, dados));
      if (!forte) avisoConfirmado = chaveAviso;
      return;
    }
    const r = clienteEm ? await sb.from("clientes").update(dados).eq("id", clienteEm.id).select().single() : await sb.from("clientes").insert(dados).select().single();
    if (r.error) { erroEl.textContent = /duplicate|unique/i.test(r.error.message) ? "Já existe outra cliente com esse nome." : N.traduzirErro(r.error); return; }
    $("dlgCliente").close();
    await N.recarregar(["clientes", "vendas"]); N.renderTudo(); N.aviso("Cliente salva.");
    if (aoSalvar) aoSalvar(Object.assign({}, dados, r.data || {}));
  });
  $("formAjustes").addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = { tag_valor_minimo: N.num($("ajTag").value), comissao_padrao: N.num($("ajComissao").value), estoque_baixo: parseInt($("ajBaixo").value, 10), telefone_fabrica: $("ajFabrica").value.replace(/\D/g, "") || null };
    if (dados.tag_valor_minimo == null || dados.comissao_padrao == null || isNaN(dados.estoque_baixo)) { N.setMsg($("ajMsg"), "Confira os números.", "warn"); return; }
    const { error } = await sb.from("ajustes").update(dados).eq("id", 1);
    if (error) { N.setMsg($("ajMsg"), N.traduzirErro(error), "warn"); return; }
    Object.assign(E.ajustes, { tag_valor_minimo: dados.tag_valor_minimo, comissao_padrao: dados.comissao_padrao, estoque_baixo: dados.estoque_baixo, telefone_fabrica: dados.telefone_fabrica || "" });
    N.renderTudo();
    N.setMsg($("ajMsg"), "Ajustes salvos.", "ok");
  });

  // =====================================================================
  // BLING E BACKUP
  // =====================================================================
  function vendasDoBling() {
    const de = $("blFrom").value, ate = $("blTo").value;
    return E.vendas.filter((v) => {
      if (v.status !== "confirmada") return false;
      const d = N.dia(v.criado_em);
      if (de && d < de) return false;
      if (ate && d > ate) return false;
      if ($("blOnlyNew").checked && v.bling_status !== "nao") return false;
      if ($("blOnlyPaid").checked && v.pagamento === "aguardando") return false;
      return true;
    }).sort((a, b) => new Date(a.criado_em) - new Date(b.criado_em));
  }
  function renderBling() {
    const l = vendasDoBling(), soma = l.reduce((t, v) => t + v.valor_total, 0);
    $("blPreview").textContent = l.length + (l.length === 1 ? " venda" : " vendas") + " no período · " + brl(soma);
    $("cardBackup").hidden = !N.ehAdmin();
    $("blApi").hidden = !N.ehAdmin();
    if (!N.ehAdmin()) { $("blPlanilha").open = true; return; }
    if (!BL.status && !BL.carregando) atualizarStatusBling(); else desenharBlingApi();
  }

  // ---------- envio direto pela API do Bling (função "bling" do Supabase) ----------
  const BL = { status: null, carregando: false, enviando: false, aviso: null };
  const cfgSb = () => window.Life.cfg;
  const urlFuncao = (acao) => cfgSb().supabaseUrl.replace(/\/+$/, "") + "/functions/v1/bling/" + acao;
  $("blCallback").textContent = urlFuncao("retorno");
  async function chamarBling(acao, corpo) {
    const { data } = await sb.auth.getSession();
    const token = data && data.session ? data.session.access_token : "";
    let r;
    try {
      r = await fetch(urlFuncao(acao), {
        method: corpo ? "POST" : "GET",
        headers: Object.assign({ Authorization: "Bearer " + token, apikey: cfgSb().supabaseAnonKey }, corpo ? { "Content-Type": "application/json" } : {}),
        body: corpo ? JSON.stringify(corpo) : undefined,
      });
    } catch (e) { return { semFuncao: true }; }
    const d = await r.json().catch(() => ({}));
    if (r.status === 404 && !d.erro) return { semFuncao: true };
    if (r.status === 401 && !d.erro) return { erro: "A função do Bling está pedindo login do Supabase: desligue o \"Verify JWT\" nas configurações da função (passo 3)." };
    if (!r.ok) return Object.assign({}, d, { erro: d.erro || d.message || "A função do Bling respondeu com erro " + r.status + "." });
    return d;
  }
  async function atualizarStatusBling() {
    BL.carregando = true;
    $("blApiStatus").textContent = "Conferindo a conexão com o Bling…";
    try { BL.status = await chamarBling("status"); } finally { BL.carregando = false; }
    desenharBlingApi();
  }
  const pendentesBling = () => vendasDoBling().filter((v) => !v.bling_id);
  const FUNCAO_VERSAO = "2026-11-12"; // versão da função "bling" que esta tela espera
  const funcaoVelha = (s) => !!s && !s.semFuncao && !s.erro && s.versao !== FUNCAO_VERSAO;
  function desenharBlingApi() {
    const s = BL.status || {}, st = $("blApiStatus"), env = $("blEnviar"), con = $("blConectar");
    const n = pendentesBling().length;
    env.hidden = true; con.hidden = true; $("blVendedora").hidden = true;
    if (s.semFuncao) st.innerHTML = "A integração ainda não foi instalada no Supabase. Siga o <b>passo a passo</b> abaixo (uma vez só).";
    else if (funcaoVelha(s)) st.innerHTML = "A função do Bling no Supabase está <b>desatualizada</b>. Atualize no passo 3 abaixo: <b>Copiar o código</b> → no Supabase, abra a função <b>bling</b>, apague o código antigo, cole o novo e toque em <b>Deploy</b>.";
    else if (s.faltam_segredos) st.innerHTML = "A função está instalada, mas faltam os segredos do Bling (passo 4 abaixo).";
    else if (s.erro) st.textContent = s.erro;
    else if (!s.conectado) { st.textContent = "Ainda não conectado ao Bling."; con.hidden = false; con.textContent = "Conectar ao Bling"; con.className = "btn"; }
    else {
      st.textContent = "Conectado ao Bling ✓" + (s.conectado_em ? " desde " + N.dataCurta(s.conectado_em) : "") + ". As vendas viram pedidos de venda lá, com a cliente, os produtos (pelo código) e a forma de pagamento.";
      const semVendedora = !s.vendedor; // ainda não escolheu (nem "sem vendedora")
      env.hidden = false; env.disabled = !n || BL.enviando || semVendedora;
      env.textContent = semVendedora ? "Escolha a vendedora abaixo antes de enviar" : n ? "Enviar " + n + (n === 1 ? " venda" : " vendas") + " para o Bling" : "Nenhuma venda para enviar neste período";
      con.hidden = false; con.textContent = "Conectar de novo"; con.className = "btn ghost";
      $("blVendedora").hidden = false;
      if (!BL.vendedores && !BL.carregandoVend) carregarVendedores(); else desenharVendedora();
    }
    $("blInstalar").open = !!(s.semFuncao || s.faltam_segredos || s.erro || !s.conectado || funcaoVelha(s));
    // vendas que não foram na última tentativa: mostra o motivo (se a lista do último envio não estiver na tela)
    if (!BL.enviando && !$("blResultados").dataset.agora) {
      const comErro = pendentesBling().filter((v) => v.bling_erro);
      $("blResultados").innerHTML = comErro.map((v) => '<li class="warn">Venda nº ' + esc(String(v.numero)) + " não foi na última tentativa: " + esc(v.bling_erro) + "</li>").join("");
    }
    if (BL.aviso) { N.setMsg($("blEnviarMsg"), BL.aviso.texto, BL.aviso.tipo); BL.aviso = null; }
  }
  // ---------- vendedora dos pedidos (pelo código do Bling, não só pelo nome) ----------
  const ehFrancielly = (nome) => /francielly/.test(V.norm(nome));
  async function carregarVendedores() {
    BL.carregandoVend = true;
    $("blVendedoraMsg").textContent = "Buscando as vendedoras no Bling…"; $("blVendedoraMsg").className = "field-hint";
    const d = await chamarBling("vendedores");
    BL.carregandoVend = false;
    if (d.erro || d.semFuncao) {
      BL.vendedores = [];
      BL.erroVend = /escopo|scope|permiss|forbidden|insufficient|403|autoriza/i.test(d.erro || "")
        ? "O aplicativo do Bling ainda não tem a permissão Vendedores. Adicione o escopo \"Vendedores\" no aplicativo, salve e toque em Conectar de novo."
        : "Não consegui buscar as vendedoras no Bling: " + (d.erro || "a função não respondeu") + ".";
    } else { BL.vendedores = d.vendedores || []; BL.erroVend = ""; }
    desenharVendedora();
  }
  function desenharVendedora() {
    const sel = $("blVendedoraSel"), msg = $("blVendedoraMsg"), s = BL.status || {};
    const lista = BL.vendedores || [];
    const atual = s.vendedor ? String(s.vendedor.id) : "";
    const sugerida = !atual ? lista.find((v) => ehFrancielly(v.nome)) : null;
    sel.innerHTML = '<option value="">— escolha a vendedora —</option>' +
      lista.map((v) => '<option value="' + v.id + '">' + esc(v.nome || "(sem nome)") + " · código " + v.id + (v.situacao && v.situacao !== "A" ? " (inativa)" : "") + "</option>").join("") +
      '<option value="0">Enviar sem vendedora</option>';
    sel.value = atual || (sugerida ? String(sugerida.id) : "");
    msg.className = "field-hint";
    if (BL.erroVend) { msg.textContent = BL.erroVend; msg.className = "field-hint warn"; }
    else if (s.vendedor && s.vendedor.id) { msg.textContent = "Os pedidos vão com a vendedora " + (s.vendedor.nome || "") + " (código " + s.vendedor.id + " no Bling)."; msg.className = "field-hint ok"; }
    else if (s.vendedor) msg.textContent = "Os pedidos vão sem vendedora.";
    else if (sugerida) msg.textContent = "Achei " + sugerida.nome + " (código " + sugerida.id + ") no Bling. Confira e toque em Salvar.";
    else if (lista.length) msg.textContent = "Não achei a vendedora Francielly Duarte no Bling. Escolha na lista ou cadastre em Cadastros → Vendedores no Bling e toque em \"atualizar lista\".";
    else msg.textContent = "Nenhuma vendedora cadastrada no Bling. Cadastre a Francielly Duarte em Cadastros → Vendedores no Bling e toque em \"atualizar lista\".";
  }
  $("blVendedoraAtualizar").addEventListener("click", () => carregarVendedores());
  $("blVendedoraSalvar").addEventListener("click", async (e) => {
    const botao = e.currentTarget, v = $("blVendedoraSel").value;
    if (v === "") { $("blVendedoraMsg").textContent = "Escolha uma vendedora (ou \"Enviar sem vendedora\")."; $("blVendedoraMsg").className = "field-hint warn"; return; }
    botao.disabled = true;
    const d = await chamarBling("vendedor", { id: Number(v) });
    botao.disabled = false;
    if (d.erro) { $("blVendedoraMsg").textContent = d.erro; $("blVendedoraMsg").className = "field-hint warn"; return; }
    BL.status = Object.assign({}, BL.status, { vendedor: d.vendedor });
    desenharBlingApi();
  });

  $("blConectar").addEventListener("click", async (e) => {
    const botao = e.currentTarget;
    botao.disabled = true;
    const d = await chamarBling("iniciar", { volta: location.origin + location.pathname });
    botao.disabled = false;
    if (d.url) { location.href = d.url; return; }
    N.setMsg($("blEnviarMsg"), d.semFuncao ? "A função do Bling ainda não foi instalada (passo 3)." : d.erro || "Não consegui começar a conexão.", "warn");
  });
  $("blEnviar").addEventListener("click", async () => {
    const lista = pendentesBling();
    if (!lista.length || BL.enviando) return;
    if (!window.confirm("Enviar " + lista.length + (lista.length === 1 ? " venda" : " vendas") + " para o Bling? Cada uma vira um pedido de venda lá (uma venda nunca vira dois pedidos).")) return;
    BL.enviando = true; desenharBlingApi();
    const msg = $("blEnviarMsg"), res = [];
    let parou = "", vendedoraEnvio = "";
    for (let i = 0; i < lista.length; i += 10) {
      N.setMsg(msg, "Enviando " + Math.min(i + 10, lista.length) + " de " + lista.length + "… (deixe esta tela aberta)");
      const d = await chamarBling("enviar", { ids: lista.slice(i, i + 10).map((v) => v.id) });
      (d.resultados || []).forEach((x) => res.push(x));
      if (d.vendedor && d.vendedor.nome) vendedoraEnvio = d.vendedor.nome;
      if (d.reconectar) BL.status = Object.assign({}, BL.status, { conectado: false });
      if (d.erro || d.semFuncao) { parou = d.semFuncao ? "A função do Bling não respondeu." : d.erro; break; }
    }
    BL.enviando = false;
    await N.recarregar(["vendas"]); N.renderTudo();
    const okN = res.filter((x) => x.ok).length, erros = res.filter((x) => !x.ok);
    $("blResultados").dataset.agora = "1";
    $("blResultados").innerHTML = res.map((x) => '<li class="' + (x.ok ? "ok" : "warn") + '">' + (x.ok
      ? "Venda nº " + esc(String(x.numero)) + " → pedido " + (x.bling_numero ? "nº " + esc(x.bling_numero) + " " : "") + "no Bling ✓" + (x.ja ? " (já estava lá)" : "") +
        (x.vendedor_ok === true && vendedoraEnvio ? " · vendedora " + esc(vendedoraEnvio) : x.vendedor_ok === false ? ' <span class="warn">· o Bling não gravou a vendedora: confira o pedido lá</span>' : "")
      : "Venda nº " + esc(String(x.numero || "?")) + ": " + esc(x.erro || "não foi")) + "</li>").join("");
    N.setMsg(msg, (okN ? okN + (okN === 1 ? " venda enviada" : " vendas enviadas") + " para o Bling." : "") + (erros.length ? " " + erros.length + (erros.length === 1 ? " não foi" : " não foram") + ": veja o motivo abaixo, corrija e envie de novo." : "") + (parou ? " " + parou : ""), erros.length || parou ? "warn" : "ok");
    desenharBlingApi();
  });
  // instalação: copiar o SQL, o código da função e o link de redirecionamento
  $("blInstalar").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copiar-arquivo]");
    if (!b) return;
    try {
      const r = await fetch(b.dataset.copiarArquivo + "?v=" + Date.now(), { cache: "no-store" });
      if (!r.ok) throw new Error();
      const ok = await N.copiar(await r.text());
      N.setMsg($("blInstalarMsg"), ok ? (b.textContent.includes("SQL") ? "SQL copiado. Cole no SQL Editor do Supabase e toque em Run." : "Código copiado. Cole no editor da função no Supabase e toque em Deploy.") : "Não consegui copiar sozinho. Tente de novo.", ok ? "ok" : "warn");
    } catch (_) { N.setMsg($("blInstalarMsg"), "Não consegui buscar o arquivo. Atualize a página e tente de novo.", "warn"); }
  });
  $("blCopiarCallback").addEventListener("click", async () => {
    const ok = await N.copiar(urlFuncao("retorno"));
    N.setMsg($("blInstalarMsg"), ok ? "Link copiado. Cole no campo de link de redirecionamento do aplicativo no Bling." : "Não consegui copiar. Selecione o link e copie.", ok ? "ok" : "warn");
  });
  // ---------- importar as clientes do Bling (aba Cadastro) ----------
  let importacao = null;
  const LC = () => window.LerCliente;
  $("impBuscar").addEventListener("click", async (e) => {
    const botao = e.currentTarget, msg = $("impMsg");
    botao.disabled = true; $("impPrevia").innerHTML = ""; importacao = null;
    const contatos = [];
    let erro = "";
    for (let pagina = 1; pagina <= 250; pagina++) {
      N.setMsg(msg, "Lendo as clientes do Bling… " + contatos.length + " até agora (deixe esta tela aberta).");
      const d = await chamarBling("clientes-bling", { pagina });
      if (d.semFuncao) { erro = "A integração com o Bling ainda não foi instalada (aba Bling e backup)."; break; }
      if (d.reconectar) { erro = "O Bling pediu para conectar de novo: aba Bling e backup → Conectar ao Bling."; break; }
      if (d.erro) { erro = /desconhecido/i.test(d.erro) ? "A função do Bling no Supabase está desatualizada: atualize no passo 3 da aba Bling e backup." : /escopo|scope|permiss|forbidden|insufficient|403/i.test(d.erro) ? "O aplicativo do Bling não tem a permissão Contatos. Adicione o escopo \"Contatos\", salve e toque em Conectar de novo (aba Bling e backup)." : d.erro; break; }
      (d.contatos || []).forEach((c) => contatos.push(c));
      if (d.fim) break;
    }
    botao.disabled = false;
    if (erro) { N.setMsg(msg, erro + (contatos.length ? " (" + contatos.length + " lidas antes do erro: nada foi gravado.)" : ""), "warn"); return; }
    importacao = LC().compararImportacao(E.clientes, contatos);
    importacao.lidas = contatos.length;
    N.setMsg(msg, contatos.length + " clientes lidas no Bling. Confira abaixo: nada foi gravado ainda.", "ok");
    desenharImportacao();
  });
  function desenharImportacao() {
    const r = importacao, el = $("impPrevia");
    const nomes = { documento: "CPF/CNPJ", telefone: "telefone", email: "e-mail", cep: "CEP", rua: "rua", numero: "número", complemento: "complemento", bairro: "bairro", cidade: "cidade", uf: "UF" };
    const incompletas = r.novas.filter((x) => x.faltam.length).length;
    const lista = (itens, fn) => "<ul>" + itens.map(fn).join("") + "</ul>";
    let h = '<ul class="imp-resumo">' +
      "<li><b>" + r.novas.length + "</b> novas" + (incompletas ? " (" + incompletas + " com dados faltando)" : "") + "</li>" +
      "<li><b>" + r.completar.length + "</b> já cadastradas aqui que vão ganhar dados que faltam</li>" +
      "<li><b>" + r.iguais + "</b> já estão iguais</li>" +
      "<li><b>" + r.conferir.length + "</b> para conferir (possível duplicidade)</li>" +
      "<li><b>" + r.ignoradas.length + "</b> ignoradas (fornecedores, transportadoras, excluídas)</li></ul>";
    if (r.novas.length) h += '<details class="imp-grupo"><summary>Novas (' + r.novas.length + ")</summary>" + lista(r.novas, (x) => "<li>" + esc(x.contato.nome) + (x.contato.documento ? " · " + esc(x.contato.documento) : "") + (x.faltam.length ? ' <span class="warn">(' + esc(x.faltam.join(", ")) + ")</span>" : "") + (x.contato.parcial ? ' <span class="warn">(endereço não veio)</span>' : "") + "</li>") + "</details>";
    if (r.completar.length) h += '<details class="imp-grupo"><summary>Vão ganhar dados que faltam (' + r.completar.length + ")</summary>" + lista(r.completar, (x) => "<li>" + esc(x.cliente.nome) + ": " + esc(Object.keys(x.campos).map((k) => nomes[k]).join(", ")) + (x.diferencas.length ? ' <span class="mini">(diferente no Bling e mantido como está aqui: ' + esc(x.diferencas.map((k) => nomes[k]).join(", ")) + ")</span>" : "") + "</li>") + "</details>";
    if (r.conferir.length) h += '<details class="imp-grupo" open><summary>Para conferir (' + r.conferir.length + ")</summary>" + lista(r.conferir, (x, i) => '<li><span>' + esc(x.contato.nome) + (x.contato.documento ? " · " + esc(x.contato.documento) : "") + ': ' + esc(x.motivo) + "</span>" + (x.podeCompletar ? '<label class="check"><input type="checkbox" data-imp-conferir="' + r.conferir.indexOf(x) + '"> É a mesma pessoa: completar o cadastro daqui com os dados do Bling</label>' : "") + "</li>") + "</details>";
    if (r.ignoradas.length) h += '<details class="imp-grupo"><summary>Ignoradas (' + r.ignoradas.length + ")</summary>" + lista(r.ignoradas, (x) => "<li>" + esc(x.contato.nome || "(sem nome)") + ": " + esc(x.motivo) + "</li>") + "</details>";
    const total = r.novas.length + r.completar.length + r.vincular.length;
    h += total ? '<div class="form-actions"><button type="button" class="btn" id="impAplicar">Importar ' + r.novas.length + (r.novas.length === 1 ? " nova" : " novas") + " e completar " + r.completar.length + "</button></div>" : '<p class="mini-note">Nada para importar: o cadastro já está em dia com o Bling.</p>';
    el.innerHTML = h;
  }
  // marcar uma "possível duplicidade" como a mesma pessoa entra na conta do botão
  $("impPrevia").addEventListener("change", (e) => {
    if (!e.target.matches("[data-imp-conferir]") || !importacao || !$("impAplicar")) return;
    const r = importacao, extra = $("impPrevia").querySelectorAll("[data-imp-conferir]:checked").length;
    $("impAplicar").textContent = "Importar " + r.novas.length + (r.novas.length === 1 ? " nova" : " novas") + " e completar " + (r.completar.length + extra);
  });
  $("impPrevia").addEventListener("click", async (e) => {
    if (e.target.id !== "impAplicar" || !importacao) return;
    const r = importacao, msg = $("impMsg"), botao = e.target;
    const marcadas = [...$("impPrevia").querySelectorAll("[data-imp-conferir]:checked")].map((c) => r.conferir[Number(c.dataset.impConferir)]);
    if (!window.confirm("Gravar no cadastro: " + r.novas.length + " clientes novas e completar " + (r.completar.length + marcadas.length) + " cadastros? Nada será apagado.")) return;
    botao.disabled = true;
    let semColuna = false, novas = 0, completas = 0;
    const falhas = [];
    const semId = (o) => { const x = Object.assign({}, o); delete x.bling_contato_id; return x; };
    async function inserir(linha) {
      let q = await sb.from("clientes").insert(semColuna ? semId(linha) : linha);
      if (q.error && /bling_contato_id/.test(q.error.message || "")) { semColuna = true; q = await sb.from("clientes").insert(semId(linha)); }
      return q.error;
    }
    async function atualizar(id, campos) {
      let q = await sb.from("clientes").update(semColuna ? semId(campos) : campos).eq("id", id);
      if (q.error && /bling_contato_id/.test(q.error.message || "")) { semColuna = true; q = await sb.from("clientes").update(semId(campos)).eq("id", id); }
      return q.error;
    }
    for (let i = 0; i < r.novas.length; i++) {
      N.setMsg(msg, "Gravando " + (i + 1) + " de " + r.novas.length + " novas…");
      const x = r.novas[i], err = await inserir(LC().linhaDoContato(x.contato));
      if (err) falhas.push(x.contato.nome + ": " + (/duplicate|unique/i.test(err.message) ? "já existe uma cliente com esse nome" : N.traduzirErro(err))); else novas++;
    }
    const atualizacoes = r.completar.map((x) => [x.cliente, Object.assign({}, x.campos, { bling_contato_id: x.contato.bling_id })])
      .concat(r.vincular.map((x) => [x.cliente, { bling_contato_id: x.contato.bling_id }]))
      .concat(marcadas.map((x) => {
        const campos = { bling_contato_id: x.contato.bling_id };
        LC().CAMPOS_IMPORT.forEach((k) => { if (String(x.contato[k] || "").trim() && !String(x.cliente[k] || "").trim()) campos[k] = k === "uf" ? String(x.contato[k]).toUpperCase() : x.contato[k]; });
        return [x.cliente, campos];
      }));
    for (let i = 0; i < atualizacoes.length; i++) {
      N.setMsg(msg, "Completando " + (i + 1) + " de " + atualizacoes.length + " cadastros…");
      const [c, campos] = atualizacoes[i], err = await atualizar(c.id, campos);
      if (err) falhas.push(c.nome + ": " + N.traduzirErro(err)); else if (Object.keys(campos).some((k) => k !== "bling_contato_id")) completas++;
    }
    await N.recarregar(["clientes"]); N.renderTudo();
    importacao = null;
    $("impPrevia").innerHTML = falhas.length ? '<ul class="bl-resultados">' + falhas.map((f) => '<li class="warn">' + esc(f) + "</li>").join("") + "</ul>" : "";
    N.setMsg(msg, "Importação concluída: " + novas + (novas === 1 ? " cliente nova" : " clientes novas") + ", " + completas + (completas === 1 ? " cadastro completado" : " cadastros completados") + "." +
      (falhas.length ? " " + falhas.length + " não entraram (motivo abaixo)." : "") + (semColuna ? " Rode o SQL do Bling de novo (aba Bling e backup, passo 1) para guardar o vínculo com o Bling." : ""), falhas.length ? "warn" : "ok");
  });

  // de volta do Bling depois de autorizar: vendas.html?bling=ok
  (function () {
    const p = new URLSearchParams(location.search), v = p.get("bling");
    if (!v) return;
    const textos = { ok: ["Bling conectado ✓ Agora é só enviar as vendas.", "ok"], recusado: ["A autorização foi cancelada no Bling. Toque em Conectar ao Bling para tentar de novo.", "warn"], expirou: ["O link de autorização expirou. Toque em Conectar ao Bling de novo.", "warn"], erro: ["O Bling não aceitou a conexão. Confira o Client ID e o Client Secret (passo 4) e tente de novo.", "warn"] };
    const t = textos[v] || textos.erro;
    BL.aviso = { texto: t[0], tipo: t[1] };
    p.delete("bling");
    history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : "") + location.hash);
    try { sessionStorage.setItem("life-aba", "bling"); } catch (_) { /* sem armazenamento */ }
  })();
  ["blFrom", "blTo", "blOnlyNew", "blOnlyPaid"].forEach((id) => $(id).addEventListener("change", renderBling));
  $("blExport").addEventListener("click", async () => {
    const lista = vendasDoBling(), msg = $("blMsg");
    if (!lista.length) { N.setMsg(msg, "Nenhuma venda neste período com esses filtros.", "warn"); return; }
    N.baixarArquivo(V.paraCsv(V.csvVendas(lista, E.clientes)), "vendas-bling-" + ($("blFrom").value || "inicio") + "_a_" + ($("blTo").value || N.hoje()) + ".csv", "text/csv;charset=utf-8");
    N.setMsg(msg, "Planilha com " + lista.length + (lista.length === 1 ? " venda baixada." : " vendas baixada."), "ok");
    if ($("blMark").checked) {
      const { error } = await sb.from("vendas").update({ bling_status: "exportada", bling_em: new Date().toISOString() }).in("id", lista.map((v) => v.id));
      if (error) { N.setMsg(msg, "Planilha baixada, mas não consegui marcar como lançadas: " + N.traduzirErro(error), "warn"); return; }
      await N.recarregar(["vendas"]); N.renderTudo();
      N.setMsg(msg, "Planilha salva. " + lista.length + (lista.length === 1 ? " venda marcada" : " vendas marcadas") + " como lançadas no Bling.", "ok");
    }
  });
  $("blExportClients").addEventListener("click", () => {
    const linhas = [["Nome", "CPF/CNPJ", "E-mail", "Telefone", "CEP", "Endereço", "Número", "Complemento", "Bairro", "Cidade", "UF", "Observações"]]
      .concat(E.clientes.map((c) => [c.nome, c.documento || "", c.email || "", c.telefone || "", c.cep || "", c.rua || "", c.numero || "", c.complemento || "", c.bairro || "", c.cidade || "", c.uf || "", c.observacoes || ""]));
    N.baixarArquivo(V.paraCsv(linhas), "clientes-" + N.hoje() + ".csv", "text/csv;charset=utf-8");
  });
  $("backupBtn").addEventListener("click", async () => {
    N.setMsg($("backupMsg"), "Gerando a cópia…");
    const { data, error } = await sb.rpc("backup_completo");
    if (error) { N.setMsg($("backupMsg"), N.traduzirErro(error), "warn"); return; }
    N.baixarArquivo(JSON.stringify(data, null, 1), "backup-life-atelie-" + N.hoje() + ".json", "application/json");
    N.setMsg($("backupMsg"), "Cópia baixada (" + (data.vendas || []).length + " vendas, " + (data.clientes || []).length + " clientes, " + (data.produtos || []).length + " produtos). Guarde em um lugar seguro.", "ok");
  });

  function renderTudo() { renderStock(); renderTags(); renderReg(); renderBling(); if (E.mov.length) renderHist(); }
  window.LifeVendasTelas = { renderTudo, carregarMov, abrirCliente };
})();
