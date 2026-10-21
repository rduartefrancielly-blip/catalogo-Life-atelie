/*
  Estrutura das fichas: cadastro, anamnese e atendimento (evolução).
  Campos com "config: true" podem ser ocultados em Configurações > Fichas.
  Campos obrigatórios nunca são ocultados.
  Tipos: texto, longo, data, hora, telefone, email, cpf, cep, numero, unica, multipla, escala, consentimento, aviso.
*/
(function (LB) {
  "use strict";

  const SIM_NAO = ["Sim", "Não"];
  const IMPACTO = ["Nenhum", "Pouco", "Moderado", "Muito"];

  const LISTAS_PADRAO = {
    tecnicas: [
      "Liberação miofascial manual",
      "Terapia instrumental",
      "Ventosaterapia",
      "Alongamento",
      "Fortalecimento",
      "Orientação postural",
      "Exercícios para casa"
    ],
    regioes: [
      "Cervical", "Trapézio e ombros", "Torácica (costas)", "Lombar", "Glúteos", "Quadril",
      "Coxa (frente)", "Coxa (trás)", "Panturrilha", "Pés", "Braços", "Antebraços e mãos", "Abdômen", "Face e mandíbula"
    ]
  };

  const CONSENTIMENTOS_PADRAO = {
    consentDados: "Autorizo o registro e o uso dos meus dados pessoais e de saúde somente para o meu atendimento e acompanhamento fisioterapêutico. Posso pedir para ver, corrigir ou excluir meus dados.",
    consentAtendimento: "Recebi explicação sobre a liberação miofascial e a terapia instrumental, seus objetivos e possíveis desconfortos. Sei que posso pedir para pausar ou interromper a qualquer momento.",
    consentFotos: "Autorizo fotos da região tratada apenas para acompanhamento do meu atendimento. As fotos não serão divulgadas.",
    consentMensagens: "Autorizo receber lembretes e mensagens sobre meus atendimentos por WhatsApp ou e-mail."
  };

  const ESCALA_AJUDA = "0 = sem dor · 1 a 3 = leve · 4 a 6 = moderada · 7 a 9 = intensa · 10 = a pior dor que a pessoa consegue imaginar. Pergunte e registre o número que a pessoa disser.";

  const FICHAS = {
    cadastro: {
      titulo: "Cadastro do paciente",
      nomeCurto: "cadastro",
      concluir: "Concluir cadastro",
      etapas: [
        {
          id: "pessoais", titulo: "Dados pessoais",
          campos: [
            { id: "nome", rotulo: "Nome completo", tipo: "texto", obrig: true },
            { id: "nomeSocial", rotulo: "Nome social", tipo: "texto", config: true, ajuda: "Como a pessoa prefere ser chamada. Se preenchido, é o nome mostrado nas telas." },
            { id: "nascimento", rotulo: "Data de nascimento", tipo: "data", obrig: true, larg: "meia" },
            { id: "cpf", rotulo: "CPF", tipo: "cpf", config: true, larg: "meia", ajuda: "Preencha só se for necessário, por exemplo para recibos." }
          ]
        },
        {
          id: "contato", titulo: "Contato e endereço",
          campos: [
            { id: "telefone", rotulo: "Telefone com DDD", tipo: "telefone", obrig: true, larg: "meia" },
            { id: "telefoneWhats", rotulo: "Este telefone tem WhatsApp?", tipo: "unica", opcoes: SIM_NAO, config: true },
            { id: "email", rotulo: "E-mail", tipo: "email", config: true },
            { id: "cep", rotulo: "CEP", tipo: "cep", config: true, larg: "meia" },
            { id: "endereco", rotulo: "Endereço (rua e número)", tipo: "texto", config: true, ajuda: "Útil para atendimento domiciliar." },
            { id: "complemento", rotulo: "Complemento", tipo: "texto", config: true, larg: "meia" },
            { id: "bairro", rotulo: "Bairro", tipo: "texto", config: true, larg: "meia" },
            { id: "cidade", rotulo: "Cidade e estado", tipo: "texto", config: true, larg: "meia" }
          ]
        },
        {
          id: "emergencia", titulo: "Contato de emergência",
          descricao: "Opcional. Quem avisar se for preciso durante o atendimento.",
          config: true,
          campos: [
            { id: "emergNome", rotulo: "Nome", tipo: "texto" },
            { id: "emergVinculo", rotulo: "Vínculo", tipo: "texto", larg: "meia", placeholder: "Ex.: mãe, cônjuge, amiga" },
            { id: "emergTelefone", rotulo: "Telefone", tipo: "telefone", larg: "meia" }
          ]
        },
        {
          id: "administrativo", titulo: "Dados administrativos",
          campos: [
            { id: "profissao", rotulo: "Profissão ou atividade principal", tipo: "texto", config: true },
            { id: "contatoPreferido", rotulo: "Forma de contato preferida", tipo: "unica", opcoes: ["WhatsApp", "Ligação", "E-mail"], config: true },
            { id: "melhorHorario", rotulo: "Melhor horário para contato", tipo: "texto", config: true, placeholder: "Ex.: manhãs" },
            { id: "obsAdmin", rotulo: "Observações administrativas", tipo: "longo", config: true, ajuda: "Ex.: forma de pagamento, recibo, acesso ao local. Não registre dados clínicos aqui." }
          ]
        },
        {
          id: "consentimentos", titulo: "Consentimentos e autorizações",
          descricao: "Leia cada item com a pessoa, em linguagem simples. Registre a resposta, a data e como foi registrado.",
          campos: [
            { id: "consentDados", rotulo: "Uso dos dados pessoais e de saúde", tipo: "consentimento" },
            { id: "consentAtendimento", rotulo: "Atendimento com liberação miofascial e terapia instrumental", tipo: "consentimento" },
            { id: "consentFotos", rotulo: "Fotos para acompanhamento", tipo: "consentimento", config: true },
            { id: "consentMensagens", rotulo: "Lembretes e mensagens", tipo: "consentimento", config: true }
          ]
        }
      ]
    },

    anamnese: {
      titulo: "Anamnese",
      nomeCurto: "anamnese",
      concluir: "Concluir anamnese",
      etapas: [
        {
          id: "motivo", titulo: "Motivo da consulta",
          campos: [
            { id: "dataAvaliacao", rotulo: "Data da avaliação", tipo: "data", obrig: true, larg: "meia", padrao: "hoje" },
            { id: "profissional", rotulo: "Profissional responsável", tipo: "texto", obrig: true, larg: "meia", padrao: "profissional", ajuda: "Vem preenchido com o nome salvo em Configurações." },
            { id: "motivo", rotulo: "Motivo da consulta", tipo: "longo", obrig: true, ajuda: "Por que a pessoa procurou atendimento agora?" },
            { id: "objetivo", rotulo: "Objetivo do paciente", tipo: "longo", ajuda: "O que a pessoa gostaria que melhorasse? Use as palavras dela." },
            { id: "dominancia", rotulo: "Lado dominante", tipo: "unica", opcoes: ["Destro(a)", "Canhoto(a)", "Ambidestro(a)"], config: true }
          ]
        },
        {
          id: "queixa", titulo: "Queixa principal",
          campos: [
            { id: "queixa", rotulo: "Queixa principal, nas palavras do paciente", tipo: "longo", obrig: true },
            { id: "regiao", rotulo: "Localização da dor ou desconforto", tipo: "texto", obrig: true, placeholder: "Ex.: lombar, ombro, panturrilha" },
            { id: "lado", rotulo: "Lado do corpo", tipo: "unica", opcoes: ["Direito", "Esquerdo", "Ambos os lados", "Linha média", "Difusa (espalhada)"] },
            { id: "irradiacao", rotulo: "A dor se espalha para outra região? Para onde?", tipo: "longo", config: true },
            { id: "descricao", rotulo: "Como a pessoa descreve o que sente?", tipo: "multipla", opcoes: ["Dor", "Peso", "Tensão", "Rigidez", "Queimação", "Formigamento", "Dormência", "Fraqueza"], ajuda: "Marque todas que se aplicam." },
            { id: "frequencia", rotulo: "Frequência", tipo: "unica", opcoes: ["Constante", "Todos os dias, em alguns momentos", "Algumas vezes por semana", "De vez em quando"] },
            { id: "duracao", rotulo: "Quanto tempo dura cada episódio?", tipo: "texto", placeholder: "Ex.: alguns minutos, horas, o dia todo" }
          ]
        },
        {
          id: "historia", titulo: "Início e evolução",
          campos: [
            { id: "inicioQuando", rotulo: "Quando começou?", tipo: "texto", ajuda: "Pode ser aproximado. Ex.: há 3 meses, março de 2026." },
            { id: "inicioTipo", rotulo: "Como começou?", tipo: "unica", opcoes: ["Súbito", "Gradual", "Após esforço", "Após trauma ou queda", "Sem causa aparente"] },
            { id: "inicioContexto", rotulo: "O que a pessoa estava fazendo quando começou?", tipo: "longo", config: true },
            { id: "evolucaoQuadro", rotulo: "Como evoluiu desde então?", tipo: "unica", opcoes: ["Melhorando", "Piorando", "Estável", "Vai e volta"] },
            { id: "recorrente", rotulo: "Já teve isso antes?", tipo: "unica", opcoes: SIM_NAO },
            { id: "recorrenteQuando", rotulo: "Quando aconteceu antes?", tipo: "texto", se: { campo: "recorrente", valor: "Sim" } }
          ]
        },
        {
          id: "dor", titulo: "Intensidade da dor",
          descricao: "Escala de 0 a 10. " + ESCALA_AJUDA,
          campos: [
            { id: "dorAgora", rotulo: "Dor agora", tipo: "escala", obrig: true },
            { id: "dorPior", rotulo: "Pior dor nos últimos dias", tipo: "escala", config: true },
            { id: "dorMelhor", rotulo: "Menor dor nos últimos dias", tipo: "escala", config: true },
            { id: "dorHabitual", rotulo: "Dor na maior parte do tempo", tipo: "escala", config: true }
          ]
        },
        {
          id: "fatores", titulo: "O que piora e o que alivia",
          campos: [
            { id: "piora", rotulo: "O que piora?", tipo: "multipla", opcoes: ["Movimento", "Ficar sentado(a)", "Ficar em pé", "Trabalho", "À noite", "Ao acordar", "Esforço físico", "Estresse"] },
            { id: "pioraOutros", rotulo: "Outros fatores que pioram", tipo: "texto" },
            { id: "alivia", rotulo: "O que alivia?", tipo: "multipla", opcoes: ["Repouso", "Movimento", "Calor", "Frio", "Alongamento", "Massagem", "Medicamento"] },
            { id: "aliviaOutros", rotulo: "Outros fatores que aliviam", tipo: "texto" },
            { id: "acordaNoite", rotulo: "A dor acorda a pessoa durante a noite?", tipo: "unica", opcoes: SIM_NAO, config: true },
            { id: "dorRepouso", rotulo: "Sente dor em repouso, sem relação com movimento?", tipo: "unica", opcoes: SIM_NAO, config: true }
          ]
        },
        {
          id: "impacto", titulo: "Impacto no dia a dia",
          campos: [
            { id: "impactoCotidiano", rotulo: "Atividades do dia a dia", tipo: "unica", opcoes: IMPACTO },
            { id: "impactoTrabalho", rotulo: "Trabalho", tipo: "unica", opcoes: IMPACTO },
            { id: "impactoSono", rotulo: "Sono", tipo: "unica", opcoes: IMPACTO },
            { id: "impactoAtividade", rotulo: "Atividade física", tipo: "unica", opcoes: IMPACTO },
            { id: "impactoDetalhes", rotulo: "O que a pessoa não consegue fazer, ou faz com dificuldade?", tipo: "longo" }
          ]
        },
        {
          id: "triagem", titulo: "Triagem de segurança",
          campos: [
            { id: "avisoTriagem", tipo: "aviso", texto: "Estas perguntas ajudam a identificar situações que pedem cautela, adaptação da técnica ou encaminhamento. Marcar um item não gera nenhuma conclusão automática: a avaliação é sua." },
            {
              id: "alertas", rotulo: "Algum destes sinais está presente?", tipo: "multipla", ajuda: "Marque todos que se aplicam.",
              exclusiva: "Nenhum destes sinais",
              opcoes: [
                "Queda, acidente, pancada ou lesão recente",
                "Cirurgia recente ou recuperação de procedimento",
                "Febre, mal-estar importante ou infecção",
                "Região muito inchada, vermelha ou quente",
                "Ferida aberta, queimadura, hematoma ou alteração de pele",
                "Dor muito intensa ou piorando rapidamente",
                "Perda de força, dormência ou formigamento novos",
                "Dor que se espalha para braço ou perna com formigamento ou fraqueza",
                "Falta de ar, dor no peito, desmaio ou outro sintoma geral",
                "Histórico de trombose ou suspeita de problema vascular",
                "Dor noturna persistente ou perda de peso sem explicação",
                "Nenhum destes sinais"
              ]
            },
            { id: "alertasDetalhes", rotulo: "Detalhes dos sinais marcados", tipo: "longo", ajuda: "Se marcou algum sinal, descreva a situação e o que foi decidido." }
          ]
        },
        {
          id: "saude", titulo: "Histórico de saúde",
          campos: [
            {
              id: "condicoes", rotulo: "Tem ou já teve?", tipo: "multipla", ajuda: "Marque todas que se aplicam.",
              opcoes: ["Hipertensão", "Diabetes", "Doença cardíaca", "Problema circulatório", "Varizes importantes", "Trombose ou tromboflebite", "Osteoporose", "Fratura recente", "Câncer ou tratamento oncológico", "Doença autoimune", "Artrite reumatoide", "Doença renal", "Alteração de sensibilidade"]
            },
            { id: "condicoesOutras", rotulo: "Outras doenças ou condições relevantes", tipo: "longo" },
            { id: "cirurgias", rotulo: "Cirurgias (tipo, região e quando)", tipo: "longo" },
            { id: "lesoes", rotulo: "Lesões ou traumas anteriores", tipo: "longo" },
            { id: "tratamentos", rotulo: "Tratamentos anteriores", tipo: "longo", ajuda: "Ex.: fisioterapia, acupuntura, medicamentos. Qual foi o resultado?" },
            { id: "outrosCuidados", rotulo: "Outros acompanhamentos de saúde em andamento", tipo: "longo", config: true }
          ]
        },
        {
          id: "medicamentos", titulo: "Medicamentos e alergias",
          campos: [
            { id: "medicamentos", rotulo: "Medicamentos em uso", tipo: "longo", ajuda: "Nome, dose e frequência, se a pessoa souber." },
            { id: "medicamentosGrupos", rotulo: "Usa algum destes?", tipo: "multipla", opcoes: ["Anticoagulantes", "Antiagregantes plaquetários", "Corticoides", "Analgésicos ou anti-inflamatórios"], config: true },
            { id: "avisoMedicamentos", tipo: "aviso", texto: "Esta informação serve para avaliar se a técnica precisa de adaptação. Não oriente a suspensão de medicamentos." },
            { id: "alergias", rotulo: "Tem alergias?", tipo: "unica", opcoes: ["Sim", "Não", "Não sabe"] },
            { id: "alergiasQuais", rotulo: "Quais alergias?", tipo: "texto", se: { campo: "alergias", valor: "Sim" } },
            { id: "reacaoTopica", rotulo: "Já teve reação a cremes, óleos, luvas ou produtos de pele?", tipo: "longo", ajuda: "Ajuda a escolher os produtos usados no atendimento." }
          ]
        },
        {
          id: "rotina", titulo: "Rotina e hábitos",
          campos: [
            { id: "atividadeFisica", rotulo: "Pratica atividade física?", tipo: "unica", opcoes: SIM_NAO },
            { id: "atividadeQual", rotulo: "Qual atividade e com que frequência?", tipo: "texto", se: { campo: "atividadeFisica", valor: "Sim" } },
            { id: "rotinaTrabalho", rotulo: "Rotina de trabalho e posturas", tipo: "longo", ajuda: "Ex.: horas sentado(a), uso de computador, esforço repetitivo." },
            { id: "sono", rotulo: "Sono (horas por noite e qualidade)", tipo: "texto", config: true },
            { id: "habitos", rotulo: "Outros hábitos pertinentes", tipo: "longo", config: true, ajuda: "Ex.: hidratação, estresse, uso de salto, carregar peso." }
          ]
        },
        {
          id: "avaliacao", titulo: "Avaliação física",
          descricao: "Inspeção, movimento e palpação. Registre os achados; a interpretação é sua.",
          config: true,
          campos: [
            { id: "regiaoAvaliada", rotulo: "Região avaliada", tipo: "texto" },
            { id: "posicaoAvaliacao", rotulo: "Posição durante a avaliação", tipo: "unica", opcoes: ["Em pé", "Sentado(a)", "Deitado(a)", "Outra"] },
            { id: "inspecao", rotulo: "Inspeção (pele, inchaço, assimetrias)", tipo: "longo" },
            { id: "movimentoFuncional", rotulo: "Movimento que provoca a queixa", tipo: "longo", ajuda: "Peça: “faça o movimento que costuma incomodar”." },
            { id: "adm", rotulo: "Amplitude de movimento", tipo: "unica", opcoes: ["Normal / funcional", "Limitada por dor", "Limitada por rigidez", "Limitada por receio", "Limitada por fraqueza"] },
            { id: "dorMovimento", rotulo: "Dor durante o movimento", tipo: "escala" },
            { id: "compensacoes", rotulo: "Compensações observadas", tipo: "longo" },
            { id: "palpacaoRegiao", rotulo: "Músculos ou regiões palpadas", tipo: "texto" },
            { id: "palpacaoAchados", rotulo: "Achados da palpação", tipo: "multipla", opcoes: ["Aumento de tensão", "Sensibilidade local", "Dor familiar reproduzida", "Diferença de mobilidade tecidual", "Sem alteração relevante"] },
            { id: "dorPalpacao", rotulo: "Dor à palpação", tipo: "escala" },
            { id: "palpacaoReproduz", rotulo: "A palpação reproduziu a queixa principal?", tipo: "unica", opcoes: ["Sim", "Não", "Parcialmente"] },
            { id: "testes", rotulo: "Testes complementares e resultados", tipo: "longo", ajuda: "Força, sensibilidade ou outros testes, se indicados." }
          ]
        },
        {
          id: "plano", titulo: "Raciocínio e plano",
          descricao: "Campos da profissional. O sistema não sugere nem preenche conclusões.",
          config: true,
          campos: [
            {
              id: "fatoresContribuintes", rotulo: "O que pode estar contribuindo para a queixa?", tipo: "multipla",
              opcoes: ["Sobrecarga ou esforço repetitivo", "Alteração de mobilidade", "Déficit de força ou resistência", "Possível componente muscular / miofascial", "Alteração de padrão de movimento", "Fator postural ou ocupacional", "Necessita investigar outra causa", "Ainda sem segurança para definir"]
            },
            { id: "justificativa", rotulo: "Justificativa (história, movimento e palpação)", tipo: "longo" },
            {
              id: "decisaoTecnica", rotulo: "Decisão sobre liberação miofascial e terapia instrumental", tipo: "unica",
              opcoes: ["Indicada, como parte da abordagem fisioterapêutica", "Indicada, com adaptações ou cautela", "Não neste momento: investigar ou encaminhar", "Sem indicação clara para esta técnica"]
            },
            { id: "decisaoPorque", rotulo: "Por quê?", tipo: "longo" },
            { id: "diagnosticoFisio", rotulo: "Diagnóstico fisioterapêutico", tipo: "longo", ajuda: "Escrito por você. O sistema não sugere diagnósticos." },
            { id: "objetivosTratamento", rotulo: "Objetivos do tratamento", tipo: "longo", ajuda: "Algo observável, sem promessa de cura." },
            { id: "condutasPropostas", rotulo: "Técnicas e condutas propostas", tipo: "multipla", lista: "tecnicas" },
            { id: "frequenciaPlano", rotulo: "Frequência sugerida", tipo: "texto", larg: "meia", placeholder: "Ex.: 1 vez por semana" },
            { id: "duracaoPlano", rotulo: "Duração estimada", tipo: "texto", larg: "meia", placeholder: "Ex.: 6 semanas" },
            { id: "precaucoes", rotulo: "Precauções ou adaptações", tipo: "longo" },
            { id: "prognostico", rotulo: "Prognóstico", tipo: "longo", config: true }
          ]
        },
        {
          id: "explicacao", titulo: "Explicação e consentimento da técnica",
          config: true,
          campos: [
            { id: "explicacaoDada", rotulo: "Explicação dada à pessoa", tipo: "longo", placeholder: "Ex.: Vou fazer uma técnica manual nos tecidos ligados à sua queixa. A pressão deve ser tolerável. Se sentir dor forte, formigamento, tontura ou algo diferente, me avise." },
            { id: "compreendeu", rotulo: "A pessoa compreendeu a explicação?", tipo: "unica", opcoes: SIM_NAO },
            { id: "informadaInterromper", rotulo: "Foi informada de que pode pausar ou interromper?", tipo: "unica", opcoes: SIM_NAO },
            { id: "consentiuTecnica", rotulo: "Consentiu com a técnica?", tipo: "unica", opcoes: SIM_NAO },
            { id: "restricoes", rotulo: "Restrições ou pedidos da pessoa", tipo: "longo" }
          ]
        },
        {
          id: "observacoes", titulo: "Observações finais",
          campos: [
            { id: "observacoes", rotulo: "Observações adicionais da profissional", tipo: "longo" }
          ]
        }
      ]
    },

    atendimento: {
      titulo: "Atendimento e evolução",
      nomeCurto: "atendimento",
      concluir: "Registrar atendimento",
      etapas: [
        {
          id: "sessao", titulo: "Dados da sessão",
          campos: [
            { id: "data", rotulo: "Data", tipo: "data", obrig: true, larg: "meia", padrao: "hoje" },
            { id: "hora", rotulo: "Horário", tipo: "hora", obrig: true, larg: "meia", padrao: "agora" },
            { id: "numero", rotulo: "Número do atendimento", tipo: "numero", larg: "meia", ajuda: "Preenchido automaticamente. Altere se precisar." },
            { id: "profissional", rotulo: "Profissional responsável", tipo: "texto", obrig: true, larg: "meia", padrao: "profissional", ajuda: "Vem preenchido com o nome salvo em Configurações." },
            { id: "objetivoSessao", rotulo: "Queixa ou objetivo desta sessão", tipo: "longo", obrig: true },
            { id: "dorAntes", rotulo: "Dor antes do atendimento", tipo: "escala", ajuda: ESCALA_AJUDA }
          ]
        },
        {
          id: "desde", titulo: "Desde a última sessão",
          campos: [
            { id: "comoChegou", rotulo: "Comparando com a última sessão, a pessoa chegou:", tipo: "unica", opcoes: ["Melhor", "Igual", "Pior", "É a primeira sessão"] },
            { id: "respostaAnterior", rotulo: "Resposta desde a sessão anterior", tipo: "longo", ajuda: "O que a pessoa relata sobre os dias após o último atendimento." },
            { id: "mudancas", rotulo: "Mudanças percebidas", tipo: "longo" },
            { id: "intercorrenciasDesde", rotulo: "Intercorrências desde a última sessão", tipo: "longo", placeholder: "Ex.: queda, novo esforço, piora após atividade" },
            { id: "avaliacaoDia", rotulo: "Avaliação do dia", tipo: "longo", ajuda: "Seus achados de hoje: movimento, palpação, observações." }
          ]
        },
        {
          id: "tecnicas", titulo: "O que foi feito",
          campos: [
            { id: "regioes", rotulo: "Regiões trabalhadas", tipo: "multipla", lista: "regioes", obrig: true, ajuda: "Marque todas. Se faltar alguma, use o campo abaixo." },
            { id: "regioesOutras", rotulo: "Outras regiões ou lado do corpo", tipo: "texto" },
            { id: "tecnicas", rotulo: "Técnicas utilizadas", tipo: "multipla", lista: "tecnicas", obrig: true },
            { id: "instrumentos", rotulo: "Instrumentos ou recursos utilizados", tipo: "texto", placeholder: "Ex.: espátula de aço inox, ventosa de silicone" },
            { id: "posicao", rotulo: "Posição do paciente", tipo: "unica", opcoes: ["Sentado(a)", "Em pé", "Deitado(a) de barriga para cima", "Deitado(a) de barriga para baixo", "De lado"], config: true },
            { id: "tempo", rotulo: "Tempo de intervenção (minutos)", tipo: "numero", larg: "meia", config: true },
            { id: "intensidade", rotulo: "Intensidade / tolerância", tipo: "unica", opcoes: ["Leve", "Moderada", "Profunda"], config: true },
            { id: "parametros", rotulo: "Parâmetros e observações de aplicação", tipo: "longo", ajuda: "Ex.: tempo por região, pressão, produto usado, ângulo do instrumento." }
          ]
        },
        {
          id: "resposta", titulo: "Resposta ao atendimento",
          campos: [
            { id: "respostaDurante", rotulo: "Resposta durante o atendimento", tipo: "longo" },
            { id: "intercorrenciasDurante", rotulo: "Intercorrências, adaptações ou pausas", tipo: "longo" },
            { id: "dorDepois", rotulo: "Dor depois do atendimento", tipo: "escala", ajuda: ESCALA_AJUDA },
            { id: "movimentoReavaliado", rotulo: "Movimento reavaliado", tipo: "texto", config: true, placeholder: "Ex.: flexão do tronco" },
            { id: "movimentoAntes", rotulo: "Como estava antes", tipo: "longo", config: true },
            { id: "movimentoDepois", rotulo: "Como ficou depois", tipo: "longo", config: true },
            { id: "percepcaoPaciente", rotulo: "Como a pessoa se sente agora, comparando com antes?", tipo: "longo", config: true }
          ]
        },
        {
          id: "evolucao", titulo: "Evolução e próximos passos",
          campos: [
            { id: "evolucao", rotulo: "Evolução clínica", tipo: "longo", obrig: true, ajuda: "Seu registro da evolução. Nada aqui é preenchido automaticamente." },
            { id: "orientacoes", rotulo: "Orientações fornecidas", tipo: "longo" },
            { id: "sinaisObservar", rotulo: "Sinais para a pessoa observar após o atendimento", tipo: "longo", config: true },
            { id: "conduta", rotulo: "Próxima conduta", tipo: "multipla", opcoes: ["Orientações simples", "Exercício ou movimento em casa", "Educação sobre a queixa", "Retorno agendado", "Encaminhamento ou avaliação complementar"], config: true },
            { id: "proximosPassos", rotulo: "Plano e próximos passos", tipo: "longo", ajuda: "Aparece no resumo do perfil, para você consultar na próxima sessão." },
            { id: "retornoRecomendacao", rotulo: "Recomendação de retorno", tipo: "texto", placeholder: "Ex.: em 7 dias" },
            { id: "retornoData", rotulo: "Data do próximo retorno", tipo: "data", larg: "meia" },
            { id: "retornoHora", rotulo: "Horário do próximo retorno", tipo: "hora", larg: "meia" }
          ]
        }
      ]
    }
  };

  // ---------- Configuração aplicada às fichas ----------
  function campoOculto(ficha, campo, cfg) {
    if (campo.obrig) return false;
    return !!(campo.config && cfg.ocultos && cfg.ocultos.includes(ficha + "." + campo.id));
  }
  function etapaOculta(ficha, etapa, cfg) {
    return !!(etapa.config && cfg.ocultos && cfg.ocultos.includes(ficha + ".etapa." + etapa.id));
  }

  // Devolve as etapas visíveis, com as listas configuráveis aplicadas e as perguntas adicionais no fim.
  function etapasDe(ficha, cfg) {
    cfg = cfg || LB.config.atual();
    const base = FICHAS[ficha].etapas;
    const etapas = [];
    for (const e of base) {
      if (etapaOculta(ficha, e, cfg)) continue;
      const campos = e.campos.filter(c => !campoOculto(ficha, c, cfg)).map(c => {
        if (c.lista) return Object.assign({}, c, { opcoes: (cfg.listas && cfg.listas[c.lista]) || LISTAS_PADRAO[c.lista] });
        if (c.tipo === "consentimento") return Object.assign({}, c, { texto: (cfg.consentimentos && cfg.consentimentos[c.id]) || CONSENTIMENTOS_PADRAO[c.id] });
        return c;
      });
      if (campos.length) etapas.push(Object.assign({}, e, { campos }));
    }
    const extras = (cfg.perguntasExtras || []).filter(p => p.ficha === ficha);
    if (extras.length) {
      etapas.push({
        id: "extras", titulo: "Perguntas adicionais",
        descricao: "Perguntas criadas por você em Configurações.",
        campos: extras.map(p => ({ id: "extra_" + p.id, rotulo: p.rotulo, tipo: p.tipo === "simnao" ? "unica" : p.tipo, opcoes: p.tipo === "simnao" ? SIM_NAO : undefined }))
      });
    }
    return etapas;
  }

  // Todos os campos (inclusive ocultos) — usado para exibir dados já preenchidos mesmo se o campo foi ocultado depois.
  function todosOsCampos(ficha, cfg) {
    cfg = cfg || LB.config.atual();
    const lista = [];
    for (const e of FICHAS[ficha].etapas) for (const c of e.campos) lista.push(Object.assign({ etapa: e.id, etapaTitulo: e.titulo }, c));
    for (const p of (cfg.perguntasExtras || []).filter(p => p.ficha === ficha)) {
      lista.push({ id: "extra_" + p.id, rotulo: p.rotulo, tipo: p.tipo === "simnao" ? "unica" : p.tipo, etapa: "extras", etapaTitulo: "Perguntas adicionais" });
    }
    return lista;
  }

  function visivel(campo, dados) {
    if (!campo.se) return true;
    return dados[campo.se.campo] === campo.se.valor;
  }

  // Valor em texto legível (para revisão, ficha e PDF). Devolve "" se vazio.
  function textoDoValor(campo, valor) {
    const U = LB.util;
    if (valor == null) return "";
    switch (campo.tipo) {
      case "data": return U.ehISO(valor) ? U.isoParaBR(valor) : String(valor);
      case "multipla": return Array.isArray(valor) ? valor.join("; ") : String(valor);
      case "escala": return valor === "" ? "" : valor + " de 10";
      case "consentimento": {
        if (!valor || !valor.estado) return "";
        let t = valor.estado;
        if (valor.data) t += " em " + U.isoParaBR(valor.data);
        if (valor.forma) t += " (" + valor.forma.toLowerCase() + ")";
        if (valor.texto) t += "\nTexto apresentado: “" + valor.texto + "”";
        return t;
      }
      case "aviso": return "";
      default: return String(valor).trim();
    }
  }

  // Erro de formato de um campo ("" quando está ok ou vazio).
  function erroDeFormato(campo, valor) {
    const U = LB.util;
    if (U.vazio(valor)) return "";
    switch (campo.tipo) {
      case "data":
        if (!U.ehISO(valor)) return "Data incompleta ou inválida. Use dia/mês/ano, por exemplo 05/03/1980.";
        if (campo.id === "nascimento") {
          const i = U.idade(valor);
          if (i < 0) return "A data de nascimento está no futuro. Confira o ano.";
          if (i > 120) return "Confira o ano de nascimento.";
        }
        return "";
      case "hora": return U.horaValida(valor) ? "" : "Horário inválido. Use horas:minutos, por exemplo 14:30.";
      case "telefone": return U.telefoneValido(valor) ? "" : "Confira o telefone: use DDD + número, por exemplo (31) 98765-4321.";
      case "email": return U.emailValido(valor) ? "" : "Confira o e-mail: deve ter o formato nome@exemplo.com.";
      case "cpf": return U.cpfValido(valor) ? "" : "CPF inválido. Confira os 11 números.";
      case "cep": return U.soDigitos(valor).length === 8 ? "" : "O CEP deve ter 8 números.";
      case "numero": return /^\d+$/.test(String(valor)) ? "" : "Use apenas números.";
      default: return "";
    }
  }

  // Lista do que falta para concluir: obrigatórios vazios e formatos inválidos (somente campos visíveis).
  function pendencias(ficha, dados, cfg) {
    const lista = [];
    etapasDe(ficha, cfg).forEach((etapa, indice) => {
      for (const c of etapa.campos) {
        if (c.tipo === "aviso" || !visivel(c, dados)) continue;
        const v = dados[c.id];
        if (c.obrig && LB.util.vazio(v)) lista.push({ campo: c, etapa, indice, mensagem: "Preencha: " + c.rotulo });
        else {
          const erro = erroDeFormato(c, v);
          if (erro) lista.push({ campo: c, etapa, indice, mensagem: c.rotulo + ": " + erro });
        }
      }
    });
    return lista;
  }

  // Seções com os valores preenchidos, para a ficha de leitura e para o PDF.
  function secoesPreenchidas(ficha, dados, cfg) {
    cfg = cfg || LB.config.atual();
    const secoes = [];
    const vistos = new Set();
    for (const e of FICHAS[ficha].etapas) {
      const itens = [];
      for (const c of e.campos) {
        vistos.add(c.id);
        if (c.tipo === "aviso") continue;
        const t = textoDoValor(c, dados[c.id]);
        if (t) itens.push({ rotulo: c.rotulo, valor: t, longo: c.tipo === "longo" || c.tipo === "consentimento", campo: c });
      }
      if (itens.length) secoes.push({ titulo: e.titulo, itens });
    }
    const extras = [];
    for (const c of todosOsCampos(ficha, cfg)) {
      if (vistos.has(c.id) || c.etapa !== "extras") continue;
      const t = textoDoValor(c, dados[c.id]);
      if (t) extras.push({ rotulo: c.rotulo, valor: t, longo: c.tipo === "longo", campo: c });
    }
    // Respostas a perguntas adicionais que foram removidas continuam visíveis.
    for (const k of Object.keys(dados)) {
      if (k.startsWith("extra_") && !extras.some(x => x.campo.id === k) && !LB.util.vazio(dados[k])) {
        extras.push({ rotulo: "Pergunta removida", valor: Array.isArray(dados[k]) ? dados[k].join("; ") : String(dados[k]), longo: true, campo: { id: k } });
      }
    }
    if (extras.length) secoes.push({ titulo: "Perguntas adicionais", itens: extras });
    return secoes;
  }

  // Campos que podem ser ocultados (para a tela de configurações).
  function camposConfiguraveis(ficha) {
    const lista = [];
    for (const e of FICHAS[ficha].etapas) {
      if (e.config) lista.push({ chave: ficha + ".etapa." + e.id, rotulo: "Etapa inteira: " + e.titulo, etapa: true });
      for (const c of e.campos) if (c.config && !c.obrig) lista.push({ chave: ficha + "." + c.id, rotulo: c.rotulo, etapaTitulo: e.titulo });
    }
    return lista;
  }

  LB.esquemas = {
    FICHAS, LISTAS_PADRAO, CONSENTIMENTOS_PADRAO, ESCALA_AJUDA,
    etapasDe, todosOsCampos, visivel, textoDoValor, erroDeFormato, pendencias, secoesPreenchidas, camposConfiguraveis
  };
})(window.LB = window.LB || {});
