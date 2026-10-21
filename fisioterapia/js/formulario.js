/*
  Motor dos formulários em etapas (cadastro, anamnese e atendimento).
  - Salva automaticamente após cada alteração (indicador "Salvando…" / "Salvo às hh:mm" / falha).
  - Botão "Salvar rascunho" sempre visível.
  - Navegar entre etapas nunca apaga dados; a conclusão mostra as pendências sem bloquear o preenchimento.
*/
(function (LB) {
  "use strict";
  const U = LB.util, UI = LB.ui, E = LB.esquemas, R = LB.registros;
  const { h } = U;

  const TIPO_REGISTRO = { cadastro: "paciente", anamnese: "anamnese", atendimento: "atendimento" };

  // ---------- Campos ----------
  function marcaObrig(c) {
    if (c.tipo === "aviso") return null;
    return c.obrig ? h("span", { class: "marca-obrig" }, "Obrigatório") : h("span", { class: "marca-opc" }, "Opcional");
  }

  const MASCARAS = { telefone: U.mascaraTelefone, cpf: U.mascaraCPF, cep: U.mascaraCEP, data: U.mascaraData, hora: U.mascaraHora };
  const INPUTMODE = { telefone: "tel", cpf: "numeric", cep: "numeric", data: "numeric", hora: "numeric", numero: "numeric", email: "email" };
  const PLACEHOLDER = { data: "dd/mm/aaaa", hora: "hh:mm", telefone: "(31) 98765-4321", cpf: "000.000.000-00", cep: "00000-000" };

  function renderCampo(c, valor, mudar) {
    const id = "f-" + c.id;
    const idAjuda = id + "-ajuda", idErro = id + "-erro";
    const erro = h("p", { class: "campo-erro", id: idErro, hidden: true });
    const ajuda = c.ajuda ? h("p", { class: "campo-ajuda", id: idAjuda }, c.ajuda) : null;
    const descritoPor = [c.ajuda ? idAjuda : null, idErro].filter(Boolean).join(" ");
    let wrap;

    function mostrarErro(texto) {
      erro.textContent = texto ? texto : "";
      erro.hidden = !texto;
      const alvo = wrap.querySelector("input, textarea");
      if (alvo && c.tipo !== "unica" && c.tipo !== "multipla" && c.tipo !== "escala") alvo.setAttribute("aria-invalid", texto ? "true" : "false");
    }

    if (c.tipo === "aviso") {
      wrap = h("div", { class: "campo campo-inteiro" }, UI.aviso({ tipo: "info", titulo: "Para lembrar", texto: c.texto, semAnuncio: true }));
      return wrap;
    }

    if (["texto", "longo", "data", "hora", "telefone", "email", "cpf", "cep", "numero"].includes(c.tipo)) {
      const longo = c.tipo === "longo";
      const input = h(longo ? "textarea" : "input", {
        id, class: "entrada" + (longo ? " entrada-longa" : ""), type: longo ? null : (c.tipo === "email" ? "email" : "text"),
        inputmode: INPUTMODE[c.tipo] || null, autocomplete: "off", spellcheck: longo ? "true" : null,
        placeholder: c.placeholder || PLACEHOLDER[c.tipo] || null, rows: longo ? 3 : null,
        maxlength: c.tipo === "data" ? 10 : c.tipo === "hora" ? 5 : null,
        "aria-describedby": descritoPor, "aria-required": c.obrig ? "true" : null
      });
      input.value = c.tipo === "data" && U.ehISO(valor) ? U.isoParaBR(valor) : (valor == null ? "" : String(valor));
      const ajustarAltura = () => { if (longo) { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight + 2, 480) + "px"; } };
      input.addEventListener("input", () => {
        const m = MASCARAS[c.tipo];
        if (m) {
          const antes = input.value, novo = m(antes);
          if (novo !== antes) input.value = novo;
        }
        if (c.tipo === "numero") input.value = input.value.replace(/\D/g, "").slice(0, 4);
        ajustarAltura();
        const v = c.tipo === "data" ? (U.brParaISO(input.value) || input.value) : input.value;
        mudar(v);
        if (!erro.hidden && !E.erroDeFormato(c, v)) mostrarErro("");
      });
      input.addEventListener("change", () => {
        const v = c.tipo === "data" ? (U.brParaISO(input.value) || input.value) : input.value;
        mostrarErro(E.erroDeFormato(c, v));
      });
      wrap = h("div", { class: "campo" + (c.larg === "meia" ? " campo-meia" : " campo-inteiro"), "data-campo": c.id },
        h("label", { for: id, class: "rotulo" }, h("span", null, c.rotulo), marcaObrig(c)),
        ajuda, input, erro);
      if (longo) requestAnimationFrame(ajustarAltura);
      wrap.mostrarErro = mostrarErro;
      if (!U.vazio(valor)) { const e = E.erroDeFormato(c, valor); if (e) requestAnimationFrame(() => mostrarErro(e)); }
      return wrap;
    }

    if (c.tipo === "unica" || c.tipo === "escala") {
      const opcoes = c.tipo === "escala" ? Array.from({ length: 11 }, (_, i) => String(i)) : c.opcoes;
      const nome = id;
      const caixas = opcoes.map(op => {
        const inp = h("input", { type: "radio", name: nome, value: op, checked: String(valor) === op || null });
        inp.addEventListener("change", () => { if (inp.checked) mudar(c.tipo === "escala" ? Number(op) : op); });
        return h("label", { class: "opcao" + (c.tipo === "escala" ? " opcao-escala" : "") }, inp, h("span", null, op));
      });
      const limpar = h("button", { type: "button", class: "botao-link" }, "Limpar resposta");
      limpar.addEventListener("click", () => {
        wrap.querySelectorAll("input").forEach(i => { i.checked = false; });
        mudar("");
        wrap.querySelector("input").focus();
      });
      const legendaEscala = c.tipo === "escala" ? h("div", { class: "escala-legenda", "aria-hidden": "true" },
        h("span", null, "0 · sem dor"), h("span", null, "5 · moderada"), h("span", null, "10 · pior dor")) : null;
      wrap = h("fieldset", { class: "campo campo-inteiro grupo-opcoes" + (c.tipo === "escala" ? " grupo-escala" : ""), "data-campo": c.id, "aria-describedby": descritoPor },
        h("legend", { class: "rotulo" }, h("span", null, c.rotulo), marcaObrig(c)),
        ajuda,
        h("div", { class: "opcoes" + (c.tipo === "escala" ? " opcoes-escala" : "") }, caixas),
        legendaEscala,
        h("div", { class: "campo-rodape" }, limpar),
        erro);
      wrap.mostrarErro = mostrarErro;
      return wrap;
    }

    if (c.tipo === "multipla") {
      let atual = Array.isArray(valor) ? valor.slice() : [];
      const opcoes = (c.opcoes || []).slice();
      // Valores antigos que saíram da lista continuam visíveis e marcados.
      for (const v of atual) if (!opcoes.includes(v)) opcoes.push(v);
      const inputs = [];
      const caixas = opcoes.map(op => {
        const inp = h("input", { type: "checkbox", value: op, checked: atual.includes(op) || null });
        inputs.push(inp);
        inp.addEventListener("change", () => {
          if (inp.checked) {
            if (c.exclusiva && op === c.exclusiva) { atual = [op]; inputs.forEach(i => { i.checked = i === inp; }); }
            else {
              atual = atual.filter(v => v !== c.exclusiva).concat(op);
              inputs.forEach(i => { if (i.value === c.exclusiva) i.checked = false; });
            }
          } else atual = atual.filter(v => v !== op);
          mudar(atual.slice());
        });
        return h("label", { class: "opcao opcao-caixa" + (op === c.exclusiva ? " opcao-exclusiva" : "") }, inp, h("span", null, op));
      });
      wrap = h("fieldset", { class: "campo campo-inteiro grupo-opcoes", "data-campo": c.id, "aria-describedby": descritoPor },
        h("legend", { class: "rotulo" }, h("span", null, c.rotulo), marcaObrig(c)),
        ajuda,
        h("div", { class: "opcoes opcoes-multiplas" }, caixas),
        erro);
      wrap.mostrarErro = mostrarErro;
      return wrap;
    }

    if (c.tipo === "consentimento") {
      const v = Object.assign({ estado: "", data: "", forma: "" }, valor || {});
      const enviar = () => mudar(U.vazio([v.estado, v.data, v.forma]) ? "" : Object.assign({}, v, { texto: c.texto }));
      const campoData = h("input", { id: id + "-data", class: "entrada", type: "text", inputmode: "numeric", placeholder: "dd/mm/aaaa", maxlength: 10, autocomplete: "off" });
      campoData.value = v.data ? U.isoParaBR(v.data) : "";
      const erroData = h("p", { class: "campo-erro", hidden: true, id: id + "-data-erro" });
      campoData.setAttribute("aria-describedby", id + "-data-erro");
      campoData.addEventListener("input", () => {
        campoData.value = U.mascaraData(campoData.value);
        v.data = U.brParaISO(campoData.value) || campoData.value;
        enviar();
      });
      campoData.addEventListener("change", () => {
        const ok = !campoData.value || U.brParaISO(campoData.value);
        erroData.textContent = ok ? "" : "Data inválida. Use dia/mês/ano.";
        erroData.hidden = !!ok;
      });
      const radios = (nome, opcoes, chave, aoMudar) => h("div", { class: "opcoes" }, opcoes.map(op => {
        const inp = h("input", { type: "radio", name: nome, value: op.valor, checked: v[chave] === op.valor || null });
        inp.addEventListener("change", () => { if (inp.checked) { v[chave] = op.valor; if (aoMudar) aoMudar(op.valor); enviar(); } });
        return h("label", { class: "opcao" }, inp, h("span", null, op.texto));
      }));
      const estado = radios(id + "-estado", [
        { valor: "Aceito", texto: "Aceito" }, { valor: "Não aceito", texto: "Não aceito" }, { valor: "", texto: "Ainda não perguntado" }
      ], "estado", novo => {
        if (novo && !v.data) { v.data = U.hojeISO(); campoData.value = U.isoParaBR(v.data); }
      });
      const forma = radios(id + "-forma", [
        { valor: "Verbal", texto: "Verbal" }, { valor: "Assinado em papel", texto: "Assinado em papel" }, { valor: "Digital", texto: "Digital" }
      ], "forma");
      wrap = h("fieldset", { class: "campo campo-inteiro consentimento", "data-campo": c.id },
        h("legend", { class: "rotulo" }, h("span", null, c.rotulo), marcaObrig(c)),
        h("blockquote", { class: "consentimento-texto" }, c.texto),
        h("fieldset", { class: "sub-grupo" }, h("legend", { class: "rotulo-menor" }, "Resposta da pessoa"), estado),
        h("div", { class: "consentimento-linha" },
          h("div", { class: "campo campo-meia" }, h("label", { class: "rotulo-menor", for: id + "-data" }, "Data da resposta"), campoData, erroData),
          h("fieldset", { class: "sub-grupo" }, h("legend", { class: "rotulo-menor" }, "Como foi registrado"), forma)));
      wrap.mostrarErro = () => {};
      return wrap;
    }

    return h("p", null, "Tipo de campo desconhecido: " + c.tipo);
  }

  // ---------- Formulário em etapas ----------
  function abrir(destino, o) {
    const cfg = LB.config.atual();
    const ficha = E.FICHAS[o.ficha];
    const etapas = E.etapasDe(o.ficha, cfg);
    const totalEtapas = etapas.length + 1; // + revisão
    let registro = o.registro || null;
    const modoCorrecao = !!(registro && registro.status === "concluido");
    let dados = U.copia(registro ? R.dadosEmEdicao(registro) : (o.dadosIniciais || {})) || {};
    let indice = 0;
    if (o.etapaInicial != null) {
      const i = o.etapaInicial === "revisao" ? etapas.length : etapas.findIndex(e => e.id === o.etapaInicial);
      if (i >= 0) indice = i;
    }
    const visitadas = new Set();

    // Estado do salvamento
    let alterado = false, salvando = null, falhou = false, ultimoSalvo = registro ? (registro.atualizadoEm || null) : null;
    const indicador = h("p", { class: "status-salvamento", role: "status", "aria-live": "polite" });
    const espacoMsg = h("div", { class: "form-mensagem" });

    function mostrarIndicador() {
      U.limpar(indicador);
      indicador.className = "status-salvamento";
      if (falhou) {
        indicador.classList.add("falhou");
        const tentar = h("button", { type: "button", class: "botao-link" }, "Tentar de novo");
        tentar.addEventListener("click", () => salvarAgora());
        U.adicionar(indicador, [UI.icone("erro"), h("span", null, "Falha ao salvar. O que você digitou continua na tela."), tentar]);
      } else if (salvando || salvarDepois.pendente()) {
        U.adicionar(indicador, [UI.icone("relogio"), h("span", null, "Salvando…")]);
      } else if (ultimoSalvo) {
        U.adicionar(indicador, [UI.icone("check"), h("span", null, (registro && registro.status === "concluido" && registro.edicao ? "Correção salva às " : "Salvo às ") + U.horaDe(ultimoSalvo))]);
      } else {
        U.adicionar(indicador, [UI.icone("info"), h("span", null, "Ainda não salvo. O salvamento começa ao preencher o primeiro campo.")]);
      }
    }

    async function executarSalvamento() {
      if (!alterado) return registro;
      alterado = false;
      const copiaDados = U.copia(dados);
      try {
        if (!registro) {
          registro = await R.criar(TIPO_REGISTRO[o.ficha], o.pacienteId, copiaDados);
          if (o.aoCriar) o.aoCriar(registro);
        } else {
          registro = await R.salvarRascunho(registro, copiaDados);
        }
        falhou = false;
        ultimoSalvo = Date.now();
      } catch (e) {
        console.error(e);
        alterado = true;
        falhou = true;
      }
      return registro;
    }

    function salvarAgora() {
      salvarDepois.cancelar();
      const anterior = salvando || Promise.resolve();
      const p = anterior.then(executarSalvamento).then(r => {
        if (salvando === p) salvando = null;
        mostrarIndicador();
        if (alterado && !falhou) salvarDepois();
        return r;
      });
      salvando = p;
      mostrarIndicador();
      return p;
    }
    const salvarDepois = U.debounce(salvarAgora, 700);

    function mudou(campoId, valor) {
      dados[campoId] = valor;
      alterado = true;
      falhou = false;
      U.limpar(espacoMsg);
      salvarDepois();
      mostrarIndicador();
      atualizarCondicionais();
      atualizarListaEtapas();
    }

    // ---------- Estrutura da tela ----------
    const tituloPagina = modoCorrecao ? (o.ficha === "cadastro" ? "Editar cadastro" : "Corrigir " + ficha.nomeCurto) : ficha.titulo;
    const cabecalho = h("header", { class: "form-cabecalho" },
      o.contexto ? h("p", { class: "sobretitulo" }, o.contexto) : null,
      h("h1", { class: "titulo-pagina", tabindex: "-1" }, tituloPagina));
    if (modoCorrecao) {
      const politica = cfg.politicaCorrecao === "guardar"
        ? "A versão atual fica guardada no histórico do registro."
        : "O registro mostrará a data da correção.";
      cabecalho.append(UI.aviso({
        tipo: "info", titulo: o.ficha === "cadastro" ? "Editando um cadastro concluído" : "Corrigindo um registro concluído",
        texto: "As mudanças são salvas automaticamente como rascunho e só substituem o registro quando você tocar em “" + (o.ficha === "cadastro" ? "Salvar alterações" : "Salvar correção") + "”, na última etapa. " + politica,
        semAnuncio: true
      }));
    }

    const listaDesktop = h("ol", { class: "lista-etapas" });
    const listaMovel = h("ol", { class: "lista-etapas" });
    const resumoMovel = h("summary", null);
    const navDesktop = h("nav", { class: "form-etapas", "aria-label": "Etapas da ficha" }, h("p", { class: "form-etapas-titulo" }, "Etapas"), listaDesktop);
    const navMovel = h("details", { class: "form-etapas-movel" }, resumoMovel, h("nav", { "aria-label": "Etapas da ficha" }, listaMovel));
    const conteudo = h("div", { class: "form-conteudo" });
    const botoesBarra = h("div", { class: "form-barra-botoes" });
    const barra = h("div", { class: "form-barra" }, indicador, botoesBarra);

    const raiz = h("div", { class: "form-tela" }, cabecalho, navMovel,
      h("div", { class: "form-layout" }, navDesktop, h("div", { class: "form-principal" }, conteudo, espacoMsg, barra)));
    U.limpar(destino).append(raiz);

    function estadoEtapa(etapa) {
      const campos = etapa.campos.filter(c => c.tipo !== "aviso" && E.visivel(c, dados));
      const temValor = campos.some(c => !U.vazio(dados[c.id]));
      const falta = campos.some(c => (c.obrig && U.vazio(dados[c.id])) || E.erroDeFormato(c, dados[c.id]));
      if (falta && (visitadas.has(etapa.id) || temValor)) return "falta";
      if (temValor) return "ok";
      return "";
    }

    function itemEtapa(rotulo, i, estado) {
      const atual = i === indice;
      const b = h("button", { type: "button", class: "etapa-botao", "aria-current": atual ? "step" : null },
        h("span", { class: "etapa-numero", "aria-hidden": "true" }, String(i + 1)),
        h("span", { class: "etapa-nome" }, rotulo),
        estado === "ok" ? h("span", { class: "etapa-estado ok" }, UI.icone("check"), h("span", null, "Preenchida")) :
          estado === "falta" ? h("span", { class: "etapa-estado falta" }, UI.icone("alerta"), h("span", null, "Falta preencher")) : null);
      b.addEventListener("click", () => { navMovel.open = false; irPara(i); });
      return h("li", null, b);
    }

    function atualizarListaEtapas() {
      for (const lista of [listaDesktop, listaMovel]) {
        U.limpar(lista);
        etapas.forEach((e, i) => lista.append(itemEtapa(e.titulo, i, estadoEtapa(e))));
        lista.append(itemEtapa("Revisão e conclusão", etapas.length, ""));
      }
      resumoMovel.textContent = "Etapa " + (indice + 1) + " de " + totalEtapas + " · ver todas as etapas";
    }

    function atualizarCondicionais() {
      conteudo.querySelectorAll("[data-se-campo]").forEach(el => {
        const mostrar = dados[el.dataset.seCampo] === el.dataset.seValor;
        el.hidden = !mostrar;
      });
    }

    function progresso() {
      const pct = Math.round(((indice + 1) / totalEtapas) * 100);
      const titulo = indice < etapas.length ? etapas[indice].titulo : "Revisão e conclusão";
      return h("div", { class: "progresso" },
        h("p", { class: "progresso-texto" }, "Etapa " + (indice + 1) + " de " + totalEtapas),
        h("div", { class: "progresso-barra", "aria-hidden": "true" }, h("span", { style: "width:" + pct + "%" })),
        h("h2", { class: "etapa-titulo", tabindex: "-1" }, titulo));
    }

    function renderEtapa() {
      U.limpar(conteudo);
      const etapa = etapas[indice];
      visitadas.add(etapa.id);
      conteudo.append(progresso());
      if (etapa.descricao) conteudo.append(h("p", { class: "etapa-descricao" }, etapa.descricao));
      if (indice === 0 && o.painelContexto) conteudo.append(o.painelContexto);
      const grade = h("div", { class: "grade-campos" });
      for (const c of etapa.campos) {
        const el = renderCampo(c, dados[c.id], v => mudou(c.id, v));
        if (c.se) { el.dataset.seCampo = c.se.campo; el.dataset.seValor = c.se.valor; }
        grade.append(el);
      }
      conteudo.append(grade);
      atualizarCondicionais();
    }

    function renderRevisao() {
      U.limpar(conteudo);
      conteudo.append(progresso());
      const pend = E.pendencias(o.ficha, dados, cfg);
      if (pend.length) {
        conteudo.append(UI.aviso({
          tipo: "alerta", titulo: pend.length === 1 ? "Falta 1 item para concluir" : "Faltam " + pend.length + " itens para concluir",
          texto: "O rascunho continua salvo. Você pode completar agora ou depois.",
          conteudo: h("ul", { class: "lista-pendencias" }, pend.map(p => {
            const b = h("button", { type: "button", class: "botao-link" }, p.mensagem + " — ir para “" + p.etapa.titulo + "”");
            b.addEventListener("click", () => irPara(p.indice, p.campo.id));
            return h("li", null, b);
          })),
          semAnuncio: true
        }));
      } else {
        conteudo.append(UI.aviso({ tipo: "sucesso", titulo: "Tudo pronto para concluir", texto: "Confira o resumo abaixo. Para mudar algo, use as etapas.", semAnuncio: true }));
      }
      const secoes = E.secoesPreenchidas(o.ficha, dados, cfg);
      const resumo = h("div", { class: "revisao" });
      if (!secoes.length) resumo.append(UI.vazio({ texto: "Nenhum campo preenchido ainda. Volte às etapas para começar." }));
      secoes.forEach(s => {
        const iEtapa = etapas.findIndex(e => e.titulo === s.titulo);
        const editar = iEtapa >= 0 ? h("button", { type: "button", class: "botao-link" }, "Editar esta parte") : null;
        if (editar) editar.addEventListener("click", () => irPara(iEtapa));
        resumo.append(h("section", { class: "revisao-secao" },
          h("div", { class: "revisao-topo" }, h("h3", null, s.titulo), editar),
          h("dl", { class: "lista-dados" }, s.itens.map(it => [h("dt", null, it.rotulo), h("dd", null, it.valor)]))));
      });
      conteudo.append(resumo);
      if (modoCorrecao) {
        const motivo = UI.campoSimples({ rotulo: "Motivo da correção", tipo: "longo", opcional: true, linhas: 2, ajuda: "Ex.: corrigir data digitada errada. Fica registrado no histórico." });
        conteudo.append(motivo);
        conteudo.motivo = motivo.input;
      }
    }

    function renderBarra() {
      U.limpar(botoesBarra);
      const ultima = indice === etapas.length;
      const anterior = UI.botao({ texto: "Etapa anterior", icone: "voltar", variante: "secundario", desabilitado: indice === 0, onClick: () => irPara(indice - 1) });
      const rascunho = UI.botao({ texto: "Salvar rascunho", icone: "salvar", variante: "secundario", onClick: salvarRascunhoManual });
      let principal;
      if (!ultima) {
        principal = UI.botao({ texto: indice === etapas.length - 1 ? "Revisar e concluir" : "Próxima etapa", icone: "avancar", variante: "primario", classe: "icone-depois", onClick: () => irPara(indice + 1) });
        botoesBarra.append(anterior, rascunho, principal);
      } else if (modoCorrecao) {
        const descartar = UI.botao({ texto: o.ficha === "cadastro" ? "Descartar alterações" : "Descartar correção", icone: "lixeira", variante: "perigo", onClick: descartarCorrecao });
        principal = UI.botao({ texto: o.ficha === "cadastro" ? "Salvar alterações" : "Salvar correção", icone: "check", variante: "primario", onClick: concluirCorrecao });
        botoesBarra.append(anterior, descartar, principal);
      } else {
        principal = UI.botao({ texto: ficha.concluir, icone: "check", variante: "primario", onClick: concluir });
        botoesBarra.append(anterior, rascunho, principal);
      }
    }

    function irPara(i, campoId) {
      if (i < 0 || i > etapas.length) return;
      indice = i;
      U.limpar(espacoMsg);
      if (indice < etapas.length) renderEtapa(); else renderRevisao();
      renderBarra();
      atualizarListaEtapas();
      if (o.aoMudarEtapa) o.aoMudarEtapa(indice < etapas.length ? etapas[indice].id : "revisao");
      raiz.scrollIntoView({ block: "start" });
      window.scrollTo(0, 0);
      if (campoId) {
        const alvo = conteudo.querySelector('[data-campo="' + campoId + '"] input, [data-campo="' + campoId + '"] textarea');
        if (alvo) { alvo.focus(); return; }
      }
      const t = conteudo.querySelector(".etapa-titulo");
      if (t) t.focus();
    }

    async function salvarRascunhoManual() {
      if (!registro && !alterado) {
        UI.mensagem(espacoMsg, { tipo: "info", titulo: "Nada para salvar ainda", texto: "Preencha algum campo. Depois disso, tudo é salvo automaticamente." });
        return;
      }
      alterado = true;
      await salvarAgora();
      if (falhou) {
        UI.mensagem(espacoMsg, { tipo: "erro", texto: "O rascunho não foi salvo. O que você preencheu continua na tela. Tente de novo; se continuar, exporte uma cópia de segurança em Configurações.", focar: true });
        return;
      }
      const voltar = o.rotaPerfil ? UI.botao({ texto: "Ir para o perfil do paciente", variante: "discreto", href: o.rotaPerfil() }) : null;
      UI.mensagem(espacoMsg, {
        tipo: "sucesso", titulo: "Rascunho salvo às " + U.horaDe(ultimoSalvo),
        texto: "Você pode sair e continuar depois. O rascunho fica no perfil do paciente.",
        acoes: voltar ? [voltar] : null
      });
    }

    async function concluir() {
      if (!registro) alterado = true; // formulário novo só com valores padrão: cria o registro antes de concluir
      await salvarAgora();
      const pend = E.pendencias(o.ficha, dados, cfg);
      if (pend.length) {
        renderRevisao();
        UI.mensagem(espacoMsg, { tipo: "alerta", titulo: "Ainda não foi possível concluir", texto: "Complete os itens da lista acima. O rascunho está salvo.", focar: true });
        return;
      }
      if (falhou || !registro) {
        UI.mensagem(espacoMsg, { tipo: "erro", texto: "Não foi possível salvar agora. Seus dados continuam na tela. Tente de novo.", focar: true });
        return;
      }
      try {
        registro = await R.concluir(registro, U.copia(dados));
        alterado = false;
        if (o.aoConcluir) o.aoConcluir(registro);
      } catch (e) {
        console.error(e);
        UI.mensagem(espacoMsg, { tipo: "erro", texto: "Não foi possível concluir agora. Seus dados continuam na tela. Tente de novo.", focar: true });
      }
    }

    async function concluirCorrecao() {
      await salvarAgora();
      const pend = E.pendencias(o.ficha, dados, cfg);
      if (pend.length) {
        renderRevisao();
        UI.mensagem(espacoMsg, { tipo: "alerta", titulo: "Ainda não foi possível salvar", texto: "Complete os itens da lista acima. A correção continua salva como rascunho.", focar: true });
        return;
      }
      if (falhou) {
        UI.mensagem(espacoMsg, { tipo: "erro", texto: "Não foi possível salvar agora. Tente de novo.", focar: true });
        return;
      }
      try {
        const motivo = conteudo.motivo ? conteudo.motivo.value : "";
        if (!registro.edicao) registro = await R.salvarRascunho(registro, U.copia(dados));
        registro = await R.salvarCorrecao(registro, motivo);
        if (o.aoConcluir) o.aoConcluir(registro, true);
      } catch (e) {
        console.error(e);
        UI.mensagem(espacoMsg, { tipo: "erro", texto: "Não foi possível salvar a correção. Seus dados continuam na tela. Tente de novo.", focar: true });
      }
    }

    async function descartarCorrecao() {
      const ok = await UI.confirmar({
        titulo: o.ficha === "cadastro" ? "Descartar as alterações?" : "Descartar a correção?",
        texto: "As mudanças feitas nesta edição serão apagadas.",
        efeito: "O registro volta a ficar exatamente como estava antes desta edição. Nada mais é apagado.",
        confirmarTexto: "Descartar mudanças", perigo: true
      });
      if (!ok) return;
      salvarDepois.cancelar();
      await (salvando || Promise.resolve());
      alterado = false;
      registro = await R.descartarCorrecao(LB.banco.obter(registro.id) || registro);
      if (o.aoDescartar) o.aoDescartar(registro);
    }

    // Chamado pelo roteador antes de sair da tela: garante que nada fique sem salvar.
    async function antesDeSair() {
      if (alterado || salvando) await salvarAgora();
      if (falhou) {
        return UI.confirmar({
          titulo: "As últimas alterações não foram salvas",
          texto: "Houve uma falha ao salvar. Se sair agora, o que foi digitado depois do último salvamento será perdido.",
          confirmarTexto: "Sair mesmo assim", cancelarTexto: "Ficar e tentar de novo", perigo: true
        });
      }
      return true;
    }
    const temPendente = () => alterado || !!salvando || falhou;

    mostrarIndicador();
    irPara(indice);
    const t = cabecalho.querySelector(".titulo-pagina");
    if (t && o.etapaInicial == null) t.focus();

    return { antesDeSair, temPendente, salvarAgora };
  }

  LB.formulario = { abrir, renderCampo, TIPO_REGISTRO };
})(window.LB = window.LB || {});
