import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useClienteDB } from "../db/useClienteDB";
import { useImovelDB } from "../db/useImovelDB";
import { useCompromissoDB } from "../db/useCompromissoDB";
import { initializeDB } from "../db/initializeDB";
import { Cliente } from "../types/cliente";
import { Compromisso } from "../types/compromisso";
import { Imovel } from "../types/imovel";
import { useUsuarioDB } from "../db/useUsuarioDB";

export default function Configuracao() {
  const clienteDB = useClienteDB();
  const imovelDB = useImovelDB();
  const compromissoDB = useCompromissoDB();
  const usuarioDB = useUsuarioDB()

  const confirmarExclusaoBanco = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja zerar o banco?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => excluirBanco(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  async function popularBanco() {
  const agora = new Date().toISOString();

  const clientes: Omit<Cliente, "id">[] = [
    {
      nome: "Maria da Silva",
      telefone: "(11) 91234-5678",
      email: "maria@email.com",
      observacao: "Cliente interessada em imóvel residencial",
      situacao: "INTERESSADO",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      nome: "João Pereira",
      telefone: "(21) 98765-4321",
      email: "joao@email.com",
      observacao: "Procurando apartamento com 3 quartos",
      situacao: "INTERESSADO",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      nome: "Ana Costa",
      telefone: "(31) 99876-5432",
      email: "ana@email.com",
      observacao: "Quer agendar visita para semana que vem",
      situacao: "INTERESSADO",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      nome: "Carlos Lima",
      telefone: "(41) 98765-1234",
      email: "carlos@email.com",
      observacao: "Busca imóvel com quintal",
      situacao: "DOCUMENTACAO_OK",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      nome: "Luciana Torres",
      telefone: "(61) 91234-5678",
      email: "luciana@email.com",
      observacao: "Marcada visita para sábado",
      situacao: "INTERESSADO",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      nome: "Pedro Oliveira",
      telefone: "(71) 99876-5432",
      email: "pedro@email.com",
      observacao: "Quer imóvel na zona sul",
      situacao: "INTERESSADO",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      nome: "Juliana Mendes",
      telefone: "(85) 98765-4321",
      email: "juliana@email.com",
      observacao: "Busca imóvel para investimento",
      situacao: "DOCUMENTACAO_OK",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      nome: "Rafael Dias",
      telefone: "(51) 91234-5678",
      email: "rafael@email.com",
      observacao: "Quer imóvel perto do trabalho",
      situacao: "INTERESSADO",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      nome: "Fernanda Souza",
      telefone: "(62) 99876-5432",
      email: "fernanda@email.com",
      observacao: "Ligação marcada para amanhã",
      situacao: "DOCUMENTACAO_OK",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      nome: "Eduardo Rocha",
      telefone: "(91) 98765-4321",
      email: "eduardo@email.com",
      observacao: "Busca casa com piscina",
      situacao: "INTERESSADO",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
  ];

  for (const cliente of clientes) {
    try {
      const resultado = await clienteDB.adicionar(cliente);
      console.log(`Cliente adicionado com ID: ${resultado.insertedId}`);
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
    }
  }

  const compromissos: Omit<Compromisso, "id">[] = [
    {
      titulo: "Reunião com cliente",
      data: "2025-05-16",
      anotacao: "Levar proposta final",
      status: "AGENDADO",
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      titulo: "Apresentação do projeto",
      data: "2025-05-18",
      anotacao: "Revisar slides antes",
      status: "AGENDADO",
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      titulo: "Chamada com fornecedor",
      data: "2025-05-20",
      anotacao: "Negociar valores",
      status: "AGENDADO",
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      titulo: "Visita ao imóvel",
      data: "2025-05-21",
      anotacao: "Cliente: Maria da Silva",
      status: "AGENDADO",
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      titulo: "Reunião de equipe",
      data: "2025-05-22",
      anotacao: "Alinhar estratégias de venda",
      status: "CONCLUIDO",
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      titulo: "Contato com cliente",
      data: "2025-05-23",
      anotacao: "Ligar para João Pereira",
      status: "CANCELADO",
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      titulo: "Treinamento interno",
      data: "2025-05-24",
      anotacao: "Nova ferramenta CRM",
      status: "AGENDADO",
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      titulo: "Entrega de contrato",
      data: "2025-05-25",
      anotacao: "Assinatura presencial",
      status: "AGENDADO",
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      titulo: "Avaliação de imóvel",
      data: "2025-05-26",
      anotacao: "Visita com engenheiro",
      status: "AGENDADO",
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      titulo: "Almoço com cliente",
      data: "2025-05-27",
      anotacao: "Fechamento de venda",
      status: "AGENDADO",
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
  ];

  for (const compromisso of compromissos) {
    try {
      const resultado = await compromissoDB.adicionar(compromisso);
      console.log(`Compromisso adicionado com ID: ${resultado.insertedId}`);
    } catch (error) {
      console.error("Erro ao adicionar compromisso:", error);
    }
  }

  const imoveis: Omit<Imovel, "id">[] = [
    {
      logradouro: "Rua das Acácias",
      numero: "123",
      complemento: "Apto 301",
      bairro: "Jardins",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
      valorTotal: 850000,
      valorCondominio: 700,
      valorIptu: 150,
      areaQuadrada: 120,
      quantidadeQuartos: 3,
      quantidadeBanheiros: 2,
      quantidadeSuites: 1,
      temGaragem: true,
      quantidadeVagasGaragem: 2,
      tipoImovel: "APARTAMENTO",
      observacao: "Excelente localização",
      situacao: "DISPONIVEL",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      logradouro: "Av. Brasil",
      numero: "456",
      complemento: "",
      bairro: "Centro",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      cep: "20040-002",
      valorTotal: 1250000,
      valorCondominio: 0,
      valorIptu: 300,
      areaQuadrada: 250,
      quantidadeQuartos: 4,
      quantidadeBanheiros: 3,
      quantidadeSuites: 2,
      temGaragem: true,
      quantidadeVagasGaragem: 3,
      tipoImovel: "CASA",
      observacao: "Próximo ao metrô",
      situacao: "OCUPADO",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      logradouro: "Rua do Sol",
      numero: "789",
      complemento: "",
      bairro: "Boa Viagem",
      cidade: "Recife",
      estado: "PE",
      cep: "51030-030",
      valorTotal: 560000,
      valorCondominio: 350,
      valorIptu: 100,
      areaQuadrada: 85,
      quantidadeQuartos: 2,
      quantidadeBanheiros: 2,
      quantidadeSuites: 1,
      temGaragem: false,
      quantidadeVagasGaragem: 0,
      tipoImovel: "APARTAMENTO",
      observacao: "",
      situacao: "DISPONIVEL",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      logradouro: "Rua das Palmeiras",
      numero: "22",
      complemento: "",
      bairro: "Copacabana",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      cep: "22041-011",
      valorTotal: 980000,
      valorCondominio: 400,
      valorIptu: 200,
      areaQuadrada: 100,
      quantidadeQuartos: 3,
      quantidadeBanheiros: 2,
      quantidadeSuites: 1,
      temGaragem: true,
      quantidadeVagasGaragem: 1,
      tipoImovel: "APARTAMENTO",
      observacao: "Vista para o mar",
      situacao: "DISPONIVEL",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      logradouro: "Alameda Santos",
      numero: "999",
      complemento: "Cobertura",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01310-200",
      valorTotal: 2000000,
      valorCondominio: 1500,
      valorIptu: 500,
      areaQuadrada: 180,
      quantidadeQuartos: 4,
      quantidadeBanheiros: 4,
      quantidadeSuites: 3,
      temGaragem: true,
      quantidadeVagasGaragem: 4,
      tipoImovel: "APARTAMENTO",
      observacao: "Cobertura duplex",
      situacao: "DISPONIVEL",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      logradouro: "Rua dos Pinheiros",
      numero: "312",
      complemento: "",
      bairro: "Pinheiros",
      cidade: "São Paulo",
      estado: "SP",
      cep: "05422-000",
      valorTotal: 720000,
      valorCondominio: 650,
      valorIptu: 180,
      areaQuadrada: 90,
      quantidadeQuartos: 2,
      quantidadeBanheiros: 2,
      quantidadeSuites: 1,
      temGaragem: true,
      quantidadeVagasGaragem: 1,
      tipoImovel: "APARTAMENTO",
      observacao: "",
      situacao: "OCUPADO",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      logradouro: "Rua B",
      numero: "25",
      complemento: "Casa 2",
      bairro: "Bairro Novo",
      cidade: "Fortaleza",
      estado: "CE",
      cep: "60175-000",
      valorTotal: 450000,
      valorCondominio: 0,
      valorIptu: 120,
      areaQuadrada: 150,
      quantidadeQuartos: 3,
      quantidadeBanheiros: 2,
      quantidadeSuites: 1,
      temGaragem: true,
      quantidadeVagasGaragem: 2,
      tipoImovel: "CASA",
      observacao: "Espaço para piscina",
      situacao: "DISPONIVEL",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      logradouro: "Rua C",
      numero: "88",
      complemento: "",
      bairro: "Santa Efigênia",
      cidade: "Belo Horizonte",
      estado: "MG",
      cep: "30150-350",
      valorTotal: 510000,
      valorCondominio: 300,
      valorIptu: 100,
      areaQuadrada: 75,
      quantidadeQuartos: 2,
      quantidadeBanheiros: 1,
      quantidadeSuites: 0,
      temGaragem: false,
      quantidadeVagasGaragem: 0,
      tipoImovel: "APARTAMENTO",
      observacao: "Boa localização",
      situacao: "OCUPADO",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      logradouro: "Rua D",
      numero: "101",
      complemento: "",
      bairro: "Centro",
      cidade: "Curitiba",
      estado: "PR",
      cep: "80010-150",
      valorTotal: 630000,
      valorCondominio: 500,
      valorIptu: 130,
      areaQuadrada: 95,
      quantidadeQuartos: 3,
      quantidadeBanheiros: 2,
      quantidadeSuites: 1,
      temGaragem: true,
      quantidadeVagasGaragem: 1,
      tipoImovel: "APARTAMENTO",
      observacao: "Recém reformado",
      situacao: "DISPONIVEL",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
    {
      logradouro: "Rua E",
      numero: "77",
      complemento: "",
      bairro: "Praia",
      cidade: "Florianópolis",
      estado: "SC",
      cep: "88010-400",
      valorTotal: 1150000,
      valorCondominio: 800,
      valorIptu: 250,
      areaQuadrada: 160,
      quantidadeQuartos: 4,
      quantidadeBanheiros: 3,
      quantidadeSuites: 2,
      temGaragem: true,
      quantidadeVagasGaragem: 2,
      tipoImovel: "CASA",
      observacao: "Próximo à praia",
      situacao: "DISPONIVEL",
      dataUltimoContato: agora,
      dataCriacao: agora,
      dataUltimaAlteracao: agora,
    },
  ];

  for (const imovel of imoveis) {
    try {
      const { insertedId } = await imovelDB.adicionar(imovel);
      console.log(`Imóvel adicionado com ID: ${insertedId}`);
    } catch (error) {
      console.error("Erro ao adicionar imóvel:", error);
    }
  }
}

  async function excluirBanco() {
    await clienteDB.deletarTabela();
    await imovelDB.deletarTabela();
    await compromissoDB.deletarTabela();
    await usuarioDB.deletarTabela();
  }

  return (
    <View style={styles.container}>
      <View style={styles.configList}>
        <Text style={styles.title}>Banco de Dados</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={confirmarExclusaoBanco}
        >
          <Text style={styles.buttonText}>Zerar banco</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={popularBanco}>
          <Text style={styles.buttonText}>Popular banco</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    width: 110,
    height: 40,
    borderRadius: 15,
    backgroundColor: "#A0D4F7",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  configList: {
    paddingTop: 10,
    gap: 20,
  },
});
