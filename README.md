# Catálogo Life Ateliê

Catálogo digital para enviar às clientes pelo WhatsApp: abre por um link, sem cadastro nem aplicativo. Cada produto tem um botão **"Tenho interesse"** que abre o WhatsApp da loja com o nome do produto (e a cor/variação escolhida) já escrito.

- **Catálogo (para as clientes):** `https://rduartefrancielly-blip.github.io/catalogo-Life-atelie/`
- **Área administrativa (só você):** `https://rduartefrancielly-blip.github.io/catalogo-Life-atelie/admin.html`

Os links só funcionam depois da configuração inicial (abaixo).

---

## Dia a dia (pelo celular)

Entre em **admin.html** com seu e-mail e senha. Tudo que você salvar aparece na hora no mesmo link do catálogo. Não precisa reenviar o link às clientes.

| Quero… | Como |
|---|---|
| Atualizar o estoque | Na lista, use **−** e **+** ao lado do produto (salva sozinho) |
| Registrar uma venda | Toque em **−**. Chegou a 0 → aparece "Esgotado" |
| Esgotar de vez | Abra o produto → **Marcar como vendido / esgotado** |
| Esconder do catálogo | **Ocultar** na lista. Para voltar: **Reativar** |
| Mudar preço, texto ou medidas | Toque no nome do produto → edite → **Salvar** |
| Trocar ou incluir fotos | No produto → **+ Adicionar fotos** (as setas mudam a ordem; a 1ª é a capa) |
| Cadastrar cores do mesmo modelo | No produto → **+ Adicionar cor / variação** (cada uma com sua quantidade) |
| Produto novo | **+ Novo** |
| Apagar um produto | No produto → **Excluir** (não tem volta; prefira Ocultar) |
| Mudar WhatsApp / Instagram | Aba **Loja** |
| Esconder as esgotadas | Aba **Loja** → desmarque "Mostrar peças esgotadas" |

Quantidade **em branco** significa "não controlo estoque desta peça". Ela aparece como disponível.
O filtro **Com pendências** mostra os produtos com dados faltando.

---

## Configuração inicial (uma vez só, ~15 min)

1. **Banco de dados:** crie uma conta grátis em [supabase.com](https://supabase.com) → *New project* (região São Paulo).
2. No projeto: **SQL Editor → New query**, cole o conteúdo de [`supabase/esquema.sql`](supabase/esquema.sql) e toque em **Run**. Depois faça o mesmo com [`supabase/produtos-iniciais.sql`](supabase/produtos-iniciais.sql) (carrega os 30 produtos do site).
3. **Sua conta de admin:** *Authentication → Users → Add user* (e-mail + senha, marque *Auto Confirm*). Depois, no SQL Editor:
   ```sql
   insert into admins (email) values ('seu-email@exemplo.com');
   ```
4. **Segurança:** *Authentication → Sign In / Providers* → desligue **Allow new users to sign up**.
5. **Ligar o catálogo ao banco:** em *Project Settings → API*, copie a **Project URL** e a **anon public key** para [`js/config.js`](js/config.js) (ou envie para a Claude fazer isso).
6. **Publicar o link:** no GitHub, *Settings → Pages → Build and deployment → Deploy from a branch*, escolha a branch principal e a pasta `/ (root)` → **Save**.

## Custos

| Serviço | Para quê | Custo |
|---|---|---|
| GitHub Pages | Hospeda o link do catálogo | Grátis (repositório público) |
| Supabase (plano Free) | Produtos, fotos e login | Grátis dentro dos limites do plano gratuito |

- O plano grátis do Supabase **pausa o projeto após 7 dias sem acesso**. A rotina [`.github/workflows/manter-ativo.yml`](.github/workflows/manter-ativo.yml) consulta o banco uma vez por dia para evitar isso.
- Se o volume de acessos ou de fotos passar dos limites gratuitos, o plano pago do Supabase custa a partir de **US$ 25/mês**. Para um catálogo deste tamanho, isso não deve acontecer.
- As fotos importadas continuam vindo do site (Shopify). Isso é rápido e não gasta a cota do Supabase. Se um dia o site sair do ar, use **Loja → Copiar fotos para o banco** antes disso.

---

## Pendências da importação (dados que o site não tem)

Importado de `lifeatelie.com.br/products.json` em 04/10/2026. Nada foi inventado. Abaixo está o que falta ou merece conferência:

- **Quantidade em estoque:** o site não informa. As 26 peças disponíveis entraram como "não informada" e as 4 indisponíveis no site entraram com 0 (Luiza Vermelho Cereja, Carmem Azul Marinho, Carmem Café & Preto, Bia Vermelho Carmim).
- **Pode haver mais produtos:** a lista do site mostra até 30 itens por página e vieram exatamente 30. Confira em `https://www.lifeatelie.com.br/products.json?page=2`.
- **Tags personalizáveis:** sem medidas no site. O "preço de" cadastrado no site (R$ 60,00) é **menor** que o preço (R$ 69,00), por isso não foi usado.
- **Tag Café e Tag Jabuticaba** usam a **mesma foto** no site.
- **Bolsa Bia:** as medidas do site não incluem profundidade.
- **Helena G e Helena M Verde Musgo** compartilham as duas primeiras fotos.
- **Textos copiados como estão no site:** "Puxador em maio" e "conforto e conforto" (Luiza), "A bolsa Carmem Estruturada, …" (Carmem). Única correção feita: "vermelhacom" → "vermelha com" (Alice).
- **Identidade visual:** o site não pôde ser acessado para copiar cores, fontes e logo. As cores e fontes atuais são provisórias e ficam todas em [`css/tema.css`](css/tema.css).

## Estrutura

```
index.html, admin.html   páginas do catálogo e da área administrativa
css/tema.css             cores e fontes da marca (troque aqui)
js/config.js             conexão com o banco
supabase/*.sql           banco de dados e carga inicial
ferramentas/             dados extraídos do site e gerador do SQL inicial
vendor/supabase.js       biblioteca oficial do Supabase (v2.117.2)
```
