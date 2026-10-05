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
    ["produtos", "loja"].forEach((a) => {
      $(`aba-${a}`).setAttribute("aria-selected", String(a === qual));
      $(`sec-${a}`).hidden = a !== qual;
    });
  }
  $("aba-produtos").addEventListener("click", () => abrirAba("produtos"));
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

  // Copia para o nosso armazenamento as fotos que ainda estão no site
  $("copiar-fotos").addEventListener("click", async (e) => {
    const botao = e.target;
    const externa = (f) => f && f.url && !caminhosNoBanco(f).length;
    const alvos = produtos.filter((p) => (p.fotos || []).some(externa));
    const total = alvos.reduce((n, p) => n + p.fotos.filter(externa).length, 0);
    const status = $("copiar-status");
    if (!total) return (status.textContent = "Todas as fotos já estão no seu banco ✓");
    if (!confirm(`Copiar ${total} fotos de ${alvos.length} produtos? Pode levar alguns minutos — mantenha esta tela aberta.`)) return;

    botao.disabled = true;
    const copiadas = new Map(); // a mesma foto pode aparecer em vários produtos
    let feitas = 0, falhas = 0;
    for (const p of alvos) {
      const fotos = [];
      for (const f of p.fotos) {
        if (!externa(f)) { fotos.push(f); continue; }
        status.textContent = `Copiando ${++feitas} de ${total}…`;
        try {
          if (!copiadas.has(f.url)) {
            const r = await fetch(f.url, { mode: "cors" });
            if (!r.ok) throw new Error(r.status);
            copiadas.set(f.url, await enviarFoto(await r.blob()));
          }
          fotos.push({ ...copiadas.get(f.url), ...(f.alt ? { alt: f.alt } : {}) });
        } catch (_) {
          falhas++;
          fotos.push(f);
        }
      }
      await salvarCampos(p.id, { fotos });
    }
    botao.disabled = false;
    desenharLista();
    status.textContent = falhas
      ? `${total - falhas} fotos copiadas. ${falhas} não puderam ser baixadas do site e continuam apontando para lá.`
      : `Pronto! ${total} fotos copiadas para o seu banco ✓`;
  });

  iniciar();
})();
