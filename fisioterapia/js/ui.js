/* Componentes reutilizáveis: ícones, botões, avisos, etiquetas, cartões, estados vazios, diálogos e campos simples. */
(function (LB) {
  "use strict";
  const { h } = LB.util;

  const ICONES = {
    painel: '<path d="M3.5 11 12 4l8.5 7v8.5a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z"/>',
    pacientes: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14.6c2.4.3 4.3 2 5 4.6"/>',
    atendimento: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M12 10v6M9 13h6"/>',
    mais: '<path d="M12 5v14M5 12h14"/>',
    config: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    cadeado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    busca: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
    alerta: '<path d="M12 4 21 20H3z"/><path d="M12 10v4.5M12 17.5v.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
    erro: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
    documento: '<path d="M6.5 3h8l4.5 4.5V21h-12.5z"/><path d="M14 3v5h5M9.5 13h6M9.5 17h6"/>',
    download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>',
    upload: '<path d="M12 16V5M7.5 9.5 12 5l4.5 4.5M5 19.5h14"/>',
    lapis: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    lixeira: '<path d="M4 7h16M9.5 7V4h5v3M6 7l1 13.5h10L18 7"/>',
    calendario: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    voltar: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    avancar: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    impressora: '<path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="8" rx="1.5"/><path d="M7 14h10v6.5H7z"/>',
    escudo: '<path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    salvar: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>',
    olho: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    pessoa: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6"/>',
    linha: '<path d="M6 4v16"/><circle cx="6" cy="7" r="2"/><circle cx="6" cy="17" r="2"/><path d="M10 7h10M10 17h10"/>',
    retorno: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/>',
    copia: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'
  };

  function icone(nome, classe) {
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("focusable", "false");
    s.setAttribute("class", "icone" + (classe ? " " + classe : ""));
    s.innerHTML = ICONES[nome] || "";
    return s;
  }

  // variante: primario | secundario | perigo | discreto
  function botao(o) {
    const b = h(o.href ? "a" : "button", Object.assign({
      class: "botao botao-" + (o.variante || "secundario") + (o.grande ? " botao-grande" : "") + (o.classe ? " " + o.classe : ""),
      type: o.href ? null : (o.tipo || "button"),
      href: o.href || null,
      onclick: o.onClick || null,
      disabled: o.desabilitado || null,
      "aria-describedby": o.descritoPor || null
    }, o.atributos || {}), o.icone ? icone(o.icone) : null, h("span", null, o.texto));
    return b;
  }

  const ROTULOS_AVISO = { sucesso: "Pronto", erro: "Não foi possível", alerta: "Atenção", info: "Informação" };
  const ICONE_AVISO = { sucesso: "check", erro: "erro", alerta: "alerta", info: "info" };

  function aviso(o) {
    const tipo = o.tipo || "info";
    return h("div", { class: "aviso aviso-" + tipo + (o.classe ? " " + o.classe : ""), role: o.semAnuncio ? null : (tipo === "erro" ? "alert" : "status"), tabindex: o.focar ? "-1" : null },
      icone(ICONE_AVISO[tipo]),
      h("div", { class: "aviso-corpo" },
        h("p", { class: "aviso-titulo" }, o.titulo || ROTULOS_AVISO[tipo]),
        o.texto ? (Array.isArray(o.texto) ? o.texto.map(t => h("p", null, t)) : h("p", null, o.texto)) : null,
        o.conteudo || null,
        o.acoes && o.acoes.length ? h("div", { class: "aviso-acoes" }, o.acoes) : null
      )
    );
  }

  // Mostra uma mensagem num espaço fixo próximo da ação (substitui a anterior).
  function mensagem(espaco, o) {
    LB.util.limpar(espaco);
    if (!o) return null;
    const a = aviso(o);
    espaco.append(a);
    if (o.focar) a.focus();
    return a;
  }

  // tipo: rascunho | concluido | corrigido | ficticio | pendente | neutro | alta | pausa
  const ICONE_ETIQUETA = { rascunho: "lapis", concluido: "check", corrigido: "retorno", ficticio: "info", pendente: "alerta", alta: "check", pausa: "relogio", acompanhamento: "pessoa" };
  function etiqueta(texto, tipo) {
    return h("span", { class: "etiqueta etiqueta-" + (tipo || "neutro") }, ICONE_ETIQUETA[tipo] ? icone(ICONE_ETIQUETA[tipo]) : null, h("span", null, texto));
  }

  function cartao(o) {
    return h(o.tag || "section", { class: "cartao" + (o.classe ? " " + o.classe : ""), "aria-labelledby": o.idTitulo || null },
      o.titulo ? h("div", { class: "cartao-topo" },
        h(o.nivel || "h2", { class: "cartao-titulo", id: o.idTitulo || null }, o.icone ? icone(o.icone) : null, h("span", null, o.titulo)),
        o.extra || null) : null,
      o.subtitulo ? h("p", { class: "cartao-sub" }, o.subtitulo) : null,
      o.conteudo || null,
      o.acoes && o.acoes.length ? h("div", { class: "cartao-acoes" }, o.acoes) : null
    );
  }

  function vazio(o) {
    return h("div", { class: "vazio" },
      h("p", null, o.texto),
      o.acao || null
    );
  }

  // ---------- Diálogos ----------
  function dialogo(o) {
    const anterior = document.activeElement;
    const idTitulo = "dlg-" + LB.util.uid();
    const corpo = h("div", { class: "dialogo-corpo" });
    const acoes = h("div", { class: "dialogo-acoes" });
    const d = h("dialog", { class: "dialogo" + (o.largo ? " dialogo-largo" : ""), "aria-labelledby": idTitulo },
      h("h2", { id: idTitulo, class: "dialogo-titulo" }, o.titulo),
      corpo, acoes);
    if (o.conteudo) LB.util.adicionar(corpo, [o.conteudo]);
    if (o.acoes) LB.util.adicionar(acoes, [o.acoes]);
    document.body.append(d);
    let fechado = false;
    function fechar(valor) {
      if (fechado) return;
      fechado = true;
      d.close();
      d.remove();
      if (anterior && anterior.focus && document.contains(anterior)) anterior.focus();
      if (o.aoFechar) o.aoFechar(valor);
    }
    d.addEventListener("cancel", ev => { ev.preventDefault(); fechar(undefined); });
    d.showModal();
    const primeiro = d.querySelector("[data-foco-inicial]") || acoes.querySelector("button");
    if (primeiro) primeiro.focus();
    return { el: d, corpo, acoes, fechar };
  }

  // Confirmação: explica o efeito e pede um "sim" explícito. Resolve true/false.
  function confirmar(o) {
    return new Promise(resolver => {
      let resposta = false;
      const btnCancelar = botao({ texto: o.cancelarTexto || "Cancelar", variante: "secundario", atributos: { "data-foco-inicial": "" } });
      const btnOk = botao({ texto: o.confirmarTexto || "Confirmar", variante: o.perigo ? "perigo" : "primario", icone: o.icone || null });
      const conteudo = [h("p", null, o.texto)];
      if (o.efeito) conteudo.push(aviso({ tipo: o.perigo ? "alerta" : "info", titulo: "O que vai acontecer", texto: o.efeito, semAnuncio: true }));
      const dlg = dialogo({ titulo: o.titulo, conteudo, acoes: [btnCancelar, btnOk], aoFechar: () => resolver(resposta) });
      btnCancelar.addEventListener("click", () => dlg.fechar());
      btnOk.addEventListener("click", () => { resposta = true; dlg.fechar(); });
    });
  }

  // ---------- Campo simples (busca, senha, configurações) ----------
  function campoSimples(o) {
    const id = o.id || "c-" + LB.util.uid();
    const idAjuda = o.ajuda ? id + "-ajuda" : null;
    const idErro = id + "-erro";
    const input = h(o.tipo === "longo" ? "textarea" : "input", {
      id, name: o.nome || id, type: o.tipo === "longo" ? null : (o.tipo || "text"),
      class: "entrada", autocomplete: o.autocomplete || "off", inputmode: o.inputmode || null,
      placeholder: o.placeholder || null, required: o.obrig || null, rows: o.tipo === "longo" ? (o.linhas || 3) : null,
      "aria-describedby": [idAjuda, idErro].filter(Boolean).join(" "), maxlength: o.max || null
    });
    if (o.valor != null) input.value = o.valor;
    if (o.onInput) input.addEventListener("input", () => o.onInput(input.value, input));
    if (o.onChange) input.addEventListener("change", () => o.onChange(input.value, input));
    const erro = h("p", { class: "campo-erro", id: idErro, hidden: true });
    const el = h("div", { class: "campo" + (o.larg === "meia" ? " campo-meia" : "") },
      h("label", { for: id, class: "rotulo" }, h("span", null, o.rotulo), o.obrig ? h("span", { class: "marca-obrig" }, "Obrigatório") : (o.opcional ? h("span", { class: "marca-opc" }, "Opcional") : null)),
      o.ajuda ? h("p", { class: "campo-ajuda", id: idAjuda }, o.ajuda) : null,
      input, erro);
    el.input = input;
    el.mostrarErro = texto => {
      erro.textContent = texto || "";
      erro.hidden = !texto;
      input.setAttribute("aria-invalid", texto ? "true" : "false");
    };
    return el;
  }

  // Grupo de opções com botões de rádio (para filtros e configurações simples).
  function opcoesRadio(o) {
    const nome = o.nome || "r-" + LB.util.uid();
    const grupo = h("fieldset", { class: "grupo-opcoes" + (o.compacto ? " compacto" : "") },
      h("legend", { class: "rotulo" }, o.rotulo),
      o.ajuda ? h("p", { class: "campo-ajuda" }, o.ajuda) : null,
      h("div", { class: "opcoes" }, o.opcoes.map(op => {
        const valor = typeof op === "string" ? op : op.valor;
        const texto = typeof op === "string" ? op : op.texto;
        const inp = h("input", { type: "radio", name: nome, value: valor, checked: o.valor === valor || null });
        inp.addEventListener("change", () => { if (inp.checked && o.onChange) o.onChange(valor); });
        return h("label", { class: "opcao" }, inp, h("span", null, texto));
      })));
    return grupo;
  }

  // Seletor com rótulo visível.
  function seletor(o) {
    const id = o.id || "s-" + LB.util.uid();
    const sel = h("select", { id, class: "entrada" }, o.opcoes.map(op => h("option", { value: op.valor, selected: o.valor === op.valor || null }, op.texto)));
    if (o.onChange) sel.addEventListener("change", () => o.onChange(sel.value));
    const el = h("div", { class: "campo campo-filtro" }, h("label", { for: id, class: "rotulo" }, o.rotulo), sel);
    el.select = sel;
    return el;
  }

  LB.ui = { icone, botao, aviso, mensagem, etiqueta, cartao, vazio, dialogo, confirmar, campoSimples, opcoesRadio, seletor };
})(window.LB = window.LB || {});
