/*
  Entrega de arquivos gerados (PDF, cópia de segurança, dados exportados).
  - Navegador comum: download normal.
  - Dentro do visualizador do Claude (página publicada como Artifact): o download passa pela
    confirmação do próprio visualizador; a pessoa pode aceitar ou recusar.
*/
(function (LB) {
  "use strict";

  let capacidade = null;

  // Página aberta dentro do visualizador do Claude (em um quadro).
  function noVisualizador() {
    return !!(window.claude && typeof window.claude.use === "function") && window.parent !== window;
  }
  function downloads() {
    if (!capacidade) {
      capacidade = window.claude && typeof window.claude.use === "function"
        ? window.claude.use("downloads").catch(() => null)
        : Promise.resolve(null);
    }
    return capacidade;
  }

  function baixarNoNavegador(blob, nome) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = nome; a.style.display = "none";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  const MENSAGENS = {
    declined: "O download foi cancelado. Nada foi salvo.",
    rate_limited: "Já há um pedido de download aberto. Responda a ele ou aguarde alguns segundos e tente de novo.",
    rejected_extension: "Este tipo de arquivo não pode ser baixado aqui.",
    extension_not_enabled: "Este tipo de arquivo não pode ser baixado aqui.",
    too_large: "O arquivo é grande demais para baixar aqui."
  };

  // Resolve { modo: "visualizador" | "navegador" }. Rejeita { code, message } quando nada foi salvo.
  async function salvar(blob, nome) {
    const d = await downloads();
    if (d) {
      try {
        await d.save({ filename: nome, data: blob });
        return { modo: "visualizador" };
      } catch (e) {
        const code = (e && e.code) || "unavailable";
        throw { code, message: MENSAGENS[code] || "Este modo de visualização não permitiu baixar o arquivo. Nada foi salvo." };
      }
    }
    if (noVisualizador()) throw { code: "unavailable", message: "Este modo de visualização não permite baixar arquivos. Nada foi salvo." };
    baixarNoNavegador(blob, nome);
    return { modo: "navegador" };
  }

  LB.arquivo = { salvar, noVisualizador };
})(window.LB = window.LB || {});
