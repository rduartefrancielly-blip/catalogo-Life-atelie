// Conexão com o banco de dados (Supabase → Project Settings → API).
// A "anon key" é pública por natureza: ela só permite o que as regras do
// banco liberam (clientes leem; só admins alteram).
window.LIFE_CONFIG = {
  supabaseUrl: "COLE_AQUI_A_PROJECT_URL",
  supabaseAnonKey: "COLE_AQUI_A_ANON_KEY",
};
