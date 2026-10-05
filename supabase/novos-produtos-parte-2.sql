-- =====================================================================
-- Produtos novos — parte 2 de 2 (páginas 2 a 5 do site)
-- 50 produtos copiados de lifeatelie.com.br
-- Rode DEPOIS do esquema.sql (Supabase → SQL Editor → New query → Run).
-- Pode rodar de novo: produtos que já existem (mesmo link do site) são pulados.
-- Arquivo gerado por ferramentas/gerar-sql.mjs — não edite à mão.
-- =====================================================================

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
