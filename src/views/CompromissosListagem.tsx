import {
  Button,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Compromisso, StatusCompromisso } from "../types/compromisso";
import React, { useCallback, useEffect, useState } from "react";
import { useCompromissoDB } from "../db/useCompromissoDB";
import { ScrollView } from "react-native-gesture-handler";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export default function CompromissosListagem() {
  const [compromisso, setCompromisso] = useState<Compromisso>(() => ({
    id: "",
    titulo: "",
    anotacao: "",
    data: "",
    status: "AGENDADO",
    dataCriacao: "",
    dataUltimaAlteracao: "",
  }));
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [dadosOriginais, setDadosOriginais] = useState<Compromisso[]>([]);
  const [novoCompromisso, setNovoCompromisso] = useState<
    Omit<Compromisso, "id">
  >({
    titulo: "",
    anotacao: "",
    data: "",
    status: "AGENDADO",
    dataCriacao: "",
    dataUltimaAlteracao: "",
  });

  const { listar, adicionar, excluir } = useCompromissoDB();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalVisibleAdd, setModalVisibleAdd] = useState<boolean>(false);

  useEffect(() => {
    carregarCompromissos();
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarCompromissos();
    }, [])
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("pt-BR");
  };
  const dataAtual = new Date().toISOString();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeDate = (_: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const updatedDate = new Date(date);
      updatedDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setDate(updatedDate);
    }
  };

  const onChangeTime = (_: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      const updatedDate = new Date(date);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());
      setDate(updatedDate);
    }
  };

  async function carregarCompromissos() {
    try {
      const resultado = await listar();
      const ordenado = resultado.sort((a, b) => {
        const dataA = new Date(a.data);
        const dataB = new Date(b.data);
        return dataB.getTime() - dataA.getTime();
      });
      setDadosOriginais(ordenado);
      setCompromissos(ordenado);
      return ordenado;
    } catch (err) {
      console.error("Erro ao listar compromissos: ", err);
    }
  }

  function carregarCompromissosHoje() {
    const hoje = new Date();
    const dataHoje = hoje.toISOString().slice(0, 10); // yyyy-mm-dd

    const compromissosHoje = dadosOriginais.filter((dados) => {
      const dataCompromisso = new Date(dados.data).toISOString().slice(0, 10);
      return dataCompromisso === dataHoje;
    });

    const ordenado = compromissosHoje.sort((a, b) => {
      return new Date(b.data).getTime() - new Date(a.data).getTime();
    });

    setCompromissos(ordenado);
  }

  function exibirCompromisso(item: Compromisso) {
    setCompromisso(item);
    setModalVisible(true);
  }

  function carregarCompromissosSemana() {
    const hoje = new Date();
    const seteDiasDepois = new Date();
    seteDiasDepois.setDate(hoje.getDate() + 7);

    const compromissosSemana = dadosOriginais.filter((dado) => {
      const dataEvento = new Date(dado.data);
      return dataEvento >= hoje && dataEvento <= seteDiasDepois;
    });
    setCompromissos(compromissosSemana);
  }

  async function handleSalvarCompromisso() {
    try {
      await adicionar({
        ...novoCompromisso,
        titulo: novoCompromisso.titulo.toUpperCase(),
        data: date.toISOString(),
        status: novoCompromisso.status,
        anotacao: novoCompromisso.anotacao,
        dataCriacao: dataAtual,
        dataUltimaAlteracao: dataAtual,
      });
      setModalVisibleAdd(false);
      setNovoCompromisso({
        titulo: "",
        data: "",
        anotacao: "",
        status: "AGENDADO",
        dataCriacao: "",
        dataUltimaAlteracao: "",
      });
      await carregarCompromissos();
    } catch (err) {
      console.error("Erro ao salvar compromisso: ", err);
    }
  }

  async function handleExcluir() {
    try {
      await excluir(compromisso.id);
      carregarCompromissos();
      setModalVisible(false);
    } catch (err) {
      console.error("Erro ao excluir compromisso: ", err);
    }
  }

  const renderItem: ListRenderItem<Compromisso> = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => exibirCompromisso(item)}>
        <View style={styles.itemContainer}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{item.titulo}</Text>
            <Text style={styles.itemId}>Id: {item.id}</Text>
          </View>
          <View style={styles.itemMiddle}>
            <View style={styles.situacaoBadge}>
              <Text style={styles.situacaoText}>{item.status}</Text>
            </View>
          </View>
          <View style={styles.itemMiddle}>
            <Text style={styles.footerDateRight}>
              Data: {item.data.slice(0, 10)}
            </Text>
            <Text style={styles.footerDateLeft}>
              Horario: {item.data.slice(11, 16)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <TouchableOpacity
          style={styles.button}
          onPress={carregarCompromissosHoje}
        >
          <Text style={styles.buttonText}>Hoje</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={carregarCompromissosSemana}
        >
          <Text style={styles.buttonText}>Essa Semana</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={carregarCompromissos}>
          <Text style={styles.buttonText}>Todos</Text>
        </TouchableOpacity>
      </View>
      <FlatList data={compromissos} renderItem={renderItem} />
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Detalhes</Text>
              <View style={styles.card}>
                <Info label="Titulo" value={compromisso.titulo} />
                <Text style={styles.label}>Observação:</Text>
                <View style={styles.observacaoContainer}>
                  <ScrollView>
                    <Text style={styles.observacaoText}>
                      {compromisso.anotacao || "N/A"}
                    </Text>
                  </ScrollView>
                </View>
                <Text style={styles.label}>Status:</Text>
                <View style={styles.situacaoBadge}>
                  <Text style={styles.situacaoText}>{compromisso.status}</Text>
                </View>
                <View style={styles.dateRow}>
                  <View style={styles.dateColumn}>
                    <Text style={styles.footerLabel}>Data:</Text>
                    <Text style={styles.footerValue}>
                      {compromisso.data.slice(0, 10)}
                    </Text>
                  </View>

                  <View style={styles.dateColumn}>
                    <Text style={styles.footerLabel}>Horário:</Text>
                    <Text style={styles.footerValue}>
                      {compromisso.data.slice(11, 16)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleExcluir}
                >
                  <Text style={styles.modalButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Modal visible={modalVisibleAdd} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Novo Compromisso</Text>
              <TextInput
                style={styles.input}
                placeholder="Titulo"
                value={novoCompromisso.titulo}
                onChangeText={(text) =>
                  setNovoCompromisso({ ...novoCompromisso, titulo: text })
                }
              />
              <TextInput
                style={[styles.input, styles.observacaoInput]} // Aplicando estilo extra para Observação
                placeholder="Observação"
                value={novoCompromisso.anotacao}
                onChangeText={(text) =>
                  setNovoCompromisso({ ...novoCompromisso, anotacao: text })
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
                  selectedValue={novoCompromisso.status}
                  onValueChange={(value: StatusCompromisso) =>
                    setNovoCompromisso({ ...novoCompromisso, status: value })
                  }
                >
                  <Picker.Item label="AGENDADO" value="AGENDADO" />
                  <Picker.Item label="CONFIRMADO" value="CONFIRMADO" />
                  <Picker.Item label="CANCELADO" value="CANCELADO" />
                  <Picker.Item label="REAGENDADO" value="REAGENDADO" />
                  <Picker.Item label="EM_ANDAMENTO" value="EM_ANDAMENTO" />
                  <Picker.Item label="CONCLUIDO" value="CONCLUIDO" />
                </Picker>
              </View>
              <View style={{ padding: 15, gap: 10 }}>
                <TouchableOpacity
                  style={styles.buttonData}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.buttonDataText}>Selecionar Data</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonData}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.buttonDataText}>Selecionar Hora</Text>
                </TouchableOpacity>

                <Text style={{ marginTop: 16, fontSize: 16 }}>
                  Data e hora selecionadas: {date.toLocaleString("pt-BR")}
                </Text>

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    locale="pt-BR"
                    onChange={onChangeDate}
                  />
                )}

                {showTimePicker && (
                  <DateTimePicker
                    value={date}
                    mode="time"
                    display="default"
                    locale="pt-BR"
                    onChange={onChangeTime}
                  />
                )}
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleSalvarCompromisso}
                >
                  <Text style={styles.modalButtonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisibleAdd(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <TouchableOpacity
        style={styles.fabAdicionar}
        onPress={() => setModalVisibleAdd(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 5,
    paddingHorizontal: 10,
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
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    color: "#A0D4F7",
  },
  observacaoContainer: {
    height: 72,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: "#f5f5f5",
  },
  observacaoText: {
    fontSize: 15,
    color: "#444",
  },
  situacaoBadge: {
    backgroundColor: "#A0D4F7",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderBlockColor: "#A0D4F7",
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
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // opcional
  },
  dateColumn: {
    flexDirection: "column",
  },
  footerLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
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
  buttonData: {
    backgroundColor: "#A0D4F7",
    paddingVertical: 5,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5, // Espaço entre os botões
  },
  buttonDataText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  fabAdicionar: {
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
  fabTodos: {
    position: "absolute",
    right: 20,
    top: 10,
    width: 90,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#A0D4F7",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabSemana: {
    position: "absolute",
    left: 20,
    top: 10,
    width: 110,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#A0D4F7",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabHoje: {
    position: "absolute",
    left: 160,
    top: 10,
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
    fontSize: 40,
    fontWeight: "normal",
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
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  footerDateLeft: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#777777",
  },
  footerDateRight: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#777777",
    textAlign: "right",
  },
  itemText: {
    fontSize: 16,
  },
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#A0D4F7",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
