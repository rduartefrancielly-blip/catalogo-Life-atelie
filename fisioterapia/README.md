# Letícia Bernucci Fisioterapia — prontuário (protótipo)

Sistema para organizar pacientes de liberação miofascial e terapia instrumental: cadastro, anamnese, atendimentos com evolução, documentos e PDF do prontuário.

> **Protótipo.** Ainda não passou por validação de segurança, jurídica (LGPD) nem pelas normas profissionais. Até essa validação, use **apenas dados fictícios**. O sistema não afirma estar em conformidade com nenhuma norma.

## Como abrir

- **Pelo link** (depois que esta pasta estiver na branch principal e o GitHub Pages estiver ligado): `https://rduartefrancielly-blip.github.io/catalogo-Life-atelie/fisioterapia/`
- **Direto no computador:** baixe a pasta `fisioterapia/` inteira e abra o `index.html` no Chrome, Edge, Firefox ou Safari. Funciona sem internet.

No primeiro acesso, crie uma senha. Por padrão o sistema carrega 4 pacientes **fictícios**, marcados como "Fictício", para teste. Para removê-los: **Configurações → Dados fictícios**.

## Dia a dia

| Quero… | Como |
|---|---|
| Atender alguém | **Novo atendimento** → escolha o paciente → preencha as etapas → **Registrar atendimento** |
| Cadastrar paciente | **Cadastrar paciente** → dados essenciais (nome, nascimento, telefone) → **Concluir cadastro** |
| Preencher a anamnese | No perfil do paciente → aba **Anamnese** → **Preencher anamnese** |
| Parar no meio e continuar depois | Tudo é salvo sozinho. Também há **Salvar rascunho** na barra de baixo. O rascunho aparece no painel, em "Continuar de onde parou" |
| Achar um paciente | Busca do painel ou **Pacientes** (nome sem acento ou parte do telefone) |
| Corrigir um registro concluído | Abra o registro → **Corrigir registro** → altere → **Salvar correção** (fica "Corrigido em…"; a versão anterior vai para o histórico) |
| Baixar PDF | No perfil, na anamnese ou no atendimento → **Baixar em PDF** → escolha o que entra (cadastro, anamnese, atendimentos e período) |
| Marcar retorno | Na última etapa do atendimento ou no perfil → **Próximo retorno** |
| Guardar documentos | Perfil → aba **Documentos** (imagens ou PDF, até 15 MB, guardados cifrados) |
| Exportar ou excluir dados de um paciente | Perfil → aba **Privacidade** |
| Fazer cópia de segurança | **Configurações → Segurança e cópias → Exportar cópia de segurança** (toda semana) |

O indicador acima dos botões mostra **"Salvando…"**, **"Salvo às 14:32"** ou **"Falha ao salvar"** (com **Tentar de novo**). Se falhar, nada do que foi digitado sai da tela.

## PDF

- Arquivo real, A4, pronto para imprimir: `Prontuario_NomeDoPaciente_AAAA-MM-DD.pdf`.
- Cabeçalho com a marca e **só** a identificação profissional preenchida em **Configurações → Identificação profissional** (nada é inventado).
- Nome do paciente, data de geração e "Página X de Y" em todas as páginas. Nunca entra dado de outro paciente.
- Depois do download, o sistema explica onde o navegador costuma guardar o arquivo (computador, Android ou iPhone/iPad). Ele não tem acesso às pastas, por isso não afirma onde o arquivo ficou.

## Logotipo

O arquivo original da marca ainda não foi incluído. Enquanto isso aparece um monograma "LB" em texto. Para usar o original (sem distorcer):

- **Configurações → Identidade visual → Usar este logotipo** (PNG com fundo transparente, de preferência), ou
- coloque o arquivo em `fisioterapia/img/logo.png`.

## Segurança e limites

- Os dados ficam **só neste navegador, neste aparelho**, cifrados (AES-GCM 256, chave derivada da senha com PBKDF2-SHA-256, 600 mil iterações). Não há servidor.
- Bloqueio automático após inatividade (padrão: 15 min) e botão **Bloquear** sempre visível.
- O endereço da página e o título da aba não mostram nomes de pacientes. O painel não mostra dados clínicos.
- **Não há recuperação de senha.** Esquecer a senha = perder o acesso (a não ser por uma cópia de segurança).
- Limpar os dados do navegador ou usar janela anônima apaga/esconde os dados.
- Não há login em servidor nem sincronização entre aparelhos.
- O PDF e a exportação em JSON **não** são cifrados; a cópia de segurança é.
- Os textos de consentimento são sugestões em linguagem simples e precisam de revisão jurídica (editáveis em Configurações).

## Fichas

Os campos foram definidos a partir da ficha avaliativa de referência (identificação, queixa, triagem de segurança, avaliação física, raciocínio clínico, intervenção, reavaliação e plano), reorganizados em etapas curtas. Nenhum campo gera diagnóstico ou conclusão automática.

Em **Configurações → Fichas e campos** é possível ocultar campos e etapas opcionais, editar as listas de técnicas e regiões do corpo e criar perguntas adicionais. Campos obrigatórios sempre aparecem.

## Estrutura

```
index.html            página única do sistema
css/app.css           cores, fontes e layout (inclui impressão)
js/banco.js           armazenamento local cifrado (IndexedDB + Web Crypto)
js/esquemas.js        campos das fichas (cadastro, anamnese, atendimento)
js/formulario.js      formulários em etapas com salvamento automático
js/pdf.js             geração do PDF
js/telas-*.js         telas (acesso, painel, pacientes, perfil, configurações)
js/demo.js            pacientes fictícios
vendor/jspdf/         jsPDF 4.2.1 (licença MIT)
fontes/               Atkinson Hyperlegible e Cormorant Garamond (licença SIL OFL)
```
