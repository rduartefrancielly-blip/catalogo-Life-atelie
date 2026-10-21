/* Configurações da profissional (guardadas cifradas, junto com os dados) e preferências de leitura (sem dados sensíveis). */
(function (LB) {
  "use strict";

  const ID = "config";

  function padrao() {
    return {
      id: ID, tipo: "config",
      profissional: { nome: "", registro: "", telefone: "", email: "", endereco: "", complemento: "" },
      ocultos: [],
      listas: LB.util.copia(LB.esquemas.LISTAS_PADRAO),
      consentimentos: LB.util.copia(LB.esquemas.CONSENTIMENTOS_PADRAO),
      perguntasExtras: [],
      politicaCorrecao: "guardar", // "guardar": mantém a versão anterior; "marcar": só registra data e motivo
      bloqueioMinutos: 15
    };
  }

  let atual = null;

  function carregar() {
    const salvo = LB.banco.obter(ID);
    const p = padrao();
    atual = salvo ? Object.assign(p, salvo, { profissional: Object.assign(p.profissional, salvo.profissional || {}) }) : p;
    return atual;
  }

  async function salvar(mudancas) {
    const novo = Object.assign({}, atual || carregar(), mudancas);
    atual = await LB.banco.salvar(novo);
    return atual;
  }

  // ---------- Preferências de leitura (ficam no navegador, sem dados de pacientes) ----------
  const ESCALAS_TEXTO = [100, 112.5, 125, 140];
  function lerPref(chave, padraoValor) {
    try { const v = localStorage.getItem("lb-pref-" + chave); return v == null ? padraoValor : JSON.parse(v); }
    catch (e) { return padraoValor; }
  }
  function gravarPref(chave, valor) {
    try { localStorage.setItem("lb-pref-" + chave, JSON.stringify(valor)); } catch (e) { /* navegador sem armazenamento: a preferência vale só nesta visita */ }
  }
  function aplicarPreferencias() {
    const nivel = lerPref("texto", 0);
    document.documentElement.style.fontSize = (ESCALAS_TEXTO[nivel] || 100) + "%";
    document.documentElement.classList.toggle("sem-movimento", !!lerPref("semMovimento", false));
  }
  function nivelTexto() { return lerPref("texto", 0); }
  function mudarTexto(delta) {
    const n = Math.max(0, Math.min(ESCALAS_TEXTO.length - 1, nivelTexto() + delta));
    gravarPref("texto", n);
    aplicarPreferencias();
    return n;
  }
  function semMovimento(valor) {
    if (valor === undefined) return !!lerPref("semMovimento", false);
    gravarPref("semMovimento", !!valor);
    aplicarPreferencias();
  }

  LB.config = {
    atual: () => atual || padrao(), carregar, salvar, padrao,
    aplicarPreferencias, nivelTexto, mudarTexto, semMovimento, ESCALAS_TEXTO
  };
})(window.LB = window.LB || {});
