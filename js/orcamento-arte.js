// Life Ateliê · Orçamentos: a versão visual do orçamento (imagem PNG e PDF), com a identidade da marca.
// Desenha tudo num <canvas> (sem bibliotecas); o PDF usa o jsPDF, carregado só quando pedido.
(function () {
  "use strict";
  const L = window.OrcamentoLib;

  const COR = { papel: "#FAF7F0", papelTopo: "#EFEADF", tinta: "#3F2E24", suave: "#7B6B5D", ouro: "#A5834B", linha: "#D9D0BE" };
  const SERIF = "'Cormorant Garamond', Georgia, serif";
  const SANS = "Jost, 'Helvetica Neue', Arial, sans-serif";
  const SCRIPT = "'Pinyon Script', 'Cormorant Garamond', cursive";
  const W = 1080, PAD = 84;

  // ---------- fontes e fotos ----------
  async function carregarFontes() {
    if (!document.fonts || !document.fonts.load) return;
    const pedidos = ["400 104px 'Cormorant Garamond'", "600 46px 'Cormorant Garamond'", "400 80px 'Pinyon Script'", "400 26px Jost", "500 24px Jost", "600 20px Jost"]
      .map((f) => document.fonts.load(f).catch(() => null));
    await Promise.race([Promise.all(pedidos), new Promise((ok) => setTimeout(ok, 4000))]);
  }
  // Foto com permissão de uso no canvas (crossOrigin). Se o servidor não deixar, volta null e desenha um quadro no lugar.
  function carregarFoto(url) {
    if (!url) return Promise.resolve(null);
    if (/^https:\/\/cdn\.shopify\.com\//.test(url) && !/[?&]width=/.test(url)) url += (url.includes("?") ? "&" : "?") + "width=600";
    return new Promise((ok) => {
      const img = new Image();
      const fim = setTimeout(() => ok(null), 10000);
      img.crossOrigin = "anonymous";
      img.onload = () => { clearTimeout(fim); ok(img.naturalWidth ? img : null); };
      img.onerror = () => { clearTimeout(fim); ok(null); };
      img.src = url;
    });
  }

  // ---------- desenho ----------
  // Cada função recebe "d" (pincel): quando d.medir é true só calcula a altura, sem pintar.
  function pincel(ctx, medir) {
    const temEspaco = "letterSpacing" in ctx;
    const d = {
      ctx, medir,
      fonte(f) { ctx.font = f; },
      larg(s, esp) { return ctx.measureText(s).width + (esp ? esp * Math.max(0, [...s].length - 1) : 0); },
      texto(s, x, y, o) {
        o = o || {};
        ctx.font = o.font; ctx.fillStyle = o.cor || COR.tinta; ctx.textBaseline = "alphabetic";
        const esp = o.esp || 0;
        const w = d.larg(s, esp);
        const x0 = o.alinhar === "centro" ? x - w / 2 : o.alinhar === "direita" ? x - w : x;
        if (medir) return w;
        if (!esp) { ctx.textAlign = "left"; ctx.fillText(s, x0, y); return w; }
        if (temEspaco) { ctx.letterSpacing = esp + "px"; ctx.textAlign = "left"; ctx.fillText(s, x0, y); ctx.letterSpacing = "0px"; return w; }
        let cx = x0;
        for (const ch of s) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + esp; }
        return w;
      },
      linha(x1, y, x2, cor, grossura) {
        if (medir) return;
        ctx.fillStyle = cor || COR.linha; ctx.fillRect(x1, y, x2 - x1, grossura || 1.5);
      },
      linhaOuro(x1, y, x2) {
        if (medir) return;
        const g = ctx.createLinearGradient(x1, 0, x2, 0);
        g.addColorStop(0, "rgba(165,131,75,0)"); g.addColorStop(0.5, COR.ouro); g.addColorStop(1, "rgba(165,131,75,0)");
        ctx.fillStyle = g; ctx.fillRect(x1, y, x2 - x1, 2);
      },
      caixa(x, y, w, h, r, cor) {
        if (medir) return;
        ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
        ctx.fillStyle = cor; ctx.fill();
      },
      foto(img, x, y, w, h, r, nome) {
        if (medir) return;
        ctx.save();
        ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); ctx.clip();
        if (img) {
          const k = Math.max(w / img.naturalWidth, h / img.naturalHeight); // "cover": preenche e corta o excesso
          const iw = img.naturalWidth * k, ih = img.naturalHeight * k;
          ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
        } else {
          ctx.fillStyle = COR.papelTopo; ctx.fillRect(x, y, w, h);
          const ini = String(nome || "").replace(/^(bolsa|mochila|tag|mouse pad)\s+/i, "").trim().charAt(0).toUpperCase() || "L";
          ctx.font = "600 88px " + SERIF; ctx.fillStyle = COR.ouro; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(ini, x + w / 2, y + h / 2);
          ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        }
        ctx.restore();
      },
    };
    return d;
  }

  function quebrar(d, texto, font, largura, maxLinhas) {
    d.fonte(font);
    const saida = [];
    String(texto || "").split(/\n/).forEach((par) => {
      let atual = "";
      par.split(/\s+/).filter(Boolean).forEach((p) => {
        // palavra maior que a linha: corta
        while (d.larg(p) > largura) {
          let n = p.length;
          while (n > 1 && d.larg(p.slice(0, n)) > largura) n--;
          if (atual) { saida.push(atual); atual = ""; }
          saida.push(p.slice(0, n)); p = p.slice(n);
        }
        const tent = atual ? atual + " " + p : p;
        if (d.larg(tent) <= largura) atual = tent; else { saida.push(atual); atual = p; }
      });
      saida.push(atual);
    });
    if (maxLinhas && saida.length > maxLinhas) {
      const corte = saida.slice(0, maxLinhas);
      let ult = corte[maxLinhas - 1];
      while (ult && d.larg(ult + "…") > largura) ult = ult.slice(0, -1);
      corte[maxLinhas - 1] = ult + "…";
      return corte;
    }
    return saida;
  }

  function desenhar(d, orc, conta, fotos, loja) {
    const dir = W - PAD;
    let y = 0;

    // moldura
    d.caixa(0, 0, W, d.altura || 0, 0, COR.papel);
    if (!d.medir) { d.ctx.strokeStyle = "rgba(165,131,75,0.45)"; d.ctx.lineWidth = 2; d.ctx.strokeRect(28, 28, W - 56, (d.altura || 0) - 56); }

    // marca: LIFE + Ateliê (como no topo da tela de vendas)
    y = 186;
    const fLife = "400 104px " + SERIF, fScript = "400 80px " + SCRIPT, esp = 17;
    d.fonte(fLife); const wLife = d.larg("LIFE", esp);
    d.fonte(fScript); const wScript = d.larg("Ateliê");
    const sobrepoe = 28, x0 = (W - (wLife + wScript - sobrepoe)) / 2;
    d.texto("LIFE", x0, y, { font: fLife, esp, cor: COR.tinta });
    d.texto("Ateliê", x0 + wLife - sobrepoe, y + 26, { font: fScript, cor: COR.ouro });
    y += 92;
    d.texto("ORÇAMENTO", W / 2, y, { font: "500 24px " + SANS, esp: 8, cor: COR.suave, alinhar: "centro" });
    y += 40;
    const meta = [orc.numero != null ? L.numeroTexto(orc.numero) : "", L.dataBR(orc.criado_em)].filter(Boolean).join("  ·  ");
    d.texto(meta, W / 2, y, { font: "400 24px " + SANS, cor: COR.suave, alinhar: "centro" });
    y += 44;
    d.linhaOuro(PAD, y, dir);

    // cliente
    y += 70;
    d.texto("PARA", PAD, y, { font: "600 20px " + SANS, esp: 5, cor: COR.suave });
    y += 54;
    quebrar(d, orc.cliente_nome, "600 46px " + SERIF, dir - PAD, 2).forEach((ln, i) => { if (i) y += 52; d.texto(ln, PAD, y, { font: "600 46px " + SERIF }); });
    y += 44;
    d.linha(PAD, y, dir);

    // produtos
    const FW = 210, FH = 262, TX = PAD + FW + 36, TW = dir - TX;
    conta.linhas.forEach((l, i) => {
      const topo = y + 34;
      const nome = L.nomeDoItem({ nome: l.nome }) || "Produto";
      const linhasNome = quebrar(d, nome, "600 40px " + SERIF, TW, 3);
      let ty = topo + 36;
      linhasNome.forEach((ln) => { d.texto(ln, TX, ty, { font: "600 40px " + SERIF }); ty += 46; });
      if (String(l.cor || "").trim()) { ty += 4; d.texto("Cor: " + String(l.cor).trim(), TX, ty, { font: "400 27px " + SANS, cor: COR.suave }); ty += 40; }
      ty += 10;
      d.texto("Quantidade: " + Number(l.quantidade) + "  ·  " + L.brl(L.lerValor(l.valor_unitario) || 0) + " cada", TX, ty, { font: "400 27px " + SANS, cor: COR.suave });
      ty += 62;
      d.texto(L.brl(l.total), dir, ty, { font: "500 38px " + SANS, alinhar: "direita" });
      d.foto(fotos[i], PAD, topo, FW, FH, 18, nome);
      y = Math.max(topo + FH, ty + 12) + 34;
      if (i < conta.linhas.length - 1) d.linha(TX, y, dir);
    });
    d.linha(PAD, y, dir);

    // totais
    y += 64;
    const par = (rot, val, fr, fv, cor) => { d.texto(rot, PAD + 360, y, { font: fr, cor: cor || COR.suave }); d.texto(val, dir, y, { font: fv, alinhar: "direita", cor: COR.tinta }); };
    par("Subtotal", L.brl(conta.subtotal), "400 28px " + SANS, "500 30px " + SANS);
    y += 50;
    if (conta.ajuste && conta.ajuste.tipo) {
      // desconto ou acréscimo: o nome pode ser longo, então quebra em até 3 linhas ao lado do valor
      const val = L.valorAjuste(conta.ajuste.valor);
      d.fonte("500 30px " + SANS);
      const lv = d.larg(val);
      const rot = quebrar(d, conta.ajuste.rotulo, "400 28px " + SANS, dir - (PAD + 360) - lv - 30, 3);
      d.texto(val, dir, y, { font: "500 30px " + SANS, alinhar: "direita", cor: conta.ajuste.valor < 0 ? COR.ouro : COR.tinta });
      rot.forEach((ln, i) => d.texto(ln, PAD + 360, y + i * 36, { font: "400 28px " + SANS, cor: COR.suave }));
      y += 50 + (rot.length - 1) * 36;
    }
    par("Frete", L.brl(conta.frete), "400 28px " + SANS, "500 30px " + SANS);
    y += 36;
    d.linha(PAD + 360, y, dir, COR.ouro, 2);
    y += 76;
    par("Total", L.brl(conta.total), "600 36px " + SERIF, "500 58px " + SANS, COR.tinta);

    // observações
    const obs = String(orc.observacoes || "").trim();
    if (obs) {
      y += 70;
      const linhasObs = quebrar(d, obs, "400 26px " + SANS, dir - PAD - 64, 14);
      const h = 86 + linhasObs.length * 38;
      d.caixa(PAD, y, dir - PAD, h, 18, COR.papelTopo);
      d.texto("OBSERVAÇÕES", PAD + 32, y + 48, { font: "600 20px " + SANS, esp: 5, cor: COR.suave });
      linhasObs.forEach((ln, i) => d.texto(ln, PAD + 32, y + 92 + i * 38, { font: "400 26px " + SANS, cor: COR.tinta }));
      y += h;
    }

    // rodapé
    y += 70;
    d.linhaOuro(PAD, y, dir);
    y += 52;
    d.texto("Life Ateliê · bolsas em couro legítimo", W / 2, y, { font: "400 24px " + SANS, cor: COR.suave, alinhar: "centro" });
    const contato = [loja && loja.whatsapp ? "WhatsApp " + L.whatsBonito(loja.whatsapp) : "", loja && loja.instagram ? "@" + String(loja.instagram).replace(/^@/, "") : ""].filter(Boolean).join("  ·  ");
    if (contato) { y += 38; d.texto(contato, W / 2, y, { font: "400 24px " + SANS, cor: COR.suave, alinhar: "centro" }); }
    y += 80;
    return y;
  }

  async function gerarCanvas(orc, loja) {
    await carregarFontes();
    const conta = L.calcular((orc.itens || []).filter((it) => !L.itemVazio(it)), orc.frete, { tipo: orc.ajuste_tipo, valor: orc.ajuste_valor, descricao: orc.ajuste_descricao });
    const fotos = await Promise.all(conta.linhas.map((l) => carregarFoto(l.foto)));
    const rascunho = document.createElement("canvas").getContext("2d");
    const altura = Math.ceil(desenhar(pincel(rascunho, true), orc, conta, fotos, loja));
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = altura;
    const d = pincel(canvas.getContext("2d"), false);
    d.altura = altura;
    desenhar(d, orc, conta, fotos, loja);
    return { canvas, fotosFaltando: conta.linhas.filter((l, i) => l.foto && !fotos[i]).length };
  }

  const paraBlob = (canvas, tipo, q) => new Promise((ok, erro) => canvas.toBlob((b) => (b ? ok(b) : erro(new Error("Não consegui gerar a imagem."))), tipo, q));

  async function gerarImagem(orc, loja) {
    const r = await gerarCanvas(orc, loja);
    return { blob: await paraBlob(r.canvas, "image/png"), canvas: r.canvas, fotosFaltando: r.fotosFaltando };
  }

  let jspdfPromessa = null;
  function carregarJsPdf() {
    if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
    if (!jspdfPromessa) {
      jspdfPromessa = new Promise((ok, erro) => {
        const s = document.createElement("script");
        s.src = "vendor/jspdf/jspdf.umd.min.js?v=2.5.2";
        s.onload = () => (window.jspdf && window.jspdf.jsPDF ? ok(window.jspdf.jsPDF) : erro(new Error("O gerador de PDF não carregou.")));
        s.onerror = () => { jspdfPromessa = null; erro(new Error("Não consegui carregar o gerador de PDF. Verifique a internet.")); };
        document.head.appendChild(s);
      });
    }
    return jspdfPromessa;
  }

  // PDF de uma página do tamanho do orçamento (largura de uma folha A4)
  async function gerarPdf(orc, loja) {
    const [jsPDF, r] = await Promise.all([carregarJsPdf(), gerarCanvas(orc, loja)]);
    const larg = 595.28, alt = (r.canvas.height / r.canvas.width) * larg;
    const pdf = new jsPDF({ orientation: alt >= larg ? "portrait" : "landscape", unit: "pt", format: [larg, alt], compress: true });
    pdf.setProperties({ title: "Orçamento " + (orc.numero != null ? L.numeroTexto(orc.numero) + " " : "") + "· Life Ateliê", author: "Life Ateliê" });
    pdf.addImage(r.canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, larg, alt);
    return { blob: pdf.output("blob"), fotosFaltando: r.fotosFaltando };
  }

  // "Orcamento-12-Maria-Souza"
  function nomeArquivo(orc) {
    const cli = String(orc.cliente_nome || "cliente").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return "Orcamento-" + (orc.numero != null ? orc.numero + "-" : "") + (cli || "cliente");
  }

  window.OrcamentoArte = { gerarImagem, gerarPdf, nomeArquivo };
})();
