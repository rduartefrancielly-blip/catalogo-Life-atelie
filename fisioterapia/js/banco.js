/*
  Armazenamento local criptografado.
  - Os dados ficam no IndexedDB deste navegador, neste aparelho. Não há servidor.
  - Cada registro é cifrado com AES-GCM 256 usando uma chave derivada da senha (PBKDF2-SHA-256).
  - A chave só existe na memória enquanto o sistema está desbloqueado.
*/
(function (LB) {
  "use strict";

  const NOME_BANCO = "lb-fisioterapia";
  const VERSAO_BANCO = 1;
  const ITERACOES = 600000;
  const TEXTO_VERIFICADOR = "LB-Fisioterapia:chave-ok";
  const FORMATO_COPIA = "lb-fisioterapia-copia";

  let db = null;
  let chave = null;
  let memoria = new Map(); // id -> registro decifrado
  const ouvintes = new Set();
  const canal = "BroadcastChannel" in window ? new BroadcastChannel("lb-fisioterapia") : null;

  // ---------- IndexedDB ----------
  function abrir() {
    if (db) return Promise.resolve(db);
    return new Promise((ok, falha) => {
      if (!("indexedDB" in window)) return falha(new Error("Este navegador não oferece armazenamento local (IndexedDB)."));
      const req = indexedDB.open(NOME_BANCO, VERSAO_BANCO);
      req.onupgradeneeded = () => {
        const b = req.result;
        for (const s of ["meta", "registros", "arquivos"]) if (!b.objectStoreNames.contains(s)) b.createObjectStore(s, { keyPath: "id" });
      };
      req.onsuccess = () => { db = req.result; ok(db); };
      req.onerror = () => falha(req.error || new Error("Não foi possível abrir o armazenamento local."));
      req.onblocked = () => falha(new Error("O armazenamento está em uso por outra aba. Feche as outras abas do sistema e tente de novo."));
    });
  }
  function transacao(stores, modo, acao) {
    return abrir().then(b => new Promise((ok, falha) => {
      const tx = b.transaction(stores, modo);
      let resultado;
      tx.oncomplete = () => ok(resultado);
      tx.onerror = () => falha(tx.error || new Error("Falha ao gravar no armazenamento local."));
      tx.onabort = () => falha(tx.error || new Error("A gravação foi interrompida (o espaço do aparelho pode estar cheio)."));
      const r = acao(tx);
      if (r && typeof r.then === "function") r.then(v => { resultado = v; });
      else if (r && "onsuccess" in r) r.onsuccess = () => { resultado = r.result; };
      else resultado = r;
    }));
  }
  const pegar = (store, id) => transacao([store], "readonly", tx => tx.objectStore(store).get(id));
  const pegarTodos = store => transacao([store], "readonly", tx => tx.objectStore(store).getAll());
  const gravar = (store, valor) => transacao([store], "readwrite", tx => tx.objectStore(store).put(valor));
  const remover = (store, id) => transacao([store], "readwrite", tx => tx.objectStore(store).delete(id));

  // ---------- Criptografia ----------
  const codificador = new TextEncoder();
  const decodificador = new TextDecoder();

  async function derivarChave(senha, sal, iteracoes) {
    const base = await crypto.subtle.importKey("raw", codificador.encode(senha), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: sal, iterations: iteracoes, hash: "SHA-256" },
      base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
    );
  }
  async function cifrar(k, bytes) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const dados = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, k, bytes);
    return { iv, dados };
  }
  async function decifrar(k, iv, dados) {
    return crypto.subtle.decrypt({ name: "AES-GCM", iv }, k, dados);
  }
  const cifrarJSON = (k, obj) => cifrar(k, codificador.encode(JSON.stringify(obj)));
  async function decifrarJSON(k, iv, dados) { return JSON.parse(decodificador.decode(await decifrar(k, iv, dados))); }

  async function verificarChave(k, verificador) {
    try {
      const txt = decodificador.decode(await decifrar(k, verificador.iv, verificador.dados));
      return txt === TEXTO_VERIFICADOR;
    } catch (e) { return false; }
  }

  // ---------- Estado ----------
  async function estado() {
    await abrir();
    const m = await pegar("meta", "chave");
    if (!m) return "novo";
    return chave ? "aberto" : "bloqueado";
  }

  async function criar(senha) {
    const sal = crypto.getRandomValues(new Uint8Array(16));
    const k = await derivarChave(senha, sal, ITERACOES);
    const verificador = await cifrar(k, codificador.encode(TEXTO_VERIFICADOR));
    await gravar("meta", { id: "chave", sal, iteracoes: ITERACOES, verificador, criadoEm: Date.now() });
    chave = k;
    memoria = new Map();
    pedirPersistencia();
  }

  async function desbloquear(senha) {
    const m = await pegar("meta", "chave");
    if (!m) throw new Error("Nenhuma senha foi criada ainda.");
    const k = await derivarChave(senha, m.sal, m.iteracoes);
    if (!(await verificarChave(k, m.verificador))) return false;
    const todos = await pegarTodos("registros");
    const nova = new Map();
    for (const r of todos) {
      try { nova.set(r.id, await decifrarJSON(k, r.iv, r.dados)); }
      catch (e) { console.error("Registro ilegível:", r.id); }
    }
    chave = k;
    memoria = nova;
    pedirPersistencia();
    return true;
  }

  function bloquear() {
    chave = null;
    memoria = new Map();
  }
  const aberto = () => chave !== null;

  function pedirPersistencia() {
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  }
  async function persistente() {
    if (navigator.storage && navigator.storage.persisted) { try { return await navigator.storage.persisted(); } catch (e) { return null; } }
    return null;
  }

  // ---------- Registros ----------
  function exigirAberto() { if (!chave) throw new Error("O sistema está bloqueado. Entre com sua senha."); }

  function listar(tipo, filtro) {
    const lista = [];
    for (const r of memoria.values()) if ((!tipo || r.tipo === tipo) && (!filtro || filtro(r))) lista.push(r);
    return lista;
  }
  const obter = id => memoria.get(id) || null;

  async function salvar(registro, opcoes) {
    exigirAberto();
    const r = Object.assign({}, registro);
    if (!r.id) r.id = LB.util.uid();
    if (!r.criadoEm) r.criadoEm = Date.now();
    if (!(opcoes && opcoes.manterData)) r.atualizadoEm = Date.now();
    const { iv, dados } = await cifrarJSON(chave, r);
    await gravar("registros", { id: r.id, iv, dados });
    memoria.set(r.id, r);
    avisar({ tipo: "salvo", id: r.id });
    return r;
  }

  async function excluir(ids) {
    exigirAberto();
    ids = [].concat(ids);
    await transacao(["registros", "arquivos"], "readwrite", tx => {
      for (const id of ids) {
        tx.objectStore("registros").delete(id);
        const r = memoria.get(id);
        if (r && r.arquivoId) tx.objectStore("arquivos").delete(r.arquivoId);
      }
    });
    for (const id of ids) memoria.delete(id);
    avisar({ tipo: "excluido", ids });
  }

  // ---------- Arquivos (documentos do paciente) ----------
  async function salvarArquivo(buffer) {
    exigirAberto();
    const id = LB.util.uid();
    const { iv, dados } = await cifrar(chave, buffer);
    await gravar("arquivos", { id, iv, dados });
    return id;
  }
  async function lerArquivo(id) {
    exigirAberto();
    const a = await pegar("arquivos", id);
    if (!a) throw new Error("Arquivo não encontrado neste aparelho.");
    return decifrar(chave, a.iv, a.dados);
  }

  // ---------- Dados públicos (não sensíveis): logotipo e preferências de leitura ----------
  async function lerPublico(id) { const m = await pegar("meta", "pub:" + id); return m ? m.valor : null; }
  async function gravarPublico(id, valor) { await gravar("meta", { id: "pub:" + id, valor }); }
  async function removerPublico(id) { await remover("meta", "pub:" + id); }

  // ---------- Troca de senha ----------
  async function trocarSenha(atual, nova) {
    exigirAberto();
    const m = await pegar("meta", "chave");
    const kAtual = await derivarChave(atual, m.sal, m.iteracoes);
    if (!(await verificarChave(kAtual, m.verificador))) return false;
    const sal = crypto.getRandomValues(new Uint8Array(16));
    const kNova = await derivarChave(nova, sal, ITERACOES);
    const verificador = await cifrar(kNova, codificador.encode(TEXTO_VERIFICADOR));
    const regs = [];
    for (const r of memoria.values()) regs.push(Object.assign({ id: r.id }, await cifrarJSON(kNova, r)));
    const arqs = [];
    for (const a of await pegarTodos("arquivos")) {
      const claro = await decifrar(kAtual, a.iv, a.dados);
      arqs.push(Object.assign({ id: a.id }, await cifrar(kNova, claro)));
    }
    await transacao(["meta", "registros", "arquivos"], "readwrite", tx => {
      tx.objectStore("meta").put({ id: "chave", sal, iteracoes: ITERACOES, verificador, criadoEm: m.criadoEm, trocadaEm: Date.now() });
      for (const r of regs) tx.objectStore("registros").put(r);
      for (const a of arqs) tx.objectStore("arquivos").put(a);
    });
    chave = kNova;
    return true;
  }

  // ---------- Cópia de segurança (continua cifrada; precisa da senha usada na época) ----------
  function paraBase64(buf) {
    const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    let s = "";
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function deBase64(txt) {
    const s = atob(txt);
    const b = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
    return b;
  }
  const empacotar = x => ({ id: x.id, iv: paraBase64(x.iv), dados: paraBase64(x.dados) });
  const desempacotar = x => ({ id: x.id, iv: deBase64(x.iv), dados: deBase64(x.dados).buffer });

  async function exportarCopia() {
    exigirAberto();
    const m = await pegar("meta", "chave");
    return {
      formato: FORMATO_COPIA, versao: 1, geradoEm: new Date().toISOString(),
      chave: { sal: paraBase64(m.sal), iteracoes: m.iteracoes, verificador: { iv: paraBase64(m.verificador.iv), dados: paraBase64(m.verificador.dados) } },
      registros: (await pegarTodos("registros")).map(empacotar),
      arquivos: (await pegarTodos("arquivos")).map(empacotar)
    };
  }

  async function importarCopia(copia, senha) {
    if (!copia || copia.formato !== FORMATO_COPIA) throw new Error("Este arquivo não é uma cópia de segurança deste sistema.");
    const sal = deBase64(copia.chave.sal);
    const verificador = { iv: deBase64(copia.chave.verificador.iv), dados: deBase64(copia.chave.verificador.dados).buffer };
    const k = await derivarChave(senha, sal, copia.chave.iteracoes);
    if (!(await verificarChave(k, verificador))) return false;
    const regs = copia.registros.map(desempacotar);
    const arqs = copia.arquivos.map(desempacotar);
    const nova = new Map();
    for (const r of regs) nova.set(r.id, await decifrarJSON(k, r.iv, r.dados));
    await transacao(["meta", "registros", "arquivos"], "readwrite", tx => {
      tx.objectStore("registros").clear();
      tx.objectStore("arquivos").clear();
      tx.objectStore("meta").put({ id: "chave", sal, iteracoes: copia.chave.iteracoes, verificador, criadoEm: Date.now() });
      for (const r of regs) tx.objectStore("registros").put(r);
      for (const a of arqs) tx.objectStore("arquivos").put(a);
    });
    chave = k;
    memoria = nova;
    avisar({ tipo: "recarregado" });
    return true;
  }

  async function apagarTudo() {
    await transacao(["meta", "registros", "arquivos"], "readwrite", tx => {
      tx.objectStore("registros").clear();
      tx.objectStore("arquivos").clear();
      tx.objectStore("meta").delete("chave");
    });
    bloquear();
    avisar({ tipo: "apagado" });
  }

  // ---------- Avisos de mudança (inclusive entre abas) ----------
  function avisar(evento, deOutraAba) {
    for (const f of ouvintes) { try { f(evento, !!deOutraAba); } catch (e) { console.error(e); } }
    if (!deOutraAba && canal) canal.postMessage(evento);
  }
  function aoMudar(f) { ouvintes.add(f); return () => ouvintes.delete(f); }

  if (canal) {
    canal.onmessage = async ev => {
      const e = ev.data || {};
      if (!chave) return;
      try {
        if (e.tipo === "salvo") {
          const bruto = await pegar("registros", e.id);
          if (bruto) memoria.set(e.id, await decifrarJSON(chave, bruto.iv, bruto.dados));
        } else if (e.tipo === "excluido") {
          for (const id of e.ids) memoria.delete(id);
        } else if (e.tipo === "apagado" || e.tipo === "recarregado") {
          bloquear();
        }
      } catch (err) { /* chave diferente (senha trocada em outra aba): bloqueia por segurança */ bloquear(); }
      avisar(e, true);
    };
  }

  LB.banco = {
    abrir, estado, criar, desbloquear, bloquear, aberto, persistente,
    listar, obter, salvar, excluir, salvarArquivo, lerArquivo,
    lerPublico, gravarPublico, removerPublico,
    trocarSenha, exportarCopia, importarCopia, apagarTudo, aoMudar
  };
})(window.LB = window.LB || {});
