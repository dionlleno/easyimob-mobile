import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Modal,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Imovel, SituacaoImovel, TipoImovel } from "../types/imovel";
import { useImovelDB } from "../db/useImovelDB";
import { useCallback, useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native-gesture-handler";

type StackParamList = {
  listagem: undefined;
  detalhes: { imovel: Imovel };
};

type NavigationProp = NativeStackNavigationProp<StackParamList, "listagem">;

export default function ImoveisListagem() {
  const navigation = useNavigation<NavigationProp>();

  const { listar, adicionar } = useImovelDB();

  const [imoveis, setImoveis] = useState<Imovel[]>([]);

  const [dadosOriginais, setDadosOriginais] = useState<Imovel[]>([]);

  const [busca, setBusca] = useState<string>("");

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [novoImovel, setNovoImovel] = useState<Omit<Imovel, "id">>({
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    valorTotal: 0,
    valorCondominio: 0,
    valorIptu: 0,
    areaQuadrada: 0,
    quantidadeQuartos: 0,
    quantidadeBanheiros: 0,
    quantidadeSuites: 0,
    temGaragem: false,
    quantidadeVagasGaragem: 0,
    tipoImovel: "CASA",
    observacao: "",
    situacao: "DISPONIVEL",
    dataUltimoContato: "",
    dataCriacao: "",
    dataUltimaAlteracao: "",
  });

  useEffect(() => {
    carregarImoveis();
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarImoveis(); // Recarrega sempre que a tela ganha foco
    }, [])
  );

  async function carregarImoveis() {
    try {
      const resultado = await listar();
      setImoveis(resultado);
      setDadosOriginais(resultado);
    } catch (err) {
      console.error("Erro ao carregar imoveis!");
    }
  }

  function handleBuscar(texto: string) {
    setBusca(texto);

    const textoBusca = texto.toLowerCase();

    const filtrados = dadosOriginais.filter(
      (imovel) =>
        imovel.bairro.toLowerCase().includes(textoBusca) ||
        imovel.cep.toLowerCase().includes(textoBusca) ||
        imovel.cidade.toLowerCase().includes(textoBusca) ||
        imovel.logradouro.toLowerCase().includes(textoBusca) ||
        imovel.estado.toLowerCase().includes(textoBusca)
    );
    setImoveis(filtrados);
  }

  const renderItem: ListRenderItem<Imovel> = ({ item }) => {
    const enderecoCompleto = `${item.logradouro}, ${item.bairro}, ${item.cidade} - ${item.estado}, CEP: ${item.cep}`;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("detalhes", { imovel: item })}
      >
        <View style={styles.itemContainer}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{item.tipoImovel}</Text>
            <Text style={styles.itemId}>Id: {item.id}</Text>
          </View>
          <Text style={styles.itemEndereco}>{enderecoCompleto}</Text>
          <View style={styles.itemMiddle}>
            <View style={styles.situacaoBadge}>
              <Text style={styles.situacaoText}>{item.situacao}</Text>
            </View>
          </View>
          <Text style={styles.itemValor}>
            Total:{" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(item.valorTotal)}
          </Text>
          <Text style={styles.itemValor}>
            IPTU:{" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(item.valorIptu)}
          </Text>
          <View style={styles.itemFooter}>
            <Text style={styles.footerDateLeft}>
              Último Contato: {item.dataUltimoContato.slice(0, 10)}
            </Text>
            <Text style={styles.footerDateRight}>
              Atualizado: {item.dataUltimaAlteracao.slice(0, 10)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  async function handleSalvarNovoImovel() {
    try {
      const dataAtual = new Date().toISOString();
      await adicionar({
        ...novoImovel,
        logradouro: novoImovel.logradouro.toUpperCase(),
        numero: novoImovel.numero,
        complemento: novoImovel.complemento?.toUpperCase(),
        bairro: novoImovel.bairro.toUpperCase(),
        cidade: novoImovel.cidade.toUpperCase(),
        estado: novoImovel.estado.toUpperCase(),
        cep: novoImovel.cep,
        valorTotal: novoImovel.valorTotal,
        valorCondominio: novoImovel.valorCondominio,
        valorIptu: novoImovel.valorIptu,
        areaQuadrada: novoImovel.areaQuadrada,
        quantidadeBanheiros: novoImovel.quantidadeBanheiros,
        quantidadeQuartos: novoImovel.quantidadeQuartos,
        quantidadeSuites: novoImovel.quantidadeSuites,
        temGaragem: novoImovel.temGaragem,
        quantidadeVagasGaragem: novoImovel.quantidadeVagasGaragem,
        observacao: novoImovel.observacao?.toUpperCase(),
        dataCriacao: dataAtual,
        dataUltimaAlteracao: dataAtual,
        dataUltimoContato: dataAtual,
      });
      setModalVisible(false);
      setNovoImovel({
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
        valorTotal: 0,
        valorCondominio: 0,
        valorIptu: 0,
        areaQuadrada: 0,
        quantidadeBanheiros: 0,
        quantidadeQuartos: 0,
        quantidadeSuites: 0,
        temGaragem: false,
        quantidadeVagasGaragem: 0,
        tipoImovel: "CASA",
        observacao: "",
        situacao: "DISPONIVEL",
        dataCriacao: "",
        dataUltimaAlteracao: "",
        dataUltimoContato: "",
      });
      await carregarImoveis();
    } catch (err) {
      console.error("Erro ao adicionar imovel: ", err);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por endereço"
        value={busca}
        onChangeText={handleBuscar}
      />

      <FlatList
        data={imoveis}
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
              <ScrollView>
                <Text style={styles.modalTitle}>Novo Cliente</Text>

                <Text style={{ fontWeight: "bold", marginTop: 10, color: "#777777" }}>
                  Endereço:
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Logradouro"
                  value={novoImovel.logradouro}
                  onChangeText={(text) =>
                    setNovoImovel({ ...novoImovel, logradouro: text })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Numero"
                  value={novoImovel.numero}
                  onChangeText={(text) =>
                    setNovoImovel({ ...novoImovel, numero: text })
                  }
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Complemento"
                  value={novoImovel.complemento}
                  onChangeText={(text) =>
                    setNovoImovel({ ...novoImovel, complemento: text })
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Bairro"
                  value={novoImovel.bairro}
                  onChangeText={(text) =>
                    setNovoImovel({ ...novoImovel, bairro: text })
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Cidade"
                  value={novoImovel.cidade}
                  onChangeText={(text) =>
                    setNovoImovel({ ...novoImovel, cidade: text })
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Estado"
                  value={novoImovel.estado}
                  onChangeText={(text) =>
                    setNovoImovel({ ...novoImovel, estado: text })
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="CEP"
                  value={novoImovel.cep} // garante que o valor seja string
                  onChangeText={(text) =>
                    setNovoImovel({ ...novoImovel, cep: text })
                  }
                  keyboardType="numeric" // exibe teclado numérico
                />

                <TextInput
                  style={[styles.input, styles.observacaoInput]} // Aplicando estilo extra para Observação
                  placeholder="Observação"
                  value={novoImovel.observacao}
                  onChangeText={(text) =>
                    setNovoImovel({ ...novoImovel, observacao: text })
                  }
                  multiline={true} // Permite múltiplas linhas
                  numberOfLines={3} // Exibe 3 linhas visíveis
                />

                <Text style={{ fontWeight: "bold", marginTop: 10, color: "#777777" }}>
                  Situação:
                </Text>
                <View
                  style={
                    Platform.OS === "android" ? styles.pickerAndroid : undefined
                  }
                >
                  <Picker
                    selectedValue={novoImovel.situacao}
                    onValueChange={(value: SituacaoImovel) =>
                      setNovoImovel({ ...novoImovel, situacao: value })
                    }
                  >
                    <Picker.Item label="DISPONIVEL" value="DISPONIVEL" />
                    <Picker.Item label="VENDIDO" value="VENDIDO" />
                    <Picker.Item label="ALUGADO" value="ALUGADO" />
                    <Picker.Item label="RESERVADO" value="RESERVADO" />
                    <Picker.Item
                      label="DOCUMENTACAO_OK"
                      value="DOCUMENTACAO_OK"
                    />
                    <Picker.Item
                      label="DOCUMENTACAO_OK"
                      value="DOCUMENTACAO_OK"
                    />
                    <Picker.Item
                      label="PENDENTE_DOCUMENTO"
                      value="PENDENTE_DOCUMENTO"
                    />
                    <Picker.Item
                      label="DOCUMENTACAO_IRREGULAR"
                      value="DOCUMENTACAO_IRREGULAR"
                    />
                    <Picker.Item label="DESOCUPADO" value="DESOCUPADO" />
                    <Picker.Item label="OCUPADO" value="OCUPADO" />
                    <Picker.Item label="EM_REFORMA" value="EM_REFORMA" />
                    <Picker.Item label="EM_NEGOCIACAO" value="EM_NEGOCIACAO" />
                    <Picker.Item
                      label="AGUARDANDO_APROVACAO"
                      value="AGUARDANDO_APROVACAO"
                    />
                    <Picker.Item
                      label="CONTRATO_ASSINADO"
                      value="CONTRATO_ASSINADO"
                    />
                  </Picker>
                </View>

                <Text style={{ fontWeight: "bold", marginTop: 10, color: "#777777" }}>
                  Tipo de Imovel:
                </Text>
                <View
                  style={
                    Platform.OS === "android" ? styles.pickerAndroid : undefined
                  }
                >
                  <Picker
                    selectedValue={novoImovel.tipoImovel}
                    onValueChange={(value: TipoImovel) =>
                      setNovoImovel({ ...novoImovel, tipoImovel: value })
                    }
                  >
                    <Picker.Item label="APARTAMENTO" value="APARTAMENTO" />
                    <Picker.Item label="CASA" value="CASA" />
                    <Picker.Item label="TERRENO" value="TERRENO" />
                    <Picker.Item label="COMERCIAL" value="COMERCIAL" />
                  </Picker>
                </View>

                <Text style={{ fontWeight: "bold", marginTop: 10, color: "#777777" }}>
                  Valores:
                </Text>

                <Text style={{ fontWeight: "normal", marginTop: 10, color: "#777777" }}>
                  Total:
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Valor Final"
                  value={String(novoImovel.valorTotal)} // garante que o valor seja string
                  onChangeText={(text) =>
                    setNovoImovel({
                      ...novoImovel,
                      valorTotal: parseFloat(text),
                    })
                  }
                  keyboardType="numeric" // exibe teclado numérico
                />
                <Text style={{ fontWeight: "normal", marginTop: 10, color: "#777777" }}>
                  IPTU:
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Valor IPTU"
                  value={String(novoImovel.valorIptu)} // garante que o valor seja string
                  onChangeText={(text) =>
                    setNovoImovel({
                      ...novoImovel,
                      valorIptu: parseFloat(text),
                    })
                  }
                  keyboardType="numeric" // exibe teclado numérico
                />
                <Text style={{ fontWeight: "normal", marginTop: 10, color: "#777777" }}>
                  Condominio:
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Valor Final"
                  value={String(novoImovel.valorCondominio)} // garante que o valor seja string
                  onChangeText={(text) =>
                    setNovoImovel({
                      ...novoImovel,
                      valorCondominio: parseFloat(text),
                    })
                  }
                  keyboardType="numeric" // exibe teclado numérico
                />

                <Text style={{ fontWeight: "bold", marginTop: 10, color: "#777777" }}>
                  Caracteristicas:
                </Text>

                <Text style={{ fontWeight: "normal", marginTop: 10, color: "#777777" }}>
                  Quant. Quartos:
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Quant. Quartos"
                  value={String(novoImovel.quantidadeQuartos)} // garante que o valor seja string
                  onChangeText={(text) =>
                    setNovoImovel({
                      ...novoImovel,
                      quantidadeQuartos: parseFloat(text),
                    })
                  }
                  keyboardType="numeric" // exibe teclado numérico
                />

                <Text style={{ fontWeight: "normal", marginTop: 10, color: "#777777" }}>
                  Quant. Banheiros:
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Quant. Banheiros"
                  value={String(novoImovel.quantidadeBanheiros)} // garante que o valor seja string
                  onChangeText={(text) =>
                    setNovoImovel({
                      ...novoImovel,
                      quantidadeBanheiros: parseFloat(text),
                    })
                  }
                  keyboardType="numeric" // exibe teclado numérico
                />

                <Text style={{ fontWeight: "normal", marginTop: 10, color: "#777777" }}>
                  Quant. Suites:
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Quant. Suites"
                  value={String(novoImovel.quantidadeSuites)} // garante que o valor seja string
                  onChangeText={(text) =>
                    setNovoImovel({
                      ...novoImovel,
                      quantidadeSuites: parseFloat(text),
                    })
                  }
                  keyboardType="numeric" // exibe teclado numérico
                />

                <Text style={{ fontWeight: "normal", marginTop: 10, color: "#777777" }}>
                  Possui Garagem:
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Switch
                    value={novoImovel.temGaragem}
                    onValueChange={(value) =>
                      setNovoImovel({ ...novoImovel, temGaragem: value })
                    }
                  />
                  <Text style={{ marginLeft: 10 }}>
                    {novoImovel.temGaragem ? "Sim" : "Não"}
                  </Text>
                </View>

                <Text style={{ fontWeight: "normal", marginTop: 10, color: "#777777" }}>
                  Quant. Vagas:
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Quant. Vagas"
                  value={String(novoImovel.quantidadeVagasGaragem)} // garante que o valor seja string
                  onChangeText={(text) =>
                    setNovoImovel({
                      ...novoImovel,
                      quantidadeVagasGaragem: parseFloat(text),
                    })
                  }
                  keyboardType="numeric" // exibe teclado numérico
                />
              </ScrollView>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleSalvarNovoImovel}
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
  itemValor: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#A0D4F7",
  },
  itemMiddle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  endereco: {
    justifyContent: "center",
  },
  itemEndereco: {
    fontSize: 15,
    color: "#777777",
    paddingTop: 10,
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
    textAlign: "right",
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
    color: "#A0D4F7"
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
