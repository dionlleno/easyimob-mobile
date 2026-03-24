import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Cliente, SituacaoCliente } from "../types/cliente";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Modal,
  Platform,
  TextInput,
} from "react-native";
import { useState } from "react";
import { useClienteDB } from "../db/useClienteDB";
import { Picker } from "@react-native-picker/picker";

type StackParamList = {
  detalhes: { cliente: Cliente };
};

type DetalhesRouteProp = RouteProp<StackParamList, "detalhes">;

export default function ClientesDetalhes() {
  const navigation = useNavigation();

  const route = useRoute<DetalhesRouteProp>();
  const [cliente, setCliente] = useState(route.params.cliente);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { excluir, atualizar } = useClienteDB();

  const [novoCliente, setNovoCliente] = useState<Omit<Cliente, "id">>({
    nome: cliente.nome,
    telefone: cliente.telefone,
    email: cliente.email,
    observacao: cliente.observacao,
    situacao: cliente.situacao,
    dataUltimoContato: cliente.dataUltimoContato,
    dataCriacao: cliente.dataCriacao,
    dataUltimaAlteracao: cliente.dataUltimaAlteracao,
  });

  // Função para formatar datas em dd/mm/yyyy
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR");
  };

  const handleConfirmarExclusao = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esse cliente?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => handleExcluirCliente(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  async function handleExcluirCliente() {
    try {
      await excluir(Number(cliente.id));
      navigation.goBack();
    } catch (err) {
      console.error("Erro ao excluir cliente: ", err);
    }
  }

  async function handleAtualizaCliente() {
    try {
      const dataAtual = new Date().toISOString();
      const clienteAtualizado = {
        ...novoCliente,
        id: cliente.id,
        nome: cliente.nome,
        email: novoCliente.email.toUpperCase(),
        observacao: novoCliente.observacao?.toUpperCase() ?? "",
        dataCriacao: cliente.dataCriacao,
        dataUltimaAlteracao: dataAtual,
        dataUltimoContato: dataAtual,
      };
      atualizar(clienteAtualizado);
      setModalVisible(false);
      setNovoCliente({
        nome: cliente.nome,
        telefone: cliente.telefone,
        email: cliente.email,
        observacao: cliente.observacao,
        situacao: cliente.situacao,
        dataUltimoContato: cliente.dataUltimoContato,
        dataCriacao: cliente.dataCriacao,
        dataUltimaAlteracao: cliente.dataUltimaAlteracao,
      });
      setCliente(clienteAtualizado);
    } catch (err) {
      console.error("Erro ao atualizar cliente: ", err);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal visible={modalVisible} animationType="slide" transparent>
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

            <Text style={{ fontWeight: "bold", marginTop: 10 }}>Situação:</Text>
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
                <Picker.Item label="NAO_INTERESSADO" value="NAO_INTERESSADO" />
                <Picker.Item
                  label="AGUARDANDO_DECISAO"
                  value="AGUARDANDO_DECISAO"
                />
                <Picker.Item label="JA_COMPROU" value="JA_COMPROU" />
                <Picker.Item label="NAO_COMPROU" value="NAO_COMPROU" />
                <Picker.Item label="DOCUMENTACAO_OK" value="DOCUMENTACAO_OK" />
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
                <Picker.Item label="VISITA_AGENDADA" value="VISITA_AGENDADA" />
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
                onPress={handleAtualizaCliente}
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
      </Modal>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Info label="ID" value={cliente.id} />
          <Info label="Nome" value={cliente.nome} />
          <Info label="Telefone" value={cliente.telefone} />
          <Info label="Email" value={cliente.email} />

          {/* Observação com ScrollView */}
          <Text style={styles.label}>Observação:</Text>
          <View style={styles.observacaoContainer}>
            <ScrollView>
              <Text style={styles.observacaoText}>
                {cliente.observacao || "N/A"}
              </Text>
            </ScrollView>
          </View>

          {/* Situação como badge */}
          <Text style={styles.label}>Situação:</Text>
          <View style={styles.situacaoBadge}>
            <Text style={styles.situacaoText}>{cliente.situacao}</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fabAtualizar}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>Atualizar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.fabExcluir}
        onPress={handleConfirmarExclusao}
      >
        <Text style={styles.fabText}>Excluir</Text>
      </TouchableOpacity>

      {/* Barra inferior fixa com datas formatadas */}
      <View style={styles.footer}>
        <View style={styles.dateColumn}>
          <Text style={styles.footerLabel}>Último Contato</Text>
          <Text style={styles.footerValue}>
            {formatDate(cliente.dataUltimoContato)}
          </Text>
        </View>
        <View style={styles.dateColumn}>
          <Text style={styles.footerLabel}>Criado em</Text>
          <Text style={styles.footerValue}>
            {formatDate(cliente.dataCriacao)}
          </Text>
        </View>
        <View style={styles.dateColumn}>
          <Text style={styles.footerLabel}>Última Alteração</Text>
          <Text style={styles.footerValue}>
            {formatDate(cliente.dataUltimaAlteracao)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A0D4F7",
    marginBottom: 20,
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#777777",
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    color: "#A0D4F7",
  },
  observacaoContainer: {
    height: 72,
    borderWidth: 1,
    borderColor: "#A0D4F7",
    borderRadius: 6,
    padding: 4,
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: "#f4f8fb",
  },
  observacaoText: {
    fontSize: 15,
    color: "#777777",
  },
  situacaoBadge: {
    backgroundColor: "#A0D4F7",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 5,
    marginBottom: 15,
  },
  situacaoText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f4f8fb",
    borderTopWidth: 1,
    borderTopColor: "#f4f8fb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateColumn: {
    alignItems: "center",
    flex: 1,
  },
  footerLabel: {
    fontSize: 13,
    color: "#777777",
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#999999",
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
  fabExcluir: {
    position: "absolute",
    right: 20,
    bottom: 65,
    width: 90,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#A0D4F7",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabAtualizar: {
    position: "absolute",
    left: 20,
    bottom: 65,
    width: 110,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#A0D4F7",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
