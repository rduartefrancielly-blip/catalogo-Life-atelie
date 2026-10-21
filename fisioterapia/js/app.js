/* Estrutura geral: navegação, rotas, bloqueio por inatividade e mensagens após salvar. */
(function (LB) {
  "use strict";
  const U = LB.util, UI = LB.ui;
  const { h } = U;
  const NOME_APP = "Letícia Bernucci Fisioterapia";

  const raiz = document.getElementById("app");
  let main = null, telaAtual = null, rotaAtual = null, ignorarProxima = false;
  let flash = null, timerBloqueio = null, renderizando = false;

  const NAV = [
    { rota: "#/painel", texto: "Painel", icone: "painel", ativo: r => r.startsWith("#/painel") },
    { rota: "#/pacientes", texto: "Pacientes", icone: "pacientes", ativo: r => r.startsWith("#/pacientes") || r.startsWith("#/paciente/") },
    { rota: "#/novo-atendimento", texto: "Novo atendimento", icone: "atendimento", ativo: r => r.startsWith("#/novo-atendimento"), destaque: true },
    { rota: "#/configuracoes", texto: "Configurações", icone: "config", ativo: r => r.startsWith("#/configuracoes") }
  ];

  const ROTAS = [
    [/^#\/painel$/, "painel"],
    [/^#\/pacientes$/, "pacientes"],
    [/^#\/pacientes\/novo$/, "cadastroNovo"],
    [/^#\/paciente\/([\w-]+)$/, "perfil"],
    [/^#\/paciente\/([\w-]+)\/cadastro$/, "cadastroEditar"],
    [/^#\/paciente\/([\w-]+)\/anamnese\/nova$/, "anamneseNova"],
    [/^#\/paciente\/([\w-]+)\/anamnese\/([\w-]+)$/, "anamneseVer"],
    [/^#\/paciente\/([\w-]+)\/anamnese\/([\w-]+)\/editar$/, "anamneseEditar"],
    [/^#\/paciente\/([\w-]+)\/atendimento\/novo$/, "atendimentoNovo"],
    [/^#\/paciente\/([\w-]+)\/atendimento\/([\w-]+)$/, "atendimentoVer"],
    [/^#\/paciente\/([\w-]+)\/atendimento\/([\w-]+)\/editar$/, "atendimentoEditar"],
    [/^#\/novo-atendimento$/, "novoAtendimento"],
    [/^#\/configuracoes$/, "configuracoes"],
    [/^#\/sobre$/, "sobre"]
  ];

  function separarRota(hash) {
    const [caminho, consulta] = (hash || "").split("?");
    const q = {};
    new URLSearchParams(consulta || "").forEach((v, k) => { q[k] = v; });
    return { caminho, q };
  }

  // ---------- Casca (navegação) ----------
  function controlesLeitura() {
    const nivel = h("span", { class: "nivel-texto", "aria-live": "polite" });
    const atualizar = () => { nivel.textContent = "Texto: " + LB.config.ESCALAS_TEXTO[LB.config.nivelTexto()] + "%"; };
    const menor = h("button", { type: "button", class: "botao-mini", "aria-label": "Diminuir o tamanho do texto" }, "A−");
    const maior = h("button", { type: "button", class: "botao-mini", "aria-label": "Aumentar o tamanho do texto" }, "A+");
    menor.addEventListener("click", () => { LB.config.mudarTexto(-1); atualizar(); });
    maior.addEventListener("click", () => { LB.config.mudarTexto(1); atualizar(); });
    const mov = h("input", { type: "checkbox", checked: LB.config.semMovimento() || null });
    mov.addEventListener("change", () => LB.config.semMovimento(mov.checked));
    atualizar();
    return h("div", { class: "controles-leitura" },
      h("div", { class: "linha-texto" }, menor, nivel, maior),
      h("label", { class: "opcao-simples" }, mov, h("span", null, "Reduzir movimento")));
  }

  function montarCasca() {
    const itens = NAV.map(n => h("li", null, h("a", { href: n.rota, class: "nav-link" + (n.destaque ? " nav-destaque" : ""), "data-rota": n.rota }, UI.icone(n.icone), h("span", null, n.texto))));
    const bloquearBtn = () => UI.botao({ texto: "Bloquear", icone: "cadeado", variante: "discreto", classe: "botao-bloquear", onClick: () => bloquear("manual") });
    const lateral = h("aside", { class: "lateral", "aria-label": "Navegação principal" },
      h("a", { href: "#/painel", class: "lateral-marca", "aria-label": "Ir para o painel" }, LB.marca.bloco("lateral")),
      h("hr", { class: "divisor-dourado" }),
      h("nav", { "aria-label": "Seções" }, h("ul", { class: "nav-lista" }, itens)),
      h("div", { class: "lateral-rodape" },
        controlesLeitura(),
        bloquearBtn(),
        h("a", { href: "#/sobre", class: "aviso-prototipo" }, UI.icone("escudo"), h("span", null, "Protótipo · dados só neste aparelho. Saiba mais"))));
    const topo = h("header", { class: "topo-movel" },
      h("a", { href: "#/painel", class: "topo-marca", "aria-label": "Ir para o painel" }, LB.marca.bloco("topo")),
      bloquearBtn());
    main = h("main", { id: "conteudo", class: "conteudo", tabindex: "-1" });
    const inferior = h("nav", { class: "nav-inferior", "aria-label": "Navegação principal" },
      h("ul", null, NAV.map(n => h("li", null, h("a", { href: n.rota, class: "nav-link", "data-rota": n.rota }, UI.icone(n.icone), h("span", null, n.texto === "Novo atendimento" ? "Atender" : n.texto))))));
    U.limpar(raiz).append(h("div", { class: "casca" }, lateral, topo, h("div", { class: "area-principal" },
      h("aside", { class: "faixa-prototipo", "aria-label": "Aviso sobre o protótipo" }, UI.icone("info"), h("span", null, "Versão protótipo, ainda não validada para dados reais de pacientes. "), h("a", { href: "#/sobre" }, "Entenda os limites")),
      main), inferior));
  }

  function marcarNav(rota) {
    raiz.querySelectorAll(".nav-link").forEach(a => {
      const n = NAV.find(x => x.rota === a.dataset.rota);
      const ativo = n && n.ativo(rota);
      a.classList.toggle("ativo", !!ativo);
      if (ativo) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  // ---------- Rotas ----------
  async function render() {
    if (renderizando) return;
    renderizando = true;
    try {
      if (!LB.banco.aberto()) { await LB.telas.acesso(raiz); return; }
      if (!main || !document.body.contains(main)) montarCasca();
      let hash = location.hash || "#/painel";
      if (hash === "#" || hash === "#/") hash = "#/painel";
      const { caminho, q } = separarRota(hash);
      rotaAtual = hash;
      marcarNav(caminho);
      telaAtual = null;
      U.limpar(main);
      const rota = ROTAS.find(([re]) => re.test(caminho));
      if (!rota) { LB.telas.naoEncontrado(main); }
      else {
        const params = caminho.match(rota[0]).slice(1);
        telaAtual = (await LB.telas[rota[1]](main, params, q)) || null;
      }
      mostrarFlash();
      if (!main.contains(document.activeElement) || document.activeElement === main) {
        const alvo = main.querySelector(".aviso[tabindex='-1']") || main.querySelector("h1");
        if (alvo) { if (!alvo.hasAttribute("tabindex")) alvo.setAttribute("tabindex", "-1"); alvo.focus(); }
      }
      window.scrollTo(0, 0);
    } catch (e) {
      console.error(e);
      if (main) {
        U.limpar(main).append(UI.aviso({ tipo: "erro", titulo: "Algo deu errado ao abrir esta tela", texto: "Seus dados salvos não foram afetados. Volte ao painel e tente de novo.", acoes: [UI.botao({ texto: "Ir para o painel", href: "#/painel", variante: "primario" })] }));
      }
    } finally {
      renderizando = false;
    }
  }

  let saindo = false;
  window.addEventListener("hashchange", async () => {
    if (ignorarProxima) { ignorarProxima = false; return; }
    if (telaAtual && telaAtual.antesDeSair) {
      const destino = location.hash;
      saindo = true;
      let ok;
      try { ok = await telaAtual.antesDeSair(); } finally { saindo = false; }
      if (!ok) { ignorarProxima = true; location.hash = rotaAtual; return; }
      if (location.hash !== destino) history.replaceState(null, "", destino);
    }
    render();
  });

  window.addEventListener("beforeunload", ev => {
    if (telaAtual && telaAtual.temPendente && telaAtual.temPendente()) {
      if (telaAtual.salvarAgora) telaAtual.salvarAgora();
      ev.preventDefault();
      ev.returnValue = "";
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && telaAtual && telaAtual.salvarAgora && telaAtual.temPendente && telaAtual.temPendente()) telaAtual.salvarAgora();
  });

  function ir(rota) { location.hash = rota; }
  // Troca o endereço sem recarregar a tela (ex.: rascunho recém-criado ganha seu próprio endereço).
  function substituirRota(rota) {
    if (saindo) return; // a tela já está sendo trocada: não mexe no endereço de destino
    history.replaceState(null, "", rota);
    rotaAtual = rota;
  }
  function titulo(t) { document.title = t ? t + " — " + NOME_APP : NOME_APP; }

  // Mensagem que aparece na próxima tela (ex.: "Atendimento registrado").
  function avisar(o) { flash = o; }
  function mostrarFlash() {
    if (!flash || !main) return;
    const a = UI.aviso(Object.assign({ focar: true }, flash));
    flash = null;
    const ancora = main.querySelector(".cabecalho-pagina");
    if (ancora) ancora.after(a); else main.prepend(a);
    a.focus();
  }

  // ---------- Bloqueio ----------
  async function bloquear(motivo) {
    if (telaAtual && telaAtual.salvarAgora && telaAtual.temPendente && telaAtual.temPendente()) {
      try { await telaAtual.salvarAgora(); } catch (e) { /* o formulário mostra a falha */ }
    }
    document.querySelectorAll("dialog").forEach(d => d.remove());
    LB.banco.bloquear();
    telaAtual = null;
    main = null;
    clearTimeout(timerBloqueio);
    LB.telas.motivoBloqueio = motivo;
    titulo("");
    render();
  }

  function reiniciarTimer() {
    clearTimeout(timerBloqueio);
    if (!LB.banco.aberto()) return;
    const min = Number(LB.config.atual().bloqueioMinutos) || 0;
    if (min > 0) timerBloqueio = setTimeout(() => bloquear("inatividade"), min * 60000);
  }
  ["pointerdown", "keydown", "input", "scroll", "touchstart"].forEach(ev => document.addEventListener(ev, () => { if (LB.banco.aberto()) reiniciarTimer(); }, { passive: true, capture: true }));

  LB.banco.aoMudar((ev, deOutraAba) => {
    if (!deOutraAba) return;
    if (!LB.banco.aberto()) { main = null; telaAtual = null; LB.telas.motivoBloqueio = "outra-aba"; render(); }
  });

  async function iniciar() {
    LB.config.aplicarPreferencias();
    const pular = document.getElementById("pular");
    if (pular) pular.addEventListener("click", () => {
      const alvo = document.getElementById("conteudo");
      if (alvo) { alvo.focus(); alvo.scrollIntoView({ block: "start" }); }
    });
    try {
      await LB.banco.abrir();
    } catch (e) {
      U.limpar(raiz).append(h("div", { class: "acesso" }, h("div", { class: "acesso-caixa" },
        LB.marca.bloco("acesso"),
        UI.aviso({ tipo: "erro", titulo: "Este navegador não permite guardar os dados", texto: [e.message, "Tente abrir em uma janela normal (não anônima) do Chrome, Edge, Firefox ou Safari atualizados."] }))));
      return;
    }
    await LB.marca.iniciar();
    render();
  }

  // Chamado pela tela de acesso depois de desbloquear.
  function aposEntrar(rota) {
    LB.config.carregar();
    main = null;
    reiniciarTimer();
    if (rota && location.hash !== rota) location.hash = rota; // a troca de endereço já redesenha a tela
    else render();
  }

  // Redesenha também a navegação (ex.: depois de trocar o logotipo).
  function redesenharTudo() { main = null; render(); }

  LB.app = { iniciar, ir, substituirRota, titulo, avisar, bloquear, aposEntrar, render, redesenharTudo, reiniciarTimer, NOME_APP };
  document.addEventListener("DOMContentLoaded", iniciar);
})(window.LB = window.LB || {});
