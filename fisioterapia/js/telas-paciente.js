/* Perfil do paciente, formulários (cadastro, anamnese, atendimento) e fichas de leitura. */
(function (LB) {
  "use strict";
  const U = LB.util, UI = LB.ui, E = LB.esquemas, R = LB.registros;
  const { h } = U;
  LB.telas = LB.telas || {};
  const cab = (...a) => LB.telas.cabecalhoPagina(...a);

  function semPaciente(main) { LB.telas.naoEncontrado(main); return null; }
  const rotaPerfil = (pid, aba) => "#/paciente/" + pid + (aba ? "?aba=" + aba : "");

  function listaDados(secoes, nivel) {
    if (!secoes.length) return UI.vazio({ texto: "Nenhum campo preenchido ainda." });
    return h("div", { class: "ficha-secoes" }, secoes.map(s => h("section", { class: "ficha-secao" },
      h(nivel || "h3", null, s.titulo),
      h("dl", { class: "lista-dados" }, s.itens.map(it => [h("dt", null, it.rotulo), h("dd", null, it.valor)])))));
  }

  // Cabeçalho visível só na impressão (Imprimir esta ficha).
  function cabecalhoImpressao(p, titulo) {
    const prof = LB.config.atual().profissional || {};
    return h("div", { class: "so-impressao cabecalho-impressao" },
      LB.marca.bloco("topo"),
      h("p", null, [prof.nome, prof.registro].filter(Boolean).join(" · ")),
      h("p", null, titulo + " · Paciente: " + ((p.dados && p.dados.nome) || R.nomeExibicao(p)) + " · Impresso em " + U.carimbo(Date.now())));
  }

  function historicoTexto(r) {
    const nomes = { criado: "Criado", concluido: "Concluído", corrigido: "Corrigido", situacao: "Situação alterada" };
    return (r.historico || []).map(x => ({ x, texto: (nomes[x.acao] || x.acao) + " em " + U.carimbo(x.em) + (x.motivo ? " — " + x.motivo : "") }));
  }

  function blocoHistorico(r, ficha) {
    const itens = historicoTexto(r);
    if (!itens.length) return null;
    return h("section", { class: "cartao cartao-historico" },
      h("h2", { class: "cartao-titulo" }, UI.icone("linha"), h("span", null, "Histórico deste registro")),
      h("ul", { class: "lista-simples" }, itens.map(({ x, texto }) => h("li", null, h("span", null, texto),
        x.anterior ? UI.botao({ texto: "Ver versão anterior", icone: "olho", variante: "discreto", onClick: () => {
          const fechar = UI.botao({ texto: "Fechar", variante: "primario" });
          const dlg = UI.dialogo({ titulo: "Versão anterior (antes da correção de " + U.carimbo(x.em) + ")", largo: true,
            conteudo: listaDados(E.secoesPreenchidas(ficha, x.anterior)), acoes: [fechar] });
          fechar.addEventListener("click", () => dlg.fechar());
        } }) : null))));
  }

  // ---------- Perfil ----------
  const ABAS = [
    { id: "resumo", texto: "Resumo" }, { id: "cadastro", texto: "Cadastro" }, { id: "anamnese", texto: "Anamnese" },
    { id: "atendimentos", texto: "Atendimentos" }, { id: "documentos", texto: "Documentos" }, { id: "privacidade", texto: "Privacidade" }
  ];

  LB.telas.perfil = function (main, [pid], q) {
    const p = R.paciente(pid);
    if (!p) return semPaciente(main);
    LB.app.titulo("Perfil do paciente");
    const aba = ABAS.some(a => a.id === q.aba) ? q.aba : "resumo";
    const d = p.dados || {};
    const idade = U.idade(d.nascimento);
    const sit = R.SITUACOES[p.situacao || "acompanhamento"];
    const sub = [idade != null ? idade + " anos" : null, d.telefone || null].filter(Boolean).join(" · ");

    const cabecalho = cab(R.nomeExibicao(p), sub || null, [
      UI.botao({ texto: "Novo atendimento", icone: "atendimento", variante: "primario", href: "#/paciente/" + p.id + "/atendimento/novo" }),
      UI.botao({ texto: "Baixar em PDF", icone: "download", variante: "secundario", onClick: () => LB.pdf.dialogo(R.paciente(p.id)) }),
      UI.botao({ texto: "Editar cadastro", icone: "lapis", variante: "secundario", href: "#/paciente/" + p.id + "/cadastro" })
    ]);
    cabecalho.querySelector(".cabecalho-textos").append(h("p", { class: "linha-etiquetas" }, UI.etiqueta(sit.texto, sit.etiqueta), p.demo ? UI.etiqueta("Fictício", "ficticio") : null, d.nomeSocial && d.nome ? h("span", { class: "texto-suave" }, "Nome civil: " + d.nome) : null));
    main.append(cabecalho);

    const pend = R.pendenciasPaciente(p);
    if (pend.length) {
      main.append(UI.aviso({
        tipo: "alerta", titulo: "Pendências deste paciente", semAnuncio: true,
        texto: "Nada está bloqueado: você pode usar o perfil normalmente e completar quando puder.",
        conteudo: h("ul", { class: "lista-pendencias" }, pend.map(x => h("li", null, h("a", { href: x.rota }, x.texto))))
      }));
    }

    const nAt = R.atendimentosDe(p.id).length, nDoc = R.documentosDe(p.id).length;
    main.append(h("nav", { class: "abas", "aria-label": "Seções do perfil" }, h("ul", null, ABAS.map(a => h("li", null,
      h("a", { href: rotaPerfil(p.id, a.id === "resumo" ? null : a.id), class: "aba" + (a.id === aba ? " ativa" : ""), "aria-current": a.id === aba ? "page" : null },
        a.texto + (a.id === "atendimentos" ? " (" + nAt + ")" : a.id === "documentos" ? " (" + nDoc + ")" : "")))))));

    const area = h("div", { class: "aba-conteudo" });
    main.append(area);
    ({ resumo: abaResumo, cadastro: abaCadastro, anamnese: abaAnamnese, atendimentos: abaAtendimentos, documentos: abaDocumentos, privacidade: abaPrivacidade })[aba](area, p, q);
  };

  function abaResumo(area, p) {
    const grade = h("div", { class: "grade-cartoes" });

    // Próximo retorno
    const msgRet = h("div", { class: "msg-local" });
    const corpoRet = h("div");
    function mostrarRetorno() {
      const atual = R.paciente(p.id).proximoRetorno;
      U.limpar(corpoRet).append(
        atual ? h("p", { class: "destaque-data" }, UI.icone("calendario"), h("span", null, U.isoParaBR(atual.data) + (atual.hora ? " às " + atual.hora : ""))) : h("p", { class: "texto-suave" }, "Nenhum retorno marcado."),
        UI.botao({ texto: atual ? "Mudar retorno" : "Marcar retorno", icone: "lapis", variante: "secundario", onClick: editarRetorno }));
    }
    function editarRetorno() {
      const atual = R.paciente(p.id).proximoRetorno || {};
      const data = UI.campoSimples({ rotulo: "Data", placeholder: "dd/mm/aaaa", inputmode: "numeric", max: 10, valor: atual.data ? U.isoParaBR(atual.data) : "", larg: "meia" });
      const hora = UI.campoSimples({ rotulo: "Horário", placeholder: "hh:mm", inputmode: "numeric", max: 5, valor: atual.hora || "", larg: "meia", opcional: true });
      data.input.addEventListener("input", () => { data.input.value = U.mascaraData(data.input.value); });
      hora.input.addEventListener("input", () => { hora.input.value = U.mascaraHora(hora.input.value); });
      const salvar = UI.botao({ texto: "Salvar retorno", icone: "check", variante: "primario", onClick: async () => {
        data.mostrarErro(""); hora.mostrarErro("");
        const iso = U.brParaISO(data.input.value);
        if (!iso) { data.mostrarErro("Data inválida. Use dia/mês/ano."); data.input.focus(); return; }
        if (hora.input.value && !U.horaValida(hora.input.value)) { hora.mostrarErro("Horário inválido. Use horas:minutos."); hora.input.focus(); return; }
        try {
          await R.definirRetorno(R.paciente(p.id), { data: iso, hora: hora.input.value });
          mostrarRetorno();
          UI.mensagem(msgRet, { tipo: "sucesso", titulo: "Retorno salvo", texto: "Aparece no painel em “Hoje” ou “Próximos retornos”." });
        } catch (e) { UI.mensagem(msgRet, { tipo: "erro", texto: "O retorno não foi salvo. Tente de novo." }); }
      } });
      const remover = atual.data ? UI.botao({ texto: "Remover retorno", variante: "discreto", onClick: async () => {
        await R.definirRetorno(R.paciente(p.id), null);
        mostrarRetorno();
        UI.mensagem(msgRet, { tipo: "sucesso", titulo: "Retorno removido" });
      } }) : null;
      const cancelar = UI.botao({ texto: "Cancelar", variante: "discreto", onClick: () => { mostrarRetorno(); U.limpar(msgRet); } });
      U.limpar(corpoRet).append(h("div", { class: "linha-campos" }, data, hora), h("div", { class: "linha-botoes" }, salvar, remover, cancelar));
      data.input.focus();
    }
    mostrarRetorno();
    grade.append(UI.cartao({ titulo: "Próximo retorno", icone: "retorno", conteudo: [corpoRet, msgRet] }));

    // Última evolução
    const ultimo = R.ultimoAtendimento(p.id);
    if (ultimo) {
      const d = ultimo.dados;
      const dl = h("dl", { class: "lista-dados compacta" },
        h("dt", null, "Data"), h("dd", null, U.isoParaBR(d.data) + (d.hora ? " às " + d.hora : "") + (d.numero ? " · nº " + d.numero : "")),
        d.objetivoSessao ? [h("dt", null, "Objetivo da sessão"), h("dd", null, d.objetivoSessao)] : null,
        d.evolucao ? [h("dt", null, "Evolução"), h("dd", null, d.evolucao)] : null,
        d.proximosPassos ? [h("dt", null, "Próximos passos"), h("dd", null, d.proximosPassos)] : null,
        (d.dorAntes !== undefined && d.dorAntes !== "") || (d.dorDepois !== undefined && d.dorDepois !== "") ? [h("dt", null, "Dor (0 a 10)"), h("dd", null, "Antes: " + (d.dorAntes === "" || d.dorAntes == null ? "não registrada" : d.dorAntes) + " · Depois: " + (d.dorDepois === "" || d.dorDepois == null ? "não registrada" : d.dorDepois))] : null);
      grade.append(UI.cartao({ titulo: "Última evolução", icone: "linha", conteudo: dl, acoes: [UI.botao({ texto: "Abrir registro completo", icone: "olho", variante: "secundario", href: "#/paciente/" + p.id + "/atendimento/" + ultimo.id })] }));
    } else {
      grade.append(UI.cartao({ titulo: "Última evolução", icone: "linha", conteudo: UI.vazio({ texto: "Nenhum atendimento registrado ainda.", acao: UI.botao({ texto: "Iniciar o primeiro atendimento", icone: "atendimento", variante: "primario", href: "#/paciente/" + p.id + "/atendimento/novo" }) }) }));
    }

    // Anamnese
    const an = R.anamnesesDe(p.id);
    const anConcl = an.find(a => a.status === "concluido");
    grade.append(UI.cartao({
      titulo: "Anamnese", icone: "documento",
      conteudo: anConcl ? h("p", null, "Concluída em " + U.isoParaBR(anConcl.dados.dataAvaliacao) + (an.length > 1 ? " · " + U.plural(an.length, "ficha", "fichas") + " no total" : "")) :
        an.length ? h("p", null, "Em rascunho, salvo em " + U.carimbo(an[0].atualizadoEm) + ".") : UI.vazio({ texto: "Ainda não preenchida." }),
      acoes: [anConcl ? UI.botao({ texto: "Abrir anamnese", icone: "olho", variante: "secundario", href: "#/paciente/" + p.id + "/anamnese/" + anConcl.id }) :
        an.length ? UI.botao({ texto: "Continuar anamnese", icone: "lapis", variante: "primario", href: "#/paciente/" + p.id + "/anamnese/" + an[0].id + "/editar" }) :
          UI.botao({ texto: "Preencher anamnese", icone: "lapis", variante: "primario", href: "#/paciente/" + p.id + "/anamnese/nova" })]
    }));

    // Situação
    const msgSit = h("div", { class: "msg-local" });
    const radios = UI.opcoesRadio({
      rotulo: "Situação atual", valor: p.situacao || "acompanhamento",
      opcoes: Object.entries(R.SITUACOES).map(([k, v]) => ({ valor: k, texto: v.texto })),
      onChange: async v => {
        try { await R.mudarSituacao(R.paciente(p.id), v); UI.mensagem(msgSit, { tipo: "sucesso", titulo: "Situação atualizada", texto: "Agora: " + R.SITUACOES[v].texto + "." }); }
        catch (e) { UI.mensagem(msgSit, { tipo: "erro", texto: "A situação não foi salva. Tente de novo." }); }
      }
    });
    grade.append(UI.cartao({ titulo: "Situação do paciente", icone: "pessoa", conteudo: [radios, msgSit] }));
    area.append(grade);
  }

  function abaCadastro(area, p) {
    const acoes = h("div", { class: "linha-botoes" },
      UI.botao({ texto: p.status === "concluido" ? "Editar cadastro" : "Continuar cadastro", icone: "lapis", variante: "primario", href: "#/paciente/" + p.id + "/cadastro" }),
      UI.botao({ texto: "Baixar em PDF", icone: "download", variante: "secundario", onClick: () => LB.pdf.dialogo(R.paciente(p.id), { tipo: "cadastro" }) }));
    area.append(h("div", { class: "barra-aba" }, h("h2", { class: "titulo-secao" }, "Cadastro"), R.etiquetasDe(p), acoes));
    if (p.status !== "concluido") area.append(UI.aviso({ tipo: "info", titulo: "Cadastro em rascunho", texto: "Salvo em " + U.carimbo(p.atualizadoEm) + ". Continue quando puder; o restante do perfil já pode ser usado.", semAnuncio: true }));
    area.append(listaDados(E.secoesPreenchidas("cadastro", p.dados || {})));
  }

  function abaAnamnese(area, p) {
    const an = R.anamnesesDe(p.id);
    area.append(h("div", { class: "barra-aba" }, h("h2", { class: "titulo-secao" }, "Anamnese"),
      an.length ? UI.botao({ texto: "Nova anamnese (reavaliação)", icone: "mais", variante: "secundario", href: "#/paciente/" + p.id + "/anamnese/nova" }) : null));
    if (!an.length) {
      area.append(UI.vazio({ texto: "Nenhuma anamnese ainda. Ela pode ser preenchida antes ou depois do primeiro atendimento.", acao: UI.botao({ texto: "Preencher anamnese", icone: "lapis", variante: "primario", href: "#/paciente/" + p.id + "/anamnese/nova" }) }));
      return;
    }
    area.append(h("ul", { class: "lista-registros" }, an.map((a, i) => h("li", { class: "registro-item" },
      h("div", { class: "registro-info" },
        h("p", { class: "registro-titulo" }, "Anamnese de " + (U.ehISO(a.dados.dataAvaliacao) ? U.isoParaBR(a.dados.dataAvaliacao) : "data não informada") + (i === 0 ? " (mais recente)" : "")),
        h("p", { class: "registro-detalhe" }, a.dados.motivo ? a.dados.motivo.slice(0, 140) + (a.dados.motivo.length > 140 ? "…" : "") : "Motivo não preenchido"),
        h("p", { class: "linha-etiquetas" }, R.etiquetasDe(a))),
      h("div", { class: "registro-acoes" },
        a.status === "concluido"
          ? UI.botao({ texto: "Abrir", icone: "olho", variante: "secundario", href: "#/paciente/" + p.id + "/anamnese/" + a.id })
          : UI.botao({ texto: "Continuar preenchimento", icone: "lapis", variante: "primario", href: "#/paciente/" + p.id + "/anamnese/" + a.id + "/editar" }),
        UI.botao({ texto: "Baixar em PDF", icone: "download", variante: "discreto", onClick: () => LB.pdf.dialogo(R.paciente(p.id), { tipo: "anamnese", id: a.id }) }))))));
  }

  const estadoLinha = { periodo: "todos", ordem: "recentes", de: "", ate: "" };

  function abaAtendimentos(area, p) {
    area.append(h("div", { class: "barra-aba" }, h("h2", { class: "titulo-secao" }, "Linha do tempo de atendimentos"),
      UI.botao({ texto: "Novo atendimento", icone: "atendimento", variante: "primario", href: "#/paciente/" + p.id + "/atendimento/novo" })));
    const todos = R.atendimentosDe(p.id);
    if (!todos.length) {
      area.append(UI.vazio({ texto: "Nenhum atendimento registrado. Inicie o primeiro para começar a linha do tempo.", acao: UI.botao({ texto: "Iniciar atendimento", icone: "atendimento", variante: "primario", href: "#/paciente/" + p.id + "/atendimento/novo" }) }));
      return;
    }
    const lista = h("ol", { class: "linha-tempo" });
    const contagem = h("p", { class: "contagem", "aria-live": "polite" });
    const de = UI.campoSimples({ rotulo: "De", placeholder: "dd/mm/aaaa", inputmode: "numeric", max: 10, valor: estadoLinha.de, larg: "meia" });
    const ate = UI.campoSimples({ rotulo: "Até", placeholder: "dd/mm/aaaa", inputmode: "numeric", max: 10, valor: estadoLinha.ate, larg: "meia" });
    for (const [c, k] of [[de, "de"], [ate, "ate"]]) c.input.addEventListener("input", () => { c.input.value = U.mascaraData(c.input.value); estadoLinha[k] = c.input.value; atualizar(); });
    const datas = h("div", { class: "linha-campos", hidden: estadoLinha.periodo !== "datas" }, de, ate);
    area.append(h("div", { class: "filtros-linha" },
      UI.seletor({ rotulo: "Período", valor: estadoLinha.periodo, opcoes: [{ valor: "todos", texto: "Todos" }, { valor: "30", texto: "Últimos 30 dias" }, { valor: "90", texto: "Últimos 90 dias" }, { valor: "datas", texto: "Escolher datas" }], onChange: v => { estadoLinha.periodo = v; datas.hidden = v !== "datas"; atualizar(); } }),
      UI.seletor({ rotulo: "Ordem", valor: estadoLinha.ordem, opcoes: [{ valor: "recentes", texto: "Mais recentes primeiro" }, { valor: "antigos", texto: "Mais antigos primeiro" }], onChange: v => { estadoLinha.ordem = v; atualizar(); } })),
      datas, contagem, lista);

    function atualizar() {
      const hoje = U.hojeISO();
      const vis = R.atendimentosDe(p.id, estadoLinha.ordem).filter(a => {
        const d = a.dados.data;
        if (estadoLinha.periodo === "todos") return true;
        if (!U.ehISO(d)) return false;
        if (estadoLinha.periodo === "30") return d >= U.somarDias(hoje, -30);
        if (estadoLinha.periodo === "90") return d >= U.somarDias(hoje, -90);
        const a1 = U.brParaISO(estadoLinha.de), b1 = U.brParaISO(estadoLinha.ate);
        return (!a1 || d >= a1) && (!b1 || d <= b1);
      });
      contagem.textContent = vis.length + " de " + U.plural(todos.length, "atendimento", "atendimentos");
      U.limpar(lista);
      if (!vis.length) { lista.append(h("li", { class: "sem-item" }, UI.vazio({ texto: "Nenhum atendimento neste período." }))); return; }
      for (const a of vis) {
        const d = a.dados;
        const dor = (d.dorAntes !== "" && d.dorAntes != null) || (d.dorDepois !== "" && d.dorDepois != null)
          ? "Dor antes: " + (d.dorAntes === "" || d.dorAntes == null ? "-" : d.dorAntes) + " · depois: " + (d.dorDepois === "" || d.dorDepois == null ? "-" : d.dorDepois) : null;
        lista.append(h("li", { class: "linha-tempo-item" },
          h("span", { class: "linha-tempo-ponto", "aria-hidden": "true" }),
          h("div", { class: "registro-item" },
            h("div", { class: "registro-info" },
              h("p", { class: "registro-titulo" }, "Atendimento" + (d.numero ? " nº " + d.numero : "") + " · " + (U.ehISO(d.data) ? U.isoParaBR(d.data) : "sem data") + (d.hora ? " às " + d.hora : "")),
              d.objetivoSessao ? h("p", { class: "registro-detalhe" }, d.objetivoSessao) : null,
              dor ? h("p", { class: "registro-detalhe" }, dor) : null,
              d.proximosPassos ? h("p", { class: "registro-detalhe" }, h("strong", null, "Próximos passos: "), d.proximosPassos) : null,
              h("p", { class: "linha-etiquetas" }, R.etiquetasDe(a))),
            h("div", { class: "registro-acoes" },
              a.status === "concluido"
                ? UI.botao({ texto: "Abrir", icone: "olho", variante: "secundario", href: "#/paciente/" + p.id + "/atendimento/" + a.id })
                : UI.botao({ texto: "Continuar registro", icone: "lapis", variante: "primario", href: "#/paciente/" + p.id + "/atendimento/" + a.id + "/editar" })))));
      }
    }
    atualizar();
  }

  function abaDocumentos(area, p) {
    area.append(h("h2", { class: "titulo-secao" }, "Documentos relacionados"));
    const msg = h("div", { class: "msg-local" });
    const idArq = "doc-arquivo";
    const arquivo = h("input", { type: "file", id: idArq, class: "entrada-arquivo", accept: "image/*,application/pdf", "aria-describedby": idArq + "-ajuda" });
    const descricao = UI.campoSimples({ rotulo: "Descrição", opcional: true, placeholder: "Ex.: exame de imagem, pedido médico, foto da região" });
    const salvar = UI.botao({ texto: "Salvar documento", icone: "upload", variante: "primario", onClick: async () => {
      const f = arquivo.files[0];
      if (!f) { UI.mensagem(msg, { tipo: "alerta", titulo: "Escolha um arquivo", texto: "Selecione uma imagem ou PDF.", focar: true }); return; }
      if (f.size > 15 * 1024 * 1024) { UI.mensagem(msg, { tipo: "alerta", titulo: "Arquivo grande demais", texto: "O limite é 15 MB por arquivo.", focar: true }); return; }
      salvar.disabled = true;
      try {
        const arquivoId = await LB.banco.salvarArquivo(await f.arrayBuffer());
        await LB.banco.salvar({ tipo: "documento", pacienteId: p.id, arquivoId, nome: f.name, mime: f.type || "application/octet-stream", tamanho: f.size, descricao: descricao.input.value.trim() });
        LB.app.avisar({ tipo: "sucesso", titulo: "Documento salvo", texto: "“" + f.name + "” foi guardado cifrado neste aparelho." });
        LB.app.render();
      } catch (e) {
        console.error(e);
        salvar.disabled = false;
        UI.mensagem(msg, { tipo: "erro", texto: "O documento não foi salvo. O espaço do aparelho pode estar cheio.", focar: true });
      }
    } });
    area.append(UI.cartao({ titulo: "Adicionar documento", icone: "upload", nivel: "h3", conteudo: [
      h("div", { class: "campo" }, h("label", { class: "rotulo", for: idArq }, "Arquivo (imagem ou PDF)"), h("p", { class: "campo-ajuda", id: idArq + "-ajuda" }, "Até 15 MB. O arquivo fica cifrado, só neste aparelho."), arquivo),
      descricao, salvar, msg] }));

    const docs = R.documentosDe(p.id);
    if (!docs.length) { area.append(UI.vazio({ texto: "Nenhum documento guardado. Use o quadro acima para adicionar exames, pedidos ou fotos." })); return; }
    area.append(h("ul", { class: "lista-registros" }, docs.map(doc => {
      const abrir = async () => {
        try {
          const buf = await LB.banco.lerArquivo(doc.arquivoId);
          const url = URL.createObjectURL(new Blob([buf], { type: doc.mime }));
          if (doc.mime.startsWith("image/")) {
            const fechar = UI.botao({ texto: "Fechar", variante: "primario" });
            const dlg = UI.dialogo({ titulo: doc.nome, largo: true, conteudo: h("img", { src: url, alt: doc.descricao || doc.nome, class: "previa-imagem" }), acoes: [fechar], aoFechar: () => URL.revokeObjectURL(url) });
            fechar.addEventListener("click", () => dlg.fechar());
          } else {
            window.open(url, "_blank", "noopener");
            setTimeout(() => URL.revokeObjectURL(url), 60000);
          }
        } catch (e) { UI.mensagem(msg, { tipo: "erro", texto: "Não foi possível abrir o documento.", focar: true }); }
      };
      const baixarDoc = async () => {
        const buf = await LB.banco.lerArquivo(doc.arquivoId);
        const url = URL.createObjectURL(new Blob([buf], { type: doc.mime }));
        const a = h("a", { href: url, download: doc.nome });
        document.body.append(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        UI.mensagem(msg, { tipo: "sucesso", titulo: "Download iniciado", texto: "“" + doc.nome + "” foi entregue ao navegador. Procure na pasta Downloads do aparelho." });
      };
      const excluirDoc = async () => {
        const ok = await UI.confirmar({ titulo: "Excluir este documento?", texto: "“" + doc.nome + "”", efeito: "O arquivo será apagado deste aparelho. Não tem volta. Cópias baixadas antes não são afetadas.", confirmarTexto: "Excluir documento", perigo: true });
        if (!ok) return;
        await R.excluirRegistro(doc.id);
        LB.app.avisar({ tipo: "sucesso", titulo: "Documento excluído", texto: "“" + doc.nome + "” foi apagado." });
        LB.app.render();
      };
      return h("li", { class: "registro-item" },
        h("div", { class: "registro-info" },
          h("p", { class: "registro-titulo" }, UI.icone("documento"), h("span", null, doc.nome)),
          h("p", { class: "registro-detalhe" }, (doc.descricao ? doc.descricao + " · " : "") + U.tamanhoArquivo(doc.tamanho) + " · adicionado em " + U.carimbo(doc.criadoEm))),
        h("div", { class: "registro-acoes" },
          UI.botao({ texto: "Abrir", icone: "olho", variante: "secundario", onClick: abrir }),
          UI.botao({ texto: "Baixar", icone: "download", variante: "discreto", onClick: baixarDoc }),
          UI.botao({ texto: "Excluir", icone: "lixeira", variante: "perigo", onClick: excluirDoc })));
    })));
  }

  function abaPrivacidade(area, p) {
    area.append(h("h2", { class: "titulo-secao" }, "Privacidade e dados deste paciente"));
    const msg = h("div", { class: "msg-local" });
    area.append(UI.cartao({
      titulo: "Exportar", icone: "download", nivel: "h3",
      subtitulo: "Para entregar uma cópia à pessoa, guardar ou transferir.",
      conteudo: msg,
      acoes: [
        UI.botao({ texto: "Baixar prontuário em PDF", icone: "download", variante: "primario", onClick: () => LB.pdf.dialogo(R.paciente(p.id)) }),
        UI.botao({ texto: "Exportar dados em arquivo (JSON)", icone: "documento", variante: "secundario", onClick: async () => {
          const ok = await UI.confirmar({ titulo: "Exportar os dados deste paciente?", texto: "Será gerado um arquivo de dados (formato JSON) com cadastro, anamneses e atendimentos deste paciente.", efeito: "O arquivo NÃO é cifrado e não tem senha. Os documentos anexados não vão no arquivo; baixe-os pela aba Documentos.", confirmarTexto: "Exportar arquivo" });
          if (!ok) return;
          const atual = R.paciente(p.id);
          const pacote = {
            formato: "lb-fisioterapia-paciente", versao: 1, geradoEm: new Date().toISOString(),
            paciente: atual, anamneses: R.anamnesesDe(p.id), atendimentos: R.atendimentosDe(p.id, "antigos"),
            documentos: R.documentosDe(p.id).map(d => ({ nome: d.nome, descricao: d.descricao, tamanho: d.tamanho, adicionadoEm: d.criadoEm }))
          };
          const nome = "Dados_" + U.nomeArquivo(atual.dados.nome || R.nomeExibicao(atual)) + "_" + U.hojeISO() + ".json";
          const url = URL.createObjectURL(new Blob([JSON.stringify(pacote, null, 2)], { type: "application/json" }));
          const a = h("a", { href: url, download: nome }); document.body.append(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 60000);
          UI.mensagem(msg, { tipo: "sucesso", titulo: "Arquivo entregue ao navegador", texto: "“" + nome + "”. Procure na pasta Downloads. Lembre-se: ele não é cifrado.", focar: true });
        } })
      ]
    }));
    area.append(UI.cartao({ titulo: "Histórico do cadastro", icone: "linha", nivel: "h3", conteudo: h("ul", { class: "lista-simples" }, historicoTexto(p).map(({ texto }) => h("li", null, texto))) }));
    area.append(UI.cartao({
      titulo: "Excluir paciente", icone: "lixeira", nivel: "h3", classe: "cartao-perigo",
      subtitulo: "Apaga deste aparelho o cadastro, as anamneses, os atendimentos e os documentos deste paciente. Antes, verifique as regras de guarda de prontuário que se aplicam ao seu caso.",
      acoes: [UI.botao({ texto: "Excluir paciente", icone: "lixeira", variante: "perigo", onClick: async () => {
        const n = R.atendimentosDe(p.id).length, na = R.anamnesesDe(p.id).length, nd = R.documentosDe(p.id).length;
        const ok = await UI.confirmar({
          titulo: "Excluir " + R.nomeExibicao(p) + "?", texto: "Esta ação não pode ser desfeita.",
          efeito: "Serão apagados: o cadastro, " + U.plural(na, "anamnese", "anamneses") + ", " + U.plural(n, "atendimento", "atendimentos") + " e " + U.plural(nd, "documento", "documentos") + ". PDFs e cópias já baixados não são afetados.",
          confirmarTexto: "Excluir paciente e registros", perigo: true
        });
        if (!ok) return;
        await R.excluirPaciente(p.id);
        LB.app.avisar({ tipo: "sucesso", titulo: "Paciente excluído", texto: "Os registros foram apagados deste aparelho." });
        LB.app.ir("#/pacientes");
      } })]
    }));
  }

  // ---------- Formulários ----------
  function abrirFormulario(main, o) {
    return LB.formulario.abrir(main, Object.assign({
      aoMudarEtapa: etapa => LB.app.substituirRota((location.hash || "").split("?")[0] + "?etapa=" + etapa)
    }, o));
  }

  LB.telas.cadastroNovo = function (main) {
    LB.app.titulo("Cadastro do paciente");
    let pid = null;
    return abrirFormulario(main, {
      ficha: "cadastro", contexto: "Novo paciente",
      aoCriar: r => { pid = r.id; LB.app.substituirRota("#/paciente/" + r.id + "/cadastro"); },
      rotaPerfil: () => pid ? rotaPerfil(pid) : "#/pacientes",
      aoConcluir: r => posCadastro(r)
    });
  };

  function posCadastro(r, correcao) {
    LB.app.avisar(correcao
      ? { tipo: "sucesso", titulo: "Cadastro atualizado e salvo" }
      : {
        tipo: "sucesso", titulo: "Cadastro concluído e salvo", texto: "Próximo passo (opcional):",
        acoes: [UI.botao({ texto: "Preencher anamnese", icone: "lapis", variante: "primario", href: "#/paciente/" + r.id + "/anamnese/nova" }),
          UI.botao({ texto: "Iniciar atendimento", icone: "atendimento", variante: "secundario", href: "#/paciente/" + r.id + "/atendimento/novo" })]
      });
    LB.app.ir(rotaPerfil(r.id, correcao ? "cadastro" : null));
  }

  LB.telas.cadastroEditar = function (main, [pid], q) {
    const p = R.paciente(pid);
    if (!p) return semPaciente(main);
    LB.app.titulo("Cadastro do paciente");
    return abrirFormulario(main, {
      ficha: "cadastro", registro: p, contexto: "Paciente: " + R.nomeExibicao(p), etapaInicial: q.etapa,
      rotaPerfil: () => rotaPerfil(pid),
      aoConcluir: (r, correcao) => posCadastro(r, correcao),
      aoDescartar: () => { LB.app.avisar({ tipo: "info", titulo: "Alterações descartadas", texto: "O cadastro continua como estava." }); LB.app.ir(rotaPerfil(pid, "cadastro")); }
    });
  };

  LB.telas.anamneseNova = function (main, [pid]) {
    const p = R.paciente(pid);
    if (!p) return semPaciente(main);
    LB.app.titulo("Anamnese");
    const cfg = LB.config.atual();
    return abrirFormulario(main, {
      ficha: "anamnese", pacienteId: pid, contexto: "Paciente: " + R.nomeExibicao(p),
      dadosIniciais: { dataAvaliacao: U.hojeISO(), profissional: cfg.profissional.nome || "" },
      aoCriar: r => LB.app.substituirRota("#/paciente/" + pid + "/anamnese/" + r.id + "/editar"),
      rotaPerfil: () => rotaPerfil(pid, "anamnese"),
      aoConcluir: r => posAnamnese(pid, r)
    });
  };

  function posAnamnese(pid, r, correcao) {
    if (correcao) {
      LB.app.avisar({ tipo: "sucesso", titulo: "Correção salva", texto: "O registro mostra a data da correção." + (LB.config.atual().politicaCorrecao === "guardar" ? " A versão anterior ficou no histórico." : "") });
      LB.app.ir("#/paciente/" + pid + "/anamnese/" + r.id);
      return;
    }
    LB.app.avisar({
      tipo: "sucesso", titulo: "Anamnese concluída e salva", texto: "Próximo passo (opcional):",
      acoes: [UI.botao({ texto: "Iniciar atendimento", icone: "atendimento", variante: "primario", href: "#/paciente/" + pid + "/atendimento/novo" })]
    });
    LB.app.ir(rotaPerfil(pid, "anamnese"));
  }

  LB.telas.anamneseEditar = function (main, [pid, aid], q) {
    const p = R.paciente(pid), a = LB.banco.obter(aid);
    if (!p || !a || a.tipo !== "anamnese" || a.pacienteId !== pid) return semPaciente(main);
    LB.app.titulo("Anamnese");
    return abrirFormulario(main, {
      ficha: "anamnese", registro: a, pacienteId: pid, contexto: "Paciente: " + R.nomeExibicao(p), etapaInicial: q.etapa,
      rotaPerfil: () => rotaPerfil(pid, "anamnese"),
      aoConcluir: (r, correcao) => posAnamnese(pid, r, correcao),
      aoDescartar: () => { LB.app.avisar({ tipo: "info", titulo: "Correção descartada", texto: "O registro continua como estava." }); LB.app.ir("#/paciente/" + pid + "/anamnese/" + aid); }
    });
  };

  function painelAtendimento(p, atualId) {
    const anteriores = R.atendimentosDe(p.id).filter(a => a.status === "concluido" && a.id !== atualId);
    const ultimo = anteriores[0];
    const temAnamnese = R.anamnesesDe(p.id).some(a => a.status === "concluido");
    const partes = [];
    if (!temAnamnese) {
      partes.push(UI.aviso({ tipo: "info", titulo: "Anamnese ainda não concluída", texto: "Você pode registrar o atendimento normalmente e preencher a anamnese depois.", semAnuncio: true,
        acoes: [UI.botao({ texto: "Abrir anamnese", variante: "discreto", href: R.anamnesesDe(p.id)[0] ? "#/paciente/" + p.id + "/anamnese/" + R.anamnesesDe(p.id)[0].id + "/editar" : "#/paciente/" + p.id + "/anamnese/nova" })] }));
    }
    if (ultimo) {
      const d = ultimo.dados;
      partes.push(h("section", { class: "contexto-anterior", "aria-label": "Último atendimento" },
        h("h3", null, "Último atendimento: " + U.isoParaBR(d.data) + (d.numero ? " (nº " + d.numero + ")" : "")),
        h("dl", { class: "lista-dados compacta" },
          d.proximosPassos ? [h("dt", null, "Próximos passos registrados"), h("dd", null, d.proximosPassos)] : null,
          d.evolucao ? [h("dt", null, "Evolução"), h("dd", null, d.evolucao)] : null,
          d.dorDepois !== "" && d.dorDepois != null ? [h("dt", null, "Dor ao final"), h("dd", null, d.dorDepois + " de 10")] : null),
        h("a", { href: "#/paciente/" + p.id + "/atendimento/" + ultimo.id }, "Abrir registro completo")));
    }
    return partes.length ? h("div", { class: "painel-contexto" }, partes) : null;
  }

  LB.telas.atendimentoNovo = function (main, [pid]) {
    const p = R.paciente(pid);
    if (!p) return semPaciente(main);
    LB.app.titulo("Atendimento");
    const cfg = LB.config.atual();
    return abrirFormulario(main, {
      ficha: "atendimento", pacienteId: pid, contexto: "Paciente: " + R.nomeExibicao(p),
      dadosIniciais: { data: U.hojeISO(), hora: U.agoraHora(), numero: String(R.proximoNumero(pid)), profissional: cfg.profissional.nome || "" },
      painelContexto: painelAtendimento(p),
      aoCriar: r => LB.app.substituirRota("#/paciente/" + pid + "/atendimento/" + r.id + "/editar"),
      rotaPerfil: () => rotaPerfil(pid, "atendimentos"),
      aoConcluir: r => posAtendimento(pid, r)
    });
  };

  function posAtendimento(pid, r, correcao) {
    if (correcao) {
      LB.app.avisar({ tipo: "sucesso", titulo: "Correção salva", texto: "O registro mostra a data da correção." + (LB.config.atual().politicaCorrecao === "guardar" ? " A versão anterior ficou no histórico." : "") });
      LB.app.ir("#/paciente/" + pid + "/atendimento/" + r.id);
      return;
    }
    LB.app.avisar({
      tipo: "sucesso", titulo: "Atendimento registrado e salvo", texto: "Ele já aparece na linha do tempo abaixo. Próximo passo (opcional):",
      acoes: [UI.botao({ texto: "Baixar este atendimento em PDF", icone: "download", variante: "secundario", onClick: () => LB.pdf.dialogo(R.paciente(pid), { tipo: "atendimento", id: r.id }) })]
    });
    LB.app.ir(rotaPerfil(pid, "atendimentos"));
  }

  LB.telas.atendimentoEditar = function (main, [pid, aid], q) {
    const p = R.paciente(pid), a = LB.banco.obter(aid);
    if (!p || !a || a.tipo !== "atendimento" || a.pacienteId !== pid) return semPaciente(main);
    LB.app.titulo("Atendimento");
    return abrirFormulario(main, {
      ficha: "atendimento", registro: a, pacienteId: pid, contexto: "Paciente: " + R.nomeExibicao(p), etapaInicial: q.etapa,
      painelContexto: painelAtendimento(p, aid),
      rotaPerfil: () => rotaPerfil(pid, "atendimentos"),
      aoConcluir: (r, correcao) => posAtendimento(pid, r, correcao),
      aoDescartar: () => { LB.app.avisar({ tipo: "info", titulo: "Correção descartada", texto: "O registro continua como estava." }); LB.app.ir("#/paciente/" + pid + "/atendimento/" + aid); }
    });
  };

  // ---------- Fichas de leitura ----------
  function fichaLeitura(main, p, r, ficha) {
    const ehAt = ficha === "atendimento";
    const d = r.dados;
    const titulo = ehAt ? "Atendimento" + (d.numero ? " nº " + d.numero : "") : "Anamnese";
    const quando = ehAt ? (U.ehISO(d.data) ? U.isoParaBR(d.data) : "sem data") + (d.hora ? " às " + d.hora : "") : (U.ehISO(d.dataAvaliacao) ? U.isoParaBR(d.dataAvaliacao) : "sem data");
    const base = "#/paciente/" + p.id + "/" + ficha + "/" + r.id;
    const acoes = [
      UI.botao({ texto: "Baixar em PDF", icone: "download", variante: "primario", onClick: () => LB.pdf.dialogo(R.paciente(p.id), { tipo: ficha, id: r.id }) }),
      UI.botao({ texto: "Imprimir", icone: "impressora", variante: "secundario", onClick: () => window.print() }),
      r.status === "concluido"
        ? UI.botao({ texto: r.edicao ? "Continuar correção" : "Corrigir registro", icone: "lapis", variante: "secundario", onClick: async () => {
          if (!r.edicao) {
            const ok = await UI.confirmar({
              titulo: "Corrigir este registro?", texto: "Você vai editar um registro já concluído.",
              efeito: "As mudanças ficam como rascunho até você tocar em “Salvar correção”. Depois disso, o registro mostra a data da correção" + (LB.config.atual().politicaCorrecao === "guardar" ? " e a versão atual fica guardada no histórico." : "."),
              confirmarTexto: "Começar correção"
            });
            if (!ok) return;
          }
          LB.app.ir(base + "/editar");
        } })
        : UI.botao({ texto: "Continuar preenchimento", icone: "lapis", variante: "secundario", href: base + "/editar" })
    ];
    const cabecalho = cab(titulo, R.nomeExibicao(p) + " · " + quando, acoes);
    cabecalho.querySelector(".cabecalho-textos").append(h("p", { class: "linha-etiquetas" }, R.etiquetasDe(r)));
    main.append(
      h("p", { class: "migalha" }, h("a", { href: rotaPerfil(p.id, ehAt ? "atendimentos" : "anamnese") }, UI.icone("voltar"), h("span", null, "Voltar ao perfil de " + R.nomeExibicao(p)))),
      cabecalho);
    if (r.edicao) main.append(UI.aviso({ tipo: "alerta", titulo: "Há uma correção não salva", texto: "Ela foi iniciada em " + U.carimbo(r.edicao.iniciadaEm) + ". O registro abaixo é a versão que está valendo.", acoes: [UI.botao({ texto: "Continuar correção", variante: "discreto", href: base + "/editar" })], semAnuncio: true }));
    if (r.status !== "concluido") main.append(UI.aviso({ tipo: "info", titulo: "Rascunho", texto: "Este registro ainda não foi concluído. Salvo em " + U.carimbo(r.atualizadoEm) + ".", semAnuncio: true }));
    main.append(h("article", { class: "ficha-impressao" }, cabecalhoImpressao(p, titulo + " · " + quando), listaDados(E.secoesPreenchidas(ficha, d), "h2")));
    main.append(blocoHistorico(r, ficha));
    main.append(UI.cartao({
      titulo: "Excluir registro", icone: "lixeira", nivel: "h2", classe: "cartao-perigo nao-imprimir",
      subtitulo: "Prefira “Corrigir registro”. Excluir apaga o registro deste aparelho. Antes, verifique as regras de guarda de prontuário que se aplicam ao seu caso.",
      acoes: [UI.botao({ texto: "Excluir este registro", icone: "lixeira", variante: "perigo", onClick: async () => {
        const ok = await UI.confirmar({ titulo: "Excluir " + titulo.toLowerCase() + " de " + quando + "?", texto: "Esta ação não pode ser desfeita.", efeito: "O registro e o histórico de correções dele serão apagados deste aparelho. PDFs já baixados não são afetados.", confirmarTexto: "Excluir registro", perigo: true });
        if (!ok) return;
        await R.excluirRegistro(r.id);
        LB.app.avisar({ tipo: "sucesso", titulo: "Registro excluído" });
        LB.app.ir(rotaPerfil(p.id, ehAt ? "atendimentos" : "anamnese"));
      } })]
    }));
  }

  LB.telas.anamneseVer = function (main, [pid, aid]) {
    const p = R.paciente(pid), a = LB.banco.obter(aid);
    if (!p || !a || a.tipo !== "anamnese" || a.pacienteId !== pid) return semPaciente(main);
    LB.app.titulo("Anamnese");
    fichaLeitura(main, p, a, "anamnese");
  };
  LB.telas.atendimentoVer = function (main, [pid, aid]) {
    const p = R.paciente(pid), a = LB.banco.obter(aid);
    if (!p || !a || a.tipo !== "atendimento" || a.pacienteId !== pid) return semPaciente(main);
    LB.app.titulo("Atendimento");
    fichaLeitura(main, p, a, "atendimento");
  };
})(window.LB = window.LB || {});
