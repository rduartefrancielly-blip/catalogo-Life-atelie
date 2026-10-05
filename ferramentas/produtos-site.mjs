// Produtos extraídos de https://www.lifeatelie.com.br/products.json (04/10/2026).
// Textos copiados do site; só foram removidas tags HTML e espaços duplicados.
// disponivel: valor "available" do site. A quantidade em estoque NÃO consta no
// site, por isso entra como null ("não informada") até ser ajustada no admin.

const CDN = "https://cdn.shopify.com/s/files/1/0681/1628/3443/files/";
export const SITE = "https://www.lifeatelie.com.br/products/";

const TXT = {
  saraP: {
    descricao: `A Bolsa Sara P traz o charme do matelassê em uma versão compacta e estruturada. Pequena por fora e prática por dentro, é uma bolsa elegante para quem gosta de levar o essencial bem organizado.

Como usar
Use pela alça de mão para um visual mais clássico ou com a alça tiracolo ajustável para ter mais liberdade no dia a dia.

Espaço interno
Possui duas divisões com zíper de metal, além de bolso frontal com zíper para deixar os itens que você mais usa sempre à mão. O interior recebe forro vermelho, um detalhe marcante da peça.

Ocasiões
Perfeita para o dia a dia, passeios, almoços, viagens e compromissos em que você quer uma bolsa menor, prática e elegante.

Exclusividade Life Ateliê.`,
    materiais: "Confeccionada em couro legítimo, com matelassê na parte frontal e traseira, ferragens com banho dourado e acabamento cuidadosamente trabalhado.",
    medidas: "Altura: 14 cm\nLargura: 21 cm\nProfundidade: 10 cm\nPeso: 450 g",
  },
  alice: {
    descricao: `A bolsa Alice chama atenção pelos detalhes em alto-relevo no couro, que dão personalidade ao modelo sem perder a elegância. Compacta e moderna, tem o tamanho certo para acompanhar a rotina com leveza.

Como usar
Use no ombro ou na transversal com a alça ajustável e removível. Uma bolsa confortável para usar durante o dia e fácil de combinar com diferentes looks.

Espaço interno
Possui interior forrado na cor vermelha com bolso interno para pequenos itens e dois bolsos laterais. O fechamento principal combina zíper de metal com botão magnético, trazendo mais segurança e praticidade.

Ocasiões
Perfeita para o dia a dia, almoços, passeios, viagens e compromissos em que você quer levar o essencial sem carregar uma bolsa grande.

Exclusividade Life Ateliê.`,
    materiais: "Confeccionada em couro legítimo, com detalhes em alto-relevo que valorizam sua textura. As ferragens com banho dourado complementam o acabamento da peça.",
    medidas: "Altura: 17 cm\nLargura: 24 cm\nProfundidade: 11,5 cm\nAlça: 53 cm\nPeso: 600 g",
  },
  saraG: {
    descricao: `A bolsa Sara G combina o couro legítimo com o acabamento matelassê em um design elegante e marcante. Uma bolsa estruturada, prática e fácil de levar para diferentes momentos.

Como usar
Use no ombro ou na transversal. A alça é ajustável e removível, permitindo adaptar a bolsa ao seu estilo e à ocasião.

Espaço interno
Possui duas divisões internas, bolso interno com zíper e bolso frontal, facilitando a organização dos seus itens no dia a dia.

Ocasiões
Perfeita para trabalho, compromissos, almoços, passeios e viagens. Uma peça que acompanha tanto produções casuais quanto looks mais sofisticados.

Exclusividade Life Ateliê.`,
    materiais: "Confeccionada em couro legítimo, com acabamento matelassê e detalhes cuidadosamente trabalhados. As variações naturais do couro fazem parte da identidade de cada peça.",
    medidas: "Altura: 18 cm\nLargura: 28 cm\nProfundidade: 13 cm\nPeso: 500 g",
  },
  luiza: {
    descricao: `Essencial, elegante e atemporal.

A Bolsa Luiza traduz o minimalismo contemporâneo em uma peça marcante e sofisticada. Seu design moderno com detalhes em alto relevo e acabamento lateral exclusivo valoriza o couro legítimo e confere personalidade à bolsa, tornando-a única e atemporal.

Estruturada e marcada na medida certa, é ideal para acompanhar a rotina com organização e elegância.

Possui duas alças fixas de mão, que proporcionam um visual elegante e estruturado, além de alça tiracolo regulável para maior conforto e conforto no uso diário.

Seu interior forrado oferece praticidade com bolso interno funcional para pequenos objetos. O fechamento principal em zíper de metal com puxador em couro garante segurança e acabamento refinado.

Uma bolsa pensada para mulheres que valorizam presença, qualidade e design sofisticado.

Exclusividade Life Ateliê.`,
    materiais: "Couro legítimo de alta qualidade",
    caracteristicas: "Couro legítimo de alta qualidade\nDetalhes em alto relevo em couro\nAcabamento lateral\nForro interno\nBolso interno funcional\nFechamento em zíper de metal\nPuxador em maio\nFerragens com banho dourado",
    medidas: "Altura: 18 cm\nComprimento: 32 cm\nProfundidade: 16 cm\nPeso: 900 g",
  },
  carmem: {
    descricao: `A bolsa Carmem Estruturada, elegante e atemporal, combina sofisticação com uma organização que facilita a rotina. O design clássico e os detalhes em dourado fazem dela uma peça que você pode usar por muitos anos.

Como usar
Use pelas alças de mão para um visual mais sofisticado ou na transversal com a alça ajustável e removível, trazendo mais liberdade e conforto para o dia a dia.

Espaço interno
São três compartimentos principais: duas divisões com zíper de metal e uma divisão central com fechamento magnético. Conta ainda com um bolso interno para pequenos objetos.

Ocasiões
Perfeita para o trabalho, compromissos, almoços, eventos e ocasiões em que você quer estar elegante sem abrir mão da praticidade.`,
    materiais: "Confeccionada em couro legítimo, com estrutura reforçada, zíperes de metal com puxadores em couro e ferragens com banho dourado. As características naturais do couro tornam cada peça única.",
    medidas: "Altura: 22 cm\nLargura: 28 cm\nProfundidade: 18,5 cm\nPeso: 800 g",
  },
  bia: {
    descricao: `A Bolsa Bia pequena nos detalhes. Inesquecível na presença. É compacta, delicada e cheia de personalidade, com ferragens douradas e alça em corrente e couro que dão um toque especial ao modelo.

Como usar
Use na transversal para ficar com as mãos livres e aproveitar o dia com mais leveza. É aquela bolsa pequena que acompanha você sem pesar no look.

Espaço interno
Compacta na medida certa para acomodar o smartphone e os itens essenciais do dia a dia. Possui forro vermelho e fechamento em corda de couro com botão magnético.

Ocasiões
Perfeita para passeios, viagens, um café, almoço, jantar ou aqueles momentos em que você quer sair levando somente o essencial.

Exclusividade Life Ateliê.`,
    materiais: "Confeccionada em couro legítimo, com alça tiracolo em corrente e couro e ferragens com banho dourado. As variações naturais do couro tornam cada peça única.",
    medidas: "Altura: 21 cm\nLargura: 18 cm\nPeso: 500 g",
  },
  helenaG: {
    descricao: `Essencial, elegante e atemporal.

A Bolsa Helena é a união perfeita entre sofisticação, conforto e funcionalidade. Confeccionada em couro legítimo nobre, apresenta um design elegante com caimento leve e acabamento impecável, ideal para mulheres que valorizam estilo sem abrir mão da praticidade.

Seu grande destaque é a alça de ombro trançada, que adiciona charme e personalidade à peça, além de proporcionar conforto no uso diário. As ferragens com banho dourado elevam o visual com um toque refinado, enquanto o forro interno vermelho cria contraste e revela um detalhe surpreendente ao abrir a bolsa.

Pensada para a rotina, a Helena possui fechamento em zíper para maior segurança e bolso interno com zíper que facilita a organização dos itens essenciais.

Uma bolsa versátil, sofisticada e marcante — feita para acompanhar você em todos os momentos.

Exclusividade Life Ateliê.`,
    materiais: "Couro legítimo nobre",
    caracteristicas: "Couro legítimo nobre\nForro interno vermelho\nFechamento em zíper\nBolso interno com zíper\nAlça de ombro trançada\nFerragens com banho dourado",
    medidas: "Altura: 32 cm\nLargura: 45 cm\nProfundidade: 14 cm\nAlça de ombro: 50 cm\nPeso: 800 g",
  },
  helenaM: {
    descricao: `A Bolsa Helena M tem aquele caimento macio e elegante que acompanha o corpo. O couro legítimo e a alça trançada dão personalidade à peça, enquanto o tamanho médio traz praticidade para o dia a dia.

Como usar
Use no ombro e deixe a bolsa acompanhar o movimento do corpo. Combina facilmente com produções casuais, jeans, alfaiataria ou um look mais arrumado.

Espaço interno
Tamanho médio, ideal para levar seus itens essenciais com conforto. Possui fechamento em zíper e 1 bolso interno com zíper para manter pequenos objetos organizados.

Ocasiões
Perfeita para o dia a dia, trabalho, almoço, passeios e viagens. Uma bolsa para usar muito, sem perder a elegância.

Exclusividade Life Ateliê.`,
    materiais: "Confeccionada em couro legítimo, com textura e marcas naturais que tornam cada peça única. Com o uso, o couro ganha ainda mais personalidade.",
    medidas: "Altura: 25 cm\nLargura: 40 cm\nProfundidade: 9 cm\nAlça de ombro: 42 cm\nPeso: 700 g",
  },
  tag: {
    descricao: `Um detalhe único, pensado para marcar momentos.

Feita em couro legítimo, com toque macio e acabamento sofisticado, a tag personalizável traz identidade e exclusividade para a sua bolsa.

Personalize com até 2 letras e transforme em um presente especial, delicado, elegante e cheio de significado.

Ideal para presentear (ou se presentear) com algo único.`,
    materiais: "Couro legítimo",
    caracteristicas: "Couro legítimo\nPersonalização dourada de até 2 letras\nFerragem com acabamento dourado\nFixação prática na bolsa",
    medidas: "",
  },
};

// [nome, handle, categoria, texto, preço, disponível no site, código (SKU), fotos]
const LINHAS = [
  ["Bolsa Sara P - Fendi", "bolsa-sara-p-dourada", "Sara", "saraP", 389.90, true, "BLSP08", [
    "AF5E81A8-B72E-44FA-A867-CD873D4B1456.jpg?v=1791023952", "426D277E-3860-407D-B52F-59FC3C4173D0.jpg?v=1791023952", "2C17D605-439E-4871-85A4-DF040192ECC3.jpg?v=1791023952", "5FBC73C9-707F-4458-8424-0A8519DF915E.jpg?v=1791023952", "7EC633A8-79B8-45DA-82B2-DFCD1B0FEC2F.jpg?v=1791023952"]],
  ["Bolsa Alice - Fendi", "bolsa-alice-fendi", "Alice", "alice", 489.90, true, null, [
    "F45B7955-3486-42A8-B87E-4F33A9E4BBEB.jpg?v=1790726410", "A89D7F09-512F-4A4A-BB7B-00D9566E2675.jpg?v=1790726467", "8F496056-C4AA-473A-AABD-5F9D500947EC.jpg?v=1790726410", "BDB8461E-C027-4C47-8F94-9838D49D49CE.jpg?v=1790726410", "02DA3625-D6AD-4D53-BC6D-A8F096F9F537.jpg?v=1790726410", "D049733B-FFBB-4284-9CB8-FAA43B2680B8.jpg?v=1790726410", "25736006-CE48-41FF-8FCF-5C3B83125F06.jpg?v=1790726410", "BAB0C0FB-D39B-4DC3-964A-A25021538B10.jpg?v=1790725556"]],
  ["Bolsa Alice - Preto", "bolsa-alice-preto", "Alice", "alice", 489.90, true, "BLAL01", [
    "E240A9D5-1CEF-4ACD-982B-BE577A39863D.png?v=1790726117", "4C55D344-35FD-418D-8ABC-4AB0B6F27D19.png?v=1790726076", "23358C67-E685-4CC1-BE77-A9E89543195A.png?v=1790726076", "8AE053BA-409C-438E-AB4E-6C4BC85AD9C0.png?v=1790726076", "ADE18BDA-7276-4731-9F64-3115E5C2C0BF.png?v=1790726076", "0B7C4F86-3C01-4E05-B2BC-A072E765C686.png?v=1790726076", "6304AD62-693B-42D7-B95F-4A1E78C25FD9.png?v=1790726076", "BAB0C0FB-D39B-4DC3-964A-A25021538B10.jpg?v=1790725556"]],
  ["Bolsa Sara G - Vermelho Cereja", "bolsa-sara-g-vermelho-cereja", "Sara", "saraG", 439.90, true, "BLSG05", [
    "DC412960-5BBA-444B-A494-769193485945.jpg?v=1790645459", "A085401C-4E58-41F3-B582-54AC31C45F3A.png?v=1790645459", "9F8FA7D4-7B6F-4CC4-831F-5570A97FB03B.png?v=1790645459", "F4756110-F51C-4006-AE64-5E44B2BF9D33.png?v=1790645459", "IMG-6482.png?v=1780190101"]],
  ["Bolsa Luiza - Vermelho Cereja", "bolsa-luiza-vermelho-cereja", "Luiza", "luiza", 509.90, false, "BLLZ05", [
    "E4612D8B-5008-4638-BE3E-EA7176BB2F43.jpg?v=1779239965", "8BC49AFA-2A7C-4FE8-8A5C-5F673B234875.jpg?v=1779239965", "2118C86D-3A0B-4376-BF79-5EC82FC27546.jpg?v=1779239964", "C40EFCB7-D44D-4A0C-884A-B9CAE60E03AF.jpg?v=1779239965", "5776E66D-F29C-401B-A746-A226DA3C39F5.png?v=1779239965", "4CC07D7B-DF0C-47D6-8506-1F92AC2C3FC1.jpg?v=1779239965"]],
  ["Tag Personalizável - Jabuticaba", "tag-personalizavel-jabuticaba-presente", "Tags personalizáveis", "tag", 69.00, true, null, [
    "45D94EC5-CE8A-4B3B-9EB9-9CD4BA1B4631.png?v=1776780100"]],
  ["Bolsa Carmem - Azul Marinho", "bolsa-carmem-azul-marinho", "Carmem", "carmem", 489.90, false, "CARMEM-MARINHO", [
    "C5E133B7-49A6-4F51-8B38-23F101E2E314.jpg?v=1790701183", "628882AA-A058-4005-BE39-A30F84412900.jpg?v=1790701183", "F7E062F3-8441-4743-91E8-D933C61CE086.jpg?v=1790701183", "FC74C283-3FED-4215-A024-44DF44FD5937.jpg?v=1790701183", "1014ABC3-71E5-47D8-9B89-68DACAC27634.jpg?v=1790701056"]],
  ["Bolsa Porta Celular Bia - Preta", "bolsa-porta-celular-bia-fendi-copia", "Bia (porta-celular)", "bia", 299.00, true, "BIA-PRETA", [
    "C9191D64-6DF4-470E-B2B9-92B1C595D2DC.jpg?v=1790740462", "5E1B37D6-9779-4A03-92C2-796B986C263D.jpg?v=1790740459", "EE01F05E-ECA5-4BEB-975E-F0D351516732.jpg?v=1781529715", "F5B106CC-98D2-441D-8AB8-87ECAA04286A.png?v=1790740272"]],
  ["Bolsa Porta Celular Bia - Café", "bolsa-porta-celular-bia-cafe", "Bia (porta-celular)", "bia", 299.00, true, "BIA-CAFE", [
    "IMG-9940.jpg?v=1790740498", "IMG-9941.jpg?v=1790740498", "B8C306F9-CF7F-4E8B-9FF0-FE1484D61F0D.jpg?v=1781529743", "F5B106CC-98D2-441D-8AB8-87ECAA04286A.png?v=1790740272"]],
  ["Bolsa Porta Celular Bia - Fendi", "bolsa-bia-fendi", "Bia (porta-celular)", "bia", 299.00, true, "BIA-FENDI", [
    "950CE654-A902-4EA5-ACE8-B92E3FA01930.jpg?v=1790740271", "C4DF906D-EBD1-45D9-A6E9-67E58B0CB290.jpg?v=1790740272", "DDB4665E-F84A-4711-B13D-3496F35F0031.jpg?v=1781529662", "9D1E1BF9-9D7B-4924-B2A2-2F5A98E23D21.png?v=1790740308", "F5B106CC-98D2-441D-8AB8-87ECAA04286A.png?v=1790740272"]],
  ["Bolsa Porta Celular Bia - Sela", "bolsa-porta-celular-bia-sela", "Bia (porta-celular)", "bia", 329.90, true, "BIA-SELA", [
    "2369E5CD-84F7-42A9-AA3E-A8E73FCF95C5.png?v=1790739815", "E6F79289-C614-4B4F-A86F-9B0603665A50.png?v=1790739815", "2AC3B963-9978-4251-888F-CB4FA1555B7E.png?v=1790739853", "CA31B379-FF19-4D81-A9D8-5C9EF626034A.jpg?v=1781529985", "83543C68-9C37-4D12-A34D-50BA2A9FAF5E.png?v=1790739814"]],
  ["Bolsa Porta Celular Bia - Vermelho Carmim", "bolsa-porta-celular-bia-vermelho-carmim", "Bia (porta-celular)", "bia", 329.90, false, "BIA-VERMELHA", [
    "C04353EE-38B0-4FFD-99E5-CA262F849282.jpg?v=1790739984", "87873D33-13BC-42B1-B91B-66832BD7DE4F.jpg?v=1790739984", "8A1E9475-7205-47CB-AA39-A7E07A6B192F.jpg?v=1781529923", "26D27F86-D066-4ECF-B3A9-5944D743A4DE.png?v=1790739984", "A7696857-7970-490C-A921-7C8F0B5C2A2B.jpg?v=1790740213"]],
  ["Bolsa Porta Celular Bia - Verde Militar", "bolsa-porta-celular-bia-verde-militar", "Bia (porta-celular)", "bia", 329.90, true, "BIA-MILITAR", [
    "IMG-9950.jpg?v=1790740614", "EB8F1430-757C-4754-90CC-11911303244D.jpg?v=1781529893", "F5B106CC-98D2-441D-8AB8-87ECAA04286A.png?v=1790740272"]],
  ["Bolsa Porta Celular Bia - Azul Marinho", "bolsa-porta-celular-bia-azul-marinho", "Bia (porta-celular)", "bia", 329.90, true, "BIA-MARINHO", [
    "IMG-9949.jpg?v=1790740391", "IMG-9944.jpg?v=1790740391", "9DF023DD-5BB2-4621-94E7-66F098936D50.jpg?v=1781529802", "F5B106CC-98D2-441D-8AB8-87ECAA04286A.png?v=1790740272"]],
  ["Bolsa Helena G - Verde Musgo", "bolsa-helena-g-verde-musgo", "Helena", "helenaG", 529.90, true, "BLHG11", [
    "1138F0C9-7430-4C75-A430-E0BC7EE21D4C.jpg?v=1790118622", "BF875863-5C19-48FD-8ED4-A8AD533362A5.jpg?v=1790118620", "IMG-9615.jpg?v=1790540707", "IMG-6772.jpg?v=1780846743", "IMG-9387.jpg?v=1790120903", "1B2E3959-F1FE-454A-BC76-E50FE002ABB6.png?v=1777308660"]],
  ["Bolsa Helena M - Verde Musgo", "bolsa-helena-m-verde-musgo", "Helena", "helenaM", 479.90, true, "BLHM11", [
    "1138F0C9-7430-4C75-A430-E0BC7EE21D4C.jpg?v=1790118622", "BF875863-5C19-48FD-8ED4-A8AD533362A5.jpg?v=1790118620", "IMG-9373.jpg?v=1790120317", "IMG-9387.jpg?v=1790120903", "IMG-6772.jpg?v=1780846743", "IMG-9605.png?v=1790518090"]],
  ["Bolsa Carmem - Vermelho Carmim", "bolsa-carmem-vermelho-carmim", "Carmem", "carmem", 489.90, true, "CARMEM-VERMELHO", [
    "6F846072-6D99-4839-88C2-A00782A0B16F.png?v=1790700929", "9C5E3D9D-2D94-45AC-BD4E-3207FE386569.png?v=1790700929", "B447BD88-B4BD-43B6-B480-372CED15395C.png?v=1790700929", "3AA73295-F38E-475F-9F1B-32EB096898EE.jpg?v=1780789986", "1014ABC3-71E5-47D8-9B89-68DACAC27634.jpg?v=1790701056"]],
  ["Bolsa Carmem - Sela", "bolsa-carmem-sela", "Carmem", "carmem", 489.90, true, "CARMEM-SELA", [
    "B6955EC2-976B-448B-BCCA-CBC74BC74242.png?v=1790701251", "CAD95A77-516C-47E3-BBC7-945AB7ED0475.png?v=1790701251", "3F98E3C7-C02A-4164-89E3-36561B434E9F.png?v=1790701251", "379A14A9-9337-46D4-9602-1A677549E1FB.png?v=1790701251", "1014ABC3-71E5-47D8-9B89-68DACAC27634.jpg?v=1790701056"]],
  ["Bolsa Carmem - Café & Preto", "bolsa-carmem-cafe-preto", "Carmem", "carmem", 489.90, false, "CARMEM-PRETO", [
    "5A2FBCF5-0539-48E6-BF91-B1873AB4E594.jpg?v=1790701756", "CEBD2CE2-2E0B-4745-80FC-DD3AEB53D2E4.jpg?v=1790701756", "F4464421-3CBC-40E7-BC2C-A96851D99230.jpg?v=1780789872", "B7AA1785-952C-4E76-B336-C4C5FBCF7264.jpg?v=1780789872", "1014ABC3-71E5-47D8-9B89-68DACAC27634.jpg?v=1790701056"]],
  ["Bolsa Carmem - Preto", "bolsa-carmem-preto", "Carmem", "carmem", 489.90, true, "CARMEM-PRETA", [
    "4771B3C6-96F0-461B-B69C-01844B5A74A4.png?v=1790701648", "6E81D3DA-EF5D-4FC7-880D-3B77A398DBA7.png?v=1790701649", "ECFFC315-83E9-4831-A91E-176915FF8FF3.png?v=1790701648", "D885FD9D-A0F7-4C4A-AE29-06ADDBE29BDD.png?v=1790701648", "1014ABC3-71E5-47D8-9B89-68DACAC27634.jpg?v=1790701056"]],
  ["Bolsa Helena M - Preta", "bolsa-helena-m-preta", "Helena", "helenaM", 479.90, true, "BLHM01", [
    "3EEBA38D-6134-494F-B4C9-9CAA16434BCC.jpg?v=1790118802", "B977FDD9-77EB-40BC-B9E4-4C137D844513.jpg?v=1790118802", "289D7109-0939-48F7-ACF7-787F910C7474.jpg?v=1790120998", "614066B2-E6F2-40C0-A219-ABD949248B65.jpg?v=1780522953", "F9C35125-6FCD-4430-9D82-BA56E5DAC7BD.jpg?v=1780522954", "IMG-9605.png?v=1790518090"]],
  ["Bolsa Helena M - Vermelho Carmim", "bolsa-helena-m-vermelha-carmim", "Helena", "helenaM", 479.90, true, "BLHM05", [
    "2831DF64-94DF-4E3B-B8F8-EDCB0AA285F8.jpg?v=1790118322", "8FE9DE62-ACE6-4E6B-9D6F-A800092E44D2.jpg?v=1790118322", "CF4B9C76-2C0A-4B27-ABE6-F7251404A703.jpg?v=1790120436", "D6A508CB-DC80-4BD1-8C9E-E47CF24710B3.jpg?v=1780524772", "587ADA2A-45A6-4FAC-90D2-175038890E25.jpg?v=1780524772", "IMG-9605.png?v=1790518090"]],
  ["Bolsa Helena M - Sela", "bolsa-helena-m-sela", "Helena", "helenaM", 479.90, true, "BLHM04", [
    "502131EF-2872-4F2C-BB90-87B918CF57C0.jpg?v=1790118677", "7674AF57-6A43-4B1B-B71C-C9B0CBD064D8.jpg?v=1790118676", "314BAFF2-E068-4137-9D65-FFD04F70C276.jpg?v=1780524628", "9B242252-ED18-46E8-986F-415FE19E08BC.jpg?v=1790120477", "E5BC5255-1831-426E-B916-0671B8BACEF1.jpg?v=1780524628", "IMG-9605.png?v=1790518090"]],
  ["Bolsa Helena M - Jabuticaba", "bolsa-helena-m-jabuticaba", "Helena", "helenaM", 479.90, true, "BLHM12", [
    "30365292-26BE-435F-956A-969D6BEB5F22.jpg?v=1790118460", "DF3CA2AB-6FB6-4D56-BA71-BBD7B76D68E9.jpg?v=1790118460", "IMG-9380.jpg?v=1790120708", "114E6226-2066-48A6-86A3-E21BC9F38578.jpg?v=1780524463", "FF6E6E24-60D5-4711-8DF3-C6E3B868A3C0.jpg?v=1780524463", "IMG-9605.png?v=1790518090"]],
  ["Tag Personalizável - Fendi", "tag-personalizavel-fendi-presente", "Tags personalizáveis", "tag", 69.00, true, null, [
    "62398805-FACA-45C9-832C-C00504BEFC38.png?v=1776780100"]],
  ["Tag Personalizável - Off White", "tag-personalizavel-off-white", "Tags personalizáveis", "tag", 69.00, true, null, [
    "FB17A8FC-C786-4D0A-80D7-D7B1F27F4C46.png?v=1776780100"]],
  ["Tag Personalizável - Dourado", "tag-personalizavel-dourado-1", "Tags personalizáveis", "tag", 69.00, true, null, [
    "2BFC21A3-F310-46F5-919B-597748F4E6F1.png?v=1776780100"]],
  ["Tag Personalizável - Sela", "tag-personalizavel-dourado", "Tags personalizáveis", "tag", 69.00, true, null, [
    "0913253A-4478-40E2-9920-1EFADEC95507.png?v=1776780100"]],
  ["Tag Personalizável - Bronze", "tag-personalizavel-bronze", "Tags personalizáveis", "tag", 69.00, true, null, [
    "C39487F0-ADFE-4B0B-A223-7AD11848995C.png?v=1776780100"]],
  ["Tag Personalizável - Café", "tag-personalizavel-cafe", "Tags personalizáveis", "tag", 69.00, true, null, [
    "45D94EC5-CE8A-4B3B-9EB9-9CD4BA1B4631.png?v=1776780100"]],
];

export const PRODUTOS = LINHAS.map(([nome, handle, categoria, texto, preco, disponivel, codigo, fotos], ordem) => {
  const t = TXT[texto];
  return {
    nome,
    categoria,
    codigo,
    preco,
    preco_antigo: null,
    descricao: t.descricao,
    materiais: t.materiais || null,
    medidas: t.medidas || null,
    caracteristicas: t.caracteristicas || null,
    fotos: fotos.map((f) => ({ url: CDN + f })),
    // Sem variações no site. Disponível → quantidade não informada; indisponível → 0
    variacoes: [{ nome: "", quantidade: disponivel ? null : 0 }],
    visivel: true,
    destaque: false,
    ordem,
    origem_url: SITE + handle,
  };
});
