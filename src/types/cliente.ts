export type SituacaoCliente =
  // Status de Compra
  | "JA_COMPROU"
  | "NAO_COMPROU"
  // Status de Interesse
  | "INTERESSADO"
  | "NAO_INTERESSADO"
  | "AGUARDANDO_DECISAO"
  // Status de Documentação
  | "DOCUMENTACAO_OK"
  | "PENDENTE_DOCUMENTO"
  | "DOCUMENTACAO_INCOMPLETA"
  // Status de Pagamento
  | "PAGAMENTO_OK"
  | "PENDENTE_PAGAMENTO"
  | "PAGAMENTO_ATRASADO"
  // Status de Visita
  | "VISITA_AGENDADA"
  | "VISITA_REALIZADA"
  | "AGUARDANDO_VISITA"
  // Status de Retorno
  | "PENDENTE_RETORNO";

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  observacao?: string;
  situacao: SituacaoCliente;
  // Datas
  dataUltimoContato: string;
  // Datas de Controle
  dataCriacao: string;
  dataUltimaAlteracao: string;
}
