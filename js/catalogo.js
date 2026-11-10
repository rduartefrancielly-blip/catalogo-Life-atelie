(function () {
  const { moeda, esc, configurado, rest, variacoes, temVariacoes, varDisponivel, disponivel, precoDe, miniatura, linkWhats } = window.Life;

  const $ = (id) => document.getElementById(id);
  const grade = $("grade"), filtros = $("filtros"), contagem = $("contagem"), busca = $("busca");
  const dlgProduto = $("produto"), dlgZoom = $("zoom");

  const ICONE_WHATS =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>';

  const ICONE_COMPARTILHAR =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16.1c-.8 0-1.5.3-2 .8l-7.1-4.2c.1-.2.1-.5.1-.7s0-.5-.1-.7l7-4.1c.5.5 1.3.8 2.1.8a3 3 0 1 0-3-3c0 .2 0 .5.1.7L8 9.8A3 3 0 1 0 8 14.2l7.1 4.2c-.1.2-.1.4-.1.6a2.9 2.9 0 1 0 3-2.9Z"/></svg>';

  const CACHE = "life-catalogo-v1";
  let todos = [];     // tudo que está visível no catálogo (inclusive esgotados)
  let produtos = [];  // o que aparece na vitrine (sem esgotados, se a loja preferir)
  let loja = { whatsapp: "", instagram: "", mostrar_esgotados: true };
  let categoria = "Todas";
  let termo = "";

  // Link compartilhado: ?modelo=Alice (só esse modelo) ou ?produto=<id> (só essa peça)
  const params = new URLSearchParams(location.search);
  const foco = params.get("modelo") ? { tipo: "modelo", valor: params.get("modelo") }
    : params.get("produto") ? { tipo: "produto", valor: params.get("produto") } : null;
  const ENDERECO = location.origin + location.pathname;
  const linkModelo = (cat) => `${ENDERECO}?modelo=${encodeURIComponent(cat)}`;
  const linkProduto = (p) => `${ENDERECO}?produto=${encodeURIComponent(p.id)}`;

  const SEM_CATEGORIA = "Outros";
  const nomeCategoria = (p) => (p.categoria || "").trim() || SEM_CATEGORIA;
  const colacao = new Intl.Collator("pt-BR", { sensitivity: "base", numeric: true });
  // "Outros" (sem categoria) sempre por último
  const ordemAlfabetica = (a, b) => (a === SEM_CATEGORIA) - (b === SEM_CATEGORIA) || colacao.compare(a, b);

  // ---------- Dados ----------
  function aplicar(dados) {
    loja = { ...loja, ...(dados.loja || {}) };
    // ordem alfabética: por modelo (categoria) e, dentro dele, pelo nome
    todos = (dados.produtos || []).slice()
      .sort((a, b) => ordemAlfabetica(nomeCategoria(a), nomeCategoria(b)) || ordemAlfabetica(a.nome, b.nome));
    produtos = todos.filter((p) => loja.mostrar_esgotados || disponivel(p));
    desenharRodape();
    desenharFiltros();
    desenharFoco();
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
      abrirDoLink();
    } catch (e) {
      if (!produtos.length) mensagem("Não foi possível carregar o catálogo. Verifique a internet e tente de novo.");
    }
  }

  function mensagem(texto) {
    grade.setAttribute("aria-busy", "false");
    grade.innerHTML = `<p class="mensagem">${esc(texto)}</p>`;
    contagem.textContent = "";
  }

  // ---------- Filtros e busca ----------
  const normalizar = (t) => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const categorias = () => [...new Set(produtos.map((p) => (p.categoria || "").trim()).filter(Boolean))].sort(ordemAlfabetica);

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
  // leve = versão reduzida (cards e miniaturas); a galeria usa a foto inteira
  function fotoHtml(p, i, carregar, leve) {
    const f = (p.fotos || [])[i];
    if (!f || !f.url) return `<div class="sem-foto" role="img" aria-label="${esc(p.nome)}">${esc(p.nome)}</div>`;
    const alt = f.alt || (i ? `${p.nome} – foto ${i + 1}` : p.nome);
    return `<img src="${esc(leve ? miniatura(f) : f.url)}" alt="${esc(alt)}" loading="${carregar}" decoding="async">`;
  }

  function precoHtml(p, v) {
    const preco = precoDe(p, v);
    if (preco == null) return "Consulte o valor";
    const antigo = p.preco_antigo && Number(p.preco_antigo) > preco ? `<span class="antigo">${moeda.format(p.preco_antigo)}</span>` : "";
    return antigo + moeda.format(preco);
  }

  function desenharGrade() {
    grade.setAttribute("aria-busy", "false");
    const lista = (foco ? listaDoFoco() : produtos).filter((p) => {
      if (categoria === "Disponíveis" && !disponivel(p)) return false;
      if (categoria !== "Todas" && categoria !== "Disponíveis" && (p.categoria || "").trim() !== categoria) return false;
      if (!termo) return true;
      const texto = normalizar([p.nome, p.categoria, ...variacoes(p).map((v) => v.nome)].join(" "));
      return termo.split(/\s+/).every((t) => texto.includes(t));
    });

    const n = lista.length;
    contagem.textContent = n ? `${n} ${n === 1 ? "produto" : "produtos"}` : "";
    if (!n) {
      mensagem(foco && todos.length ? (foco.tipo === "produto" ? "Esta peça não está mais no catálogo." : "Este modelo não está no catálogo no momento.")
        : produtos.length ? "Nenhum produto encontrado." : "Nenhum produto no catálogo no momento.");
      return;
    }

    // Uma seção por modelo, em ordem alfabética (a lista já vem ordenada)
    const grupos = new Map();
    lista.forEach((p) => {
      const c = nomeCategoria(p);
      if (!grupos.has(c)) grupos.set(c, []);
      grupos.get(c).push(p);
    });
    let n0 = 0; // as primeiras fotos carregam na hora; as outras quando aparecem na tela
    if (foco) { // link compartilhado: o título já está no alto, só as peças
      grade.innerHTML = `<ul class="grade">${lista.map((p) => cardHtml(p, n0++ < 4)).join("")}</ul>`;
      return;
    }
    grade.innerHTML = [...grupos].map(([cat, itens], g) => `
      <section class="grupo" aria-labelledby="grupo-${g}">
        <h2 class="grupo-titulo" id="grupo-${g}">${esc(cat)} <small>${itens.length}</small>
          <button type="button" class="compartilhar-btn" data-comp-modelo="${esc(cat)}" aria-label="Compartilhar o modelo ${esc(cat)}">${ICONE_COMPARTILHAR}<span>Compartilhar</span></button></h2>
        <ul class="grade">${itens.map((p) => cardHtml(p, n0++ < 4)).join("")}</ul>
      </section>`).join("");
  }

  function cardHtml(p, prioridade) {
    const disp = disponivel(p);
    const cores = temVariacoes(p) ? variacoes(p).filter(varDisponivel).map((v) => v.nome).filter(Boolean) : [];
    const selo = !disp ? '<span class="selo selo-esgotado">Esgotado</span>' : p.destaque ? '<span class="selo">Destaque</span>' : "";
    return `<li class="card${disp ? "" : " esgotado"}">
        <button type="button" class="card-botao" data-id="${esc(p.id)}" aria-label="${esc(p.nome)}${disp ? "" : " (esgotado)"}. Ver detalhes">
          <div class="card-foto">${fotoHtml(p, 0, prioridade ? "eager" : "lazy", true)}${selo}</div>
          <div class="card-info">
            <p class="card-nome">${esc(p.nome)}</p>
            ${cores.length > 1 ? `<p class="card-var">${cores.length} opções</p>` : cores.length === 1 ? `<p class="card-var">${esc(cores[0])}</p>` : ""}
            <p class="card-preco">${disp ? precoHtml(p) : "Esgotado"}</p>
          </div>
        </button>
      </li>`;
  }
  grade.addEventListener("click", (e) => {
    const m = e.target.closest("[data-comp-modelo]");
    if (m) return compartilharModelo(m.dataset.compModelo);
    const b = e.target.closest("[data-id]");
    if (b) abrir(b.dataset.id);
  });

  // ---------- Página do produto ----------
  let atual = null;

  let empurrouHistorico = false; // abrir() criou um passo no histórico (o "voltar" fecha o produto)
  function abrir(id, semHistorico) {
    const p = produtos.find((x) => x.id === id) || todos.find((x) => x.id === id);
    if (!p) return false;
    atual = p;
    const fotos = p.fotos && p.fotos.length ? p.fotos : [null];

    $("galeria").innerHTML = fotos
      .map((_, i) => `<button type="button" data-zoom="${i}" aria-label="Ampliar foto ${i + 1}">${fotoHtml(p, i, i ? "lazy" : "eager")}</button>`)
      .join("");
    $("galeria").scrollLeft = 0;
    $("miniaturas").innerHTML = fotos.length > 1
      ? fotos.map((_, i) => `<button type="button" data-mini="${i}" aria-label="Foto ${i + 1}" aria-current="${i === 0}">${fotoHtml(p, i, "lazy", true)}</button>`).join("")
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

    if (!semHistorico) { history.pushState({ id }, "", `#${encodeURIComponent(id)}`); empurrouHistorico = true; }
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
  $("botao-compartilhar").innerHTML = ICONE_COMPARTILHAR + "Compartilhar esta peça";
  $("botao-compartilhar").addEventListener("click", () => atual && compartilharProduto(atual));

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

  // Fechar o produto: botão, toque fora, botão "voltar" do celular.
  // Aberto por um link (sem passo no histórico): só fecha, sem sair do catálogo.
  function fecharProduto() {
    if (empurrouHistorico) return history.back();
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    dlgProduto.close();
  }
  dlgProduto.querySelector("[data-fechar]").addEventListener("click", fecharProduto);
  dlgProduto.addEventListener("click", (e) => { if (e.target === dlgProduto) fecharProduto(); });
  dlgProduto.addEventListener("cancel", (e) => { e.preventDefault(); fecharProduto(); });
  dlgProduto.addEventListener("close", () => { empurrouHistorico = false; });
  window.addEventListener("popstate", () => abrirPeloEndereco(true) || (dlgProduto.open && dlgProduto.close()));

  function abrirPeloEndereco(semHistorico) {
    const id = decodeURIComponent(location.hash.slice(1));
    return id ? abrir(id, semHistorico) : false;
  }

  // Ao chegar por um link de peça (?produto= ou #id), abre a peça uma vez; depois só atualiza se continuar aberta
  let linkAberto = false;
  function abrirDoLink() {
    if (linkAberto) { if (dlgProduto.open && atual) abrir(atual.id, true); return; }
    linkAberto = foco && foco.tipo === "produto" ? abrir(foco.valor, true) : abrirPeloEndereco(true);
  }

  // ---------- Link de um modelo ou de uma peça ----------
  const mesmoModelo = (a, b) => normalizar(a).trim() === normalizar(b).trim();
  const juntar = (lista) => (lista.length < 2 ? lista.join("") : lista.slice(0, -1).join(", ") + " e " + lista[lista.length - 1]);

  // Tudo sobre um modelo: nome para mostrar ("Bolsa Alice"), peças e cores disponíveis, preços
  function infoModelo(cat) {
    const doModelo = todos.filter((p) => mesmoModelo(nomeCategoria(p), cat));
    const disp = doModelo.filter(disponivel);
    const prefixos = [...new Set(doModelo.map((p) => p.nome.split(" - ")[0].trim()))];
    const titulo = prefixos.length === 1 ? prefixos[0] : (doModelo[0] ? nomeCategoria(doModelo[0]) : cat);
    const corDe = (p) => {
      if (temVariacoes(p)) return variacoes(p).filter(varDisponivel).map((v) => String(v.nome || "").trim()).filter(Boolean);
      const i = p.nome.indexOf(" - ");
      return [prefixos.length === 1 && i > 0 ? p.nome.slice(i + 3).trim() : p.nome];
    };
    const cores = [...new Set(disp.flatMap(corDe))];
    const precos = disp.map((p) => precoDe(p)).filter((n) => n != null);
    return { cat: doModelo[0] ? nomeCategoria(doModelo[0]) : cat, titulo, doModelo, disp, cores, precos };
  }
  function listaDoFoco() {
    if (foco.tipo === "produto") return todos.filter((p) => p.id === foco.valor);
    const m = infoModelo(foco.valor);
    return m.disp.length ? m.disp : m.doModelo; // só as cores disponíveis; tudo esgotado: mostra mesmo assim
  }

  function desenharFoco() {
    const caixa = $("foco");
    caixa.hidden = !foco;
    if (!foco) return;
    $("barra").hidden = true; // sem busca nem abas: só o que foi compartilhado
    const completo = `<a class="botao botao-sec" href="${esc(ENDERECO)}">Ver o catálogo completo</a>`;
    if (foco.tipo === "modelo") {
      const m = infoModelo(foco.valor);
      document.title = `${m.titulo} · Life Ateliê`;
      $("foco-texto").innerHTML = `<h1 class="foco-titulo">${esc(m.titulo)}</h1>` + (m.cores.length
        ? `<p>${m.cores.length === 1 ? "Cor disponível" : `${m.cores.length} cores disponíveis`}: ${esc(juntar(m.cores))}</p>`
        : m.doModelo.length ? "<p>Esgotada no momento. Fale com a gente para encomendar.</p>" : "");
      $("foco-botoes").innerHTML = (m.doModelo.length ? `<button type="button" class="botao botao-sec" data-comp-modelo="${esc(m.cat)}">${ICONE_COMPARTILHAR}Compartilhar</button>` : "") + completo;
    } else {
      const p = todos.find((x) => x.id === foco.valor);
      if (p) document.title = `${p.nome} · Life Ateliê`;
      const m = p ? infoModelo(nomeCategoria(p)) : null;
      $("foco-texto").innerHTML = p ? `<h1 class="foco-titulo">${esc(p.nome)}</h1>` : "";
      $("foco-botoes").innerHTML = (m && m.disp.length > 1 ? `<a class="botao botao-sec" href="${esc(linkModelo(m.cat))}">Ver as outras cores</a>` : "") + completo;
    }
  }
  $("foco-botoes").addEventListener("click", (e) => { const b = e.target.closest("[data-comp-modelo]"); if (b) compartilharModelo(b.dataset.compModelo); });

  // ---------- Compartilhar ----------
  const dlgComp = $("compartilhar");
  let envio = null; // { texto, link }
  const precoTexto = (p, v) => {
    const preco = precoDe(p, v);
    if (preco == null) return "";
    return p.preco_antigo && Number(p.preco_antigo) > preco ? `De ${moeda.format(p.preco_antigo)} por ${moeda.format(preco)}` : moeda.format(preco);
  };

  function compartilharModelo(cat) {
    const m = infoModelo(cat);
    const min = m.precos.length ? Math.min(...m.precos) : null;
    const linhas = [`*${m.titulo}* · Life Ateliê`];
    if (m.cores.length) linhas.push(`${m.cores.length === 1 ? "Cor disponível" : "Cores disponíveis"}: ${juntar(m.cores)}`);
    else linhas.push("Esgotada no momento, mas dá para encomendar.");
    if (min != null) linhas.push((new Set(m.precos).size > 1 ? "A partir de " : "") + moeda.format(min));
    linhas.push("", "Veja as fotos: " + linkModelo(m.cat));
    abrirCompartilhar(m.titulo, m.cores.length ? `Mostra só ${m.titulo === m.cat ? "este modelo" : "a " + m.titulo}, com ${m.cores.length === 1 ? "a cor disponível" : `as ${m.cores.length} cores disponíveis`}.` : "Mostra só este modelo.", linhas.join("\n"), linkModelo(m.cat));
  }

  function compartilharProduto(p) {
    const v = temVariacoes(p) ? escolhida() : null;
    const linhas = [`*${p.nome}* · Life Ateliê`];
    const preco = precoTexto(p, v);
    if (preco) linhas.push(preco);
    if (temVariacoes(p)) {
      const cores = variacoes(p).filter(varDisponivel).map((x) => String(x.nome || "").trim()).filter(Boolean);
      if (cores.length) linhas.push((cores.length === 1 ? "Opção disponível: " : "Opções disponíveis: ") + juntar(cores));
    }
    if (!disponivel(p)) linhas.push("Esgotada no momento, mas dá para encomendar.");
    linhas.push("", "Veja as fotos e os detalhes: " + linkProduto(p));
    abrirCompartilhar(p.nome, "Abre direto esta peça, com fotos, valor e detalhes.", linhas.join("\n"), linkProduto(p));
  }

  function abrirCompartilhar(titulo, sub, texto, link) {
    envio = { titulo, texto, link };
    $("comp-titulo").textContent = "Compartilhar " + titulo;
    $("comp-sub").textContent = sub;
    $("comp-texto").textContent = texto.replace(/\*/g, "");
    $("comp-whats").href = "https://wa.me/?text=" + encodeURIComponent(texto);
    $("comp-whats").innerHTML = ICONE_WHATS + "Enviar pelo WhatsApp";
    $("comp-mais").hidden = !navigator.share;
    $("comp-ok").textContent = "";
    if (!dlgComp.open) dlgComp.showModal();
  }

  async function copiarTexto(t) {
    try { await navigator.clipboard.writeText(t); return true; } catch (_) {}
    const area = document.createElement("textarea");
    area.value = t; area.setAttribute("readonly", ""); area.style.position = "fixed"; area.style.opacity = "0";
    dlgComp.appendChild(area); area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (_) {}
    area.remove();
    return ok;
  }
  const avisoCopia = (ok, oque) => { $("comp-ok").textContent = ok ? `${oque} copiad${oque === "Mensagem" ? "a" : "o"} ✓ Agora é só colar na conversa.` : "Não consegui copiar. Segure o dedo no texto acima para copiar."; };
  $("comp-copiar-msg").addEventListener("click", async () => avisoCopia(await copiarTexto(envio.texto), "Mensagem"));
  $("comp-copiar-link").addEventListener("click", async () => avisoCopia(await copiarTexto(envio.link), "Link"));
  $("comp-mais").addEventListener("click", async () => {
    try { await navigator.share({ title: envio.titulo + " · Life Ateliê", text: envio.texto.replace(/\*/g, "").replace(/\n+[^\n]*https?:\/\/\S+$/, ""), url: envio.link }); } catch (_) {}
  });
  dlgComp.querySelector("[data-fechar-comp]").addEventListener("click", () => dlgComp.close());
  dlgComp.addEventListener("click", (e) => { if (e.target === dlgComp) dlgComp.close(); });

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
