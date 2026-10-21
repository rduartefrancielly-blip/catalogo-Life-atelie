/* Painel inicial, lista de pacientes, escolha do paciente para novo atendimento e página "Sobre os dados". */
(function (LB) {
  "use strict";
  const U = LB.util, UI = LB.ui, R = LB.registros;
  const { h } = U;
  LB.telas = LB.telas || {};

  function cabecalhoPagina(titulo, subtitulo, acoes) {
    return h("header", { class: "cabecalho-pagina" },
      h("div", { class: "cabecalho-textos" },
        h("h1", { class: "titulo-pagina", tabindex: "-1" }, titulo),
        subtitulo ? h("p", { class: "cabecalho-sub" }, subtitulo) : null),
      acoes && acoes.length ? h("div", { class: "cabecalho-acoes" }, acoes) : null);
  }
  LB.telas.cabecalhoPagina = cabecalhoPagina;

  function linkPaciente(p, extra) {
    return h("a", { href: "#/paciente/" + p.id, class: "item-link" },
      h("span", { class: "item-nome" }, R.nomeExibicao(p)),
      p.demo ? UI.etiqueta("Fictício", "ficticio") : null,
      extra || null);
  }

  // ---------- Painel ----------
  LB.telas.painel = function (main) {
    LB.app.titulo("Painel");
    const cfg = LB.config.atual();
    const hora = new Date().getHours();
    const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
    const primeiroNome = ((cfg.profissional && cfg.profissional.nome) || "").trim().split(/\s+/)[0];
    const dataTexto = U.dataExtenso();
    main.append(cabecalhoPagina(saudacao + (primeiroNome ? ", " + primeiroNome : ""), dataTexto.charAt(0).toUpperCase() + dataTexto.slice(1)));

    main.append(h("div", { class: "acoes-principais" },
      UI.botao({ texto: "Novo atendimento", icone: "atendimento", variante: "primario", grande: true, href: "#/novo-atendimento" }),
      UI.botao({ texto: "Cadastrar paciente", icone: "mais", variante: "secundario", grande: true, href: "#/pacientes/novo" })));

    // Busca rápida
    const resultados = h("ul", { class: "lista-resultados", "aria-label": "Resultados da busca" });
    const contagem = h("p", { class: "texto-suave", "aria-live": "polite" });
    const busca = UI.campoSimples({ rotulo: "Buscar paciente", tipo: "search", ajuda: "Digite parte do nome ou do telefone.", onInput: v => mostrar(v) });
    function mostrar(v) {
      U.limpar(resultados);
      if (!v.trim()) { contagem.textContent = ""; return; }
      const achados = R.buscarPacientes(v);
      contagem.textContent = achados.length ? U.plural(achados.length, "paciente encontrado", "pacientes encontrados") : "Nenhum paciente encontrado.";
      for (const p of achados.slice(0, 8)) resultados.append(h("li", null, linkPaciente(p, h("span", { class: "item-detalhe" }, p.dados.telefone || ""))));
    }
    busca.input.addEventListener("keydown", ev => {
      if (ev.key === "Enter") { const a = resultados.querySelector("a"); if (a) location.hash = a.getAttribute("href"); }
    });
    main.append(UI.cartao({ titulo: "Busca rápida", icone: "busca", classe: "cartao-busca", conteudo: [busca, contagem, resultados] }));

    const hoje = U.hojeISO();
    const pacientes = R.pacientes();
    const grade = h("div", { class: "grade-cartoes" });

    // Hoje
    const itensHoje = [];
    for (const p of pacientes) {
      if (p.proximoRetorno && p.proximoRetorno.data === hoje) itensHoje.push({ hora: p.proximoRetorno.hora || "", p, texto: "Retorno marcado" });
    }
    for (const a of LB.banco.listar("atendimento", a => a.dados.data === hoje)) {
      const p = R.paciente(a.pacienteId);
      if (p) itensHoje.push({ hora: a.dados.hora || "", p, texto: a.status === "concluido" ? "Atendimento registrado" : "Atendimento em rascunho", rota: "#/paciente/" + p.id + "/atendimento/" + a.id + (a.status === "concluido" ? "" : "/editar") });
    }
    itensHoje.sort((a, b) => a.hora.localeCompare(b.hora));
    grade.append(UI.cartao({
      titulo: "Hoje", icone: "calendario",
      conteudo: itensHoje.length ? h("ul", { class: "lista-simples" }, itensHoje.map(i => h("li", null,
        h("a", { href: i.rota || "#/paciente/" + i.p.id, class: "item-link" },
          h("span", { class: "item-hora" }, i.hora || "Sem horário"),
          h("span", { class: "item-nome" }, R.nomeExibicao(i.p)),
          h("span", { class: "item-detalhe" }, i.texto))))) :
        UI.vazio({ texto: "Nenhum atendimento ou retorno marcado para hoje." })
    }));

    // Próximos retornos
    const limite = U.somarDias(hoje, 14);
    const proximos = pacientes.filter(p => p.proximoRetorno && p.proximoRetorno.data > hoje && p.proximoRetorno.data <= limite)
      .sort((a, b) => R.chaveData(a.proximoRetorno.data, a.proximoRetorno.hora).localeCompare(R.chaveData(b.proximoRetorno.data, b.proximoRetorno.hora)));
    grade.append(UI.cartao({
      titulo: "Próximos retornos", icone: "retorno", subtitulo: "Próximos 14 dias",
      conteudo: proximos.length ? h("ul", { class: "lista-simples" }, proximos.map(p => h("li", null,
        h("a", { href: "#/paciente/" + p.id, class: "item-link" },
          h("span", { class: "item-hora" }, U.isoParaBR(p.proximoRetorno.data).slice(0, 5) + (p.proximoRetorno.hora ? " · " + p.proximoRetorno.hora : "")),
          h("span", { class: "item-nome" }, R.nomeExibicao(p)))))) :
        UI.vazio({ texto: "Nenhum retorno marcado. Ao registrar um atendimento, informe a data do próximo retorno." })
    }));

    // Rascunhos
    const rascunhos = LB.banco.listar(null, r => ["paciente", "anamnese", "atendimento"].includes(r.tipo) && (r.status !== "concluido" || r.edicao))
      .sort((a, b) => b.atualizadoEm - a.atualizadoEm).slice(0, 6);
    const NOMES = { paciente: "Cadastro", anamnese: "Anamnese", atendimento: "Atendimento" };
    grade.append(UI.cartao({
      titulo: "Continuar de onde parou", icone: "lapis",
      conteudo: rascunhos.length ? h("ul", { class: "lista-simples" }, rascunhos.map(r => {
        const p = r.tipo === "paciente" ? r : R.paciente(r.pacienteId);
        if (!p) return null;
        const rota = r.tipo === "paciente" ? "#/paciente/" + p.id + "/cadastro" : "#/paciente/" + p.id + "/" + r.tipo + "/" + r.id + "/editar";
        return h("li", null, h("a", { href: rota, class: "item-link" },
          h("span", { class: "item-nome" }, NOMES[r.tipo] + (r.edicao ? " (correção)" : "") + " · " + R.nomeExibicao(p)),
          h("span", { class: "item-detalhe" }, "Salvo em " + U.carimbo(r.atualizadoEm))));
      })) : UI.vazio({ texto: "Nenhum rascunho aberto. Tudo o que você começar a preencher aparece aqui." })
    }));

    // Cadastros recentes
    const recentes = pacientes.slice().sort((a, b) => b.criadoEm - a.criadoEm).slice(0, 5);
    grade.append(UI.cartao({
      titulo: "Cadastros recentes", icone: "pacientes",
      conteudo: recentes.length ? h("ul", { class: "lista-simples" }, recentes.map(p => h("li", null,
        linkPaciente(p, [h("span", { class: "item-detalhe" }, "Cadastrado em " + U.isoParaBR(U.hojeISO(new Date(p.criadoEm)))), p.status !== "concluido" ? UI.etiqueta("Rascunho", "rascunho") : null])))) :
        UI.vazio({ texto: "Nenhum paciente cadastrado ainda.", acao: UI.botao({ texto: "Cadastrar paciente", icone: "mais", variante: "primario", href: "#/pacientes/novo" }) })
    }));
    main.append(grade);

    if (LB.demo.existe()) {
      main.append(UI.aviso({ tipo: "info", titulo: "Há pacientes fictícios no sistema", texto: "Eles estão marcados como “Fictício” e servem só para teste. Remova-os antes de usar com pacientes reais.", acoes: [UI.botao({ texto: "Remover em Configurações", variante: "discreto", href: "#/configuracoes?secao=demo" })], semAnuncio: true }));
    }
  };

  // ---------- Pacientes ----------
  const filtros = { busca: "", situacao: "", cadastro: "", periodo: "", de: "", ate: "" };

  LB.telas.pacientes = function (main) {
    LB.app.titulo("Pacientes");
    main.append(cabecalhoPagina("Pacientes", null, [UI.botao({ texto: "Cadastrar paciente", icone: "mais", variante: "primario", href: "#/pacientes/novo" })]));

    const todos = R.pacientes();
    if (!todos.length) {
      main.append(UI.vazio({ texto: "Nenhum paciente cadastrado ainda. Comece pelo cadastro: os dados essenciais levam poucos minutos.", acao: UI.botao({ texto: "Cadastrar paciente", icone: "mais", variante: "primario", href: "#/pacientes/novo" }) }));
      return;
    }

    const lista = h("ul", { class: "lista-pacientes" });
    const contagem = h("p", { class: "contagem", "aria-live": "polite" });
    const busca = UI.campoSimples({ rotulo: "Buscar por nome ou telefone", tipo: "search", valor: filtros.busca, onInput: v => { filtros.busca = v; atualizar(); } });
    const situacao = UI.seletor({ rotulo: "Situação", valor: filtros.situacao, opcoes: [{ valor: "", texto: "Todas" }].concat(Object.entries(R.SITUACOES).map(([k, v]) => ({ valor: k, texto: v.texto }))), onChange: v => { filtros.situacao = v; atualizar(); } });
    const cadastro = UI.seletor({ rotulo: "Pendências", valor: filtros.cadastro, opcoes: [{ valor: "", texto: "Todos" }, { valor: "pend", texto: "Com pendências" }, { valor: "ok", texto: "Sem pendências" }], onChange: v => { filtros.cadastro = v; atualizar(); } });
    const periodo = UI.seletor({
      rotulo: "Último atendimento", valor: filtros.periodo, opcoes: [
        { valor: "", texto: "Qualquer data" }, { valor: "30", texto: "Nos últimos 30 dias" }, { valor: "90", texto: "Nos últimos 90 dias" },
        { valor: "mais90", texto: "Há mais de 90 dias" }, { valor: "nunca", texto: "Ainda sem atendimento" }, { valor: "datas", texto: "Escolher datas" }],
      onChange: v => { filtros.periodo = v; datas.hidden = v !== "datas"; atualizar(); }
    });
    const de = UI.campoSimples({ rotulo: "De", placeholder: "dd/mm/aaaa", inputmode: "numeric", max: 10, valor: filtros.de, larg: "meia" });
    const ate = UI.campoSimples({ rotulo: "Até", placeholder: "dd/mm/aaaa", inputmode: "numeric", max: 10, valor: filtros.ate, larg: "meia" });
    for (const [c, k] of [[de, "de"], [ate, "ate"]]) {
      c.input.addEventListener("input", () => { c.input.value = U.mascaraData(c.input.value); filtros[k] = c.input.value; atualizar(); });
      c.input.addEventListener("change", () => c.mostrarErro(c.input.value && !U.brParaISO(c.input.value) ? "Data inválida. Use dia/mês/ano." : ""));
    }
    const datas = h("div", { class: "linha-campos", hidden: filtros.periodo !== "datas" }, de, ate);
    const limpar = UI.botao({ texto: "Limpar filtros", variante: "discreto", onClick: () => {
      Object.assign(filtros, { busca: "", situacao: "", cadastro: "", periodo: "", de: "", ate: "" });
      busca.input.value = ""; situacao.select.value = ""; cadastro.select.value = ""; periodo.select.value = ""; de.input.value = ""; ate.input.value = ""; datas.hidden = true;
      atualizar(); busca.input.focus();
    } });

    main.append(h("section", { class: "filtros", "aria-label": "Busca e filtros" }, busca, h("div", { class: "filtros-linha" }, situacao, cadastro, periodo, limpar), datas), contagem, lista);

    function atualizar() {
      const hoje = U.hojeISO();
      const linhas = R.buscarPacientes(filtros.busca).map(p => ({ p, ultimo: R.ultimoAtendimento(p.id), pend: R.pendenciasPaciente(p) })).filter(({ p, ultimo, pend }) => {
        if (filtros.situacao && (p.situacao || "acompanhamento") !== filtros.situacao) return false;
        if (filtros.cadastro === "pend" && !pend.length) return false;
        if (filtros.cadastro === "ok" && pend.length) return false;
        const data = ultimo && U.ehISO(ultimo.dados.data) ? ultimo.dados.data : null;
        switch (filtros.periodo) {
          case "30": return data && data >= U.somarDias(hoje, -30);
          case "90": return data && data >= U.somarDias(hoje, -90);
          case "mais90": return data && data < U.somarDias(hoje, -90);
          case "nunca": return !ultimo;
          case "datas": {
            const a = U.brParaISO(filtros.de), b = U.brParaISO(filtros.ate);
            return data && (!a || data >= a) && (!b || data <= b);
          }
        }
        return true;
      });
      U.limpar(lista);
      contagem.textContent = linhas.length === todos.length ? U.plural(todos.length, "paciente", "pacientes") : linhas.length + " de " + U.plural(todos.length, "paciente", "pacientes");
      if (!linhas.length) {
        lista.append(h("li", { class: "sem-item" }, UI.vazio({ texto: "Nenhum paciente encontrado com esta busca e estes filtros.", acao: UI.botao({ texto: "Limpar filtros", variante: "secundario", onClick: () => limpar.click() }) })));
        return;
      }
      for (const { p, ultimo, pend } of linhas) {
        const sit = R.SITUACOES[p.situacao || "acompanhamento"];
        lista.append(h("li", null, h("a", { href: "#/paciente/" + p.id, class: "paciente-linha" },
          h("span", { class: "paciente-nome" }, R.nomeExibicao(p), p.demo ? UI.etiqueta("Fictício", "ficticio") : null),
          h("span", { class: "paciente-dado" }, h("span", { class: "rotulo-inline" }, "Telefone: "), p.dados.telefone || "não informado"),
          h("span", { class: "paciente-dado" }, h("span", { class: "rotulo-inline" }, "Último atendimento: "), ultimo && U.ehISO(ultimo.dados.data) ? U.isoParaBR(ultimo.dados.data) : "nenhum"),
          h("span", { class: "paciente-etiquetas" }, UI.etiqueta(sit.texto, sit.etiqueta), pend.length ? UI.etiqueta(U.plural(pend.length, "pendência", "pendências"), "pendente") : null))));
      }
    }
    atualizar();
  };

  // ---------- Novo atendimento: escolher paciente ----------
  LB.telas.novoAtendimento = function (main) {
    LB.app.titulo("Novo atendimento");
    main.append(cabecalhoPagina("Novo atendimento", "Para quem é o atendimento?"));
    const todos = R.pacientes();
    if (!todos.length) {
      main.append(UI.vazio({ texto: "Ainda não há pacientes. Cadastre o paciente primeiro; depois você inicia o atendimento.", acao: UI.botao({ texto: "Cadastrar paciente", icone: "mais", variante: "primario", href: "#/pacientes/novo" }) }));
      return;
    }
    const hoje = U.hojeISO();
    const lista = h("ul", { class: "lista-escolha" });
    const contagem = h("p", { class: "contagem", "aria-live": "polite" });
    const busca = UI.campoSimples({ rotulo: "Buscar por nome ou telefone", tipo: "search", onInput: v => atualizar(v) });
    function atualizar(v) {
      U.limpar(lista);
      const achados = R.buscarPacientes(v || "").sort((a, b) => {
        const ha = a.proximoRetorno && a.proximoRetorno.data === hoje ? 0 : 1, hb = b.proximoRetorno && b.proximoRetorno.data === hoje ? 0 : 1;
        return ha - hb;
      });
      contagem.textContent = U.plural(achados.length, "paciente", "pacientes");
      if (!achados.length) { lista.append(h("li", { class: "sem-item" }, UI.vazio({ texto: "Nenhum paciente encontrado. Confira a grafia ou cadastre um novo paciente." }))); return; }
      for (const p of achados) {
        const ultimo = R.ultimoAtendimento(p.id);
        const retornoHoje = p.proximoRetorno && p.proximoRetorno.data === hoje;
        lista.append(h("li", { class: "escolha-item" },
          h("div", { class: "escolha-info" },
            h("span", { class: "item-nome" }, R.nomeExibicao(p), p.demo ? UI.etiqueta("Fictício", "ficticio") : null),
            h("span", { class: "item-detalhe" }, (p.dados.telefone || "Telefone não informado") + " · Último atendimento: " + (ultimo && U.ehISO(ultimo.dados.data) ? U.isoParaBR(ultimo.dados.data) : "nenhum")),
            retornoHoje ? UI.etiqueta("Retorno hoje" + (p.proximoRetorno.hora ? " às " + p.proximoRetorno.hora : ""), "acompanhamento") : null),
          UI.botao({ texto: "Iniciar atendimento", icone: "avancar", variante: "primario", classe: "icone-depois", href: "#/paciente/" + p.id + "/atendimento/novo", atributos: { "aria-label": "Iniciar atendimento de " + R.nomeExibicao(p) } })));
      }
    }
    main.append(busca, contagem, lista,
      h("div", { class: "rodape-acao" }, h("p", null, "Paciente novo?"), UI.botao({ texto: "Cadastrar paciente", icone: "mais", variante: "secundario", href: "#/pacientes/novo" })));
    atualizar("");
    busca.input.focus();
  };

  LB.telas.naoEncontrado = function (main) {
    LB.app.titulo("Página não encontrada");
    main.append(cabecalhoPagina("Página não encontrada", "O endereço não existe ou o registro foi excluído."),
      UI.botao({ texto: "Ir para o painel", icone: "painel", variante: "primario", href: "#/painel" }));
  };

  // ---------- Sobre os dados ----------
  LB.telas.sobre = async function (main) {
    LB.app.titulo("Sobre os dados");
    main.append(cabecalhoPagina("Sobre os dados e a segurança", "O que este protótipo faz e o que ele ainda não faz."));
    const persist = await LB.banco.persistente();
    const item = (titulo, textos) => h("section", { class: "cartao" }, h("h2", { class: "cartao-titulo" }, titulo), textos.map(t => h("p", null, t)));
    main.append(
      UI.aviso({ tipo: "alerta", titulo: "Versão protótipo", texto: "Este sistema ainda não passou por validação de segurança, jurídica (LGPD) nem pelas normas profissionais da fisioterapia. Até essa validação, use apenas dados fictícios. O sistema não afirma estar em conformidade com nenhuma norma.", semAnuncio: true }),
      item("Onde os dados ficam", [
        "Somente neste navegador, neste aparelho. Não existe servidor nem envio pela internet: o sistema funciona mesmo sem conexão.",
        "Por isso, os dados não aparecem em outro computador, tablet ou celular, e não há cópia automática.",
        persist === true ? "Este navegador confirmou que vai manter os dados guardados de forma persistente." :
          persist === false ? "Este navegador não confirmou o armazenamento persistente: ele pode apagar os dados se o aparelho ficar sem espaço. Faça cópias de segurança com frequência." :
            "Não foi possível verificar se o navegador mantém os dados de forma persistente. Faça cópias de segurança com frequência."
      ]),
      item("Como os dados são protegidos", [
        "Cada registro é cifrado (AES-GCM de 256 bits) com uma chave criada a partir da sua senha. Sem a senha, os dados guardados são ilegíveis.",
        "O sistema bloqueia sozinho após o tempo sem uso definido em Configurações, e há o botão “Bloquear” sempre visível.",
        "O endereço da página não contém nomes nem dados de pacientes, e o título da aba do navegador não mostra nomes."
      ]),
      item("Limites importantes", [
        "Não há login em servidor nem controle de acesso por usuário: quem souber a senha e tiver o aparelho consegue abrir os dados.",
        "Limpar os dados do navegador, desinstalar o navegador ou usar janela anônima apaga ou esconde os dados.",
        "Esquecer a senha significa perder o acesso. Não há recuperação.",
        "PDFs e cópias exportadas saem deste sistema: o PDF não tem senha; a cópia de segurança continua cifrada.",
        "Use um aparelho pessoal, com bloqueio de tela, e não use computadores compartilhados."
      ]),
      item("Corrigir, exportar e excluir", [
        "Corrigir: registros concluídos podem ser corrigidos; o sistema marca a data da correção e, se configurado, guarda a versão anterior.",
        "Exportar: cada paciente pode ter o prontuário baixado em PDF ou os dados exportados em arquivo, no perfil (aba Privacidade). Em Configurações há a cópia de segurança completa.",
        "Excluir: é possível excluir um registro, um paciente inteiro ou todos os dados. Antes de excluir, verifique as regras de guarda de prontuário que se aplicam ao seu caso."
      ]),
      item("Antes de usar com pacientes reais", [
        "Recomendado: revisar os textos de consentimento com orientação jurídica, validar a segurança com um profissional de tecnologia, definir a rotina de cópias de segurança e, de preferência, migrar para uma versão com servidor seguro e login."
      ]));
  };
})(window.LB = window.LB || {});
