export type StatusCompromisso = 
    // Status de Agendamento
    | 'AGENDADO'
    | 'CONFIRMADO'
    | 'CANCELADO'
    | 'REAGENDADO'
    // Status de Execução
    | 'EM_ANDAMENTO'
    | 'CONCLUIDO'
    | 'NAO_REALIZADO';

export interface Compromisso {
    id: string;
    titulo: string;
    anotacao?: string;
    // Datas
    data: string;
    status: StatusCompromisso;
    // Datas de Controle
    dataCriacao: string;
    dataUltimaAlteracao: string;
} 