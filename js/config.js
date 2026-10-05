// Conexão com o banco de dados (Supabase → Project Settings → API Keys).
// Aceita a "publishable key" (sb_publishable_…) ou a antiga "anon key".
// Essa chave é pública por natureza: ela só permite o que as regras do
// banco liberam (clientes leem; só admins alteram).
window.LIFE_CONFIG = {
  supabaseUrl: "COLE_AQUI_A_PROJECT_URL",
  supabaseAnonKey: "COLE_AQUI_A_ANON_KEY",
};
