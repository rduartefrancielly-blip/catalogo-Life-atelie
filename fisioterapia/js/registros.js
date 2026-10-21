/*
  Regras dos registros: pacientes, anamneses, atendimentos e documentos.
  Estrutura comum: { id, tipo, pacienteId, status: "rascunho" | "concluido", dados, edicao, historico[], criadoEm, atualizadoEm, concluidoEm, demo }
  - "edicao" guarda uma correção em andamento de um registro já concluído (salva automaticamente, sem alterar o original).
*/
(function (LB) {
  "use strict";
  const U = LB.util;

  const SITUACOES = {
    acompanhamento: { texto: "Em acompanhamento", etiqueta: "acompanhamento" },
    pausa: { texto: "Em pausa", etiqueta: "pausa" },
    alta: { texto: "Alta", etiqueta: "alta" }
  };

  function nomeExibicao(p) {
    if (!p) return "";
    const d = p.dados || {};
    return (d.nomeSocial && d.nomeSocial.trim()) || (d.nome && d.nome.trim()) || "Paciente sem nome";
  }

  const pacientes = () => LB.banco.listar("paciente");
  const paciente = id => { const r = LB.banco.obter(id); return r && r.tipo === "paciente" ? r : null; };

  const chaveData = (data, hora) => (U.ehISO(data) ? data : "0000-00-00") + "T" + (U.horaValida(hora) ? hora : "00:00");

  function anamnesesDe(pid) {
    return LB.banco.listar("anamnese", r => r.pacienteId === pid)
      .sort((a, b) => chaveData(b.dados.dataAvaliacao).localeCompare(chaveData(a.dados.dataAvaliacao)) || b.criadoEm - a.criadoEm);
  }
  function atendimentosDe(pid, ordem) {
    const lista = LB.banco.listar("atendimento", r => r.pacienteId === pid)
      .sort((a, b) => chaveData(b.dados.data, b.dados.hora).localeCompare(chaveData(a.dados.data, a.dados.hora)) || b.criadoEm - a.criadoEm);
    return ordem === "antigos" ? lista.reverse() : lista;
  }
  const documentosDe = pid => LB.banco.listar("documento", r => r.pacienteId === pid).sort((a, b) => b.criadoEm - a.criadoEm);

  function ultimoAtendimento(pid) {
    return atendimentosDe(pid).find(a => a.status === "concluido") || null;
  }
  function proximoNumero(pid) {
    const nums = atendimentosDe(pid).map(a => parseInt(a.dados.numero, 10)).filter(n => !isNaN(n));
    return nums.length ? Math.max.apply(null, nums) + 1 : 1;
  }

  // O que falta no perfil do paciente (não bloqueia nada; serve de lembrete).
  function pendenciasPaciente(p) {
    const lista = [];
    if (p.status !== "concluido") lista.push({ texto: "Cadastro em rascunho", rota: "#/paciente/" + p.id + "/cadastro" });
    else if (p.edicao) lista.push({ texto: "Alteração do cadastro não salva", rota: "#/paciente/" + p.id + "/cadastro" });
    const an = anamnesesDe(p.id);
    if (!an.length) lista.push({ texto: "Anamnese não preenchida", rota: "#/paciente/" + p.id + "/anamnese/nova" });
    else if (!an.some(a => a.status === "concluido")) lista.push({ texto: "Anamnese em rascunho", rota: "#/paciente/" + p.id + "/anamnese/" + an[0].id + "/editar" });
    const c = (p.dados || {}).consentDados;
    if (!c || !c.estado) lista.push({ texto: "Consentimento de uso dos dados não registrado", rota: "#/paciente/" + p.id + "/cadastro?etapa=consentimentos" });
    const rasc = atendimentosDe(p.id).filter(a => a.status !== "concluido" || a.edicao);
    if (rasc.length) lista.push({ texto: U.plural(rasc.length, "atendimento com rascunho", "atendimentos com rascunho"), rota: "#/paciente/" + p.id + "?aba=atendimentos" });
    return lista;
  }

  // Dados que estão sendo editados agora: a correção em andamento, se houver.
  function dadosEmEdicao(r) { return r.status === "concluido" && r.edicao ? r.edicao.dados : r.dados; }

  async function criar(tipo, pacienteId, dados) {
    return LB.banco.salvar({
      tipo, pacienteId: pacienteId || undefined, status: "rascunho", dados: dados || {}, edicao: null,
      situacao: tipo === "paciente" ? "acompanhamento" : undefined,
      historico: [{ em: Date.now(), acao: "criado" }]
    });
  }

  async function salvarRascunho(r, dados) {
    const novo = Object.assign({}, r);
    if (r.status === "concluido") novo.edicao = { dados, iniciadaEm: (r.edicao && r.edicao.iniciadaEm) || Date.now() };
    else novo.dados = dados;
    return LB.banco.salvar(novo);
  }

  async function concluir(r, dados) {
    const novo = Object.assign({}, r, { dados, status: "concluido", concluidoEm: Date.now(), edicao: null });
    novo.historico = (r.historico || []).concat({ em: Date.now(), acao: "concluido" });
    const salvo = await LB.banco.salvar(novo);
    if (salvo.tipo === "atendimento") await atualizarRetorno(salvo);
    return salvo;
  }

  function iniciarCorrecao(r) {
    return LB.banco.salvar(Object.assign({}, r, { edicao: { dados: U.copia(r.dados), iniciadaEm: Date.now() } }));
  }

  async function salvarCorrecao(r, motivo) {
    const politica = LB.config.atual().politicaCorrecao;
    const entrada = { em: Date.now(), acao: "corrigido", motivo: (motivo || "").trim() || undefined };
    if (politica === "guardar") entrada.anterior = U.copia(r.dados);
    const novo = Object.assign({}, r, { dados: r.edicao.dados, edicao: null, corrigidoEm: Date.now() });
    novo.historico = (r.historico || []).concat(entrada);
    const salvo = await LB.banco.salvar(novo);
    if (salvo.tipo === "atendimento") await atualizarRetorno(salvo);
    return salvo;
  }

  function descartarCorrecao(r) {
    return LB.banco.salvar(Object.assign({}, r, { edicao: null }));
  }

  // O próximo retorno do paciente acompanha o último atendimento registrado.
  async function atualizarRetorno(at) {
    const p = paciente(at.pacienteId);
    if (!p) return;
    const ultimo = ultimoAtendimento(p.id);
    if (!ultimo || ultimo.id !== at.id) return;
    const d = at.dados;
    let retorno = p.proximoRetorno || null;
    if (U.ehISO(d.retornoData)) retorno = { data: d.retornoData, hora: U.horaValida(d.retornoHora) ? d.retornoHora : "", origem: at.id };
    else if (retorno && U.ehISO(d.data) && retorno.data <= d.data) retorno = null;
    if (JSON.stringify(retorno) !== JSON.stringify(p.proximoRetorno || null)) {
      await LB.banco.salvar(Object.assign({}, p, { proximoRetorno: retorno }));
    }
  }

  async function mudarSituacao(p, situacao) {
    const novo = Object.assign({}, p, { situacao });
    novo.historico = (p.historico || []).concat({ em: Date.now(), acao: "situacao", motivo: SITUACOES[situacao].texto });
    return LB.banco.salvar(novo);
  }

  async function definirRetorno(p, retorno) {
    return LB.banco.salvar(Object.assign({}, p, { proximoRetorno: retorno }));
  }

  async function excluirPaciente(pid) {
    const ids = LB.banco.listar(null, r => r.pacienteId === pid).map(r => r.id);
    ids.push(pid);
    await LB.banco.excluir(ids);
  }

  async function excluirRegistro(id) { await LB.banco.excluir([id]); }

  // Texto de status para mostrar ao lado de um registro.
  function etiquetasDe(r) {
    const e = [];
    if (r.status !== "concluido") e.push(LB.ui.etiqueta("Rascunho", "rascunho"));
    else if (r.edicao) e.push(LB.ui.etiqueta("Correção não salva", "pendente"));
    if (r.corrigidoEm) e.push(LB.ui.etiqueta("Corrigido em " + U.isoParaBR(U.hojeISO(new Date(r.corrigidoEm))), "corrigido"));
    return e;
  }

  // Busca por nome (sem acento) ou telefone (só números).
  function buscarPacientes(termo) {
    const t = U.normalizarBusca(termo);
    const dig = U.soDigitos(termo);
    return pacientes().filter(p => {
      if (!t) return true;
      const d = p.dados || {};
      if (U.normalizarBusca(d.nome).includes(t) || U.normalizarBusca(d.nomeSocial).includes(t)) return true;
      return dig.length >= 3 && U.soDigitos(d.telefone).includes(dig);
    }).sort((a, b) => U.normalizarBusca(nomeExibicao(a)).localeCompare(U.normalizarBusca(nomeExibicao(b))));
  }

  LB.registros = {
    SITUACOES, nomeExibicao, pacientes, paciente, anamnesesDe, atendimentosDe, documentosDe, ultimoAtendimento, proximoNumero,
    pendenciasPaciente, dadosEmEdicao, criar, salvarRascunho, concluir, iniciarCorrecao, salvarCorrecao, descartarCorrecao,
    mudarSituacao, definirRetorno, excluirPaciente, excluirRegistro, etiquetasDe, buscarPacientes, chaveData
  };
})(window.LB = window.LB || {});
