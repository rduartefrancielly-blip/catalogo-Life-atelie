/* Telas de acesso: criar senha (primeiro uso), entrar, esqueci a senha e restaurar cópia. */
(function (LB) {
  "use strict";
  const U = LB.util, UI = LB.ui;
  const { h } = U;
  LB.telas = LB.telas || {};

  function campoSenha(rotulo, autocomplete, ajuda) {
    const c = UI.campoSimples({ rotulo, tipo: "password", autocomplete, obrig: true, ajuda });
    const mostrar = h("button", { type: "button", class: "botao-link", "aria-pressed": "false" }, "Mostrar senha");
    mostrar.addEventListener("click", () => {
      const visivel = c.input.type === "text";
      c.input.type = visivel ? "password" : "text";
      mostrar.textContent = visivel ? "Mostrar senha" : "Ocultar senha";
      mostrar.setAttribute("aria-pressed", visivel ? "false" : "true");
    });
    c.append(h("div", { class: "campo-rodape" }, mostrar));
    return c;
  }

  function moldura(conteudo) {
    return h("div", { class: "acesso" }, h("main", { class: "acesso-caixa", id: "conteudo" },
      LB.marca.bloco("acesso"), h("hr", { class: "divisor-dourado" }), conteudo));
  }

  async function acesso(raiz) {
    const estado = await LB.banco.estado();
    LB.app.titulo(estado === "novo" ? "Primeiro acesso" : "Entrar");
    if (estado === "novo") return telaCriar(raiz);
    return telaEntrar(raiz);
  }

  function telaCriar(raiz) {
    const msg = h("div", { class: "form-mensagem" });
    const senha = campoSenha("Crie uma senha", "new-password", "Pelo menos 8 caracteres. Use algo que você lembre, mas que outras pessoas não adivinhem.");
    const conf = campoSenha("Repita a senha", "new-password");
    const entendi = h("input", { type: "checkbox", id: "entendi" });
    const demo = h("input", { type: "checkbox", id: "demo", checked: true });
    const botao = UI.botao({ texto: "Criar senha e entrar", icone: "cadeado", variante: "primario", grande: true, tipo: "submit" });
    const form = h("form", { class: "acesso-form", novalidate: true },
      h("h1", { class: "titulo-pagina", tabindex: "-1" }, "Primeiro acesso"),
      h("p", null, "Este sistema guarda os dados dos pacientes somente neste aparelho, protegidos por uma senha. Nada é enviado para a internet."),
      UI.aviso({ tipo: "alerta", titulo: "Guarde bem a sua senha", texto: "Sem ela, não é possível abrir os dados. Não existe recuperação de senha.", semAnuncio: true }),
      senha, conf,
      h("label", { class: "opcao opcao-caixa" }, entendi, h("span", null, "Entendi que, se eu esquecer a senha, os dados deste aparelho não poderão ser recuperados.")),
      h("label", { class: "opcao opcao-caixa" }, demo, h("span", null, "Carregar pacientes fictícios para conhecer o sistema (você pode remover depois, em Configurações).")),
      msg, botao);
    form.addEventListener("submit", async ev => {
      ev.preventDefault();
      senha.mostrarErro(""); conf.mostrarErro("");
      if (senha.input.value.length < 8) { senha.mostrarErro("A senha precisa ter pelo menos 8 caracteres."); senha.input.focus(); return; }
      if (senha.input.value !== conf.input.value) { conf.mostrarErro("As duas senhas estão diferentes. Digite de novo."); conf.input.focus(); return; }
      if (!entendi.checked) { UI.mensagem(msg, { tipo: "alerta", titulo: "Falta confirmar", texto: "Marque a caixa “Entendi que, se eu esquecer a senha…” para continuar.", focar: true }); return; }
      botao.disabled = true;
      UI.mensagem(msg, { tipo: "info", titulo: "Preparando", texto: "Criando a proteção dos dados. Isso leva alguns segundos." });
      try {
        await LB.banco.criar(senha.input.value);
        LB.config.carregar();
        if (demo.checked) await LB.demo.carregar();
        LB.app.avisar({ tipo: "sucesso", titulo: "Tudo pronto", texto: demo.checked ? "Os pacientes marcados como “Fictício” servem só para teste. Para começar, use “Novo atendimento” ou “Cadastrar paciente”." : "Para começar, use “Cadastrar paciente”." });
        LB.app.aposEntrar("#/painel");
      } catch (e) {
        console.error(e);
        botao.disabled = false;
        UI.mensagem(msg, { tipo: "erro", texto: "Não foi possível criar a senha neste navegador. " + e.message, focar: true });
      }
    });
    U.limpar(raiz).append(moldura(form));
    form.querySelector("h1").focus();
  }

  function telaEntrar(raiz) {
    const msg = h("div", { class: "form-mensagem" });
    const senha = campoSenha("Senha", "current-password");
    const botao = UI.botao({ texto: "Entrar", icone: "cadeado", variante: "primario", grande: true, tipo: "submit" });
    const motivos = {
      inatividade: "O sistema foi bloqueado por falta de uso. O que estava preenchido foi salvo.",
      manual: "Sistema bloqueado. Os dados estão salvos.",
      "outra-aba": "O sistema foi bloqueado porque os dados mudaram em outra aba (por exemplo, troca de senha ou restauração de cópia)."
    };
    const motivo = LB.telas.motivoBloqueio;
    LB.telas.motivoBloqueio = null;
    let tentativas = 0;
    const esqueci = h("button", { type: "button", class: "botao-link" }, "Esqueci a senha");
    esqueci.addEventListener("click", () => telaEsqueci(raiz));
    const form = h("form", { class: "acesso-form", novalidate: true },
      h("h1", { class: "titulo-pagina", tabindex: "-1" }, "Entrar"),
      motivo ? UI.aviso({ tipo: "info", texto: motivos[motivo] || motivos.manual, semAnuncio: true }) : null,
      h("p", null, "Digite sua senha para abrir os dados deste aparelho."),
      senha, msg, botao, h("p", { class: "acesso-rodape" }, esqueci));
    form.addEventListener("submit", async ev => {
      ev.preventDefault();
      senha.mostrarErro("");
      if (!senha.input.value) { senha.mostrarErro("Digite a senha."); senha.input.focus(); return; }
      botao.disabled = true;
      UI.mensagem(msg, { tipo: "info", titulo: "Abrindo", texto: "Conferindo a senha…" });
      try {
        const ok = await LB.banco.desbloquear(senha.input.value);
        if (!ok) {
          tentativas++;
          const espera = tentativas >= 5 ? 5000 : 0;
          UI.mensagem(msg, null);
          senha.mostrarErro("Senha incorreta. Confira maiúsculas, minúsculas e acentos." + (espera ? " Aguarde 5 segundos para tentar de novo." : ""));
          senha.input.select();
          setTimeout(() => { botao.disabled = false; }, espera);
          return;
        }
        LB.app.aposEntrar(!location.hash || location.hash === "#" ? "#/painel" : null);
      } catch (e) {
        console.error(e);
        botao.disabled = false;
        UI.mensagem(msg, { tipo: "erro", texto: e.message, focar: true });
      }
    });
    U.limpar(raiz).append(moldura(form));
    senha.input.focus();
  }

  function telaEsqueci(raiz) {
    LB.app.titulo("Esqueci a senha");
    const msg = h("div", { class: "form-mensagem" });
    const voltar = UI.botao({ texto: "Voltar para entrar", icone: "voltar", variante: "secundario", onClick: () => telaEntrar(raiz) });

    const arquivo = h("input", { type: "file", id: "arquivo-copia", accept: ".json,application/json", class: "entrada-arquivo" });
    const senhaCopia = campoSenha("Senha usada quando a cópia foi feita", "off");
    const restaurar = UI.botao({ texto: "Restaurar cópia", icone: "upload", variante: "primario", onClick: async () => {
      if (!arquivo.files[0]) { UI.mensagem(msg, { tipo: "alerta", titulo: "Escolha o arquivo", texto: "Selecione o arquivo da cópia de segurança.", focar: true }); return; }
      try {
        const copia = JSON.parse(await arquivo.files[0].text());
        const ok = await LB.banco.importarCopia(copia, senhaCopia.input.value);
        if (!ok) { senhaCopia.mostrarErro("Esta senha não abre a cópia escolhida."); return; }
        LB.app.avisar({ tipo: "sucesso", titulo: "Cópia restaurada", texto: "A senha agora é a mesma usada na época da cópia." });
        LB.app.aposEntrar("#/painel");
      } catch (e) {
        UI.mensagem(msg, { tipo: "erro", texto: "Não foi possível ler a cópia. " + e.message, focar: true });
      }
    } });

    const confirmacao = UI.campoSimples({ rotulo: "Para confirmar, digite APAGAR", ajuda: "Isso apaga todos os pacientes, fichas e documentos deste aparelho." });
    const apagar = UI.botao({ texto: "Apagar tudo e começar de novo", icone: "lixeira", variante: "perigo", onClick: async () => {
      if (confirmacao.input.value.trim().toUpperCase() !== "APAGAR") { confirmacao.mostrarErro("Digite APAGAR (em letras maiúsculas) para confirmar."); confirmacao.input.focus(); return; }
      const ok = await UI.confirmar({ titulo: "Apagar todos os dados?", texto: "Esta ação não pode ser desfeita.", efeito: "Todos os pacientes, anamneses, atendimentos e documentos deste aparelho serão apagados. PDFs já baixados e cópias de segurança não são afetados.", confirmarTexto: "Apagar tudo", perigo: true });
      if (!ok) return;
      await LB.banco.apagarTudo();
      LB.app.render();
    } });

    const conteudo = h("div", { class: "acesso-form" },
      h("h1", { class: "titulo-pagina", tabindex: "-1" }, "Esqueci a senha"),
      h("p", null, "Por segurança, a senha não pode ser recuperada: os dados ficam cifrados e só abrem com ela. Você tem duas opções:"),
      h("section", { class: "bloco-opcao" },
        h("h2", null, "1. Restaurar uma cópia de segurança"),
        h("p", null, "Se você exportou uma cópia em Configurações, pode restaurá-la com a senha que usava na época. Os dados atuais deste aparelho serão substituídos."),
        h("div", { class: "campo" }, h("label", { class: "rotulo", for: "arquivo-copia" }, "Arquivo da cópia (.json)"), arquivo),
        senhaCopia, restaurar),
      h("section", { class: "bloco-opcao" },
        h("h2", null, "2. Apagar tudo e começar de novo"),
        confirmacao, apagar),
      msg, voltar);
    U.limpar(raiz).append(moldura(conteudo));
    conteudo.querySelector("h1").focus();
  }

  LB.telas.acesso = acesso;
})(window.LB = window.LB || {});
