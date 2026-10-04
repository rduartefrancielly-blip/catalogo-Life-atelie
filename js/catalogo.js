(function () {
  const { moeda, esc, configurado, rest, variacoes, temVariacoes, varDisponivel, disponivel, precoDe, linkWhats } = window.Life;

  const $ = (id) => document.getElementById(id);
  const grade = $("grade"), filtros = $("filtros"), contagem = $("contagem"), busca = $("busca");
  const dlgProduto = $("produto"), dlgZoom = $("zoom");

  const ICONE_WHATS =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>';

  const CACHE = "life-catalogo-v1";
  let produtos = [];
  let loja = { whatsapp: "", instagram: "", mostrar_esgotados: true };
  let categoria = "Todas";
  let termo = "";

  // ---------- Dados ----------
  function aplicar(dados) {
    loja = { ...loja, ...(dados.loja || {}) };
    produtos = (dados.produtos || [])
      .filter((p) => loja.mostrar_esgotados || disponivel(p))
      // disponíveis primeiro, depois destaques, depois a ordem definida no admin
      .sort((a, b) => (disponivel(b) - disponivel(a)) || (b.destaque - a.destaque) || (a.ordem - b.ordem));
    desenharRodape();
    desenharFiltros();
    desenharGrade();
  }

  async function carregar() {
    // Mostra na hora o que já foi visto antes; atualiza em seguida
    try {
      const salvo = JSON.parse(localStorage.getItem(CACHE) || "null");
      if (salvo) aplicar(salvo);
    } catch (_) {}

    if (!configurado()) {
      mensagem("Catálogo em configuração. Volte em breve!");
      return;
    }
    try {
      const [lista, cfg] = await Promise.all([
        rest("produtos?select=*&visivel=eq.true&order=ordem.asc,criado_em.asc"),
        rest("config?select=whatsapp,instagram,mostrar_esgotados&id=eq.1"),
      ]);
      const dados = { produtos: lista, loja: cfg[0] || {} };
      try { localStorage.setItem(CACHE, JSON.stringify(dados)); } catch (_) {}
      aplicar(dados);
      abrirPeloEndereco(true);
    } catch (e) {
      if (!produtos.length) mensagem("Não foi possível carregar o catálogo. Verifique a internet e tente de novo.");
    }
  }

  function mensagem(texto) {
    grade.setAttribute("aria-busy", "false");
    grade.innerHTML = `<li class="mensagem">${esc(texto)}</li>`;
    contagem.textContent = "";
  }

  // ---------- Filtros e busca ----------
  const normalizar = (t) => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const categorias = () => [...new Set(produtos.map((p) => (p.categoria || "").trim()).filter(Boolean))];

  function desenharFiltros() {
    const cats = categorias();
    $("busca-caixa").hidden = produtos.length < 10;
    if (!cats.includes(categoria)) categoria = "Todas";
    const opcoes = ["Todas", ...cats];
    if (loja.mostrar_esgotados && produtos.some((p) => !disponivel(p))) opcoes.push("Disponíveis");
    filtros.innerHTML = opcoes.length < 2 ? "" : opcoes
      .map((c) => `<button type="button" class="chip" aria-pressed="${c === categoria}" data-cat="${esc(c)}">${esc(c)}</button>`)
      .join("");
  }
  filtros.addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    categoria = b.dataset.cat;
    desenharFiltros();
    desenharGrade();
  });
  busca.addEventListener("input", () => { termo = normalizar(busca.value.trim()); desenharGrade(); });

  // ---------- Grade ----------
  function fotoHtml(p, i, carregar) {
    const f = (p.fotos || [])[i];
    if (!f || !f.url) return `<div class="sem-foto" role="img" aria-label="${esc(p.nome)}">${esc(p.nome)}</div>`;
    const alt = f.alt || (i ? `${p.nome} – foto ${i + 1}` : p.nome);
    return `<img src="${esc(f.url)}" alt="${esc(alt)}" loading="${carregar}" decoding="async">`;
  }

  function precoHtml(p, v) {
    const preco = precoDe(p, v);
    if (preco == null) return "Consulte o valor";
    const antigo = p.preco_antigo && Number(p.preco_antigo) > preco ? `<span class="antigo">${moeda.format(p.preco_antigo)}</span>` : "";
    return antigo + moeda.format(preco);
  }

  function desenharGrade() {
    grade.setAttribute("aria-busy", "false");
    const lista = produtos.filter((p) => {
      if (categoria === "Disponíveis" && !disponivel(p)) return false;
      if (categoria !== "Todas" && categoria !== "Disponíveis" && (p.categoria || "").trim() !== categoria) return false;
      if (!termo) return true;
      const texto = normalizar([p.nome, p.categoria, ...variacoes(p).map((v) => v.nome)].join(" "));
      return termo.split(/\s+/).every((t) => texto.includes(t));
    });

    const n = lista.length;
    contagem.textContent = n ? `${n} ${n === 1 ? "produto" : "produtos"}` : "";
    if (!n) {
      mensagem(produtos.length ? "Nenhum produto encontrado." : "Nenhum produto no catálogo no momento.");
      return;
    }

    grade.innerHTML = lista.map((p, i) => {
      const disp = disponivel(p);
      const cores = temVariacoes(p) ? variacoes(p).filter(varDisponivel).map((v) => v.nome).filter(Boolean) : [];
      const selo = !disp ? '<span class="selo selo-esgotado">Esgotado</span>' : p.destaque ? '<span class="selo">Destaque</span>' : "";
      return `<li class="card${disp ? "" : " esgotado"}">
        <button type="button" class="card-botao" data-id="${esc(p.id)}" aria-label="${esc(p.nome)}${disp ? "" : " (esgotado)"}. Ver detalhes">
          <div class="card-foto">${fotoHtml(p, 0, i < 4 ? "eager" : "lazy")}${selo}</div>
          <div class="card-info">
            <p class="card-nome">${esc(p.nome)}</p>
            ${cores.length > 1 ? `<p class="card-var">${cores.length} opções</p>` : cores.length === 1 ? `<p class="card-var">${esc(cores[0])}</p>` : ""}
            <p class="card-preco">${disp ? precoHtml(p) : "Esgotado"}</p>
          </div>
        </button>
      </li>`;
    }).join("");
  }
  grade.addEventListener("click", (e) => {
    const b = e.target.closest("[data-id]");
    if (b) abrir(b.dataset.id);
  });

  // ---------- Página do produto ----------
  let atual = null;

  function abrir(id, semHistorico) {
    const p = produtos.find((x) => x.id === id);
    if (!p) return false;
    atual = p;
    const fotos = p.fotos && p.fotos.length ? p.fotos : [null];

    $("galeria").innerHTML = fotos
      .map((_, i) => `<button type="button" data-zoom="${i}" aria-label="Ampliar foto ${i + 1}">${fotoHtml(p, i, i ? "lazy" : "eager")}</button>`)
      .join("");
    $("galeria").scrollLeft = 0;
    $("miniaturas").innerHTML = fotos.length > 1
      ? fotos.map((_, i) => `<button type="button" data-mini="${i}" aria-label="Foto ${i + 1}" aria-current="${i === 0}">${fotoHtml(p, i, "lazy")}</button>`).join("")
      : "";

    $("produto-cat").textContent = p.categoria || "";
    $("produto-nome").textContent = p.nome;

    // Variações
    const vs = variacoes(p);
    const box = $("variacoes");
    box.hidden = !temVariacoes(p);
    if (temVariacoes(p)) {
      const primeira = Math.max(0, vs.findIndex(varDisponivel));
      $("variacoes-lista").innerHTML = vs.map((v, i) => `
        <label class="var-opcao${varDisponivel(v) ? "" : " indisponivel"}">
          <input type="radio" name="variacao" value="${i}" ${i === primeira ? "checked" : ""}>
          <span>${esc(v.nome)}${varDisponivel(v) ? "" : " · esgotada"}</span>
        </label>`).join("");
    }
    atualizarEscolha();

    // Texto: descrição, materiais, medidas, características
    const blocos = [];
    if (p.descricao) blocos.push(`<p>${esc(p.descricao)}</p>`);
    const itens = [];
    if (p.materiais) itens.push(["Materiais", esc(p.materiais)]);
    if (p.medidas) itens.push(["Medidas", esc(p.medidas)]);
    const carac = String(p.caracteristicas || "").split("\n").map((s) => s.trim()).filter(Boolean);
    if (carac.length) itens.push(["Características", `<ul>${carac.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>`]);
    if (itens.length) blocos.push(`<dl>${itens.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join("")}</dl>`);
    $("produto-texto").innerHTML = blocos.join("");

    if (!semHistorico) history.pushState({ id }, "", `#${encodeURIComponent(id)}`);
    if (!dlgProduto.open) dlgProduto.showModal();
    dlgProduto.scrollTop = 0;
    return true;
  }

  function escolhida() {
    if (!atual || !temVariacoes(atual)) return atual ? variacoes(atual)[0] : null;
    const marcado = dlgProduto.querySelector('input[name="variacao"]:checked');
    return marcado ? variacoes(atual)[Number(marcado.value)] : null;
  }

  function atualizarEscolha() {
    const p = atual, v = escolhida();
    const disp = v ? varDisponivel(v) : disponivel(p);
    $("produto-preco").innerHTML = precoHtml(p, v);
    $("aviso-esgotado").hidden = disp;

    const botao = $("botao-interesse");
    const numero = String(loja.whatsapp || "").replace(/\D/g, "");
    if (numero.length >= 12) {
      botao.href = linkWhats(numero, p, temVariacoes(p) ? v : null);
      botao.removeAttribute("aria-disabled");
      botao.innerHTML = ICONE_WHATS + "Tenho interesse";
    } else {
      botao.removeAttribute("href");
      botao.setAttribute("aria-disabled", "true");
      botao.textContent = "WhatsApp da loja ainda não configurado";
    }
  }
  $("variacoes-lista").addEventListener("change", atualizarEscolha);

  // Galeria: miniaturas e indicador
  const galeria = $("galeria");
  $("miniaturas").addEventListener("click", (e) => {
    const b = e.target.closest("[data-mini]");
    if (b) galeria.scrollTo({ left: galeria.clientWidth * Number(b.dataset.mini) });
  });
  galeria.addEventListener("scroll", () => {
    const i = Math.round(galeria.scrollLeft / galeria.clientWidth);
    $("miniaturas").querySelectorAll("button").forEach((b, n) => b.setAttribute("aria-current", String(n === i)));
  }, { passive: true });

  // Zoom em tela cheia
  galeria.addEventListener("click", (e) => {
    const b = e.target.closest("[data-zoom]");
    if (!b || !atual || !(atual.fotos || []).length) return;
    const zoom = $("zoom-fotos");
    zoom.innerHTML = atual.fotos.map((f, i) => `<div><img src="${esc(f.url)}" alt="${esc(f.alt || `${atual.nome} – foto ${i + 1}`)}"></div>`).join("");
    dlgZoom.showModal();
    zoom.scrollLeft = zoom.clientWidth * Number(b.dataset.zoom);
  });
  dlgZoom.querySelector("[data-fechar-zoom]").addEventListener("click", () => dlgZoom.close());

  // Fechar o produto: botão, toque fora, botão "voltar" do celular
  dlgProduto.querySelector("[data-fechar]").addEventListener("click", () => history.back());
  dlgProduto.addEventListener("click", (e) => { if (e.target === dlgProduto) history.back(); });
  dlgProduto.addEventListener("cancel", (e) => { e.preventDefault(); history.back(); });
  window.addEventListener("popstate", () => abrirPeloEndereco(true) || (dlgProduto.open && dlgProduto.close()));

  function abrirPeloEndereco(semHistorico) {
    const id = decodeURIComponent(location.hash.slice(1));
    return id ? abrir(id, semHistorico) : false;
  }

  // ---------- Rodapé ----------
  function desenharRodape() {
    const links = [];
    const numero = String(loja.whatsapp || "").replace(/\D/g, "");
    if (numero) links.push(`<a href="https://wa.me/${numero}" target="_blank" rel="noopener">WhatsApp</a>`);
    if (loja.instagram) {
      const ig = loja.instagram.replace(/^@/, "");
      links.push(`<a href="https://instagram.com/${esc(ig)}" target="_blank" rel="noopener">@${esc(ig)}</a>`);
    }
    $("rodape-links").innerHTML = links.join(" · ");
  }

  carregar();
})();
