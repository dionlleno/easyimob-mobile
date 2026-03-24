import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ListRenderItem,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Cliente, SituacaoCliente } from "../types/cliente";
import { useClienteDB } from "../db/useClienteDB";

type StackParamList = {
  listagem: undefined;
  detalhes: { cliente: Cliente };
};

type NavigationProp = NativeStackNavigationProp<StackParamList, "listagem">;

export default function ClientesListagem() {
  const navigation = useNavigation<NavigationProp>();

  const { listar, adicionar } = useClienteDB();
  const dataAtual = new Date().toISOString();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [dadosOriginais, setDadosOriginais] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [novoCliente, setNovoCliente] = useState<Omit<Cliente, "id">>({
    nome: "",
    telefone: "",
    email: "",
    observacao: "",
    situacao: "INTERESSADO",
    dataUltimoContato: dataAtual,
    dataCriacao: dataAtual,
    dataUltimaAlteracao: dataAtual,
  });

  useEffect(() => {
    carregarClientes();
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarClientes(); // Recarrega sempre que a tela ganha foco
    }, [])
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("pt-BR");
  };

  async function carregarClientes() {
    try {
      const resultado = await listar();
      setDadosOriginais(resultado);
      setClientes(resultado);
      return resultado;
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    }
  }

  function handleBuscar(texto: string) {
    setBusca(texto);
    const filtrados = dadosOriginais.filter((cliente) =>
      cliente.nome.toLowerCase().includes(texto.toLowerCase())
    );
    setClientes(filtrados);
  }

  async function handleSalvarNovoCliente() {
    try {
      const dataAtual = new Date().toISOString();
      console.log("Data Atual: ", dataAtual);
      const cliente = {
        ...novoCliente,
        nome: novoCliente.nome.toUpperCase(),
        email: novoCliente.email.toUpperCase(),
        observacao: novoCliente.observacao?.toUpperCase() ?? "",
        situacao: novoCliente.situacao,
        dataCriacao: novoCliente.dataCriacao,
        dataUltimaAlteracao: novoCliente.dataUltimaAlteracao,
        dataUltimoContato: novoCliente.dataUltimoContato,
      };
      adicionar(cliente);
      setModalVisible(false);
      setNovoCliente({
        nome: "",
        telefone: "",
        email: "",
        observacao: "",
        situacao: "INTERESSADO",
        dataUltimoContato: formatDate(dataAtual),
        dataCriacao: formatDate(dataAtual),
        dataUltimaAlteracao: formatDate(dataAtual),
      });
      console.log("Cliente: ", cliente);
    } catch (err) {
      console.error("Erro ao adicionar cliente:", err);
    }
    carregarClientes();
  }

  const renderItem: ListRenderItem<Cliente> = ({ item }) => {
    const telefoneFormatado = item.telefone.replace(
      /(\d{2})(\d{5})(\d{4})/,
      "($1) $2-$3"
    );

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("detalhes", { cliente: item })}
      >
        <View style={styles.itemContainer}>
          {/* Linha superior: Nome e ID */}
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{item.nome}</Text>
            <Text style={styles.itemId}>ID: {item.id}</Text>
          </View>

          {/* Linha do meio: Telefone e Situação */}
          <View style={styles.itemMiddle}>
            <Text style={styles.itemPhone}>{telefoneFormatado}</Text>
            <View style={styles.situacaoBadge}>
              <Text style={styles.situacaoText}>{item.situacao}</Text>
            </View>
          </View>

          {/* Linha inferior: Datas */}
          <View style={styles.itemFooter}>
            <Text style={styles.footerDateLeft}>
              Adicionado: {item.dataCriacao.slice(0, 10)}
            </Text>
            <Text style={styles.footerDateRight}>
              Atualizado: {item.dataUltimaAlteracao.slice(0, 10)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nome"
        value={busca}
        onChangeText={handleBuscar}
      />

      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Novo Cliente</Text>

              <TextInput
                style={styles.input}
                placeholder="Nome"
                value={novoCliente.nome}
                onChangeText={(text) =>
                  setNovoCliente({ ...novoCliente, nome: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Telefone"
                value={novoCliente.telefone}
                onChangeText={(text) =>
                  setNovoCliente({ ...novoCliente, telefone: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={novoCliente.email}
                onChangeText={(text) =>
                  setNovoCliente({ ...novoCliente, email: text })
                }
              />
              <TextInput
                style={[styles.input, styles.observacaoInput]} // Aplicando estilo extra para Observação
                placeholder="Observação"
                value={novoCliente.observacao}
                onChangeText={(text) =>
                  setNovoCliente({ ...novoCliente, observacao: text })
                }
                multiline={true} // Permite múltiplas linhas
                numberOfLines={3} // Exibe 3 linhas visíveis
              />

              <Text style={{ fontWeight: "bold", marginTop: 10 }}>
                Situação:
              </Text>
              <View
                style={
                  Platform.OS === "android" ? styles.pickerAndroid : undefined
                }
              >
                <Picker
                  selectedValue={novoCliente.situacao}
                  onValueChange={(value: SituacaoCliente) =>
                    setNovoCliente({ ...novoCliente, situacao: value })
                  }
                >
                  <Picker.Item label="INTERESSADO" value="INTERESSADO" />
                  <Picker.Item
                    label="NAO_INTERESSADO"
                    value="NAO_INTERESSADO"
                  />
                  <Picker.Item
                    label="AGUARDANDO_DECISAO"
                    value="AGUARDANDO_DECISAO"
                  />
                  <Picker.Item label="JA_COMPROU" value="JA_COMPROU" />
                  <Picker.Item label="NAO_COMPROU" value="NAO_COMPROU" />
                  <Picker.Item
                    label="DOCUMENTACAO_OK"
                    value="DOCUMENTACAO_OK"
                  />
                  <Picker.Item
                    label="PENDENTE_DOCUMENTO"
                    value="PENDENTE_DOCUMENTO"
                  />
                  <Picker.Item
                    label="DOCUMENTACAO_INCOMPLETA"
                    value="DOCUMENTACAO_INCOMPLETA"
                  />
                  <Picker.Item label="PAGAMENTO_OK" value="PAGAMENTO_OK" />
                  <Picker.Item
                    label="PENDENTE_PAGAMENTO"
                    value="PENDENTE_PAGAMENTO"
                  />
                  <Picker.Item
                    label="PAGAMENTO_ATRASADO"
                    value="PAGAMENTO_ATRASADO"
                  />
                  <Picker.Item
                    label="VISITA_AGENDADA"
                    value="VISITA_AGENDADA"
                  />
                  <Picker.Item
                    label="VISITA_REALIZADA"
                    value="VISITA_REALIZADA"
                  />
                  <Picker.Item
                    label="AGUARDANDO_VISITA"
                    value="AGUARDANDO_VISITA"
                  />
                  <Picker.Item
                    label="PENDENTE_RETORNO"
                    value="PENDENTE_RETORNO"
                  />
                </Picker>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleSalvarNovoCliente}
                >
                  <Text style={styles.modalButtonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#A0D4F7",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#f4f8fb",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#A0D4F7",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#777777",
  },
  itemId: {
    fontSize: 14,
    color: "#A0D4F7",
  },
  itemMiddle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  itemPhone: {
    fontSize: 15,
    color: "#777777",
  },
  situacaoBadge: {
    backgroundColor: "#A0D4F7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#A0D4F7",
  },
  situacaoText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  footerDateLeft: {
    fontSize: 12,
    color: "#777777",
  },
  footerDateRight: {
    fontSize: 12,
    color: "#777777",
    textAlign: "right",
  },
  itemText: {
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#A0D4F7",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "normal",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#f4f8fb",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#A0D4F7",
  },
  input: {
    height: 40,
    borderColor: "#A0D4F7",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  observacaoInput: {
    height: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#A0D4F7",
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#DDDDDD",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pickerAndroid: {
    borderWidth: 1,
    borderColor: "#A0D4F7",
    borderRadius: 5,
    marginBottom: 10,
  },
  pickerContainer: {
    flex: 1,
    borderColor: "#A0D4F7",
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
  },
  picker: {
    height: 40,
  },
});
