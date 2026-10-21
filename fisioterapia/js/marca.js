/*
  Identidade visual: logotipo original (quando disponível) ou o monograma "LB" provisório.
  O logotipo pode ser enviado em Configurações > Identidade visual, ou colocado no arquivo img/logo.png.
*/
(function (LB) {
  "use strict";
  const { h } = LB.util;

  let logo = null; // { dataURL, largura, altura, origem: "enviado" | "arquivo" }

  function carregarImagem(src) {
    return new Promise((ok, falha) => {
      const img = new Image();
      img.onload = () => ok(img);
      img.onerror = () => falha(new Error("Imagem não carregou"));
      img.src = src;
    });
  }

  // Converte qualquer imagem para PNG (o PDF aceita PNG/JPEG). Limita o tamanho para não pesar.
  function paraPNG(img, maxLado) {
    maxLado = maxLado || 800;
    const escala = Math.min(1, maxLado / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * escala);
    c.height = Math.round(img.naturalHeight * escala);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return { dataURL: c.toDataURL("image/png"), largura: c.width, altura: c.height };
  }

  async function iniciar() {
    try {
      const salvo = await LB.banco.lerPublico("logo");
      if (salvo && salvo.dataURL) { logo = Object.assign({ origem: "enviado" }, salvo); return; }
    } catch (e) { /* segue para o arquivo padrão */ }
    try {
      const img = await carregarImagem("img/logo.png");
      try { logo = Object.assign({ origem: "arquivo" }, paraPNG(img)); }
      catch (e) { logo = { origem: "arquivo", dataURL: null, src: "img/logo.png", largura: img.naturalWidth, altura: img.naturalHeight }; }
    } catch (e) { logo = null; }
  }

  async function definirLogo(arquivo) {
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(arquivo.type)) throw new Error("Use uma imagem PNG, JPG, WEBP ou SVG.");
    if (arquivo.size > 5 * 1024 * 1024) throw new Error("A imagem passa de 5 MB. Use uma versão menor.");
    const url = URL.createObjectURL(arquivo);
    try {
      const img = await carregarImagem(url);
      const png = paraPNG(img);
      await LB.banco.gravarPublico("logo", png);
      logo = Object.assign({ origem: "enviado" }, png);
    } finally { URL.revokeObjectURL(url); }
  }

  async function removerLogo() {
    await LB.banco.removerPublico("logo");
    logo = null;
    await iniciar();
  }

  // Bloco da marca para cabeçalhos. variante: "lateral" (fundo verde) | "acesso" | "topo"
  function bloco(variante) {
    const imagem = logo && (logo.dataURL || logo.src);
    return h("div", { class: "marca marca-" + (variante || "lateral") },
      imagem
        ? h("img", { class: "marca-logo", src: imagem, alt: "Letícia Bernucci Fisioterapia" })
        : [
          h("span", { class: "marca-monograma", "aria-hidden": "true" }, "LB"),
          h("span", { class: "marca-textos" },
            h("span", { class: "marca-nome" }, "Letícia Bernucci"),
            h("span", { class: "marca-area" }, "Fisioterapia"))
        ]);
  }

  LB.marca = { iniciar, definirLogo, removerLogo, bloco, logo: () => logo };
})(window.LB = window.LB || {});
