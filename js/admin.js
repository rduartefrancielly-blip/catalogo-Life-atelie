(function () {
  const { cfg, moeda, esc, configurado, variacoes, temVariacoes, varDisponivel, disponivel, miniatura } = window.Life;
  const $ = (id) => document.getElementById(id);
  const BUCKET = "fotos";
  const sb = configurado() ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;

  let produtos = [];
  let loja = {};
  let filtro = "Todos";
  const colacao = new Intl.Collator("pt-BR", { sensitivity: "base", numeric: true });
  let termo = "";

  // ---------- Avisos ----------
  let avisoTimer;
  function aviso(msg, erro) {
    const el = $("aviso");
    el.textContent = msg;
    el.classList.toggle("erro-aviso", !!erro);
    el.hidden = false;
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(() => (el.hidden = true), erro ? 6000 : 2500);
  }

  // ---------- Entrar / sair ----------
  function mostrarLogin(msg) {
    $("painel").hidden = true;
    $("tela-login").hidden = false;
    $("login-erro").textContent = msg || "";
  }

  async function iniciar() {
    if (!sb) return mostrarLogin("O catálogo ainda não foi ligado ao banco de dados (arquivo js/config.js).");
    const { data } = await sb.auth.getSession();
    if (data.session) entrar();
    else mostrarLogin();
  }

  $("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const botao = e.submitter || e.target.querySelector("button");
    botao.disabled = true;
    $("login-erro").textContent = "";
    const { error } = await sb.auth.signInWithPassword({ email: $("login-email").value.trim(), password: $("login-senha").value });
    botao.disabled = false;
    if (error) return ($("login-erro").textContent = "E-mail ou senha incorretos.");
    entrar();
  });

  async function entrar() {
    const { data, error } = await sb.from("admins").select("email");
    if (error || !data || !data.length) {
      const { data: u } = await sb.auth.getUser();
      await sb.auth.signOut();
      const detalhe = error ? `Erro do banco: ${error.message}` : `O e-mail "${u?.user?.email || ""}" não está na tabela admins.`;
      return mostrarLogin(`Esta conta não tem permissão de administradora. ${detalhe}`);
    }
    $("tela-login").hidden = true;
    $("painel").hidden = false;
    carregar();
  }

  $("sair").addEventListener("click", async () => {
    await sb.auth.signOut();
    location.reload();
  });

  // ---------- Abas ----------
  function abrirAba(qual) {
    ["produtos", "estoque", "loja"].forEach((a) => {
      $(`aba-${a}`).setAttribute("aria-selected", String(a === qual));
      $(`sec-${a}`).hidden = a !== qual;
    });
  }
  $("aba-produtos").addEventListener("click", () => abrirAba("produtos"));
  $("aba-estoque").addEventListener("click", () => abrirAba("estoque"));
  $("aba-loja").addEventListener("click", () => abrirAba("loja"));

  // ---------- Dados ----------
  async function carregar() {
    const [r1, r2] = await Promise.all([
      sb.from("produtos").select("*").order("ordem").order("criado_em"),
      sb.from("config").select("*").eq("id", 1).single(),
    ]);
    if (r1.error) return aviso("Não foi possível carregar os produtos: " + r1.error.message, true);
    produtos = r1.data;
    loja = r2.data || {};
    $("loja-whats").value = loja.whatsapp || "";
    $("loja-insta").value = loja.instagram || "";
    $("loja-esgotados").checked = loja.mostrar_esgotados !== false;
    desenharFiltros();
    desenharLista();
  }

  async function salvarCampos(id, campos) {
    const { data, error } = await sb.from("produtos").update(campos).eq("id", id).select().single();
    if (error) {
      aviso("Não salvou: " + error.message, true);
      return null;
    }
    const i = produtos.findIndex((p) => p.id === id);
    if (i >= 0) produtos[i] = data;
    return data;
  }

  // ---------- Pendências (dados que faltam) ----------
  function pendencias(p) {
    const lista = [];
    if (!(p.fotos || []).length) lista.push("sem fotos");
    if (p.preco == null) lista.push("sem preço");
    if (!p.medidas) lista.push("sem medidas");
    if (!p.descricao) lista.push("sem descrição");
    if (variacoes(p).some((v) => v.quantidade == null)) lista.push("quantidade em estoque não informada");
    return lista;
  }

  // ---------- Lista ----------
  const FILTROS = {
    Todos: () => true,
    Visíveis: (p) => p.visivel,
    Ocultos: (p) => !p.visivel,
    Esgotados: (p) => !disponivel(p),
    "Com pendências": (p) => pendencias(p).length > 0,
  };

  function desenharFiltros() {
    $("adm-filtros").innerHTML = Object.keys(FILTROS)
      .map((f) => `<button type="button" class="chip" data-filtro="${esc(f)}" aria-pressed="${f === filtro}">${esc(f)} (${produtos.filter(FILTROS[f]).length})</button>`)
      .join("");
  }
  $("adm-filtros").addEventListener("click", (e) => {
    const b = e.target.closest("[data-filtro]");
    if (!b) return;
    filtro = b.dataset.filtro;
    desenharFiltros();
    desenharLista();
  });
  $("adm-busca").addEventListener("input", (e) => {
    termo = e.target.value.trim().toLowerCase();
    desenharLista();
  });

  const precoTexto = (v) => (v == null ? "sem preço" : moeda.format(v));
  const contador = (valor, rotulo) => `
    <div class="contador">
      <button type="button" data-acao="menos" aria-label="Diminuir ${esc(rotulo)}">−</button>
      <input type="number" min="0" step="1" inputmode="numeric" value="${valor ?? ""}" placeholder="—" aria-label="Quantidade ${esc(rotulo)}">
      <button type="button" data-acao="mais" aria-label="Aumentar ${esc(rotulo)}">+</button>
    </div>`;

  function itemHtml(p) {
    const pend = pendencias(p);
    const etq = [];
    if (!disponivel(p)) etq.push('<span class="etq etq-esgotado">Esgotado</span>');
    if (!p.visivel) etq.push('<span class="etq etq-oculto">Oculto</span>');
    if (p.destaque) etq.push('<span class="etq">Destaque</span>');
    if (pend.length) etq.push(`<span class="etq etq-pend" title="${esc(pend.join(", "))}">Falta: ${esc(pend.join(", "))}</span>`);
    const foto = (p.fotos || [])[0];
    const vs = variacoes(p);
    return `<li class="item${p.visivel ? "" : " oculto"}" data-id="${p.id}">
      ${foto ? `<img src="${esc(miniatura(foto))}" alt="" loading="lazy">` : '<div class="sem-foto-mini"></div>'}
      <button type="button" class="item-abrir" data-editar="${p.id}">
        <span class="item-nome">${esc(p.nome)}</span>
        <span class="item-info"><br>${precoTexto(p.preco)}${p.categoria ? " · " + esc(p.categoria) : ""}</span>
        <span class="etiquetas">${etq.join("")}</span>
      </button>
      <div class="item-estoque">
        ${vs.map((v, i) => `<div class="var-linha" data-var="${i}" style="display:flex;align-items:center;gap:8px;flex:1 1 ${vs.length > 1 ? "100%" : "auto"}">
            <span class="var-nome">${esc((v.nome || "").trim() || "Em estoque")}</span>${contador(v.quantidade, v.nome || p.nome)}
          </div>`).join("")}
        <button type="button" class="botao botao-sec botao-mini" data-visivel="${p.id}">${p.visivel ? "Ocultar" : "Reativar"}</button>
      </div>
    </li>`;
  }

  function desenharLista() {
    const lista = produtos.filter(FILTROS[filtro]).filter((p) =>
      !termo || [p.nome, p.categoria, p.codigo].join(" ").toLowerCase().includes(termo))
      .sort((a, b) => colacao.compare(a.nome, b.nome)); // ordem alfabética, como no catálogo
    const disp = produtos.filter((p) => p.visivel && disponivel(p)).length;
    $("adm-resumo").textContent = `${produtos.length} produtos · ${disp} disponíveis no catálogo · mostrando ${lista.length}`;
    $("lista").innerHTML = lista.length ? lista.map(itemHtml).join("") : '<li class="resumo">Nenhum produto aqui.</li>';
  }

  function atualizarItem(p) {
    const li = $("lista").querySelector(`[data-id="${p.id}"]`);
    if (li) li.outerHTML = itemHtml(p);
    desenharFiltros();
  }

  // Estoque rápido direto na lista
  const fila = {};
  function mudarEstoque(p, i, valor) {
    const vs = variacoes(p).map((v) => ({ ...v }));
    vs[i].quantidade = valor;
    p.variacoes = vs;
    clearTimeout(fila[p.id]);
    fila[p.id] = setTimeout(async () => {
      const salvo = await salvarCampos(p.id, { variacoes: vs });
      if (salvo) { atualizarItem(salvo); aviso("Estoque atualizado"); }
    }, 600);
  }

  function lerQtd(input) {
    const t = input.value.trim();
    if (t === "") return null;
    const n = Math.max(0, Math.floor(Number(t)));
    return Number.isFinite(n) ? n : null;
  }

  function passoContador(e, aoMudar) {
    const b = e.target.closest("[data-acao]");
    if (!b) return false;
    const input = b.parentElement.querySelector("input");
    const atual = lerQtd(input);
    const novo = b.dataset.acao === "mais" ? (atual ?? 0) + 1 : Math.max(0, (atual ?? 1) - 1);
    input.value = novo;
    aoMudar(input, novo);
    return true;
  }

  $("lista").addEventListener("click", async (e) => {
    const linha = e.target.closest("[data-var]");
    if (linha) {
      const p = produtos.find((x) => x.id === e.target.closest("[data-id]").dataset.id);
      if (passoContador(e, (_, n) => mudarEstoque(p, Number(linha.dataset.var), n))) return;
    }
    const ed = e.target.closest("[data-editar]");
    if (ed) return abrirEditor(produtos.find((p) => p.id === ed.dataset.editar));
    const vis = e.target.closest("[data-visivel]");
    if (vis) {
      const p = produtos.find((x) => x.id === vis.dataset.visivel);
      vis.disabled = true;
      const salvo = await salvarCampos(p.id, { visivel: !p.visivel });
      if (salvo) { aviso(salvo.visivel ? "Produto reativado no catálogo" : "Produto ocultado do catálogo"); desenharLista(); desenharFiltros(); }
      vis.disabled = false;
    }
  });
  $("lista").addEventListener("change", (e) => {
    const linha = e.target.closest("[data-var]");
    if (!linha || e.target.tagName !== "INPUT") return;
    const p = produtos.find((x) => x.id === e.target.closest("[data-id]").dataset.id);
    mudarEstoque(p, Number(linha.dataset.var), lerQtd(e.target));
  });

  // ---------- Fotos: compressão e envio ----------
  async function comprimir(arquivo, maximo) {
    const img = await createImageBitmap(arquivo);
    const escala = Math.min(1, maximo / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * escala);
    canvas.height = Math.round(img.height * escala);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; // PNG transparente vira fundo branco
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return new Promise((ok) => canvas.toBlob(ok, "image/jpeg", 0.85));
  }

  async function enviarFoto(arquivo) {
    const base = `produtos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const [grande, mini] = await Promise.all([comprimir(arquivo, 1600), comprimir(arquivo, 600)]);
    for (const [caminho, blob] of [[`${base}.jpg`, grande], [`${base}-mini.jpg`, mini]]) {
      const { error } = await sb.storage.from(BUCKET).upload(caminho, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
      if (error) throw error;
    }
    const url = (c) => sb.storage.from(BUCKET).getPublicUrl(c).data.publicUrl;
    return { url: url(`${base}.jpg`), mini: url(`${base}-mini.jpg`) };
  }

  // Caminhos no banco de fotos (só das fotos que estão no nosso armazenamento)
  function caminhosNoBanco(foto) {
    const marca = `/storage/v1/object/public/${BUCKET}/`;
    return [foto.url, foto.mini].filter((u) => u && u.includes(marca)).map((u) => decodeURIComponent(u.split(marca)[1].split("?")[0]));
  }
  async function apagarDoBanco(fotos) {
    // não apaga uma foto que outro produto ainda usa
    const emUso = new Set(produtos.flatMap((p) => (p.fotos || []).flatMap(caminhosNoBanco)));
    const caminhos = fotos.flatMap(caminhosNoBanco).filter((c) => !emUso.has(c));
    if (caminhos.length) await sb.storage.from(BUCKET).remove(caminhos);
  }

  // ---------- Editor ----------
  const dlg = $("editor");
  let ed = null; // { id, fotos, variacoes, enviadas, removidas, alterado }

  const precoCampo = (v) => (v == null ? "" : Number(v).toFixed(2).replace(".", ","));
  function lerPreco(t) {
    t = String(t || "").replace(/[R$\s]/g, "");
    if (!t) return null;
    if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
    const n = Number(t);
    return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : NaN;
  }

  function abrirEditor(p) {
    ed = {
      id: p ? p.id : null,
      fotos: p ? (p.fotos || []).map((f) => ({ ...f })) : [],
      variacoes: p ? variacoes(p).map((v) => ({ ...v })) : [{ nome: "", quantidade: 1 }],
      enviadas: [],
      removidas: [],
      alterado: false,
    };
    $("ed-titulo").textContent = p ? p.nome : "Novo produto";
    $("ed-nome").value = p?.nome || "";
    $("ed-categoria").value = p?.categoria || "";
    $("ed-preco").value = precoCampo(p?.preco);
    $("ed-preco-antigo").value = precoCampo(p?.preco_antigo);
    $("ed-codigo").value = p?.codigo || "";
    $("ed-descricao").value = p?.descricao || "";
    $("ed-materiais").value = p?.materiais || "";
    $("ed-medidas").value = p?.medidas || "";
    $("ed-caracteristicas").value = p?.caracteristicas || "";
    $("ed-visivel").checked = p ? p.visivel : true;
    $("ed-destaque").checked = p ? p.destaque : false;
    $("ed-upload").textContent = "";
    $("lista-categorias").innerHTML = [...new Set(produtos.map((x) => x.categoria).filter(Boolean))].map((c) => `<option value="${esc(c)}">`).join("");

    const pend = p ? pendencias(p) : [];
    $("ed-pendencias").hidden = !pend.length;
    $("ed-pendencias").innerHTML = pend.length ? `<strong>Dados que faltam:</strong><ul>${pend.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "";

    ["ed-vendido", "ed-excluir", "ed-ver"].forEach((id) => ($(id).hidden = !p));
    if (p) $("ed-ver").href = `./#${p.id}`;

    desenharFotos();
    desenharVariacoes();
    dlg.showModal();
    dlg.scrollTop = 0;
  }

  function desenharFotos() {
    const n = ed.fotos.length;
    $("ed-fotos").innerHTML = ed.fotos.map((f, i) => `
      <li>
        <img src="${esc(miniatura(f))}" alt="Foto ${i + 1}">
        ${i === 0 ? '<span class="capa">Capa</span>' : ""}
        <div class="acoes">
          <button type="button" data-foto="${i}" data-mover="-1" aria-label="Mover foto ${i + 1} para a esquerda" ${i === 0 ? "disabled" : ""}>←</button>
          <button type="button" data-foto="${i}" data-remover aria-label="Remover foto ${i + 1}">✕</button>
          <button type="button" data-foto="${i}" data-mover="1" aria-label="Mover foto ${i + 1} para a direita" ${i === n - 1 ? "disabled" : ""}>→</button>
        </div>
      </li>`).join("");
  }
  $("ed-fotos").addEventListener("click", (e) => {
    const b = e.target.closest("[data-foto]");
    if (!b) return;
    const i = Number(b.dataset.foto);
    if (b.hasAttribute("data-remover")) {
      ed.removidas.push(...ed.fotos.splice(i, 1));
    } else {
      const j = i + Number(b.dataset.mover);
      [ed.fotos[i], ed.fotos[j]] = [ed.fotos[j], ed.fotos[i]];
    }
    ed.alterado = true;
    desenharFotos();
  });

  $("ed-arquivos").addEventListener("change", async (e) => {
    const arquivos = [...e.target.files];
    e.target.value = "";
    const status = $("ed-upload");
    let feitas = 0;
    for (const arq of arquivos) {
      status.textContent = `Enviando foto ${feitas + 1} de ${arquivos.length}…`;
      try {
        const foto = await enviarFoto(arq);
        ed.fotos.push(foto);
        ed.enviadas.push(foto);
        ed.alterado = true;
        feitas++;
        desenharFotos();
      } catch (err) {
        aviso(`Não foi possível enviar "${arq.name}": ${err.message || err}`, true);
      }
    }
    status.textContent = feitas ? `${feitas} foto(s) adicionada(s). Toque em Salvar para confirmar.` : "";
  });

  function desenharVariacoes() {
    const so = ed.variacoes.length === 1;
    $("ed-variacoes").innerHTML = ed.variacoes.map((v, i) => `
      <li data-var="${i}">
        <div class="linha">
          <label>${so ? "Cor / variação <small>(opcional)</small>" : "Cor / variação"}
            <input type="text" data-campo="nome" value="${esc(v.nome || "")}" placeholder="${so ? "Deixe em branco se não houver" : "Ex.: Sela"}">
          </label>
        </div>
        <div class="linha" style="margin-top:10px">
          <div><span style="display:block;font-size:.9rem;font-weight:500;margin-bottom:6px">Quantidade</span>${contador(v.quantidade, v.nome || "do produto")}</div>
          <label>Preço próprio <small>(se diferente)</small>
            <input type="text" data-campo="preco" inputmode="decimal" value="${precoCampo(v.preco)}" placeholder="opcional">
          </label>
          ${so ? "" : `<button type="button" class="link remover" data-remover-var="${i}">Remover</button>`}
        </div>
      </li>`).join("");
  }
  $("ed-variacoes").addEventListener("click", (e) => {
    const li = e.target.closest("[data-var]");
    if (!li) return;
    const i = Number(li.dataset.var);
    if (passoContador(e, (_, n) => { ed.variacoes[i].quantidade = n; ed.alterado = true; })) return;
    if (e.target.closest("[data-remover-var]")) {
      ed.variacoes.splice(i, 1);
      ed.alterado = true;
      desenharVariacoes();
    }
  });
  $("ed-variacoes").addEventListener("input", (e) => {
    const li = e.target.closest("[data-var]");
    if (!li) return;
    const v = ed.variacoes[Number(li.dataset.var)];
    if (e.target.dataset.campo === "nome") v.nome = e.target.value;
    else if (e.target.dataset.campo === "preco") v.preco = e.target.value;
    else v.quantidade = lerQtd(e.target);
    ed.alterado = true;
  });
  $("ed-add-var").addEventListener("click", () => {
    ed.variacoes.push({ nome: "", quantidade: 1 });
    ed.alterado = true;
    desenharVariacoes();
    const campos = $("ed-variacoes").querySelectorAll('[data-campo="nome"]');
    campos[campos.length - 1].focus();
  });

  $("form-produto").addEventListener("input", (e) => { if (!e.target.closest("#ed-variacoes")) ed.alterado = true; });

  async function salvarEditor(extra) {
    const nome = $("ed-nome").value.trim();
    if (!nome) { aviso("Preencha o nome do produto.", true); $("ed-nome").focus(); return false; }
    const preco = lerPreco($("ed-preco").value);
    const precoAntigo = lerPreco($("ed-preco-antigo").value);
    if (Number.isNaN(preco) || Number.isNaN(precoAntigo)) { aviso("Preço inválido. Use o formato 489,90.", true); return false; }

    const vars = [];
    for (const v of ed.variacoes) {
      const pv = lerPreco(v.preco);
      if (Number.isNaN(pv)) { aviso(`Preço inválido na variação "${v.nome}".`, true); return false; }
      vars.push({ nome: (v.nome || "").trim(), quantidade: v.quantidade ?? null, ...(pv != null ? { preco: pv } : {}) });
    }
    if (vars.length > 1 && vars.some((v) => !v.nome)) { aviso("Dê um nome a cada cor / variação.", true); return false; }

    const dados = {
      nome,
      categoria: $("ed-categoria").value.trim() || null,
      codigo: $("ed-codigo").value.trim() || null,
      preco,
      preco_antigo: precoAntigo,
      descricao: $("ed-descricao").value.trim() || null,
      materiais: $("ed-materiais").value.trim() || null,
      medidas: $("ed-medidas").value.trim() || null,
      caracteristicas: $("ed-caracteristicas").value.trim() || null,
      fotos: ed.fotos,
      variacoes: vars,
      visivel: $("ed-visivel").checked,
      destaque: $("ed-destaque").checked,
      ...extra,
    };

    let salvo;
    if (ed.id) {
      salvo = await salvarCampos(ed.id, dados);
    } else {
      dados.ordem = Math.min(0, ...produtos.map((p) => p.ordem)) - 1; // novos aparecem primeiro
      const { data, error } = await sb.from("produtos").insert(dados).select().single();
      if (error) aviso("Não salvou: " + error.message, true);
      else produtos.unshift((salvo = data));
    }
    if (!salvo) return false;

    await apagarDoBanco(ed.removidas);
    ed = null;
    dlg.close();
    desenharFiltros();
    desenharLista();
    aviso("Produto salvo ✓");
    return true;
  }

  $("form-produto").addEventListener("submit", (e) => { e.preventDefault(); salvarEditor(); });

  $("ed-vendido").addEventListener("click", () => {
    ed.variacoes.forEach((v) => (v.quantidade = 0));
    salvarEditor();
  });

  $("ed-excluir").addEventListener("click", async () => {
    const p = produtos.find((x) => x.id === ed.id);
    if (!confirm(`Excluir "${p.nome}" definitivamente?\n\nSe a peça só acabou, prefira "Marcar como vendido" ou "Ocultar".`)) return;
    const { error } = await sb.from("produtos").delete().eq("id", p.id);
    if (error) return aviso("Não excluiu: " + error.message, true);
    produtos = produtos.filter((x) => x.id !== p.id);
    await apagarDoBanco([...(p.fotos || []), ...ed.enviadas, ...ed.removidas]);
    ed = null;
    dlg.close();
    desenharFiltros();
    desenharLista();
    aviso("Produto excluído");
  });

  async function fecharEditor() {
    if (ed && ed.alterado && !confirm("Sair sem salvar as alterações?")) return;
    if (ed) await apagarDoBanco(ed.enviadas); // fotos enviadas mas não salvas
    ed = null;
    dlg.close();
  }
  dlg.querySelector("[data-fechar-editor]").addEventListener("click", fecharEditor);
  dlg.addEventListener("cancel", (e) => { e.preventDefault(); fecharEditor(); });

  $("novo").addEventListener("click", () => abrirEditor(null));

  // ---------- Loja ----------
  $("form-loja").addEventListener("submit", async (e) => {
    e.preventDefault();
    const whatsapp = $("loja-whats").value.replace(/\D/g, "");
    if (whatsapp && (whatsapp.length < 12 || !whatsapp.startsWith("55"))) {
      return aviso("WhatsApp: use 55 + DDD + número. Ex.: 5531994685463", true);
    }
    const dados = { whatsapp: whatsapp || null, instagram: $("loja-insta").value.trim().replace(/^@/, "") || null, mostrar_esgotados: $("loja-esgotados").checked };
    const { error } = await sb.from("config").update(dados).eq("id", 1);
    if (error) return aviso("Não salvou: " + error.message, true);
    loja = { ...loja, ...dados };
    $("loja-whats").value = dados.whatsapp || "";
    aviso("Dados da loja salvos ✓");
  });

  // ---------- Estoque por lista (PDF ou texto) ----------
  const base = (c) => new URL(c, document.baseURI).href;

  // Extrai o texto do PDF linha a linha (junta os pedaços que estão na mesma altura da página)
  async function textoDoPdf(arquivo) {
    const pdfjs = await import(base("vendor/pdfjs/pdf.min.mjs"));
    pdfjs.GlobalWorkerOptions.workerSrc = base("vendor/pdfjs/pdf.worker.min.mjs");
    const pdf = await pdfjs.getDocument({ data: await arquivo.arrayBuffer(), cMapUrl: base("vendor/pdfjs/cmaps/"), cMapPacked: true }).promise;
    const linhas = [];
    for (let n = 1; n <= pdf.numPages; n++) {
      const pagina = await pdf.getPage(n);
      const { items } = await pagina.getTextContent();
      const pedacos = items.filter((it) => it.str && it.str.trim())
        .map((it) => ({ x: it.transform[4], y: it.transform[5], h: Math.abs(it.transform[3]) || 10, s: it.str }))
        .sort((a, b) => b.y - a.y || a.x - b.x);
      let atual = null;
      for (const p of pedacos) {
        if (!atual || Math.abs(atual.y - p.y) > Math.max(2, p.h * 0.4)) {
          atual = { y: p.y, partes: [] };
          linhas.push(atual);
        }
        atual.partes.push(p);
      }
    }
    return linhas.map((l) => l.partes.sort((a, b) => a.x - b.x).map((p) => p.s.trim()).join("  ")).join("\n");
  }

  const nomeComVariacao = (p, i) => {
    const v = variacoes(p)[i];
    return v && (v.nome || "").trim() ? `${p.nome} — ${v.nome.trim()}` : p.nome;
  };
  const qtdTexto = (q) => (q == null ? "não informada" : String(q));
  let leituraAtual = null;

  const MOTIVOS = {
    sem_produto: () => "não achei essa peça no catálogo",
    ambiguo: (l) => `pode ser mais de uma peça: ${l.opcoes.map((p) => p.nome).join(" / ")}`,
    sem_quantidade: (l) => `achei "${l.produto.nome}", mas não a quantidade`,
    sem_variacao: (l) => `achei "${l.produto.nome}", mas não qual cor/variação`,
    conflito: (l) => `o código ${l.codigo} é "${l.produto.nome}" no catálogo, mas o nome na lista é de ${l.nomeLista ? `"${l.nomeLista.nome}"` : "outra peça (que não está no catálogo)"} — confira qual está certo`,
  };

  function lerListaDeEstoque() {
    const texto = $("lista-texto").value;
    if (!texto.trim()) {
      $("lista-status").textContent = "Escolha o PDF ou cole o texto da lista primeiro.";
      return;
    }
    const { linhas, itens } = window.LifeEstoque.lerLista(texto, produtos);
    const mudancas = [], iguais = [];
    for (const it of itens) {
      const atual = variacoes(it.produto)[it.variacao]?.quantidade ?? null;
      (atual === it.quantidade ? iguais : mudancas).push({ ...it, atual });
    }
    const naLista = new Set(itens.map((it) => it.produto.id));
    const ausentes = produtos.filter((p) => !naLista.has(p.id));
    // Peças da lista que não existem no catálogo (com nome e quantidade): podem ser cadastradas
    const chaveNome = (n) => String(n || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
    const existentes = new Set(produtos.map((p) => chaveNome(p.nome)));
    const porNome = new Map();
    for (const l of linhas) {
      if (l.status !== "sem_produto" || !l.sugestao || existentes.has(chaveNome(l.sugestao.nome))) continue;
      const k = chaveNome(l.sugestao.nome);
      const atual = porNome.get(k);
      if (atual) { atual.quantidade += l.quantidade; atual.linhas.push(l.texto); }
      else porNome.set(k, { ...l.sugestao, quantidade: l.quantidade, linhas: [l.texto] });
    }
    const novos = [...porNome.values()].sort((a, b) => colacao.compare(a.nome, b.nome));
    const viraNovo = new Set(novos.flatMap((n) => n.linhas));
    const problemas = linhas.filter((l) => MOTIVOS[l.status] && !viraNovo.has(l.texto));
    leituraAtual = { mudancas, ausentes, novos };
    mudancas.sort((a, b) => colacao.compare(a.produto.nome, b.produto.nome));

    const li = (conteudo) => `<li>${conteudo}</li>`;
    const detalhes = (titulo, itensHtml, aberto) => itensHtml.length
      ? `<details${aberto ? " open" : ""}><summary>${titulo} (${itensHtml.length})</summary><ul>${itensHtml.join("")}</ul></details>` : "";
    const reconhecidas = mudancas.length + iguais.length;

    let html = `<div class="caixa comparacao">
      <p><strong>${reconhecidas} ${reconhecidas === 1 ? "peça reconhecida" : "peças reconhecidas"} na lista.</strong>
      ${mudancas.length ? `${mudancas.length} ${mudancas.length === 1 ? "muda" : "mudam"} de quantidade` : "Nenhuma muda de quantidade"}${iguais.length ? `, ${iguais.length} já ${iguais.length === 1 ? "está certa" : "estão certas"}` : ""}.
      ${problemas.length ? `<br>${problemas.length} ${problemas.length === 1 ? "linha não foi entendida" : "linhas não foram entendidas"} (veja abaixo).` : ""}</p>`;
    if (mudancas.length) {
      html += `<h3>O que vai mudar</h3><ul>${mudancas.map((m, i) => `<li><label class="lista-item">
          <input type="checkbox" data-mudanca="${i}" checked>
          <span><strong>${esc(nomeComVariacao(m.produto, m.variacao))}</strong><br>
          Estoque: <span class="de">${qtdTexto(m.atual)}</span><span class="para">${m.quantidade}</span>
          <span class="origem">Na lista: "${esc(m.linhas.join(" + "))}"</span></span></label></li>`).join("")}</ul>`;
    }
    if (novos.length) {
      html += `<h3>Peças da lista que não estão no catálogo (${novos.length})</h3>
        <p class="dica">Marque as que quer cadastrar. Elas entram <strong>ocultas</strong> (as clientes não veem), com o nome, o código e a quantidade da lista, sem foto e sem preço.
        Se a mesma bolsa existe em outra cor no catálogo, a descrição e as medidas são copiadas dela — confira. Depois complete em <strong>Produtos</strong> e toque em <strong>Reativar</strong>.</p>
        <button type="button" class="link" id="novos-todos">Marcar todas</button>
        <ul>${novos.map((n, i) => `<li><label class="lista-item">
          <input type="checkbox" data-novo="${i}">
          <span><strong>${esc(n.nome)}</strong><br>${n.codigo ? `Código: ${esc(n.codigo)} · ` : ""}Quantidade: ${n.quantidade}
          <span class="origem">Na lista: "${esc(n.linhas.join(" + "))}"</span></span></label></li>`).join("")}</ul>`;
    }
    html += detalhes("Linhas que não entendi — confira e ajuste à mão", problemas.map((l) =>
      li(`"${esc(l.texto)}"<span class="motivo">${esc(MOTIVOS[l.status](l))}</span>`)), true);
    html += detalhes("Já estão com a quantidade certa", iguais.map((m) => li(`${esc(nomeComVariacao(m.produto, m.variacao))}: ${m.quantidade}`)));
    if (ausentes.length) {
      html += detalhes("Peças do catálogo que não estão na lista", ausentes.map((p) => li(esc(p.nome))));
      html += `<label class="interruptor"><input type="checkbox" id="lista-zerar">
        <span>Marcar essas ${ausentes.length} peças como esgotadas (estoque 0)</span></label>`;
    }
    if (mudancas.length || ausentes.length || novos.length) html += `<button type="button" class="botao" id="lista-aplicar">Aplicar alterações</button>`;
    html += "</div>";
    $("lista-resultado").innerHTML = html;
    $("lista-status").textContent = "";
  }

  $("lista-ler").addEventListener("click", lerListaDeEstoque);

  $("lista-arquivo").addEventListener("change", async (e) => {
    const arq = e.target.files[0];
    e.target.value = "";
    if (!arq) return;
    $("lista-resultado").innerHTML = "";
    $("lista-status").textContent = `Lendo "${arq.name}"…`;
    try {
      const pdf = /\.pdf$/i.test(arq.name) || arq.type === "application/pdf";
      const texto = pdf ? await textoDoPdf(arq) : await arq.text();
      if (!texto.trim()) {
        $("lista-status").textContent = "Não achei texto nesse PDF. Se for uma foto ou digitalização, cole o texto da lista no campo abaixo.";
        return;
      }
      $("lista-texto").value = texto; // mostra o que foi lido (dá para corrigir e ler de novo)
      lerListaDeEstoque();
    } catch (err) {
      $("lista-status").textContent = `Não consegui ler esse arquivo (${err.message || err}). Abra o PDF, copie o texto e cole no campo abaixo.`;
    }
  });

  // Peça nova a partir da lista: copia os textos da mesma bolsa em outra cor (se houver), fica oculta
  const chaveModelo = (nome) => String(nome || "").split(" - ")[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
  function categoriaPara(nome, irma) {
    if (irma && irma.categoria) return irma.categoria;
    if (/^mochila/i.test(nome)) return "Mochilas";
    const m = nome.match(/^Bolsa (?:Porta Celular )?([A-Za-zÀ-ú]+)/);
    return m ? m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase() : null;
  }
  function produtoNovo(n, ordem) {
    const irma = produtos.find((p) => chaveModelo(p.nome) === chaveModelo(n.nome) && /multicolor/i.test(p.nome) === /multicolor/i.test(n.nome));
    return {
      nome: n.nome,
      categoria: categoriaPara(n.nome, irma),
      codigo: n.codigo || null,
      preco: null,
      preco_antigo: null,
      descricao: irma ? irma.descricao : null,
      materiais: irma ? irma.materiais : null,
      medidas: irma ? irma.medidas : null,
      caracteristicas: irma ? irma.caracteristicas : null,
      fotos: [],
      variacoes: [{ nome: "", quantidade: n.quantidade }],
      visivel: false,
      destaque: false,
      ordem,
      origem_url: null,
    };
  }

  $("lista-resultado").addEventListener("click", async (e) => {
    if (e.target.id === "novos-todos") {
      const caixas = [...document.querySelectorAll("[data-novo]")];
      const marcar = caixas.some((c) => !c.checked);
      caixas.forEach((c) => (c.checked = marcar));
      e.target.textContent = marcar ? "Desmarcar todas" : "Marcar todas";
      return;
    }
    if (e.target.id !== "lista-aplicar" || !leituraAtual) return;
    const marcadas = [...document.querySelectorAll("[data-mudanca]")].filter((c) => c.checked).map((c) => leituraAtual.mudancas[Number(c.dataset.mudanca)]);
    const zerar = $("lista-zerar")?.checked
      ? leituraAtual.ausentes.flatMap((p) => variacoes(p).map((v, i) => ({ produto: p, variacao: i, quantidade: 0, atual: v.quantidade ?? null }))).filter((m) => m.atual !== 0)
      : [];
    const novos = [...document.querySelectorAll("[data-novo]")].filter((c) => c.checked).map((c) => leituraAtual.novos[Number(c.dataset.novo)]);
    const todas = [...marcadas, ...zerar];
    if (!todas.length && !novos.length) return aviso("Nada marcado para alterar.");
    const partes = [];
    if (todas.length) partes.push(`atualizar o estoque de ${todas.length} ${todas.length === 1 ? "peça" : "peças"}`);
    if (novos.length) partes.push(`cadastrar ${novos.length} ${novos.length === 1 ? "peça nova (oculta)" : "peças novas (ocultas)"}`);
    if (!confirm(`Confirmar: ${partes.join(" e ")}?`)) return;

    e.target.disabled = true;
    let criadas = 0;
    if (novos.length) {
      $("lista-status").textContent = `Cadastrando ${novos.length} ${novos.length === 1 ? "peça nova" : "peças novas"}…`;
      const base = Math.max(0, ...produtos.map((p) => p.ordem || 0)) + 1;
      const { data, error } = await sb.from("produtos").insert(novos.map((n, i) => produtoNovo(n, base + i))).select();
      if (error) aviso("Não cadastrou as peças novas: " + error.message, true);
      else { produtos.push(...data); criadas = data.length; }
    }
    // Agrupa por produto (um produto com várias variações vira uma gravação só)
    const porProduto = new Map();
    for (const m of todas) {
      if (!porProduto.has(m.produto.id)) porProduto.set(m.produto.id, variacoes(m.produto).map((v) => ({ ...v })));
      porProduto.get(m.produto.id)[m.variacao].quantidade = m.quantidade;
    }
    let feitas = 0, n = 0;
    for (const [id, vars] of porProduto) {
      $("lista-status").textContent = `Atualizando ${++n} de ${porProduto.size}…`;
      if (await salvarCampos(id, { variacoes: vars })) feitas++;
    }
    leituraAtual = null;
    $("lista-resultado").innerHTML = "";
    desenharLista();
    desenharFiltros();
    const msgs = [];
    if (porProduto.size) msgs.push(feitas === porProduto.size
      ? `estoque de ${feitas} ${feitas === 1 ? "peça atualizado" : "peças atualizado"}`
      : `${feitas} de ${porProduto.size} peças atualizadas (as outras deram erro — leia a lista de novo e aplique outra vez)`);
    if (novos.length) msgs.push(criadas === novos.length
      ? `${criadas} ${criadas === 1 ? "peça nova cadastrada (oculta)" : "peças novas cadastradas (ocultas)"} — complete foto e preço em Produtos e toque em Reativar`
      : "as peças novas não foram cadastradas");
    $("lista-status").textContent = `Pronto! ${msgs.join("; ")} ✓`;
    aviso("Lista aplicada");
  });

  // ---------- Preços do site ----------
  const SITE_LOJA = "https://www.lifeatelie.com.br";

  // Busca a lista pública de produtos da loja (pode ser bloqueada pelo site)
  async function buscarProdutosDoSite() {
    const todos = [];
    for (let pagina = 1; pagina <= 20; pagina++) {
      const r = await fetch(`${SITE_LOJA}/products.json?limit=250&page=${pagina}`, { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const lote = (await r.json()).products || [];
      todos.push(...lote);
      if (lote.length < 250) break;
    }
    return todos;
  }

  // Arquivo do site escolhido à mão: vale para os preços e para as fotos (não precisa escolher duas vezes)
  let siteDoArquivo = null; // { produtos, hora }
  async function lerArquivosDoSite(arquivos) {
    const doSite = [];
    for (const arq of arquivos) {
      let dados;
      try { dados = JSON.parse(await arq.text()); } catch (_) { throw new Error(arq.name); }
      doSite.push(...(Array.isArray(dados) ? dados : dados.products || []));
    }
    if (doSite.length) siteDoArquivo = { produtos: doSite, hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) };
    return doSite;
  }
  // Tenta ler direto do site; se o site bloquear, usa o arquivo já escolhido (ou devolve null para pedir o arquivo)
  async function produtosDoSite(statusEl) {
    try {
      return await buscarProdutosDoSite();
    } catch (_) {
      if (!siteDoArquivo) return null;
      statusEl.textContent = `Usando o arquivo do site que você escolheu às ${siteDoArquivo.hora}.`;
      return siteDoArquivo.produtos;
    }
  }

  const handleDe = (url) => {
    const m = String(url || "").match(/\/products\/([^/?#]+)/);
    return m ? decodeURIComponent(m[1]).toLowerCase() : null;
  };
  const numOuNulo = (v) => (v == null || v === "" ? null : Number(v));

  // Preço do site: o menor preço maior que zero entre as variações; "preço de" só se for maior que o preço
  function precosDoSite(s) {
    const vs = s.variants || [];
    const validos = vs.map((v) => Number(v.price)).filter((n) => n > 0);
    if (!validos.length) return null;
    const preco = Math.min(...validos);
    const v = vs.find((x) => Number(x.price) === preco) || {};
    const antigo = numOuNulo(v.compare_at_price);
    return { preco, preco_antigo: antigo != null && antigo > preco ? antigo : null };
  }

  // "Bolsa Alice – Café" / "bolsa alice - cafe" → "bolsa alice - cafe" (para comparar nomes e códigos)
  const normTexto = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s*[-–—]\s*/g, " - ").replace(/\s+/g, " ").trim();
  // Acha cada produto do catálogo no site: 1º pelo link do site; depois (peças cadastradas pela lista, sem link) pelo código e pelo nome
  function acharNoSite(doSite) {
    const sites = doSite.filter((s) => s && s.handle);
    const porHandle = new Map(sites.map((s) => [String(s.handle).toLowerCase(), s]));
    const usados = new Set();
    const achados = new Map(); // id do produto → { s, como }
    const ordenados = [...produtos].sort((a, b) => colacao.compare(a.nome, b.nome));
    for (const p of ordenados) {
      const s = porHandle.get(handleDe(p.origem_url));
      if (s) { achados.set(p.id, { s, como: "link" }); usados.add(s); }
    }
    const porCodigo = new Map(), porNome = new Map();
    sites.filter((s) => !usados.has(s)).forEach((s) => {
      (s.variants || []).forEach((v) => { if (v && v.sku) porCodigo.set(normTexto(v.sku), s); });
      porNome.set(normTexto(s.title), s);
    });
    for (const p of ordenados) {
      if (achados.has(p.id)) continue;
      let s = p.codigo ? porCodigo.get(normTexto(p.codigo)) : null;
      let como = "código " + p.codigo;
      if (!s || usados.has(s)) { s = porNome.get(normTexto(p.nome)); como = "nome"; }
      if (s && !usados.has(s)) { achados.set(p.id, { s, como }); usados.add(s); }
    }
    return { achados, soNoSite: sites.filter((s) => !usados.has(s)) };
  }
  // Produto achado pelo código ou nome ganha o link do site (da próxima vez é achado direto)
  const linkDoSite = (p, achado) => (achado && achado.como !== "link" && !p.origem_url ? { origem_url: `${SITE_LOJA}/products/${achado.s.handle}` } : {});

  function comparar(doSite) {
    const { achados, soNoSite } = acharNoSite(doSite);
    const r = { mudancas: [], iguais: 0, foraDoSite: [], semPrecoNoSite: [], soNoSite, precoPorCor: [] };
    for (const p of [...produtos].sort((a, b) => colacao.compare(a.nome, b.nome))) {
      const achado = achados.get(p.id);
      if (!achado) { r.foraDoSite.push(p); continue; }
      const novo = precosDoSite(achado.s);
      if (!novo) { r.semPrecoNoSite.push(p); continue; }
      // cor/variação com preço próprio no catálogo vale mais que o preço do produto: avisa para conferir
      if (variacoes(p).some((v) => v.preco != null && v.preco !== "" && Number(v.preco) !== novo.preco)) r.precoPorCor.push(p);
      const atual = { preco: numOuNulo(p.preco), preco_antigo: numOuNulo(p.preco_antigo) };
      if (atual.preco === novo.preco && atual.preco_antigo === novo.preco_antigo) r.iguais++;
      else r.mudancas.push({ p, atual, novo, achado });
    }
    return r;
  }

  const valor = (v) => (v == null ? "sem preço" : moeda.format(v));
  let ultimaComparacao = null;

  function mostrarComparacao(r) {
    ultimaComparacao = r;
    const lista = (itens, fn) => `<ul>${itens.map(fn).join("")}</ul>`;
    const mud = r.mudancas.length;
    let html = `<div class="comparacao">
      <p><strong>${mud ? `${mud} ${mud === 1 ? "produto com preço diferente" : "produtos com preço diferente"} do site.` : "Todos os preços já estão iguais aos do site ✓"}</strong>
      ${r.iguais ? `<br>${r.iguais} já estão iguais.` : ""}</p>`;
    if (mud) {
      html += `<h3>O que vai mudar</h3>` + lista(r.mudancas, (m) => {
        const linhas = [];
        if (m.atual.preco !== m.novo.preco) linhas.push(`Preço: <span class="de">${valor(m.atual.preco)}</span><span class="para">${valor(m.novo.preco)}</span>`);
        if (m.atual.preco_antigo !== m.novo.preco_antigo) linhas.push(`Preço "de": <span class="de">${m.atual.preco_antigo == null ? "nenhum" : valor(m.atual.preco_antigo)}</span><span class="para">${m.novo.preco_antigo == null ? "nenhum" : valor(m.novo.preco_antigo)}</span>`);
        const pelo = m.achado.como !== "link" ? `<br><small>Achado no site pelo ${esc(m.achado.como)}</small>` : "";
        return `<li><strong>${esc(m.p.nome)}</strong>${m.p.visivel === false ? ' <span class="etiqueta-oculto">oculto</span>' : ""}<br>${linhas.join("<br>")}${pelo}</li>`;
      });
      html += `<button type="button" class="botao" id="precos-aplicar">Aplicar ${mud} ${mud === 1 ? "alteração" : "alterações"}</button>`;
    }
    const detalhe = (titulo, itens, fn) => itens.length ? `<details><summary>${titulo} (${itens.length})</summary>${lista(itens, fn)}</details>` : "";
    html += detalhe("Com preço próprio em alguma cor (confira no produto)", r.precoPorCor, (p) => `<li>${esc(p.nome)}: a cor com preço próprio continua com o preço dela</li>`);
    html += detalhe("Com preço R$ 0,00 no site — não alterados", r.semPrecoNoSite, (p) => `<li>${esc(p.nome)}</li>`);
    html += detalhe("No catálogo, mas não encontrados no site", r.foraDoSite, (p) => `<li>${esc(p.nome)}</li>`);
    html += detalhe("No site, mas ainda não estão no catálogo", r.soNoSite, (s) => `<li>${esc(s.title)} — ${valor(precosDoSite(s)?.preco ?? null)}</li>`);
    html += "</div>";
    $("precos-resultado").innerHTML = html;
  }

  async function compararCom(doSite) {
    if (!doSite.length) {
      $("precos-status").textContent = "Não achei produtos nesse arquivo. Confira se é a página do link acima.";
      return;
    }
    $("precos-status").textContent = `${doSite.length} produtos lidos do site.`;
    mostrarComparacao(comparar(doSite));
  }

  $("precos-buscar").addEventListener("click", async (e) => {
    const botao = e.currentTarget;
    botao.disabled = true;
    $("precos-resultado").innerHTML = "";
    $("precos-status").textContent = "Buscando preços no site…";
    const doSite = await produtosDoSite($("precos-status"));
    if (doSite) {
      $("precos-manual").hidden = true;
      await compararCom(doSite);
    } else {
      // Normalmente o site bloqueia leitura vinda de outro endereço: segue pelo arquivo
      $("precos-status").textContent = "";
      $("precos-manual").hidden = false;
    }
    botao.disabled = false;
  });

  $("precos-arquivo").addEventListener("change", async (e) => {
    const arquivos = [...e.target.files];
    e.target.value = "";
    $("precos-resultado").innerHTML = "";
    let doSite;
    try { doSite = await lerArquivosDoSite(arquivos); } catch (erro) {
      $("precos-status").textContent = `Não consegui ler "${erro.message}". Salve a página do link acima de novo e tente outra vez.`;
      return;
    }
    compararCom(doSite);
  });

  $("precos-resultado").addEventListener("click", async (e) => {
    if (e.target.id !== "precos-aplicar" || !ultimaComparacao) return;
    const botao = e.target;
    const { mudancas } = ultimaComparacao;
    if (!confirm(`Atualizar o preço de ${mudancas.length} produto(s) para o valor do site?`)) return;
    botao.disabled = true;
    let feitas = 0;
    for (const m of mudancas) {
      $("precos-status").textContent = `Atualizando ${feitas + 1} de ${mudancas.length}…`;
      if (await salvarCampos(m.p.id, { preco: m.novo.preco, preco_antigo: m.novo.preco_antigo, ...linkDoSite(m.p, m.achado) })) feitas++;
    }
    desenharLista();
    desenharFiltros();
    $("precos-resultado").innerHTML = "";
    ultimaComparacao = null;
    $("precos-status").textContent = feitas === mudancas.length
      ? `Pronto! ${feitas} ${feitas === 1 ? "preço atualizado" : "preços atualizados"} ✓ O catálogo já mostra os valores novos.`
      : `${feitas} de ${mudancas.length} preços atualizados. Os outros deram erro — tente "Comparar com o site" de novo.`;
    aviso(`${feitas} ${feitas === 1 ? "preço atualizado" : "preços atualizados"}`);
  });

  // ---------- Fotos do site ----------
  // Confere as fotos de cada produto com as fotos atuais da loja e traz as novas ou mudadas.
  // Cada foto copiada guarda "origem" (o endereço dela no site): assim a próxima conferência sabe de onde veio.
  const ehDoSite = (url) => /^https?:\/\/cdn\.shopify\.com\//.test(String(url || ""));
  const absoluto = (src) => (String(src || "").startsWith("//") ? "https:" + src : String(src || ""));
  // ".../files/ABC.jpg?v=123" → "ABC.jpg?v=123" (o v muda quando a foto é trocada no site)
  function chaveFoto(url) {
    try {
      const u = new URL(absoluto(url));
      const v = u.searchParams.get("v");
      return decodeURIComponent(u.pathname.split("/").pop()) + (v ? "?v=" + v : "");
    } catch (_) {
      return String(url || "");
    }
  }
  const comLargura = (src, w) => { const u = absoluto(src); return u + (u.includes("?") ? "&" : "?") + "width=" + w; };

  // Fotos que cada produto recebeu na importação, na mesma ordem (o botão antigo de copiar não guardava a origem)
  let fotosImportacao = null;
  async function carregarFotosImportacao() {
    if (fotosImportacao) return fotosImportacao;
    try {
      const r = await fetch("js/fotos-importacao.json?v=20261106", { cache: "no-cache" });
      const d = await r.json();
      fotosImportacao = Object.fromEntries(Object.entries(d.fotos || {}).map(([h, lista]) => [h, lista.map((f) => (/^https?:/.test(f) ? f : d.prefixo + f))]));
    } catch (_) {
      fotosImportacao = {};
    }
    return fotosImportacao;
  }

  // De onde veio cada foto do produto (chave da foto no site); null quando não dá para saber
  function origensAtuais(p, base) {
    const fotos = p.fotos || [];
    const importadas = base[handleDe(p.origem_url)];
    const pelaImportacao = importadas && importadas.length === fotos.length && fotos.every((f) => !f.origem);
    return fotos.map((f, i) => {
      if (f.origem) return chaveFoto(f.origem);
      if (ehDoSite(f.url)) return chaveFoto(f.url);
      if (pelaImportacao && caminhosNoBanco(f).length) return chaveFoto(importadas[i]);
      return null; // foto colocada à mão ou trocada depois da importação
    });
  }

  function fotosDoSite(s) {
    const vistas = new Set();
    return [...(s.images || [])]
      .filter((im) => im && im.src)
      .sort((a, b) => (a.position || 0) - (b.position || 0))
      .map((im) => ({ src: absoluto(im.src), chave: chaveFoto(im.src), alt: im.alt || null }))
      .filter((f) => !vistas.has(f.chave) && vistas.add(f.chave));
  }

  function conferirFotos(doSite, base) {
    const { achados, soNoSite } = acharNoSite(doSite);
    const ordenados = [...produtos].sort((a, b) => colacao.compare(a.nome, b.nome));
    const r = { mudaram: [], conferir: [], guardar: [], iguais: 0, semFotoNoSite: [], foraDoSite: [], soNoSite };
    for (const p of ordenados) {
      const atuais = origensAtuais(p, base);
      const fotos = p.fotos || [];
      const externas = fotos.filter((f) => ehDoSite(f.url)).length;
      const achado = achados.get(p.id);
      const site = achado ? fotosDoSite(achado.s) : [];
      if (!site.length) {
        // não está no site (ou está sem fotos lá): só guarda no banco o que ainda está apontando para o site
        const destino = fotos.map((f, i) => (ehDoSite(f.url) ? { src: f.url, chave: atuais[i], alt: f.alt || null } : { manter: f }));
        if (externas) r.guardar.push({ p, ...(achado || {}), destino, aCopiar: destino.filter((d) => !d.manter).map((d) => d.chave), motivo: achado ? "sem fotos no site" : "não achado no site" });
        else if (achado) r.semFotoNoSite.push(p);
        else r.foraDoSite.push(p);
        continue;
      }
      const chavesSite = site.map((f) => f.chave);
      const guardadas = new Set(atuais.filter((k, i) => k && caminhosNoBanco(fotos[i]).length));
      const aCopiar = site.filter((f) => !guardadas.has(f.chave)).map((f) => f.chave);
      const item = { p, ...achado, destino: site, aCopiar, atuais };
      if (atuais.some((k) => k == null)) { r.conferir.push(item); continue; }
      if (atuais.length === chavesSite.length && atuais.every((k, i) => k === chavesSite[i])) {
        if (externas) r.guardar.push({ ...item, motivo: "igual ao site" });
        else r.iguais++;
        continue;
      }
      item.novas = site.filter((f) => !atuais.includes(f.chave)).length;
      item.saem = atuais.filter((k) => !chavesSite.includes(k)).length;
      r.mudaram.push(item);
    }
    return r;
  }

  let conferenciaFotos = null;
  const fotoMini = (url, cls) => `<img src="${esc(url)}" alt="" loading="lazy" class="${cls || ""}">`; // o nome do produto já está no item
  function resumoFotos(it) {
    const n = (it.p.fotos || []).length, m = it.destino.length;
    const partes = [`${n} ${n === 1 ? "foto" : "fotos"} → ${m} ${m === 1 ? "foto" : "fotos"}`];
    if (it.novas) partes.push(`${it.novas} ${it.novas === 1 ? "nova" : "novas"}`);
    if (it.saem) partes.push(`${it.saem} ${it.saem === 1 ? "sai" : "saem"} (${it.saem === 1 ? "saiu" : "saíram"} do site)`);
    if (it.novas === 0 && it.saem === 0) partes.push("mudou a ordem");
    if (it.como && it.como !== "link") partes.push(`achado no site pelo ${it.como}`);
    return partes.join(" · ");
  }
  function itemFotosHtml(it, i, marcado) {
    const antes = new Set(it.atuais || []);
    const oculto = it.p.visivel === false ? ' <span class="etiqueta-oculto">oculto</span>' : "";
    return `<li><label class="lista-item">
        <input type="checkbox" data-foto-item="${i}"${marcado ? " checked" : ""}>
        <span><strong>${esc(it.p.nome)}</strong>${oculto}<span class="origem">${esc(resumoFotos(it))}</span></span></label>
        <div class="fotos-par"><span>Agora</span><div class="fotos-linha">${(it.p.fotos || []).map((f) => fotoMini(miniatura(f))).join("") || '<em>sem fotos</em>'}</div></div>
        <div class="fotos-par"><span>Vai ficar</span><div class="fotos-linha">${it.destino.map((f) => fotoMini(comLargura(f.src, 160), antes.has(f.chave) ? "" : "nova")).join("")}</div></div>
      </li>`;
  }

  function mostrarConferenciaFotos(r) {
    const itens = [...r.mudaram, ...r.conferir, ...r.guardar];
    conferenciaFotos = { r, itens };
    const lista = (arr, fn) => `<ul>${arr.map(fn).join("")}</ul>`;
    let i = 0;
    let html = `<div class="comparacao fotos-conferencia"><p><strong>${r.mudaram.length
      ? `${r.mudaram.length} ${r.mudaram.length === 1 ? "produto com fotos novas ou mudadas" : "produtos com fotos novas ou mudadas"} no site.`
      : r.conferir.length ? "Não achei fotos novas nos produtos que deu para conferir sozinha. Veja abaixo os que precisam da sua conferência."
      : "Nenhum produto com foto nova no site ✓"}</strong>
      ${r.iguais ? `<br>${r.iguais} ${r.iguais === 1 ? "produto já está" : "produtos já estão"} com as mesmas fotos do site.` : ""}</p>`;
    if (r.mudaram.length) {
      html += `<h3>Fotos novas ou mudadas no site</h3><p class="dica-fotos">As fotos com borda são as novas.</p>` + lista(r.mudaram, (it) => itemFotosHtml(it, i++, true));
    }
    if (r.conferir.length) {
      html += `<h3>Confira antes (${r.conferir.length})</h3>
        <p class="dica-fotos">Estes têm fotos que não dá para saber se vieram do site (você colocou ou trocou depois). Marque só os que quer trocar pelas fotos do site: as fotos atuais deles saem.</p>
        <button type="button" class="botao botao-sec botao-mini" id="fotos-marcar-conferir">Marcar todos destes</button>` + lista(r.conferir, (it) => itemFotosHtml(it, i++, false));
    }
    if (r.guardar.length) {
      html += `<h3>Guardar na plataforma (${r.guardar.length})</h3>
        <p class="dica-fotos">Fotos que ainda estão só no site. Não mudam nada na aparência: só ficam guardadas no seu banco.</p>` +
        lista(r.guardar, (it) => `<li><label class="lista-item"><input type="checkbox" data-foto-item="${i++}" checked>
          <span><strong>${esc(it.p.nome)}</strong><span class="origem">${it.aCopiar.length} ${it.aCopiar.length === 1 ? "foto" : "fotos"} · ${esc(it.motivo)}</span></span></label></li>`);
    }
    if (itens.length) html += `<button type="button" class="botao" id="fotos-aplicar"></button>`;
    const detalhe = (titulo, arr, fn) => (arr.length ? `<details><summary>${titulo} (${arr.length})</summary>${lista(arr, fn)}</details>` : "");
    html += detalhe("No catálogo, mas não encontrados no site", r.foraDoSite, (p) => `<li>${esc(p.nome)}${p.visivel === false ? " (oculto)" : ""}</li>`);
    html += detalhe("Sem fotos no site (ficam como estão)", r.semFotoNoSite, (p) => `<li>${esc(p.nome)}</li>`);
    html += detalhe("No site, mas ainda não estão no catálogo", r.soNoSite, (s) => `<li>${esc(s.title)} · ${(s.images || []).length} fotos</li>`);
    html += "</div>";
    $("fotos-resultado").innerHTML = html;
    contarMarcadosFotos();
  }

  const aCopiarDe = (sel) => new Set(sel.flatMap((it) => it.aCopiar)).size; // a mesma foto em 2 produtos é copiada 1 vez
  function marcadosFotos() {
    return [...$("fotos-resultado").querySelectorAll("[data-foto-item]:checked")].map((c) => conferenciaFotos.itens[Number(c.dataset.fotoItem)]);
  }
  function contarMarcadosFotos() {
    const b = $("fotos-aplicar");
    if (!b) return;
    const sel = marcadosFotos();
    const fotos = aCopiarDe(sel);
    b.disabled = !sel.length;
    b.textContent = sel.length
      ? `Atualizar ${sel.length} ${sel.length === 1 ? "produto" : "produtos"}${fotos ? ` (copiar ${fotos} ${fotos === 1 ? "foto" : "fotos"})` : ""}`
      : "Marque o que quer atualizar";
  }

  async function conferirFotosCom(doSite) {
    if (!doSite.length) {
      $("fotos-status").textContent = "Não achei produtos nesse arquivo. Confira se é a página do link acima.";
      return;
    }
    $("fotos-status").textContent = `${doSite.length} produtos lidos do site.`;
    mostrarConferenciaFotos(conferirFotos(doSite, await carregarFotosImportacao()));
  }

  $("fotos-buscar").addEventListener("click", async (e) => {
    const botao = e.currentTarget;
    botao.disabled = true;
    $("fotos-resultado").innerHTML = "";
    $("fotos-status").textContent = "Lendo as fotos do site…";
    const doSite = await produtosDoSite($("fotos-status"));
    if (doSite) {
      $("fotos-manual").hidden = true;
      await conferirFotosCom(doSite);
    } else {
      // Normalmente o site bloqueia leitura vinda de outro endereço: segue pelo arquivo
      $("fotos-status").textContent = "";
      $("fotos-manual").hidden = false;
    }
    botao.disabled = false;
  });

  $("fotos-arquivo").addEventListener("change", async (e) => {
    const arquivos = [...e.target.files];
    e.target.value = "";
    $("fotos-resultado").innerHTML = "";
    let doSite;
    try { doSite = await lerArquivosDoSite(arquivos); } catch (erro) {
      $("fotos-status").textContent = `Não consegui ler "${erro.message}". Salve a página do link acima de novo e tente outra vez.`;
      return;
    }
    conferirFotosCom(doSite);
  });

  // Faz até n tarefas ao mesmo tempo; devolve { ok, valor } ou { ok: false, erro } para cada uma
  async function emParalelo(itens, n, fn) {
    const saida = new Array(itens.length);
    let prox = 0;
    const trabalhar = async () => {
      while (prox < itens.length) {
        const k = prox++;
        try { saida[k] = { ok: true, valor: await fn(itens[k], k) }; } catch (erro) { saida[k] = { ok: false, erro }; }
      }
    };
    await Promise.all(Array.from({ length: Math.min(n, itens.length) }, trabalhar));
    return saida;
  }

  async function baixarDoSite(src) {
    let r = await fetch(comLargura(src, 1600), { mode: "cors" });
    if (!r.ok) r = await fetch(absoluto(src), { mode: "cors" }); // sem redimensionar
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.blob();
  }

  // Atualiza um produto: as fotos ficam iguais ao destino; reaproveita as que já estão no banco
  async function atualizarFotosDe(it, copiadas, contador) {
    const p = produtos.find((x) => x.id === it.p.id) || it.p;
    const fotos = p.fotos || [];
    const atuais = origensAtuais(p, fotosImportacao || {});
    const guardadas = new Map();
    fotos.forEach((f, i) => { if (atuais[i] && caminhosNoBanco(f).length && !guardadas.has(atuais[i])) guardadas.set(atuais[i], f); });
    const enviadasAqui = [];
    const resultado = await emParalelo(it.destino, 3, async (d) => {
      if (d.manter) return d.manter;
      let foto = guardadas.get(d.chave) || copiadas.get(d.chave);
      if (!foto) {
        foto = await enviarFoto(await baixarDoSite(d.src));
        enviadasAqui.push(foto);
        copiadas.set(d.chave, foto);
        contador.fotos++;
      }
      const alt = d.alt || foto.alt;
      return { url: foto.url, mini: foto.mini, origem: d.src, ...(alt ? { alt } : {}) };
    });
    const desfazer = async () => {
      enviadasAqui.forEach((f) => { for (const [k, v] of copiadas) if (v === f) copiadas.delete(k); });
      contador.fotos -= enviadasAqui.length;
      await apagarDoBanco(enviadasAqui).catch(() => {});
    };
    if (resultado.some((x) => !x.ok)) { await desfazer(); return false; }
    const campos = { fotos: resultado.map((x) => x.valor) };
    Object.assign(campos, linkDoSite(p, it.s ? { s: it.s, como: it.como } : null));
    const salvo = await salvarCampos(p.id, campos);
    if (!salvo) { await desfazer(); return false; }
    await apagarDoBanco(fotos).catch(() => {}); // as antigas que nenhum produto usa mais
    return true;
  }

  $("fotos-resultado").addEventListener("change", (e) => { if (e.target.matches("[data-foto-item]")) contarMarcadosFotos(); });
  $("fotos-resultado").addEventListener("click", async (e) => {
    if (e.target.id === "fotos-marcar-conferir") {
      const n = conferenciaFotos.r.mudaram.length;
      conferenciaFotos.r.conferir.forEach((_, k) => { const c = $("fotos-resultado").querySelector(`[data-foto-item="${n + k}"]`); if (c) c.checked = true; });
      contarMarcadosFotos();
      return;
    }
    if (e.target.id !== "fotos-aplicar" || !conferenciaFotos) return;
    const sel = marcadosFotos();
    if (!sel.length) return;
    const total = aCopiarDe(sel);
    if (!confirm(`Atualizar as fotos de ${sel.length} ${sel.length === 1 ? "produto" : "produtos"}${total ? ` e copiar ${total} ${total === 1 ? "foto" : "fotos"} do site` : ""}? Pode levar alguns minutos. Mantenha esta tela aberta até terminar.`)) return;
    const botao = e.target;
    botao.disabled = true;
    $("fotos-buscar").disabled = true;
    $("fotos-resultado").querySelectorAll("[data-foto-item]").forEach((c) => (c.disabled = true));
    const status = $("fotos-status");
    const copiadas = new Map();
    const contador = { fotos: 0 };
    const falharam = [];
    let feitos = 0;
    for (const it of sel) {
      status.textContent = `Atualizando ${feitos + falharam.length + 1} de ${sel.length}: ${it.p.nome}… (${contador.fotos} ${contador.fotos === 1 ? "foto copiada" : "fotos copiadas"})`;
      if (await atualizarFotosDe(it, copiadas, contador)) feitos++;
      else falharam.push(it.p.nome);
    }
    $("fotos-buscar").disabled = false;
    desenharLista();
    desenharFiltros();
    $("fotos-resultado").innerHTML = falharam.length
      ? `<div class="comparacao"><p class="aviso-caixa">Não consegui atualizar ${falharam.length === 1 ? "este produto" : "estes produtos"} (as fotos ${falharam.length === 1 ? "dele ficaram" : "deles ficaram"} como estavam). Toque em "Conferir fotos com o site" de novo para tentar outra vez:</p><ul>${falharam.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></div>`
      : "";
    conferenciaFotos = null;
    const ocultos = sel.filter((it) => it.p.visivel === false && !falharam.includes(it.p.nome)).length;
    status.textContent = `${falharam.length ? "" : "Pronto! "}${feitos} ${feitos === 1 ? "produto atualizado" : "produtos atualizados"}, ${contador.fotos} ${contador.fotos === 1 ? "foto copiada" : "fotos copiadas"} do site${falharam.length ? "" : " ✓"}${ocultos ? `. ${ocultos} ${ocultos === 1 ? "deles está oculto" : "deles estão ocultos"}: confira em Produtos e toque em Reativar.` : ""}`;
    aviso(`${feitos} ${feitos === 1 ? "produto atualizado" : "produtos atualizados"}`);
  });

  iniciar();
})();
