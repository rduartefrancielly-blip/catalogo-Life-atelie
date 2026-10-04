/* =====================================================================
   PRODUTOS DO CATÁLOGO — LIFE ATELIÊ
   ---------------------------------------------------------------------
   É SÓ ESTE ARQUIVO QUE VOCÊ PRECISA EDITAR NO DIA A DIA.

   ▸ VENDEU?            troque  disponivel: true   por  disponivel: false
   ▸ VOLTOU AO ESTOQUE? troque  disponivel: false  por  disponivel: true
   ▸ PRODUTO NOVO?      copie um bloco { ... }, cole no fim da lista e
                        troque os dados (o "id" não pode se repetir).
   ▸ FOTOS:             coloque o arquivo na pasta  img/  e escreva o nome
                        aqui, ex: fotos: ["img/luiza-sela-1.jpg"]
                        (também aceita link completo https://...)
   ▸ PREÇO:             use ponto no lugar da vírgula: 439.90
                        preco: null  →  aparece "Consulte o valor"
   ===================================================================== */

const CONFIG = {
  // WhatsApp que recebe os pedidos: 55 + DDD + número, só números
  whatsapp: "5531999999999",
  // true = peça vendida aparece com selo "Vendida"; false = some do catálogo
  mostrarVendidas: true,
  // Parcelamento sem juros exibido nos cards (0 = não mostrar)
  parcelasSemJuros: 0,
  // Instagram (sem @) — aparece no rodapé
  instagram: "lifeatelie",
};

const PRODUTOS = [
  {
    id: "luiza-sela-nude",
    nome: "Bolsa Luiza",
    cor: "Sela & Nude",
    preco: 439.90,
    precoAntigo: null,
    disponivel: true,
    destaque: true,
    descricao: "Design minimalista em couro legítimo, com detalhes exclusivos e acabamento artesanal.",
    detalhes: ["Couro legítimo", "Feita à mão em Minas Gerais"],
    medidas: "",
    fotos: [],
  },
  {
    id: "luiza-nude-cafe",
    nome: "Bolsa Luiza",
    cor: "Nude & Café",
    preco: 439.90,
    precoAntigo: null,
    disponivel: true,
    destaque: false,
    descricao: "Design minimalista em couro legítimo, com detalhes exclusivos e acabamento artesanal.",
    detalhes: ["Couro legítimo", "Feita à mão em Minas Gerais"],
    medidas: "",
    fotos: [],
  },
  {
    id: "luiza-azul",
    nome: "Bolsa Luiza",
    cor: "Azul Marinho & Azul Cielo",
    preco: 439.90,
    precoAntigo: null,
    disponivel: true,
    destaque: false,
    descricao: "Design minimalista em couro legítimo, com detalhes exclusivos e acabamento artesanal.",
    detalhes: ["Couro legítimo", "Feita à mão em Minas Gerais"],
    medidas: "",
    fotos: [],
  },
  {
    id: "sara-g-sela",
    nome: "Bolsa Sara G",
    cor: "Sela",
    preco: 439.90,
    precoAntigo: null,
    disponivel: true,
    destaque: true,
    descricao: "A versão grande da Sara: espaçosa para o dia a dia, em couro legítimo.",
    detalhes: ["Couro legítimo", "Feita à mão em Minas Gerais"],
    medidas: "",
    fotos: [],
  },
  {
    id: "sara-p-cafe",
    nome: "Bolsa Sara P",
    cor: "Café",
    preco: 389.90,
    precoAntigo: null,
    disponivel: true,
    destaque: false,
    descricao: "A versão compacta da Sara, prática e elegante, em couro legítimo.",
    detalhes: ["Couro legítimo", "Feita à mão em Minas Gerais"],
    medidas: "",
    fotos: [],
  },
  {
    id: "hera-preta",
    nome: "Bolsa Hera",
    cor: "Preta",
    preco: 479.90,
    precoAntigo: null,
    disponivel: true,
    destaque: true,
    descricao: "Couro legítimo com acabamento sofisticado e presença marcante.",
    detalhes: ["Couro legítimo", "Feita à mão em Minas Gerais"],
    medidas: "",
    fotos: [],
  },
  {
    id: "bianca",
    nome: "Bolsa Bianca",
    cor: "",
    preco: 349.90,
    precoAntigo: null,
    disponivel: true,
    destaque: false,
    descricao: "Couro legítimo, design atemporal para acompanhar sua rotina.",
    detalhes: ["Couro legítimo", "Feita à mão em Minas Gerais"],
    medidas: "",
    fotos: [],
  },
  {
    id: "lorena-preta",
    nome: "Bolsa Lorena",
    cor: "Preta",
    preco: 299.90,
    precoAntigo: null,
    disponivel: true,
    destaque: false,
    descricao: "Couro legítimo, versátil e fácil de combinar.",
    detalhes: ["Couro legítimo", "Feita à mão em Minas Gerais"],
    medidas: "",
    fotos: [],
  },
  {
    id: "lorena-verde-militar",
    nome: "Bolsa Lorena",
    cor: "Verde Militar",
    preco: 299.90,
    precoAntigo: null,
    disponivel: true,
    destaque: false,
    descricao: "Couro legítimo, versátil e fácil de combinar.",
    detalhes: ["Couro legítimo", "Feita à mão em Minas Gerais"],
    medidas: "",
    fotos: [],
  },
  {
    id: "luna-vermelho-cereja",
    nome: "Bolsa Luna",
    cor: "Vermelho Cereja",
    preco: 219.90,
    precoAntigo: null,
    disponivel: true,
    destaque: false,
    descricao: "Compacta e cheia de personalidade, em couro legítimo.",
    detalhes: ["Couro legítimo", "Feita à mão em Minas Gerais"],
    medidas: "",
    fotos: [],
  },
];
