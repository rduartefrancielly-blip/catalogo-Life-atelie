/* Configurações: identificação profissional, logotipo, fichas, consentimentos, correções, segurança, leitura e dados fictícios. */
(function (LB) {
  "use strict";
  const U = LB.util, UI = LB.ui, E = LB.esquemas;
  const { h } = U;
  LB.telas = LB.telas || {};

  function secao(id, titulo, descricao, conteudo) {
    return h("section", { class: "cartao secao-config", id: "cfg-" + id, "aria-labelledby": "cfg-" + id + "-t" },
      h("h2", { class: "cartao-titulo", id: "cfg-" + id + "-t", tabindex: "-1" }, titulo),
      descricao ? h("p", { class: "cartao-sub" }, descricao) : null, conteudo);
  }

  function baixarArquivo(conteudo, nome, tipo) {
    const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
    const a = h("a", { href: url, download: nome });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  LB.telas.configuracoes = function (main, _p, q) {
    LB.app.titulo("Configurações");
    let cfg = LB.config.atual();
    main.append(LB.telas.cabecalhoPagina("Configurações", "Cada parte tem seu próprio botão de salvar."));

    const SECOES = [
      ["profissional", "Identificação profissional"], ["marca", "Identidade visual"], ["fichas", "Fichas e campos"],
      ["consentimentos", "Textos dos consentimentos"], ["correcao", "Correção de registros"], ["seguranca", "Segurança e cópias"],
      ["leitura", "Leitura"], ["demo", "Dados fictícios"]
    ];
    main.append(h("nav", { class: "indice-config", "aria-label": "Partes desta página" }, h("p", { class: "rotulo" }, "Nesta página:"),
      h("ul", null, SECOES.map(([id, t]) => {
        const b = h("button", { type: "button", class: "botao-link" }, t);
        b.addEventListener("click", () => { const el = document.getElementById("cfg-" + id + "-t"); el.scrollIntoView({ block: "start" }); el.focus(); });
        return h("li", null, b);
      }))));

    // ---------- Identificação profissional ----------
    {
      const msg = h("div", { class: "msg-local" });
      const pr = cfg.profissional;
      const campos = {
        nome: UI.campoSimples({ rotulo: "Nome profissional", valor: pr.nome, opcional: true, ajuda: "Usado na saudação, como responsável padrão nas fichas e no PDF." }),
        registro: UI.campoSimples({ rotulo: "Registro profissional (CREFITO)", valor: pr.registro, opcional: true, placeholder: "Número do seu registro", larg: "meia" }),
        telefone: UI.campoSimples({ rotulo: "Telefone profissional", valor: pr.telefone, opcional: true, inputmode: "tel", larg: "meia" }),
        email: UI.campoSimples({ rotulo: "E-mail profissional", valor: pr.email, opcional: true, tipo: "email" }),
        endereco: UI.campoSimples({ rotulo: "Endereço ou cidade", valor: pr.endereco, opcional: true }),
        complemento: UI.campoSimples({ rotulo: "Linha extra", valor: pr.complemento, opcional: true, placeholder: "Ex.: Atendimento domiciliar" })
      };
      campos.telefone.input.addEventListener("input", () => { campos.telefone.input.value = U.mascaraTelefone(campos.telefone.input.value); });
      const salvar = UI.botao({ texto: "Salvar identificação", icone: "check", variante: "primario", onClick: async () => {
        const email = campos.email.input.value.trim();
        campos.email.mostrarErro(email && !U.emailValido(email) ? "Confira o e-mail." : "");
        if (email && !U.emailValido(email)) return;
        const novo = {};
        for (const k of Object.keys(campos)) novo[k] = campos[k].input.value.trim();
        try { cfg = await LB.config.salvar({ profissional: novo }); UI.mensagem(msg, { tipo: "sucesso", titulo: "Identificação salva", texto: "Vale para os próximos PDFs e fichas." }); }
        catch (e) { UI.mensagem(msg, { tipo: "erro", texto: "Não foi salvo. Tente de novo." }); }
      } });
      main.append(secao("profissional", "Identificação profissional", "Aparece no cabeçalho do PDF. Só entra o que você preencher aqui; nada é inventado.",
        [h("div", { class: "grade-campos" }, Object.values(campos)), salvar, msg]));
    }

    // ---------- Identidade visual ----------
    {
      const msg = h("div", { class: "msg-local" });
      const previa = h("div", { class: "previa-marca" }, LB.marca.bloco("lateral"));
      const logo = LB.marca.logo();
      const arquivo = h("input", { type: "file", id: "cfg-logo", accept: "image/png,image/jpeg,image/webp,image/svg+xml", class: "entrada-arquivo" });
      const enviar = UI.botao({ texto: "Usar este logotipo", icone: "upload", variante: "primario", onClick: async () => {
        if (!arquivo.files[0]) { UI.mensagem(msg, { tipo: "alerta", titulo: "Escolha a imagem", texto: "Selecione o arquivo do logotipo." }); return; }
        try { await LB.marca.definirLogo(arquivo.files[0]); LB.app.avisar({ tipo: "sucesso", titulo: "Logotipo atualizado", texto: "Ele aparece na navegação e no PDF." }); LB.app.redesenharTudo(); }
        catch (e) { UI.mensagem(msg, { tipo: "erro", texto: e.message }); }
      } });
      const remover = logo && logo.origem === "enviado" ? UI.botao({ texto: "Remover logotipo enviado", icone: "lixeira", variante: "discreto", onClick: async () => {
        await LB.marca.removerLogo(); LB.app.avisar({ tipo: "sucesso", titulo: "Logotipo removido" }); LB.app.redesenharTudo();
      } }) : null;
      main.append(secao("marca", "Identidade visual", null, [
        UI.aviso({ tipo: logo ? "info" : "alerta", semAnuncio: true,
          titulo: logo ? "Logotipo original em uso" : "Monograma provisório",
          texto: logo ? "O logotipo aparece na navegação e no cabeçalho do PDF, sem alterações de proporção." : "O arquivo original da marca não foi incluído. Enquanto isso, o sistema usa um monograma “LB” em texto. Envie o arquivo original (de preferência PNG com fundo transparente) para substituí-lo." }),
        previa,
        h("div", { class: "campo" }, h("label", { class: "rotulo", for: "cfg-logo" }, "Arquivo do logotipo"), h("p", { class: "campo-ajuda" }, "PNG, JPG, WEBP ou SVG, até 5 MB. Fica guardado neste aparelho."), arquivo),
        h("div", { class: "linha-botoes" }, enviar, remover), msg]));
    }

    // ---------- Fichas e campos ----------
    {
      const msg = h("div", { class: "msg-local" });
      const ocultos = new Set(cfg.ocultos || []);
      const NOMES = { cadastro: "Cadastro", anamnese: "Anamnese", atendimento: "Atendimento e evolução" };
      const listas = Object.keys(NOMES).map(f => {
        const itens = E.camposConfiguraveis(f);
        return h("details", { class: "bloco-detalhes" },
          h("summary", null, NOMES[f] + " — " + U.plural(itens.length, "item opcional", "itens opcionais")),
          h("fieldset", { class: "grupo-opcoes" }, h("legend", { class: "rotulo" }, "Mostrar na ficha"),
            h("div", { class: "opcoes opcoes-multiplas" }, itens.map(it => {
              const inp = h("input", { type: "checkbox", checked: !ocultos.has(it.chave) || null });
              inp.addEventListener("change", () => { if (inp.checked) ocultos.delete(it.chave); else ocultos.add(it.chave); });
              return h("label", { class: "opcao opcao-caixa" + (it.etapa ? " opcao-etapa" : "") }, inp, h("span", null, it.rotulo + (it.etapaTitulo ? " (" + it.etapaTitulo + ")" : "")));
            }))));
      });
      const tecnicas = UI.campoSimples({ rotulo: "Técnicas e recursos", tipo: "longo", linhas: 6, valor: (cfg.listas.tecnicas || []).join("\n"), ajuda: "Uma opção por linha. Usada em “Técnicas utilizadas” e “Condutas propostas”." });
      const regioes = UI.campoSimples({ rotulo: "Regiões do corpo", tipo: "longo", linhas: 8, valor: (cfg.listas.regioes || []).join("\n"), ajuda: "Uma opção por linha. Usada em “Regiões trabalhadas”." });
      const salvar = UI.botao({ texto: "Salvar fichas e listas", icone: "check", variante: "primario", onClick: async () => {
        const lt = tecnicas.input.value.split("\n").map(s => s.trim()).filter(Boolean);
        const lr = regioes.input.value.split("\n").map(s => s.trim()).filter(Boolean);
        if (!lt.length || !lr.length) { UI.mensagem(msg, { tipo: "alerta", titulo: "Lista vazia", texto: "Cada lista precisa de pelo menos uma opção." }); return; }
        try {
          cfg = await LB.config.salvar({ ocultos: Array.from(ocultos), listas: { tecnicas: lt, regioes: lr } });
          UI.mensagem(msg, { tipo: "sucesso", titulo: "Fichas atualizadas", texto: "As mudanças valem para os próximos preenchimentos. Dados já registrados continuam guardados e visíveis." });
        } catch (e) { UI.mensagem(msg, { tipo: "erro", texto: "Não foi salvo. Tente de novo." }); }
      } });

      // Perguntas adicionais
      const msgExtra = h("div", { class: "msg-local" });
      const listaExtras = h("ul", { class: "lista-simples" });
      function desenharExtras() {
        U.limpar(listaExtras);
        const ex = LB.config.atual().perguntasExtras || [];
        if (!ex.length) listaExtras.append(h("li", { class: "texto-suave" }, "Nenhuma pergunta adicional."));
        for (const pgt of ex) {
          listaExtras.append(h("li", null, h("span", null, NOMES[pgt.ficha] + ": " + pgt.rotulo + " (" + ({ texto: "texto curto", longo: "texto longo", simnao: "sim ou não" })[pgt.tipo] + ")"),
            UI.botao({ texto: "Remover", icone: "lixeira", variante: "discreto", onClick: async () => {
              const ok = await UI.confirmar({ titulo: "Remover esta pergunta?", texto: pgt.rotulo, efeito: "Ela deixa de aparecer nas fichas. Respostas já dadas continuam guardadas e aparecem como “Pergunta removida”.", confirmarTexto: "Remover pergunta", perigo: true });
              if (!ok) return;
              cfg = await LB.config.salvar({ perguntasExtras: LB.config.atual().perguntasExtras.filter(x => x.id !== pgt.id) });
              desenharExtras();
              UI.mensagem(msgExtra, { tipo: "sucesso", titulo: "Pergunta removida" });
            } })));
        }
      }
      desenharExtras();
      let fichaNova = "anamnese", tipoNovo = "texto";
      const textoPergunta = UI.campoSimples({ rotulo: "Pergunta", placeholder: "Ex.: Usa palmilha?" });
      const adicionar = UI.botao({ texto: "Adicionar pergunta", icone: "mais", variante: "secundario", onClick: async () => {
        const t = textoPergunta.input.value.trim();
        if (!t) { textoPergunta.mostrarErro("Escreva a pergunta."); textoPergunta.input.focus(); return; }
        textoPergunta.mostrarErro("");
        cfg = await LB.config.salvar({ perguntasExtras: (LB.config.atual().perguntasExtras || []).concat({ id: U.uid(), ficha: fichaNova, rotulo: t, tipo: tipoNovo }) });
        textoPergunta.input.value = "";
        desenharExtras();
        UI.mensagem(msgExtra, { tipo: "sucesso", titulo: "Pergunta adicionada", texto: "Ela aparece na etapa “Perguntas adicionais”, antes da revisão." });
      } });

      main.append(secao("fichas", "Fichas e campos", "Oculte o que você não usa e ajuste as listas. Campos obrigatórios sempre aparecem.", [
        listas, h("h3", { class: "titulo-sub" }, "Listas de opções"), h("div", { class: "grade-campos" }, tecnicas, regioes), salvar, msg,
        h("h3", { class: "titulo-sub" }, "Perguntas adicionais"), listaExtras,
        h("div", { class: "bloco-opcao" },
          UI.opcoesRadio({ rotulo: "Em qual ficha?", compacto: true, valor: fichaNova, opcoes: Object.entries(NOMES).map(([v, t]) => ({ valor: v, texto: t })), onChange: v => { fichaNova = v; } }),
          textoPergunta,
          UI.opcoesRadio({ rotulo: "Tipo de resposta", compacto: true, valor: tipoNovo, opcoes: [{ valor: "texto", texto: "Texto curto" }, { valor: "longo", texto: "Texto longo" }, { valor: "simnao", texto: "Sim ou não" }], onChange: v => { tipoNovo = v; } }),
          adicionar, msgExtra)]));
    }

    // ---------- Consentimentos ----------
    {
      const msg = h("div", { class: "msg-local" });
      const nomes = {}; E.FICHAS.cadastro.etapas.find(e => e.id === "consentimentos").campos.forEach(c => { nomes[c.id] = c.rotulo; });
      const campos = Object.keys(E.CONSENTIMENTOS_PADRAO).map(k => {
        const c = UI.campoSimples({ rotulo: nomes[k], tipo: "longo", linhas: 3, valor: cfg.consentimentos[k] || E.CONSENTIMENTOS_PADRAO[k] });
        c.chave = k;
        const restaurar = h("button", { type: "button", class: "botao-link" }, "Voltar ao texto sugerido");
        restaurar.addEventListener("click", () => { c.input.value = E.CONSENTIMENTOS_PADRAO[k]; c.input.focus(); });
        c.append(h("div", { class: "campo-rodape" }, restaurar));
        return c;
      });
      const salvar = UI.botao({ texto: "Salvar textos", icone: "check", variante: "primario", onClick: async () => {
        const novo = {};
        for (const c of campos) novo[c.chave] = c.input.value.trim() || E.CONSENTIMENTOS_PADRAO[c.chave];
        try { cfg = await LB.config.salvar({ consentimentos: novo }); UI.mensagem(msg, { tipo: "sucesso", titulo: "Textos salvos", texto: "Valem para os próximos registros. Cada resposta guarda o texto que foi apresentado na época." }); }
        catch (e) { UI.mensagem(msg, { tipo: "erro", texto: "Não foi salvo. Tente de novo." }); }
      } });
      main.append(secao("consentimentos", "Textos dos consentimentos", null, [
        UI.aviso({ tipo: "alerta", titulo: "Revise antes de usar com pacientes reais", texto: "Os textos abaixo são sugestões em linguagem simples. Eles não foram validados juridicamente; revise com orientação adequada.", semAnuncio: true }),
        campos, salvar, msg]));
    }

    // ---------- Correção ----------
    {
      const msg = h("div", { class: "msg-local" });
      let politica = cfg.politicaCorrecao;
      const radios = UI.opcoesRadio({
        rotulo: "Ao corrigir um registro concluído", valor: politica,
        opcoes: [{ valor: "guardar", texto: "Guardar a versão anterior no histórico (recomendado)" }, { valor: "marcar", texto: "Apenas registrar a data e o motivo da correção" }],
        onChange: v => { politica = v; }
      });
      const salvar = UI.botao({ texto: "Salvar regra", icone: "check", variante: "primario", onClick: async () => {
        cfg = await LB.config.salvar({ politicaCorrecao: politica });
        UI.mensagem(msg, { tipo: "sucesso", titulo: "Regra salva", texto: "Vale para as próximas correções." });
      } });
      main.append(secao("correcao", "Correção de registros", "Em todos os casos, o registro corrigido mostra “Corrigido em” com data e hora.", [radios, salvar, msg]));
    }

    // ---------- Segurança ----------
    {
      const msgBloq = h("div", { class: "msg-local" });
      let minutos = String(cfg.bloqueioMinutos || 15);
      const bloq = UI.opcoesRadio({
        rotulo: "Bloquear automaticamente após", compacto: true, valor: minutos,
        opcoes: ["5", "10", "15", "30", "60"].map(m => ({ valor: m, texto: m + " minutos sem uso" })),
        onChange: v => { minutos = v; }
      });
      const salvarBloq = UI.botao({ texto: "Salvar tempo de bloqueio", icone: "check", variante: "primario", onClick: async () => {
        cfg = await LB.config.salvar({ bloqueioMinutos: Number(minutos) });
        LB.app.reiniciarTimer();
        UI.mensagem(msgBloq, { tipo: "sucesso", titulo: "Tempo salvo", texto: "O sistema bloqueia após " + minutos + " minutos sem uso." });
      } });

      const msgSenha = h("div", { class: "msg-local" });
      const atual = UI.campoSimples({ rotulo: "Senha atual", tipo: "password", autocomplete: "current-password" });
      const nova = UI.campoSimples({ rotulo: "Nova senha", tipo: "password", autocomplete: "new-password", ajuda: "Pelo menos 8 caracteres." });
      const conf = UI.campoSimples({ rotulo: "Repita a nova senha", tipo: "password", autocomplete: "new-password" });
      const trocar = UI.botao({ texto: "Trocar senha", icone: "cadeado", variante: "primario", onClick: async () => {
        [atual, nova, conf].forEach(c => c.mostrarErro(""));
        if (nova.input.value.length < 8) { nova.mostrarErro("A nova senha precisa ter pelo menos 8 caracteres."); nova.input.focus(); return; }
        if (nova.input.value !== conf.input.value) { conf.mostrarErro("As senhas novas estão diferentes."); conf.input.focus(); return; }
        trocar.disabled = true;
        UI.mensagem(msgSenha, { tipo: "info", titulo: "Trocando a senha", texto: "Recifrando os dados. Não feche esta página." });
        try {
          const ok = await LB.banco.trocarSenha(atual.input.value, nova.input.value);
          trocar.disabled = false;
          if (!ok) { UI.mensagem(msgSenha, null); atual.mostrarErro("A senha atual está incorreta."); atual.input.focus(); return; }
          [atual, nova, conf].forEach(c => { c.input.value = ""; });
          UI.mensagem(msgSenha, { tipo: "sucesso", titulo: "Senha trocada", texto: "Use a nova senha na próxima entrada. Cópias de segurança antigas continuam abrindo com a senha antiga." });
        } catch (e) {
          trocar.disabled = false;
          UI.mensagem(msgSenha, { tipo: "erro", texto: "A senha não foi trocada. Os dados continuam com a senha antiga." });
        }
      } });

      const msgCopia = h("div", { class: "msg-local" });
      const exportar = UI.botao({ texto: "Exportar cópia de segurança", icone: "download", variante: "primario", onClick: async () => {
        try {
          const copia = await LB.banco.exportarCopia();
          const nome = "Copia-seguranca_LB-Fisioterapia_" + U.hojeISO() + ".json";
          baixarArquivo(JSON.stringify(copia), nome, "application/json");
          UI.mensagem(msgCopia, { tipo: "sucesso", titulo: "Cópia entregue ao navegador", texto: ["Arquivo: " + nome + ". Procure na pasta Downloads do aparelho.", "A cópia continua cifrada: para restaurar, será preciso a senha atual. Guarde-a em um local seguro, fora deste aparelho (por exemplo, um pen drive)."], focar: true });
        } catch (e) { UI.mensagem(msgCopia, { tipo: "erro", texto: "A cópia não foi gerada. " + e.message, focar: true }); }
      } });
      const arquivo = h("input", { type: "file", id: "cfg-copia", accept: ".json,application/json", class: "entrada-arquivo" });
      const senhaCopia = UI.campoSimples({ rotulo: "Senha usada quando a cópia foi feita", tipo: "password" });
      const importar = UI.botao({ texto: "Restaurar cópia", icone: "upload", variante: "secundario", onClick: async () => {
        if (!arquivo.files[0]) { UI.mensagem(msgCopia, { tipo: "alerta", titulo: "Escolha o arquivo", texto: "Selecione o arquivo da cópia de segurança.", focar: true }); return; }
        const ok = await UI.confirmar({ titulo: "Restaurar a cópia?", texto: "Os dados atuais deste aparelho serão substituídos pelos da cópia.", efeito: "Tudo o que foi registrado depois da data da cópia será perdido. A senha passa a ser a da cópia. Se tiver dúvida, exporte antes uma cópia dos dados atuais.", confirmarTexto: "Substituir pelos dados da cópia", perigo: true });
        if (!ok) return;
        try {
          const copia = JSON.parse(await arquivo.files[0].text());
          const certo = await LB.banco.importarCopia(copia, senhaCopia.input.value);
          if (!certo) { senhaCopia.mostrarErro("Esta senha não abre a cópia escolhida. Nada foi alterado."); return; }
          LB.config.carregar();
          LB.app.avisar({ tipo: "sucesso", titulo: "Cópia restaurada", texto: "A senha agora é a mesma usada na época da cópia." });
          LB.app.ir("#/painel");
        } catch (e) { UI.mensagem(msgCopia, { tipo: "erro", texto: "Não foi possível ler a cópia. Nada foi alterado. " + e.message, focar: true }); }
      } });

      const apagar = UI.botao({ texto: "Apagar todos os dados deste aparelho", icone: "lixeira", variante: "perigo", onClick: async () => {
        const ok = await UI.confirmar({ titulo: "Apagar todos os dados?", texto: "Esta ação não pode ser desfeita.", efeito: "Todos os pacientes, fichas, documentos, configurações e a senha deste aparelho serão apagados. PDFs e cópias já baixados não são afetados.", confirmarTexto: "Apagar tudo", perigo: true });
        if (!ok) return;
        await LB.banco.apagarTudo();
        location.hash = "#/painel";
        LB.app.render();
      } });

      main.append(secao("seguranca", "Segurança e cópias", null, [
        bloq, salvarBloq, msgBloq,
        h("h3", { class: "titulo-sub" }, "Trocar senha"), atual, nova, conf, trocar, msgSenha,
        h("h3", { class: "titulo-sub" }, "Cópia de segurança"),
        h("p", null, "Os dados ficam só neste aparelho. Exporte uma cópia com frequência (por exemplo, toda semana)."),
        exportar,
        h("div", { class: "bloco-opcao" },
          h("div", { class: "campo" }, h("label", { class: "rotulo", for: "cfg-copia" }, "Restaurar a partir de uma cópia (.json)"), arquivo),
          senhaCopia, importar),
        msgCopia,
        h("h3", { class: "titulo-sub" }, "Apagar tudo"), apagar]));
    }

    // ---------- Leitura ----------
    {
      const niveis = LB.config.ESCALAS_TEXTO.map((v, i) => ({ valor: String(i), texto: ["Normal", "Grande", "Maior", "Muito grande"][i] + " (" + String(v).replace(".", ",") + "%)" }));
      const tamanho = UI.opcoesRadio({ rotulo: "Tamanho do texto", compacto: true, valor: String(LB.config.nivelTexto()), opcoes: niveis, onChange: v => { LB.config.mudarTexto(Number(v) - LB.config.nivelTexto()); } });
      const mov = h("input", { type: "checkbox", checked: LB.config.semMovimento() || null });
      mov.addEventListener("change", () => LB.config.semMovimento(mov.checked));
      main.append(secao("leitura", "Leitura", "Vale na hora e fica guardado neste navegador. Também há atalhos na barra lateral.", [
        tamanho, h("label", { class: "opcao opcao-caixa" }, mov, h("span", null, "Reduzir movimento (desliga rolagens suaves e transições)"))]));
    }

    // ---------- Fictícios ----------
    {
      const msg = h("div", { class: "msg-local" });
      const existe = LB.demo.existe();
      const botao = existe
        ? UI.botao({ texto: "Remover pacientes fictícios", icone: "lixeira", variante: "perigo", onClick: async () => {
          const ok = await UI.confirmar({ titulo: "Remover os pacientes fictícios?", texto: "Somente os registros marcados como “Fictício” serão apagados.", efeito: "Pacientes que você cadastrou não são afetados.", confirmarTexto: "Remover fictícios", perigo: true });
          if (!ok) return;
          const n = await LB.demo.remover();
          LB.app.avisar({ tipo: "sucesso", titulo: "Fictícios removidos", texto: U.plural(n, "registro apagado", "registros apagados") + "." });
          LB.app.render();
        } })
        : UI.botao({ texto: "Carregar pacientes fictícios", icone: "mais", variante: "secundario", onClick: async () => {
          await LB.demo.carregar();
          LB.app.avisar({ tipo: "sucesso", titulo: "Fictícios carregados", texto: "Eles aparecem marcados como “Fictício”." });
          LB.app.render();
        } });
      main.append(secao("demo", "Dados fictícios", existe ? "Há pacientes fictícios no sistema. Remova-os antes de usar com pacientes reais." : "Nenhum paciente fictício no sistema.", [botao, msg]));
    }

    if (q.secao) {
      const el = document.getElementById("cfg-" + q.secao + "-t");
      if (el) setTimeout(() => { el.scrollIntoView({ block: "start" }); el.focus(); }, 0);
    }
  };
})(window.LB = window.LB || {});
