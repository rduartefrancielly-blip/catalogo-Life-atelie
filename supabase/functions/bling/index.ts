// Life Ateliê · Função "bling" do Supabase
// Conecta a conta da empresa no Bling (OAuth 2.0) e envia as vendas do sistema como pedidos de venda.
//
// Caminhos (https://<projeto>.supabase.co/functions/v1/bling/...):
//   POST /iniciar      administradora → devolve o link de autorização do Bling
//   GET  /retorno      o Bling volta aqui depois que você autoriza (guarda a conexão)
//   GET  /status       administradora → conectado ou não
//   POST /enviar       administradora → { ids: [...] } envia essas vendas
//   GET  /vendedores   administradora → vendedoras cadastradas no Bling
//   POST /vendedor     administradora → { id } vendedora que vai nos pedidos (0 = sem vendedora)
//   POST /clientes-bling administradora → { pagina } uma página das clientes do Bling (com endereço)
//   POST /desconectar  administradora → apaga a conexão
//
// Segredos (Supabase → Edge Functions → Secrets): BLING_CLIENT_ID e BLING_CLIENT_SECRET.
// SUPABASE_URL e a chave do servidor o próprio Supabase já entrega para a função.
// Em "Verify JWT" (Enforce JWT verification) deixe DESLIGADO: o Bling volta para /retorno sem login;
// as outras rotas conferem o login aqui dentro.

const VERSAO = "2026-11-12";
const BLING_API = "https://api.bling.com.br/Api/v3";
const BLING_OAUTH = "https://www.bling.com.br/Api/v3";
const VOLTA_PADRAO = "https://rduartefrancielly-blip.github.io/catalogo-Life-atelie/vendas.html";
const VOLTAS_ACEITAS = ["https://rduartefrancielly-blip.github.io/", "http://127.0.0.1:", "http://localhost:"];
const MAX_POR_VEZ = 15; // vendas por chamada (o Bling aceita ~3 pedidos por segundo)

const env = (k: string): string => Deno.env.get(k) || "";
const supaUrl = (): string => env("SUPABASE_URL").replace(/\/+$/, "");
function primeiraChave(nome: string): string {
  try { const j = JSON.parse(env(nome) || "{}"); return j.default || Object.values(j)[0] || ""; } catch (_) { return ""; }
}
const chaveServidor = (): string => env("SUPABASE_SERVICE_ROLE_KEY") || primeiraChave("SUPABASE_SECRET_KEYS");
const chavePublica = (): string => env("SUPABASE_ANON_KEY") || primeiraChave("SUPABASE_PUBLISHABLE_KEYS") || chaveServidor();
// chave nova (sb_secret_...) vai só no apikey; a antiga (JWT) vai também no Authorization
const cabServidor = (): Record<string, string> => { const k = chaveServidor(); return k.startsWith("sb_") ? { apikey: k } : { apikey: k, Authorization: "Bearer " + k }; };

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
const resposta = (dados: unknown, status = 200): Response =>
  new Response(JSON.stringify(dados), { status, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" } });

class ErroBling extends Error {
  reconectar: boolean;
  constructor(msg: string, reconectar = false) { super(msg); this.reconectar = reconectar; }
}

// ---------------------------------------------------------------------
// Banco (PostgREST com a chave do servidor)
// ---------------------------------------------------------------------
async function db(caminho: string, op: { method?: string; body?: unknown; prefer?: string } = {}): Promise<any> {
  const r = await fetch(supaUrl() + "/rest/v1/" + caminho, {
    method: op.method || "GET",
    headers: { ...cabServidor(), "Content-Type": "application/json", ...(op.prefer ? { Prefer: op.prefer } : {}) },
    body: op.body === undefined ? undefined : JSON.stringify(op.body),
  });
  const t = await r.text();
  if (!r.ok) throw new Error("Banco de dados: " + t.slice(0, 300));
  return t ? JSON.parse(t) : null;
}
const lerConexao = async (): Promise<any> => ((await db("bling_conexao?id=eq.1&select=*")) || [])[0] || null;
const salvarConexao = (dados: Record<string, unknown>) =>
  db("bling_conexao?on_conflict=id", { method: "POST", body: { id: 1, ...dados }, prefer: "resolution=merge-duplicates,return=minimal" });

// Só a administradora (a mesma regra do catálogo: tabela admins)
async function conferirAdmin(req: Request): Promise<string | null> {
  const jwt = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!jwt || jwt.startsWith("sb_")) return "Entre no sistema de novo e tente outra vez.";
  const r = await fetch(supaUrl() + "/rest/v1/rpc/eh_admin", {
    method: "POST", headers: { apikey: chavePublica(), Authorization: "Bearer " + jwt, "Content-Type": "application/json" }, body: "{}",
  });
  if (!r.ok) return "Não consegui conferir o seu login. Entre no sistema de novo.";
  return (await r.json()) === true ? null : "Só a administradora pode usar a integração com o Bling.";
}

// ---------------------------------------------------------------------
// Bling: tokens e chamadas
// ---------------------------------------------------------------------
async function pedirToken(corpo: Record<string, string>): Promise<string> {
  const basic = btoa(env("BLING_CLIENT_ID") + ":" + env("BLING_CLIENT_SECRET"));
  const r = await fetch(BLING_OAUTH + "/oauth/token", {
    method: "POST",
    headers: { Authorization: "Basic " + basic, "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json", "enable-jwt": "1" },
    body: new URLSearchParams(corpo).toString(),
  });
  const d: any = await r.json().catch(() => ({}));
  if (!r.ok || !d.access_token) throw new ErroBling("O Bling não aceitou a conexão (" + (textoErro(d) || "erro " + r.status) + "). Toque em Conectar ao Bling de novo.", true);
  await salvarConexao({
    access_token: d.access_token,
    refresh_token: d.refresh_token,
    expira_em: new Date(Date.now() + (Number(d.expires_in) || 21600) * 1000).toISOString(),
    renovado_em: new Date().toISOString(),
  });
  return d.access_token;
}
async function tokenAtual(): Promise<string> {
  const c = await lerConexao();
  if (!c || !c.refresh_token) throw new ErroBling("O Bling ainda não está conectado. Toque em Conectar ao Bling.", true);
  if (c.access_token && c.expira_em && new Date(c.expira_em).getTime() - 120000 > Date.now()) return c.access_token;
  return pedirToken({ grant_type: "refresh_token", refresh_token: c.refresh_token });
}

let ultimaChamada = 0;
const dormir = (ms: number) => new Promise((ok) => setTimeout(ok, ms));
async function bling(metodo: string, caminho: string, corpo?: unknown, tentativa = 0): Promise<any> {
  const token = await tokenAtual();
  const falta = ultimaChamada + 380 - Date.now(); // no máximo ~3 chamadas por segundo
  if (falta > 0) await dormir(falta);
  ultimaChamada = Date.now();
  const r = await fetch(BLING_API + "/" + caminho, {
    method: metodo,
    headers: { Authorization: "Bearer " + token, "enable-jwt": "1", Accept: "application/json", ...(corpo ? { "Content-Type": "application/json" } : {}) },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  if (r.status === 429 && tentativa < 3) { await dormir(1200); return bling(metodo, caminho, corpo, tentativa + 1); }
  if (r.status === 401 && tentativa < 1) {
    const c = await lerConexao();
    if (c && c.refresh_token) await pedirToken({ grant_type: "refresh_token", refresh_token: c.refresh_token });
    return bling(metodo, caminho, corpo, tentativa + 1);
  }
  const t = await r.text();
  let d: any = {};
  try { d = t ? JSON.parse(t) : {}; } catch (_) { d = { message: t.slice(0, 200) }; }
  if (!r.ok) throw new ErroBling(textoErro(d) || "O Bling respondeu com erro " + r.status + ".", r.status === 401);
  return d;
}
function textoErro(d: any): string {
  if (!d) return "";
  const e = d.error;
  if (!e || typeof e !== "object") return d.error_description || d.message || (typeof e === "string" ? e : "");
  const campos = (e.fields || []).map((f: any) => f && f.msg).filter(Boolean);
  return [e.description || e.message, ...campos].filter(Boolean).join(" · ");
}

// ---------------------------------------------------------------------
// Venda → pedido de venda
// ---------------------------------------------------------------------
const digitos = (s: unknown): string => String(s == null ? "" : s).replace(/\D/g, "");
const norm = (s: unknown): string => String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
const arred = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;
const diaSP = (iso: string): string => new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" }); // AAAA-MM-DD
function somarDias(dia: string, n: number): string { const d = new Date(dia + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
function dividir(total: number, n: number): number[] {
  const base = Math.floor((total * 100) / n) / 100;
  const partes = Array.from({ length: n }, () => base);
  partes[n - 1] = arred(total - base * (n - 1));
  return partes;
}
const PAGAMENTO_NOME: Record<string, string> = { pix: "Pix", credito: "Cartão de crédito", aguardando: "Aguardando pagamento" };

function escolherForma(formas: any[], pagamento: string): any {
  const achar = (f: (x: any) => boolean) => formas.find(f);
  if (pagamento === "pix") return achar((x) => [17, 20].includes(Number(x.tipoPagamento))) || achar((x) => /pix/i.test(x.descricao || ""));
  if (pagamento === "credito") return achar((x) => Number(x.tipoPagamento) === 3) || achar((x) => /cr[eé]dito/i.test(x.descricao || ""));
  return achar((x) => Number(x.padrao) === 1) || achar((x) => [99, 90, 15].includes(Number(x.tipoPagamento))) || formas[0];
}

async function contatoDaVenda(v: any, c: any): Promise<number> {
  if (c && c.bling_contato_id) return Number(c.bling_contato_id);
  const doc = digitos(c && c.documento);
  let id: number | null = null;
  if (doc.length === 11 || doc.length === 14) {
    const d = await bling("GET", "contatos?limite=5&numeroDocumento=" + doc);
    id = (d.data && d.data[0] && d.data[0].id) || null;
  }
  if (!id) {
    const d = await bling("GET", "contatos?limite=100&pesquisa=" + encodeURIComponent(v.cliente_nome));
    const igual = (d.data || []).find((x: any) => norm(x.nome) === norm(v.cliente_nome));
    id = (igual && igual.id) || null;
  }
  if (!id) {
    const tel = digitos(c && c.telefone).replace(/^55(?=\d{10,11}$)/, "");
    const end: Record<string, string> = {};
    const pares: [string, unknown][] = [["endereco", c && c.rua], ["numero", c && c.numero], ["complemento", c && c.complemento], ["bairro", c && c.bairro], ["cep", digitos(c && c.cep)], ["municipio", c && c.cidade], ["uf", String((c && c.uf) || "").toUpperCase()]];
    pares.forEach(([k, val]) => { if (String(val || "").trim()) end[k] = String(val).trim(); });
    const corpo: Record<string, unknown> = { nome: v.cliente_nome, tipo: doc.length === 14 ? "J" : "F", situacao: "A" };
    if (doc) corpo.numeroDocumento = doc;
    if (tel.length === 11) corpo.celular = tel; else if (tel) corpo.telefone = tel;
    if (c && c.email) corpo.email = c.email;
    if (Object.keys(end).length) corpo.endereco = { geral: end };
    const d = await bling("POST", "contatos", corpo);
    id = d.data.id;
  }
  if (c) { try { await db("clientes?id=eq." + c.id, { method: "PATCH", body: { bling_contato_id: id }, prefer: "return=minimal" }); } catch (_) { /* coluna ainda não criada: segue */ } }
  return Number(id);
}

async function produtosPorCodigo(codigos: string[]): Promise<Map<string, number>> {
  const mapa = new Map<string, number>();
  const unicos = [...new Set(codigos.map((c) => String(c || "").trim()).filter(Boolean))];
  for (let i = 0; i < unicos.length; i += 50) {
    const q = unicos.slice(i, i + 50).map((c) => "codigos[]=" + encodeURIComponent(c)).join("&");
    const d = await bling("GET", "produtos?limite=100&" + q);
    (d.data || []).forEach((p: any) => { if (p && p.codigo && p.id) mapa.set(String(p.codigo).trim().toUpperCase(), p.id); });
  }
  return mapa;
}

async function enviarVenda(v: any, itens: any[], c: any, formas: any[], vendedorId: number): Promise<any> {
  if (v.bling_id) return { ok: true, ja: true, bling_id: v.bling_id, bling_numero: v.bling_numero };
  if (v.status && v.status !== "confirmada") throw new ErroBling("Venda cancelada: não vai para o Bling.");
  if (!itens.length) throw new ErroBling("Venda sem produtos.");
  const numeroLoja = "LIFE-" + v.numero;
  // já foi enviada antes (e a resposta se perdeu)? procura pelo número da loja e não duplica
  const ja = await bling("GET", "pedidos/vendas?limite=5&numerosLojas[]=" + encodeURIComponent(numeroLoja));
  const existente = (ja.data || []).find((p: any) => String(p.numeroLoja || "") === numeroLoja);
  let id: number = existente ? existente.id : 0;
  let numero: unknown = existente ? existente.numero : null;
  if (!id) {
    const mapa = await produtosPorCodigo(itens.map((i) => i.codigo));
    const blItens = itens.map((i) => {
      const cod = String(i.codigo || "").trim();
      const pid = cod ? mapa.get(cod.toUpperCase()) : undefined;
      return { ...(pid ? { produto: { id: pid }, codigo: cod } : {}), descricao: i.descricao || "Produto", unidade: "UN", quantidade: Number(i.quantidade) || 1, valor: arred(Number(i.preco_unit) || 0) };
    });
    const total = arred(blItens.reduce((t, i) => t + i.valor * i.quantidade, 0));
    const forma = escolherForma(formas, v.pagamento);
    if (!forma) throw new ErroBling("Não achei no Bling uma forma de pagamento para \"" + (PAGAMENTO_NOME[v.pagamento] || v.pagamento) + "\". Cadastre em Finanças → Formas de pagamento.");
    const dia = diaSP(v.criado_em);
    const n = v.pagamento === "credito" ? Math.max(1, Math.min(12, Number(v.parcelas) || 1)) : 1;
    const parcelas = dividir(total, n).map((valor, k) => ({ dataVencimento: v.pagamento === "credito" ? somarDias(dia, 30 * (k + 1)) : dia, valor, formaPagamento: { id: forma.id } }));
    const internas = ["Venda nº " + v.numero + " do sistema Life Ateliê", (PAGAMENTO_NOME[v.pagamento] || v.pagamento) + (n > 1 ? " em " + n + "x" : ""), v.observacao || ""].filter(Boolean).join(" · ");
    const corpo: any = { numeroLoja, data: dia, dataSaida: dia, dataPrevista: dia, contato: { id: await contatoDaVenda(v, c) }, itens: blItens, parcelas, observacoesInternas: internas.slice(0, 1000) };
    if (vendedorId) corpo.vendedor = { id: vendedorId };
    let d: any;
    try {
      d = await bling("POST", "pedidos/vendas", corpo);
    } catch (e) {
      // a cliente guardada foi apagada no Bling: esquece o código antigo, acha (ou cadastra) de novo e tenta mais uma vez
      if (!(c && c.bling_contato_id && /contato/i.test(String((e as Error).message)))) throw e;
      c.bling_contato_id = null;
      try { await db("clientes?id=eq." + c.id, { method: "PATCH", body: { bling_contato_id: null }, prefer: "return=minimal" }); } catch (_) { /* segue */ }
      corpo.contato = { id: await contatoDaVenda(v, c) };
      d = await bling("POST", "pedidos/vendas", corpo);
    }
    id = d.data.id;
  }
  // confere o pedido como ficou no Bling: número e vendedora
  let vendedorOk: boolean | null = null;
  try {
    const p = await bling("GET", "pedidos/vendas/" + id);
    if (p.data) {
      numero = p.data.numero != null ? p.data.numero : numero;
      if (vendedorId) vendedorOk = !!(p.data.vendedor && Number(p.data.vendedor.id) === Number(vendedorId));
    }
  } catch (_) { /* o número aparece depois */ }
  await db("vendas?id=eq." + v.id, {
    method: "PATCH", prefer: "return=minimal",
    body: { bling_status: "exportada", bling_em: new Date().toISOString(), bling_id: id, bling_numero: numero != null ? String(numero) : null, bling_erro: null },
  });
  return { ok: true, ja: !!existente, bling_id: id, bling_numero: numero != null ? String(numero) : null, vendedor_ok: vendedorOk };
}

async function enviar(ids: string[]): Promise<any> {
  const lista = ids.filter((x) => /^[0-9a-f-]{36}$/i.test(String(x))).slice(0, MAX_POR_VEZ);
  if (!lista.length) return { resultados: [] };
  const em = "in.(" + lista.join(",") + ")";
  const vendas = await db("vendas?select=*&id=" + em);
  const itens = await db("venda_itens?select=*&order=posicao&venda_id=" + em);
  const idsCli = [...new Set(vendas.map((v: any) => v.cliente_id).filter(Boolean))];
  const clientes = idsCli.length ? await db("clientes?select=*&id=in.(" + idsCli.join(",") + ")") : [];
  const formas = (await bling("GET", "formas-pagamentos?situacao=1&limite=100")).data || [];
  const conexao = await lerConexao();
  const vendedorId = Number((conexao && conexao.vendedor_id) || 0);
  const resultados: any[] = [];
  for (const id of lista) {
    const v = vendas.find((x: any) => x.id === id);
    if (!v) { resultados.push({ id, ok: false, erro: "Venda não encontrada." }); continue; }
    const c = clientes.find((x: any) => x.id === v.cliente_id) || null;
    try {
      resultados.push({ id, numero: v.numero, ...(await enviarVenda(v, itens.filter((i: any) => i.venda_id === id), c, formas, vendedorId)) });
    } catch (e) {
      let msg = String((e && (e as Error).message) || e);
      if (vendedorId && /vendedor/i.test(msg)) msg += " (confira a vendedora escolhida na aba Bling)";
      if (e instanceof ErroBling && e.reconectar) return { resultados, reconectar: true, erro: msg };
      try { await db("vendas?id=eq." + id, { method: "PATCH", body: { bling_erro: msg.slice(0, 500) }, prefer: "return=minimal" }); } catch (_) { /* sem a coluna: só avisa */ }
      resultados.push({ id, numero: v.numero, ok: false, erro: msg });
    }
  }
  return { resultados, vendedor: vendedorId ? { id: vendedorId, nome: conexao.vendedor_nome || "" } : null };
}

// ---------------------------------------------------------------------
// Vendedoras do Bling
// ---------------------------------------------------------------------
async function vendedores(): Promise<any[]> {
  const lista: any[] = [];
  for (let pagina = 1; pagina <= 5; pagina++) {
    const d = await bling("GET", "vendedores?limite=100&pagina=" + pagina);
    const parte = d.data || [];
    parte.forEach((v: any) => { if (v && v.id) lista.push({ id: v.id, nome: (v.contato && v.contato.nome) || "", situacao: (v.contato && v.contato.situacao) || "", contato_id: v.contato && v.contato.id }); });
    if (parte.length < 100) break;
  }
  return lista;
}

// ---------------------------------------------------------------------
// Clientes do Bling (para importar no sistema)
// ---------------------------------------------------------------------
const limpo = (s: unknown): string => String(s == null ? "" : s).replace(/\s+/g, " ").trim();
function formatarDoc(s: unknown): string {
  const d = digitos(s);
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  return limpo(s);
}
function formatarTel(s: unknown): string {
  let d = digitos(s);
  if ((d.length === 12 || d.length === 13) && d.startsWith("55")) d = d.slice(2);
  d = d.replace(/^0+/, "");
  if (d.length === 11) return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  if (d.length === 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
  return limpo(s);
}
const formatarCep = (s: unknown): string => { const d = digitos(s); return d.length === 8 ? d.slice(0, 5) + "-" + d.slice(5) : limpo(s); };
function mapearContato(d: any, parcial: boolean): any {
  const g = (d.endereco && d.endereco.geral) || {};
  return {
    bling_id: d.id, nome: limpo(d.nome), documento: formatarDoc(d.numeroDocumento), telefone: formatarTel(d.celular || d.telefone),
    email: limpo(d.email), cep: formatarCep(g.cep), rua: limpo(g.endereco), numero: limpo(g.numero), complemento: limpo(g.complemento),
    bairro: limpo(g.bairro), cidade: limpo(g.municipio), uf: limpo(g.uf).toUpperCase(), situacao: d.situacao || "",
    tipos: (d.tiposContato || []).map((t: any) => limpo(t && t.descricao)).filter(Boolean), parcial,
  };
}
async function clientesDoBling(pagina: number): Promise<any> {
  const limite = 40;
  const d = await bling("GET", "contatos?limite=" + limite + "&pagina=" + pagina);
  const lista = d.data || [];
  const contatos: any[] = [];
  for (const c of lista) {
    if (c.situacao === "E") continue; // excluída no Bling
    try {
      const det = await bling("GET", "contatos/" + c.id);
      contatos.push(mapearContato(det.data || c, !det.data));
    } catch (e) {
      if (e instanceof ErroBling && e.reconectar) throw e;
      contatos.push(mapearContato(c, true)); // sem os detalhes: fica com nome, documento e telefone
    }
  }
  return { pagina, contatos, fim: lista.length < limite };
}

// ---------------------------------------------------------------------
// Rotas
// ---------------------------------------------------------------------
function codigoAleatorio(): string {
  const b = new Uint8Array(24); crypto.getRandomValues(b);
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function voltar(destino: string, situacao: string): Response {
  const u = new URL(destino || VOLTA_PADRAO); u.searchParams.set("bling", situacao);
  return new Response(null, { status: 302, headers: { Location: u.toString() } });
}

export async function atender(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const url = new URL(req.url);
  const acao = url.pathname.replace(/\/+$/, "").split("/").pop() || "";
  try {
    if (acao === "retorno") {
      const c = await lerConexao();
      const destino = (c && c.volta) || VOLTA_PADRAO;
      if (url.searchParams.get("error")) return voltar(destino, "recusado");
      const code = url.searchParams.get("code"), state = url.searchParams.get("state");
      const valido = c && c.estado && state === c.estado && Date.now() - new Date(c.estado_em).getTime() < 15 * 60000;
      if (!code || !valido) return voltar(destino, "expirou");
      try {
        await pedirToken({ grant_type: "authorization_code", code });
        await salvarConexao({ estado: null, estado_em: null, conectado_em: new Date().toISOString() });
        return voltar(destino, "ok");
      } catch (_) { return voltar(destino, "erro"); }
    }

    const negado = await conferirAdmin(req);
    if (negado) return resposta({ erro: negado }, 403);
    const faltamSegredos = !env("BLING_CLIENT_ID") || !env("BLING_CLIENT_SECRET");

    if (acao === "status") {
      const c = await lerConexao();
      return resposta({
        versao: VERSAO, conectado: !!(c && c.refresh_token), conectado_em: (c && c.conectado_em) || null, faltam_segredos: faltamSegredos,
        vendedor: c && c.vendedor_id != null ? { id: Number(c.vendedor_id), nome: c.vendedor_nome || "" } : null,
      });
    }
    if (acao === "vendedores") return resposta({ vendedores: await vendedores() });
    if (acao === "vendedor" && req.method === "POST") {
      const corpo: any = await req.json().catch(() => ({}));
      const id = Number(corpo.id);
      if (!id) { await salvarConexao({ vendedor_id: 0, vendedor_nome: "" }); return resposta({ ok: true, vendedor: { id: 0, nome: "" } }); }
      const v = (await vendedores()).find((x) => Number(x.id) === id);
      if (!v) return resposta({ erro: "Essa vendedora não foi encontrada no Bling. Atualize a lista e escolha de novo." }, 400);
      await salvarConexao({ vendedor_id: v.id, vendedor_nome: v.nome });
      return resposta({ ok: true, vendedor: { id: v.id, nome: v.nome } });
    }
    if (acao === "clientes-bling" && req.method === "POST") {
      const corpo: any = await req.json().catch(() => ({}));
      return resposta(await clientesDoBling(Math.max(1, Number(corpo.pagina) || 1)));
    }
    if (acao === "iniciar" && req.method === "POST") {
      if (faltamSegredos) return resposta({ erro: "Faltam os segredos BLING_CLIENT_ID e BLING_CLIENT_SECRET na função do Supabase." }, 400);
      const corpo: any = await req.json().catch(() => ({}));
      const volta = VOLTAS_ACEITAS.some((o) => String(corpo.volta || "").startsWith(o)) ? String(corpo.volta) : VOLTA_PADRAO;
      const estado = codigoAleatorio();
      await salvarConexao({ estado, estado_em: new Date().toISOString(), volta });
      const link = BLING_OAUTH + "/oauth/authorize?response_type=code&client_id=" + encodeURIComponent(env("BLING_CLIENT_ID")) + "&state=" + estado;
      return resposta({ url: link });
    }
    if (acao === "enviar" && req.method === "POST") {
      const corpo: any = await req.json().catch(() => ({}));
      return resposta(await enviar(Array.isArray(corpo.ids) ? corpo.ids : []));
    }
    if (acao === "desconectar" && req.method === "POST") {
      await salvarConexao({ access_token: null, refresh_token: null, expira_em: null, conectado_em: null });
      return resposta({ ok: true });
    }
    return resposta({ erro: "Caminho desconhecido." }, 404);
  } catch (e) {
    const reconectar = e instanceof ErroBling && e.reconectar;
    return resposta({ erro: String((e && (e as Error).message) || e), reconectar }, reconectar ? 409 : 500);
  }
}

Deno.serve(atender);
