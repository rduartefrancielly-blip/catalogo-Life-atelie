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

No catálogo, os produtos aparecem **separados por modelo, em ordem alfabética**. Para tirar as esgotadas da vitrine: aba **Loja** → desmarque "Mostrar peças esgotadas".

---

## Configuração inicial (uma vez só, ~15 min)

1. **Banco de dados:** crie uma conta grátis em [supabase.com](https://supabase.com) → *New project* (região São Paulo).
2. No projeto: **SQL Editor → New query**, cole o conteúdo de [`supabase/esquema.sql`](supabase/esquema.sql) e toque em **Run**. Depois faça o mesmo com [`supabase/produtos-iniciais.sql`](supabase/produtos-iniciais.sql) (carrega os 130 produtos do site).
3. **Sua conta de admin:** *Authentication → Users → Add user* (e-mail + senha, marque *Auto Confirm*). Depois, no SQL Editor:
   ```sql
   insert into admins (email) values ('seu-email@exemplo.com');
   ```
4. **Segurança:** *Authentication → Sign In / Providers* → desligue **Allow new users to sign up**.
5. **Ligar o catálogo ao banco:** em *Project Settings → API Keys*, copie a **Publishable key** (`sb_publishable_…`, ou a antiga *anon public*), e em *Project Settings → Data API* copie a **Project URL**. Cole as duas em [`js/config.js`](js/config.js) (ou envie para a Claude fazer isso). **Nunca** use a *secret key* / *service_role*.
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

Importado das 5 páginas de `lifeatelie.com.br/products.json` em 04–05/10/2026: **130 produtos e 594 fotos**. Nada foi inventado. Os textos das páginas 2 a 5 foram extraídos automaticamente e conferidos de duas formas: revisão independente texto a texto e checagem palavra por palavra. Nas duas, nada foi perdido nem acrescentado. Preço, código, fotos e disponibilidade batem 100% com o site.

O que falta ou merece conferência:

- **Quantidade em estoque:** o site não informa. As 86 peças disponíveis entraram como "não informada"; as 44 indisponíveis no site entraram com 0 ("Esgotado"). Toda a Isis P, 7 de 8 Clara e 7 de 8 Luiza estão esgotadas no site.
- **Tags personalizáveis:** sem medidas no site. Tag **Azul Marinho** e Tag **Preta** estão com preço **R$ 0,00** no site, por isso entraram "sem preço" ("Consulte o valor"). Em várias tags o "preço de" (R$ 60,00) é **menor** que o preço (R$ 69,00), por isso não foi usado.
- **Fotos repetidas no site:** Tag Café = Tag Jabuticaba; Helena G e Helena M Verde Musgo compartilham as 2 primeiras fotos.
- **Bolsa Bia:** as medidas do site não incluem profundidade.
- **Textos copiados como estão no site**, inclusive erros de digitação. Exemplos: "Puxador em maio" e "conforto e conforto" (Luiza). Única correção feita: "vermelhacom" → "vermelha com" (Alice, página 1).
- **Identidade visual:** o site não pôde ser acessado para copiar cores, fontes e logo. As atuais são provisórias e ficam todas em [`css/tema.css`](css/tema.css).

## Estrutura

```
index.html, admin.html   páginas do catálogo e da área administrativa
css/tema.css             cores e fontes da marca (troque aqui)
js/config.js             conexão com o banco
supabase/*.sql           banco de dados e carga inicial
ferramentas/site/        páginas products.json originais da loja (2 a 5)
ferramentas/             extrator, dados da página 1 e gerador dos arquivos SQL
vendor/supabase.js       biblioteca oficial do Supabase (v2.117.2)
```
