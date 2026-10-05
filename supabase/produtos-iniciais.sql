-- =====================================================================
-- Carga completa do catálogo (páginas 1 a 5 do site)
-- 130 produtos copiados de lifeatelie.com.br
-- Rode DEPOIS do esquema.sql (Supabase → SQL Editor → New query → Run).
-- Pode rodar de novo: produtos que já existem (mesmo link do site) são pulados.
-- Arquivo gerado por ferramentas/gerar-sql.mjs — não edite à mão.
-- =====================================================================

update public.config set whatsapp = '5531994685463' where id = 1 and coalesce(whatsapp, '') = '';

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sara P - Fendi', 'Sara', 'BLSP08', 389.90, null,
  'A Bolsa Sara P traz o charme do matelassê em uma versão compacta e estruturada. Pequena por fora e prática por dentro, é uma bolsa elegante para quem gosta de levar o essencial bem organizado.

Como usar
Use pela alça de mão para um visual mais clássico ou com a alça tiracolo ajustável para ter mais liberdade no dia a dia.

Espaço interno
Possui duas divisões com zíper de metal, além de bolso frontal com zíper para deixar os itens que você mais usa sempre à mão. O interior recebe forro vermelho, um detalhe marcante da peça.

Ocasiões
Perfeita para o dia a dia, passeios, almoços, viagens e compromissos em que você quer uma bolsa menor, prática e elegante.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com matelassê na parte frontal e traseira, ferragens com banho dourado e acabamento cuidadosamente trabalhado.', 'Altura: 14 cm
Largura: 21 cm
Profundidade: 10 cm
Peso: 450 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/AF5E81A8-B72E-44FA-A867-CD873D4B1456.jpg?v=1791023952"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/426D277E-3860-407D-B52F-59FC3C4173D0.jpg?v=1791023952"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2C17D605-439E-4871-85A4-DF040192ECC3.jpg?v=1791023952"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/5FBC73C9-707F-4458-8424-0A8519DF915E.jpg?v=1791023952"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/7EC633A8-79B8-45DA-82B2-DFCD1B0FEC2F.jpg?v=1791023952"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 0, 'https://www.lifeatelie.com.br/products/bolsa-sara-p-dourada'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sara-p-dourada');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Alice - Fendi', 'Alice', null, 489.90, null,
  'A bolsa Alice chama atenção pelos detalhes em alto-relevo no couro, que dão personalidade ao modelo sem perder a elegância. Compacta e moderna, tem o tamanho certo para acompanhar a rotina com leveza.

Como usar
Use no ombro ou na transversal com a alça ajustável e removível. Uma bolsa confortável para usar durante o dia e fácil de combinar com diferentes looks.

Espaço interno
Possui interior forrado na cor vermelha com bolso interno para pequenos itens e dois bolsos laterais. O fechamento principal combina zíper de metal com botão magnético, trazendo mais segurança e praticidade.

Ocasiões
Perfeita para o dia a dia, almoços, passeios, viagens e compromissos em que você quer levar o essencial sem carregar uma bolsa grande.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com detalhes em alto-relevo que valorizam sua textura. As ferragens com banho dourado complementam o acabamento da peça.', 'Altura: 17 cm
Largura: 24 cm
Profundidade: 11,5 cm
Alça: 53 cm
Peso: 600 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F45B7955-3486-42A8-B87E-4F33A9E4BBEB.jpg?v=1790726410"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/A89D7F09-512F-4A4A-BB7B-00D9566E2675.jpg?v=1790726467"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/8F496056-C4AA-473A-AABD-5F9D500947EC.jpg?v=1790726410"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BDB8461E-C027-4C47-8F94-9838D49D49CE.jpg?v=1790726410"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/02DA3625-D6AD-4D53-BC6D-A8F096F9F537.jpg?v=1790726410"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D049733B-FFBB-4284-9CB8-FAA43B2680B8.jpg?v=1790726410"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/25736006-CE48-41FF-8FCF-5C3B83125F06.jpg?v=1790726410"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BAB0C0FB-D39B-4DC3-964A-A25021538B10.jpg?v=1790725556"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 1, 'https://www.lifeatelie.com.br/products/bolsa-alice-fendi'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-alice-fendi');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Alice - Preto', 'Alice', 'BLAL01', 489.90, null,
  'A bolsa Alice chama atenção pelos detalhes em alto-relevo no couro, que dão personalidade ao modelo sem perder a elegância. Compacta e moderna, tem o tamanho certo para acompanhar a rotina com leveza.

Como usar
Use no ombro ou na transversal com a alça ajustável e removível. Uma bolsa confortável para usar durante o dia e fácil de combinar com diferentes looks.

Espaço interno
Possui interior forrado na cor vermelha com bolso interno para pequenos itens e dois bolsos laterais. O fechamento principal combina zíper de metal com botão magnético, trazendo mais segurança e praticidade.

Ocasiões
Perfeita para o dia a dia, almoços, passeios, viagens e compromissos em que você quer levar o essencial sem carregar uma bolsa grande.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com detalhes em alto-relevo que valorizam sua textura. As ferragens com banho dourado complementam o acabamento da peça.', 'Altura: 17 cm
Largura: 24 cm
Profundidade: 11,5 cm
Alça: 53 cm
Peso: 600 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E240A9D5-1CEF-4ACD-982B-BE577A39863D.png?v=1790726117"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/4C55D344-35FD-418D-8ABC-4AB0B6F27D19.png?v=1790726076"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/23358C67-E685-4CC1-BE77-A9E89543195A.png?v=1790726076"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/8AE053BA-409C-438E-AB4E-6C4BC85AD9C0.png?v=1790726076"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/ADE18BDA-7276-4731-9F64-3115E5C2C0BF.png?v=1790726076"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/0B7C4F86-3C01-4E05-B2BC-A072E765C686.png?v=1790726076"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/6304AD62-693B-42D7-B95F-4A1E78C25FD9.png?v=1790726076"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BAB0C0FB-D39B-4DC3-964A-A25021538B10.jpg?v=1790725556"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 2, 'https://www.lifeatelie.com.br/products/bolsa-alice-preto'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-alice-preto');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sara G - Vermelho Cereja', 'Sara', 'BLSG05', 439.90, null,
  'A bolsa Sara G combina o couro legítimo com o acabamento matelassê em um design elegante e marcante. Uma bolsa estruturada, prática e fácil de levar para diferentes momentos.

Como usar
Use no ombro ou na transversal. A alça é ajustável e removível, permitindo adaptar a bolsa ao seu estilo e à ocasião.

Espaço interno
Possui duas divisões internas, bolso interno com zíper e bolso frontal, facilitando a organização dos seus itens no dia a dia.

Ocasiões
Perfeita para trabalho, compromissos, almoços, passeios e viagens. Uma peça que acompanha tanto produções casuais quanto looks mais sofisticados.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com acabamento matelassê e detalhes cuidadosamente trabalhados. As variações naturais do couro fazem parte da identidade de cada peça.', 'Altura: 18 cm
Largura: 28 cm
Profundidade: 13 cm
Peso: 500 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/DC412960-5BBA-444B-A494-769193485945.jpg?v=1790645459"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/A085401C-4E58-41F3-B582-54AC31C45F3A.png?v=1790645459"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9F8FA7D4-7B6F-4CC4-831F-5570A97FB03B.png?v=1790645459"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F4756110-F51C-4006-AE64-5E44B2BF9D33.png?v=1790645459"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6482.png?v=1780190101"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 3, 'https://www.lifeatelie.com.br/products/bolsa-sara-g-vermelho-cereja'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sara-g-vermelho-cereja');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Luiza - Vermelho Cereja', 'Luiza', 'BLLZ05', 509.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Luiza traduz o minimalismo contemporâneo em uma peça marcante e sofisticada. Seu design moderno com detalhes em alto relevo e acabamento lateral exclusivo valoriza o couro legítimo e confere personalidade à bolsa, tornando-a única e atemporal.

Estruturada e marcada na medida certa, é ideal para acompanhar a rotina com organização e elegância.

Possui duas alças fixas de mão, que proporcionam um visual elegante e estruturado, além de alça tiracolo regulável para maior conforto e conforto no uso diário.

Seu interior forrado oferece praticidade com bolso interno funcional para pequenos objetos. O fechamento principal em zíper de metal com puxador em couro garante segurança e acabamento refinado.

Uma bolsa pensada para mulheres que valorizam presença, qualidade e design sofisticado.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 18 cm
Comprimento: 32 cm
Profundidade: 16 cm
Peso: 900 g', 'Couro legítimo de alta qualidade
Detalhes em alto relevo em couro
Acabamento lateral
Forro interno
Bolso interno funcional
Fechamento em zíper de metal
Puxador em maio
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E4612D8B-5008-4638-BE3E-EA7176BB2F43.jpg?v=1779239965"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/8BC49AFA-2A7C-4FE8-8A5C-5F673B234875.jpg?v=1779239965"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2118C86D-3A0B-4376-BF79-5EC82FC27546.jpg?v=1779239964"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/C40EFCB7-D44D-4A0C-884A-B9CAE60E03AF.jpg?v=1779239965"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/5776E66D-F29C-401B-A746-A226DA3C39F5.png?v=1779239965"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/4CC07D7B-DF0C-47D6-8506-1F92AC2C3FC1.jpg?v=1779239965"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 4, 'https://www.lifeatelie.com.br/products/bolsa-luiza-vermelho-cereja'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-luiza-vermelho-cereja');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Tag Personalizável - Jabuticaba', 'Tags personalizáveis', null, 69.00, null,
  'Um detalhe único, pensado para marcar momentos.

Feita em couro legítimo, com toque macio e acabamento sofisticado, a tag personalizável traz identidade e exclusividade para a sua bolsa.

Personalize com até 2 letras e transforme em um presente especial, delicado, elegante e cheio de significado.

Ideal para presentear (ou se presentear) com algo único.',
  'Couro legítimo', null, 'Couro legítimo
Personalização dourada de até 2 letras
Ferragem com acabamento dourado
Fixação prática na bolsa',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/45D94EC5-CE8A-4B3B-9EB9-9CD4BA1B4631.png?v=1776780100"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 5, 'https://www.lifeatelie.com.br/products/tag-personalizavel-jabuticaba-presente'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/tag-personalizavel-jabuticaba-presente');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Carmem - Azul Marinho', 'Carmem', 'CARMEM-MARINHO', 489.90, null,
  'A bolsa Carmem Estruturada, elegante e atemporal, combina sofisticação com uma organização que facilita a rotina. O design clássico e os detalhes em dourado fazem dela uma peça que você pode usar por muitos anos.

Como usar
Use pelas alças de mão para um visual mais sofisticado ou na transversal com a alça ajustável e removível, trazendo mais liberdade e conforto para o dia a dia.

Espaço interno
São três compartimentos principais: duas divisões com zíper de metal e uma divisão central com fechamento magnético. Conta ainda com um bolso interno para pequenos objetos.

Ocasiões
Perfeita para o trabalho, compromissos, almoços, eventos e ocasiões em que você quer estar elegante sem abrir mão da praticidade.',
  'Confeccionada em couro legítimo, com estrutura reforçada, zíperes de metal com puxadores em couro e ferragens com banho dourado. As características naturais do couro tornam cada peça única.', 'Altura: 22 cm
Largura: 28 cm
Profundidade: 18,5 cm
Peso: 800 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/C5E133B7-49A6-4F51-8B38-23F101E2E314.jpg?v=1790701183"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/628882AA-A058-4005-BE39-A30F84412900.jpg?v=1790701183"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F7E062F3-8441-4743-91E8-D933C61CE086.jpg?v=1790701183"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/FC74C283-3FED-4215-A024-44DF44FD5937.jpg?v=1790701183"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1014ABC3-71E5-47D8-9B89-68DACAC27634.jpg?v=1790701056"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 6, 'https://www.lifeatelie.com.br/products/bolsa-carmem-azul-marinho'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-carmem-azul-marinho');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Porta Celular Bia - Preta', 'Bia (porta-celular)', 'BIA-PRETA', 299.00, null,
  'A Bolsa Bia pequena nos detalhes. Inesquecível na presença. É compacta, delicada e cheia de personalidade, com ferragens douradas e alça em corrente e couro que dão um toque especial ao modelo.

Como usar
Use na transversal para ficar com as mãos livres e aproveitar o dia com mais leveza. É aquela bolsa pequena que acompanha você sem pesar no look.

Espaço interno
Compacta na medida certa para acomodar o smartphone e os itens essenciais do dia a dia. Possui forro vermelho e fechamento em corda de couro com botão magnético.

Ocasiões
Perfeita para passeios, viagens, um café, almoço, jantar ou aqueles momentos em que você quer sair levando somente o essencial.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com alça tiracolo em corrente e couro e ferragens com banho dourado. As variações naturais do couro tornam cada peça única.', 'Altura: 21 cm
Largura: 18 cm
Peso: 500 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/C9191D64-6DF4-470E-B2B9-92B1C595D2DC.jpg?v=1790740462"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/5E1B37D6-9779-4A03-92C2-796B986C263D.jpg?v=1790740459"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/EE01F05E-ECA5-4BEB-975E-F0D351516732.jpg?v=1781529715"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F5B106CC-98D2-441D-8AB8-87ECAA04286A.png?v=1790740272"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 7, 'https://www.lifeatelie.com.br/products/bolsa-porta-celular-bia-fendi-copia'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-porta-celular-bia-fendi-copia');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Porta Celular Bia - Café', 'Bia (porta-celular)', 'BIA-CAFE', 299.00, null,
  'A Bolsa Bia pequena nos detalhes. Inesquecível na presença. É compacta, delicada e cheia de personalidade, com ferragens douradas e alça em corrente e couro que dão um toque especial ao modelo.

Como usar
Use na transversal para ficar com as mãos livres e aproveitar o dia com mais leveza. É aquela bolsa pequena que acompanha você sem pesar no look.

Espaço interno
Compacta na medida certa para acomodar o smartphone e os itens essenciais do dia a dia. Possui forro vermelho e fechamento em corda de couro com botão magnético.

Ocasiões
Perfeita para passeios, viagens, um café, almoço, jantar ou aqueles momentos em que você quer sair levando somente o essencial.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com alça tiracolo em corrente e couro e ferragens com banho dourado. As variações naturais do couro tornam cada peça única.', 'Altura: 21 cm
Largura: 18 cm
Peso: 500 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9940.jpg?v=1790740498"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9941.jpg?v=1790740498"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B8C306F9-CF7F-4E8B-9FF0-FE1484D61F0D.jpg?v=1781529743"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F5B106CC-98D2-441D-8AB8-87ECAA04286A.png?v=1790740272"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 8, 'https://www.lifeatelie.com.br/products/bolsa-porta-celular-bia-cafe'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-porta-celular-bia-cafe');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Porta Celular Bia - Fendi', 'Bia (porta-celular)', 'BIA-FENDI', 299.00, null,
  'A Bolsa Bia pequena nos detalhes. Inesquecível na presença. É compacta, delicada e cheia de personalidade, com ferragens douradas e alça em corrente e couro que dão um toque especial ao modelo.

Como usar
Use na transversal para ficar com as mãos livres e aproveitar o dia com mais leveza. É aquela bolsa pequena que acompanha você sem pesar no look.

Espaço interno
Compacta na medida certa para acomodar o smartphone e os itens essenciais do dia a dia. Possui forro vermelho e fechamento em corda de couro com botão magnético.

Ocasiões
Perfeita para passeios, viagens, um café, almoço, jantar ou aqueles momentos em que você quer sair levando somente o essencial.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com alça tiracolo em corrente e couro e ferragens com banho dourado. As variações naturais do couro tornam cada peça única.', 'Altura: 21 cm
Largura: 18 cm
Peso: 500 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/950CE654-A902-4EA5-ACE8-B92E3FA01930.jpg?v=1790740271"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/C4DF906D-EBD1-45D9-A6E9-67E58B0CB290.jpg?v=1790740272"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/DDB4665E-F84A-4711-B13D-3496F35F0031.jpg?v=1781529662"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9D1E1BF9-9D7B-4924-B2A2-2F5A98E23D21.png?v=1790740308"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F5B106CC-98D2-441D-8AB8-87ECAA04286A.png?v=1790740272"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 9, 'https://www.lifeatelie.com.br/products/bolsa-bia-fendi'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-bia-fendi');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Porta Celular Bia - Sela', 'Bia (porta-celular)', 'BIA-SELA', 329.90, null,
  'A Bolsa Bia pequena nos detalhes. Inesquecível na presença. É compacta, delicada e cheia de personalidade, com ferragens douradas e alça em corrente e couro que dão um toque especial ao modelo.

Como usar
Use na transversal para ficar com as mãos livres e aproveitar o dia com mais leveza. É aquela bolsa pequena que acompanha você sem pesar no look.

Espaço interno
Compacta na medida certa para acomodar o smartphone e os itens essenciais do dia a dia. Possui forro vermelho e fechamento em corda de couro com botão magnético.

Ocasiões
Perfeita para passeios, viagens, um café, almoço, jantar ou aqueles momentos em que você quer sair levando somente o essencial.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com alça tiracolo em corrente e couro e ferragens com banho dourado. As variações naturais do couro tornam cada peça única.', 'Altura: 21 cm
Largura: 18 cm
Peso: 500 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2369E5CD-84F7-42A9-AA3E-A8E73FCF95C5.png?v=1790739815"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E6F79289-C614-4B4F-A86F-9B0603665A50.png?v=1790739815"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2AC3B963-9978-4251-888F-CB4FA1555B7E.png?v=1790739853"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/CA31B379-FF19-4D81-A9D8-5C9EF626034A.jpg?v=1781529985"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/83543C68-9C37-4D12-A34D-50BA2A9FAF5E.png?v=1790739814"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 10, 'https://www.lifeatelie.com.br/products/bolsa-porta-celular-bia-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-porta-celular-bia-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Porta Celular Bia - Vermelho Carmim', 'Bia (porta-celular)', 'BIA-VERMELHA', 329.90, null,
  'A Bolsa Bia pequena nos detalhes. Inesquecível na presença. É compacta, delicada e cheia de personalidade, com ferragens douradas e alça em corrente e couro que dão um toque especial ao modelo.

Como usar
Use na transversal para ficar com as mãos livres e aproveitar o dia com mais leveza. É aquela bolsa pequena que acompanha você sem pesar no look.

Espaço interno
Compacta na medida certa para acomodar o smartphone e os itens essenciais do dia a dia. Possui forro vermelho e fechamento em corda de couro com botão magnético.

Ocasiões
Perfeita para passeios, viagens, um café, almoço, jantar ou aqueles momentos em que você quer sair levando somente o essencial.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com alça tiracolo em corrente e couro e ferragens com banho dourado. As variações naturais do couro tornam cada peça única.', 'Altura: 21 cm
Largura: 18 cm
Peso: 500 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/C04353EE-38B0-4FFD-99E5-CA262F849282.jpg?v=1790739984"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/87873D33-13BC-42B1-B91B-66832BD7DE4F.jpg?v=1790739984"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/8A1E9475-7205-47CB-AA39-A7E07A6B192F.jpg?v=1781529923"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/26D27F86-D066-4ECF-B3A9-5944D743A4DE.png?v=1790739984"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/A7696857-7970-490C-A921-7C8F0B5C2A2B.jpg?v=1790740213"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 11, 'https://www.lifeatelie.com.br/products/bolsa-porta-celular-bia-vermelho-carmim'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-porta-celular-bia-vermelho-carmim');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Porta Celular Bia - Verde Militar', 'Bia (porta-celular)', 'BIA-MILITAR', 329.90, null,
  'A Bolsa Bia pequena nos detalhes. Inesquecível na presença. É compacta, delicada e cheia de personalidade, com ferragens douradas e alça em corrente e couro que dão um toque especial ao modelo.

Como usar
Use na transversal para ficar com as mãos livres e aproveitar o dia com mais leveza. É aquela bolsa pequena que acompanha você sem pesar no look.

Espaço interno
Compacta na medida certa para acomodar o smartphone e os itens essenciais do dia a dia. Possui forro vermelho e fechamento em corda de couro com botão magnético.

Ocasiões
Perfeita para passeios, viagens, um café, almoço, jantar ou aqueles momentos em que você quer sair levando somente o essencial.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com alça tiracolo em corrente e couro e ferragens com banho dourado. As variações naturais do couro tornam cada peça única.', 'Altura: 21 cm
Largura: 18 cm
Peso: 500 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9950.jpg?v=1790740614"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/EB8F1430-757C-4754-90CC-11911303244D.jpg?v=1781529893"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F5B106CC-98D2-441D-8AB8-87ECAA04286A.png?v=1790740272"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 12, 'https://www.lifeatelie.com.br/products/bolsa-porta-celular-bia-verde-militar'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-porta-celular-bia-verde-militar');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Porta Celular Bia - Azul Marinho', 'Bia (porta-celular)', 'BIA-MARINHO', 329.90, null,
  'A Bolsa Bia pequena nos detalhes. Inesquecível na presença. É compacta, delicada e cheia de personalidade, com ferragens douradas e alça em corrente e couro que dão um toque especial ao modelo.

Como usar
Use na transversal para ficar com as mãos livres e aproveitar o dia com mais leveza. É aquela bolsa pequena que acompanha você sem pesar no look.

Espaço interno
Compacta na medida certa para acomodar o smartphone e os itens essenciais do dia a dia. Possui forro vermelho e fechamento em corda de couro com botão magnético.

Ocasiões
Perfeita para passeios, viagens, um café, almoço, jantar ou aqueles momentos em que você quer sair levando somente o essencial.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com alça tiracolo em corrente e couro e ferragens com banho dourado. As variações naturais do couro tornam cada peça única.', 'Altura: 21 cm
Largura: 18 cm
Peso: 500 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9949.jpg?v=1790740391"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9944.jpg?v=1790740391"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9DF023DD-5BB2-4621-94E7-66F098936D50.jpg?v=1781529802"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F5B106CC-98D2-441D-8AB8-87ECAA04286A.png?v=1790740272"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 13, 'https://www.lifeatelie.com.br/products/bolsa-porta-celular-bia-azul-marinho'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-porta-celular-bia-azul-marinho');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Helena G - Verde Musgo', 'Helena', 'BLHG11', 529.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Helena é a união perfeita entre sofisticação, conforto e funcionalidade. Confeccionada em couro legítimo nobre, apresenta um design elegante com caimento leve e acabamento impecável, ideal para mulheres que valorizam estilo sem abrir mão da praticidade.

Seu grande destaque é a alça de ombro trançada, que adiciona charme e personalidade à peça, além de proporcionar conforto no uso diário. As ferragens com banho dourado elevam o visual com um toque refinado, enquanto o forro interno vermelho cria contraste e revela um detalhe surpreendente ao abrir a bolsa.

Pensada para a rotina, a Helena possui fechamento em zíper para maior segurança e bolso interno com zíper que facilita a organização dos itens essenciais.

Uma bolsa versátil, sofisticada e marcante — feita para acompanhar você em todos os momentos.

Exclusividade Life Ateliê.',
  'Couro legítimo nobre', 'Altura: 32 cm
Largura: 45 cm
Profundidade: 14 cm
Alça de ombro: 50 cm
Peso: 800 g', 'Couro legítimo nobre
Forro interno vermelho
Fechamento em zíper
Bolso interno com zíper
Alça de ombro trançada
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1138F0C9-7430-4C75-A430-E0BC7EE21D4C.jpg?v=1790118622"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BF875863-5C19-48FD-8ED4-A8AD533362A5.jpg?v=1790118620"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9615.jpg?v=1790540707"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6772.jpg?v=1780846743"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9387.jpg?v=1790120903"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1B2E3959-F1FE-454A-BC76-E50FE002ABB6.png?v=1777308660"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 14, 'https://www.lifeatelie.com.br/products/bolsa-helena-g-verde-musgo'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-helena-g-verde-musgo');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Helena M - Verde Musgo', 'Helena', 'BLHM11', 479.90, null,
  'A Bolsa Helena M tem aquele caimento macio e elegante que acompanha o corpo. O couro legítimo e a alça trançada dão personalidade à peça, enquanto o tamanho médio traz praticidade para o dia a dia.

Como usar
Use no ombro e deixe a bolsa acompanhar o movimento do corpo. Combina facilmente com produções casuais, jeans, alfaiataria ou um look mais arrumado.

Espaço interno
Tamanho médio, ideal para levar seus itens essenciais com conforto. Possui fechamento em zíper e 1 bolso interno com zíper para manter pequenos objetos organizados.

Ocasiões
Perfeita para o dia a dia, trabalho, almoço, passeios e viagens. Uma bolsa para usar muito, sem perder a elegância.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com textura e marcas naturais que tornam cada peça única. Com o uso, o couro ganha ainda mais personalidade.', 'Altura: 25 cm
Largura: 40 cm
Profundidade: 9 cm
Alça de ombro: 42 cm
Peso: 700 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1138F0C9-7430-4C75-A430-E0BC7EE21D4C.jpg?v=1790118622"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BF875863-5C19-48FD-8ED4-A8AD533362A5.jpg?v=1790118620"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9373.jpg?v=1790120317"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9387.jpg?v=1790120903"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6772.jpg?v=1780846743"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9605.png?v=1790518090"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 15, 'https://www.lifeatelie.com.br/products/bolsa-helena-m-verde-musgo'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-helena-m-verde-musgo');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Carmem - Vermelho Carmim', 'Carmem', 'CARMEM-VERMELHO', 489.90, null,
  'A bolsa Carmem Estruturada, elegante e atemporal, combina sofisticação com uma organização que facilita a rotina. O design clássico e os detalhes em dourado fazem dela uma peça que você pode usar por muitos anos.

Como usar
Use pelas alças de mão para um visual mais sofisticado ou na transversal com a alça ajustável e removível, trazendo mais liberdade e conforto para o dia a dia.

Espaço interno
São três compartimentos principais: duas divisões com zíper de metal e uma divisão central com fechamento magnético. Conta ainda com um bolso interno para pequenos objetos.

Ocasiões
Perfeita para o trabalho, compromissos, almoços, eventos e ocasiões em que você quer estar elegante sem abrir mão da praticidade.',
  'Confeccionada em couro legítimo, com estrutura reforçada, zíperes de metal com puxadores em couro e ferragens com banho dourado. As características naturais do couro tornam cada peça única.', 'Altura: 22 cm
Largura: 28 cm
Profundidade: 18,5 cm
Peso: 800 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/6F846072-6D99-4839-88C2-A00782A0B16F.png?v=1790700929"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9C5E3D9D-2D94-45AC-BD4E-3207FE386569.png?v=1790700929"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B447BD88-B4BD-43B6-B480-372CED15395C.png?v=1790700929"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/3AA73295-F38E-475F-9F1B-32EB096898EE.jpg?v=1780789986"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1014ABC3-71E5-47D8-9B89-68DACAC27634.jpg?v=1790701056"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 16, 'https://www.lifeatelie.com.br/products/bolsa-carmem-vermelho-carmim'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-carmem-vermelho-carmim');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Carmem - Sela', 'Carmem', 'CARMEM-SELA', 489.90, null,
  'A bolsa Carmem Estruturada, elegante e atemporal, combina sofisticação com uma organização que facilita a rotina. O design clássico e os detalhes em dourado fazem dela uma peça que você pode usar por muitos anos.

Como usar
Use pelas alças de mão para um visual mais sofisticado ou na transversal com a alça ajustável e removível, trazendo mais liberdade e conforto para o dia a dia.

Espaço interno
São três compartimentos principais: duas divisões com zíper de metal e uma divisão central com fechamento magnético. Conta ainda com um bolso interno para pequenos objetos.

Ocasiões
Perfeita para o trabalho, compromissos, almoços, eventos e ocasiões em que você quer estar elegante sem abrir mão da praticidade.',
  'Confeccionada em couro legítimo, com estrutura reforçada, zíperes de metal com puxadores em couro e ferragens com banho dourado. As características naturais do couro tornam cada peça única.', 'Altura: 22 cm
Largura: 28 cm
Profundidade: 18,5 cm
Peso: 800 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B6955EC2-976B-448B-BCCA-CBC74BC74242.png?v=1790701251"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/CAD95A77-516C-47E3-BBC7-945AB7ED0475.png?v=1790701251"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/3F98E3C7-C02A-4164-89E3-36561B434E9F.png?v=1790701251"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/379A14A9-9337-46D4-9602-1A677549E1FB.png?v=1790701251"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1014ABC3-71E5-47D8-9B89-68DACAC27634.jpg?v=1790701056"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 17, 'https://www.lifeatelie.com.br/products/bolsa-carmem-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-carmem-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Carmem - Café & Preto', 'Carmem', 'CARMEM-PRETO', 489.90, null,
  'A bolsa Carmem Estruturada, elegante e atemporal, combina sofisticação com uma organização que facilita a rotina. O design clássico e os detalhes em dourado fazem dela uma peça que você pode usar por muitos anos.

Como usar
Use pelas alças de mão para um visual mais sofisticado ou na transversal com a alça ajustável e removível, trazendo mais liberdade e conforto para o dia a dia.

Espaço interno
São três compartimentos principais: duas divisões com zíper de metal e uma divisão central com fechamento magnético. Conta ainda com um bolso interno para pequenos objetos.

Ocasiões
Perfeita para o trabalho, compromissos, almoços, eventos e ocasiões em que você quer estar elegante sem abrir mão da praticidade.',
  'Confeccionada em couro legítimo, com estrutura reforçada, zíperes de metal com puxadores em couro e ferragens com banho dourado. As características naturais do couro tornam cada peça única.', 'Altura: 22 cm
Largura: 28 cm
Profundidade: 18,5 cm
Peso: 800 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/5A2FBCF5-0539-48E6-BF91-B1873AB4E594.jpg?v=1790701756"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/CEBD2CE2-2E0B-4745-80FC-DD3AEB53D2E4.jpg?v=1790701756"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F4464421-3CBC-40E7-BC2C-A96851D99230.jpg?v=1780789872"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B7AA1785-952C-4E76-B336-C4C5FBCF7264.jpg?v=1780789872"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1014ABC3-71E5-47D8-9B89-68DACAC27634.jpg?v=1790701056"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 18, 'https://www.lifeatelie.com.br/products/bolsa-carmem-cafe-preto'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-carmem-cafe-preto');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Carmem - Preto', 'Carmem', 'CARMEM-PRETA', 489.90, null,
  'A bolsa Carmem Estruturada, elegante e atemporal, combina sofisticação com uma organização que facilita a rotina. O design clássico e os detalhes em dourado fazem dela uma peça que você pode usar por muitos anos.

Como usar
Use pelas alças de mão para um visual mais sofisticado ou na transversal com a alça ajustável e removível, trazendo mais liberdade e conforto para o dia a dia.

Espaço interno
São três compartimentos principais: duas divisões com zíper de metal e uma divisão central com fechamento magnético. Conta ainda com um bolso interno para pequenos objetos.

Ocasiões
Perfeita para o trabalho, compromissos, almoços, eventos e ocasiões em que você quer estar elegante sem abrir mão da praticidade.',
  'Confeccionada em couro legítimo, com estrutura reforçada, zíperes de metal com puxadores em couro e ferragens com banho dourado. As características naturais do couro tornam cada peça única.', 'Altura: 22 cm
Largura: 28 cm
Profundidade: 18,5 cm
Peso: 800 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/4771B3C6-96F0-461B-B69C-01844B5A74A4.png?v=1790701648"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/6E81D3DA-EF5D-4FC7-880D-3B77A398DBA7.png?v=1790701649"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/ECFFC315-83E9-4831-A91E-176915FF8FF3.png?v=1790701648"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D885FD9D-A0F7-4C4A-AE29-06ADDBE29BDD.png?v=1790701648"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1014ABC3-71E5-47D8-9B89-68DACAC27634.jpg?v=1790701056"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 19, 'https://www.lifeatelie.com.br/products/bolsa-carmem-preto'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-carmem-preto');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Helena M - Preta', 'Helena', 'BLHM01', 479.90, null,
  'A Bolsa Helena M tem aquele caimento macio e elegante que acompanha o corpo. O couro legítimo e a alça trançada dão personalidade à peça, enquanto o tamanho médio traz praticidade para o dia a dia.

Como usar
Use no ombro e deixe a bolsa acompanhar o movimento do corpo. Combina facilmente com produções casuais, jeans, alfaiataria ou um look mais arrumado.

Espaço interno
Tamanho médio, ideal para levar seus itens essenciais com conforto. Possui fechamento em zíper e 1 bolso interno com zíper para manter pequenos objetos organizados.

Ocasiões
Perfeita para o dia a dia, trabalho, almoço, passeios e viagens. Uma bolsa para usar muito, sem perder a elegância.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com textura e marcas naturais que tornam cada peça única. Com o uso, o couro ganha ainda mais personalidade.', 'Altura: 25 cm
Largura: 40 cm
Profundidade: 9 cm
Alça de ombro: 42 cm
Peso: 700 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/3EEBA38D-6134-494F-B4C9-9CAA16434BCC.jpg?v=1790118802"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B977FDD9-77EB-40BC-B9E4-4C137D844513.jpg?v=1790118802"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/289D7109-0939-48F7-ACF7-787F910C7474.jpg?v=1790120998"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/614066B2-E6F2-40C0-A219-ABD949248B65.jpg?v=1780522953"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F9C35125-6FCD-4430-9D82-BA56E5DAC7BD.jpg?v=1780522954"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9605.png?v=1790518090"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 20, 'https://www.lifeatelie.com.br/products/bolsa-helena-m-preta'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-helena-m-preta');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Helena M - Vermelho Carmim', 'Helena', 'BLHM05', 479.90, null,
  'A Bolsa Helena M tem aquele caimento macio e elegante que acompanha o corpo. O couro legítimo e a alça trançada dão personalidade à peça, enquanto o tamanho médio traz praticidade para o dia a dia.

Como usar
Use no ombro e deixe a bolsa acompanhar o movimento do corpo. Combina facilmente com produções casuais, jeans, alfaiataria ou um look mais arrumado.

Espaço interno
Tamanho médio, ideal para levar seus itens essenciais com conforto. Possui fechamento em zíper e 1 bolso interno com zíper para manter pequenos objetos organizados.

Ocasiões
Perfeita para o dia a dia, trabalho, almoço, passeios e viagens. Uma bolsa para usar muito, sem perder a elegância.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com textura e marcas naturais que tornam cada peça única. Com o uso, o couro ganha ainda mais personalidade.', 'Altura: 25 cm
Largura: 40 cm
Profundidade: 9 cm
Alça de ombro: 42 cm
Peso: 700 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2831DF64-94DF-4E3B-B8F8-EDCB0AA285F8.jpg?v=1790118322"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/8FE9DE62-ACE6-4E6B-9D6F-A800092E44D2.jpg?v=1790118322"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/CF4B9C76-2C0A-4B27-ABE6-F7251404A703.jpg?v=1790120436"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D6A508CB-DC80-4BD1-8C9E-E47CF24710B3.jpg?v=1780524772"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/587ADA2A-45A6-4FAC-90D2-175038890E25.jpg?v=1780524772"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9605.png?v=1790518090"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 21, 'https://www.lifeatelie.com.br/products/bolsa-helena-m-vermelha-carmim'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-helena-m-vermelha-carmim');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Helena M - Sela', 'Helena', 'BLHM04', 479.90, null,
  'A Bolsa Helena M tem aquele caimento macio e elegante que acompanha o corpo. O couro legítimo e a alça trançada dão personalidade à peça, enquanto o tamanho médio traz praticidade para o dia a dia.

Como usar
Use no ombro e deixe a bolsa acompanhar o movimento do corpo. Combina facilmente com produções casuais, jeans, alfaiataria ou um look mais arrumado.

Espaço interno
Tamanho médio, ideal para levar seus itens essenciais com conforto. Possui fechamento em zíper e 1 bolso interno com zíper para manter pequenos objetos organizados.

Ocasiões
Perfeita para o dia a dia, trabalho, almoço, passeios e viagens. Uma bolsa para usar muito, sem perder a elegância.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com textura e marcas naturais que tornam cada peça única. Com o uso, o couro ganha ainda mais personalidade.', 'Altura: 25 cm
Largura: 40 cm
Profundidade: 9 cm
Alça de ombro: 42 cm
Peso: 700 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/502131EF-2872-4F2C-BB90-87B918CF57C0.jpg?v=1790118677"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/7674AF57-6A43-4B1B-B71C-C9B0CBD064D8.jpg?v=1790118676"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/314BAFF2-E068-4137-9D65-FFD04F70C276.jpg?v=1780524628"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9B242252-ED18-46E8-986F-415FE19E08BC.jpg?v=1790120477"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E5BC5255-1831-426E-B916-0671B8BACEF1.jpg?v=1780524628"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9605.png?v=1790518090"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 22, 'https://www.lifeatelie.com.br/products/bolsa-helena-m-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-helena-m-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Helena M - Jabuticaba', 'Helena', 'BLHM12', 479.90, null,
  'A Bolsa Helena M tem aquele caimento macio e elegante que acompanha o corpo. O couro legítimo e a alça trançada dão personalidade à peça, enquanto o tamanho médio traz praticidade para o dia a dia.

Como usar
Use no ombro e deixe a bolsa acompanhar o movimento do corpo. Combina facilmente com produções casuais, jeans, alfaiataria ou um look mais arrumado.

Espaço interno
Tamanho médio, ideal para levar seus itens essenciais com conforto. Possui fechamento em zíper e 1 bolso interno com zíper para manter pequenos objetos organizados.

Ocasiões
Perfeita para o dia a dia, trabalho, almoço, passeios e viagens. Uma bolsa para usar muito, sem perder a elegância.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com textura e marcas naturais que tornam cada peça única. Com o uso, o couro ganha ainda mais personalidade.', 'Altura: 25 cm
Largura: 40 cm
Profundidade: 9 cm
Alça de ombro: 42 cm
Peso: 700 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/30365292-26BE-435F-956A-969D6BEB5F22.jpg?v=1790118460"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/DF3CA2AB-6FB6-4D56-BA71-BBD7B76D68E9.jpg?v=1790118460"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9380.jpg?v=1790120708"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/114E6226-2066-48A6-86A3-E21BC9F38578.jpg?v=1780524463"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/FF6E6E24-60D5-4711-8DF3-C6E3B868A3C0.jpg?v=1780524463"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9605.png?v=1790518090"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 23, 'https://www.lifeatelie.com.br/products/bolsa-helena-m-jabuticaba'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-helena-m-jabuticaba');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Tag Personalizável - Fendi', 'Tags personalizáveis', null, 69.00, null,
  'Um detalhe único, pensado para marcar momentos.

Feita em couro legítimo, com toque macio e acabamento sofisticado, a tag personalizável traz identidade e exclusividade para a sua bolsa.

Personalize com até 2 letras e transforme em um presente especial, delicado, elegante e cheio de significado.

Ideal para presentear (ou se presentear) com algo único.',
  'Couro legítimo', null, 'Couro legítimo
Personalização dourada de até 2 letras
Ferragem com acabamento dourado
Fixação prática na bolsa',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/62398805-FACA-45C9-832C-C00504BEFC38.png?v=1776780100"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 24, 'https://www.lifeatelie.com.br/products/tag-personalizavel-fendi-presente'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/tag-personalizavel-fendi-presente');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Tag Personalizável - Off White', 'Tags personalizáveis', null, 69.00, null,
  'Um detalhe único, pensado para marcar momentos.

Feita em couro legítimo, com toque macio e acabamento sofisticado, a tag personalizável traz identidade e exclusividade para a sua bolsa.

Personalize com até 2 letras e transforme em um presente especial, delicado, elegante e cheio de significado.

Ideal para presentear (ou se presentear) com algo único.',
  'Couro legítimo', null, 'Couro legítimo
Personalização dourada de até 2 letras
Ferragem com acabamento dourado
Fixação prática na bolsa',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/FB17A8FC-C786-4D0A-80D7-D7B1F27F4C46.png?v=1776780100"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 25, 'https://www.lifeatelie.com.br/products/tag-personalizavel-off-white'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/tag-personalizavel-off-white');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Tag Personalizável - Dourado', 'Tags personalizáveis', null, 69.00, null,
  'Um detalhe único, pensado para marcar momentos.

Feita em couro legítimo, com toque macio e acabamento sofisticado, a tag personalizável traz identidade e exclusividade para a sua bolsa.

Personalize com até 2 letras e transforme em um presente especial, delicado, elegante e cheio de significado.

Ideal para presentear (ou se presentear) com algo único.',
  'Couro legítimo', null, 'Couro legítimo
Personalização dourada de até 2 letras
Ferragem com acabamento dourado
Fixação prática na bolsa',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2BFC21A3-F310-46F5-919B-597748F4E6F1.png?v=1776780100"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 26, 'https://www.lifeatelie.com.br/products/tag-personalizavel-dourado-1'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/tag-personalizavel-dourado-1');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Tag Personalizável - Sela', 'Tags personalizáveis', null, 69.00, null,
  'Um detalhe único, pensado para marcar momentos.

Feita em couro legítimo, com toque macio e acabamento sofisticado, a tag personalizável traz identidade e exclusividade para a sua bolsa.

Personalize com até 2 letras e transforme em um presente especial, delicado, elegante e cheio de significado.

Ideal para presentear (ou se presentear) com algo único.',
  'Couro legítimo', null, 'Couro legítimo
Personalização dourada de até 2 letras
Ferragem com acabamento dourado
Fixação prática na bolsa',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/0913253A-4478-40E2-9920-1EFADEC95507.png?v=1776780100"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 27, 'https://www.lifeatelie.com.br/products/tag-personalizavel-dourado'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/tag-personalizavel-dourado');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Tag Personalizável - Bronze', 'Tags personalizáveis', null, 69.00, null,
  'Um detalhe único, pensado para marcar momentos.

Feita em couro legítimo, com toque macio e acabamento sofisticado, a tag personalizável traz identidade e exclusividade para a sua bolsa.

Personalize com até 2 letras e transforme em um presente especial, delicado, elegante e cheio de significado.

Ideal para presentear (ou se presentear) com algo único.',
  'Couro legítimo', null, 'Couro legítimo
Personalização dourada de até 2 letras
Ferragem com acabamento dourado
Fixação prática na bolsa',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/C39487F0-ADFE-4B0B-A223-7AD11848995C.png?v=1776780100"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 28, 'https://www.lifeatelie.com.br/products/tag-personalizavel-bronze'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/tag-personalizavel-bronze');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Tag Personalizável - Café', 'Tags personalizáveis', null, 69.00, null,
  'Um detalhe único, pensado para marcar momentos.

Feita em couro legítimo, com toque macio e acabamento sofisticado, a tag personalizável traz identidade e exclusividade para a sua bolsa.

Personalize com até 2 letras e transforme em um presente especial, delicado, elegante e cheio de significado.

Ideal para presentear (ou se presentear) com algo único.',
  'Couro legítimo', null, 'Couro legítimo
Personalização dourada de até 2 letras
Ferragem com acabamento dourado
Fixação prática na bolsa',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/45D94EC5-CE8A-4B3B-9EB9-9CD4BA1B4631.png?v=1776780100"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 29, 'https://www.lifeatelie.com.br/products/tag-personalizavel-cafe'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/tag-personalizavel-cafe');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Tag Personalizável - Verde Militar', 'Tags personalizáveis', null, 69.00, null,
  'Um detalhe único, pensado para marcar momentos.

Feita em couro legítimo, com toque macio e acabamento sofisticado, a tag personalizável traz identidade e exclusividade para a sua bolsa.

Personalize com até 2 letras e transforme em um presente especial, delicado, elegante e cheio de significado.

Ideal para presentear (ou se presentear) com algo único.',
  'Couro legítimo', null, 'Couro legítimo
Personalização dourada de até 2 letras
Ferragem com acabamento dourado
Fixação prática na bolsa',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/6BE24601-09EB-4C8A-8FFA-9EBDCACAD90D.png?v=1776780101"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 30, 'https://www.lifeatelie.com.br/products/tag-personalizavel-vermelho-carmim-copia'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/tag-personalizavel-vermelho-carmim-copia');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Tag Personalizável - Vermelho Carmim', 'Tags personalizáveis', null, 69.00, null,
  'Um detalhe único, pensado para marcar momentos.

Feita em couro legítimo, com toque macio e acabamento sofisticado, a tag personalizável traz identidade e exclusividade para a sua bolsa.

Personalize com até 2 letras e transforme em um presente especial, delicado, elegante e cheio de significado.

Ideal para presentear (ou se presentear) com algo único.',
  'Couro legítimo', null, 'Couro legítimo
Personalização dourada de até 2 letras
Ferragem com acabamento dourado
Fixação prática na bolsa',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/96BFD267-2738-4AA1-A2A1-D6A25C060B87.png?v=1776780100"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 31, 'https://www.lifeatelie.com.br/products/tag-personalizavel-vermelho-carmim'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/tag-personalizavel-vermelho-carmim');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Tag Personalizável - Azul Cielo', 'Tags personalizáveis', null, 59.90, null,
  'Um detalhe único, pensado para marcar momentos.

Feita em couro legítimo, com toque macio e acabamento sofisticado, a tag personalizável traz identidade e exclusividade para a sua bolsa.

Personalize com até 2 letras e transforme em um presente especial, delicado, elegante e cheio de significado.

Ideal para presentear (ou se presentear) com algo único.',
  'Couro legítimo', null, 'Couro legítimo
Personalização dourada de até 2 letras
Ferragem com acabamento dourado
Fixação prática na bolsa',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/5FF6CA56-D084-464C-B89C-FE3C10B772C1.png?v=1776780100"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 32, 'https://www.lifeatelie.com.br/products/tag-personalizavel-azul-cielo'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/tag-personalizavel-azul-cielo');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Tag Personalizável - Azul Marinho', 'Tags personalizáveis', null, null, null,
  'Um detalhe único, pensado para marcar momentos.

Feita em couro legítimo, com toque macio e acabamento sofisticado, a tag personalizável traz identidade e exclusividade para a sua bolsa.

Personalize com até 2 letras e transforme em um presente especial, delicado, elegante e cheio de significado.

Ideal para presentear (ou se presentear) com algo único.',
  'Couro legítimo', null, 'Couro legítimo
Personalização dourada de até 2 letras
Ferragem com acabamento dourado
Fixação prática na bolsa',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/6D4B7DC2-1EAF-4231-88EF-D7E0A10E1F9B.png?v=1776780100"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 33, 'https://www.lifeatelie.com.br/products/tag-personalizavel-azul-marinho'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/tag-personalizavel-azul-marinho');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Tag Personalizável - Preta', 'Tags personalizáveis', null, null, null,
  'Um detalhe único, pensado para marcar momentos.

Feita em couro legítimo, com toque macio e acabamento sofisticado, a tag personalizável traz identidade e exclusividade para a sua bolsa.

Personalize com até 2 letras e transforme em um presente especial, delicado, elegante e cheio de significado.

Ideal para presentear (ou se presentear) com algo único.',
  'Couro legítimo', null, 'Couro legítimo
Personalização dourada de até 2 letras
Ferragem com acabamento dourado
Fixação prática na bolsa',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9297AE72-545D-455F-86A5-D257CA4CCFD3.png?v=1776780100"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 34, 'https://www.lifeatelie.com.br/products/tag-personalizavel-preta'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/tag-personalizavel-preta');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Luana - Café & Preta', 'Luana', 'BLLN03', 519.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Luana é espaçosa e sofisticada, pensada para acompanhar a rotina com funcionalidade. Seu acabamento em matelassê valoriza o couro legítima e acrescenta um toque de sofisticação atemporal ao design.

Estruturada e versátil, possui duas alças de mão fixas que garantem um visual clássico e refinado, além de alça tiracolo regulável que proporciona conforto e praticidade no dia a dia.

Seu interior forrado oferece organização eficiente, com bolso interno funcional para pequenos objetos. Conta ainda com bolso externo prático para itens de fácil acesso e fechamento principal em zíper de metal com puxador em couro, garantindo segurança e acabamento impecável.

Uma peça ideal para mulheres que valorizam espaço, qualidade e presença marcante.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 22 cm
Comprimento: 29 cm
Profundidade: 22 cm
Peso: 900 g', 'Couro legítimo de alta qualidade
Acabamento em matelassê
Forro interno vermelho
Bolso interno funcional
Bolso externo
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F49F9172-C7E2-4EB7-9A19-C4B51D0D7DD9.jpg?v=1779242076"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/324E2130-4A26-4811-8137-755B7D31D5A3.jpg?v=1779242088"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B3EBA113-F872-42A4-A348-4B90664ECD2F.png?v=1779241330"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 35, 'https://www.lifeatelie.com.br/products/bolsa-luana-cafe-preta'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-luana-cafe-preta');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Luana - Sela & Nude', 'Luana', 'BLLN0413', 519.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Luana é espaçosa e sofisticada, pensada para acompanhar a rotina com funcionalidade. Seu acabamento em matelassê valoriza o couro legítima e acrescenta um toque de sofisticação atemporal ao design.

Estruturada e versátil, possui duas alças de mão fixas que garantem um visual clássico e refinado, além de alça tiracolo regulável que proporciona conforto e praticidade no dia a dia.

Seu interior forrado oferece organização eficiente, com bolso interno funcional para pequenos objetos. Conta ainda com bolso externo prático para itens de fácil acesso e fechamento principal em zíper de metal com puxador em couro, garantindo segurança e acabamento impecável.

Uma peça ideal para mulheres que valorizam espaço, qualidade e presença marcante.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 22 cm
Comprimento: 29 cm
Profundidade: 22 cm
Peso: 900 g', 'Couro legítimo de alta qualidade
Acabamento em matelassê
Forro interno vermelho
Bolso interno funcional
Bolso externo
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/6ACC7B70-3E45-4188-BACC-2C44F2BC6282.jpg?v=1779241852"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1C2BBF9A-0F63-48B2-AF97-59DDDC4411DD.jpg?v=1779241868"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B31E0289-55CE-47CB-913D-4A1918921737.jpg?v=1779241226"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B3EBA113-F872-42A4-A348-4B90664ECD2F.png?v=1779241330"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 36, 'https://www.lifeatelie.com.br/products/bolsa-luana-sela-nude'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-luana-sela-nude');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Nina Multicolor', 'Nina', 'NINA-MULT', 309.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Nina Multicolor é compacta, vibrante e cheia de personalidade. Confeccionada em couro legítimo multicolorido, cada peça apresenta combinações únicas que nunca se repetem, tornando-a exclusiva e especial.

Moderna e prática, é perfeita para adicionar um toque de estilo à rotina, equilibrando elegância e autenticidade em qualquer ocasião.

Possui alça de mão para um visual mais clássico e alça tiracolo regulável e removível, garantindo versatilidade e conforto no uso diário.

Seu interior com forro vermelho valoriza o design e reforça o acabamento sofisticado. Conta com três divisões funcionais, incluindo bolso frontal prático, além de fechamento em zíper de metal com puxadores em couro colorido.

Uma bolsa pensada para mulheres que apreciam originalidade, qualidade e design autoral.

Cada Nina Multicolor é única. As combinações de cores não se repetem. Para conhecer as opções disponíveis, entre em contato.

Exclusividade Life Ateliê.',
  'Couro legítimo multicolorido de alta qualidade', 'Altura: 14 cm
Largura: 21 cm
Profundidade: 10 cm
Peso: 450 g', 'Couro legítimo multicolorido de alta qualidade
Combinações exclusivas e únicas
Forro interno vermelho
Três divisões funcionais
Bolso frontal
Fechamento em zíper de metal
Puxadores em couro colorido
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/C1E2591E-2FB4-480F-861F-195FE7AAAB4D.jpg?v=1779233630"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/DB2EE220-006C-44E5-AE18-3BC700CB69F7.jpg?v=1779233771"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/975FE2E4-D576-4F90-8F57-6FA41EC7E006.jpg?v=1779233630"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/CB3ECB4B-71B4-4EAF-A328-5F9CD06563A4.jpg?v=1779233630"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/7C154ADF-0A94-4DC6-9DC9-BA9D850938B8.jpg?v=1779233630"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E2811444-99B8-45DD-87DB-D32C69355C58.jpg?v=1779233771"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 37, 'https://www.lifeatelie.com.br/products/bolsa-nina-multicolor'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-nina-multicolor');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Mouse Pad - Verde Militar', 'Mousepads', null, 119.90, null,
  'Seu espaço de trabalho também merece elegância.

Em couro legítimo, com toque macio e acabamento refinado, o mouse Pad transforma sua rotina com conforto e sofisticação. O alto relevo suave apoia a mão de forma natural, tornando o uso mais agradável ao longo do dia.

A personalização em até 3 letras douradas traz identidade e exclusividade, um detalhe que faz toda a diferença, seja para você ou para presentear.',
  'Couro legítimo', 'Largura: 18 cm
Altura: 22 cm', 'Couro legítimo
Alto relevo macio para maior conforto
Personalização de até 3 letras douradas
Acabamento sofisticado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F21BA9DC-A833-4657-A075-C15C7842B2E8.png?v=1776785986"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 38, 'https://www.lifeatelie.com.br/products/mousepad-verde-militar'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/mousepad-verde-militar');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Mouse Pad - Vermelho Carmim', 'Mousepads', null, 119.90, null,
  'Seu espaço de trabalho também merece elegância.

Em couro legítimo, com toque macio e acabamento refinado, o mouse Pad transforma sua rotina com conforto e sofisticação. O alto relevo suave apoia a mão de forma natural, tornando o uso mais agradável ao longo do dia.

A personalização em até 3 letras douradas traz identidade e exclusividade, um detalhe que faz toda a diferença, seja para você ou para presentear.',
  'Couro legítimo', 'Largura: 18 cm
Altura: 22 cm', 'Couro legítimo
Alto relevo macio para maior conforto
Personalização de até 3 letras douradas
Acabamento sofisticado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/24809D9C-99F7-4E40-868C-FA334F3D0CE0.png?v=1776785988"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 39, 'https://www.lifeatelie.com.br/products/mousepad-verde-militar-copia'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/mousepad-verde-militar-copia');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Mouse Pad - Azul Marinho', 'Mousepads', null, 119.90, null,
  'Seu espaço de trabalho também merece elegância.

Em couro legítimo, com toque macio e acabamento refinado, o mouse Pad transforma sua rotina com conforto e sofisticação. O alto relevo suave apoia a mão de forma natural, tornando o uso mais agradável ao longo do dia.

A personalização em até 3 letras douradas traz identidade e exclusividade, um detalhe que faz toda a diferença, seja para você ou para presentear.',
  'Couro legítimo', 'Largura: 18 cm
Altura: 22 cm', 'Couro legítimo
Alto relevo macio para maior conforto
Personalização de até 3 letras douradas
Acabamento sofisticado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D0B1D908-9AAA-4947-8235-9F6F37D99E45.png?v=1776785986"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 40, 'https://www.lifeatelie.com.br/products/mousepad-azul-marinho'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/mousepad-azul-marinho');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Mouse Pad - Sela', 'Mousepads', null, 119.90, null,
  'Seu espaço de trabalho também merece elegância.

Em couro legítimo, com toque macio e acabamento refinado, o mouse Pad transforma sua rotina com conforto e sofisticação. O alto relevo suave apoia a mão de forma natural, tornando o uso mais agradável ao longo do dia.

A personalização em até 3 letras douradas traz identidade e exclusividade, um detalhe que faz toda a diferença, seja para você ou para presentear.',
  'Couro legítimo', 'Largura: 18 cm
Altura: 22 cm', 'Couro legítimo
Alto relevo macio para maior conforto
Personalização de até 3 letras douradas
Acabamento sofisticado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2A3569C6-C539-4E2C-AA9B-9B156158F284.png?v=1776785986"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 41, 'https://www.lifeatelie.com.br/products/mousepad-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/mousepad-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Mouse Pad - Off White', 'Mousepads', null, 119.90, null,
  'Seu espaço de trabalho também merece elegância.

Em couro legítimo, com toque macio e acabamento refinado, o mouse Pad transforma sua rotina com conforto e sofisticação. O alto relevo suave apoia a mão de forma natural, tornando o uso mais agradável ao longo do dia.

A personalização em até 3 letras douradas traz identidade e exclusividade, um detalhe que faz toda a diferença, seja para você ou para presentear.',
  'Couro legítimo', 'Largura: 18 cm
Altura: 22 cm', 'Couro legítimo
Alto relevo macio para maior conforto
Personalização de até 3 letras douradas
Acabamento sofisticado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/6868CB6D-47EC-4C60-8D3B-EC5017635F51.png?v=1776785986"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 42, 'https://www.lifeatelie.com.br/products/mousepad-off-white'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/mousepad-off-white');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Mouse Pad - Café', 'Mousepads', null, 119.90, null,
  'Seu espaço de trabalho também merece elegância.

Em couro legítimo, com toque macio e acabamento refinado, o mouse Pad transforma sua rotina com conforto e sofisticação. O alto relevo suave apoia a mão de forma natural, tornando o uso mais agradável ao longo do dia.

A personalização em até 3 letras douradas traz identidade e exclusividade, um detalhe que faz toda a diferença, seja para você ou para presentear.',
  'Couro legítimo', 'Largura: 18 cm
Altura: 22 cm', 'Couro legítimo
Alto relevo macio para maior conforto
Personalização de até 3 letras douradas
Acabamento sofisticado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/692C83AF-F403-4A74-B7BE-262414BC74C3.png?v=1776785986"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 43, 'https://www.lifeatelie.com.br/products/mousepad-cafe'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/mousepad-cafe');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Mouse Pad - Preto', 'Mousepads', null, 119.90, null,
  'Seu espaço de trabalho também merece elegância.

Em couro legítimo, com toque macio e acabamento refinado, o mouse Pad transforma sua rotina com conforto e sofisticação. O alto relevo suave apoia a mão de forma natural, tornando o uso mais agradável ao longo do dia.

A personalização em até 3 letras douradas traz identidade e exclusividade, um detalhe que faz toda a diferença, seja para você ou para presentear.',
  'Couro legítimo', 'Largura: 18 cm
Altura: 22 cm', 'Couro legítimo
Alto relevo macio para maior conforto
Personalização de até 3 letras douradas
Acabamento sofisticado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/45959870-8BAB-42C7-B70C-9E63BC6566CF.png?v=1776785986"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 44, 'https://www.lifeatelie.com.br/products/mousepad-preto'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/mousepad-preto');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sofia - Café', 'Sofia', 'BLSF03', 419.90, null,
  'Sabe aquela bolsa que você coloca no ombro e o look já ganha presença?
A Bolsa Sofia é assim.

Em couro legítimo, com toque macio e estrutura na medida certa, ela acompanha sua rotina com elegância e naturalidade. Por dentro, o forro vermelho cria um contraste sofisticado, pensado nos mínimos detalhes.

Conta com bolso interno para organização, zíper em metal, puxador em couro e ferragens com banho dourado que elevam a peça com discrição. Versátil, possui alça de ombro e alça tiracolo para diferentes formas de uso.',
  'Puxador em couro', 'Altura: 14,5 cm
Largura: 34 cm
Profundidade: 15 cm
Peso: 600 g', 'Forro interno vermelho
Bolso interno
Zíper em metal
Puxador em couro
Ferragens com banho dourado
Alça de ombro
Alça tiracolo',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6754.jpg?v=1780793608"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6755.jpg?v=1780793735"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-4189.jpg?v=1776736586"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-4190.jpg?v=1776736586"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-4976.png?v=1777311308"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 45, 'https://www.lifeatelie.com.br/products/bolsa-sofia-cafe'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sofia-cafe');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sofia - Verde Militar', 'Sofia', 'BLSF10', 419.90, null,
  'Sabe aquela bolsa que você coloca no ombro e o look já ganha presença?
A Bolsa Sofia é assim.

Em couro legítimo, com toque macio e estrutura na medida certa, ela acompanha sua rotina com elegância e naturalidade. Por dentro, o forro vermelho cria um contraste sofisticado, pensado nos mínimos detalhes.

Conta com bolso interno para organização, zíper em metal, puxador em couro e ferragens com banho dourado que elevam a peça com discrição. Versátil, possui alça de ombro e alça tiracolo para diferentes formas de uso.',
  'Puxador em couro', 'Altura: 14,5 cm
Largura: 34 cm
Profundidade: 15 cm
Peso: 600 g', 'Forro interno vermelho
Bolso interno
Zíper em metal
Puxador em couro
Ferragens com banho dourado
Alça de ombro
Alça tiracolo',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6707.jpg?v=1780792776"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6708.jpg?v=1780792775"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6710.jpg?v=1780792775"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6711.jpg?v=1780792775"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-4976.png?v=1777311308"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 46, 'https://www.lifeatelie.com.br/products/bolsa-sofia-preta'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sofia-preta');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Hera - Off & Jabuticaba', 'Hera', 'HERA-OFFJAB', 479.90, null,
  'Estruturada, elegante e marcante.

A Bolsa Hera traduz sofisticação em cada detalhe, combinando couro legítimo com texturas que valorizam o design e trazem personalidade à peça. Seu formato estruturado garante presença, enquanto o contraste de materiais cria um visual atemporal e refinado.

Compacta na medida certa, é ideal para acompanhar a rotina com praticidade e estilo, elevando qualquer produção com elegância.

Seu interior forrado oferece organização funcional, com espaço ideal para os itens essenciais do dia a dia, unindo beleza e funcionalidade.

Uma bolsa pensada para mulheres que valorizam qualidade, acabamento impecável e significado no que carregam.',
  'Couro legítimo de alta qualidade', 'Altura: 12 cm
Comprimento: 23 cm
Profundidade: 10 cm
Peso: 500 g', 'Couro legítimo de alta qualidade
Design estruturado
Combinação de texturas sofisticadas
Ferragens com banho dourado
Forro interno
Fechamento com botão magnético
Alça de mão estruturada
Acompanha alça transversal',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/A92363B5-2734-4C52-AC84-0161C1E6A8FB.jpg?v=1776804715"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E0B274AB-D636-4C5B-8299-0DAF0EF81EFC.jpg?v=1776804715"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/5802EFC4-BB24-4EF8-84A7-585090043FA1.jpg?v=1776804715"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/4E6C7785-AB84-4DF9-B878-2AE6AD14DB15.jpg?v=1776804715"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2FFEB86A-0B8B-4C83-9227-F1F4CEA9F665.jpg?v=1776804715"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/5456434C-6C5E-4694-A12E-FFFFFE92E067.jpg?v=1776804715"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 47, 'https://www.lifeatelie.com.br/products/bolsa-hera-jabuticaba-off'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-hera-jabuticaba-off');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Hera - Preta', 'Hera', 'HERA-PRETA', 479.90, null,
  'Estruturada, elegante e marcante.

A Bolsa Hera traduz sofisticação em cada detalhe, combinando couro legítimo com texturas que valorizam o design e trazem personalidade à peça. Seu formato estruturado garante presença, enquanto o contraste de materiais cria um visual atemporal e refinado.

Compacta na medida certa, é ideal para acompanhar a rotina com praticidade e estilo, elevando qualquer produção com elegância.

Seu interior forrado oferece organização funcional, com espaço ideal para os itens essenciais do dia a dia, unindo beleza e funcionalidade.

Uma bolsa pensada para mulheres que valorizam qualidade, acabamento impecável e significado no que carregam.',
  'Couro legítimo de alta qualidade', 'Altura: 12 cm
Comprimento: 23 cm
Profundidade: 10 cm
Peso: 500 g', 'Couro legítimo de alta qualidade
Design estruturado
Combinação de texturas sofisticadas
Ferragens com banho dourado
Forro interno
Fechamento com botão magnético
Alça de mão estruturada
Acompanha alça transversal',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/6802BEF2-3FD7-4EF5-A1C4-46EF95B7E289.jpg?v=1776804626"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/167264F8-F590-4D93-8A35-E0E6494D6B9B.jpg?v=1776804626"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/8D2E4A9D-6514-426E-864F-3C777E8D75D8.jpg?v=1776804626"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/6487B68E-4FF9-45E7-8F8E-4F804D92EC26.jpg?v=1776804626"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/60209094-5FCF-423F-A5BC-28C1A53E9C83.jpg?v=1776804626"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 48, 'https://www.lifeatelie.com.br/products/bolsa-hera-preta'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-hera-preta');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Hera - Areia & Caramelo', 'Hera', 'HERA-CARAM', 479.90, null,
  'Estruturada, elegante e marcante.

A Bolsa Hera traduz sofisticação em cada detalhe, combinando couro legítimo com texturas que valorizam o design e trazem personalidade à peça. Seu formato estruturado garante presença, enquanto o contraste de materiais cria um visual atemporal e refinado.

Compacta na medida certa, é ideal para acompanhar a rotina com praticidade e estilo, elevando qualquer produção com elegância.

Seu interior forrado oferece organização funcional, com espaço ideal para os itens essenciais do dia a dia, unindo beleza e funcionalidade.

Uma bolsa pensada para mulheres que valorizam qualidade, acabamento impecável e significado no que carregam.',
  'Couro legítimo de alta qualidade', 'Altura: 12 cm
Comprimento: 23 cm
Profundidade: 10 cm
Peso: 500 g', 'Couro legítimo de alta qualidade
Design estruturado
Combinação de texturas sofisticadas
Ferragens com banho dourado
Forro interno
Fechamento com botão magnético
Alça de mão estruturada
Acompanha alça transversal',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F12A6B03-99F6-492F-98DE-056FB72E3F3A.png?v=1776804841"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2839658E-1666-44DE-928C-59802C5C162E.png?v=1776804840"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/44DB1E92-BA77-45FF-B364-E38330C1A911.png?v=1776804841"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2E966D94-0B92-418C-AA41-B4641B5928BE.jpg?v=1776804840"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/8AFD74CC-518F-45B5-A992-A6287A1749AB.jpg?v=1776804840"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B23DABF8-5C49-418A-A462-D9DC09989B45.jpg?v=1776804840"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 49, 'https://www.lifeatelie.com.br/products/bolsa-hera-areia-caramelo'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-hera-areia-caramelo');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Hera - Âmbar & Castor', 'Hera', 'HERA-AMBAR', 479.90, null,
  'Estruturada, elegante e marcante.

A Bolsa Hera traduz sofisticação em cada detalhe, combinando couro legítimo com texturas que valorizam o design e trazem personalidade à peça. Seu formato estruturado garante presença, enquanto o contraste de materiais cria um visual atemporal e refinado.

Compacta na medida certa, é ideal para acompanhar a rotina com praticidade e estilo, elevando qualquer produção com elegância.

Seu interior forrado oferece organização funcional, com espaço ideal para os itens essenciais do dia a dia, unindo beleza e funcionalidade.

Uma bolsa pensada para mulheres que valorizam qualidade, acabamento impecável e significado no que carregam.',
  'Couro legítimo de alta qualidade', 'Altura: 12 cm
Comprimento: 23 cm
Profundidade: 10 cm
Peso: 500 g', 'Couro legítimo de alta qualidade
Design estruturado
Combinação de texturas sofisticadas
Ferragens com banho dourado
Forro interno
Fechamento com botão magnético
Alça de mão estruturada
Acompanha alça transversal',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F3E40A95-66F8-47C4-B95C-E73F611C7C56.jpg?v=1776806052"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/FF74F3B2-5F76-42F0-9E9D-E2415467DB75.jpg?v=1776806052"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/58BE1264-5050-49E5-9553-1591D503AE1D.jpg?v=1776806052"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F11D1B72-F736-4563-BF98-993FF733A4D8.jpg?v=1776806052"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B2F89EE7-C660-4D50-AB8D-BF17E449ADB1.jpg?v=1776806052"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 50, 'https://www.lifeatelie.com.br/products/bolsa-hera-ambar-casto'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-hera-ambar-casto');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sofia - Fendi', 'Sofia', 'BLSF08', 419.90, null,
  'Sabe aquela bolsa que você coloca no ombro e o look já ganha presença?
A Bolsa Sofia é assim.

Em couro legítimo, com toque macio e estrutura na medida certa, ela acompanha sua rotina com elegância e naturalidade. Por dentro, o forro vermelho cria um contraste sofisticado, pensado nos mínimos detalhes.

Conta com bolso interno para organização, zíper em metal, puxador em couro e ferragens com banho dourado que elevam a peça com discrição. Versátil, possui alça de ombro e alça tiracolo para diferentes formas de uso.',
  'Puxador em couro', 'Altura: 14,5 cm
Largura: 34 cm
Profundidade: 15 cm
Peso: 600 g', 'Forro interno vermelho
Bolso interno
Zíper em metal
Puxador em couro
Ferragens com banho dourado
Alça de ombro
Alça tiracolo',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-4164.jpg?v=1776733751"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-4165.jpg?v=1776733751"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-4166.jpg?v=1776733751"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-4167.jpg?v=1776733751"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-4976.png?v=1777311308"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 51, 'https://www.lifeatelie.com.br/products/bolsa-sofia-fendi'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sofia-fendi');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sofia - Vermelho Carmim', 'Sofia', 'BLSF05', 419.90, null,
  'Sabe aquela bolsa que você coloca no ombro e o look já ganha presença?
A Bolsa Sofia é assim.

Em couro legítimo, com toque macio e estrutura na medida certa, ela acompanha sua rotina com elegância e naturalidade. Por dentro, o forro vermelho cria um contraste sofisticado, pensado nos mínimos detalhes.

Conta com bolso interno para organização, zíper em metal, puxador em couro e ferragens com banho dourado que elevam a peça com discrição. Versátil, possui alça de ombro e alça tiracolo para diferentes formas de uso.',
  'Puxador em couro', 'Altura: 14,5 cm
Largura: 34 cm
Profundidade: 15 cm
Peso: 600 g', 'Forro interno vermelho
Bolso interno
Zíper em metal
Puxador em couro
Ferragens com banho dourado
Alça de ombro
Alça tiracolo',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BDE4A8F6-E75B-4A69-9FCB-B43409BEAF79.jpg?v=1776733875"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/80A53740-0C15-4B40-9CFA-D03092D18EDB.jpg?v=1776733875"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/72429ABB-5FAE-4070-A707-FEDFAD28A277.jpg?v=1776733875"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/412283CF-63BC-408C-80AB-871CA57249B3.jpg?v=1776733875"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-4976.png?v=1777311308"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 52, 'https://www.lifeatelie.com.br/products/bolsa-sofia-vermelho-carmim'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sofia-vermelho-carmim');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sofia - Preta', 'Sofia', 'BLSF01', 419.90, null,
  'Sabe aquela bolsa que você coloca no ombro e o look já ganha presença?
A Bolsa Sofia é assim.

Em couro legítimo, com toque macio e estrutura na medida certa, ela acompanha sua rotina com elegância e naturalidade. Por dentro, o forro vermelho cria um contraste sofisticado, pensado nos mínimos detalhes.

Conta com bolso interno para organização, zíper em metal, puxador em couro e ferragens com banho dourado que elevam a peça com discrição. Versátil, possui alça de ombro e alça tiracolo para diferentes formas de uso.',
  'Puxador em couro', 'Altura: 14,5 cm
Largura: 34 cm
Profundidade: 15 cm
Peso: 600 g', 'Forro interno vermelho
Bolso interno
Zíper em metal
Puxador em couro
Ferragens com banho dourado
Alça de ombro
Alça tiracolo',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/EC4F32EB-4E7C-477E-8F1E-AC7F4B7EEFB5.jpg?v=1776733814"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/AD0FEA83-5A0D-45DD-9374-AF1457BEBE07.jpg?v=1776733814"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/DC4553BE-4C72-4D67-ADEB-8FF10B6DF671.jpg?v=1776733814"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F42D6016-DEE4-429B-B6D0-E191A9675725.jpg?v=1776733813"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-4976.png?v=1777311308"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 53, 'https://www.lifeatelie.com.br/products/bolsa-sofia-preta-1'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sofia-preta-1');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sofia - Azul Marinho', 'Sofia', 'BLSF09', 419.90, null,
  'Sabe aquela bolsa que você coloca no ombro e o look já ganha presença?
A Bolsa Sofia é assim.

Em couro legítimo, com toque macio e estrutura na medida certa, ela acompanha sua rotina com elegância e naturalidade. Por dentro, o forro vermelho cria um contraste sofisticado, pensado nos mínimos detalhes.

Conta com bolso interno para organização, zíper em metal, puxador em couro e ferragens com banho dourado que elevam a peça com discrição. Versátil, possui alça de ombro e alça tiracolo para diferentes formas de uso.',
  'Puxador em couro', 'Altura: 14,5 cm
Largura: 34 cm
Profundidade: 15 cm
Peso: 600 g', 'Forro interno vermelho
Bolso interno
Zíper em metal
Puxador em couro
Ferragens com banho dourado
Alça de ombro
Alça tiracolo',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/0C2CA55A-AE27-4CDD-A23F-B1AD9DE70BBE.jpg?v=1776823603"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/61617547-F765-470B-9BD0-31005FCBB420.jpg?v=1776823545"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/FCA803E5-4670-46B1-9C94-D41AAE3CC27B.jpg?v=1776823529"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/64CACA5A-0C61-47A1-8575-9E7C9C9DA6A0.jpg?v=1776823528"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-4976.png?v=1777311308"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 54, 'https://www.lifeatelie.com.br/products/bolsa-sofia-azul-marinho'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sofia-azul-marinho');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sofia - Sela', 'Sofia', 'BLSF04', 419.90, null,
  'Sabe aquela bolsa que você coloca no ombro e o look já ganha presença?
A Bolsa Sofia é assim.

Em couro legítimo, com toque macio e estrutura na medida certa, ela acompanha sua rotina com elegância e naturalidade. Por dentro, o forro vermelho cria um contraste sofisticado, pensado nos mínimos detalhes.

Conta com bolso interno para organização, zíper em metal, puxador em couro e ferragens com banho dourado que elevam a peça com discrição. Versátil, possui alça de ombro e alça tiracolo para diferentes formas de uso.',
  'Puxador em couro', 'Altura: 14,5 cm
Largura: 34 cm
Profundidade: 15 cm
Peso: 600 g', 'Forro interno vermelho
Bolso interno
Zíper em metal
Puxador em couro
Ferragens com banho dourado
Alça de ombro
Alça tiracolo',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D3264853-2E6E-4AB2-8919-82B1C7230F4D.jpg?v=1776730578"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/19ECF0AB-B076-4883-B454-03E230115060.jpg?v=1776730579"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/64531D6D-E0D3-485E-865E-844DF96E703A.jpg?v=1776730579"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/64F35F70-0128-41F6-AB1F-62EFC9F182CE.jpg?v=1776730578"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-4976.png?v=1777311308"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 55, 'https://www.lifeatelie.com.br/products/bolsa-sofia-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sofia-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Luiza - Fendi', 'Luiza', 'BLLZ08', 509.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Luiza traduz o minimalismo contemporâneo em uma peça marcante e sofisticada. Seu design moderno com detalhes em alto-relevo e acabamento lateral exclusivo valoriza o couro legítimo e confere personalidade à bolsa, tornando-a única e atemporal.

Estruturada e espaçosa na medida certa, é ideal para acompanhar a rotina com organização e elegância.

Possui duas alças fixas de mão, que proporcionam um visual elegante e estruturado, além de alça tiracolo regulável para maior conforto e versatilidade no uso diário.

Seu interior forrado oferece praticidade com bolso interno funcional para pequenos objetos. O fechamento principal em zíper de metal com puxador em couro garante segurança e acabamento refinado.

Uma bolsa pensada para mulheres que valorizam presença, qualidade e design sofisticado.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 18 cm
Comprimento: 34 cm
Profundidade: 16 cm
Peso: 900 g', 'Couro legítimo de alta qualidade
Detalhes em alto-relevo em couro
Acabamento lateral exclusivo
Forro interno
Bolso interno funcional
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/39F24D6F-BDA1-46E2-8ABC-7AE02E8680E8.jpg?v=1779240063"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E79F3B2E-5700-4C3A-9A14-3AD6178C939C.jpg?v=1779240062"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/64B24094-1FBD-46B4-ACA7-FDAC87561236.jpg?v=1779240062"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/6AE2C078-A5FA-4C12-A803-9D3F56D6BCD0.jpg?v=1779240062"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/A63DEAC9-D715-4B5B-B46F-38BE11B3CD9F.png?v=1779240063"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 56, 'https://www.lifeatelie.com.br/products/bolsa-luiza-nude-fendi'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-luiza-nude-fendi');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Luiza - Azul Marinho', 'Luiza', 'BLLZ09', 509.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Luiza traduz o minimalismo contemporâneo em uma peça marcante e sofisticada. Seu design moderno com detalhes em alto-relevo e acabamento lateral exclusivo valoriza o couro legítimo e confere personalidade à bolsa, tornando-a única e atemporal.

Estruturada e espaçosa na medida certa, é ideal para acompanhar a rotina com organização e elegância.

Possui duas alças fixas de mão, que proporcionam um visual elegante e estruturado, além de alça tiracolo regulável para maior conforto e versatilidade no uso diário.

Seu interior forrado oferece praticidade com bolso interno funcional para pequenos objetos. O fechamento principal em zíper de metal com puxador em couro garante segurança e acabamento refinado.

Uma bolsa pensada para mulheres que valorizam presença, qualidade e design sofisticado.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 18 cm
Comprimento: 34 cm
Profundidade: 16 cm
Peso: 900 g', 'Couro legítimo de alta qualidade
Detalhes em alto-relevo em couro
Acabamento lateral exclusivo
Forro interno
Bolso interno funcional
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/46E81055-0E6B-4A6F-A9E8-92856F846E4A.jpg?v=1779240137"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/0EC607A6-FDE8-4BE0-B45F-1C3EB8C02A13.jpg?v=1779240137"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2FE01CA9-6842-472B-9502-A8C2D64AF975.jpg?v=1779240137"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/0688FC33-33F4-4E6B-8F6B-9264DD62AF20.jpg?v=1779240137"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/11F086C0-98BE-4B44-AA89-4752F5A2AACE.jpg?v=1779240137"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D746BB6A-A12F-4B85-8F6E-9473727564E9.png?v=1779240137"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 57, 'https://www.lifeatelie.com.br/products/bolsa-luiza-azul-marinho'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-luiza-azul-marinho');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Luiza - Café & Preta', 'Luiza', 'BLLZ0301', 509.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Luiza traduz o minimalismo contemporâneo em uma peça marcante e sofisticada. Seu design moderno com detalhes em alto-relevo e acabamento lateral exclusivo valoriza o couro legítimo e confere personalidade à bolsa, tornando-a única e atemporal.

Estruturada e espaçosa na medida certa, é ideal para acompanhar a rotina com organização e elegância.

Possui duas alças fixas de mão, que proporcionam um visual elegante e estruturado, além de alça tiracolo regulável para maior conforto e versatilidade no uso diário.

Seu interior forrado oferece praticidade com bolso interno funcional para pequenos objetos. O fechamento principal em zíper de metal com puxador em couro garante segurança e acabamento refinado.

Uma bolsa pensada para mulheres que valorizam presença, qualidade e design sofisticado.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 18 cm
Comprimento: 34 cm
Profundidade: 16 cm
Peso: 900 g', 'Couro legítimo de alta qualidade
Detalhes em alto-relevo em couro
Acabamento lateral exclusivo
Forro interno
Bolso interno funcional
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/27DCA502-BDE3-4117-92D0-D90616D59987.jpg?v=1779240237"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BA298648-D15F-4FB9-B9B4-F9E5EC421213.jpg?v=1779240237"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/8A47C857-D071-40A4-A486-BC41DD7C8A38.jpg?v=1779240237"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9F8BF4AE-5ECD-400A-B8BD-DFB792176987.jpg?v=1779240237"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D746BB6A-A12F-4B85-8F6E-9473727564E9.png?v=1779240137"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 58, 'https://www.lifeatelie.com.br/products/bolsa-luiza-cafe-preta'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-luiza-cafe-preta');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Luiza - Preta', 'Luiza', 'BLLZ01', 509.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Luiza traduz o minimalismo contemporâneo em uma peça marcante e sofisticada. Seu design moderno com detalhes em alto-relevo e acabamento lateral exclusivo valoriza o couro legítimo e confere personalidade à bolsa, tornando-a única e atemporal.

Estruturada e espaçosa na medida certa, é ideal para acompanhar a rotina com organização e elegância.

Possui duas alças fixas de mão, que proporcionam um visual elegante e estruturado, além de alça tiracolo regulável para maior conforto e versatilidade no uso diário.

Seu interior forrado oferece praticidade com bolso interno funcional para pequenos objetos. O fechamento principal em zíper de metal com puxador em couro garante segurança e acabamento refinado.

Uma bolsa pensada para mulheres que valorizam presença, qualidade e design sofisticado.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 18 cm
Comprimento: 34 cm
Profundidade: 16 cm
Peso: 900 g', 'Couro legítimo de alta qualidade
Detalhes em alto-relevo em couro
Acabamento lateral exclusivo
Forro interno
Bolso interno funcional
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/59AE2466-9AFF-47CA-9C02-9F152F8B81C5.jpg?v=1779240332"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/21C5C9A1-150C-4012-BC9E-EB11564826FA.jpg?v=1779240332"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E28EA193-2693-4784-80D2-F6E0BC4E211F.jpg?v=1779240331"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/5F812DC9-B617-4D93-A4BE-26E01AE19574.jpg?v=1779240332"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D746BB6A-A12F-4B85-8F6E-9473727564E9.png?v=1779240137"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 59, 'https://www.lifeatelie.com.br/products/bolsa-luiza-preta'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-luiza-preta');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Mochila Vic - Fendi', 'Mochilas', null, 599.90, null,
  'Essencial, elegante e atemporal.

A Mochila Vic combina sofisticação e funcionalidade em um design moderno confeccionado em couro legítimo com acabamento em matelassê. Pensada para a rotina dinâmica, oferece espaço e organização sem abrir a mão do estilo.

Estruturada e versátil, conta com alças acolchoadas que garantem conforto mesmo no uso prolongado, além de alça de mão prática para diferentes benefícios.

Seu interior forrado oferece excelente organização, com bolso interno funcional e amplo espaço compatível com notebook de até 15,5 polegadas. Possui ainda bolso externo traseiro discreto e bolso frontal com zíper de metal, que oferece praticidade e charme ao design.

Uma peça ideal para mulheres que valorizam presença, qualidade e praticidade no dia a dia.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 37 cm
Largura: 30 cm
Profundidade: 13 cm
Peso: 900 g', 'Couro legítimo de alta qualidade
Acabamento em matelassê
Compartimento interno forrado
Bolso interno funcional
Bolso externo traseiro
Bolso frontal com zíper de metal
Espaço compatível com notebook até 15,5”
Zíper de metal com puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/162AE5DA-2325-427C-9A10-316B029714A1.png?v=1790551367"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9B4F7071-87BE-4498-9E33-97126683696A.jpg?v=1790551367"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/0B410989-379F-4E73-8039-7632087EA2A1.jpg?v=1790551366"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F6C9B87C-3A17-4859-A682-17F7386D3133.png?v=1790551404"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/61B745C0-9024-44CF-B2FE-F433F4F339BA.jpg?v=1790551367"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/68097D67-1C9A-49BC-88A3-E53563FE744C.jpg?v=1777308659"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 60, 'https://www.lifeatelie.com.br/products/mochila-vic-fendi'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/mochila-vic-fendi');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Helena G - Vermelho Carmim', 'Helena', 'BLHG05', 529.90, null,
  'A Bolsa Helena G tem aquele caimento macio e elegante que acompanha o corpo. O couro legítimo e a alça trançada dão personalidade à peça, enquanto o tamanho grande traz praticidade para o dia a dia.

Como usar
Use no ombro e deixe a bolsa acompanhar o movimento do corpo. Combina facilmente com produções casuais, jeans, alfaiataria ou um look mais arrumado.

Espaço interno
Tamanho grande, ideal para levar seus itens essenciais com conforto. Possui fechamento em zíper e 1 bolso interno com zíper para manter pequenos objetos organizados.

Ocasiões
Perfeita para o dia a dia, trabalho, almoço, passeios e viagens. Uma bolsa para usar muito, sem perder a elegância.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com textura e marcas naturais que tornam cada peça única. Com o uso, o couro ganha ainda mais personalidade.', 'Altura: 32 cm
Largura: 45 cm
Profundidade: 14 cm
Alça de ombro: 50 cm
Peso: 800 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/8664EC3A-B546-4FAE-ADB8-9C75E1AFA12B.jpg?v=1790118864"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9AAAC769-9CF8-4C62-8F48-78CD4026DD5E.jpg?v=1790118864"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/47859F84-C455-41B9-BA5D-D347BF73975C.jpg?v=1790540956"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9617.jpg?v=1790540889"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-4491.jpg?v=1776806962"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1B2E3959-F1FE-454A-BC76-E50FE002ABB6.png?v=1777308660"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 61, 'https://www.lifeatelie.com.br/products/bolsa-helena-g-vermelhocarmim'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-helena-g-vermelhocarmim');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sara G - Preto', 'Sara', 'BLSG01', 439.90, null,
  'A bolsa Sara G combina o couro legítimo com o acabamento matelassê em um design elegante e marcante. Uma bolsa estruturada, prática e fácil de levar para diferentes momentos.

Como usar
Use no ombro ou na transversal. A alça é ajustável e removível, permitindo adaptar a bolsa ao seu estilo e à ocasião.

Espaço interno
Possui duas divisões internas, bolso interno com zíper e bolso frontal, facilitando a organização dos seus itens no dia a dia.

Ocasiões
Perfeita para trabalho, compromissos, almoços, passeios e viagens. Uma peça que acompanha tanto produções casuais quanto looks mais sofisticados.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com acabamento matelassê e detalhes cuidadosamente trabalhados. As variações naturais do couro fazem parte da identidade de cada peça.', 'Altura: 18 cm
Largura: 28 cm
Profundidade: 13 cm
Peso: 500 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/59ECADAC-691D-4E7A-BEC6-05572F90C560.jpg?v=1790645117"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9DDC22B4-E80A-4268-AFA4-23B35DA9EF8B.jpg?v=1790645117"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9AE95BF0-6F8D-4F02-A8D7-44505D42B60E.jpg?v=1790645117"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/416794A8-DE93-45EE-BAA8-9A91F27BA331.jpg?v=1790645117"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6482.png?v=1780190101"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 62, 'https://www.lifeatelie.com.br/products/bolsa-sara-g-preto'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sara-g-preto');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sara G - Café', 'Sara', 'BLSG03', 439.90, null,
  'A bolsa Sara G combina o couro legítimo com o acabamento matelassê em um design elegante e marcante. Uma bolsa estruturada, prática e fácil de levar para diferentes momentos.

Como usar
Use no ombro ou na transversal. A alça é ajustável e removível, permitindo adaptar a bolsa ao seu estilo e à ocasião.

Espaço interno
Possui duas divisões internas, bolso interno com zíper e bolso frontal, facilitando a organização dos seus itens no dia a dia.

Ocasiões
Perfeita para trabalho, compromissos, almoços, passeios e viagens. Uma peça que acompanha tanto produções casuais quanto looks mais sofisticados.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com acabamento matelassê e detalhes cuidadosamente trabalhados. As variações naturais do couro fazem parte da identidade de cada peça.', 'Altura: 18 cm
Largura: 28 cm
Profundidade: 13 cm
Peso: 500 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/59E0E3E6-4E71-4C5C-874B-D775B6A9AAB1.jpg?v=1790645933"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9E085EDC-B988-4265-AB3B-BA9BC06A90E4.jpg?v=1790645933"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/818576AC-026B-4BE9-9C88-3C745FBF50D8.jpg?v=1790645933"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2C3A5D7F-54F5-4136-8BA7-5C0B4D5E6D29.jpg?v=1790645933"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/DD79F844-36FB-4CAD-ADD4-AD676FE0D838.jpg?v=1776814281"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6482.png?v=1780190101"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 63, 'https://www.lifeatelie.com.br/products/bolsa-sara-g-cafe'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sara-g-cafe');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sara G - Azul Marinho', 'Sara', 'BLSG09', 439.90, null,
  'A bolsa Sara G combina o couro legítimo com o acabamento matelassê em um design elegante e marcante. Uma bolsa estruturada, prática e fácil de levar para diferentes momentos.

Como usar
Use no ombro ou na transversal. A alça é ajustável e removível, permitindo adaptar a bolsa ao seu estilo e à ocasião.

Espaço interno
Possui duas divisões internas, bolso interno com zíper e bolso frontal, facilitando a organização dos seus itens no dia a dia.

Ocasiões
Perfeita para trabalho, compromissos, almoços, passeios e viagens. Uma peça que acompanha tanto produções casuais quanto looks mais sofisticados.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com acabamento matelassê e detalhes cuidadosamente trabalhados. As variações naturais do couro fazem parte da identidade de cada peça.', 'Altura: 18 cm
Largura: 28 cm
Profundidade: 13 cm
Peso: 500 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/5F47ACF9-5F24-4185-AF32-30B63026D46E.jpg?v=1790645774"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/48481B04-B7CD-46C5-83F9-3FFC62E8120B.jpg?v=1790645774"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/612A8689-343F-40B0-8839-3062DE477411.jpg?v=1790645774"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/EC615759-311C-4025-B972-EB700500C0A5.jpg?v=1776814367"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9DA39E0A-D710-40E0-8E36-63D0F4330502.jpg?v=1790645774"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6482.png?v=1780190101"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 64, 'https://www.lifeatelie.com.br/products/bolsa-sara-g-azul-marinho'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sara-g-azul-marinho');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sara G - Off White & Sela', 'Sara', 'BLSG0204', 439.90, null,
  'A bolsa Sara G combina o couro legítimo com o acabamento matelassê em um design elegante e marcante. Uma bolsa estruturada, prática e fácil de levar para diferentes momentos.

Como usar
Use no ombro ou na transversal. A alça é ajustável e removível, permitindo adaptar a bolsa ao seu estilo e à ocasião.

Espaço interno
Possui duas divisões internas, bolso interno com zíper e bolso frontal, facilitando a organização dos seus itens no dia a dia.

Ocasiões
Perfeita para trabalho, compromissos, almoços, passeios e viagens. Uma peça que acompanha tanto produções casuais quanto looks mais sofisticados.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com acabamento matelassê e detalhes cuidadosamente trabalhados. As variações naturais do couro fazem parte da identidade de cada peça.', 'Altura: 18 cm
Largura: 28 cm
Profundidade: 13 cm
Peso: 500 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/54617959-45C0-434C-AD44-9C8AC07EE72F.jpg?v=1790646056"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/6423EE96-84A8-4D1C-BA39-1EEDAD67C9DA.jpg?v=1790646056"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1947E5F2-9879-4DE6-9584-1273B4541A88.jpg?v=1790646056"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D8ABF5A9-FED9-4FF1-AA89-1383C96789A6.jpg?v=1790646056"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/7551F227-15DB-4074-8C8E-02337F99B2AB.jpg?v=1776814240"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6482.png?v=1780190101"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 65, 'https://www.lifeatelie.com.br/products/bolsa-sara-g-off-white-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sara-g-off-white-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sara G - Verde Militar', 'Sara', 'BLSG10', 439.90, null,
  'A bolsa Sara G combina o couro legítimo com o acabamento matelassê em um design elegante e marcante. Uma bolsa estruturada, prática e fácil de levar para diferentes momentos.

Como usar
Use no ombro ou na transversal. A alça é ajustável e removível, permitindo adaptar a bolsa ao seu estilo e à ocasião.

Espaço interno
Possui duas divisões internas, bolso interno com zíper e bolso frontal, facilitando a organização dos seus itens no dia a dia.

Ocasiões
Perfeita para trabalho, compromissos, almoços, passeios e viagens. Uma peça que acompanha tanto produções casuais quanto looks mais sofisticados.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com acabamento matelassê e detalhes cuidadosamente trabalhados. As variações naturais do couro fazem parte da identidade de cada peça.', 'Altura: 18 cm
Largura: 28 cm
Profundidade: 13 cm
Peso: 500 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/WhatsApp_Image_2026-05-26_at_14.45.57.jpg?v=1779817570"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/59404767-3EAA-4CD7-A2C7-0531299C5126.jpg?v=1790645632"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/21A923F1-377E-4552-B742-860A6C8FD174.jpg?v=1790645632"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/DD5B1714-EEB0-42DE-B45F-B6D47BA4D345.jpg?v=1790645632"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/6B64F73E-84ED-4FF8-9306-1FAC928A83B4.jpg?v=1790645632"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6482.png?v=1780190101"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 66, 'https://www.lifeatelie.com.br/products/bolsa-sara-g-verde-militar'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sara-g-verde-militar');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Luana - Preta', 'Luana', 'BLLN01', 519.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Luana é espaçosa e sofisticada, pensada para acompanhar a rotina com funcionalidade. Seu acabamento em matelassê valoriza o couro legítima e acrescenta um toque de sofisticação atemporal ao design.

Estruturada e versátil, possui duas alças de mão fixas que garantem um visual clássico e refinado, além de alça tiracolo regulável que proporciona conforto e praticidade no dia a dia.

Seu interior forrado oferece organização eficiente, com bolso interno funcional para pequenos objetos. Conta ainda com bolso externo prático para itens de fácil acesso e fechamento principal em zíper de metal com puxador em couro, garantindo segurança e acabamento impecável.

Uma peça ideal para mulheres que valorizam espaço, qualidade e presença marcante.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 22 cm
Comprimento: 29 cm
Profundidade: 22 cm
Peso: 900 g', 'Couro legítimo de alta qualidade
Acabamento em matelassê
Forro interno vermelho
Bolso interno funcional
Bolso externo
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/316D311A-DE6A-49B0-9C04-6C50F8202035.jpg?v=1779241654"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/92EA10D9-337B-427B-9FC7-1EC9C2DDC55A.jpg?v=1779241654"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/54135059-B0F3-42A7-A030-A4B7CC69E9E1.jpg?v=1779241654"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/826F05EA-C7C4-49E9-A515-C39668678629.jpg?v=1773519405"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/4AA5F7CB-74E3-4326-A402-15053EA3AB91.jpg?v=1773519405"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/85C27CB6-477F-4FE6-8A70-D5B01708D5FD.jpg?v=1773519405"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B3EBA113-F872-42A4-A348-4B90664ECD2F.png?v=1779241330"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 67, 'https://www.lifeatelie.com.br/products/bolsa-luana-preta'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-luana-preta');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Luana - Azul Marinho', 'Luana', 'BLLN09', 519.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Luana é espaçosa e sofisticada, pensada para acompanhar a rotina com funcionalidade. Seu acabamento em matelassê valoriza o couro legítima e acrescenta um toque de sofisticação atemporal ao design.

Estruturada e versátil, possui duas alças de mão fixas que garantem um visual clássico e refinado, além de alça tiracolo regulável que proporciona conforto e praticidade no dia a dia.

Seu interior forrado oferece organização eficiente, com bolso interno funcional para pequenos objetos. Conta ainda com bolso externo prático para itens de fácil acesso e fechamento principal em zíper de metal com puxador em couro, garantindo segurança e acabamento impecável.

Uma peça ideal para mulheres que valorizam espaço, qualidade e presença marcante.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 22 cm
Comprimento: 29 cm
Profundidade: 22 cm
Peso: 900 g', 'Couro legítimo de alta qualidade
Acabamento em matelassê
Forro interno vermelho
Bolso interno funcional
Bolso externo
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/WhatsApp_Image_2026-05-26_at_14.45.57_1.jpg?v=1779817585"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BB53EFCD-819B-41F1-92C1-1991B48AD624.jpg?v=1779241654"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B528B8D7-3FBE-4C7F-BED2-2E49DC877413.jpg?v=1779241654"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/043BE06B-B7D8-481C-B4E2-A69215FA24A4.jpg?v=1779241654"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/661CDB7B-F8F8-43D8-8FBB-C1BB3A91FD87.jpg?v=1773519106"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/CAE6C219-49AA-4013-9864-4568EE6A9404.jpg?v=1773519106"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2847F6E3-296D-49B2-B018-EA44BCD7BBF8.jpg?v=1773519106"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B3EBA113-F872-42A4-A348-4B90664ECD2F.png?v=1779241330"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 68, 'https://www.lifeatelie.com.br/products/bolsa-luana-azul-marinho'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-luana-azul-marinho');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Luana - Vermelho Cereja', 'Luana', 'BLLN05', 519.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Luana é espaçosa e sofisticada, pensada para acompanhar a rotina com funcionalidade. Seu acabamento em matelassê valoriza o couro legítima e acrescenta um toque de sofisticação atemporal ao design.

Estruturada e versátil, possui duas alças de mão fixas que garantem um visual clássico e refinado, além de alça tiracolo regulável que proporciona conforto e praticidade no dia a dia.

Seu interior forrado oferece organização eficiente, com bolso interno funcional para pequenos objetos. Conta ainda com bolso externo prático para itens de fácil acesso e fechamento principal em zíper de metal com puxador em couro, garantindo segurança e acabamento impecável.

Uma peça ideal para mulheres que valorizam espaço, qualidade e presença marcante.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 22 cm
Comprimento: 29 cm
Profundidade: 22 cm
Peso: 900 g', 'Couro legítimo de alta qualidade
Acabamento em matelassê
Forro interno vermelho
Bolso interno funcional
Bolso externo
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2F1ED145-1EDB-4F43-83EA-CE7667745A38.jpg?v=1779241654"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/A8EFDC19-127A-4A5C-A78E-C41D9C7E31B0.jpg?v=1779241654"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B0876AAF-6588-4F86-8D50-4D3A5F001EF8.jpg?v=1779241655"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B3EBA113-F872-42A4-A348-4B90664ECD2F.png?v=1779241330"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BBF2A4A6-6C91-429A-AC88-E3EC85687D6B.jpg?v=1773519252"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 69, 'https://www.lifeatelie.com.br/products/bolsa-luana-vermelho-cereja'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-luana-vermelho-cereja');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Luana - Verde Militar', 'Luana', 'BLLN10', 519.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Luana é espaçosa e sofisticada, pensada para acompanhar a rotina com funcionalidade. Seu acabamento em matelassê valoriza o couro legítima e acrescenta um toque de sofisticação atemporal ao design.

Estruturada e versátil, possui duas alças de mão fixas que garantem um visual clássico e refinado, além de alça tiracolo regulável que proporciona conforto e praticidade no dia a dia.

Seu interior forrado oferece organização eficiente, com bolso interno funcional para pequenos objetos. Conta ainda com bolso externo prático para itens de fácil acesso e fechamento principal em zíper de metal com puxador em couro, garantindo segurança e acabamento impecável.

Uma peça ideal para mulheres que valorizam espaço, qualidade e presença marcante.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 22 cm
Comprimento: 29 cm
Profundidade: 22 cm
Peso: 900 g', 'Couro legítimo de alta qualidade
Acabamento em matelassê
Forro interno vermelho
Bolso interno funcional
Bolso externo
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/DAA90265-BE5F-4ADC-A98D-0767CF619F16.jpg?v=1779241654"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/27E020EB-C8F3-48A8-8446-E7BDA6515C02.jpg?v=1779241654"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/52B5D6AD-0D1D-407B-9B3C-A78D7CD0F30E.jpg?v=1779241654"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/4ED52D47-DAB0-4733-95C5-0AB9BC3ABF33.jpg?v=1773519153"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BEADF126-5D6E-4D31-91E9-86A6E63B3AB2.jpg?v=1773519153"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D8D54627-782E-40E3-9322-1D7C88E75732.jpg?v=1773519160"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B3EBA113-F872-42A4-A348-4B90664ECD2F.png?v=1779241330"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 70, 'https://www.lifeatelie.com.br/products/bolsa-luana-verde-militar'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-luana-verde-militar');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Lorena - Off White & Sela', 'Lorena', 'LORENA-OFFSELA', 389.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Lorena é estilo tote pensada para acompanhar a mulher em todos os momentos do dia. Espaçosa e funcional, oferece estrutura e sofisticação para quem precisa de praticidade sem abrir mão da moda.

Com design amplo, acomoda com facilidade itens essenciais, notebook e objetos de uso diário, tornando-se ideal para trabalho, estudos ou compromissos diários.

Possui duas alças fixas de ombro, reforçadas e resistentes, que garantem conforto e segurança no uso. Seu interior forrado conta com bolso interno funcional para pequenos objetos, além de bolso externo prático para itens de acesso rápido. O fechamento em zíper de metal com puxador em couro assegura proteção e acabamento refinado.

Uma peça versátil, feita para mulheres que valorizam espaço, qualidade e design atemporal.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 30 cm
Largura: 44 cm
Profundidade: 12 cm
Peso: 700 g', 'Couro legítimo de alta qualidade
Forro interno vermelho
Bolso interno funcional
Bolso externo com zíper
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/17FA559F-4ADC-4C7B-9369-778F871A5F19.jpg?v=1771861960"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/02A412D4-52E9-4B17-8C02-BB141388DE01.jpg?v=1771861960"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/5968A4BE-CDE1-4866-9A9C-C1EAF13B7F4E.jpg?v=1771861960"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/CAD0331B-A580-43C0-8772-7C81AE532333.jpg?v=1771861960"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 71, 'https://www.lifeatelie.com.br/products/bolsa-lorena-off-white-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-lorena-off-white-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Lorena - Preta', 'Lorena', 'LORENA-PRETA', 389.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Lorena é estilo tote pensada para acompanhar a mulher em todos os momentos do dia. Espaçosa e funcional, oferece estrutura e sofisticação para quem precisa de praticidade sem abrir mão da moda.

Com design amplo, acomoda com facilidade itens essenciais, notebook e objetos de uso diário, tornando-se ideal para trabalho, estudos ou compromissos diários.

Possui duas alças fixas de ombro, reforçadas e resistentes, que garantem conforto e segurança no uso. Seu interior forrado conta com bolso interno funcional para pequenos objetos, além de bolso externo prático para itens de acesso rápido. O fechamento em zíper de metal com puxador em couro assegura proteção e acabamento refinado.

Uma peça versátil, feita para mulheres que valorizam espaço, qualidade e design atemporal.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 30 cm
Largura: 44 cm
Profundidade: 12 cm
Peso: 700 g', 'Couro legítimo de alta qualidade
Forro interno vermelho
Bolso interno funcional
Bolso externo com zíper
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/81F58928-50B4-45EC-927E-F30652EFE768.jpg?v=1771861906"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/71804A25-B478-4A0A-9B22-9069FD3C5C82.jpg?v=1771861906"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2CC05407-B8D4-475C-825A-63DC39684708.jpg?v=1771861906"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/0FEF8A01-A2E3-4223-85E6-78140E7EB46F.jpg?v=1771861906"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 72, 'https://www.lifeatelie.com.br/products/bolsa-lorena-preta'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-lorena-preta');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Lorena - Café', 'Lorena', 'LORENA-CAFE', 389.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Lorena é estilo tote pensada para acompanhar a mulher em todos os momentos do dia. Espaçosa e funcional, oferece estrutura e sofisticação para quem precisa de praticidade sem abrir mão da moda.

Com design amplo, acomoda com facilidade itens essenciais, notebook e objetos de uso diário, tornando-se ideal para trabalho, estudos ou compromissos diários.

Possui duas alças fixas de ombro, reforçadas e resistentes, que garantem conforto e segurança no uso. Seu interior forrado conta com bolso interno funcional para pequenos objetos, além de bolso externo prático para itens de acesso rápido. O fechamento em zíper de metal com puxador em couro assegura proteção e acabamento refinado.

Uma peça versátil, feita para mulheres que valorizam espaço, qualidade e design atemporal.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 30 cm
Largura: 44 cm
Profundidade: 12 cm
Peso: 700 g', 'Couro legítimo de alta qualidade
Forro interno vermelho
Bolso interno funcional
Bolso externo com zíper
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F1C8025B-5943-4D2B-8783-414FD567D420.jpg?v=1771861852"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E320F430-38C2-4539-84DC-28DE2569AF19.jpg?v=1771861852"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/4CA2E8C2-098D-4575-9804-A73DA60417DB.jpg?v=1771861852"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/3082330F-935D-46AF-8413-0BEDDC21C2AD.jpg?v=1771861854"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 73, 'https://www.lifeatelie.com.br/products/bolsa-lorena-cafe'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-lorena-cafe');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Lorena - Azul Marinho', 'Lorena', 'LORENA-MARINHO', 389.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Lorena é estilo tote pensada para acompanhar a mulher em todos os momentos do dia. Espaçosa e funcional, oferece estrutura e sofisticação para quem precisa de praticidade sem abrir mão da moda.

Com design amplo, acomoda com facilidade itens essenciais, notebook e objetos de uso diário, tornando-se ideal para trabalho, estudos ou compromissos diários.

Possui duas alças fixas de ombro, reforçadas e resistentes, que garantem conforto e segurança no uso. Seu interior forrado conta com bolso interno funcional para pequenos objetos, além de bolso externo prático para itens de acesso rápido. O fechamento em zíper de metal com puxador em couro assegura proteção e acabamento refinado.

Uma peça versátil, feita para mulheres que valorizam espaço, qualidade e design atemporal.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 30 cm
Largura: 44 cm
Profundidade: 12 cm
Peso: 700 g', 'Couro legítimo de alta qualidade
Forro interno vermelho
Bolso interno funcional
Bolso externo com zíper
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/66896928-13E5-4A78-878B-BF0534A0A6DC.jpg?v=1771862011"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/0B8DE51B-CC94-41B5-A833-255732C21405.jpg?v=1771862010"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/5C4EAD9C-D0CE-4B9B-85D0-323D796B3DC6.jpg?v=1771862010"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/49D49B24-54A5-4E38-A43B-D126AD554A15.jpg?v=1771862011"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/7D39EDA0-9732-434A-A7C4-7698C02839DC.jpg?v=1771862011"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 74, 'https://www.lifeatelie.com.br/products/bolsa-lorena-azul-marinho'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-lorena-azul-marinho');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Lorena - Verde Militar', 'Lorena', 'LORENA-MILITAR', 389.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Lorena é estilo tote pensada para acompanhar a mulher em todos os momentos do dia. Espaçosa e funcional, oferece estrutura e sofisticação para quem precisa de praticidade sem abrir mão da moda.

Com design amplo, acomoda com facilidade itens essenciais, notebook e objetos de uso diário, tornando-se ideal para trabalho, estudos ou compromissos diários.

Possui duas alças fixas de ombro, reforçadas e resistentes, que garantem conforto e segurança no uso. Seu interior forrado conta com bolso interno funcional para pequenos objetos, além de bolso externo prático para itens de acesso rápido. O fechamento em zíper de metal com puxador em couro assegura proteção e acabamento refinado.

Uma peça versátil, feita para mulheres que valorizam espaço, qualidade e design atemporal.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 30 cm
Largura: 44 cm
Profundidade: 12 cm
Peso: 700 g', 'Couro legítimo de alta qualidade
Forro interno vermelho
Bolso interno funcional
Bolso externo com zíper
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/4CAB96E2-7E89-4AEC-9FF4-CC878C6A76A7.jpg?v=1771862400"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D730AF6F-3424-4B63-A92B-CCB779F62007.jpg?v=1771862400"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/24518B3C-C3F8-438B-BB14-FD5427D68ADD.jpg?v=1771862411"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/49014053-F6DA-4EDF-AECC-B192169CC726.jpg?v=1771862400"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 75, 'https://www.lifeatelie.com.br/products/bolsa-lorena-verde-militar'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-lorena-verde-militar');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Isis P - Off White', 'Isis', 'ISIS-P-OFF', 249.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Isis P é a versão compacta de um clássico do Life Ateliê. Delicada na proporção e marcante nos detalhes, é ideal para quem busca praticidade sem abrir a mão da sofisticação.

Confeccionado em couro legítimo com acabamento em matelassê, traduzido moderno em cada detalhe. Perfeita para carregar apenas o essencial com charme e leveza, acompanhando momentos que pedem discrição e estilo.

Seu interior conta com divisão funcional e forro vermelho, que valoriza o acabamento e adiciona personalidade à peça. O fecho em zíper de metal com puxadores em couro garante segurança e acabamento refinado.

A alça tiracolo regulável proporciona conforto e elegância no uso diário.

Uma bolsa pensada para mulheres que apreciam minimalismo, qualidade e elegantes na medida certa.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 13 cm
Largura: 18 cm
Profundidade: 6 cm
Peso: 250 g', 'Couro legítimo de alta qualidade
Acabamento em matelassê
Forro interno vermelho
Divisão interna funcional
Fechamento em zíper de metal
Puxadores tassel em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F17FD49A-237F-4747-A534-F51241A63EC6.jpg?v=1771879951"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/29AAEAE5-ABA8-41D5-AA94-C0B5A0D3879E.jpg?v=1771879951"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/CEC8DEFF-9F4A-47D3-B3B7-28BD874CAAFD.jpg?v=1770831594"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 76, 'https://www.lifeatelie.com.br/products/bolsa-isis-p-off-white'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-isis-p-off-white');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Helena G - Preta', 'Helena', 'BLHG01', 529.90, null,
  'A Bolsa Helena G tem aquele caimento macio e elegante que acompanha o corpo. O couro legítimo e a alça trançada dão personalidade à peça, enquanto o tamanho grande traz praticidade para o dia a dia.

Como usar
Use no ombro e deixe a bolsa acompanhar o movimento do corpo. Combina facilmente com produções casuais, jeans, alfaiataria ou um look mais arrumado.

Espaço interno
Tamanho grande, ideal para levar seus itens essenciais com conforto. Possui fechamento em zíper e 1 bolso interno com zíper para manter pequenos objetos organizados.

Ocasiões
Perfeita para o dia a dia, trabalho, almoço, passeios e viagens. Uma bolsa para usar muito, sem perder a elegância.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com textura e marcas naturais que tornam cada peça única. Com o uso, o couro ganha ainda mais personalidade.', 'Altura: 32 cm
Largura: 45 cm
Profundidade: 14 cm
Alça de ombro: 50 cm
Peso: 800 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/AAF70712-E846-49B2-8686-2A28608AC08C.jpg?v=1790119079"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/7F6958B6-CD17-4007-AD0D-D988B48953DF.jpg?v=1790119078"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9614.jpg?v=1790541600"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B167A268-91F4-479E-804C-7960DDE4983B.jpg?v=1790541556"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/39607C4F-BEA3-4850-98A6-F64C05B38E95.jpg?v=1790541556"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1B2E3959-F1FE-454A-BC76-E50FE002ABB6.png?v=1777308660"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 77, 'https://www.lifeatelie.com.br/products/bolsa-helena-g-preta'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-helena-g-preta');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Helena G - Sela', 'Helena', 'BLHG04', 529.90, null,
  'A Bolsa Helena G tem aquele caimento macio e elegante que acompanha o corpo. O couro legítimo e a alça trançada dão personalidade à peça, enquanto o tamanho grande traz praticidade para o dia a dia.

Como usar
Use no ombro e deixe a bolsa acompanhar o movimento do corpo. Combina facilmente com produções casuais, jeans, alfaiataria ou um look mais arrumado.

Espaço interno
Tamanho grande, ideal para levar seus itens essenciais com conforto. Possui fechamento em zíper e 1 bolso interno com zíper para manter pequenos objetos organizados.

Ocasiões
Perfeita para o dia a dia, trabalho, almoço, passeios e viagens. Uma bolsa para usar muito, sem perder a elegância.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com textura e marcas naturais que tornam cada peça única. Com o uso, o couro ganha ainda mais personalidade.', 'Altura: 32 cm
Largura: 45 cm
Profundidade: 14 cm
Alça de ombro: 50 cm
Peso: 800 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/90AE9DEC-13D5-472A-8B5E-517E4394EB2B.jpg?v=1790541804"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/C1122C7B-B1F5-4154-8997-DF2F6057FD5D.jpg?v=1790541804"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/53DDFB44-BD2A-412B-9B39-1B8E5FD61D30.jpg?v=1790541824"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9618.jpg?v=1790541758"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/160AFD14-C3EC-420D-A558-9C5406D573E9.jpg?v=1790541824"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1B2E3959-F1FE-454A-BC76-E50FE002ABB6.png?v=1777308660"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 78, 'https://www.lifeatelie.com.br/products/bolsa-helena-g-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-helena-g-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Helena G - Jabuticaba', 'Helena', 'BLHG12', 529.90, null,
  'A Bolsa Helena G tem aquele caimento macio e elegante que acompanha o corpo. O couro legítimo e a alça trançada dão personalidade à peça, enquanto o tamanho grande traz praticidade para o dia a dia.

Como usar
Use no ombro e deixe a bolsa acompanhar o movimento do corpo. Combina facilmente com produções casuais, jeans, alfaiataria ou um look mais arrumado.

Espaço interno
Tamanho grande, ideal para levar seus itens essenciais com conforto. Possui fechamento em zíper e 1 bolso interno com zíper para manter pequenos objetos organizados.

Ocasiões
Perfeita para o dia a dia, trabalho, almoço, passeios e viagens. Uma bolsa para usar muito, sem perder a elegância.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com textura e marcas naturais que tornam cada peça única. Com o uso, o couro ganha ainda mais personalidade.', 'Altura: 32 cm
Largura: 45 cm
Profundidade: 14 cm
Alça de ombro: 50 cm
Peso: 800 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/258330D3-9892-47E9-A551-4542637B3D12.jpg?v=1790118934"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1F6EDB78-9F2D-400F-BC5E-008EDE5E2898.jpg?v=1790118934"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9616.jpg?v=1790541340"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/33F113FD-CD56-4A55-8DD5-C8A213F12921.jpg?v=1790541465"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-4487.jpg?v=1776807006"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1B2E3959-F1FE-454A-BC76-E50FE002ABB6.png?v=1777308660"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 79, 'https://www.lifeatelie.com.br/products/bolsa-helena-g-jabuticaba'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-helena-g-jabuticaba');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Clara - Preta', 'Clara', 'CLARA-PRETA', 299.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Clara une design moderno e praticidade em um formato bucket compacto, cheio de personalidade. Delicada na proporção e marcante nos detalhes, é a escolha ideal para acompanhar a rotina com leveza e estilo.

Seu fechamento em corda com ilhós adiciona um toque contemporâneo ao design, além de proporcionar praticidade no uso diário. A alça tiracolo regulável permite ajuste confortável, adaptando-se facilmente a diferentes momentos.

O interior totalmente forrado conta com bolso interno funcional para manter os itens essenciais organizados.

Uma bolsa pensada para mulheres que apreciam versatilidade, acabamento refinado e elegância descomplicada.

Exclusividade Life Ateliê.',
  'Couro legítimo premium', 'Altura: 21 cm
Largura: 26 cm
Profundidade: 10 cm
Peso: 450 g', 'Couro legítimo premium
Modelo bucket compacto
Forro interno
Bolso interno funcional
Fechamento em corda com ilhós
Alça tiracolo regulável
Ferragens douradas',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-1248.jpg?v=1769557322"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-1253.jpg?v=1769557322"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-1250.jpg?v=1769557322"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-1251.jpg?v=1769557295"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 80, 'https://www.lifeatelie.com.br/products/bolsa-clara-preta'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-clara-preta');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Clara - Café', 'Clara', 'CLARA-CAFE', 299.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Clara une design moderno e praticidade em um formato bucket compacto, cheio de personalidade. Delicada na proporção e marcante nos detalhes, é a escolha ideal para acompanhar a rotina com leveza e estilo.

Seu fechamento em corda com ilhós adiciona um toque contemporâneo ao design, além de proporcionar praticidade no uso diário. A alça tiracolo regulável permite ajuste confortável, adaptando-se facilmente a diferentes momentos.

O interior totalmente forrado conta com bolso interno funcional para manter os itens essenciais organizados.

Uma bolsa pensada para mulheres que apreciam versatilidade, acabamento refinado e elegância descomplicada.

Exclusividade Life Ateliê.',
  'Couro legítimo premium', 'Altura: 21 cm
Largura: 26 cm
Profundidade: 10 cm
Peso: 450 g', 'Couro legítimo premium
Modelo bucket compacto
Forro interno
Bolso interno funcional
Fechamento em corda com ilhós
Alça tiracolo regulável
Ferragens douradas',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/C0BC91B1-529D-4CFA-986F-391C3D402777.jpg?v=1769638056"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/08B8B9E1-8EAB-4343-8F14-7AF329A87B7C.jpg?v=1769638056"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-1292.jpg?v=1769638069"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 81, 'https://www.lifeatelie.com.br/products/bolsa-clara-cafe'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-clara-cafe');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Clara - Sela', 'Clara', 'CLARA-SELA', 299.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Clara une design moderno e praticidade em um formato bucket compacto, cheio de personalidade. Delicada na proporção e marcante nos detalhes, é a escolha ideal para acompanhar a rotina com leveza e estilo.

Seu fechamento em corda com ilhós adiciona um toque contemporâneo ao design, além de proporcionar praticidade no uso diário. A alça tiracolo regulável permite ajuste confortável, adaptando-se facilmente a diferentes momentos.

O interior totalmente forrado conta com bolso interno funcional para manter os itens essenciais organizados.

Uma bolsa pensada para mulheres que apreciam versatilidade, acabamento refinado e elegância descomplicada.

Exclusividade Life Ateliê.',
  'Couro legítimo premium', 'Altura: 21 cm
Largura: 26 cm
Profundidade: 10 cm
Peso: 450 g', 'Couro legítimo premium
Modelo bucket compacto
Forro interno
Bolso interno funcional
Fechamento em corda com ilhós
Alça tiracolo regulável
Ferragens douradas',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E4BF9E17-63B6-4216-989A-65EF6A7CB34B.jpg?v=1769642564"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/374AADC4-DC25-4238-AF1B-EADDB02454F4.jpg?v=1769642597"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/01304DC4-2736-4256-B53C-89A6E92A6531.jpg?v=1769642564"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 82, 'https://www.lifeatelie.com.br/products/bolsa-clara-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-clara-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Clara - Vermelho Cereja', 'Clara', 'CLARA-VERMELHO', 299.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Clara tem design moderno e praticidade em um formato bucket, cheio de personalidade. Delicada na proporção e marcante nos detalhes, é a escolha ideal para acompanhar seu passeio .

Seu fechamento em corda com ilhas adiciona um toque contemporâneo ao design, além de proporcionar praticidade no uso diário. A alça tiracolo regulável permite um ajuste confortável, adaptando-se facilmente a diferentes momentos.

O interior totalmente forrado conta com bolso interno funcional para manter os itens essenciais organizados.

Uma bolsa pensada para mulheres que apreciam detalhes sofisticados, refinados e elegantes descomplicados.

Exclusividade Life Ateliê.',
  'Couro legítimo', 'Altura: 21 cm
Largura: 26 cm
Profundidade: 10 cm
Peso: 450 g', 'Couro legítimo
Forro interno vermelho
Bolso interno com zíper
Fechamento em corda com ilhós
Alça tiracolo regulável
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/5CDCB852-EA17-4D19-955A-E8296647ECC8.jpg?v=1769636206"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/879F0FA2-D63E-42A2-BE23-A2CAF0027A7E.jpg?v=1769636206"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/5556DFD4-F6B9-4044-9617-9D9451EF9B93.jpg?v=1769636206"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/A549C6F9-9601-4BDE-9186-9A4B147B6810.jpg?v=1769636206"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 83, 'https://www.lifeatelie.com.br/products/bolsa-clara-vermelho-cereja'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-clara-vermelho-cereja');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Clara - Verde Militar', 'Clara', 'CLARA-MILITAR', 299.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Clara tem design moderno e praticidade em um formato bucket, cheio de personalidade. Delicada na proporção e marcante nos detalhes, é a escolha ideal para acompanhar seu passeio .

Seu fechamento em corda com ilhas adiciona um toque contemporâneo ao design, além de proporcionar praticidade no uso diário. A alça tiracolo regulável permite um ajuste confortável, adaptando-se facilmente a diferentes momentos.

O interior totalmente forrado conta com bolso interno funcional para manter os itens essenciais organizados.

Uma bolsa pensada para mulheres que apreciam detalhes sofisticados, refinados e elegantes descomplicados.

Exclusividade Life Ateliê.',
  'Couro legítimo', 'Altura: 21 cm
Largura: 26 cm
Profundidade: 10 cm
Peso: 450 g', 'Couro legítimo
Forro interno vermelho
Bolso interno com zíper
Fechamento em corda com ilhós
Alça tiracolo regulável
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-1295.jpg?v=1769639013"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-1294.jpg?v=1769639013"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-1296.jpg?v=1769639013"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 84, 'https://www.lifeatelie.com.br/products/bolsa-clara-verde-militar'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-clara-verde-militar');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Clara - Azul Marinho', 'Clara', 'CLARA-MARINHO', 299.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Clara une design moderno e praticidade em um formato bucket compacto, cheio de personalidade. Delicada na proporção e marcante nos detalhes, é a escolha ideal para acompanhar a rotina com leveza e estilo.

Seu fechamento em corda com ilhós adiciona um toque contemporâneo ao design, além de proporcionar praticidade no uso diário. A alça tiracolo regulável permite ajuste confortável, adaptando-se facilmente a diferentes momentos.

O interior totalmente forrado conta com bolso interno funcional para manter os itens essenciais organizados.

Uma bolsa pensada para mulheres que apreciam versatilidade, acabamento refinado e elegância descomplicada.

Exclusividade Life Ateliê.',
  'Couro legítimo premium', 'Altura: 21 cm
Largura: 26 cm
Profundidade: 10 cm
Peso: 450 g', 'Couro legítimo premium
Modelo bucket compacto
Forro interno
Bolso interno funcional
Fechamento em corda com ilhós
Alça tiracolo regulável
Ferragens douradas',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/3B2B20F4-3A87-40FA-9DBE-919A0F96DD48.jpg?v=1769642463"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/ED825435-80E4-48F0-BC19-39FFCC5F8407.jpg?v=1769642463"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B59121E6-EF7F-46CC-BA76-F6789450C63B.jpg?v=1769642463"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 85, 'https://www.lifeatelie.com.br/products/bolsa-clara-azul-marinho'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-clara-azul-marinho');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Bianca - Off White & Sela', 'Bianca', 'BIANCA-OFFSELA', 479.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Bianca é a escolha ideal para quem busca sofisticação aliada à funcionalidade. Confeccionada em couro legítimo, apresenta um design moderno e estruturado que acompanha a rotina com praticidade e presença.

Versátil, possui duas alças fixas de ombro que garantem conforto e estabilidade no uso diário, além de alça tiracolo regulável para diferentes ocasiões.

Seu interior forrado oferece organização eficiente, com bolso interno funcional para pequenos objetos. Conta ainda com duas divisões externas com zíper de metal — incluindo bolso frontal que adiciona charme e modernidade ao design, mantendo seus itens sempre acessíveis.

Uma peça pensada para mulheres que valorizam qualidade, estrutura e acabamento impecável.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 22 cm
Largura: 28 cm
Profundidade: 15 cm
Peso: 800 g', 'Couro legítimo de alta qualidade
Forro interno
Bolso interno funcional
Duas divisões externas com zíper de metal
Bolso frontal externo
Zíper de metal com puxadores em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/CF9F6350-0D8E-4130-ABE7-EA248F99BB6C.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/6C0A0B74-3E6A-463E-998B-811C5E2B5FE9.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/A8FAF45C-89F9-4A02-94F7-C0D98136BDC4.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/7C23707A-385B-4C5B-BE97-0FDD73C2F4A8.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6567.png?v=1780370165"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 86, 'https://www.lifeatelie.com.br/products/bolsa-bianca-off-white-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-bianca-off-white-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Bianca - Preta', 'Bianca', 'BIANCA-PRETA', 479.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Bianca é a escolha ideal para quem busca sofisticação aliada à funcionalidade. Confeccionada em couro legítimo, apresenta um design moderno e estruturado que acompanha a rotina com praticidade e presença.

Versátil, possui duas alças fixas de ombro que garantem conforto e estabilidade no uso diário, além de alça tiracolo regulável para diferentes ocasiões.

Seu interior forrado oferece organização eficiente, com bolso interno funcional para pequenos objetos. Conta ainda com duas divisões externas com zíper de metal — incluindo bolso frontal que adiciona charme e modernidade ao design, mantendo seus itens sempre acessíveis.

Uma peça pensada para mulheres que valorizam qualidade, estrutura e acabamento impecável.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 22 cm
Largura: 28 cm
Profundidade: 15 cm
Peso: 800 g', 'Couro legítimo de alta qualidade
Forro interno
Bolso interno funcional
Duas divisões externas com zíper de metal
Bolso frontal externo
Zíper de metal com puxadores em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/43569531-FA3C-4FF5-A0A0-83513544B52B.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D530CCA8-5160-4C7B-BBC3-4B05241FC742.jpg?v=1780369984"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/7B081561-96FC-47B2-A9F6-785455766419.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/DCF61382-FA14-4418-A26B-01672BEC6C4E.jpg?v=1780369984"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6567.png?v=1780370165"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 87, 'https://www.lifeatelie.com.br/products/bolsa-bianca-preta'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-bianca-preta');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Bianca - Verde Militar', 'Bianca', 'BIANCA-MILITAR', 479.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Bianca é a escolha ideal para quem busca sofisticação aliada à funcionalidade. Confeccionada em couro legítimo, apresenta um design moderno e estruturado que acompanha a rotina com praticidade e presença.

Versátil, possui duas alças fixas de ombro que garantem conforto e estabilidade no uso diário, além de alça tiracolo regulável para diferentes ocasiões.

Seu interior forrado oferece organização eficiente, com bolso interno funcional para pequenos objetos. Conta ainda com duas divisões externas com zíper de metal — incluindo bolso frontal que adiciona charme e modernidade ao design, mantendo seus itens sempre acessíveis.

Uma peça pensada para mulheres que valorizam qualidade, estrutura e acabamento impecável.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 22 cm
Largura: 28 cm
Profundidade: 15 cm
Peso: 800 g', 'Couro legítimo de alta qualidade
Forro interno
Bolso interno funcional
Duas divisões externas com zíper de metal
Bolso frontal externo
Zíper de metal com puxadores em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/69D0C75F-5908-4330-B37F-91CE4A4E0712.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/70BFAC85-E904-4A95-9D3B-D2613245CA72.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D4405D71-E60F-4C26-B8BB-CF83B68E7C7A.jpg?v=1780369984"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2C3A0696-8B51-4152-BAC0-DD672714F7FB.jpg?v=1780369984"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6567.png?v=1780370165"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 88, 'https://www.lifeatelie.com.br/products/bolsa-bianca-verde-militar'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-bianca-verde-militar');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Bianca - Vermelho Cereja', 'Bianca', 'BIANCA-VERMELHA', 479.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Bianca é a escolha ideal para quem busca sofisticação aliada à funcionalidade. Confeccionado em couro legítimo, apresenta um design moderno e estruturado que acompanha a rotina com praticidade e presença.

Versátil, possui duas alças fixas de ombro que garantem conforto e estabilidade no uso diário, além de alça tiracolo regulável para diversos benefícios.

Seu interior forrado oferece organização eficiente, com bolso interno funcional para pequenos objetos. Conta ainda com duas divisões externas com zíper de metal — incluindo bolso frontal que adiciona charme e modernidade ao design, mantendo seus itens sempre acessíveis.

Uma peça pensada para mulheres que valorizam qualidade, estrutura e acabamento impecável.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 22 cm
Largura: 28 cm
Profundidade: 15 cm
Peso: 800 g', 'Couro legítimo de alta qualidade
Forro interno
Bolsa interna funcional
Duas divisões externas com zíper de metal
Bolso frontal externo
Zíper de metal com puxadores em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B034AE61-C56F-402F-8DF4-6DC58358DB4A.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/EDDF0ED4-5675-415C-93EF-A8E01ADD5627.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/202CA2D6-9307-4752-8B12-94A8A687852E.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/79E11FD1-5B95-425C-ABFC-ED8952B0B812.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/EA5BCE17-BA41-4D1F-907C-F01193E9FD54.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6567.png?v=1780370165"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 89, 'https://www.lifeatelie.com.br/products/bolsa-bianca-vermelho-cereja'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-bianca-vermelho-cereja');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Bianca - Azul Marinho', 'Bianca', 'BIANCA-MARINHO', 479.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Bianca é a escolha ideal para quem busca sofisticação aliada à funcionalidade. Confeccionado em couro legítimo, apresenta um design moderno e estruturado que acompanha a rotina com praticidade e presença.

Versátil, possui duas alças fixas de ombro que garantem conforto e estabilidade no uso diário, além de alça tiracolo regulável para diversos benefícios.

Seu interior forrado oferece organização eficiente, com bolso interno funcional para pequenos objetos. Conta ainda com duas divisões externas com zíper de metal — incluindo bolso frontal que adiciona charme e modernidade ao design, mantendo seus itens sempre acessíveis.

Uma peça pensada para mulheres que valorizam qualidade, estrutura e acabamento impecável.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 22 cm
Largura: 28 cm
Profundidade: 15 cm
Peso: 800 g', 'Couro legítimo de alta qualidade
Forro interno
Bolsa interna funcional
Duas divisões externas com zíper de metal
Bolso frontal externo
Zíper de metal com puxadores em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/8A3A6805-AE49-42C3-89B8-A2057A2137F4.jpg?v=1780369985"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/445BFB58-CCB6-4CAF-AAA4-D05453E11EF7.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/665480AE-511D-4AAC-BC65-FE2C86F264E8.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/DC2C55FA-EF6C-4BAD-AA48-D056FEA63282.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6567.png?v=1780370165"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 90, 'https://www.lifeatelie.com.br/products/bolsa-bianca-azul-marinho'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-bianca-azul-marinho');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Bianca - Café', 'Bianca', 'BIANCA-CAFE', 479.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Bianca é a escolha ideal para quem busca sofisticação aliada à funcionalidade. Confeccionado em couro legítimo, apresenta um design moderno e estruturado que acompanha a rotina com praticidade e presença.

Versátil, possui duas alças fixas de ombro que garantem conforto e estabilidade no uso diário, além de alça tiracolo regulável para diversos benefícios.

Seu interior forrado oferece organização eficiente, com bolso interno funcional para pequenos objetos. Conta ainda com duas divisões externas com zíper de metal — incluindo bolso frontal que adiciona charme e modernidade ao design, mantendo seus itens sempre acessíveis.

Uma peça pensada para mulheres que valorizam qualidade, estrutura e acabamento impecável.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 22 cm
Largura: 28 cm
Profundidade: 15 cm
Peso: 800 g', 'Couro legítimo de alta qualidade
Forro interno
Bolsa interna funcional
Duas divisões externas com zíper de metal
Bolso frontal externo
Zíper de metal com puxadores em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/WhatsApp_Image_2026-05-26_at_14.49.52.jpg?v=1779817894"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/92D4D1B2-318E-40FA-9532-187C8071E944.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/7AA77D4C-D529-4C23-A08E-2BB510E8C96D.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/826CD45A-E5D3-421D-962F-56D68297A998.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/DDA03041-B547-493A-83AA-10B6AF28E586.jpg?v=1780369984"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6567.png?v=1780370165"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 91, 'https://www.lifeatelie.com.br/products/bolsa-bianca-cafe'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-bianca-cafe');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Bianca - Sela', 'Bianca', 'BIANCA-SELA', 479.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Bianca é a escolha ideal para quem busca sofisticação aliada à funcionalidade. Confeccionado em couro legítimo, apresenta um design moderno e estruturado que acompanha a rotina com praticidade e presença.

Versátil, possui duas alças fixas de ombro que garantem conforto e estabilidade no uso diário, além de alça tiracolo regulável para diversos benefícios.

Seu interior forrado oferece organização eficiente, com bolso interno funcional para pequenos objetos. Conta ainda com duas divisões externas com zíper de metal — incluindo bolso frontal que adiciona charme e modernidade ao design, mantendo seus itens sempre acessíveis.

Uma peça pensada para mulheres que valorizam qualidade, estrutura e acabamento impecável.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 22 cm
Largura: 28 cm
Profundidade: 15 cm
Peso: 800 g', 'Couro legítimo de alta qualidade
Forro interno
Bolsa interna funcional
Duas divisões externas com zíper de metal
Bolso frontal externo
Zíper de metal com puxadores em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9873A3E6-763F-4528-AAAB-34F1926FA989.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/8DAA4D6A-D92F-4F27-AE79-FB7BC3391E9A.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/CFC36B6C-4305-40C5-AB59-97C53C084BF5.jpg?v=1780369983"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D27E3661-D7B4-48CE-B53B-51F09A2FD9B5.jpg?v=1780369984"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-6567.png?v=1780370165"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 92, 'https://www.lifeatelie.com.br/products/bolsa-bianca-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-bianca-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Alice - Off White', 'Alice', 'ALICE-OFF', 489.90, null,
  'A bolsa Alice chama atenção pelos detalhes em alto-relevo no couro, que dão personalidade ao modelo sem perder a elegância. Compacta e moderna, tem o tamanho certo para acompanhar a rotina com leveza.

Como usar
Use no ombro ou na transversal com a alça ajustável e removível. Uma bolsa confortável para usar durante o dia e fácil de combinar com diferentes looks.

Espaço interno
Possui interior forrado na cor vermelhacom bolso interno para pequenos itens e dois bolsos laterais. O fechamento principal combina zíper de metal com botão magnético, trazendo mais segurança e praticidade.

Ocasiões
Perfeita para o dia a dia, almoços, passeios, viagens e compromissos em que você quer levar o essencial sem carregar uma bolsa grande.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com detalhes em alto-relevo que valorizam sua textura. As ferragens com banho dourado complementam o acabamento da peça.', 'Altura: 17 cm
Largura: 24 cm
Profundidade: 11,5 cm
Alça: 53 cm
Peso: 600 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/73173CB9-8042-44DC-8E29-B187E4E8A2E6.png?v=1790726218"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/7F256965-0623-4A53-AEC5-1A12EF938E23.png?v=1790726184"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2906FAC3-ED48-4242-85D0-88F8BC0ABE3B.png?v=1790726184"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/A9AFE3B3-1810-419F-8178-1E06C4F75C8E.png?v=1790726184"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/EE81F616-1701-405E-B917-C6F397C5BCBC.png?v=1790726184"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/883D3129-8826-400F-824C-BEE2CDE71CE0.png?v=1790726184"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/78137CE7-DD0C-4EEC-BE41-A770249595F6.png?v=1790726184"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BAB0C0FB-D39B-4DC3-964A-A25021538B10.jpg?v=1790725556"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 93, 'https://www.lifeatelie.com.br/products/bolsa-alice-off-white'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-alice-off-white');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Alice - Off White & Sela', 'Alice', 'BLAL0204', 489.90, null,
  'A bolsa Alice chama atenção pelos detalhes em alto-relevo no couro, que dão personalidade ao modelo sem perder a elegância. Compacta e moderna, tem o tamanho certo para acompanhar a rotina com leveza.

Como usar
Use no ombro ou na transversal com a alça ajustável e removível. Uma bolsa confortável para usar durante o dia e fácil de combinar com diferentes looks.

Espaço interno
Possui interior forrado na cor vermelhacom bolso interno para pequenos itens e dois bolsos laterais. O fechamento principal combina zíper de metal com botão magnético, trazendo mais segurança e praticidade.

Ocasiões
Perfeita para o dia a dia, almoços, passeios, viagens e compromissos em que você quer levar o essencial sem carregar uma bolsa grande.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com detalhes em alto-relevo que valorizam sua textura. As ferragens com banho dourado complementam o acabamento da peça.', 'Altura: 17 cm
Largura: 24 cm
Profundidade: 11,5 cm
Alça: 53 cm
Peso: 600 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/7EF25E84-9BD5-4FF5-80BE-7E51ACED618D.jpg?v=1790730273"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/A848F0E9-F09B-4A67-9852-2B29E620CDC0.jpg?v=1790730273"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/28A54C09-4778-4A54-952B-44AC4E23DB1B.jpg?v=1790730273"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/0D301EAE-6E24-44E2-92E6-55DCF0F04CD7.jpg?v=1790730273"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9E5FB898-F283-4B54-8141-1C9F712EF3DF.png?v=1790730307"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B6516E28-1665-4A8E-BC44-99176FCAF40F.jpg?v=1776808707"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BAB0C0FB-D39B-4DC3-964A-A25021538B10.jpg?v=1790725556"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 94, 'https://www.lifeatelie.com.br/products/bolsa-alice-off-white-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-alice-off-white-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Alice - Off White & Café', 'Alice', 'BLAL0203', 489.90, null,
  'A bolsa Alice chama atenção pelos detalhes em alto-relevo no couro, que dão personalidade ao modelo sem perder a elegância. Compacta e moderna, tem o tamanho certo para acompanhar a rotina com leveza.

Como usar
Use no ombro ou na transversal com a alça ajustável e removível. Uma bolsa confortável para usar durante o dia e fácil de combinar com diferentes looks.

Espaço interno
Possui interior forrado na cor vermelhacom bolso interno para pequenos itens e dois bolsos laterais. O fechamento principal combina zíper de metal com botão magnético, trazendo mais segurança e praticidade.

Ocasiões
Perfeita para o dia a dia, almoços, passeios, viagens e compromissos em que você quer levar o essencial sem carregar uma bolsa grande.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com detalhes em alto-relevo que valorizam sua textura. As ferragens com banho dourado complementam o acabamento da peça.', 'Altura: 17 cm
Largura: 24 cm
Profundidade: 11,5 cm
Alça: 53 cm
Peso: 600 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9920.png?v=1790731580"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9924.png?v=1790731627"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9921.png?v=1790731580"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9922.png?v=1790731580"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9923.png?v=1790731581"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B6516E28-1665-4A8E-BC44-99176FCAF40F.jpg?v=1776808707"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BAB0C0FB-D39B-4DC3-964A-A25021538B10.jpg?v=1790725556"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 95, 'https://www.lifeatelie.com.br/products/bolsa-alice-off-white-cafe'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-alice-off-white-cafe');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Alice - Café', 'Alice', 'BLAL03', 489.90, null,
  'A bolsa Alice chama atenção pelos detalhes em alto-relevo no couro, que dão personalidade ao modelo sem perder a elegância. Compacta e moderna, tem o tamanho certo para acompanhar a rotina com leveza.

Como usar
Use no ombro ou na transversal com a alça ajustável e removível. Uma bolsa confortável para usar durante o dia e fácil de combinar com diferentes looks.

Espaço interno
Possui interior forrado na cor vermelhacom bolso interno para pequenos itens e dois bolsos laterais. O fechamento principal combina zíper de metal com botão magnético, trazendo mais segurança e praticidade.

Ocasiões
Perfeita para o dia a dia, almoços, passeios, viagens e compromissos em que você quer levar o essencial sem carregar uma bolsa grande.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com detalhes em alto-relevo que valorizam sua textura. As ferragens com banho dourado complementam o acabamento da peça.', 'Altura: 17 cm
Largura: 24 cm
Profundidade: 11,5 cm
Alça: 53 cm
Peso: 600 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/28511CC9-723F-481A-A2A8-BEB568EF7E74.png?v=1790725997"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9BE7DABB-DF9E-40F2-A097-A8C492C8A38B.png?v=1790725997"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F149E920-B64B-4248-BC30-A1CB93EEA4C3.png?v=1790725997"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1D567A07-CB23-4809-9620-7590C429614C.png?v=1790725997"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9052E9BE-BB99-452E-963D-7139E2FE72FC.png?v=1790725997"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/ACFF17DE-A4A6-4EE7-B688-ACEA95E56756.png?v=1790725997"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/173D30A7-C3A1-47EB-B90D-24B280C8FCC3.png?v=1790726035"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BAB0C0FB-D39B-4DC3-964A-A25021538B10.jpg?v=1790725556"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 96, 'https://www.lifeatelie.com.br/products/bolsa-alice-cafe'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-alice-cafe');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Alice - Sela', 'Alice', 'BLAL04', 489.90, null,
  'A bolsa Alice chama atenção pelos detalhes em alto-relevo no couro, que dão personalidade ao modelo sem perder a elegância. Compacta e moderna, tem o tamanho certo para acompanhar a rotina com leveza.

Como usar
Use no ombro ou na transversal com a alça ajustável e removível. Uma bolsa confortável para usar durante o dia e fácil de combinar com diferentes looks.

Espaço interno
Possui interior forrado na cor vermelhacom bolso interno para pequenos itens e dois bolsos laterais. O fechamento principal combina zíper de metal com botão magnético, trazendo mais segurança e praticidade.

Ocasiões
Perfeita para o dia a dia, almoços, passeios, viagens e compromissos em que você quer levar o essencial sem carregar uma bolsa grande.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com detalhes em alto-relevo que valorizam sua textura. As ferragens com banho dourado complementam o acabamento da peça.', 'Altura: 17 cm
Largura: 24 cm
Profundidade: 11,5 cm
Alça: 53 cm
Peso: 600 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2125E20F-37D8-428D-AC5B-50D92C6F6A5C.png?v=1790725915"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/AFFA41C3-702E-41CF-AC6E-25C609984566.png?v=1790725915"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9C51941A-EB62-4D25-9761-FFB4028725EB.png?v=1790725915"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/68F7C8B2-D7DD-41BD-A514-8B05E5487219.png?v=1790725915"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B1235F3A-0394-4701-9813-FA274DE66506.png?v=1790725915"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/459B449B-9053-437E-9952-35C17E8840A4.png?v=1790725959"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/35EF01C8-24AB-4F8A-B077-BBA3AD9FC280.png?v=1790725915"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BAB0C0FB-D39B-4DC3-964A-A25021538B10.jpg?v=1790725556"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 97, 'https://www.lifeatelie.com.br/products/bolsa-alice-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-alice-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Alice - Verde Militar', 'Alice', 'BLAL10', 489.90, null,
  'A bolsa Alice chama atenção pelos detalhes em alto-relevo no couro, que dão personalidade ao modelo sem perder a elegância. Compacta e moderna, tem o tamanho certo para acompanhar a rotina com leveza.

Como usar
Use no ombro ou na transversal com a alça ajustável e removível. Uma bolsa confortável para usar durante o dia e fácil de combinar com diferentes looks.

Espaço interno
Possui interior forrado na cor vermelhacom bolso interno para pequenos itens e dois bolsos laterais. O fechamento principal combina zíper de metal com botão magnético, trazendo mais segurança e praticidade.

Ocasiões
Perfeita para o dia a dia, almoços, passeios, viagens e compromissos em que você quer levar o essencial sem carregar uma bolsa grande.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com detalhes em alto-relevo que valorizam sua textura. As ferragens com banho dourado complementam o acabamento da peça.', 'Altura: 17 cm
Largura: 24 cm
Profundidade: 11,5 cm
Alça: 53 cm
Peso: 600 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B506FB87-E199-4DEC-9778-8F6989511B13.png?v=1790725804"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1019D104-C6C8-493C-BDA4-17ECE08B0BDA.png?v=1790725804"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/7AB651E9-B7F2-4EE5-8F28-46095EDD50F4.png?v=1790725804"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B4BB1231-21D8-4C75-BF7A-F43390C4FD83.png?v=1790725804"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/FD55F2A0-221D-44BE-8886-429EF000F463.png?v=1790725804"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/6714CA7F-0E72-4D61-9DB1-F22EBE0E2E78.png?v=1790725804"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/326FFB8B-C421-4E8C-9EB1-9D9398CDF016.png?v=1790725835"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BAB0C0FB-D39B-4DC3-964A-A25021538B10.jpg?v=1790725556"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 98, 'https://www.lifeatelie.com.br/products/bolsa-alice-verde-militar'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-alice-verde-militar');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Alice - Vermelho Bordô', 'Alice', 'BLAL05', 489.90, null,
  'A bolsa Alice chama atenção pelos detalhes em alto-relevo no couro, que dão personalidade ao modelo sem perder a elegância. Compacta e moderna, tem o tamanho certo para acompanhar a rotina com leveza.

Como usar
Use no ombro ou na transversal com a alça ajustável e removível. Uma bolsa confortável para usar durante o dia e fácil de combinar com diferentes looks.

Espaço interno
Possui interior forrado na cor vermelhacom bolso interno para pequenos itens e dois bolsos laterais. O fechamento principal combina zíper de metal com botão magnético, trazendo mais segurança e praticidade.

Ocasiões
Perfeita para o dia a dia, almoços, passeios, viagens e compromissos em que você quer levar o essencial sem carregar uma bolsa grande.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com detalhes em alto-relevo que valorizam sua textura. As ferragens com banho dourado complementam o acabamento da peça.', 'Altura: 17 cm
Largura: 24 cm
Profundidade: 11,5 cm
Alça: 53 cm
Peso: 600 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2317C2E1-5DD1-4A87-9E5A-51E0B2C0EA7F.png?v=1790725612"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/38C9156A-149E-437F-B241-575DCF27DC4F.png?v=1790725612"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BA5381ED-C7E4-4A7C-9719-D69D31B5E752.png?v=1790725613"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/7DCE0DB1-87FC-4D6A-82FA-47A2447FC177.png?v=1790725612"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2C9EB94B-00C0-443A-86A1-9D7BDBB2DFAE.png?v=1790725613"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/A3FE8772-BB38-4218-B738-75753B0B5EFB.png?v=1790725613"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E754A714-CFD8-45AC-85E3-12A64B07A438.png?v=1790725724"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BAB0C0FB-D39B-4DC3-964A-A25021538B10.jpg?v=1790725556"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 99, 'https://www.lifeatelie.com.br/products/bolsa-alice-vermelho-bordo'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-alice-vermelho-bordo');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Alice - Azul Marinho', 'Alice', 'BLAL09', 489.90, null,
  'A bolsa Alice chama atenção pelos detalhes em alto-relevo no couro, que dão personalidade ao modelo sem perder a elegância. Compacta e moderna, tem o tamanho certo para acompanhar a rotina com leveza.

Como usar
Use no ombro ou na transversal com a alça ajustável e removível. Uma bolsa confortável para usar durante o dia e fácil de combinar com diferentes looks.

Espaço interno
Possui interior forrado na cor vermelhacom bolso interno para pequenos itens e dois bolsos laterais. O fechamento principal combina zíper de metal com botão magnético, trazendo mais segurança e praticidade.

Ocasiões
Perfeita para o dia a dia, almoços, passeios, viagens e compromissos em que você quer levar o essencial sem carregar uma bolsa grande.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com detalhes em alto-relevo que valorizam sua textura. As ferragens com banho dourado complementam o acabamento da peça.', 'Altura: 17 cm
Largura: 24 cm
Profundidade: 11,5 cm
Alça: 53 cm
Peso: 600 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/8B3F0EEA-6006-4319-ABC8-0A32A2089D63.png?v=1790725496"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/C7809CCF-14EF-4209-8F6A-C32107B7507B.png?v=1790725496"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/48E081F5-AB07-4A97-BD2D-07CD360DD820.png?v=1790725496"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/627686F8-3561-4CA0-89AA-86FB29B811D7.png?v=1790725496"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D3D72DB6-4F3D-4D39-BCE7-9EE2621760AB.png?v=1790725496"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/A6F5669B-8960-4D73-AE65-515856B3C241.png?v=1790725752"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BAB0C0FB-D39B-4DC3-964A-A25021538B10.jpg?v=1790725556"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 100, 'https://www.lifeatelie.com.br/products/bolsa-alice-azul-marinho'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-alice-azul-marinho');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Luiza - Off White & Café', 'Luiza', 'BLLZ0203', 509.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Luiza traduz o minimalismo contemporâneo em uma peça marcante e sofisticada. Seu design moderno com detalhes em alto relevo e acabamento lateral exclusivo valoriza o couro legítimo e confere personalidade à bolsa, tornando-a única e atemporal.

Estruturada e marcada na medida certa, é ideal para acompanhar a rotina com organização e elegância.

Possui duas alças fixas de mão, que proporcionam um visual elegante e estruturado, além de alça tiracolo regulável para maior conforto e conforto no uso diário.

Seu interior forrado oferece praticidade com bolso interno funcional para pequenos objetos. O fechamento principal em zíper de metal com puxador em couro garante segurança e acabamento refinado.

Uma bolsa pensada para mulheres que valorizam presença, qualidade e design sofisticado.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 18 cm
Comprimento: 31 cm
Profundidade: 16 cm
Peso: 900 g', 'Couro legítimo de alta qualidade
Detalhes em alto relevo em couro
Acabamento lateral
Forro interno
Bolso interno funcional
Fechamento em zíper de metal
Puxador em maio
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/3DB9D269-CB19-4609-A530-97181CCE14B9.jpg?v=1779240610"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/0BD333CD-A314-4BAF-92BE-AE1DF235698B.jpg?v=1779240610"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/0E5AE30C-FCB0-4533-95F8-3F797EC4969D.jpg?v=1779240610"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/DFB439BE-D116-4121-A89D-B4463ED879B3.jpg?v=1779240610"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/AFB7088C-AD48-4E7F-95AC-F57E936EFEDD.png?v=1779240611"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 101, 'https://www.lifeatelie.com.br/products/bolsa-luiza-off-white-cafe'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-luiza-off-white-cafe');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Luiza - Verde Militar', 'Luiza', 'BLLZ10', 509.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Luiza traduz o minimalismo contemporâneo em uma peça marcante e sofisticada. Seu design moderno com detalhes em alto-relevo e acabamento lateral exclusivo valoriza o couro legítimo e confere personalidade à bolsa, tornando-a única e atemporal.

Estruturada e espaçosa na medida certa, é ideal para acompanhar a rotina com organização e elegância.

Possui duas alças fixas de mão, que proporcionam um visual elegante e estruturado, além de alça tiracolo regulável para maior conforto e versatilidade no uso diário.

Seu interior forrado oferece praticidade com bolso interno funcional para pequenos objetos. O fechamento principal em zíper de metal com puxador em couro garante segurança e acabamento refinado.

Uma bolsa pensada para mulheres que valorizam presença, qualidade e design sofisticado.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 18 cm
Comprimento: 32 cm
Profundidade: 16 cm
Peso: 900 g', 'Couro legítimo de alta qualidade
Detalhes em alto-relevo em couro
Acabamento lateral exclusivo
Forro interno
Bolso interno funcional
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/8316EA19-1218-4C65-B45F-CB5A821DCA10.jpg?v=1773623249"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/FEC0D8A1-8F92-4394-A78E-E740FF986D22.jpg?v=1773623213"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1D4D9F51-9DA1-4C23-A74B-8BAC70A48C12.jpg?v=1773623213"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 102, 'https://www.lifeatelie.com.br/products/bolsa-luiza-verde-militar'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-luiza-verde-militar');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Luiza - Off White & Sela', 'Luiza', 'BLLZ0204', 509.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Luiza traduz o minimalismo contemporâneo em uma peça marcante e sofisticada. Seu design moderno com detalhes em alto relevo e acabamento lateral exclusivo valoriza o couro legítimo e confere personalidade à bolsa, tornando-a única e atemporal.

Estruturada e marcada na medida certa, é ideal para acompanhar a rotina com organização e elegância.

Possui duas alças fixas de mão, que proporcionam um visual elegante e estruturado, além de alça tiracolo regulável para maior conforto e conforto no uso diário.

Seu interior forrado oferece praticidade com bolso interno funcional para pequenos objetos. O fechamento principal em zíper de metal com puxador em couro garante segurança e acabamento refinado.

Uma bolsa pensada para mulheres que valorizam presença, qualidade e design sofisticado.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 18 cm
Comprimento: 31 cm
Profundidade: 16 cm
Peso: 900 g', 'Couro legítimo de alta qualidade
Detalhes em alto relevo em couro
Acabamento lateral
Forro interno
Bolso interno funcional
Fechamento em zíper de metal
Puxador em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E8591637-2C9C-453E-B0B9-1DD47CEC02CB.jpg?v=1773619600"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/56BED5F9-A2D8-4CAD-AAC7-A6620D71A4B0.jpg?v=1779240519"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E310F65F-F9F8-4810-8267-9B0C08F71792.jpg?v=1779240519"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/560964F2-D95C-4912-B9A2-FC365E16B082.jpg?v=1779240519"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/52762677-EDA5-4AA2-8DA2-9923D9CF4E1B.png?v=1779240523"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 103, 'https://www.lifeatelie.com.br/products/bolsa-luiza-off-white-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-luiza-off-white-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Isis P - Café', 'Isis', 'ISIS-P-SELA', 249.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Isis P é a versão compacta de um clássico da Life Ateliê. Delicada na proporção e marcante nos detalhes, é ideal para quem busca praticidade sem abrir mão da sofisticação.

Confeccionada em couro legítimo com acabamento em matelassê, traduz elegância em cada detalhe. Perfeita para carregar apenas o essencial com charme e leveza, acompanhando momentos que pedem discrição e estilo.

Seu interior conta com divisão funcional e forro vermelho, que valoriza o acabamento e adiciona personalidade à peça. O fechamento em zíper de metal com puxadores em couro garante segurança e acabamento refinado.

A alça tiracolo regulável proporciona conforto e versatilidade no uso diário.

Uma bolsa pensada para mulheres que apreciam minimalismo, qualidade e elegância na medida certa.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 13 cm
Largura: 18 cm
Profundidade: 6 cm
Peso: 250 g', 'Couro legítimo de alta qualidade
Acabamento em matelassê
Forro interno vermelho
Divisão interna funcional
Fechamento em zíper de metal
Puxadores tassel em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9815ABE7-54D6-4F01-821A-57A191F3D178.jpg?v=1771879777"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/CE137BC1-5BB6-41B3-9118-AE6374377FDA.jpg?v=1771879777"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/624DA5EC-1C9D-463E-ADB6-102CA31A89BB.jpg?v=1771879778"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 104, 'https://www.lifeatelie.com.br/products/bolsa-isis-p-cafe'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-isis-p-cafe');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Isis P - Preta', 'Isis', 'ISIS-P-PRETA', 249.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Isis P é a versão compacta de um clássico do Life Ateliê. Delicada na proporção e marcante nos detalhes, é ideal para quem busca praticidade sem abrir a mão da sofisticação.

Confeccionado em couro legítimo com acabamento em matelassê, traduzido moderno em cada detalhe. Perfeita para carregar apenas o essencial com charme e leveza, acompanhando momentos que pedem discrição e estilo.

Seu interior conta com divisão funcional e forro vermelho, que valoriza o acabamento e adiciona personalidade à peça. O fecho em zíper de metal com puxadores em couro garante segurança e acabamento refinado.

A alça tiracolo regulável proporciona conforto e elegância no uso diário.

Uma bolsa pensada para mulheres que apreciam minimalismo, qualidade e elegantes na medida certa.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 13 cm
Largura: 18 cm
Profundidade: 6 cm
Peso: 250 g', 'Couro legítimo de alta qualidade
Acabamento em matelassê
Forro interno vermelho
Divisão interna funcional
Fechamento em zíper de metal
Puxadores tassel em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/82850865-1AF9-4ED8-BF42-1AB319CBE1C1.jpg?v=1771879849"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/2619BE27-E43D-431E-A7A9-B61AB2530344.jpg?v=1771879849"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D40B2472-945B-4AD3-A935-3C239E7B8164.jpg?v=1771879849"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 105, 'https://www.lifeatelie.com.br/products/bolsa-isis-p-preta'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-isis-p-preta');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Isis P - Vermelho Cereja', 'Isis', 'ISIS-P-VERMELHO', 249.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Isis P é a versão compacta de um clássico da Life Ateliê. Delicada na proporção e marcante nos detalhes, é ideal para quem busca praticidade sem abrir mão da sofisticação.

Confeccionada em couro legítimo com acabamento em matelassê, traduz elegância em cada detalhe. Perfeita para carregar apenas o essencial com charme e leveza, acompanhando momentos que pedem discrição e estilo.

Seu interior conta com divisão funcional e forro vermelho, que valoriza o acabamento e adiciona personalidade à peça. O fechamento em zíper de metal com puxadores em couro garante segurança e acabamento refinado.

A alça tiracolo regulável proporciona conforto e versatilidade no uso diário.

Uma bolsa pensada para mulheres que apreciam minimalismo, qualidade e elegância na medida certa.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 13 cm
Largura: 18 cm
Profundidade: 6 cm
Peso: 250 g', 'Couro legítimo de alta qualidade
Acabamento em matelassê
Forro interno vermelho
Divisão interna funcional
Fechamento em zíper de metal
Puxadores tassel em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/WhatsApp_Image_2026-05-26_at_14.35.14.jpg?v=1779816930"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/C9CA48E3-E825-48F0-93D7-B8FCC0F9B833.jpg?v=1771879234"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/0E0112C5-2E5F-4B9A-AD6F-9EF46B5ED85F.jpg?v=1771879234"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/47816926-9E91-423E-BBC6-D0EDD627D2C0.jpg?v=1771879234"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 106, 'https://www.lifeatelie.com.br/products/bolsa-isis-p-vermelho-cereja'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-isis-p-vermelho-cereja');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Isis P - Verde Militar', 'Isis', 'ISIS-P-MILITAR', 249.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Isis P é a versão compacta de um clássico da Life Ateliê. Delicada na proporção e marcante nos detalhes, é ideal para quem busca praticidade sem abrir mão da sofisticação.

Confeccionada em couro legítimo com acabamento em matelassê, traduz elegância em cada detalhe. Perfeita para carregar apenas o essencial com charme e leveza, acompanhando momentos que pedem discrição e estilo.

Seu interior conta com divisão funcional e forro vermelho, que valoriza o acabamento e adiciona personalidade à peça. O fechamento em zíper de metal com puxadores em couro garante segurança e acabamento refinado.

A alça tiracolo regulável proporciona conforto e versatilidade no uso diário.

Uma bolsa pensada para mulheres que apreciam minimalismo, qualidade e elegância na medida certa.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 13 cm
Largura: 18 cm
Profundidade: 6 cm
Peso: 250 g', 'Couro legítimo de alta qualidade
Acabamento em matelassê
Forro interno vermelho
Divisão interna funcional
Fechamento em zíper de metal
Puxadores tassel em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B8EA251F-034C-4925-9347-87F6BCEA2BA2.jpg?v=1771879318"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B0C39A5D-6E7A-42EE-9DC1-4DE6AC3F6E1B.jpg?v=1771879319"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E25A79A4-DA2C-415F-AD5C-6B31402859D6.jpg?v=1771879319"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 107, 'https://www.lifeatelie.com.br/products/bolsa-isis-p-verde-militar'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-isis-p-verde-militar');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Isis P - Sela', 'Isis', 'ISIS-P-SELA', 249.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Isis P é a versão compacta de um clássico do Life Ateliê. Delicada na proporção e marcante nos detalhes, é ideal para quem busca praticidade sem abrir a mão da sofisticação.

Confeccionado em couro legítimo com acabamento em matelassê, traduzido moderno em cada detalhe. Perfeita para carregar apenas o essencial com charme e leveza, acompanhando momentos que pedem discrição e estilo.

Seu interior conta com divisão funcional e forro vermelho, que valoriza o acabamento e adiciona personalidade à peça. O fecho em zíper de metal com puxadores em couro garante segurança e acabamento refinado.

A alça tiracolo regulável proporciona conforto e elegância no uso diário.

Uma bolsa pensada para mulheres que apreciam minimalismo, qualidade e elegantes na medida certa.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 13 cm
Largura: 18 cm
Profundidade: 6 cm
Peso: 250 g', 'Couro legítimo de alta qualidade
Acabamento em matelassê
Forro interno vermelho
Divisão interna funcional
Fechamento em zíper de metal
Puxadores tassel em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-1996.jpg?v=1771879722"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-2020.jpg?v=1771879722"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/8D73E549-F925-4670-B48B-74F88A722ACD.jpg?v=1771879722"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 108, 'https://www.lifeatelie.com.br/products/bolsa-isis-p-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-isis-p-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Isis P - Dourada', 'Isis', 'ISIS-P-DOURADA', 249.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Isis P é a versão compacta de um clássico do Life Ateliê. Delicada na proporção e marcante nos detalhes, é ideal para quem busca praticidade sem abrir a mão da sofisticação.

Confeccionado em couro legítimo com acabamento em matelassê, traduzido moderno em cada detalhe. Perfeita para carregar apenas o essencial com charme e leveza, acompanhando momentos que pedem discrição e estilo.

Seu interior conta com divisão funcional e forro vermelho, que valoriza o acabamento e adiciona personalidade à peça. O fecho em zíper de metal com puxadores em couro garante segurança e acabamento refinado.

A alça tiracolo regulável proporciona conforto e elegância no uso diário.

Uma bolsa pensada para mulheres que apreciam minimalismo, qualidade e elegantes na medida certa.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 13 cm
Largura: 18 cm
Profundidade: 6 cm
Peso: 250 g', 'Couro legítimo de alta qualidade
Acabamento em matelassê
Forro interno vermelho
Divisão interna funcional
Fechamento em zíper de metal
Puxadores tassel
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/66E1B173-D276-4276-967F-41A512C5DBC4.jpg?v=1771879091"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/CE4EFB6C-D95B-41AC-96B8-B6712A6C05DE.jpg?v=1771879091"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/DE762BEC-5644-4232-AC27-70EF3D237D66.jpg?v=1771879091"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 109, 'https://www.lifeatelie.com.br/products/bolsa-isis-p-dourada'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-isis-p-dourada');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Isis P - Bronze', 'Isis', 'ISIS-P-BRONZE', 249.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Isis P é a versão compacta de um clássico da Life Ateliê. Delicada na proporção e marcante nos detalhes, é ideal para quem busca praticidade sem abrir mão da sofisticação.

Confeccionada em couro legítimo com acabamento em matelassê, traduz elegância em cada detalhe. Perfeita para carregar apenas o essencial com charme e leveza, acompanhando momentos que pedem discrição e estilo.

Seu interior conta com divisão funcional e forro vermelho, que valoriza o acabamento e adiciona personalidade à peça. O fechamento em zíper de metal com puxadores em couro garante segurança e acabamento refinado.

A alça tiracolo regulável proporciona conforto e versatilidade no uso diário.

Uma bolsa pensada para mulheres que apreciam minimalismo, qualidade e elegância na medida certa.

Exclusividade Life Ateliê.',
  'Couro legítimo de alta qualidade', 'Altura: 13 cm
Largura: 18 cm
Profundidade: 6 cm
Peso: 250 g', 'Couro legítimo de alta qualidade
Acabamento em matelassê
Forro interno vermelho
Divisão interna funcional
Fechamento em zíper de metal
Puxadores tassel em couro
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-2003.jpg?v=1771879160"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-2024.jpg?v=1771879159"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/4BDFA09D-B468-46A8-A997-1763911E896C.jpg?v=1771879175"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 110, 'https://www.lifeatelie.com.br/products/bolsa-isis-p-bronze'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-isis-p-bronze');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sara P - Preto', 'Sara', 'BLSP01', 389.90, null,
  'A Bolsa Sara P traz o charme do matelassê em uma versão compacta e estruturada. Pequena por fora e prática por dentro, é uma bolsa elegante para quem gosta de levar o essencial bem organizado.

Como usar
Use pela alça de mão para um visual mais clássico ou com a alça tiracolo ajustável para ter mais liberdade no dia a dia.

Espaço interno
Possui duas divisões com zíper de metal, além de bolso frontal com zíper para deixar os itens que você mais usa sempre à mão. O interior recebe forro vermelho, um detalhe marcante da peça.

Ocasiões
Perfeita para o dia a dia, passeios, almoços, viagens e compromissos em que você quer uma bolsa menor, prática e elegante.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com matelassê na parte frontal e traseira, ferragens com banho dourado e acabamento cuidadosamente trabalhado.', 'Altura: 14 cm
Largura: 21 cm
Profundidade: 10 cm
Peso: 450 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1CF9DB5F-4736-4A25-9FA3-2270A9BB4AED.jpg?v=1791024370"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/07C63E9E-BCC8-43A9-8D34-B2CE9188E1EC.jpg?v=1791024370"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F11DEB29-EC1B-45BB-AA53-85859562BD38.jpg?v=1791024370"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/C6E2D5C8-F50F-4458-86B9-820BED109CD3.jpg?v=1791024370"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E7383119-0A88-4D05-A7E6-D7EEB79464F2.jpg?v=1791024370"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 111, 'https://www.lifeatelie.com.br/products/bolsa-sara-p-preto'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sara-p-preto');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sara P - Café', 'Sara', 'BLSP03', 389.90, null,
  'A Bolsa Sara P traz o charme do matelassê em uma versão compacta e estruturada. Pequena por fora e prática por dentro, é uma bolsa elegante para quem gosta de levar o essencial bem organizado.

Como usar
Use pela alça de mão para um visual mais clássico ou com a alça tiracolo ajustável para ter mais liberdade no dia a dia.

Espaço interno
Possui duas divisões com zíper de metal, além de bolso frontal com zíper para deixar os itens que você mais usa sempre à mão. O interior recebe forro vermelho, um detalhe marcante da peça.

Ocasiões
Perfeita para o dia a dia, passeios, almoços, viagens e compromissos em que você quer uma bolsa menor, prática e elegante.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com matelassê na parte frontal e traseira, ferragens com banho dourado e acabamento cuidadosamente trabalhado.', 'Altura: 14 cm
Largura: 21 cm
Profundidade: 10 cm
Peso: 450 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-0160.png?v=1791027734"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-0157.png?v=1791027734"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-0159.png?v=1791027735"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-0161.png?v=1791027734"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-0163.jpg?v=1791027734"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 112, 'https://www.lifeatelie.com.br/products/bolsa-sara-p-cafe'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sara-p-cafe');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sara P - Sela', 'Sara', 'BLSP04', 389.90, null,
  'A Bolsa Sara P traz o charme do matelassê em uma versão compacta e estruturada. Pequena por fora e prática por dentro, é uma bolsa elegante para quem gosta de levar o essencial bem organizado.

Como usar
Use pela alça de mão para um visual mais clássico ou com a alça tiracolo ajustável para ter mais liberdade no dia a dia.

Espaço interno
Possui duas divisões com zíper de metal, além de bolso frontal com zíper para deixar os itens que você mais usa sempre à mão. O interior recebe forro vermelho, um detalhe marcante da peça.

Ocasiões
Perfeita para o dia a dia, passeios, almoços, viagens e compromissos em que você quer uma bolsa menor, prática e elegante.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com matelassê na parte frontal e traseira, ferragens com banho dourado e acabamento cuidadosamente trabalhado.', 'Altura: 14 cm
Largura: 21 cm
Profundidade: 10 cm
Peso: 450 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/4582AC37-3489-4CC2-B68C-384868372295.jpg?v=1791028373"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/0D2451DC-1DBB-497C-B589-7BE21B37A31C.jpg?v=1791028373"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/CD9B8DA0-9D8C-4220-92B1-A4536ABD84E2.jpg?v=1791028373"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/ECC35A49-A60F-48F1-BE49-A327B74F94FF.jpg?v=1791028373"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/F2AA7746-2656-4771-95FF-6884BC05E759.jpg?v=1791028547"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 113, 'https://www.lifeatelie.com.br/products/bolsa-sara-p-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sara-p-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sara P - Off White & Sela', 'Sara', 'BLSP0204', 389.90, null,
  'A Bolsa Sara P traz o charme do matelassê em uma versão compacta e estruturada. Pequena por fora e prática por dentro, é uma bolsa elegante para quem gosta de levar o essencial bem organizado.

Como usar
Use pela alça de mão para um visual mais clássico ou com a alça tiracolo ajustável para ter mais liberdade no dia a dia.

Espaço interno
Possui duas divisões com zíper de metal, além de bolso frontal com zíper para deixar os itens que você mais usa sempre à mão. O interior recebe forro vermelho, um detalhe marcante da peça.

Ocasiões
Perfeita para o dia a dia, passeios, almoços, viagens e compromissos em que você quer uma bolsa menor, prática e elegante.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com matelassê na parte frontal e traseira, ferragens com banho dourado e acabamento cuidadosamente trabalhado.', 'Altura: 14 cm
Largura: 21 cm
Profundidade: 10 cm
Peso: 450 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-0172.jpg?v=1791030311"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/93A91796-887E-4F49-B601-2CE9236EC7A0.jpg?v=1791027858"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/3225674B-A310-4E4B-9E28-08E4550FB6A1.jpg?v=1791027859"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/A3AE5E26-4A15-4488-8629-6CA2DB09A0E6.jpg?v=1791027858"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/3B0E6A0F-DAF1-4FAD-ABCD-726BDBB73362.jpg?v=1791027859"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 114, 'https://www.lifeatelie.com.br/products/bolsa-sara-p-off-white-sela-1'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sara-p-off-white-sela-1');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sara P - Off White', 'Sara', 'BLSP02', 389.90, null,
  'A Bolsa Sara P traz o charme do matelassê em uma versão compacta e estruturada. Pequena por fora e prática por dentro, é uma bolsa elegante para quem gosta de levar o essencial bem organizado.

Como usar
Use pela alça de mão para um visual mais clássico ou com a alça tiracolo ajustável para ter mais liberdade no dia a dia.

Espaço interno
Possui duas divisões com zíper de metal, além de bolso frontal com zíper para deixar os itens que você mais usa sempre à mão. O interior recebe forro vermelho, um detalhe marcante da peça.

Ocasiões
Perfeita para o dia a dia, passeios, almoços, viagens e compromissos em que você quer uma bolsa menor, prática e elegante.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com matelassê na parte frontal e traseira, ferragens com banho dourado e acabamento cuidadosamente trabalhado.', 'Altura: 14 cm
Largura: 21 cm
Profundidade: 10 cm
Peso: 450 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/60AD5C0C-38FD-473F-8427-99791DC0EF56.jpg?v=1791027990"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/C12AB456-5C8F-4EF4-B2CB-AB0B952C3BD1.jpg?v=1791027989"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/54699A44-BB82-4277-8E15-EF9AE7C3EE5B.jpg?v=1791027990"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/D69A398E-B22A-472E-81B8-31838FC24FD3.jpg?v=1791027990"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/05C415B4-1ED8-48BD-BF99-CDDAD4B3D9E7.jpg?v=1791027989"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 115, 'https://www.lifeatelie.com.br/products/bolsa-sara-p-off-white'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sara-p-off-white');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sara P - Azul Marinho', 'Sara', 'BLSP09', 389.90, null,
  'A Bolsa Sara P traz o charme do matelassê em uma versão compacta e estruturada. Pequena por fora e prática por dentro, é uma bolsa elegante para quem gosta de levar o essencial bem organizado.

Como usar
Use pela alça de mão para um visual mais clássico ou com a alça tiracolo ajustável para ter mais liberdade no dia a dia.

Espaço interno
Possui duas divisões com zíper de metal, além de bolso frontal com zíper para deixar os itens que você mais usa sempre à mão. O interior recebe forro vermelho, um detalhe marcante da peça.

Ocasiões
Perfeita para o dia a dia, passeios, almoços, viagens e compromissos em que você quer uma bolsa menor, prática e elegante.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com matelassê na parte frontal e traseira, ferragens com banho dourado e acabamento cuidadosamente trabalhado.', 'Altura: 14 cm
Largura: 21 cm
Profundidade: 10 cm
Peso: 450 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-0168.jpg?v=1791029871"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-0167.jpg?v=1791029872"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-0166.jpg?v=1791029872"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-0170.jpg?v=1791029871"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-0169.jpg?v=1791029872"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 116, 'https://www.lifeatelie.com.br/products/bolsa-sara-p-azul-marinho'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sara-p-azul-marinho');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sara P - Verde Militar', 'Sara', 'BLSP10', 389.90, null,
  'A Bolsa Sara P traz o charme do matelassê em uma versão compacta e estruturada. Pequena por fora e prática por dentro, é uma bolsa elegante para quem gosta de levar o essencial bem organizado.

Como usar
Use pela alça de mão para um visual mais clássico ou com a alça tiracolo ajustável para ter mais liberdade no dia a dia.

Espaço interno
Possui duas divisões com zíper de metal, além de bolso frontal com zíper para deixar os itens que você mais usa sempre à mão. O interior recebe forro vermelho, um detalhe marcante da peça.

Ocasiões
Perfeita para o dia a dia, passeios, almoços, viagens e compromissos em que você quer uma bolsa menor, prática e elegante.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com matelassê na parte frontal e traseira, ferragens com banho dourado e acabamento cuidadosamente trabalhado.', 'Altura: 14 cm
Largura: 21 cm
Profundidade: 10 cm
Peso: 450 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-0142.jpg?v=1791024093"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-0143.jpg?v=1791024093"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-0144.jpg?v=1791024093"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-0146.png?v=1791024094"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-0145.png?v=1791024094"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 117, 'https://www.lifeatelie.com.br/products/bolsa-sara-p-verde-militar'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sara-p-verde-militar');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Sara P - Vermelho Bordô', 'Sara', 'BLSP05', 389.90, null,
  'A Bolsa Sara P traz o charme do matelassê em uma versão compacta e estruturada. Pequena por fora e prática por dentro, é uma bolsa elegante para quem gosta de levar o essencial bem organizado.

Como usar
Use pela alça de mão para um visual mais clássico ou com a alça tiracolo ajustável para ter mais liberdade no dia a dia.

Espaço interno
Possui duas divisões com zíper de metal, além de bolso frontal com zíper para deixar os itens que você mais usa sempre à mão. O interior recebe forro vermelho, um detalhe marcante da peça.

Ocasiões
Perfeita para o dia a dia, passeios, almoços, viagens e compromissos em que você quer uma bolsa menor, prática e elegante.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com matelassê na parte frontal e traseira, ferragens com banho dourado e acabamento cuidadosamente trabalhado.', 'Altura: 14 cm
Largura: 21 cm
Profundidade: 10 cm
Peso: 450 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1DFA1DDB-AB46-475C-9561-7EE955D7AA30.jpg?v=1791024219"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/3D341CE9-463B-4CD5-AC81-4C3DACE4851B.jpg?v=1791024220"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/C582F011-C4B2-45D4-88ED-AD3BD4A00684.jpg?v=1791024219"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/056FD5B9-FABF-4ADC-B6D1-47CA72660CD7.jpg?v=1791024220"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/AA9BC3D0-F864-4740-AB3E-013CBA455F28.jpg?v=1791024220"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 118, 'https://www.lifeatelie.com.br/products/bolsa-sara-p-vermelho-bordo'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-sara-p-vermelho-bordo');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Mochila Vic - Off White & Sela', 'Mochilas', null, 599.90, null,
  'A mochila Vic elegante e funcional, feita para acompanhar sua rotina sem abrir mão do estilo. O acabamento matelassê e as ferragens com banho dourado dão um toque sofisticado à peça.

Como usar
Use nas costas para ter as mãos livres ou pela alça superior para um visual mais arrumado. Funciona muito bem com looks de trabalho e também no dia a dia.

Espaço interno
Possui compartimento interno forrado na cor vermelha, bolso interno funcional, bolso externo traseiro e bolso frontal com zíper de metal. O espaço interno comporta notebook de até 15,8”.

Ocasiões
Ideal para trabalho, estudos, viagens e para aqueles dias em que você precisa levar tudo com praticidade.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com acabamento matelassê e puxadores em couro. As marcas e variações naturais do couro fazem parte da identidade de cada peça.', 'Altura: 38 cm
Largura: 30 cm
Profundidade: 12 cm
Peso: 900 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E8A67DEF-CF78-4727-9F02-FE528F5264A8.png?v=1790561139"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/58499925-EA4E-4201-AC30-7A25C8ACEA2B.png?v=1790561100"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/3D302B5F-743C-47A2-A657-549D30C76FF9.jpg?v=1790561100"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B43A9E8C-5935-49E9-9816-E98D2F26DC56.jpg?v=1790561100"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/18866F1A-FA12-46AC-95FB-C4314377BB16.jpg?v=1790561100"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/68097D67-1C9A-49BC-88A3-E53563FE744C.jpg?v=1777308659"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 119, 'https://www.lifeatelie.com.br/products/mochila-vic-off-white-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/mochila-vic-off-white-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Mochila Vic - Verde Militar', 'Mochilas', null, 599.90, null,
  'A mochila Vic elegante e funcional, feita para acompanhar sua rotina sem abrir mão do estilo. O acabamento matelassê e as ferragens com banho dourado dão um toque sofisticado à peça.

Como usar
Use nas costas para ter as mãos livres ou pela alça superior para um visual mais arrumado. Funciona muito bem com looks de trabalho e também no dia a dia.

Espaço interno
Possui compartimento interno forrado na cor vermelha, bolso interno funcional, bolso externo traseiro e bolso frontal com zíper de metal. O espaço interno comporta notebook de até 15,8”.

Ocasiões
Ideal para trabalho, estudos, viagens e para aqueles dias em que você precisa levar tudo com praticidade.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com acabamento matelassê e puxadores em couro. As marcas e variações naturais do couro fazem parte da identidade de cada peça.', 'Altura: 38 cm
Largura: 30 cm
Profundidade: 12 cm
Peso: 900 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9DD45E13-386F-43F7-8E76-F95E8CA6EAB5.png?v=1790551969"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/FF68A2FF-5C8F-4813-BDAE-485E9ADFC895.jpg?v=1790551969"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/562523AF-85D3-42D1-8626-A91C538F9798.jpg?v=1790551968"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/00040B14-4457-422E-9B02-3A64BDB8CFDA.png?v=1790552047"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/4BDF787C-C45C-4724-9444-079780AD90FF.jpg?v=1790551969"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/68097D67-1C9A-49BC-88A3-E53563FE744C.jpg?v=1777308659"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 120, 'https://www.lifeatelie.com.br/products/mochila-vic-verde-militar'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/mochila-vic-verde-militar');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Mochila Vic - Preta', 'Mochilas', null, 599.90, null,
  'A mochila Vic elegante e funcional, feita para acompanhar sua rotina sem abrir mão do estilo. O acabamento matelassê e as ferragens com banho dourado dão um toque sofisticado à peça.

Como usar
Use nas costas para ter as mãos livres ou pela alça superior para um visual mais arrumado. Funciona muito bem com looks de trabalho e também no dia a dia.

Espaço interno
Possui compartimento interno forrado na cor vermelha, bolso interno funcional, bolso externo traseiro e bolso frontal com zíper de metal. O espaço interno comporta notebook de até 15,8”.

Ocasiões
Ideal para trabalho, estudos, viagens e para aqueles dias em que você precisa levar tudo com praticidade.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com acabamento matelassê e puxadores em couro. As marcas e variações naturais do couro fazem parte da identidade de cada peça.', 'Altura: 38 cm
Largura: 30 cm
Profundidade: 12 cm
Peso: 900 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/501976E7-287C-4D38-9B8B-DA3019470735.png?v=1790552239"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/C9439EB9-D7A8-4EB8-9733-31DADD356B45.png?v=1790552186"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/9E1E0313-748B-468F-A901-4027086F4E2C.jpg?v=1790552186"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/FA1ECB4C-0205-4B44-9F43-0DB549CA767D.jpg?v=1790552186"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/AB37530D-3308-4880-81A8-CFCF7A1329E3.jpg?v=1790552186"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/68097D67-1C9A-49BC-88A3-E53563FE744C.jpg?v=1777308659"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 121, 'https://www.lifeatelie.com.br/products/mochila-vic-preta'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/mochila-vic-preta');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Mochila Vic - Sela', 'Mochilas', null, 599.90, null,
  'A mochila Vic elegante e funcional, feita para acompanhar sua rotina sem abrir mão do estilo. O acabamento matelassê e as ferragens com banho dourado dão um toque sofisticado à peça.

Como usar
Use nas costas para ter as mãos livres ou pela alça superior para um visual mais arrumado. Funciona muito bem com looks de trabalho e também no dia a dia.

Espaço interno
Possui compartimento interno forrado na cor vermelha, bolso interno funcional, bolso externo traseiro e bolso frontal com zíper de metal. O espaço interno comporta notebook de até 15,8”.

Ocasiões
Ideal para trabalho, estudos, viagens e para aqueles dias em que você precisa levar tudo com praticidade.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com acabamento matelassê e puxadores em couro. As marcas e variações naturais do couro fazem parte da identidade de cada peça.', 'Altura: 38 cm
Largura: 30 cm
Profundidade: 12 cm
Peso: 900 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/AA68E138-053F-4C4C-A777-85FE9A841515.png?v=1790552364"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/A5609268-8323-4060-9A68-94C16F18D67B.jpg?v=1790552363"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/5359ADBE-096F-4954-B82D-62F3DE27F85C.jpg?v=1790552364"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/53C06C81-AB35-4259-8593-BFF2892FFD4C.jpg?v=1790552364"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/8D520721-2CAD-4FF5-9169-708B2020821D.png?v=1790552407"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/68097D67-1C9A-49BC-88A3-E53563FE744C.jpg?v=1777308659"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 122, 'https://www.lifeatelie.com.br/products/mochila-vic-sela'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/mochila-vic-sela');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Mochila Vic - Café', 'Mochilas', null, 599.90, null,
  'A mochila Vic elegante e funcional, feita para acompanhar sua rotina sem abrir mão do estilo. O acabamento matelassê e as ferragens com banho dourado dão um toque sofisticado à peça.

Como usar
Use nas costas para ter as mãos livres ou pela alça superior para um visual mais arrumado. Funciona muito bem com looks de trabalho e também no dia a dia.

Espaço interno
Possui compartimento interno forrado na cor vermelha, bolso interno funcional, bolso externo traseiro e bolso frontal com zíper de metal. O espaço interno comporta notebook de até 15,8”.

Ocasiões
Ideal para trabalho, estudos, viagens e para aqueles dias em que você precisa levar tudo com praticidade.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com acabamento matelassê e puxadores em couro. As marcas e variações naturais do couro fazem parte da identidade de cada peça.', 'Altura: 38 cm
Largura: 30 cm
Profundidade: 12 cm
Peso: 900 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/AE2A4150-86CE-4526-A6DF-763DA9FED31E.png?v=1790546494"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/3349EFED-C0C6-4D02-AC3B-3760D11ECEB5.jpg?v=1790546494"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/39FDE551-BD5C-4393-94A4-E25D8064498A.jpg?v=1790546495"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/642C0D21-76D0-4C74-AE29-E435B44A0F29.jpg?v=1790546535"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-9662.png?v=1790551285"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/68097D67-1C9A-49BC-88A3-E53563FE744C.jpg?v=1777308659"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 123, 'https://www.lifeatelie.com.br/products/mochila-vic-cafe'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/mochila-vic-cafe');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Clara - Bronze', 'Clara', 'CLARA-BRONZE', 299.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Clara tem design moderno e praticidade em um formato bucket, cheio de personalidade. Delicada na proporção e marcante nos detalhes, é a escolha ideal para acompanhar seu passeio .

Seu fechamento em corda com ilhas adiciona um toque contemporâneo ao design, além de proporcionar praticidade no uso diário. A alça tiracolo regulável permite um ajuste confortável, adaptando-se facilmente a diferentes momentos.

O interior totalmente forrado conta com bolso interno funcional para manter os itens essenciais organizados.

Uma bolsa pensada para mulheres que apreciam detalhes sofisticados, refinados e elegantes descomplicados.

Exclusividade Life Ateliê.',
  'Couro legítimo', 'Altura: 21 cm
Largura: 26 cm
Profundidade: 10 cm
Peso: 450 g', 'Couro legítimo
Forro interno vermelho
Bolso interno com zíper
Fechamento em corda com ilhós
Alça tiracolo regulável
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/DF21B187-C415-4892-9559-2A62F42CC40E.jpg?v=1769642814"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/B0A44571-FFA8-4A71-967F-CF927558F8B0.jpg?v=1769642814"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/7D3DCB19-F027-4419-8F9A-18EABC560E75.jpg?v=1769642814"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 124, 'https://www.lifeatelie.com.br/products/bolsa-clara-bronze'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-clara-bronze');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Clara - Dourado', 'Clara', 'CLARA-DOURADA', 299.90, null,
  'Essencial, elegante e atemporal.

A Bolsa Clara tem design moderno e praticidade em um formato bucket, cheio de personalidade. Delicada na proporção e marcante nos detalhes, é a escolha ideal para acompanhar seu passeio .

Seu fechamento em corda com ilhas adiciona um toque contemporâneo ao design, além de proporcionar praticidade no uso diário. A alça tiracolo regulável permite um ajuste confortável, adaptando-se facilmente a diferentes momentos.

O interior totalmente forrado conta com bolso interno funcional para manter os itens essenciais organizados.

Uma bolsa pensada para mulheres que apreciam detalhes sofisticados, refinados e elegantes descomplicados.

Exclusividade Life Ateliê.

.',
  'Couro legítimo', 'Altura: 21 cm
Largura: 26 cm
Profundidade: 10 cm
Peso: 450 g', 'Couro legítimo
Forro interno vermelho
Bolso interno com zíper
Fechamento em corda com ilhós
Alça tiracolo regulável
Ferragens com banho dourado',
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-1297.jpg?v=1769639492"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/LIFE_ATELIE_-_insta_e_Trafego_Pago_mais_qualidade.jpg?v=1779904494"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-1298.jpg?v=1769639492"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/IMG-1299.jpg?v=1769639492"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 125, 'https://www.lifeatelie.com.br/products/bolsa-clara-dourado'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-clara-dourado');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Mochila Vic - Azul Marinho', 'Mochilas', null, 599.90, null,
  'A mochila Vic elegante e funcional, feita para acompanhar sua rotina sem abrir mão do estilo. O acabamento matelassê e as ferragens com banho dourado dão um toque sofisticado à peça.

Como usar
Use nas costas para ter as mãos livres ou pela alça superior para um visual mais arrumado. Funciona muito bem com looks de trabalho e também no dia a dia.

Espaço interno
Possui compartimento interno forrado na cor vermelha, bolso interno funcional, bolso externo traseiro e bolso frontal com zíper de metal. O espaço interno comporta notebook de até 15,8”.

Ocasiões
Ideal para trabalho, estudos, viagens e para aqueles dias em que você precisa levar tudo com praticidade.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com acabamento matelassê e puxadores em couro. As marcas e variações naturais do couro fazem parte da identidade de cada peça.', 'Altura: 38 cm
Largura: 30 cm
Profundidade: 12 cm
Peso: 900 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E5D1763A-AAB7-41F8-9228-AA1775085184.png?v=1790551535"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E5B637BD-2F8B-499C-AF1F-3C76E1EC91DF.jpg?v=1790551534"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E01F0781-1858-4E50-81F2-5593D514A671.png?v=1790551575"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/BFF04612-B39F-4DC1-9FAD-3F95F1E2152A.jpg?v=1790551534"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/E0AAAF99-ED30-4A9F-B96B-DB97ACDEE6EC.jpg?v=1790551534"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/68097D67-1C9A-49BC-88A3-E53563FE744C.jpg?v=1777308659"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 126, 'https://www.lifeatelie.com.br/products/mochila-vic-azul-marinho'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/mochila-vic-azul-marinho');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Mochila Vic - Vermelho Cereja', 'Mochilas', null, 599.90, null,
  'A mochila Vic elegante e funcional, feita para acompanhar sua rotina sem abrir mão do estilo. O acabamento matelassê e as ferragens com banho dourado dão um toque sofisticado à peça.

Como usar
Use nas costas para ter as mãos livres ou pela alça superior para um visual mais arrumado. Funciona muito bem com looks de trabalho e também no dia a dia.

Espaço interno
Possui compartimento interno forrado na cor vermelha, bolso interno funcional, bolso externo traseiro e bolso frontal com zíper de metal. O espaço interno comporta notebook de até 15,8”.

Ocasiões
Ideal para trabalho, estudos, viagens e para aqueles dias em que você precisa levar tudo com praticidade.

Exclusividade Life Ateliê.',
  'Confeccionada em couro legítimo, com acabamento matelassê e puxadores em couro. As marcas e variações naturais do couro fazem parte da identidade de cada peça.', 'Altura: 38 cm
Largura: 30 cm
Profundidade: 12 cm
Peso: 900 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/DFDF5F51-3E3D-49C9-8954-8B0873DE94DC.png?v=1790551810"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/4BA55A24-603D-4A8B-BF7C-5B7D35E45262.png?v=1790551749"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/4C727102-16D0-4E3D-AACD-DC34237F6317.jpg?v=1790551749"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/7FEB4766-E15B-47C2-9E80-94ED11045C78.jpg?v=1790551749"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/08AAF935-5BCD-41C5-B7AA-B621A433A20D.jpg?v=1790551750"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/68097D67-1C9A-49BC-88A3-E53563FE744C.jpg?v=1777308659"}]'::jsonb, '[{"nome":"","quantidade":null}]'::jsonb, true, false, 127, 'https://www.lifeatelie.com.br/products/mochila-vic-vermelho-cereja'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/mochila-vic-vermelho-cereja');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Carmem - Verde Militar', 'Carmem', 'CARMEM-MILITAR', 489.90, null,
  'A bolsa Carmem Estruturada, elegante e atemporal, combina sofisticação com uma organização que facilita a rotina. O design clássico e os detalhes em dourado fazem dela uma peça que você pode usar por muitos anos.

Como usar
Use pelas alças de mão para um visual mais sofisticado ou na transversal com a alça ajustável e removível, trazendo mais liberdade e conforto para o dia a dia.

Espaço interno
São três compartimentos principais: duas divisões com zíper de metal e uma divisão central com fechamento magnético. Conta ainda com um bolso interno para pequenos objetos.

Ocasiões
Perfeita para o trabalho, compromissos, almoços, eventos e ocasiões em que você quer estar elegante sem abrir mão da praticidade.',
  'Confeccionada em couro legítimo, com estrutura reforçada, zíperes de metal com puxadores em couro e ferragens com banho dourado. As características naturais do couro tornam cada peça única.', 'Altura: 22 cm
Largura: 28 cm
Profundidade: 18,5 cm
Peso: 800 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/41F44D89-888B-4089-9A7F-3634041B23BD.jpg?v=1790701522"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/4B204DE5-365A-4CF7-8DD2-72A4168918E7.jpg?v=1790701522"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/7AFD4113-5289-4788-97F0-F7585BDC3A2F.png?v=1790701522"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1014ABC3-71E5-47D8-9B89-68DACAC27634.jpg?v=1790701056"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 128, 'https://www.lifeatelie.com.br/products/bolsa-carmem-verde-militar'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-carmem-verde-militar');

insert into public.produtos
  (nome, categoria, codigo, preco, preco_antigo, descricao, materiais, medidas, caracteristicas, fotos, variacoes, visivel, destaque, ordem, origem_url)
select 'Bolsa Carmem - Fendi', 'Carmem', 'CARMEM-FENDI', 489.90, null,
  'A bolsa Carmem Estruturada, elegante e atemporal, combina sofisticação com uma organização que facilita a rotina. O design clássico e os detalhes em dourado fazem dela uma peça que você pode usar por muitos anos.

Como usar
Use pelas alças de mão para um visual mais sofisticado ou na transversal com a alça ajustável e removível, trazendo mais liberdade e conforto para o dia a dia.

Espaço interno
São três compartimentos principais: duas divisões com zíper de metal e uma divisão central com fechamento magnético. Conta ainda com um bolso interno para pequenos objetos.

Ocasiões
Perfeita para o trabalho, compromissos, almoços, eventos e ocasiões em que você quer estar elegante sem abrir mão da praticidade.',
  'Confeccionada em couro legítimo, com estrutura reforçada, zíperes de metal com puxadores em couro e ferragens com banho dourado. As características naturais do couro tornam cada peça única.', 'Altura: 22 cm
Largura: 28 cm
Profundidade: 18,5 cm
Peso: 800 g', null,
  '[{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/50F384F0-05B2-44BA-98A7-456DCA42E27E.png?v=1790701406"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1F1B54AB-453B-4509-A66E-950EC7FA873C.png?v=1790701406"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/98DAF267-79A0-4B2F-BC33-13B7FDE379C0.png?v=1790701406"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/CC8776C1-B049-43A3-99F7-30766E88FED9.jpg?v=1790701405"},{"url":"https://cdn.shopify.com/s/files/1/0681/1628/3443/files/1014ABC3-71E5-47D8-9B89-68DACAC27634.jpg?v=1790701056"}]'::jsonb, '[{"nome":"","quantidade":0}]'::jsonb, true, false, 129, 'https://www.lifeatelie.com.br/products/bolsa-carmem-fendi'
where not exists (select 1 from public.produtos where origem_url = 'https://www.lifeatelie.com.br/products/bolsa-carmem-fendi');

select count(*) as total_de_produtos from public.produtos;
