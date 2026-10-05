// Funções usadas pelo catálogo e pela área administrativa.
window.Life = (function () {
  const cfg = window.LIFE_CONFIG;
  const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  const esc = (t) =>
    String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const configurado = () => /^https?:\/\//.test(cfg.supabaseUrl) && !/COLE_AQUI/.test(cfg.supabaseAnonKey);

  // Leitura pública via REST (sem biblioteca, para o catálogo carregar rápido)
  async function rest(caminho) {
    const r = await fetch(`${cfg.supabaseUrl}/rest/v1/${caminho}`, {
      headers: { apikey: cfg.supabaseAnonKey, Authorization: `Bearer ${cfg.supabaseAnonKey}` },
    });
    if (!r.ok) throw new Error(`Erro ${r.status} ao carregar ${caminho}`);
    return r.json();
  }

  // Variação "vazia" (sem nome) = produto sem variações
  const variacoes = (p) => (Array.isArray(p.variacoes) && p.variacoes.length ? p.variacoes : [{ nome: "", quantidade: null }]);
  const temVariacoes = (p) => variacoes(p).some((v) => (v.nome || "").trim());
  // quantidade null = não informada → segue a disponibilidade do produto (não esgota)
  const varDisponivel = (v) => v.quantidade == null || Number(v.quantidade) > 0;
  const disponivel = (p) => variacoes(p).some(varDisponivel);
  const precoDe = (p, v) => (v && v.preco != null && v.preco !== "" ? Number(v.preco) : p.preco == null ? null : Number(p.preco));

  // Versão leve da foto para cards e miniaturas
  function miniatura(f) {
    if (!f) return "";
    if (f.mini) return f.mini;
    if (/^https:\/\/cdn\.shopify\.com\//.test(f.url)) return f.url + (f.url.includes("?") ? "&" : "?") + "width=600";
    return f.url;
  }

  function linkWhats(numero, p, v) {
    const variacao = v && (v.nome || "").trim() ? ` — ${v.nome.trim()}` : "";
    const msg = `Olá! Vi no catálogo e tenho interesse na *${p.nome}${variacao}*. Pode me passar mais informações?`;
    return `https://wa.me/${String(numero || "").replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
  }

  return { cfg, moeda, esc, configurado, rest, variacoes, temVariacoes, varDisponivel, disponivel, precoDe, miniatura, linkWhats };
})();
