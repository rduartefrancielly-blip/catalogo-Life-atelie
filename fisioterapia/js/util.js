/* Funções de apoio: datas no formato brasileiro, máscaras, validações e construção segura de elementos. */
(function (LB) {
  "use strict";

  const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

  function doisDigitos(n) { return String(n).padStart(2, "0"); }

  // Datas são guardadas como "aaaa-mm-dd" (ISO) e exibidas como "dd/mm/aaaa".
  function hojeISO(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + doisDigitos(d.getMonth() + 1) + "-" + doisDigitos(d.getDate());
  }
  function agoraHora(d) {
    d = d || new Date();
    return doisDigitos(d.getHours()) + ":" + doisDigitos(d.getMinutes());
  }
  function ehISO(v) { return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v); }
  function isoParaBR(v) {
    if (!ehISO(v)) return v || "";
    const [a, m, d] = v.split("-");
    return d + "/" + m + "/" + a;
  }
  // Aceita "dd/mm/aaaa" (ou com traços/pontos). Devolve ISO ou null.
  function brParaISO(texto) {
    if (!texto) return null;
    const m = String(texto).trim().match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);
    if (!m) return null;
    const d = +m[1], mes = +m[2], a = +m[3];
    const data = new Date(a, mes - 1, d);
    if (data.getFullYear() !== a || data.getMonth() !== mes - 1 || data.getDate() !== d) return null;
    return a + "-" + doisDigitos(mes) + "-" + doisDigitos(d);
  }
  function isoParaData(v) {
    if (!ehISO(v)) return null;
    const [a, m, d] = v.split("-").map(Number);
    return new Date(a, m - 1, d);
  }
  function dataExtenso(d) {
    d = d || new Date();
    return DIAS[d.getDay()] + ", " + d.getDate() + " de " + MESES[d.getMonth()] + " de " + d.getFullYear();
  }
  // Data e hora de um carimbo (ms) — "21/10/2026 às 14:32"
  function carimbo(ms) {
    if (!ms) return "";
    const d = new Date(ms);
    return isoParaBR(hojeISO(d)) + " às " + agoraHora(d);
  }
  function horaDe(ms) { return ms ? agoraHora(new Date(ms)) : ""; }
  function diasEntre(isoA, isoB) {
    const a = isoParaData(isoA), b = isoParaData(isoB);
    if (!a || !b) return null;
    return Math.round((b - a) / 86400000);
  }
  function somarDias(iso, n) {
    const d = isoParaData(iso);
    d.setDate(d.getDate() + n);
    return hojeISO(d);
  }
  function idade(isoNascimento) {
    const n = isoParaData(isoNascimento);
    if (!n) return null;
    const h = new Date();
    let i = h.getFullYear() - n.getFullYear();
    if (h.getMonth() < n.getMonth() || (h.getMonth() === n.getMonth() && h.getDate() < n.getDate())) i--;
    return i;
  }
  function horaValida(t) { return /^([01]\d|2[0-3]):[0-5]\d$/.test(t || ""); }

  // ---------- Máscaras ----------
  function soDigitos(v) { return String(v || "").replace(/\D/g, ""); }
  function mascaraTelefone(v) {
    const d = soDigitos(v).slice(0, 11);
    if (d.length <= 2) return d.length ? "(" + d : "";
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  }
  function mascaraCPF(v) {
    const d = soDigitos(v).slice(0, 11);
    return d.replace(/^(\d{3})(\d)/, "$1.$2").replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
  }
  function mascaraCEP(v) {
    const d = soDigitos(v).slice(0, 8);
    return d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d;
  }
  function mascaraData(v) {
    const d = soDigitos(v).slice(0, 8);
    if (d.length <= 2) return d;
    if (d.length <= 4) return d.slice(0, 2) + "/" + d.slice(2);
    return d.slice(0, 2) + "/" + d.slice(2, 4) + "/" + d.slice(4);
  }
  function mascaraHora(v) {
    const d = soDigitos(v).slice(0, 4);
    return d.length <= 2 ? d : d.slice(0, 2) + ":" + d.slice(2);
  }

  // ---------- Validações (devolvem mensagem de erro ou "") ----------
  function cpfValido(v) {
    const d = soDigitos(v);
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
    for (let t = 9; t < 11; t++) {
      let s = 0;
      for (let i = 0; i < t; i++) s += +d[i] * (t + 1 - i);
      if (((s * 10) % 11) % 10 !== +d[t]) return false;
    }
    return true;
  }
  function emailValido(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || "").trim()); }
  function telefoneValido(v) { const n = soDigitos(v).length; return n === 10 || n === 11; }

  // ---------- Texto ----------
  function semAcentos(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function normalizarBusca(s) { return semAcentos(s).toLowerCase().trim(); }
  function nomeArquivo(nome) {
    return semAcentos(nome).replace(/[^A-Za-z0-9 ]/g, " ").trim().split(/\s+/).filter(Boolean)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join("") || "Paciente";
  }
  function plural(n, um, varios) { return n + " " + (n === 1 ? um : varios); }
  function tamanhoArquivo(bytes) {
    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
    return (bytes / 1024 / 1024).toFixed(1).replace(".", ",") + " MB";
  }

  function uid() {
    const b = crypto.getRandomValues(new Uint8Array(12));
    return Array.from(b, x => x.toString(16).padStart(2, "0")).join("");
  }
  function debounce(fn, ms) {
    let t = null;
    const f = function () { clearTimeout(t); t = setTimeout(() => { t = null; fn(); }, ms); };
    f.pendente = () => t !== null;
    f.cancelar = () => { clearTimeout(t); t = null; };
    return f;
  }
  function copia(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
  function vazio(v) {
    if (v == null) return true;
    if (Array.isArray(v)) return v.length === 0;
    if (typeof v === "object") return Object.keys(v).every(k => vazio(v[k]));
    return String(v).trim() === "";
  }

  // ---------- Construção de elementos (sempre com textContent: nada de HTML vindo de dados) ----------
  function h(tag, atributos, ...filhos) {
    const el = document.createElement(tag);
    if (atributos) {
      for (const [k, v] of Object.entries(atributos)) {
        if (v == null || v === false) continue;
        if (k === "class") el.className = v;
        else if (k === "dataset") Object.assign(el.dataset, v);
        else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === "html") el.innerHTML = v; // usado apenas com SVG estático do próprio código
        else if (v === true) el.setAttribute(k, "");
        else el.setAttribute(k, v);
      }
    }
    adicionar(el, filhos);
    return el;
  }
  function adicionar(el, filhos) {
    for (const f of filhos.flat(Infinity)) {
      if (f == null || f === false) continue;
      el.append(f instanceof Node ? f : document.createTextNode(String(f)));
    }
    return el;
  }
  function limpar(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

  LB.util = {
    hojeISO, agoraHora, ehISO, isoParaBR, brParaISO, isoParaData, dataExtenso, carimbo, horaDe, diasEntre, somarDias, idade, horaValida,
    soDigitos, mascaraTelefone, mascaraCPF, mascaraCEP, mascaraData, mascaraHora,
    cpfValido, emailValido, telefoneValido,
    semAcentos, normalizarBusca, nomeArquivo, plural, tamanhoArquivo,
    uid, debounce, copia, vazio, h, adicionar, limpar
  };
})(window.LB = window.LB || {});
