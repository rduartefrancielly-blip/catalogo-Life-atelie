// Life Ateliê · Vendas: abas Live, Estoque, Tags, Cadastro e Bling e backup (usam o núcleo de vendas.js).
(function () {
  "use strict";
  const N = window.LifeVendasNucleo;
  const { E, V, $, esc, sb, brl } = N;
  const pill = (txt, cls) => `<span class="pill ${cls}">${esc(txt)}</span>`;
  const CAMPOS = ["telefone", "documento", "email", "cep", "rua", "numero", "complemento", "bairro", "cidade", "uf"];

  // =====================================================================
  // LIVE
  // =====================================================================
  let lives = [];
  let comLive = N.ler("life-comissao-live", 3) === 5 ? 5 : 3;
  const soTags = (l) => l.d.linhas.length === 0 && l.d.tags.length > 0;
  function dadosDaLive(l) {
    const d = l.d;
    return {
      nome: d.nome, info: d.info,
      linhas: d.linhas.map((ln) => ({ produto: ln.item ? ln.item.modelo : ln.produto, cor: ln.item ? ln.item.cor : ln.cor, qtd: ln.qtd })),
      valor: d.valorFinal, pagamento: d.pagamento || "aguardando", parcelas: d.pagamento === "credito" ? d.parcelas || 1 : null, pct: comLive, obs: d.obs,
      tagsCompradas: [], tagsLivres: d.tags.map((t) => ({ iniciais: t.iniciais, cor: N.corTagNome(t.cor) || t.cor })),
    };
  }
  function renderLive() {
    document.querySelectorAll('input[name="livecomm"]').forEach((r) => { r.checked = Number(r.value) === comLive; });
    const prontas = lives.filter((l) => l.estado === "pendente" && l.d.pronta && !soTags(l)).length;
    $("liveBulk").hidden = !prontas;
    $("liveCommitAll").textContent = "Lançar todas as prontas (" + prontas + ")";
    const box = $("liveDrafts");
    box.innerHTML = "";
    lives.forEach((l) => {
      const d = l.d, info = d.info, feita = l.estado === "feita";
      const contato = [info.telefone, info.documento, info.email].filter(Boolean).join(" · "), end = V.enderecoLinha(info);
      const prod = d.linhas.map((ln) => esc(ln.qtd + "x " + (ln.item ? ln.item.nome : ln.produto + (ln.cor ? " " + ln.cor : " (sem cor)")))).join("; ");
      const tags = d.tags.map((t) => N.miniTag(t.iniciais, N.corTagNome(t.cor) || t.cor, true)).join(" ");
      const card = document.createElement("div");
      card.className = "draft-card " + (feita ? "done" : d.pronta ? "ready" : "blocked");
      card.innerHTML =
        '<div class="draft-head"><b>' + esc(d.nome || "(sem nome)") + "</b>" + (feita ? pill(l.mensagem || "Registrada", "ok") : d.pronta ? pill("Pronta · ainda não registrada", "ok") : pill("Faltam dados", "wait")) + "</div>" +
        (contato ? '<div class="draft-line"><span class="k">Contato:</span> ' + esc(contato) + "</div>" : "") +
        (end ? '<div class="draft-line"><span class="k">Endereço:</span> ' + esc(end) + "</div>" : "") +
        (prod ? '<div class="draft-line"><span class="k">Produtos:</span> ' + prod + "</div>" : "") +
        (tags ? '<div class="draft-line"><span class="k">Tag:</span> ' + tags + "</div>" : "") +
        (d.linhas.length ? '<div class="draft-line"><span class="k">Pagamento:</span> ' + esc(d.pagamento ? N.PAGAMENTOS[d.pagamento] + (d.pagamento === "credito" ? " " + (d.parcelas || 1) + "x" : "") : "não informado") +
          ' · <span class="k">Valor:</span> ' + (d.valorFinal != null && !isNaN(d.valorFinal) ? esc(brl(d.valorFinal)) + (d.valorOrigem !== "informado" ? " (" + esc(d.valorOrigem) + ")" : "") : "faltando") + "</div>" : "") +
        (d.obs ? '<div class="draft-line"><span class="k">Obs.:</span> ' + esc(d.obs) + "</div>" : "") +
        (!feita && (d.bloqueios.length || d.avisos.length) ? '<ul class="draft-issues">' + d.bloqueios.map((t) => '<li class="block">• ' + esc(t) + "</li>").join("") + d.avisos.map((t) => '<li class="info">• ' + esc(t) + "</li>").join("") + "</ul>" : "") +
        (l.erro ? '<div class="form-msg warn">' + esc(l.erro) + "</div>" : "") +
        (feita ? "" : '<div class="draft-actions"><button type="button" class="btn small" data-act="commit"' + (d.pronta ? "" : " disabled") + ">" + (soTags(l) ? "Cadastrar tag" : "Lançar") + "</button>" +
          (soTags(l) ? "" : '<button type="button" class="btn ghost small" data-act="review">Revisar na venda</button>') + '<button type="button" class="btn ghost small" data-act="drop">Descartar</button></div>');
      if (!feita) {
        card.querySelector('[data-act="commit"]').addEventListener("click", () => lancar(l));
        const rv = card.querySelector('[data-act="review"]');
        if (rv) rv.addEventListener("click", () => {
          const dd = dadosDaLive(l);
          N.preencherForm(Object.assign({}, dd, { valor: dd.valor }));
          l.estado = "feita"; l.mensagem = "Em revisão na aba Vendas"; renderLive();
          N.showTab("sales");
          N.setMsg($("saleMsg"), "Dados de " + dd.nome + " carregados. Confira e clique em Registrar venda.", "ok");
        });
        card.querySelector('[data-act="drop"]').addEventListener("click", () => { lives = lives.filter((x) => x !== l); renderLive(); });
      }
      box.appendChild(card);
    });
  }
  function reavaliarPendentes() { lives.forEach((l) => { if (l.estado === "pendente") E.leitor.avaliar(l.d); }); }
  async function lancar(l, semAtualizar) {
    l.erro = "";
    try {
      if (soTags(l)) {
        const linhas = l.d.tags.map((t) => ({ cliente_nome: l.d.nome || "Sem nome", iniciais: t.iniciais || null, cor: N.corTagNome(t.cor) || t.cor || "a escolher", origem: "avulsa", observacao: l.d.obs || null }));
        const { error } = await sb.from("tags").insert(linhas);
        if (error) throw error;
        l.estado = "feita"; l.mensagem = linhas.length + (linhas.length === 1 ? " tag avulsa cadastrada" : " tags avulsas cadastradas");
      } else {
        const res = await N.enviarVenda(N.montarPedido(dadosDaLive(l), l.chave, "live"));
        l.estado = "feita"; l.mensagem = "Registrada #" + res.numero;
      }
      if (!semAtualizar) { await N.recarregar(["produtos", "clientes", "vendas", "tags"]); reavaliarPendentes(); N.renderTudo(); }
      return true;
    } catch (e) { l.erro = N.traduzirErro(e); if (!semAtualizar) renderLive(); return false; }
  }
  $("liveParse").addEventListener("click", () => {
    const txt = $("liveText").value;
    if (!txt.trim()) { N.setMsg($("liveMsg"), "Cole as mensagens primeiro.", "warn"); return; }
    lives = E.leitor.lerLive(txt).map((d) => ({ d, chave: "live-" + N.uuid(), estado: "pendente", mensagem: "", erro: "" }));
    if (!lives.length) { N.setMsg($("liveMsg"), "Não encontrei dados de cliente nesse texto.", "warn"); renderLive(); return; }
    const prontas = lives.filter((l) => l.d.pronta).length;
    N.setMsg($("liveMsg"), lives.length + (lives.length === 1 ? " cliente lida" : " clientes lidas") + ", " + prontas + (prontas === 1 ? " pronta" : " prontas") + " para lançar. Confira abaixo. Nada foi registrado ainda.", "ok");
    renderLive();
  });
  $("liveClear").addEventListener("click", () => { $("liveText").value = ""; lives = []; N.setMsg($("liveMsg"), ""); renderLive(); });
  $("liveTemplate").addEventListener("click", async () => {
    const t = ["Olá! Para fechar o seu pedido, me envie por favor:", "", "Nome completo:", "CPF:", "Telefone:", "CEP:", "Endereço (rua, número, complemento, bairro, cidade/UF):", "Produto:", "Cor:", "Tag - iniciais:", "Tag - cor:", "Forma de pagamento (Pix ou cartão em até 6x):"].join("\n");
    const copiou = await N.copiar(t);
    N.setMsg($("liveMsg"), copiou ? "Modelo copiado. Cole na conversa da cliente." : "Não consegui copiar o modelo.", copiou ? "ok" : "warn");
  });
  document.querySelectorAll('input[name="livecomm"]').forEach((r) => r.addEventListener("change", () => { comLive = Number(r.value); N.gravar("life-comissao-live", comLive); }));
  $("liveCommitAll").addEventListener("click", async () => {
    const lista = lives.filter((l) => l.estado === "pendente" && l.d.pronta && !soTags(l));
    if (!lista.length) return;
    $("liveCommitAll").disabled = true;
    let ok = 0, falhas = 0;
    for (let k = 0; k < lista.length; k++) {
      N.setMsg($("liveMsg"), "Lançando " + (k + 1) + " de " + lista.length + "…");
      if (await lancar(lista[k], true)) { ok++; await N.recarregar(["produtos"]); reavaliarPendentes(); } else falhas++;
    }
    await N.recarregar(["produtos", "clientes", "vendas", "tags"]); reavaliarPendentes(); N.renderTudo();
    $("liveCommitAll").disabled = false;
    N.setMsg($("liveMsg"), ok + (ok === 1 ? " venda lançada" : " vendas lançadas") + (falhas ? " · " + falhas + " precisam de conferência." : "."), falhas ? "warn" : "ok");
  });

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

  let clienteEm = null;
  function abrirCliente(c) {
    clienteEm = c || null;
    $("dclTitulo").textContent = c ? "Editar cliente" : "Nova cliente";
    $("dclNome").value = c ? c.nome : "";
    CAMPOS.forEach((k) => { $("dcl" + k.charAt(0).toUpperCase() + k.slice(1)).value = c ? c[k] || "" : ""; });
    $("dclObs").value = c ? c.observacoes || "" : "";
    $("dclErro").textContent = "";
    $("dlgCliente").showModal();
  }
  $("formCliente").addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = { nome: $("dclNome").value.trim() };
    CAMPOS.forEach((k) => { dados[k] = $("dcl" + k.charAt(0).toUpperCase() + k.slice(1)).value.trim() || null; });
    if (!dados.nome) { $("dclErro").textContent = "O nome não pode ficar vazio."; return; }
    if (dados.uf) dados.uf = dados.uf.toUpperCase();
    dados.observacoes = $("dclObs").value.trim() || null;
    const r = clienteEm ? await sb.from("clientes").update(dados).eq("id", clienteEm.id) : await sb.from("clientes").insert(dados);
    if (r.error) { $("dclErro").textContent = /duplicate|unique/i.test(r.error.message) ? "Já existe outra cliente com esse nome." : N.traduzirErro(r.error); return; }
    $("dlgCliente").close();
    await N.recarregar(["clientes", "vendas"]); N.renderTudo(); N.aviso("Cliente salva.");
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
    $("blPreview").textContent = l.length + (l.length === 1 ? " venda" : " vendas") + " · " + brl(soma);
    $("cardBackup").hidden = !N.ehAdmin();
  }
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

  function renderTudo() { renderLive(); renderStock(); renderTags(); renderReg(); renderBling(); if (E.mov.length) renderHist(); }
  window.LifeVendasTelas = { renderTudo, carregarMov, abrirCliente };
})();
