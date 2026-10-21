/*
  Geração de PDF real (jsPDF, incluído na pasta vendor — funciona sem internet).
  Cada arquivo contém dados de um único paciente.
*/
(function (LB) {
  "use strict";
  const U = LB.util, UI = LB.ui, E = LB.esquemas, R = LB.registros;
  const { h } = U;

  const COR = {
    musgo: [63, 75, 58], texto: [38, 38, 31], suave: [82, 84, 74], areia: [244, 239, 228],
    dourado: [184, 151, 90], linha: [221, 212, 194], branco: [255, 255, 255]
  };
  const MARGEM = 18, LARGURA = 210, ALTURA = 297, TOPO_CONTEUDO = 38, LIMITE = 279;

  // As fontes padrão do PDF usam o alfabeto latino básico; trocamos símbolos que não existem nele.
  function limparTexto(t) {
    return String(t == null ? "" : t)
      .replace(/[“”„]/g, '"').replace(/[‘’‚]/g, "'").replace(/[–—]/g, "-").replace(/…/g, "...")
      .replace(/•/g, "·").replace(/→/g, "->").replace(/←/g, "<-").replace(/≥/g, ">=").replace(/≤/g, "<=")
      .replace(/\r/g, "")
      .replace(/[^\n\x20-\x7E\xA0-\xFF]/g, ch => {
        const base = ch.normalize("NFD").replace(/[̀-ͯ]/g, "");
        return /^[\x20-\x7E\xA0-\xFF]+$/.test(base) ? base : "";
      });
  }

  function nomeDoArquivo(paciente) {
    return "Prontuario_" + U.nomeArquivo((paciente.dados && paciente.dados.nome) || R.nomeExibicao(paciente)) + "_" + U.hojeISO() + ".pdf";
  }

  function gerar(o) {
    if (!window.jspdf || !window.jspdf.jsPDF) throw new Error("O gerador de PDF não carregou neste navegador.");
    const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4", compress: true });
    const cfg = LB.config.atual();
    const prof = cfg.profissional || {};
    const p = o.paciente;
    const nomePaciente = (p.dados && p.dados.nome) || R.nomeExibicao(p);
    const geradoEm = new Date();
    const largUtil = LARGURA - 2 * MARGEM;
    let y = TOPO_CONTEUDO;

    doc.setProperties({ title: "Prontuário - " + limparTexto(nomePaciente), subject: "Prontuário fisioterapêutico", creator: "Letícia Bernucci Fisioterapia" });

    const cor = (c, tipo) => tipo === "fill" ? doc.setFillColor(c[0], c[1], c[2]) : tipo === "draw" ? doc.setDrawColor(c[0], c[1], c[2]) : doc.setTextColor(c[0], c[1], c[2]);
    const fonte = (familia, estilo, tamanho) => { doc.setFont(familia, estilo); doc.setFontSize(tamanho); };

    function cabecalho() {
      const logo = LB.marca.logo();
      let xTexto = MARGEM;
      if (logo && logo.dataURL) {
        const proporcao = logo.largura / logo.altura;
        let alt = 15, larg = alt * proporcao;
        if (larg > 60) { larg = 60; alt = larg / proporcao; }
        try { doc.addImage(logo.dataURL, "PNG", MARGEM, 11 + (15 - alt) / 2, larg, alt); xTexto = null; }
        catch (e) { xTexto = MARGEM; }
      }
      if (xTexto !== null) {
        fonte("times", "normal", 24); cor(COR.musgo);
        doc.text("LB", MARGEM, 22);
        cor(COR.dourado, "draw"); doc.setLineWidth(0.3); doc.line(MARGEM + 15, 13, MARGEM + 15, 25);
        fonte("times", "normal", 12); cor(COR.musgo);
        doc.text(limparTexto("LETÍCIA BERNUCCI"), MARGEM + 19, 18, { charSpace: 0.6 });
        fonte("helvetica", "normal", 7.5); cor(COR.suave);
        doc.text("FISIOTERAPIA", MARGEM + 19, 23, { charSpace: 1 });
      }
      // Identificação profissional: somente o que foi preenchido em Configurações.
      const linhas = [
        [prof.nome, prof.registro].filter(Boolean).join(" · "),
        [prof.telefone, prof.email].filter(Boolean).join(" · "),
        prof.endereco, prof.complemento
      ].filter(Boolean);
      fonte("helvetica", "normal", 8); cor(COR.suave);
      linhas.slice(0, 4).forEach((l, i) => doc.text(limparTexto(l), LARGURA - MARGEM, 14 + i * 4, { align: "right" }));
      cor(COR.dourado, "draw"); doc.setLineWidth(0.4);
      doc.line(MARGEM, 31, LARGURA - MARGEM, 31);
    }

    function novaPagina() { doc.addPage(); cabecalho(); y = TOPO_CONTEUDO; }
    function garantir(espaco) { if (y + espaco > LIMITE) novaPagina(); }

    function titulo(texto) {
      fonte("times", "normal", 19); cor(COR.musgo);
      doc.text(limparTexto(texto), MARGEM, y + 4);
      y += 10;
    }

    function caixaPaciente(linhasInfo) {
      const alturaLinha = 5.2;
      const pares = linhasInfo.filter(l => l[1]);
      const meio = Math.ceil(pares.length / 2);
      const alt = 6 + meio * alturaLinha + 2;
      cor(COR.areia, "fill"); doc.roundedRect(MARGEM, y, largUtil, alt, 1.5, 1.5, "F");
      pares.forEach((par, i) => {
        const col = i < meio ? 0 : 1, lin = i < meio ? i : i - meio;
        const x = MARGEM + 4 + col * (largUtil / 2);
        const yy = y + 6.5 + lin * alturaLinha;
        fonte("helvetica", "bold", 8.5); cor(COR.musgo); doc.text(limparTexto(par[0]) + ":", x, yy);
        const w = doc.getTextWidth(limparTexto(par[0]) + ": ");
        fonte("helvetica", "normal", 9.5); cor(COR.texto);
        const valor = doc.splitTextToSize(limparTexto(par[1]), largUtil / 2 - 8 - w)[0];
        doc.text(valor, x + w, yy);
      });
      y += alt + 6;
    }

    function secao(texto) {
      garantir(22);
      cor(COR.musgo, "fill"); doc.rect(MARGEM, y, 1.2, 7, "F");
      cor(COR.areia, "fill"); doc.rect(MARGEM + 1.2, y, largUtil - 1.2, 7, "F");
      fonte("helvetica", "bold", 11); cor(COR.musgo);
      doc.text(limparTexto(texto), MARGEM + 4, y + 4.9);
      y += 11;
    }

    function subtitulo(texto, detalhe) {
      garantir(detalhe ? 24 : 18);
      fonte("helvetica", "bold", 10.5); cor(COR.texto);
      doc.text(limparTexto(texto), MARGEM, y + 3.5);
      y += 5.5;
      if (detalhe) {
        fonte("helvetica", "normal", 8.5); cor(COR.suave);
        for (const l of doc.splitTextToSize(limparTexto(detalhe), largUtil)) { garantir(5); doc.text(l, MARGEM, y + 3); y += 4; }
      }
      cor(COR.dourado, "draw"); doc.setLineWidth(0.25); doc.line(MARGEM, y + 1, MARGEM + 30, y + 1);
      y += 4;
    }

    function item(rotulo, valor, longo) {
      const r = limparTexto(rotulo), v = limparTexto(valor);
      const colRotulo = 58;
      fonte("helvetica", "normal", 10);
      const curto = !longo && doc.getTextWidth(v) < largUtil - colRotulo - 2 && !v.includes("\n");
      if (curto) {
        fonte("helvetica", "bold", 9);
        const rot = doc.splitTextToSize(r, colRotulo - 3);
        garantir(rot.length * 4.4 + 2);
        cor(COR.musgo); doc.text(rot, MARGEM, y + 3.2);
        fonte("helvetica", "normal", 10); cor(COR.texto);
        doc.text(v, MARGEM + colRotulo, y + 3.2);
        y += Math.max(rot.length * 4.4, 4.8) + 1.8;
      } else {
        fonte("helvetica", "bold", 9);
        const rot = doc.splitTextToSize(r, largUtil);
        garantir(rot.length * 4.4 + 6);
        cor(COR.musgo); doc.text(rot, MARGEM, y + 3.2);
        y += rot.length * 4.4;
        fonte("helvetica", "normal", 10); cor(COR.texto);
        for (const linha of doc.splitTextToSize(v, largUtil)) {
          garantir(5);
          doc.text(linha, MARGEM, y + 3.6);
          y += 4.9;
        }
        y += 1.8;
      }
      cor(COR.linha, "draw"); doc.setLineWidth(0.15); doc.line(MARGEM, y - 0.6, LARGURA - MARGEM, y - 0.6);
      y += 1.2;
    }

    function blocosDeDados(ficha, dados) {
      const secoes = E.secoesPreenchidas(ficha, dados, cfg);
      if (!secoes.length) { fonte("helvetica", "italic", 9.5); cor(COR.suave); garantir(6); doc.text("Nenhum campo preenchido.", MARGEM, y + 3); y += 7; return; }
      for (const s of secoes) {
        garantir(16);
        fonte("helvetica", "bold", 8.5); cor(COR.suave);
        doc.text(limparTexto(s.titulo.toUpperCase()), MARGEM, y + 3, { charSpace: 0.4 });
        y += 6;
        for (const it of s.itens) item(it.rotulo, it.valor, it.longo);
        y += 2;
      }
    }

    function situacaoRegistro(r) {
      const partes = [];
      if (r.status !== "concluido") partes.push("Rascunho (não concluído) - última alteração em " + U.carimbo(r.atualizadoEm));
      else partes.push("Concluído em " + U.carimbo(r.concluidoEm || r.atualizadoEm));
      const correcoes = (r.historico || []).filter(x => x.acao === "corrigido");
      for (const c of correcoes) partes.push("Corrigido em " + U.carimbo(c.em) + (c.motivo ? " (motivo: " + c.motivo + ")" : ""));
      return partes.join(" · ");
    }

    // ---------- Montagem ----------
    cabecalho();
    const tituloDoc = o.titulo || "Prontuário";
    titulo(tituloDoc);
    const d = p.dados || {};
    const idade = U.idade(d.nascimento);
    const conteudoLista = [];
    if (o.incluirCadastro) conteudoLista.push("cadastro");
    if (o.anamneses.length) conteudoLista.push(U.plural(o.anamneses.length, "anamnese", "anamneses"));
    if (o.atendimentos.length) conteudoLista.push(U.plural(o.atendimentos.length, "atendimento", "atendimentos"));
    caixaPaciente([
      ["Paciente", d.nome || R.nomeExibicao(p)],
      ["Nome social", d.nomeSocial],
      ["Nascimento", U.ehISO(d.nascimento) ? U.isoParaBR(d.nascimento) + (idade != null ? " (" + idade + " anos)" : "") : ""],
      ["Telefone", d.telefone],
      ["Gerado em", U.carimbo(geradoEm.getTime())],
      ["Conteúdo", conteudoLista.join(", ")],
      ["Período", o.periodoTexto || ""]
    ]);

    if (o.incluirCadastro) {
      secao("Cadastro");
      fonte("helvetica", "normal", 8.5); cor(COR.suave);
      doc.text(limparTexto(situacaoRegistro(p)), MARGEM, y + 2); y += 6;
      blocosDeDados("cadastro", p.dados || {});
    }
    for (const a of o.anamneses) {
      secao("Anamnese");
      subtitulo("Avaliação de " + (U.ehISO(a.dados.dataAvaliacao) ? U.isoParaBR(a.dados.dataAvaliacao) : "data não informada"), situacaoRegistro(a));
      blocosDeDados("anamnese", a.dados);
    }
    if (o.atendimentos.length) {
      secao(o.atendimentos.length === 1 ? "Atendimento e evolução" : "Atendimentos e evolução");
      o.atendimentos.forEach((at, i) => {
        if (i > 0) y += 3;
        const dd = at.dados;
        const quando = (U.ehISO(dd.data) ? U.isoParaBR(dd.data) : "data não informada") + (dd.hora ? " às " + dd.hora : "");
        subtitulo("Atendimento" + (dd.numero ? " nº " + dd.numero : "") + " - " + quando, situacaoRegistro(at));
        blocosDeDados("atendimento", dd);
      });
    }

    if (o.assinatura) {
      garantir(30);
      y += 14;
      cor(COR.texto, "draw"); doc.setLineWidth(0.3);
      doc.line(LARGURA / 2 - 40, y, LARGURA / 2 + 40, y);
      fonte("helvetica", "normal", 9); cor(COR.texto);
      const nomeAss = [prof.nome, prof.registro].filter(Boolean).join(" - ") || "Assinatura da profissional";
      doc.text(limparTexto(nomeAss), LARGURA / 2, y + 4.5, { align: "center" });
      y += 8;
    }

    // Rodapé com paginação em todas as páginas
    const total = doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      cor(COR.linha, "draw"); doc.setLineWidth(0.2);
      doc.line(MARGEM, 284, LARGURA - MARGEM, 284);
      fonte("helvetica", "normal", 7.5); cor(COR.suave);
      doc.text(limparTexto("Confidencial: contém dados de saúde de " + nomePaciente + ". Gerado em " + U.carimbo(geradoEm.getTime()) + "."), MARGEM, 289, { maxWidth: 140 });
      doc.text("Página " + i + " de " + total, LARGURA - MARGEM, 289, { align: "right" });
    }

    return { blob: doc.output("blob"), nomeArquivo: nomeDoArquivo(p), paginas: total };
  }

  // ---------- Download e explicações por aparelho ----------
  function baixar(blob, nome) {
    const url = URL.createObjectURL(blob);
    const a = h("a", { href: url, download: nome, style: "display:none" });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  function aparelho() {
    const ua = navigator.userAgent || "";
    const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (ios) return "ios";
    if (/Android/i.test(ua)) return "android";
    return "computador";
  }

  function ondeFoiSalvo() {
    switch (aparelho()) {
      case "ios": return [
        "No iPhone e no iPad, o Safari mostra o PDF ou pergunta o que fazer com ele. Os downloads ficam no app Arquivos, na pasta Downloads.",
        "Se o PDF abrir na tela, toque em Compartilhar e depois em “Salvar em Arquivos”."
      ];
      case "android": return [
        "No Android, o arquivo vai para a pasta Downloads. Abra pelo app Arquivos (ou Downloads), ou toque no aviso que o navegador mostra na parte de baixo da tela."
      ];
      default: return [
        "No computador, o arquivo vai para a pasta Downloads — ou para a pasta que você escolher, se o navegador perguntar onde salvar.",
        "No Chrome e no Edge, o ícone de downloads fica no canto superior direito da janela."
      ];
    }
  }

  // ---------- Diálogo "Baixar em PDF": escolher o que incluir ----------
  function dialogo(paciente, pre) {
    pre = pre || {};
    const anamneses = R.anamnesesDe(paciente.id);
    const atendimentos = R.atendimentosDe(paciente.id, "antigos");
    const sel = {
      cadastro: pre.tipo ? pre.tipo === "cadastro" : true,
      anamneses: new Set(pre.tipo === "anamnese" ? [pre.id] : pre.tipo ? [] : anamneses.filter(a => a.status === "concluido").map(a => a.id)),
      atendimentos: new Set(pre.tipo === "atendimento" ? [pre.id] : pre.tipo ? [] : atendimentos.filter(a => a.status === "concluido").map(a => a.id)),
      periodo: "todos", de: "", ate: "", assinatura: true
    };

    const espacoMsg = h("div", { class: "dialogo-mensagem" });
    const listaAtend = h("div", { class: "lista-selecao" });
    const contagem = h("p", { class: "texto-suave", "aria-live": "polite" });

    function dentroDoPeriodo(a) {
      const data = a.dados.data;
      if (sel.periodo === "todos") return true;
      if (!U.ehISO(data)) return false;
      const hoje = U.hojeISO();
      if (sel.periodo === "30") return data >= U.somarDias(hoje, -30);
      if (sel.periodo === "90") return data >= U.somarDias(hoje, -90);
      const de = U.brParaISO(sel.de), ate = U.brParaISO(sel.ate);
      return (!de || data >= de) && (!ate || data <= ate);
    }
    const visiveis = () => atendimentos.filter(dentroDoPeriodo);

    function rotuloAtend(a) {
      const d = a.dados;
      return "Nº " + (d.numero || "-") + " · " + (U.ehISO(d.data) ? U.isoParaBR(d.data) : "sem data") + (d.hora ? " às " + d.hora : "") + (a.status !== "concluido" ? " · Rascunho" : "");
    }

    function renderAtend() {
      U.limpar(listaAtend);
      const vis = visiveis();
      if (!atendimentos.length) listaAtend.append(h("p", { class: "texto-suave" }, "Nenhum atendimento registrado."));
      else if (!vis.length) listaAtend.append(h("p", { class: "texto-suave" }, "Nenhum atendimento neste período."));
      for (const a of vis) {
        const inp = h("input", { type: "checkbox", checked: sel.atendimentos.has(a.id) || null });
        inp.addEventListener("change", () => { if (inp.checked) sel.atendimentos.add(a.id); else sel.atendimentos.delete(a.id); atualizarContagem(); });
        listaAtend.append(h("label", { class: "opcao opcao-caixa" }, inp, h("span", null, rotuloAtend(a))));
      }
      atualizarContagem();
    }
    function atualizarContagem() {
      const n = visiveis().filter(a => sel.atendimentos.has(a.id)).length;
      contagem.textContent = "Selecionados: " + n + " de " + U.plural(visiveis().length, "atendimento", "atendimentos") + " deste período.";
    }

    const chkCadastro = h("input", { type: "checkbox", checked: sel.cadastro || null });
    chkCadastro.addEventListener("change", () => { sel.cadastro = chkCadastro.checked; });

    const blocoAnamnese = h("div", { class: "lista-selecao" },
      anamneses.length ? anamneses.map(a => {
        const inp = h("input", { type: "checkbox", checked: sel.anamneses.has(a.id) || null });
        inp.addEventListener("change", () => { if (inp.checked) sel.anamneses.add(a.id); else sel.anamneses.delete(a.id); });
        return h("label", { class: "opcao opcao-caixa" }, inp, h("span", null, "Anamnese de " + (U.ehISO(a.dados.dataAvaliacao) ? U.isoParaBR(a.dados.dataAvaliacao) : "data não informada") + (a.status !== "concluido" ? " · Rascunho" : "")));
      }) : h("p", { class: "texto-suave" }, "Nenhuma anamnese registrada."));

    const campoDe = UI.campoSimples({ rotulo: "De", placeholder: "dd/mm/aaaa", inputmode: "numeric", larg: "meia", max: 10 });
    const campoAte = UI.campoSimples({ rotulo: "Até", placeholder: "dd/mm/aaaa", inputmode: "numeric", larg: "meia", max: 10 });
    for (const [c, k] of [[campoDe, "de"], [campoAte, "ate"]]) {
      c.input.addEventListener("input", () => { c.input.value = U.mascaraData(c.input.value); sel[k] = c.input.value; renderAtend(); });
      c.input.addEventListener("change", () => c.mostrarErro(c.input.value && !U.brParaISO(c.input.value) ? "Data inválida. Use dia/mês/ano." : ""));
    }
    const datas = h("div", { class: "linha-campos", hidden: true }, campoDe, campoAte);
    const periodo = UI.opcoesRadio({
      rotulo: "Período dos atendimentos", compacto: true, valor: "todos",
      opcoes: [{ valor: "todos", texto: "Todos" }, { valor: "30", texto: "Últimos 30 dias" }, { valor: "90", texto: "Últimos 90 dias" }, { valor: "datas", texto: "Escolher datas" }],
      onChange: v => { sel.periodo = v; datas.hidden = v !== "datas"; renderAtend(); }
    });
    const marcarTodos = UI.botao({ texto: "Marcar todos do período", variante: "discreto", onClick: () => { visiveis().forEach(a => sel.atendimentos.add(a.id)); renderAtend(); } });
    const desmarcar = UI.botao({ texto: "Desmarcar todos", variante: "discreto", onClick: () => { visiveis().forEach(a => sel.atendimentos.delete(a.id)); renderAtend(); } });

    const chkAssinatura = h("input", { type: "checkbox", checked: true });
    chkAssinatura.addEventListener("change", () => { sel.assinatura = chkAssinatura.checked; });

    const nomeArq = nomeDoArquivo(paciente);
    const formulario = h("div", { class: "pdf-escolha" },
      h("p", null, "Paciente: ", h("strong", null, R.nomeExibicao(paciente)), ". O arquivo terá apenas os dados deste paciente."),
      h("fieldset", { class: "grupo-opcoes" }, h("legend", { class: "rotulo" }, "Cadastro"),
        h("label", { class: "opcao opcao-caixa" }, chkCadastro, h("span", null, "Dados do cadastro e consentimentos"))),
      h("fieldset", { class: "grupo-opcoes" }, h("legend", { class: "rotulo" }, "Anamnese"), blocoAnamnese),
      h("fieldset", { class: "grupo-opcoes" }, h("legend", { class: "rotulo" }, "Atendimentos e evolução"),
        periodo, datas, listaAtend, contagem,
        atendimentos.length ? h("div", { class: "linha-botoes" }, marcarTodos, desmarcar) : null),
      h("fieldset", { class: "grupo-opcoes" }, h("legend", { class: "rotulo" }, "Assinatura"),
        h("label", { class: "opcao opcao-caixa" }, chkAssinatura, h("span", null, "Incluir linha para assinatura no final"))),
      h("p", { class: "texto-suave" }, "Nome do arquivo: ", h("strong", null, nomeArq)),
      espacoMsg);

    const btnCancelar = UI.botao({ texto: "Cancelar", variante: "secundario" });
    const btnGerar = UI.botao({ texto: "Baixar PDF", icone: "download", variante: "primario" });
    const dlg = UI.dialogo({ titulo: "Baixar em PDF", conteudo: formulario, acoes: [btnCancelar, btnGerar], largo: true });
    btnCancelar.addEventListener("click", () => dlg.fechar());
    renderAtend();

    btnGerar.addEventListener("click", () => {
      const escolhidosAn = anamneses.filter(a => sel.anamneses.has(a.id)).reverse();
      const escolhidosAt = visiveis().filter(a => sel.atendimentos.has(a.id));
      if (!sel.cadastro && !escolhidosAn.length && !escolhidosAt.length) {
        UI.mensagem(espacoMsg, { tipo: "alerta", titulo: "Nada selecionado", texto: "Marque pelo menos uma parte para incluir no PDF.", focar: true });
        return;
      }
      if (sel.periodo === "datas" && ((sel.de && !U.brParaISO(sel.de)) || (sel.ate && !U.brParaISO(sel.ate)))) {
        UI.mensagem(espacoMsg, { tipo: "alerta", titulo: "Confira as datas do período", texto: "Use dia/mês/ano, por exemplo 01/10/2026.", focar: true });
        return;
      }
      let periodoTexto = "";
      if (escolhidosAt.length) {
        const datasAt = escolhidosAt.map(a => a.dados.data).filter(U.ehISO).sort();
        if (datasAt.length) periodoTexto = "Atendimentos de " + U.isoParaBR(datasAt[0]) + " a " + U.isoParaBR(datasAt[datasAt.length - 1]);
      }
      const soAnamnese = !sel.cadastro && escolhidosAn.length && !escolhidosAt.length;
      const soAtend = !sel.cadastro && !escolhidosAn.length && escolhidosAt.length;
      let resultado;
      try {
        resultado = gerar({
          paciente, incluirCadastro: sel.cadastro, anamneses: escolhidosAn, atendimentos: escolhidosAt,
          assinatura: sel.assinatura, periodoTexto,
          titulo: soAnamnese ? "Ficha de anamnese" : soAtend ? (escolhidosAt.length === 1 ? "Registro de atendimento" : "Evolução dos atendimentos") : "Prontuário"
        });
      } catch (e) {
        console.error(e);
        UI.mensagem(espacoMsg, { tipo: "erro", texto: "O PDF não foi gerado e nada foi baixado. Motivo: " + e.message + " Tente recarregar a página.", focar: true });
        return;
      }
      baixar(resultado.blob, resultado.nomeArquivo);
      mostrarConfirmacao(dlg, resultado);
    });
  }

  function mostrarConfirmacao(dlg, resultado) {
    U.limpar(dlg.corpo);
    U.limpar(dlg.acoes);
    const arquivo = new File([resultado.blob], resultado.nomeArquivo, { type: "application/pdf" });
    const podeCompartilhar = aparelho() !== "computador" && navigator.canShare && navigator.canShare({ files: [arquivo] });
    dlg.corpo.append(
      UI.aviso({
        tipo: "sucesso", titulo: "PDF gerado e entregue ao navegador para download",
        texto: ["Arquivo: " + resultado.nomeArquivo + " (" + U.plural(resultado.paginas, "página", "páginas") + ", " + U.tamanhoArquivo(resultado.blob.size) + ")."].concat(ondeFoiSalvo()),
        focar: true
      }),
      h("p", { class: "texto-suave" }, "O sistema não tem acesso às suas pastas, por isso não consegue confirmar onde o navegador guardou o arquivo. Se ele não aparecer, use “Baixar novamente”."),
      UI.aviso({ tipo: "alerta", titulo: "Cuidado com o arquivo", texto: "O PDF contém dados de saúde e não tem senha. Guarde em local seguro e envie apenas à própria pessoa ou a quem ela autorizar.", semAnuncio: true })
    );
    const novamente = UI.botao({ texto: "Baixar novamente", icone: "download", variante: "secundario", onClick: () => baixar(resultado.blob, resultado.nomeArquivo) });
    const fechar = UI.botao({ texto: "Fechar", variante: "primario", onClick: () => dlg.fechar() });
    if (podeCompartilhar) {
      const compartilhar = UI.botao({
        texto: "Compartilhar ou salvar em Arquivos", icone: "upload", variante: "secundario",
        onClick: () => navigator.share({ files: [arquivo], title: resultado.nomeArquivo }).catch(() => {})
      });
      dlg.acoes.append(compartilhar);
    }
    dlg.acoes.append(novamente, fechar);
    const a = dlg.corpo.querySelector(".aviso");
    if (a) a.focus();
  }

  LB.pdf = { gerar, dialogo, limparTexto, nomeDoArquivo };
})(window.LB = window.LB || {});
