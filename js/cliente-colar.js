// Life Ateliê · Lê a mensagem em que a cliente manda os dados (nome, CPF, endereço, CEP, telefone, e-mail)
// e separa nos campos do cadastro. Aceita com rótulos ("CPF: ...") ou sem ("Rua das Flores, 100 - Centro").
// Funciona no navegador (window.LerCliente) e no Node (testes).
(function (raiz) {
  "use strict";
  const UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
  const ESTADOS = {
    "acre": "AC", "alagoas": "AL", "amapa": "AP", "amazonas": "AM", "bahia": "BA", "ceara": "CE", "distrito federal": "DF", "espirito santo": "ES",
    "goias": "GO", "maranhao": "MA", "mato grosso": "MT", "mato grosso do sul": "MS", "minas gerais": "MG", "minas": "MG", "para": "PA", "paraiba": "PB",
    "parana": "PR", "pernambuco": "PE", "piaui": "PI", "rio de janeiro": "RJ", "rio grande do norte": "RN", "rio grande do sul": "RS",
    "rondonia": "RO", "roraima": "RR", "santa catarina": "SC", "sao paulo": "SP", "sergipe": "SE", "tocantins": "TO",
  };
  const CAMPOS = ["nome", "telefone", "documento", "email", "cep", "rua", "numero", "complemento", "bairro", "cidade", "uf", "observacoes"];
  const sem = (s) => String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
  const dig = (s) => String(s == null ? "" : s).replace(/\D/g, "");
  const limpo = (s) => String(s == null ? "" : s).replace(/\s+/g, " ").replace(/^[\s,;.:\-–—|]+|[\s,;:\-–—|]+$/g, "").trim();

  // ---------- documentos ----------
  function cpfValido(d) {
    if (!/^\d{11}$/.test(d) || /^(\d)\1+$/.test(d)) return false;
    const dv = (n) => { let s = 0; for (let i = 0; i < n; i++) s += Number(d[i]) * (n + 1 - i); const r = (s * 10) % 11; return r === 10 ? 0 : r; };
    return dv(9) === Number(d[9]) && dv(10) === Number(d[10]);
  }
  function cnpjValido(d) {
    if (!/^\d{14}$/.test(d) || /^(\d)\1+$/.test(d)) return false;
    const dv = (n) => { const p = n === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]; const s = p.reduce((t, x, i) => t + x * Number(d[i]), 0); const r = s % 11; return r < 2 ? 0 : 11 - r; };
    return dv(12) === Number(d[12]) && dv(13) === Number(d[13]);
  }
  function formatarDocumento(s) {
    const d = dig(s);
    if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    return limpo(s);
  }
  const formatarCep = (s) => { const d = dig(s); return d.length === 8 ? d.slice(0, 5) + "-" + d.slice(5) : limpo(s); };
  function formatarTelefone(s) {
    let d = dig(s);
    if ((d.length === 12 || d.length === 13) && d.startsWith("55")) d = d.slice(2);
    d = d.replace(/^0+/, "");
    if (d.length === 11) return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    if (d.length === 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return limpo(s);
  }
  const PEQUENAS = new Set(["da", "de", "do", "das", "dos", "e"]);
  function formatarNome(s) {
    const t = limpo(s);
    if (t !== t.toLowerCase() && t !== t.toUpperCase()) return t; // já veio com maiúsculas do jeito dela
    return t.toLowerCase().split(" ").map((p, i) => (i && PEQUENAS.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1))).join(" ");
  }
  const ufDe = (s) => { const t = sem(s).replace(/\./g, ""); if (t.length === 2 && UFS.includes(t.toUpperCase())) return t.toUpperCase(); return ESTADOS[t] || ""; };

  // ---------- reconhecimento ----------
  const RE_EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/;
  const RE_CPF = /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/;
  const RE_CNPJ = /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/;
  const RE_CEP = /\b\d{5}-\d{3}\b|\b\d{2}\.\d{3}-\d{3}\b/;
  const RE_FONE = /(?:\+?55[\s.-]?)?\(?0?\d{2}\)?[\s.-]?9?\s?\d{4}[\s.-]?\d{4}\b/;
  const RE_RUA = /^(rua|r\.|av\.?|avenida|travessa|tv\.?|trav\.?|alameda|al\.?|estrada|est\.?|rodovia|rod\.?|pra[cç]a|p[cç]\.?|beco|largo|servid[aã]o|vila|via|quadra|qd\.?|condom[ií]nio|cond\.?)\s/i;
  const RE_COMPL = /^(apto?\.?|apartamento|ap\.?|bloco|bl\.?|casa|cs\.?|fundos|frente|sala|loja|lj\.?|cj\.?|conj\.?|conjunto|lote|lt\.?|quadra|qd\.?|andar|torre|unidade|box|kitnet|sobrado)\b/i;
  const SAUDACAO = /^(oi+|ol[aá]|bom dia|boa tarde|boa noite|segue|seguem|meus dados|os dados|dados( para| pra| do| de)?|aqui (est[aã]o|vai|vão)|obrigad|tudo bem|ok\b|pode (mandar|enviar)|para (envio|entrega)|pra (envio|entrega)|endere[cç]o (para|pra|de) (envio|entrega))/i;

  // rótulo (sem acento) → campo
  const ROTULOS = [
    [/^(nome|nome completo|cliente|destinatari[oa]|para|recebedor[a]?)$/, "nome"],
    [/^(cpf|cnpj|cpf\/cnpj|cpf ou cnpj|documento|doc|rg\/cpf)$/, "documento"],
    [/^(tel|tel\.|telefone|telefones|cel|celular|whats|whatsapp|zap|wpp|contato|fone)$/, "telefone"],
    [/^(e-mail|email|e mail)$/, "email"],
    [/^(cep)$/, "cep"],
    [/^(endereco|endereco completo|end|end\.|endereco de entrega|endereco para entrega|endereco pra entrega|rua|logradouro|avenida|av)$/, "endereco"],
    [/^(numero|n|no|n°|nº|num|num\.|n\.)$/, "numero"],
    [/^(complemento|compl|compl\.|apto|apartamento|ap|bloco)$/, "complemento"],
    [/^(bairro)$/, "bairro"],
    [/^(cidade|municipio)$/, "cidade"],
    [/^(estado|uf)$/, "uf"],
    [/^(cidade\/uf|cidade \/ uf|cidade\/estado|cidade e estado|cidade-uf|cidade - uf|cidade\/ uf)$/, "cidadeuf"],
    [/^(referencia|ponto de referencia|obs|obs\.|observacao|observacoes)$/, "observacoes"],
  ];
  const campoDoRotulo = (r) => { const t = sem(r).replace(/[:=]+$/, "").trim(); const a = ROTULOS.find(([re]) => re.test(t)); return a ? a[1] : null; };
  // "Nome: Maria, CPF: 123..." numa linha só: separa antes de cada rótulo conhecido
  const RE_QUEBRA_ROTULO = /\s*[,;|]\s*(?=(?:nome|cpf|cnpj|tel(?:efone)?|cel(?:ular)?|whats(?:app)?|e-?mail|cep|endere[cç]o|rua|n[uú]mero|complemento|bairro|cidade|estado|uf)\s*[:=])/gi;

  // "Belo Horizonte - MG", "Belo Horizonte/MG", "BH, Minas Gerais" → { cidade, uf }
  function lerCidadeUf(txt) {
    const t = limpo(txt);
    let m = t.match(/^(.+?)\s*(?:\/|-|–|,|\s)\s*([A-Za-zÀ-ú ]{2,20})$/);
    if (m) { const uf = ufDe(m[2]); if (uf && /[A-Za-zÀ-ú]/.test(m[1])) return { cidade: limpo(m[1]), uf }; }
    const so = ufDe(t);
    return so ? { cidade: "", uf: so } : null;
  }

  // "Rua das Flores, 100, apto 201 - Centro, Belo Horizonte - MG, 30110-000"
  function lerEndereco(txt, out) {
    let t = String(txt || "");
    let m;
    if (!out.cep && (m = t.match(RE_CEP) || t.match(/\bcep\D{0,3}(\d{8})\b/i))) { out.cep = formatarCep(m[1] || m[0]); t = t.replace(m[0], " "); }
    t = t.replace(/\bcep\b\s*:?/i, " ");
    const toks = t.split(/\s*[,;]\s*|\s+[-–—]\s+|\s*\|\s*/).map(limpo).filter(Boolean);
    const resto = [];
    toks.forEach((tok, i) => {
      if (i === 0 && !out.rua) {
        const mm = tok.match(/^(.*?\D)[\s,]+(?:n[º°o.]?\s*)?(\d+[A-Za-z]?)(?:\s+(.*))?$/);
        if (mm && RE_RUA.test(tok + " ")) {
          out.rua = limpo(mm[1]); out.numero = out.numero || mm[2];
          if (mm[3]) { if (RE_COMPL.test(mm[3])) out.complemento = juntar(out.complemento, mm[3]); else resto.push(mm[3]); }
        } else out.rua = tok;
        return;
      }
      let k;
      if (!out.numero && (k = tok.match(/^(?:n[º°o.]?\s*)?(\d+[A-Za-z]?|s\/?n)(?:\s+(.*))?$/i))) {
        out.numero = /s\/?n/i.test(k[1]) ? "s/n" : k[1];
        if (k[2]) { if (RE_COMPL.test(k[2])) out.complemento = juntar(out.complemento, k[2]); else resto.push(k[2]); }
        return;
      }
      if (RE_COMPL.test(tok)) { out.complemento = juntar(out.complemento, tok); return; }
      if ((k = tok.match(/^bairro\s*:?\s*(.+)$/i))) { out.bairro = limpo(k[1]); return; }
      const cu = lerCidadeUf(tok);
      if (cu && cu.uf && (cu.cidade || !out.uf)) { out.uf = cu.uf; if (cu.cidade) out.cidade = cu.cidade; else if (resto.length && !out.cidade) out.cidade = resto.pop(); return; }
      resto.push(tok);
    });
    // sobrou "Centro" (bairro) e talvez a cidade (quando veio o estado)
    if (out.uf && !out.cidade && resto.length) out.cidade = resto.pop();
    if (!out.bairro && resto.length) out.bairro = resto.shift();
    if (resto.length) out.complemento = juntar(out.complemento, resto.join(", "));
  }
  const juntar = (a, b) => (a ? a + ", " + b : b);

  function ler(texto) {
    const out = {};
    const naoEntendi = [];
    let ruaAchada = false;
    const linhas = String(texto || "")
      .replace(/\r/g, "")
      .split("\n")
      .flatMap((l) => l.split(RE_QUEBRA_ROTULO))
      .map((l) => l.replace(/^[^\p{L}\p{N}(+]+/u, "").replace(/\*/g, "").trim()) // tira marcadores, emojis e negrito
      .filter(Boolean);

    for (const linha of linhas) {
      // ---- com rótulo: "CPF: 123..." ----
      // rótulo sem dois-pontos: "Nome Maria Souza", "Bairro Centro", "Cidade Contagem"
      const r = linha.match(/^([^:=]{1,32}?)\s*[:=]\s*(.*)$/) || linha.match(/^(nome completo|nome|bairro|cidade|complemento|n[uú]mero|estado)\s+(?!d[aeo]s?\s)(.+)$/i);
      const campo = r ? campoDoRotulo(r[1]) : null;
      if (campo) {
        const v = limpo(r[2]);
        if (!v) continue;
        if (campo === "endereco") { lerEndereco(v, out); ruaAchada = true; }
        else if (campo === "cidadeuf") { const cu = lerCidadeUf(v); if (cu) { if (cu.cidade) out.cidade = cu.cidade; out.uf = cu.uf; } else out.cidade = v; }
        else if (campo === "cidade") { const cu = lerCidadeUf(v); if (cu && cu.cidade) { out.cidade = cu.cidade; out.uf = out.uf || cu.uf; } else out.cidade = v; }
        else if (campo === "uf") out.uf = ufDe(v) || v.toUpperCase().slice(0, 2);
        else if (campo === "numero") { const k = v.match(/^(\d+[A-Za-z]?|s\/?n)\b[\s,-]*(.*)$/i); if (k) { out.numero = /s\/?n/i.test(k[1]) ? "s/n" : k[1]; if (k[2]) out.complemento = juntar(out.complemento, limpo(k[2])); } else out.numero = v; }
        else if (campo === "complemento") out.complemento = juntar(out.complemento, v);
        else if (campo === "observacoes") out.observacoes = juntar(out.observacoes, v);
        else if (campo === "documento") out.documento = formatarDocumento(v);
        else if (campo === "cep") out.cep = formatarCep(v);
        else if (campo === "telefone") out.telefone = formatarTelefone(v);
        else if (campo === "nome") out.nome = formatarNome(v);
        else out[campo] = v;
        continue;
      }
      // ---- sem rótulo: descobre pelo jeito ----
      let t = linha, m;
      if (SAUDACAO.test(sem(t)) && !/\d/.test(t)) continue;
      if (!out.email && (m = t.match(RE_EMAIL))) { out.email = m[0]; t = t.replace(m[0], " "); }
      if (!out.documento && (m = t.match(RE_CNPJ) || t.match(RE_CPF) || t.match(/\b(?:cpf|cnpj)\D{0,4}(\d{11}|\d{14})\b/i))) { out.documento = formatarDocumento(m[1] || m[0]); t = t.replace(m[0], " "); }
      if (RE_RUA.test(limpo(t) + " ")) { lerEndereco(t, out); ruaAchada = true; continue; }
      if (!out.cep && (m = t.match(RE_CEP) || t.match(/\bcep\D{0,4}(\d{8})\b/i))) { out.cep = formatarCep(m[1] || m[0]); t = t.replace(m[0], " "); }
      // só números: CPF (confere os dígitos), CNPJ, CEP ou telefone
      const so = dig(t);
      if (so && /^[\d\s().+\-/]+$/.test(limpo(t))) {
        if (!out.documento && so.length === 11 && cpfValido(so)) { out.documento = formatarDocumento(so); continue; }
        if (!out.documento && so.length === 14 && cnpjValido(so)) { out.documento = formatarDocumento(so); continue; }
        if (!out.cep && so.length === 8) { out.cep = formatarCep(so); continue; }
        if (!out.telefone && so.length >= 10 && so.length <= 13) { out.telefone = formatarTelefone(so); continue; }
      }
      if (!out.telefone && (m = t.match(RE_FONE)) && dig(m[0]).length >= 10) { out.telefone = formatarTelefone(m[0]); t = t.replace(m[0], " "); }
      t = limpo(t.replace(/\b(cpf|cnpj|cep|tel(?:efone)?|cel(?:ular)?|whats(?:app)?|e-?mail)\b/gi, " "));
      if (!t) continue;
      // cidade/estado
      const cu = lerCidadeUf(t);
      if (cu && cu.uf && cu.cidade && !out.cidade) { out.cidade = cu.cidade; out.uf = cu.uf; continue; }
      if (cu && cu.uf && !cu.cidade && !out.uf) { out.uf = cu.uf; continue; }
      const soLetras = /^[A-Za-zÀ-ú' .]+$/.test(t);
      if (soLetras && !out.nome && !ruaAchada && t.split(" ").length >= 2) { out.nome = formatarNome(t); continue; }
      if (soLetras && ruaAchada && !out.bairro && t.split(" ").length <= 5) { out.bairro = t; continue; }
      if (soLetras && ruaAchada && out.bairro && !out.cidade && t.split(" ").length <= 5) { out.cidade = t; continue; }
      if (soLetras && !out.nome && !ruaAchada) { out.nome = formatarNome(t); continue; }
      naoEntendi.push(linha);
    }
    CAMPOS.forEach((k) => { if (out[k] != null) out[k] = String(out[k]).trim(); if (out[k] === "") delete out[k]; });
    return { campos: out, naoEntendi };
  }

  // Dados da cliente escritos no meio de uma observação ("Entrega sexta\nCPF 123...\nRua X, 10 - Centro").
  // Só conta como dados se tiver CPF/CNPJ, CEP, rua ou e-mail (um telefone sozinho não basta).
  // Devolve os campos de cadastro (sem o nome: quem manda é o nome do orçamento) e a observação sem essas linhas.
  const DE_CADASTRO = ["documento", "email", "telefone", "cep", "rua", "numero", "complemento", "bairro", "cidade", "uf"];
  const FORTES = ["documento", "email", "cep", "rua"];
  function dadosNaObservacao(texto) {
    const original = String(texto == null ? "" : texto).trim();
    const { campos } = ler(original);
    if (!FORTES.some((k) => campos[k])) return { achou: false, campos: {}, resto: original };
    const usar = {};
    DE_CADASTRO.forEach((k) => { if (campos[k]) usar[k] = campos[k]; });
    // tira da observação as linhas que eram dados da cliente (o resto continua sendo observação)
    const resto = original.split("\n").filter((linha) => {
      const t = linha.replace(/^[^\p{L}\p{N}(+]+/u, "").replace(/\*/g, "").trim();
      if (!t) return false;
      const rot = t.match(/^([^:=]{1,32}?)\s*[:=]/);
      const campoRot = rot ? campoDoRotulo(rot[1]) : null;
      if (campoRot && campoRot !== "observacoes") return false;
      const c = ler(t).campos;
      if (["documento", "email", "telefone", "cep", "rua"].some((k) => c[k])) return false;
      if (c.cidade && c.uf) return false;
      if (campos.bairro && limpo(t) === campos.bairro) return false;
      return true;
    }).join("\n").trim();
    return { achou: true, campos: usar, resto };
  }

  // ---------- validação do cadastro ----------
  const telDigitos = (s) => { let d = dig(s); if ((d.length === 12 || d.length === 13) && d.startsWith("55")) d = d.slice(2); return d.replace(/^0+/, ""); };
  function validarCadastro(c) {
    const erros = [];
    if (!limpo(c.nome)) erros.push({ campo: "nome", msg: "Escreva o nome da cliente." });
    const doc = dig(c.documento);
    if (limpo(c.documento) && !((doc.length === 11 && cpfValido(doc)) || (doc.length === 14 && cnpjValido(doc))))
      erros.push({ campo: "documento", msg: "O CPF/CNPJ não confere (algum número está errado). Confira ou deixe em branco." });
    if (limpo(c.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(limpo(c.email))) erros.push({ campo: "email", msg: "O e-mail não parece certo (exemplo: nome@gmail.com)." });
    if (limpo(c.cep) && dig(c.cep).length !== 8) erros.push({ campo: "cep", msg: "O CEP precisa ter 8 números." });
    if (limpo(c.uf) && !UFS.includes(limpo(c.uf).toUpperCase())) erros.push({ campo: "uf", msg: "A UF precisa ser a sigla do estado (ex.: MG)." });
    const t = telDigitos(c.telefone);
    if (limpo(c.telefone) && t.length !== 10 && t.length !== 11) erros.push({ campo: "telefone", msg: "O telefone precisa ter DDD e número (ex.: (31) 99999-9999)." });
    return erros;
  }

  // Outra cliente já cadastrada que parece ser a mesma pessoa.
  // forte = mesmo CPF/CNPJ ou mesmo nome (o nome não pode repetir); fraca = mesmo telefone ou e-mail
  function acharDuplicadas(c, clientes, idAtual) {
    const doc = dig(c.documento), nome = sem(c.nome), tel = telDigitos(c.telefone), email = sem(c.email);
    const saida = [];
    (clientes || []).forEach((x) => {
      if (!x || x.id === idAtual) return;
      if ((doc.length === 11 || doc.length === 14) && dig(x.documento) === doc) saida.push({ cliente: x, motivo: "o mesmo CPF/CNPJ", forte: true });
      else if (nome && sem(x.nome) === nome) saida.push({ cliente: x, motivo: "o mesmo nome", forte: true });
      else if (tel.length >= 10 && telDigitos(x.telefone) === tel) saida.push({ cliente: x, motivo: "o mesmo telefone", forte: false });
      else if (email && sem(x.email) === email) saida.push({ cliente: x, motivo: "o mesmo e-mail", forte: false });
    });
    return saida.sort((a, b) => Number(b.forte) - Number(a.forte));
  }

  // ---------- importação das clientes do Bling ----------
  // contatos: [{ bling_id, nome, documento, telefone, email, cep, rua, numero, complemento, bairro, cidade, uf, situacao, tipos, parcial }]
  // Nunca apaga nem troca o que já está no sistema: quem já existe só ganha os campos vazios.
  const CAMPOS_IMPORT = ["documento", "telefone", "email", "cep", "rua", "numero", "complemento", "bairro", "cidade", "uf"];
  function compararImportacao(clientes, contatos) {
    const r = { novas: [], completar: [], vincular: [], iguais: 0, conferir: [], ignoradas: [] };
    const docOk = (s) => { const d = dig(s); return d.length === 11 || d.length === 14 ? d : ""; };
    const porBling = new Map(), porDoc = new Map(), porNome = new Map();
    (clientes || []).forEach((c) => {
      if (c.bling_contato_id) porBling.set(String(c.bling_contato_id), c);
      if (docOk(c.documento)) porDoc.set(docOk(c.documento), c);
      porNome.set(sem(c.nome), c);
    });
    const vistosDoc = new Map(), vistosNome = new Map(), usados = new Set();
    (contatos || []).forEach((b) => {
      const nome = limpo(b.nome);
      const tipos = (b.tipos || []).map((t) => sem(t));
      if (b.situacao === "E") return r.ignoradas.push({ contato: b, motivo: "excluída no Bling" });
      if (!nome || /^consumidor final$/i.test(nome)) return r.ignoradas.push({ contato: b, motivo: "sem nome / consumidor final" });
      if (tipos.length && !tipos.some((t) => /cliente/.test(t)) && tipos.some((t) => /fornecedor|transportador|vendedor|tecnico/.test(t)))
        return r.ignoradas.push({ contato: b, motivo: "não é cliente (" + b.tipos.join(", ") + ")" });
      const doc = docOk(b.documento), nomeN = sem(nome);
      // repetidas no próprio Bling
      if (doc && vistosDoc.has(doc)) return r.conferir.push({ contato: b, motivo: "CPF/CNPJ repetido no Bling (igual ao de " + vistosDoc.get(doc) + ")" });
      if (doc) vistosDoc.set(doc, nome);
      let c = porBling.get(String(b.bling_id)) || (doc && porDoc.get(doc)) || null;
      if (!c) {
        const mesmoNome = porNome.get(nomeN);
        if (mesmoNome) {
          const docC = docOk(mesmoNome.documento), telC = telDigitos(mesmoNome.telefone), telB = telDigitos(b.telefone);
          if (docC && doc && docC !== doc) return r.conferir.push({ contato: b, cliente: mesmoNome, motivo: "mesmo nome de uma cliente daqui, mas com outro CPF/CNPJ" });
          if (telC && telB && telC === telB) c = mesmoNome; // nome e telefone iguais: é a mesma
          else return r.conferir.push({ contato: b, cliente: mesmoNome, motivo: "mesmo nome de uma cliente daqui, sem CPF/CNPJ ou telefone para confirmar", podeCompletar: true });
        }
      }
      if (c) {
        if (usados.has(c.id)) return r.conferir.push({ contato: b, cliente: c, motivo: "outro cadastro do Bling já foi ligado a esta cliente" });
        usados.add(c.id);
        const campos = {}, diferencas = [];
        CAMPOS_IMPORT.forEach((k) => {
          const novo = limpo(b[k]), atual = limpo(c[k]);
          if (novo && !atual) campos[k] = k === "uf" ? novo.toUpperCase() : novo;
          else if (novo && atual && (["documento", "telefone", "cep"].includes(k) ? dig(novo) !== dig(atual) : sem(novo) !== sem(atual))) diferencas.push(k);
        });
        const precisaId = String(c.bling_contato_id || "") !== String(b.bling_id);
        if (Object.keys(campos).length) r.completar.push({ cliente: c, contato: b, campos, diferencas, precisaId });
        else { r.iguais++; if (precisaId) r.vincular.push({ cliente: c, contato: b }); }
        return;
      }
      if (vistosNome.has(nomeN)) return r.conferir.push({ contato: b, motivo: "nome repetido no Bling (outro cadastro com o mesmo nome)" });
      vistosNome.set(nomeN, true);
      const faltam = [];
      if (!doc) faltam.push("sem CPF/CNPJ");
      if (!limpo(b.rua) || !limpo(b.cidade)) faltam.push("sem endereço");
      if (!limpo(b.telefone)) faltam.push("sem telefone");
      r.novas.push({ contato: b, faltam });
    });
    return r;
  }
  // linha para gravar no cadastro a partir de um contato do Bling
  function linhaDoContato(b) {
    const linha = { nome: limpo(b.nome), bling_contato_id: b.bling_id || null };
    CAMPOS_IMPORT.forEach((k) => { const v = limpo(b[k]); linha[k] = v ? (k === "uf" ? v.toUpperCase() : v) : null; });
    return linha;
  }

  const api = { ler, dadosNaObservacao, validarCadastro, acharDuplicadas, compararImportacao, linhaDoContato, cpfValido, cnpjValido, formatarDocumento, formatarCep, formatarTelefone, formatarNome, CAMPOS, CAMPOS_IMPORT };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else raiz.LerCliente = api;
})(typeof window !== "undefined" ? window : globalThis);
