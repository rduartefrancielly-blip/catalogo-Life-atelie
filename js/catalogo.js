(function () {
  const grade = document.getElementById("grade");
  const filtros = document.getElementById("filtros");
  const contagem = document.getElementById("contagem");
  const dialogo = document.getElementById("detalhe");

  const ICONE_WHATS =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>';

  const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const visiveis = PRODUTOS.filter((p) => p.disponivel || CONFIG.mostrarVendidas)
    // disponíveis primeiro, destaques no topo
    .sort((a, b) => (b.disponivel - a.disponivel) || ((b.destaque ? 1 : 0) - (a.destaque ? 1 : 0)));

  const titulo = (p) => (p.cor ? `${p.nome} – ${p.cor}` : p.nome);

  function textoPreco(p) {
    if (p.preco == null) return { preco: "Consulte o valor", parcela: "" };
    const antigo = p.precoAntigo ? `<span class="antigo">${moeda.format(p.precoAntigo)}</span>` : "";
    const n = CONFIG.parcelasSemJuros;
    const parcela = n > 1 ? `ou ${n}x de ${moeda.format(p.preco / n)} sem juros` : "";
    return { preco: antigo + moeda.format(p.preco), parcela };
  }

  function linkWhats(p) {
    const msg = p.disponivel
      ? `Olá! Vi no catálogo e tenho interesse na *${titulo(p)}*${p.preco != null ? ` (${moeda.format(p.preco)})` : ""}. Ainda está disponível?`
      : `Olá! Vi no catálogo que a *${titulo(p)}* foi vendida. Vocês vão ter de novo ou fazem sob encomenda?`;
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  function foto(p, i, carregar) {
    const src = p.fotos && p.fotos[i];
    if (!src) return `<div class="sem-foto" role="img" aria-label="${esc(titulo(p))}">${esc(p.nome)}</div>`;
    return `<img src="${esc(src)}" alt="${esc(titulo(p))}${i ? ` – foto ${i + 1}` : ""}" loading="${carregar}" decoding="async">`;
  }

  // ---------- Filtros por modelo ----------
  const modelos = [...new Set(visiveis.map((p) => p.nome))];
  let filtroAtual = "Todas";
  function desenharFiltros() {
    const opcoes = ["Todas", ...modelos];
    if (CONFIG.mostrarVendidas && visiveis.some((p) => p.disponivel)) opcoes.splice(1, 0, "Disponíveis");
    filtros.innerHTML = opcoes
      .map((m) => `<button type="button" class="chip" role="listitem" aria-pressed="${m === filtroAtual}" data-filtro="${esc(m)}">${esc(m)}</button>`)
      .join("");
  }
  filtros.addEventListener("click", (e) => {
    const b = e.target.closest("[data-filtro]");
    if (!b) return;
    filtroAtual = b.dataset.filtro;
    desenharFiltros();
    desenharGrade();
  });

  // ---------- Grade ----------
  function desenharGrade() {
    const lista = visiveis.filter((p) =>
      filtroAtual === "Todas" ? true : filtroAtual === "Disponíveis" ? p.disponivel : p.nome === filtroAtual);
    const disp = lista.filter((p) => p.disponivel).length;
    contagem.textContent = `${disp} ${disp === 1 ? "peça disponível" : "peças disponíveis"}`;

    if (!lista.length) {
      grade.innerHTML = '<li class="vazio">Nenhuma peça por aqui no momento. Chama a gente no WhatsApp!</li>';
      return;
    }
    grade.innerHTML = lista.map((p, i) => {
      const { preco, parcela } = textoPreco(p);
      const selo = !p.disponivel
        ? '<span class="selo selo-vendida">Vendida</span>'
        : p.destaque ? '<span class="selo">Queridinha</span>' : "";
      return `<li class="card${p.disponivel ? "" : " vendida"}">
        <button type="button" class="card-botao" data-id="${esc(p.id)}" aria-label="Ver detalhes: ${esc(titulo(p))}${p.disponivel ? "" : " (vendida)"}">
          <div class="card-foto">${foto(p, 0, i < 4 ? "eager" : "lazy")}${selo}</div>
          <div class="card-info">
            <p class="card-nome">${esc(p.nome)}</p>
            ${p.cor ? `<p class="card-cor">${esc(p.cor)}</p>` : ""}
            <p class="card-preco">${p.disponivel ? preco : "Vendida"}</p>
            ${p.disponivel && parcela ? `<p class="card-parcela">${parcela}</p>` : ""}
          </div>
        </button>
      </li>`;
    }).join("");
  }
  grade.addEventListener("click", (e) => {
    const b = e.target.closest("[data-id]");
    if (b) abrir(b.dataset.id);
  });

  // ---------- Detalhe ----------
  const galeria = document.getElementById("galeria");
  const pontos = document.getElementById("galeria-pontos");

  function abrir(id, semHistorico) {
    const p = PRODUTOS.find((x) => x.id === id);
    if (!p) return;
    const total = Math.max(1, (p.fotos || []).length);
    galeria.innerHTML = Array.from({ length: total }, (_, i) => `<div>${foto(p, i, i ? "lazy" : "eager")}</div>`).join("");
    galeria.scrollLeft = 0;
    pontos.innerHTML = total > 1 ? Array.from({ length: total }, (_, i) => `<span class="${i ? "" : "ativo"}"></span>`).join("") : "";

    document.getElementById("detalhe-nome").textContent = p.nome;
    document.getElementById("detalhe-cor").textContent = p.cor || "";
    const { preco, parcela } = textoPreco(p);
    document.getElementById("detalhe-preco").innerHTML = p.disponivel
      ? `${preco}${parcela ? `<small>${parcela}</small>` : ""}`
      : `Vendida${p.preco != null ? `<small>Valor de referência: ${moeda.format(p.preco)}</small>` : ""}`;
    document.getElementById("detalhe-desc").textContent = p.descricao || "";

    const itens = [];
    if (p.medidas) itens.push(`<li><strong>Medidas:</strong>${esc(p.medidas)}</li>`);
    (p.detalhes || []).forEach((d) => itens.push(`<li>${esc(d)}</li>`));
    document.getElementById("detalhe-lista").innerHTML = itens.join("");

    const w = document.getElementById("detalhe-whats");
    w.href = linkWhats(p);
    w.innerHTML = ICONE_WHATS + (p.disponivel ? "Quero esta bolsa" : "Perguntar sobre encomenda");

    if (!semHistorico) history.pushState({ id }, "", `#${id}`);
    dialogo.showModal();
  }

  galeria.addEventListener("scroll", () => {
    const i = Math.round(galeria.scrollLeft / galeria.clientWidth);
    [...pontos.children].forEach((s, n) => s.classList.toggle("ativo", n === i));
  }, { passive: true });

  // Fechar: botão, toque fora, botão "voltar" do celular
  document.getElementById("fechar").addEventListener("click", () => history.back());
  dialogo.addEventListener("click", (e) => { if (e.target === dialogo) history.back(); });
  dialogo.addEventListener("cancel", (e) => { e.preventDefault(); history.back(); });
  window.addEventListener("popstate", () => {
    const id = location.hash.slice(1);
    if (id && PRODUTOS.some((p) => p.id === id)) abrir(id, true);
    else if (dialogo.open) dialogo.close();
  });

  // ---------- Rodapé ----------
  const links = [`<a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>`];
  if (CONFIG.instagram) links.push(`<a href="https://instagram.com/${esc(CONFIG.instagram)}" target="_blank" rel="noopener">@${esc(CONFIG.instagram)}</a>`);
  document.getElementById("rodape-links").innerHTML = links.join(" · ");

  desenharFiltros();
  desenharGrade();

  // Link direto para um produto: ...index.html#luiza-sela-nude
  const inicial = location.hash.slice(1);
  if (inicial && PRODUTOS.some((p) => p.id === inicial)) {
    history.replaceState(null, "", location.pathname + location.search);
    abrir(inicial);
  }
})();
