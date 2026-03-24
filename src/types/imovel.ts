export type SituacaoImovel = 
    // Status de Disponibilidade
    | 'DISPONIVEL'
    | 'VENDIDO'
    | 'ALUGADO'
    | 'RESERVADO'
    // Status de Documentação
    | 'DOCUMENTACAO_OK'
    | 'PENDENTE_DOCUMENTO'
    | 'DOCUMENTACAO_IRREGULAR'
    // Status de Ocupação
    | 'DESOCUPADO'
    | 'OCUPADO'
    | 'EM_REFORMA'
    // Status de Negociação
    | 'EM_NEGOCIACAO'
    | 'AGUARDANDO_APROVACAO'
    | 'CONTRATO_ASSINADO';
export type TipoImovel = 'APARTAMENTO' | 'CASA' | 'TERRENO' | 'COMERCIAL';

export interface Imovel {
    id: string;
    // Endereço
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    // Dados do Imóvel
    valorTotal: number;
    valorCondominio: number;
    valorIptu: number;
    areaQuadrada: number;
    quantidadeQuartos: number;
    quantidadeBanheiros: number;
    quantidadeSuites: number;
    temGaragem: boolean;
    quantidadeVagasGaragem: number;
    tipoImovel: TipoImovel;
    observacao?: string;
    situacao: SituacaoImovel;
    // Datas
    dataUltimoContato: string;
    // Datas de Controle
    dataCriacao: string;
    dataUltimaAlteracao: string;
} 