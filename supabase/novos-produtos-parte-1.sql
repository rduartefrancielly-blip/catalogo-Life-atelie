-- =====================================================================
-- Produtos novos — parte 1 de 2 (páginas 2 a 5 do site)
-- 50 produtos copiados de lifeatelie.com.br
-- Rode DEPOIS do esquema.sql (Supabase → SQL Editor → New query → Run).
-- Pode rodar de novo: produtos que já existem (mesmo link do site) são pulados.
-- Arquivo gerado por ferramentas/gerar-sql.mjs — não edite à mão.
-- =====================================================================

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

select count(*) as total_de_produtos from public.produtos;
