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
| Atualizar o estoque pela lista (PDF) | Aba **Estoque** → **Escolher PDF da lista** (ou cole o texto) → confira a prévia → **Aplicar alterações** |
| Alinhar os preços com o site (inclusive promoções, como a Black Friday) | Aba **Loja** → **Comparar com o site** → confira a lista → **Aplicar**. Quando a promoção acabar no site, faça de novo |
| Trazer as fotos novas do site | Aba **Loja** → **Conferir fotos com o site** → confira o que mudou → **Atualizar** |
| Mudar WhatsApp / Instagram | Aba **Loja** |
| Esconder as esgotadas | Aba **Loja** → desmarque "Mostrar peças esgotadas" |

Quantidade **em branco** significa "não controlo estoque desta peça". Ela aparece como disponível.
O filtro **Com pendências** mostra os produtos com dados faltando.

No catálogo, os produtos aparecem **separados por modelo, em ordem alfabética**. Para tirar as esgotadas da vitrine: aba **Loja** → desmarque "Mostrar peças esgotadas".

### Vendas direto para o Bling

Na tela de vendas, aba **Bling e backup**, a administradora envia as vendas do período direto para o Bling. Cada venda vira um **pedido de venda** lá:
- **Cliente:** procurada pelo CPF/CNPJ ou pelo nome; se não existir, é cadastrada com o endereço.
- **Produtos:** ligados pelo código (SKU do Bling ou código do site).
- **Forma de pagamento:** Pix; cartão parcelado mês a mês; "aguardando" vai na forma padrão.
- **Vendedora:** escolhida uma vez na aba, pelo **código do vendedor no Bling** (sugere a Francielly Duarte). Depois de criar cada pedido, o sistema confere no Bling se a vendedora ficou gravada e avisa se não ficou. Enquanto não escolher, o envio fica travado.

Detalhes:
- A venda guarda o número do pedido do Bling e nunca vira dois pedidos, nem se for enviada de novo (referência `LIFE-nº da venda`).
- Se uma venda não for, o motivo aparece na aba. É só corrigir e enviar de novo.
- A planilha antiga continua disponível em "Baixar planilha para importar no Bling".

**Para ligar (uma vez só):** o passo a passo está na própria aba, com botões para copiar o SQL, o código e o link. Em resumo:
1. Rode [`supabase/bling.sql`](supabase/bling.sql). Rode de novo sempre que o arquivo mudar.
2. Crie o aplicativo no Bling com o link de redirecionamento `https://<projeto>.supabase.co/functions/v1/bling/retorno` e as permissões Contatos (e Gerenciar Contatos), Pedidos de Venda (e Gerenciar Pedidos de Venda), Produtos, Formas de Pagamento e Vendedores. Depois de mudar as permissões, toque em **Conectar de novo**.
3. Publique a função [`supabase/functions/bling/index.ts`](supabase/functions/bling/index.ts) no Supabase, com o nome `bling` e o **Verify JWT desligado**.
4. Guarde os segredos `BLING_CLIENT_ID` e `BLING_CLIENT_SECRET` em Edge Functions → Secrets.
5. Toque em **Conectar ao Bling**.

O Client Secret fica só no Supabase, nunca no site. Se a função publicada for mais antiga que a tela, a aba avisa "desatualizada" e pede para colar o código novo.

### Importar clientes do Bling

Aba **Cadastro → Importar clientes do Bling** (só a administradora). O sistema lê as clientes do Bling, com endereço, e mostra uma prévia antes de gravar:
- **Novas:** cadastradas com nome, CPF/CNPJ, telefone, e-mail e endereço. As que vierem com dados faltando são sinalizadas.
- **Já cadastradas** (mesmo CPF/CNPJ, mesmo código do Bling, ou mesmo nome **e** telefone): ganham só os campos vazios. Nada que já está aqui é trocado; as diferenças aparecem na prévia.
- **Para conferir:** mesmo nome sem como confirmar, nome igual com outro CPF, CPF repetido no Bling. Não entram sozinhas: marque "É a mesma pessoa" para completar o cadastro daqui.
- **Ignoradas:** fornecedores, transportadoras, vendedores e excluídas.

Pode importar de novo quando quiser: o que já entrou não duplica.

### Cadastro de cliente: validação e duplicidade

Na janela da cliente (nos Orçamentos e no Cadastro):
- **Validação:** o CPF/CNPJ é conferido pelos dígitos. E-mail, CEP, UF e telefone também são validados. Depois de colar a mensagem, aparece o que não foi encontrado.
- **Mesmo CPF/CNPJ ou mesmo nome de outra cliente:** não salva duplicado e oferece **Usar o cadastro de…**, que leva os dados colados para o cadastro dela.
- **Mesmo telefone ou e-mail:** só avisa. O segundo "Salvar" confirma que é outra pessoa.
- **Ligação com o orçamento:** a cliente salva fica ligada ao orçamento pelo cadastro (`cliente_id`), não só pelo nome.

### Compartilhar um modelo ou uma peça

No catálogo, cada modelo (ex.: **Alice**) tem o botão **Compartilhar**, ao lado do nome. Ele vale também na aba do modelo. Cada peça tem **Compartilhar esta peça** na página dela.

- **Link do modelo** (`…/?modelo=Alice`): mostra só esse modelo, com as cores **disponíveis** (as esgotadas não aparecem), sem busca nem abas.
- **Link da peça** (`…/?produto=…`): abre direto a peça, com fotos, valor e detalhes.
- A janela já traz a mensagem pronta, com nome, cores, valor (com o "de/por" da promoção) e o link. Ela tem **Enviar pelo WhatsApp**, **Copiar mensagem com o link** e **Copiar só o link**.
- Quem recebe sempre tem o botão **Ver o catálogo completo**.
- A prévia do link no WhatsApp mostra o cartão da marca ([`img/og-catalogo.jpg`](img/og-catalogo.jpg)). O nome do modelo vai no texto da mensagem.

### Estoque pela lista (PDF)

Na aba **Estoque**, escolha o PDF da lista de estoque ou cole o texto dela. O catálogo reconhece cada peça pelo **código** (ex.: `BLSP08`) ou pelo **modelo + cor** (aceita "preta/preto", abreviações como "vm cereja", "v. militar", "az marinho", "off", e listas separadas por título de modelo, como "CARMEM" e embaixo "Sela 2").

- Antes de gravar, ele mostra **o que vai mudar** (quantidade antiga → nova), e dá para desmarcar qualquer item.
- Linhas que ele não tem certeza (ex.: "Sara preta", que pode ser a P ou a G) aparecem em **"Linhas que não entendi"**. Ele nunca chuta.
- Opcional: marcar como esgotadas (0) as peças do catálogo que **não aparecem** na lista.
- Peças da lista que **não existem no catálogo** aparecem em um quadro próprio: marque e elas são cadastradas **ocultas**, com nome, código e quantidade da lista. Se a bolsa existe em outra cor, a descrição e as medidas vêm dela. Complete foto e preço em **Produtos** e toque em **Reativar**.
- Código e nome discordando (ex.: o código é de uma cor no site e de outra na lista) vão para conferência e não são aplicados.
- PDF que é foto ou digitalização não tem texto. Nesse caso, copie o texto e cole no campo.

### Fotos e preços do site

Na aba **Loja**, as caixas **Preços do site** e **Fotos do site** comparam o catálogo com lifeatelie.com.br e mostram o que vai mudar antes de gravar.

- Se o site não deixar ler direto, aparece o passo a passo: abrir o link, salvar com **Ctrl + S** e escolher o arquivo. O mesmo arquivo vale para as duas caixas.
- Cada produto é achado pelo link do site. As peças cadastradas pela lista (sem link) são achadas pelo **código** ou pelo **nome** e ganham o link.
- **Fotos:** só entram as fotos novas ou trocadas no site. As que já estão no seu banco são reaproveitadas. Produtos com fotos que você mesma colocou aparecem em **"Confira antes"**, desmarcados.
- **Preços:** o preço de promoção entra como preço, e o valor antigo do site aparece riscado no catálogo. Vale também para a tela de vendas e os orçamentos.
- Uma vez só: rode [`supabase/fotos-permissoes.sql`](supabase/fotos-permissoes.sql) no Supabase para o sistema conseguir apagar as fotos que não são mais usadas (sem isso, elas ficam guardadas ocupando espaço).

### Atalho na tela de início

O admin pode ficar na tela do celular como um app (ícone escuro **"LA ADMIN"**, nome **Life Admin**):

- **Android (Chrome):** abra o `admin.html` → menu **⋮** → **Instalar app** (ou **Adicionar à tela inicial**).
- **iPhone (Safari):** abra o `admin.html` → botão **Compartilhar** (quadrado com seta) → **Adicionar à Tela de Início**.

Na primeira vez em que abrir pelo atalho, entre com e-mail e senha. Nas próximas, você já entra direto.

### Orçamentos (tela de vendas)

Na página de vendas (`vendas.html`), a aba **Orçamentos** monta um orçamento e envia para a cliente pelo WhatsApp.

**Antes de usar (e de novo sempre que este arquivo mudar):** Supabase → **SQL Editor** → **New query** → cole o arquivo [`supabase/orcamentos.sql`](supabase/orcamentos.sql) → **Run**. Ele só acrescenta coisas: não mexe em produtos, clientes, vendas nem tags. Pode rodar de novo sem perder dados (rode outra vez sempre que o arquivo mudar).

| Quero… | Como |
|---|---|
| Montar um orçamento | Nome da cliente + WhatsApp com DDD → busque os produtos do catálogo (já vêm com foto e preço) ou **+ Adicionar produto** para escrever à mão → frete → observações |
| Dar desconto ou cobrar a mais | **Ajustar o valor** → Desconto em %, Desconto em R$ ou Acréscimo em R$. O nome (ex.: "Desconto no Pix") aparece para a cliente. Vale sobre os produtos, não sobre o frete |
| Mudar o preço de um produto só neste orçamento | Edite o **Valor unitário** da linha (o catálogo não muda) |
| Guardar para terminar depois | **Salvar rascunho** |
| Colar na conversa da cliente | **Copiar orçamento** (no formulário) ou **Copiar** (na lista) → cole na conversa |
| Mandar pelo WhatsApp | **Visualizar e enviar** → **Enviar pelo WhatsApp** (abre a conversa da cliente com a mensagem pronta) |
| Mandar a imagem com a marca | Celular: **Enviar imagem** → escolha a conversa. Computador: **Copiar imagem** → Ctrl+V no WhatsApp Web. Ou **Baixar imagem** / **Baixar PDF** |
| Acompanhar | A lista mostra data e situação (Rascunho, Enviado, Aprovado, Recusado). Ao copiar ou enviar, o rascunho passa para **Enviado** sozinho |
| Editar, duplicar, excluir | Botões ✎, **Duplicar** e ✕ em cada orçamento da lista |
| Cadastrar a cliente com o que ela mandou | No orçamento: **Colar dados da cliente** (ou, na prévia, **Dados da cliente**) → cole a mensagem dela → os campos (nome, CPF, endereço, CEP, telefone, e-mail) se preenchem sozinhos, e o CEP completa rua, bairro e cidade → confira → **Salvar**. Também funciona em **Cadastro → + Nova cliente** |
| Lançar a venda do orçamento aprovado e pago | Situação **Aprovado** → **Lançar venda** (na lista ou na prévia) → a aba Vendas abre preenchida (cliente, produtos, valor com desconto, observação com o nº do orçamento e o frete) → escolha o pagamento → **Registrar venda**. O estoque baixa e a comissão é calculada como numa venda normal, e o orçamento fica com o selo **Venda nº …**. Se você escreveu os dados da cliente (CPF, endereço, CEP, e-mail) nas **Observações** do orçamento, eles vão sozinhos para o cadastro dela e saem da observação da venda |

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
supabase/*.sql           banco de dados e carga inicial (orcamentos.sql: Orçamentos; bling.sql: Bling)
supabase/functions/bling/ função do Supabase que conecta e envia as vendas ao Bling
ferramentas/site/        páginas products.json originais da loja (2 a 5)
ferramentas/             extrator, dados da página 1, gerador dos arquivos SQL e de js/fotos-importacao.json
vendor/supabase.js       biblioteca oficial do Supabase (v2.117.2)
vendor/jspdf/            gerador de PDF dos orçamentos (jsPDF 2.5.2, licença MIT)
js/orcamento-*.js, js/vendas-orcamentos.js   aba Orçamentos (contas, imagem/PDF e tela)
```
