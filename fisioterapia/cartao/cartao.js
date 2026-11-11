/* Funções do cartão: links de contato, ícones e contato para salvar (vCard). Lê window.CARTAO (dados.js). */
(function () {
  "use strict";
  const C = window.CARTAO || {};

  const soDigitos = v => String(v || "").replace(/\D/g, "");
  function telefoneFormatado(v) {
    const d = soDigitos(v);
    if (d.length === 11) return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    if (d.length === 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return v || "";
  }
  const linkWhatsapp = () => C.whatsapp ? "https://wa.me/55" + soDigitos(C.whatsapp) + (C.mensagemWhatsapp ? "?text=" + encodeURIComponent(C.mensagemWhatsapp) : "") : "";
  const linkInstagram = () => C.instagram ? "https://instagram.com/" + C.instagram.replace(/^@/, "") : "";
  const linkEmail = () => C.email ? "mailto:" + C.email : "";
  const linkTelefone = () => C.telefone ? "tel:+55" + soDigitos(C.telefone) : "";

  const ICONES = {
    whatsapp: '<path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6z"/><path d="M9.2 9.3c.3 1.9 1.6 3.8 3.6 4.7l1.1-1.1 1.8.8c-.2 1-1 1.6-2 1.5-2.9-.4-5.3-2.8-5.7-5.7-.1-1 .5-1.8 1.5-2l.8 1.8z"/>',
    instagram: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><path d="M16.8 7.2v.01"/>',
    email: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
    casa: '<path d="M4 11 12 4.5l8 6.5v8.5H4z"/><path d="M10 19.5v-5h4v5"/>',
    contato: '<circle cx="12" cy="9" r="3.5"/><path d="M5.5 19.5c1-3.3 3.5-5 6.5-5s5.5 1.7 6.5 5"/>',
    compartilhar: '<circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>',
    telefone: '<path d="M6.5 4h3l1.5 4-2 1.3a10 10 0 0 0 5.7 5.7l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4z"/>',
    registro: '<path d="M12 3.5 19 6v5.5c0 4.3-3 7.3-7 8.5-4-1.2-7-4.2-7-8.5V6z"/><path d="m9 12 2 2 4-4"/>'
  };
  function icone(nome) {
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("class", "icone");
    s.innerHTML = ICONES[nome] || "";
    return s;
  }

  // Contato para a agenda do celular (formato vCard 3.0).
  function vcard() {
    const esc = t => String(t).replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
    const partes = (C.nome || "").trim().split(/\s+/);
    const sobrenome = partes.length > 1 ? partes.pop() : "";
    const linhas = [
      "BEGIN:VCARD", "VERSION:3.0",
      "N:" + esc(sobrenome) + ";" + esc(partes.join(" ")) + ";;;",
      "FN:" + esc(C.nome || ""),
      "ORG:" + esc((C.nome || "") + " " + (C.area || "")),
      C.profissao ? "TITLE:" + esc(C.profissao + (C.registro ? " · " + C.registro : "")) : "",
      C.telefone || C.whatsapp ? "TEL;TYPE=CELL:+55" + soDigitos(C.telefone || C.whatsapp) : "",
      C.email ? "EMAIL;TYPE=INTERNET:" + C.email : "",
      C.instagram ? "URL:" + linkInstagram() : "",
      C.link ? "URL:" + C.link : "",
      "NOTE:" + esc([C.mensagem, (C.servicos || []).join(", "), C.atendimento, C.cidade].filter(Boolean).join(" · ")),
      "END:VCARD"
    ].filter(Boolean);
    return linhas.join("\r\n") + "\r\n";
  }

  window.Cartao = { C, soDigitos, telefoneFormatado, linkWhatsapp, linkInstagram, linkEmail, linkTelefone, icone, vcard };
})();
