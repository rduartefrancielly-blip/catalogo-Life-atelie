/* Dados FICTÍCIOS para conhecer o sistema. Todos ficam marcados como "Fictício" e saem com um clique em Configurações. */
(function (LB) {
  "use strict";
  const U = LB.util;

  function dia(n) { return U.somarDias(U.hojeISO(), n); }
  function ms(n, hora) { const d = U.isoParaData(dia(n)); const [hh, mm] = (hora || "10:00").split(":"); d.setHours(+hh, +mm); return d.getTime(); }
  const aceite = (n, forma) => ({ estado: "Aceito", data: dia(n), forma: forma || "Verbal" });

  function montar() {
    const prof = (LB.config.atual().profissional || {}).nome || "Profissional (exemplo)";
    const lista = [];
    const pac = (id, dados, extra) => lista.push(Object.assign({ id, tipo: "paciente", status: "concluido", dados, edicao: null, situacao: "acompanhamento", historico: [{ em: ms(-30), acao: "criado" }], criadoEm: ms(-30), atualizadoEm: ms(-30), concluidoEm: ms(-30), demo: true }, extra || {}));
    const reg = (tipo, id, pacienteId, dados, quando, extra) => lista.push(Object.assign({ id, tipo, pacienteId, status: "concluido", dados, edicao: null, historico: [{ em: quando, acao: "criado" }, { em: quando, acao: "concluido" }], criadoEm: quando, atualizadoEm: quando, concluidoEm: quando, demo: true }, extra || {}));

    // 1) Ana — acompanhamento com três atendimentos e retorno hoje
    pac("demo-ana", {
      nome: "Ana Exemplo da Silva", nascimento: "1986-04-12", telefone: "(31) 90000-0001", telefoneWhats: "Sim",
      email: "ana.exemplo@exemplo.com", cidade: "Belo Horizonte - MG", profissao: "Analista (exemplo)", contatoPreferido: "WhatsApp",
      consentDados: aceite(-28), consentAtendimento: aceite(-28), consentMensagens: aceite(-28)
    }, { proximoRetorno: { data: dia(0), hora: "15:00" }, criadoEm: ms(-28), concluidoEm: ms(-28) });
    reg("anamnese", "demo-ana-anam", "demo-ana", {
      dataAvaliacao: dia(-28), profissional: prof, motivo: "Exemplo fictício: incômodo na região lombar ao fim do dia de trabalho.",
      objetivo: "Conseguir trabalhar sentada sem desconforto.", queixa: "“Sinto as costas pesadas no fim do dia.” (texto fictício)",
      regiao: "Lombar", lado: "Ambos os lados", descricao: ["Peso", "Tensão"], frequencia: "Todos os dias, em alguns momentos",
      inicioQuando: "há cerca de 3 meses", inicioTipo: "Gradual", evolucaoQuadro: "Estável", recorrente: "Não",
      dorAgora: 4, dorPior: 6, dorMelhor: 2, piora: ["Ficar sentado(a)", "Trabalho"], alivia: ["Movimento", "Alongamento"],
      impactoCotidiano: "Pouco", impactoTrabalho: "Moderado", impactoSono: "Nenhum", impactoAtividade: "Pouco",
      alertas: ["Nenhum destes sinais"], alergias: "Não", atividadeFisica: "Sim", atividadeQual: "Caminhada, 2 vezes por semana",
      rotinaTrabalho: "Cerca de 8 horas sentada ao computador.", observacoes: "Registro fictício para demonstração."
    }, ms(-28, "14:00"));
    const atendAna = [
      { n: 1, d: -21, antes: 4, depois: 2, chegou: "É a primeira sessão", evol: "Exemplo fictício: boa tolerância à técnica.", passos: "Reavaliar tolerância ao ficar sentada." },
      { n: 2, d: -14, antes: 3, depois: 2, chegou: "Melhor", evol: "Exemplo fictício: relata menos peso no fim do dia.", passos: "Manter abordagem e orientar pausas ativas." },
      { n: 3, d: -7, antes: 3, depois: 1, chegou: "Melhor", evol: "Exemplo fictício: manteve melhora durante a semana.", passos: "Reavaliar em 7 dias e revisar exercícios para casa." }
    ];
    for (const a of atendAna) {
      reg("atendimento", "demo-ana-at" + a.n, "demo-ana", {
        data: dia(a.d), hora: "15:00", numero: String(a.n), profissional: prof, objetivoSessao: "Desconforto lombar (exemplo fictício).",
        dorAntes: a.antes, comoChegou: a.chegou, regioes: ["Lombar", "Glúteos"], tecnicas: ["Liberação miofascial manual", "Terapia instrumental"],
        instrumentos: "Espátula (exemplo)", tempo: "40", intensidade: "Moderada", dorDepois: a.depois, evolucao: a.evol,
        orientacoes: "Pausas a cada hora de trabalho sentada (exemplo).", proximosPassos: a.passos, retornoRecomendacao: "em 7 dias",
        retornoData: dia(a.d + 7), retornoHora: "15:00"
      }, ms(a.d, "15:50"));
    }

    // 2) Bruno — um atendimento, retorno em alguns dias
    pac("demo-bruno", {
      nome: "Bruno Teste Fictício", nascimento: "1979-09-03", telefone: "(31) 90000-0002", telefoneWhats: "Sim", contatoPreferido: "Ligação",
      consentDados: aceite(-5, "Assinado em papel"), consentAtendimento: aceite(-5, "Assinado em papel")
    }, { proximoRetorno: { data: dia(4), hora: "09:30" }, criadoEm: ms(-5), concluidoEm: ms(-5) });
    reg("anamnese", "demo-bruno-anam", "demo-bruno", {
      dataAvaliacao: dia(-3), profissional: prof, motivo: "Exemplo fictício: tensão no ombro direito.", queixa: "Rigidez ao levantar o braço (fictício).",
      regiao: "Ombro", lado: "Direito", descricao: ["Rigidez", "Tensão"], dorAgora: 5, alertas: ["Nenhum destes sinais"], alergias: "Não sabe"
    }, ms(-3, "09:00"));
    reg("atendimento", "demo-bruno-at1", "demo-bruno", {
      data: dia(-3), hora: "09:30", numero: "1", profissional: prof, objetivoSessao: "Rigidez no ombro direito (fictício).", dorAntes: 5,
      comoChegou: "É a primeira sessão", regioes: ["Trapézio e ombros"], tecnicas: ["Liberação miofascial manual"], dorDepois: 3,
      evolucao: "Exemplo fictício: tolerou bem; amplitude confortável ao final.", proximosPassos: "Reavaliar elevação do braço.",
      retornoData: dia(4), retornoHora: "09:30"
    }, ms(-3, "10:20"));

    // 3) Carla — cadastro pronto, anamnese em rascunho
    pac("demo-carla", {
      nome: "Carla Demonstração Lima", nomeSocial: "Carla Demo", nascimento: "1992-01-20", telefone: "(31) 90000-0003", contatoPreferido: "E-mail",
      email: "carla.demo@exemplo.com", consentDados: aceite(-1)
    }, { criadoEm: ms(-1), concluidoEm: ms(-1) });
    lista.push({
      id: "demo-carla-anam", tipo: "anamnese", pacienteId: "demo-carla", status: "rascunho",
      dados: { dataAvaliacao: dia(-1), profissional: prof, motivo: "Exemplo fictício: desconforto na panturrilha após corrida." },
      edicao: null, historico: [{ em: ms(-1), acao: "criado" }], criadoEm: ms(-1), atualizadoEm: ms(-1), demo: true
    });

    // 4) Diego — cadastro em rascunho (faltam dados), em pausa
    lista.push({
      id: "demo-diego", tipo: "paciente", status: "rascunho", situacao: "pausa",
      dados: { nome: "Diego Exemplo Rocha", telefone: "(31) 90000-0004" },
      edicao: null, historico: [{ em: ms(-10), acao: "criado" }], criadoEm: ms(-10), atualizadoEm: ms(-10), demo: true
    });
    return lista;
  }

  const existe = () => LB.banco.listar(null, r => r.demo).length > 0;

  async function carregar() {
    for (const r of montar()) await LB.banco.salvar(r, { manterData: true });
  }
  async function remover() {
    const ids = LB.banco.listar(null, r => r.demo).map(r => r.id);
    if (ids.length) await LB.banco.excluir(ids);
    return ids.length;
  }

  LB.demo = { carregar, remover, existe };
})(window.LB = window.LB || {});
