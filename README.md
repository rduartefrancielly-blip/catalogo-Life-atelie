# Catálogo Life Ateliê

Catálogo de bolsas para enviar às clientes pelo WhatsApp. Funciona no celular, mostra fotos, valores e detalhes, e cada bolsa tem um botão **"Quero esta bolsa"** que abre o WhatsApp com a mensagem já escrita.

## Como atualizar o estoque (o dia a dia)

Tudo fica em **um arquivo só**: `js/produtos.js`.

| Situação | O que fazer |
|---|---|
| Vendeu | Troque `disponivel: true` por `disponivel: false` |
| Voltou ao estoque | Troque `disponivel: false` por `disponivel: true` |
| Produto novo | Copie um bloco `{ ... }`, cole no fim da lista e mude os dados. O `id` não pode se repetir |
| Foto nova | Coloque a imagem na pasta `img/` e escreva `fotos: ["img/nome-da-foto.jpg"]` |
| Mudar o preço | `preco: 439.90` (com ponto). Para promoção, use `precoAntigo: 499.90` |

Pelo celular: abra o repositório no app ou no site do GitHub, entre em `js/produtos.js`, toque no lápis (✏️), edite e toque em **Commit changes**. O catálogo se atualiza sozinho em cerca de 1 minuto.

### Configurações (topo do `js/produtos.js`)

- `whatsapp`: número que recebe os pedidos (55 + DDD + número)
- `mostrarVendidas`: `true` mostra a peça com o selo "Vendida" (gera desejo e encomenda); `false` esconde
- `parcelasSemJuros`: quantidade de parcelas exibida (0 = não mostra)
- `instagram`: usuário sem @

## Recursos

- Filtros por modelo e por "Disponíveis"
- Galeria de fotos com deslize (várias fotos por bolsa)
- Link direto para uma bolsa: `.../#hera-preta` abre já no produto
- Selo "Queridinha" para os destaques (`destaque: true`)
- Acessível: textos alternativos nas fotos, navegação por teclado e botões grandes para o toque

## Publicar (link para enviar às clientes)

No GitHub: **Settings → Pages → Branch: main / root → Save**. O link fica `https://<usuario>.github.io/catalogo-Life-atelie/`.

Para a prévia do link no WhatsApp mostrar uma foto, coloque `img/capa.jpg`.
