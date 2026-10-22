// Life Ateliê - telas de live, vendas, tags, estoque e ajustes (usa o núcleo de vendas.js).
(function () {
  "use strict";
  const N = window.LifeVendasNucleo;
  const { E, F, V, $, esc, sb } = N;
  const brl = V.brl;

  const selo = (txt, tipo) => `<span class="selo ${tipo}">${esc(txt)}</span>`;
  const pagTexto = (v) => (v.pagamento === "aguardando" ? "Aguardando pagamento" : v.pagamento === "credito" ? "Crédito " + (v.parcelas || 1) + "x" : "Pix");
  const numeroTexto = (v) => (v.numero_legado ? "Antiga #" + v.numero_legado : "#" + v.numero);
  function imprimir(html) {
    $("folha-impressao").innerHTML = html;
    window.print();
  }

  // =====================================================================
  // COLAR DA LIVE
  // =====================================================================
  const CAMPOS = ["telefone", "documento", "email", "cep", "rua", "numero", "complemento", "bairro", "cidade", "uf"];
  function liveParaRascunho(l) {
    const d = l.d;
    const r = N.rascunhoNovo();
    r.chave = l.chave; r.origem = "live"; r.comissao = N.comLive;
    r.cliente.nome = d.nome;
    CAMPOS.forEach((k) => { if (d.info[k]) r.cliente[k] = d.info[k]; });
    const ja = N.clienteExistente(d.nome);
    if (ja) { r.cliente.nome = ja.nome; CAMPOS.forEach((k) => { if (!r.cliente[k] && ja[k]) r.cliente[k] = ja[k]; }); }
    r.itens = d.linhas.map((ln, k) => ln.item
      ? { chave: ln.item.chave, produto_id: ln.item.produto_id, variacao: ln.item.variacao, nome: ln.item.nome, modelo: ln.item.modelo, cor: ln.item.cor, codigo: ln.item.codigo, preco: ln.item.preco, quantidade: ln.qtd, tag: ln.tag ? { iniciais: ln.tag.iniciais, cor: ln.tag.cor } : null, travaTag: false }
      : { chave: "ext|" + k, produto_id: null, variacao: "", nome: (ln.produto + " " + (ln.cor || "")).trim(), modelo: ln.produto, cor: ln.cor || "", codigo: "", preco: null, quantidade: ln.qtd, tag: ln.tag ? { iniciais: ln.tag.iniciais, cor: ln.tag.cor } : null, travaTag: false });
    if (d.valorFinal != null && !isNaN(d.valorFinal)) {
      const conhecido = r.itens.reduce((t, i) => t + (i.preco == null ? 0 : i.preco * i.quantidade), 0);
      const qtdSem = r.itens.filter((i) => i.preco == null).reduce((t, i) => t + i.quantidade, 0);
      if (qtdSem) { const un = V.arred(Math.max(0, d.valorFinal - conhecido) / qtdSem); r.itens.forEach((i) => { if (i.preco == null) i.preco = un; }); }
      const soma = V.totais(r.itens.map((i) => ({ preco_unit: i.preco || 0, quantidade: i.quantidade }))).soma;
      r.valorManual = V.arred(d.valorFinal) !== soma ? V.arred(d.valorFinal) : null;
    }
    r.pagamento = d.pagamento || "aguardando";
    r.parcelas = d.pagamento === "credito" ? d.parcelas || 1 : 1;
    r.obs = d.obs || "";
    r.tagsVenda = d.tagsVenda.map((t) => ({ iniciais: t.iniciais, cor: t.cor, origem: t.origem }));
    return r;
  }
  const soTags = (l) => l.d.linhas.length === 0 && l.d.tags.length > 0;

  function renderLive() {
    const lives = N.getLives();
    const prontas = lives.filter((l) => l.estado === "pendente" && l.d.pronta && !soTags(l)).length;
    $("live-todas").hidden = !prontas;
    $("live-registrar-todas").textContent = "Registrar todas as prontas (" + prontas + ")";
    $("seg-live-com").querySelectorAll("[data-com]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.com) === N.comLive)));
    $("live-rascunhos").innerHTML = lives.map((l, idx) => {
      const d = l.d;
      const info = d.info;
      const contato = [info.telefone, info.documento, info.email].filter(Boolean).join(" · ");
      const end = V.enderecoLinha(info);
      const prod = d.linhas.map((ln) => `${ln.qtd}x ${esc(ln.item ? ln.item.nome : ln.produto + (ln.cor ? " " + ln.cor : " (sem cor)"))}${ln.tag ? ` · tag ${esc(ln.tag.iniciais)} <span class="mini-tag" style="background:${V.hexDaCor(ln.tag.cor)};color:${V.textoSobre(V.hexDaCor(ln.tag.cor))}">${esc(ln.tag.cor || "sem cor")}</span>` : ""}`).join("<br>");
      const tagsSoltas = d.tagsVenda.map((t) => `${esc(t.iniciais)} <span class="mini-tag" style="background:${V.hexDaCor(t.cor)};color:${V.textoSobre(V.hexDaCor(t.cor))}">${esc(t.cor || "sem cor")}</span>`).join(" ");
      const feita = l.estado === "feita";
      const seloTxt = feita ? selo(l.mensagem || "Registrada", "ok") : d.pronta ? selo("Rascunho pronto · não registrada", "rascunho") : selo("Faltam dados", "espera");
      return `<div class="rascunho-live ${feita ? "feita" : d.pronta ? "pronta" : ""}" data-l="${idx}">
        <div class="cab"><strong>${esc(d.nome || "(sem nome)")}</strong>${seloTxt}</div>
        ${contato ? `<div class="linha-d"><span class="k">Contato:</span> ${esc(contato)}</div>` : ""}
        ${end ? `<div class="linha-d"><span class="k">Endereço:</span> ${esc(end)}</div>` : ""}
        ${prod ? `<div class="linha-d"><span class="k">Produtos:</span><br>${prod}</div>` : ""}
        ${tagsSoltas ? `<div class="linha-d"><span class="k">${d.linhas.length ? "Tag da venda" : "Tag avulsa"}:</span> ${tagsSoltas}</div>` : ""}
        ${d.linhas.length ? `<div class="linha-d"><span class="k">Pagamento:</span> ${esc(d.pagamento ? V.PAGAMENTOS[d.pagamento] + (d.pagamento === "credito" ? " " + (d.parcelas || 1) + "x" : "") : "não informado")} · <span class="k">Valor:</span> ${d.valorFinal != null && !isNaN(d.valorFinal) ? esc(brl(d.valorFinal)) + (d.valorOrigem !== "informado" ? " (" + esc(d.valorOrigem) + ")" : "") : "faltando"}</div>` : ""}
        ${d.obs ? `<div class="linha-d"><span class="k">Obs.:</span> ${esc(d.obs)}</div>` : ""}
        ${!feita && (d.bloqueios.length || d.avisos.length) ? `<ul class="problemas">${d.bloqueios.map((t) => `<li class="bloq">• ${esc(t)}</li>`).join("")}${d.avisos.map((t) => `<li class="info">• ${esc(t)}</li>`).join("")}</ul>` : ""}
        ${l.erro ? `<p class="erro">${esc(l.erro)}</p>` : ""}
        ${feita ? "" : `<div class="acoes-linha"><button type="button" class="botao" data-acao="registrar"${d.pronta ? "" : " disabled"}>${soTags(l) ? "Cadastrar tag" : "Registrar"}</button><button type="button" class="botao botao-sec" data-acao="revisar"${soTags(l) ? " hidden" : ""}>Revisar na venda</button><button type="button" class="link" data-acao="descartar">Descartar</button></div>`}
      </div>`;
    }).join("");
  }
  $("live-ler").addEventListener("click", () => {
    const txt = $("live-texto").value;
    if (!txt.trim()) { $("live-msg").textContent = "Cole as mensagens primeiro."; return; }
    const lidos = E.leitor.lerLive(txt).map((d) => ({ d, chave: "live-" + N.uuid(), estado: "pendente", mensagem: "", erro: "" }));
    N.setLives(lidos);
    const prontas = lidos.filter((l) => l.d.pronta).length;
    $("live-msg").textContent = lidos.length ? lidos.length + (lidos.length === 1 ? " cliente lida" : " clientes lidas") + ", " + prontas + (prontas === 1 ? " pronta" : " prontas") + ". Confira abaixo. Nada foi registrado." : "Não encontrei dados de cliente nesse texto.";
    renderLive();
  });
  $("live-limpar").addEventListener("click", () => { $("live-texto").value = ""; N.setLives([]); $("live-msg").textContent = ""; renderLive(); });
  $("live-modelo").addEventListener("click", async () => {
    const t = ["Olá! Para fechar o seu pedido, me envie por favor:", "", "Nome completo:", "CPF:", "Telefone:", "CEP:", "Endereço (rua, número, complemento, bairro, cidade/UF):", "Produto:", "Cor:", "Tag - iniciais (opcional):", "Tag - cor (opcional):", "Forma de pagamento (Pix ou cartão em até 6x):"].join("\n");
    $("live-msg").textContent = (await N.copiar(t)) ? "Modelo copiado. Cole na conversa da cliente." : "Não consegui copiar o modelo.";
  });
  $("seg-live-com").addEventListener("click", (e) => {
    const b = e.target.closest("[data-com]");
    if (!b) return;
    N.comLive = Number(b.dataset.com);
    N.gravar("life-com-live", N.comLive);
    renderLive();
  });
  function reavaliarPendentes() { N.getLives().forEach((l) => { if (l.estado === "pendente") E.leitor.avaliar(l.d); }); }
  async function atualizarDepoisDeVender() {
    await N.recarregar(["produtos", "clientes", "vendas", "tags"]);
    reavaliarPendentes();
    N.renderTudo();
  }
  $("live-rascunhos").addEventListener("click", async (e) => {
    const card = e.target.closest("[data-l]");
    const b = e.target.closest("[data-acao]");
    if (!card || !b) return;
    const lives = N.getLives();
    const idx = Number(card.dataset.l);
    const l = lives[idx];
    if (b.dataset.acao === "descartar") { lives.splice(idx, 1); renderLive(); return; }
    if (b.dataset.acao === "revisar") {
      if (!N.rascunhoVazio() && !window.confirm("Já existe uma venda em andamento na tela. Substituir pelo rascunho de " + l.d.nome + "?")) return;
      N.R = liveParaRascunho(l);
      N.salvarRascunho(); N.renderCliente(); N.renderItens(); N.renderPagamento(); N.atualizarResumo();
      l.estado = "feita"; l.mensagem = "Em revisão na aba Nova venda"; renderLive();
      N.irParaModo("manual"); window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (soTags(l)) { await registrarTagsAvulsas(l); return; }
    const r = liveParaRascunho(l);
    const problemas = N.validar(r);
    if (problemas.length) { l.erro = problemas.join(" "); renderLive(); return; }
    l.erro = "";
    N.abrirConfirmacao(r, async (res) => {
      l.estado = "feita"; l.mensagem = "Registrada #" + res.numero;
      await atualizarDepoisDeVender();
    });
  });
  async function registrarTagsAvulsas(l) {
    const linhas = l.d.tagsVenda.map((t) => ({ cliente_nome: l.d.nome || "Sem nome", iniciais: t.iniciais || null, cor: t.cor || "a escolher", origem: "avulsa", observacao: l.d.obs || null }));
    const { error } = await sb.from("tags").insert(linhas);
    if (error) { l.erro = N.traduzirErro(error); renderLive(); return; }
    l.estado = "feita"; l.mensagem = linhas.length + (linhas.length === 1 ? " tag avulsa cadastrada" : " tags avulsas cadastradas");
    await N.recarregar(["tags"]); N.renderTudo();
  }
  $("live-registrar-todas").addEventListener("click", () => {
    const lista = N.getLives().filter((l) => l.estado === "pendente" && l.d.pronta && !soTags(l));
    if (!lista.length) return;
    const rs = lista.map((l) => ({ l, r: liveParaRascunho(l) }));
    const total = rs.reduce((t, x) => t + N.totaisDe(x.r).total, 0);
    const html = `<ul class="lista-simples">${rs.map((x) => `<li><span class="esq">${esc(x.r.cliente.nome)}<small>${x.r.itens.map((i) => i.quantidade + "x " + esc(i.nome)).join("; ")}</small></span><span>${brl(N.totaisDe(x.r).total)}</span></li>`).join("")}</ul>
      <p><strong>${rs.length}</strong> ${rs.length === 1 ? "venda" : "vendas"} · <strong>${brl(total)}</strong> · comissão ${N.comLive}%. O estoque de cada produto será baixado agora.</p>`;
    N.abrirConfirmacaoLivre("Registrar " + rs.length + (rs.length === 1 ? " venda?" : " vendas?"), html, async (progresso) => {
      let ok = 0, falhas = 0;
      for (let k = 0; k < rs.length; k++) {
        const { l, r } = rs[k];
        progresso("Registrando " + (k + 1) + " de " + rs.length + "…");
        const problemas = N.validar(r);
        if (problemas.length) { l.erro = problemas.join(" "); falhas++; continue; }
        try {
          const res = await N.registrar(r);
          l.estado = "feita"; l.mensagem = "Registrada #" + res.numero; l.erro = ""; ok++;
          await N.recarregar(["produtos"]);
          reavaliarPendentes();
        } catch (e) { l.erro = N.traduzirErro(e); falhas++; }
      }
      await atualizarDepoisDeVender();
      $("live-msg").textContent = ok + (ok === 1 ? " venda registrada" : " vendas registradas") + (falhas ? " · " + falhas + " precisam de conferência (veja abaixo)." : ".");
    });
  });

  // =====================================================================
  // VENDAS
  // =====================================================================
  function aplicarAtalho(a) {
    const h = N.hoje();
    const f = F.vendas;
    if (a === "hoje") { f.de = h; f.ate = h; }
    else if (a === "ontem") { f.de = N.somaDias(h, -1); f.ate = N.somaDias(h, -1); }
    else if (a === "semana") { f.de = N.somaDias(h, -6); f.ate = h; }
    else if (a === "mes") { f.de = h.slice(0, 8) + "01"; f.ate = h; }
    else { f.de = ""; f.ate = ""; }
    $("f-de").value = f.de; $("f-ate").value = f.ate;
    document.querySelectorAll("#f-atalhos .chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.atalho === a)));
  }
  function palhaDe(v) {
    if (!v._h) {
      const c = E.clientes.find((x) => x.id === v.cliente_id) || {};
      v._h = V.norm([v.numero, v.numero_legado, v.cliente_nome, v.observacao, c.telefone, c.documento, c.cidade, v.itens.map((i) => i.descricao + " " + (i.codigo || "")).join(" "), v.tags.map((t) => (t.iniciais || "") + " " + t.cor).join(" ")].join(" "));
    }
    return v._h;
  }
  function vendasFiltradas() {
    const f = F.vendas;
    const q = V.norm(f.busca);
    return E.vendas.filter((v) => {
      const d = N.dia(v.criado_em);
      if (f.de && d < f.de) return false;
      if (f.ate && d > f.ate) return false;
      if (f.status === "aguardando" && !(v.status === "confirmada" && v.pagamento === "aguardando")) return false;
      if (f.status === "canceladas" && v.status !== "cancelada") return false;
      return !q || q.split(" ").every((t) => palhaDe(v).includes(t));
    });
  }
  function renderVendas() {
    const lista = vendasFiltradas();
    const conf = lista.filter((v) => v.status === "confirmada");
    const total = conf.reduce((t, v) => t + v.valor_total, 0);
    const com = conf.reduce((t, v) => t + v.comissao_valor, 0);
    const esp = conf.filter((v) => v.pagamento === "aguardando").reduce((t, v) => t + v.valor_total, 0);
    $("totais-vendas").innerHTML = [
      ["Total vendido", brl(total)], ["Vendas", String(conf.length)], ["Comissões", brl(com)], ["Aguardando pagamento", brl(esp)],
    ].map(([k, v]) => `<div class="total-card"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join("");
    $("vendas-vazio").hidden = lista.length > 0;
    $("lista-vendas").innerHTML = lista.slice(0, 300).map((v) => {
      const tagsAF = v.tags.filter((t) => t.status === "a_fazer").length;
      return `<li><button type="button" class="venda-card${v.status === "cancelada" ? " cancelada" : ""}" data-id="${esc(v.id)}">
        <span class="quem-v">${esc(v.cliente_nome)}</span><span class="valor">${brl(v.valor_total)}</span>
        <span class="meta">${esc(numeroTexto(v))} · ${esc(N.dataHora(v.criado_em))} · ${v.itens.reduce((t, i) => t + i.quantidade, 0)} ${v.itens.reduce((t, i) => t + i.quantidade, 0) === 1 ? "peça" : "peças"}</span><span class="meta">comissão ${esc(brl(v.comissao_valor))}</span>
        <span class="selos">${v.status === "cancelada" ? selo("Cancelada", "cancelada") : v.pagamento === "aguardando" ? selo("Aguardando pagamento", "espera") : selo(pagTexto(v), "ok")}${v.tags.length ? selo(v.tags.length + (v.tags.length === 1 ? " tag" : " tags") + (tagsAF ? " · " + tagsAF + " a fazer" : ""), "neutro") : ""}${v.bling_status === "exportada" ? selo("No Bling", "neutro") : ""}${v.origem === "live" ? selo("Live", "neutro") : ""}${v.origem === "legado" ? selo("Antiga", "neutro") : ""}</span></button></li>`;
    }).join("") + (lista.length > 300 ? `<li class="vazio">Mostrando as 300 mais recentes de ${lista.length}. Use os filtros para ver as outras.</li>` : "");
  }
  document.querySelectorAll("#f-atalhos .chip").forEach((c) => c.addEventListener("click", () => { aplicarAtalho(c.dataset.atalho); renderVendas(); }));
  ["f-de", "f-ate"].forEach((id) => $(id).addEventListener("change", () => {
    F.vendas.de = $("f-de").value; F.vendas.ate = $("f-ate").value;
    document.querySelectorAll("#f-atalhos .chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
    renderVendas();
  }));
  $("f-busca").addEventListener("input", () => { F.vendas.busca = $("f-busca").value; renderVendas(); });
  $("f-status").addEventListener("click", (e) => {
    const b = e.target.closest("[data-status]");
    if (!b) return;
    F.vendas.status = b.dataset.status;
    document.querySelectorAll("#f-status .chip").forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
    renderVendas();
  });
  $("lista-vendas").addEventListener("click", (e) => { const b = e.target.closest(".venda-card"); if (b) abrirVenda(b.dataset.id); });

  // ---- detalhe da venda ----
  function textoDaVendaRegistrada(v) {
    const c = E.clientes.find((x) => x.id === v.cliente_id) || {};
    return V.montarTexto({
      numero: v.numero_legado || v.numero, cliente_nome: v.cliente_nome, cliente: c, valor_total: v.valor_total, pagamento: v.pagamento, parcelas: v.parcelas, observacao: v.observacao || "", data: N.dataCurta(v.criado_em),
      itens: v.itens.map((i) => { const s = V.separarNome(i.descricao); const t = v.tags.find((x) => x.venda_item_id === i.id); return { quantidade: i.quantidade, modelo: s.modelo, descricao: i.descricao, cor: s.cor, codigo: i.codigo, preco_unit: Number(i.preco_unit), tag: t ? { iniciais: t.iniciais, cor: t.cor } : null }; }),
      tags_venda: v.tags.filter((t) => !t.venda_item_id).map((t) => ({ iniciais: t.iniciais, cor: t.cor })),
    }, N.formatoTexto());
  }
  const ST_TAG = { a_fazer: "A fazer", enviada: "Enviada", pronta: "Pronta", cancelada: "Cancelada" };
  function abrirVenda(id) {
    const v = E.vendas.find((x) => x.id === id);
    if (!v) return;
    const c = E.clientes.find((x) => x.id === v.cliente_id) || {};
    const ativa = v.status === "confirmada";
    $("dv-corpo").innerHTML = `<h2 id="dv-titulo">${esc(numeroTexto(v))} · ${esc(v.cliente_nome)}</h2>
      <p class="dica">${esc(N.dataHora(v.criado_em))}${v.criado_por_email ? " · por " + esc(v.criado_por_email) : ""}${v.origem === "live" ? " · live" : ""}</p>
      <div class="selos" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">${v.status === "cancelada" ? selo("Cancelada", "cancelada") : v.pagamento === "aguardando" ? selo("Aguardando pagamento", "espera") : selo(pagTexto(v), "ok")}${v.bling_status === "exportada" ? selo("Levada ao Bling", "neutro") : ""}</div>
      <ul class="lista-simples">${v.itens.map((i) => `<li><span class="esq">${i.quantidade}x ${esc(i.descricao)}<small>${esc(i.codigo || "sem código")} · ${brl(Number(i.preco_unit))} cada</small></span><span>${brl(Number(i.preco_unit) * i.quantidade)}</span></li>`).join("")}</ul>
      <p><strong>Total ${brl(v.valor_total)}</strong> · comissão ${String(v.comissao_pct).replace(".", ",")}% (${brl(v.comissao_valor)})</p>
      ${v.tags.length ? `<p class="rotulo">Tags</p><ul class="lista-simples">${v.tags.map((t) => `<li><span class="esq"><span class="mini-tag" style="background:${V.hexDaCor(t.cor)};color:${V.textoSobre(V.hexDaCor(t.cor))}">${esc(t.iniciais || "sem iniciais")}</span> ${esc(t.cor)}</span><span>${esc(ST_TAG[t.status] || t.status)}</span></li>`).join("")}</ul>` : ""}
      ${c.telefone || c.rua || c.cidade ? `<p class="dica">${esc([c.telefone, V.enderecoLinha(c)].filter(Boolean).join(" · "))}</p>` : ""}
      ${v.status === "cancelada" ? `<p class="efeito">Cancelada em ${esc(N.dataHora(v.cancelada_em))}: ${esc(v.cancelada_motivo || "")}. O estoque foi devolvido.</p>` : ""}
      <label>Observação<textarea id="dv-obs" rows="2" maxlength="500">${esc(v.observacao || "")}</textarea></label>
      <p class="erro" id="dv-erro" role="alert"></p>
      <div class="acoes-linha">
        <button type="button" class="botao botao-sec" data-v="copiar">Copiar texto</button>
        <button type="button" class="botao botao-sec" data-v="obs">Salvar observação</button>
        ${ativa && v.pagamento === "aguardando" ? '<button type="button" class="botao" data-v="pago">Marcar como pago</button>' : ""}
      </div>
      <div id="dv-pago" hidden>
        <p class="rotulo">Como a cliente pagou?</p>
        <div class="segmentos"><button type="button" class="seg" data-pg="pix">Pix</button><button type="button" class="seg" data-pg="credito">Cartão de crédito</button></div>
        <label id="dv-parc" hidden>Parcelas<select id="dv-parcelas">${[1, 2, 3, 4, 5, 6].map((n) => `<option value="${n}">${n}x</option>`).join("")}</select></label>
        <button type="button" class="botao" data-v="pago-ok" disabled>Confirmar pagamento</button>
      </div>
      ${ativa ? `<div class="acoes-linha"><button type="button" class="botao botao-sec" data-v="corrigir">Corrigir produtos (cancela e reabre como rascunho)</button><button type="button" class="botao botao-perigo" data-v="cancelar">Cancelar venda</button></div>
      <div id="dv-cancelar" hidden><label>Motivo do cancelamento<input type="text" id="dv-motivo" placeholder="Ex.: cliente desistiu, lancei errado"></label><button type="button" class="botao botao-perigo" data-v="cancelar-ok">Cancelar e devolver ao estoque</button></div>` : ""}
      <div class="acoes-linha"><button type="button" class="botao botao-sec" data-v="fechar">Fechar</button></div>`;
    $("dlg-venda").dataset.id = id;
    $("dlg-venda").showModal();
  }
  let pagamentoEscolhido = "";
  $("dlg-venda").addEventListener("click", async (e) => {
    const id = $("dlg-venda").dataset.id;
    const v = E.vendas.find((x) => x.id === id);
    const pg = e.target.closest("[data-pg]");
    if (pg) {
      pagamentoEscolhido = pg.dataset.pg;
      $("dv-pago").querySelectorAll("[data-pg]").forEach((b) => b.setAttribute("aria-pressed", String(b === pg)));
      $("dv-parc").hidden = pagamentoEscolhido !== "credito";
      $("dv-pago").querySelector("[data-v=pago-ok]").disabled = false;
      return;
    }
    const b = e.target.closest("[data-v]");
    if (!b || !v) return;
    const erro = $("dv-erro");
    erro.textContent = "";
    const a = b.dataset.v;
    const recarregarTudo = async () => { await N.recarregar(["produtos", "clientes", "vendas", "tags"]); N.renderTudo(); };
    try {
      if (a === "fechar") $("dlg-venda").close();
      else if (a === "copiar") { b.textContent = (await N.copiar(textoDaVendaRegistrada(v))) ? "Texto copiado" : "Não consegui copiar"; }
      else if (a === "obs") {
        const { error } = await sb.from("vendas").update({ observacao: $("dv-obs").value.trim() || null }).eq("id", id);
        if (error) throw error;
        await recarregarTudo(); N.aviso("Observação salva.");
      } else if (a === "pago") { $("dv-pago").hidden = false; b.hidden = true; }
      else if (a === "pago-ok") {
        const parcelas = pagamentoEscolhido === "credito" ? Number($("dv-parcelas").value) : null;
        const { error } = await sb.from("vendas").update({ pagamento: pagamentoEscolhido, parcelas, pago_em: new Date().toISOString() }).eq("id", id);
        if (error) throw error;
        await recarregarTudo(); abrirVenda(id); N.aviso("Pagamento registrado.");
      } else if (a === "cancelar") { $("dv-cancelar").hidden = false; b.hidden = true; $("dv-motivo").focus(); }
      else if (a === "cancelar-ok" || a === "corrigir") {
        const motivo = a === "corrigir" ? "Correção da venda (lançada errada)" : $("dv-motivo").value.trim();
        if (motivo.length < 3) { erro.textContent = "Escreva o motivo do cancelamento."; return; }
        if (a === "corrigir" && !N.rascunhoVazio() && !window.confirm("Já existe uma venda em andamento na tela. Ela será substituída pela venda corrigida. Continuar?")) return;
        b.disabled = true;
        const { data, error } = await sb.rpc("cancelar_venda", { p_id: id, p_motivo: motivo });
        if (error) { b.disabled = false; throw error; }
        await recarregarTudo();
        $("dlg-venda").close();
        if (a === "corrigir") {
          reabrirComoRascunho(v);
          N.aviso("Venda cancelada e reaberta como rascunho. Corrija e registre de novo.");
        } else N.aviso("Venda cancelada. O estoque foi devolvido." + (data && data.tags_ja_enviadas ? " Atenção: " + data.tags_ja_enviadas + " tag(s) já tinham sido enviadas à fábrica." : ""));
      }
    } catch (err) { erro.textContent = N.traduzirErro(err); }
  });
  function reabrirComoRascunho(v) {
    const r = N.rascunhoNovo();
    const c = E.clientes.find((x) => x.id === v.cliente_id) || {};
    r.cliente.nome = v.cliente_nome;
    CAMPOS.forEach((k) => { r.cliente[k] = c[k] || ""; });
    r.itens = v.itens.map((i) => {
      const it = i.produto_id ? E.mapaItens.get(i.produto_id + "|" + (i.variacao || "")) : null;
      const t = v.tags.find((x) => x.venda_item_id === i.id);
      const s = V.separarNome(i.descricao);
      return { chave: it ? it.chave : "ext|" + i.id, produto_id: it ? it.produto_id : null, variacao: i.variacao || "", nome: i.descricao, modelo: it ? it.modelo : s.modelo, cor: it ? it.cor : s.cor, codigo: i.codigo || "", preco: Number(i.preco_unit), quantidade: i.quantidade, tag: t ? { iniciais: t.iniciais || "", cor: t.cor } : null, travaTag: !!(it && it.ehTag) };
    });
    r.tagsVenda = v.tags.filter((t) => !t.venda_item_id).map((t) => ({ iniciais: t.iniciais || "", cor: t.cor, origem: t.origem === "avulsa" ? "avulsa" : "brinde" }));
    r.pagamento = v.pagamento; r.parcelas = v.parcelas || 1; r.comissao = Number(v.comissao_pct); r.obs = v.observacao || "";
    const soma = V.totais(r.itens.map((i) => ({ preco_unit: i.preco || 0, quantidade: i.quantidade }))).soma;
    r.valorManual = V.arred(v.valor_total) !== soma ? V.arred(v.valor_total) : null;
    N.R = r; N.salvarRascunho();
    N.renderCliente(); N.renderItens(); N.renderPagamento(); N.atualizarResumo();
    N.abrirAba("vender"); N.irParaModo("manual");
  }

  // ---- Bling (planilha) e PDF das vendas ----
  $("bling-baixar").addEventListener("click", async () => {
    const msg = $("bling-msg");
    let lista = vendasFiltradas().filter((v) => v.status === "confirmada");
    if ($("bling-novas").checked) lista = lista.filter((v) => v.bling_status === "nao");
    if (!lista.length) { msg.textContent = "Nenhuma venda para levar com esses filtros."; return; }
    lista = lista.slice().sort((a, b) => new Date(a.criado_em) - new Date(b.criado_em));
    const csv = V.paraCsv(V.csvVendas(lista, E.clientes));
    N.baixarArquivo(csv, "vendas-life-atelie-" + N.hoje() + ".csv", "text/csv;charset=utf-8");
    msg.textContent = "Planilha com " + lista.length + (lista.length === 1 ? " venda baixada." : " vendas baixada.");
    if ($("bling-marcar").checked) {
      const { error } = await sb.from("vendas").update({ bling_status: "exportada", bling_em: new Date().toISOString() }).in("id", lista.map((v) => v.id));
      if (error) { msg.textContent += " Não consegui marcar como levadas: " + N.traduzirErro(error); return; }
      await N.recarregar(["vendas"]); renderVendas();
      msg.textContent += " Marcadas como levadas ao Bling.";
    }
  });
  $("v-imprimir").addEventListener("click", () => {
    const lista = vendasFiltradas().filter((v) => v.status === "confirmada").slice().sort((a, b) => new Date(a.criado_em) - new Date(b.criado_em));
    const total = lista.reduce((t, v) => t + v.valor_total, 0), com = lista.reduce((t, v) => t + v.comissao_valor, 0);
    const f = F.vendas;
    imprimir(`<h1>Vendas · Life Ateliê</h1><p>${f.de || f.ate ? esc((f.de ? f.de.split("-").reverse().join("/") : "início") + " a " + (f.ate ? f.ate.split("-").reverse().join("/") : "hoje")) : "Todo o período"} · ${lista.length} vendas · total ${esc(brl(total))} · comissões ${esc(brl(com))}</p>
      <table><thead><tr><th>Nº</th><th>Data</th><th>Cliente</th><th>Produtos</th><th>Pagamento</th><th>Total</th><th>Comissão</th></tr></thead><tbody>${lista.map((v) => `<tr><td>${esc(numeroTexto(v))}</td><td>${esc(N.dataCurta(v.criado_em))}</td><td>${esc(v.cliente_nome)}</td><td>${esc(v.itens.map((i) => i.quantidade + "x " + i.descricao).join("; "))}</td><td>${esc(pagTexto(v))}</td><td>${esc(brl(v.valor_total))}</td><td>${esc(brl(v.comissao_valor))}</td></tr>`).join("")}</tbody></table>`);
  });

  // =====================================================================
  // TAGS
  // =====================================================================
  const tagsFiltradas = () => {
    const f = F.tags;
    const q = V.norm(f.busca);
    return E.tags.filter((t) => (f.st === "todas" ? t.status !== "cancelada" : t.status === f.st) && (!q || V.norm((t.cliente_nome || "") + " " + (t.iniciais || "") + " " + t.cor).includes(q)));
  };
  function numeroDaVendaDaTag(t) { const v = t.venda_id ? E.vendas.find((x) => x.id === t.venda_id) : null; return v ? numeroTexto(v) : "sem venda"; }
  function renderTags() {
    const lista = tagsFiltradas();
    const sel = F.tags.sel;
    [...sel].forEach((id) => { if (!lista.some((t) => t.id === id)) sel.delete(id); });
    $("t-resumo").innerHTML = lista.length ? `${lista.length} ${lista.length === 1 ? "tag" : "tags"} · <button type="button" class="link" id="t-todas">${sel.size === lista.length ? "Limpar seleção" : "Selecionar todas"}</button>` : "Nenhuma tag neste filtro.";
    $("lista-tags").innerHTML = lista.map((t) => {
      const hex = V.hexDaCor(t.cor);
      return `<li class="tag-card" data-id="${esc(t.id)}">
        <input type="checkbox" class="t-sel" aria-label="Selecionar tag de ${esc(t.cliente_nome)}"${sel.has(t.id) ? " checked" : ""}>
        <span class="fichinha" style="background:${hex};color:${V.textoSobre(hex)}">${esc(t.iniciais || "?")}</span>
        <div><div class="nome">${esc(t.cliente_nome)}</div><div class="meta">${esc(t.cor)} · ${esc(numeroDaVendaDaTag(t))} · ${esc(N.dataCurta(t.criado_em))}${t.origem !== "item" ? " · " + (t.origem === "avulsa" ? "avulsa" : "brinde") : ""}${t.observacao ? " · " + esc(t.observacao) : ""}</div>
          ${t.iniciais ? "" : '<div class="meta" style="color:var(--perigo)">Faltam as iniciais</div>'}${selo(ST_TAG[t.status] || t.status, t.status === "a_fazer" ? "espera" : t.status === "pronta" ? "ok" : "neutro")}</div>
        <div class="acoes-mini">
          <button type="button" class="botao botao-sec" data-ta="editar">Editar</button>
          ${t.status === "a_fazer" ? '<button type="button" class="botao botao-sec" data-ta="enviada">Marcar enviada</button>' : ""}
          ${t.status === "enviada" ? '<button type="button" class="botao botao-sec" data-ta="pronta">Marcar pronta</button>' : ""}
          ${t.status !== "a_fazer" ? '<button type="button" class="botao botao-sec" data-ta="a_fazer">Voltar para a fazer</button>' : '<button type="button" class="botao botao-perigo" data-ta="excluir">Excluir</button>'}
        </div></li>`;
    }).join("");
    $("barra-tags").hidden = sel.size === 0;
    $("t-enviadas").textContent = "Marcar " + sel.size + (sel.size === 1 ? " como enviada" : " como enviadas");
    $("t-whats").hidden = !E.ajustes.telefone_fabrica;
  }
  const selecionadas = () => E.tags.filter((t) => F.tags.sel.has(t.id));
  const textoLista = (ts) => "Tags personalizadas - Life Ateliê\n\n" + ts.map((t, k) => `${k + 1}. ${t.iniciais || "(sem iniciais)"} - cor ${t.cor} - ${t.cliente_nome}`).join("\n");
  document.addEventListener("click", (e) => { if (e.target.id === "t-todas") { const l = tagsFiltradas(); if (F.tags.sel.size === l.length) F.tags.sel.clear(); else l.forEach((t) => F.tags.sel.add(t.id)); renderTags(); } });
  $("t-status").addEventListener("click", (e) => {
    const b = e.target.closest("[data-st]");
    if (!b) return;
    F.tags.st = b.dataset.st; F.tags.sel.clear();
    document.querySelectorAll("#t-status .chip").forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
    renderTags();
  });
  $("t-busca").addEventListener("input", () => { F.tags.busca = $("t-busca").value; renderTags(); });
  $("lista-tags").addEventListener("change", (e) => {
    if (!e.target.classList.contains("t-sel")) return;
    const id = e.target.closest("[data-id]").dataset.id;
    if (e.target.checked) F.tags.sel.add(id); else F.tags.sel.delete(id);
    renderTags();
  });
  async function mudarStatusTags(ids, status) {
    const dados = { status, enviada_em: status === "enviada" ? new Date().toISOString() : null };
    const { error } = await sb.from("tags").update(dados).in("id", ids);
    if (error) throw error;
    await N.recarregar(["tags"]); N.renderTudo();
  }
  $("lista-tags").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-ta]");
    if (!b) return;
    const id = b.closest("[data-id]").dataset.id;
    const t = E.tags.find((x) => x.id === id);
    try {
      if (b.dataset.ta === "editar") abrirTag(t);
      else if (b.dataset.ta === "excluir") {
        if (!window.confirm("Excluir esta tag? Só dá para excluir tags que ainda não foram enviadas.")) return;
        const { error } = await sb.from("tags").delete().eq("id", id);
        if (error) throw error;
        await N.recarregar(["tags"]); N.renderTudo();
      } else await mudarStatusTags([id], b.dataset.ta);
    } catch (err) { N.aviso(N.traduzirErro(err), true); }
  });
  $("t-copiar").addEventListener("click", async () => { $("t-msg").textContent = (await N.copiar(textoLista(selecionadas()))) ? "Lista copiada." : "Não consegui copiar."; });
  $("t-whats").addEventListener("click", () => {
    const num = String(E.ajustes.telefone_fabrica || "").replace(/\D/g, "");
    window.open("https://wa.me/" + num + "?text=" + encodeURIComponent(textoLista(selecionadas())), "_blank", "noopener");
  });
  $("t-imprimir").addEventListener("click", () => {
    const ts = selecionadas();
    imprimir(`<h1>Tags personalizadas · Life Ateliê</h1><p>${esc(N.dataCurta(new Date().toISOString()))} · ${ts.length} ${ts.length === 1 ? "tag" : "tags"}</p>
      <table><thead><tr><th>#</th><th>Iniciais</th><th>Cor da tag</th><th>Cliente</th><th>Venda</th></tr></thead><tbody>${ts.map((t, k) => `<tr><td>${k + 1}</td><td class="ini">${esc(t.iniciais || "?")}</td><td>${esc(t.cor)}</td><td>${esc(t.cliente_nome)}</td><td>${esc(numeroDaVendaDaTag(t))}</td></tr>`).join("")}</tbody></table>`);
  });
  $("t-enviadas").addEventListener("click", async () => {
    const ids = selecionadas().filter((t) => t.status === "a_fazer").map((t) => t.id);
    if (!ids.length) { $("t-msg").textContent = "Nenhuma das selecionadas está “a fazer”."; return; }
    try { await mudarStatusTags(ids, "enviada"); F.tags.sel.clear(); renderTags(); $("t-msg").textContent = ids.length + (ids.length === 1 ? " tag marcada como enviada." : " tags marcadas como enviadas."); }
    catch (err) { $("t-msg").textContent = N.traduzirErro(err); }
  });
  // cadastrar / editar tag
  let tagEmEdicao = null, corTag = "";
  function abrirTag(t) {
    tagEmEdicao = t || null;
    $("dt-titulo").textContent = t ? "Editar tag" : "Tag avulsa";
    $("dt-box-cliente").hidden = !!t;
    $("dt-cliente").value = ""; $("dt-iniciais").value = t ? t.iniciais || "" : ""; $("dt-obs").value = t ? t.observacao || "" : "";
    corTag = t ? t.cor : "";
    desenharCoresTag();
    $("dt-erro").textContent = "";
    $("dlg-tag").showModal();
  }
  function desenharCoresTag() { $("dt-cores").innerHTML = N.coresDeTag(corTag); }
  $("dt-cores").addEventListener("click", (e) => { const c = e.target.closest(".cor"); if (c) { corTag = c.dataset.cor; desenharCoresTag(); } });
  $("t-nova").addEventListener("click", () => abrirTag(null));
  $("form-tag").addEventListener("submit", async (e) => {
    e.preventDefault();
    const iniciais = $("dt-iniciais").value.trim().toUpperCase();
    if (!corTag) { $("dt-erro").textContent = "Escolha a cor da tag."; return; }
    if (!tagEmEdicao && !$("dt-cliente").value.trim()) { $("dt-erro").textContent = "Escreva o nome da cliente."; return; }
    const obs = $("dt-obs").value.trim() || null;
    const r = tagEmEdicao
      ? await sb.from("tags").update({ iniciais: iniciais || null, cor: corTag, observacao: obs }).eq("id", tagEmEdicao.id)
      : await sb.from("tags").insert({ cliente_nome: $("dt-cliente").value.trim(), iniciais: iniciais || null, cor: corTag, origem: "avulsa", observacao: obs });
    if (r.error) { $("dt-erro").textContent = N.traduzirErro(r.error); return; }
    $("dlg-tag").close();
    await N.recarregar(["tags"]); N.renderTudo(); N.aviso("Tag salva.");
  });

  // =====================================================================
  // ESTOQUE
  // =====================================================================
  const itensEstoque = () => E.itens.filter((i) => !i.ehTag && (F.estoque.ocultos || i.visivel));
  const baixo = (i) => i.qtd != null && i.qtd > 0 && i.qtd <= E.ajustes.estoque_baixo;
  function renderEstoque() {
    const todos = itensEstoque();
    const esg = todos.filter(V.esgotado), bx = todos.filter(baixo), sem = todos.filter((i) => i.qtd == null);
    const pecas = todos.reduce((t, i) => t + (i.qtd || 0), 0);
    $("resumo-estoque").innerHTML = [
      ["todos", "Peças em estoque", pecas, ""], ["esgotados", "Cores esgotadas", esg.length, "perigo"], ["baixo", "Estoque baixo", bx.length, "alerta"], ["semcontrole", "Sem controle", sem.length, ""],
    ].map(([f, k, n, cls]) => `<button type="button" class="${cls}" data-ef="${f}"><span>${k}</span><strong>${n}</strong></button>`).join("");
    document.querySelectorAll("#e-filtro .chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.ef === F.estoque.filtro)));
    let lista = V.buscar(todos, F.estoque.busca, { limite: 2000, incluirOcultos: true, incluirTags: false });
    if (F.estoque.filtro === "esgotados") lista = lista.filter(V.esgotado);
    else if (F.estoque.filtro === "baixo") lista = lista.filter(baixo);
    else if (F.estoque.filtro === "semcontrole") lista = lista.filter((i) => i.qtd == null);
    const grupos = new Map();
    lista.slice().sort((a, b) => a.modelo.localeCompare(b.modelo, "pt-BR") || a.cor.localeCompare(b.cor, "pt-BR")).forEach((i) => { if (!grupos.has(i.modelo)) grupos.set(i.modelo, []); grupos.get(i.modelo).push(i); });
    $("lista-estoque").innerHTML = grupos.size ? [...grupos].map(([m, its]) => `<div class="grupo-estoque"><h3>${esc(m)}</h3>${its.map((i) => `<div class="linha-estoque${V.esgotado(i) ? " esgotado" : ""}" data-chave="${esc(i.chave)}">
        <div><div class="nome">${esc(i.cor || i.nome)}${i.variacao && i.cor !== i.variacao ? " · " + esc(i.variacao) : ""}</div><div class="meta">${esc(i.codigo || "sem código")}${i.visivel ? "" : " · oculto"}${i.preco != null ? " · " + esc(brl(i.preco)) : ""}</div></div>
        <div class="qtd" title="${esc(V.estoqueTexto(i))}">${i.qtd == null ? "–" : i.qtd}</div>
        <div class="acoes-mini">${i.qtd != null ? '<button type="button" class="botao botao-sec botao-mini" data-ea="entrada">+ Entrada</button>' : ""}<button type="button" class="botao botao-sec botao-mini" data-ea="ajuste">${i.qtd == null ? "Controlar estoque" : "Ajustar"}</button><button type="button" class="botao botao-sec botao-mini" data-ea="historico">Histórico</button></div></div>`).join("")}</div>`).join("") : '<p class="vazio">Nenhum produto neste filtro.</p>';
  }
  $("resumo-estoque").addEventListener("click", (e) => { const b = e.target.closest("[data-ef]"); if (b) { F.estoque.filtro = b.dataset.ef; renderEstoque(); } });
  $("e-filtro").addEventListener("click", (e) => { const b = e.target.closest("[data-ef]"); if (b) { F.estoque.filtro = b.dataset.ef; renderEstoque(); } });
  $("e-busca").addEventListener("input", () => { F.estoque.busca = $("e-busca").value; renderEstoque(); });
  $("e-ocultos").addEventListener("change", () => { F.estoque.ocultos = $("e-ocultos").checked; renderEstoque(); });
  $("lista-estoque").addEventListener("click", (e) => {
    const b = e.target.closest("[data-ea]");
    if (!b) return;
    const it = E.mapaItens.get(b.closest("[data-chave]").dataset.chave);
    if (!it) return;
    if (b.dataset.ea === "historico") { $("h-busca").value = it.codigo || it.nome; F.hist = $("h-busca").value; carregarMov(true).then(() => $("h-busca").scrollIntoView({ behavior: "smooth", block: "center" })); }
    else abrirEstoque(it, b.dataset.ea);
  });
  let estoqueEm = null, tipoEstoque = "entrada";
  const EXPLICA = {
    entrada: "Soma ao que já está no estoque. Use quando chegar reposição.",
    saida: "Tira do estoque sem ser venda (defeito, perda, venda fora do sistema).",
    ajuste: "Define a quantidade exata que existe agora. Use depois de contar o estoque.",
  };
  function abrirEstoque(it, tipo) {
    estoqueEm = it;
    $("de-produto").textContent = it.nome + " · " + (it.qtd == null ? "sem controle de estoque" : "hoje: " + it.qtd);
    document.querySelectorAll("#de-tipos [data-tipo]").forEach((b) => { b.disabled = it.qtd == null && b.dataset.tipo !== "ajuste"; });
    escolherTipoEstoque(it.qtd == null ? "ajuste" : tipo);
    $("de-qtd").value = ""; $("de-motivo").value = ""; $("de-erro").textContent = "";
    $("dlg-estoque").showModal();
  }
  function escolherTipoEstoque(t) {
    tipoEstoque = t;
    document.querySelectorAll("#de-tipos [data-tipo]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.tipo === t)));
    $("de-explica").textContent = EXPLICA[t];
    $("de-rotulo-qtd").textContent = t === "ajuste" ? "Quantidade correta agora" : "Quantidade";
    $("de-qtd").min = t === "ajuste" ? "0" : "1";
    $("de-motivo").placeholder = t === "entrada" ? "Ex.: reposição da fábrica (opcional)" : "Obrigatório. Ex.: peça com defeito, contagem";
  }
  $("de-tipos").addEventListener("click", (e) => { const b = e.target.closest("[data-tipo]"); if (b && !b.disabled) escolherTipoEstoque(b.dataset.tipo); });
  document.querySelectorAll("dialog [data-fechar]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));
  $("form-estoque").addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = parseInt($("de-qtd").value, 10);
    const motivo = $("de-motivo").value.trim();
    if (isNaN(q) || q < 0 || (tipoEstoque !== "ajuste" && q < 1)) { $("de-erro").textContent = "Informe uma quantidade válida."; return; }
    if (tipoEstoque !== "entrada" && !motivo) { $("de-erro").textContent = "Escreva o motivo."; return; }
    const { error } = await sb.rpc("ajustar_estoque", { p_produto: estoqueEm.produto_id, p_variacao: estoqueEm.variacao, p_tipo: tipoEstoque, p_quantidade: q, p_motivo: motivo });
    if (error) { $("de-erro").textContent = N.traduzirErro(error); return; }
    $("dlg-estoque").close();
    await N.recarregar(["produtos"]); await carregarMov(true); N.renderTudo(); N.aviso("Estoque atualizado.");
  });

  // histórico
  const TIPO_MOV = { venda: "Venda", cancelamento: "Cancelamento", entrada: "Entrada", saida: "Saída", ajuste: "Ajuste", importacao: "Importação" };
  F.hist = "";
  async function carregarMov(reset) {
    const tipo = $("h-tipo").value;
    const pagina = 200;
    if (reset) { E.mov = []; E.movFim = false; }
    if (E.movFim) return renderHistorico();
    let q = sb.from("movimentos_estoque").select("*").order("criado_em", { ascending: false }).order("id");
    if (tipo) q = q.eq("tipo", tipo);
    const { data, error } = await q.range(E.mov.length, E.mov.length + pagina - 1);
    if (error) { $("lista-historico").innerHTML = `<li class="erro">${esc(N.traduzirErro(error))}</li>`; return; }
    E.mov = E.mov.concat(data || []);
    if (!data || data.length < pagina) E.movFim = true;
    renderHistorico();
  }
  function renderHistorico() {
    const q = V.norm($("h-busca").value);
    const lista = E.mov.filter((m) => !q || V.norm((m.produto_nome || "") + " " + (m.produto_codigo || "") + " " + (m.variacao || "") + " " + (m.motivo || "")).includes(q));
    $("lista-historico").innerHTML = lista.length ? lista.slice(0, 150).map((m) => {
      const d = m.quantidade_delta;
      return `<li><div class="linha1"><strong>${esc(m.produto_nome || "Produto removido")}${m.variacao ? " · " + esc(m.variacao) : ""}</strong><span class="${d > 0 ? "delta-mais" : d < 0 ? "delta-menos" : ""}">${d == null ? "" : (d > 0 ? "+" : "") + d}</span></div>
        <div class="meta">${esc(TIPO_MOV[m.tipo] || m.tipo)} · ${esc(N.dataHora(m.criado_em))} · ${m.quantidade_antes == null ? "sem controle" : m.quantidade_antes} → ${m.quantidade_depois == null ? "sem controle" : m.quantidade_depois}${m.usuario_email ? " · " + esc(m.usuario_email) : ""}</div>
        ${m.motivo ? `<div class="meta">${esc(m.motivo)}</div>` : ""}</li>`;
    }).join("") : '<li class="vazio">Nada no histórico com esse filtro.</li>';
    $("h-mais").hidden = E.movFim && lista.length <= 150;
    $("h-mais").textContent = lista.length > 150 ? "Mostrando 150 de " + lista.length + ". Refine a busca." : "Ver mais";
    $("h-mais").disabled = lista.length > 150;
  }
  $("h-busca").addEventListener("input", () => { renderHistorico(); if (!E.movFim && $("h-busca").value.trim()) carregarMov(false); });
  $("h-tipo").addEventListener("change", () => carregarMov(true));
  $("h-mais").addEventListener("click", () => carregarMov(false));

  function atualizarEmblemas() {
    const a = E.tags.filter((t) => t.status === "a_fazer").length;
    $("num-tags").hidden = !a; $("num-tags").textContent = String(a);
    const b = itensEstoque().filter(baixo).length;
    $("num-estoque").hidden = !b; $("num-estoque").textContent = String(b);
    $("num-estoque").title = b + (b === 1 ? " produto com estoque baixo" : " produtos com estoque baixo");
  }

  // =====================================================================
  // MAIS: formato do texto, clientes, ajustes
  // =====================================================================
  const AMOSTRA = {
    numero: 123, cliente_nome: "Maria Souza", cliente: { telefone: "(31) 99999-8888", rua: "Rua das Flores", numero: "100", bairro: "Centro", cidade: "Belo Horizonte", uf: "MG" }, valor_total: 489.9, pagamento: "credito", parcelas: 2, observacao: "Entregar na sexta", data: "22/10/2026",
    itens: [{ quantidade: 1, modelo: "Alice", descricao: "Bolsa Alice - Preta", cor: "Preta", codigo: "BLAL01", preco_unit: 489.9, tag: { iniciais: "MS", cor: "Café" } }], tags_venda: [],
  };
  function renderPrevia() { $("fmt-previa").textContent = V.montarTexto(AMOSTRA, N.formatoTexto()); }
  function renderMais() {
    const f = N.formatoTexto();
    if (document.activeElement !== $("fmt-modelo")) $("fmt-modelo").value = f.modelo;
    if (document.activeElement !== $("fmt-item")) $("fmt-item").value = f.item;
    renderPrevia();
    renderClientes();
    $("form-ajustes").hidden = !N.ehAdmin();
    if (N.ehAdmin() && document.activeElement && !$("form-ajustes").contains(document.activeElement)) {
      $("aj-tag").value = String(E.ajustes.tag_valor_minimo).replace(".", ","); $("aj-comissao").value = String(E.ajustes.comissao_padrao).replace(".", ",");
      $("aj-baixo").value = E.ajustes.estoque_baixo; $("aj-fabrica").value = E.ajustes.telefone_fabrica;
    }
    $("conta-info").textContent = E.email + " · " + (N.ehAdmin() ? "administradora (vê e altera tudo)" : "vendedora (vende, vê estoque e tags)");
  }
  const salvarFormato = () => { N.gravar("life-formato-texto-v1", { modelo: $("fmt-modelo").value, item: $("fmt-item").value }); renderPrevia(); N.atualizarResumo(); };
  $("fmt-modelo").addEventListener("input", salvarFormato);
  $("fmt-item").addEventListener("input", salvarFormato);
  $("fmt-padrao").addEventListener("click", () => { N.apagar("life-formato-texto-v1"); $("fmt-modelo").value = V.MODELO_TEXTO; $("fmt-item").value = V.MODELO_ITEM; renderPrevia(); N.atualizarResumo(); });

  function renderClientes() {
    const q = V.norm($("c-busca").value);
    const lista = E.clientes.filter((c) => !q || V.norm([c.nome, c.telefone, c.documento, c.email, c.cidade].join(" ")).includes(q) || V.soDigitos(c.telefone).includes(V.soDigitos(q) || "x"));
    $("c-resumo").textContent = lista.length + (lista.length === 1 ? " cliente" : " clientes");
    $("lista-clientes-tela").innerHTML = lista.slice(0, 80).map((c) => `<li><button type="button" class="cliente-card" data-id="${esc(c.id)}"><strong>${esc(c.nome)}</strong><span>${esc([c.telefone, c.cidade ? c.cidade + (c.uf ? "/" + c.uf : "") : ""].filter(Boolean).join(" · ") || "sem dados de contato")}</span></button></li>`).join("") + (lista.length > 80 ? '<li class="vazio">Mostrando 80. Use a busca para achar as outras.</li>' : "");
  }
  $("c-busca").addEventListener("input", renderClientes);
  let clienteEm = null;
  $("lista-clientes-tela").addEventListener("click", (e) => {
    const b = e.target.closest(".cliente-card");
    if (!b) return;
    clienteEm = E.clientes.find((c) => c.id === b.dataset.id);
    if (!clienteEm) return;
    ["nome", ...CAMPOS].forEach((k) => { $("dcl-" + k).value = clienteEm[k] || ""; });
    $("dcl-obs").value = clienteEm.observacoes || "";
    $("dcl-erro").textContent = "";
    $("dlg-cliente").showModal();
  });
  $("form-cliente").addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = {};
    ["nome", ...CAMPOS].forEach((k) => { dados[k] = $("dcl-" + k).value.trim() || null; });
    if (!dados.nome) { $("dcl-erro").textContent = "O nome não pode ficar vazio."; return; }
    if (dados.uf) dados.uf = dados.uf.toUpperCase();
    dados.observacoes = $("dcl-obs").value.trim() || null;
    const { error } = await sb.from("clientes").update(dados).eq("id", clienteEm.id);
    if (error) { $("dcl-erro").textContent = /duplicate|unique/i.test(error.message) ? "Já existe outra cliente com esse nome." : N.traduzirErro(error); return; }
    $("dlg-cliente").close();
    await N.recarregar(["clientes", "vendas"]); N.renderTudo(); N.aviso("Cliente salva.");
  });
  $("c-exportar").addEventListener("click", () => {
    const linhas = [["Nome", "CPF/CNPJ", "E-mail", "Telefone", "CEP", "Endereço", "Número", "Complemento", "Bairro", "Cidade", "UF", "Observações"]]
      .concat(E.clientes.map((c) => [c.nome, c.documento || "", c.email || "", c.telefone || "", c.cep || "", c.rua || "", c.numero || "", c.complemento || "", c.bairro || "", c.cidade || "", c.uf || "", c.observacoes || ""]));
    N.baixarArquivo(V.paraCsv(linhas), "clientes-life-atelie-" + N.hoje() + ".csv", "text/csv;charset=utf-8");
  });
  $("form-ajustes").addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = { tag_valor_minimo: N.num($("aj-tag").value), comissao_padrao: N.num($("aj-comissao").value), estoque_baixo: parseInt($("aj-baixo").value, 10), telefone_fabrica: $("aj-fabrica").value.replace(/\D/g, "") || null };
    if (dados.tag_valor_minimo == null || dados.comissao_padrao == null || isNaN(dados.estoque_baixo)) { $("aj-msg").textContent = "Confira os números."; return; }
    const { error } = await sb.from("ajustes").update(dados).eq("id", 1);
    if (error) { $("aj-msg").textContent = N.traduzirErro(error); return; }
    E.ajustes = Object.assign(E.ajustes, { tag_valor_minimo: dados.tag_valor_minimo, comissao_padrao: dados.comissao_padrao, estoque_baixo: dados.estoque_baixo, telefone_fabrica: dados.telefone_fabrica || "" });
    N.renderTudo();
    $("aj-msg").textContent = "Ajustes salvos.";
  });

  window.LifeVendasTelas = { renderLive, renderVendas, renderTags, renderEstoque, renderMais, carregarMov, atualizarEmblemas, aplicarAtalho };
  aplicarAtalho("hoje");
})();
