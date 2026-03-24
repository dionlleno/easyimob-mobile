import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Imovel, SituacaoImovel, TipoImovel } from "../types/imovel";
import { useImovelDB } from "../db/useImovelDB";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";

type StackParamList = {
  detalhes: { imovel: Imovel };
};

type DetalhesRouteProp = RouteProp<StackParamList, "detalhes">;

export default function ImoveisDetalhes() {
  const navigation = useNavigation();

  const route = useRoute<DetalhesRouteProp>();
  const [imovel, setImovel] = useState(route.params.imovel);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { excluir, atualizar } = useImovelDB();

  const [novoImovel, setNovoImovel] = useState<Omit<Imovel, "id">>({
    logradouro: imovel.logradouro,
    numero: imovel.numero,
    complemento: imovel.complemento,
    bairro: imovel.bairro,
    cidade: imovel.cidade,
    estado: imovel.estado,
    cep: imovel.cep,
    valorTotal: imovel.valorTotal,
    valorCondominio: imovel.valorCondominio,
    valorIptu: imovel.valorIptu,
    areaQuadrada: imovel.areaQuadrada,
    quantidadeQuartos: imovel.quantidadeQuartos,
    quantidadeBanheiros: imovel.quantidadeBanheiros,
    quantidadeSuites: imovel.quantidadeSuites,
    temGaragem: imovel.temGaragem,
    quantidadeVagasGaragem: imovel.quantidadeVagasGaragem,
    tipoImovel: imovel.tipoImovel,
    observacao: imovel.observacao,
    situacao: imovel.situacao,
    dataUltimoContato: imovel.dataUltimoContato,
    dataCriacao: imovel.dataCriacao,
    dataUltimaAlteracao: imovel.dataUltimaAlteracao,
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR");
  };

  const handleConfirmarExclusao = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este imóvel?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => handleExcluirImovel(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  async function handleExcluirImovel() {
    try {
      await excluir(Number(imovel.id));
      navigation.goBack();
    } catch (err) {
      console.error("Erro ao excluir imovel: ", err);
    }
  }

  async function handleAtualizaImovel() {
    try {
      const dataAtual = new Date().toISOString();
      const imovelAtualizado = {
        ...novoImovel,
        id: imovel.id,
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
      };
      atualizar(imovelAtualizado);
      setModalVisible(false);
      setNovoImovel({
        logradouro: imovel.logradouro,
        numero: imovel.numero,
        complemento: imovel.complemento,
        bairro: imovel.bairro,
        cidade: imovel.cidade,
        estado: imovel.estado,
        cep: imovel.cep,
        valorTotal: imovel.valorTotal,
        valorCondominio: imovel.valorCondominio,
        valorIptu: imovel.valorIptu,
        areaQuadrada: imovel.areaQuadrada,
        quantidadeQuartos: imovel.quantidadeQuartos,
        quantidadeBanheiros: imovel.quantidadeBanheiros,
        quantidadeSuites: imovel.quantidadeSuites,
        temGaragem: imovel.temGaragem,
        quantidadeVagasGaragem: imovel.quantidadeVagasGaragem,
        tipoImovel: imovel.tipoImovel,
        observacao: imovel.observacao,
        situacao: imovel.situacao,
        dataUltimoContato: imovel.dataUltimoContato,
        dataCriacao: imovel.dataCriacao,
        dataUltimaAlteracao: imovel.dataUltimaAlteracao,
      });
      setImovel(imovelAtualizado);
    } catch (err) {
      console.error("Erro ao atualizar imovel:", err);
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
              value={novoImovel.cep}
              onChangeText={(text) =>
                setNovoImovel({ ...novoImovel, cep: text })
              }
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

            <Text style={{ fontWeight: "bold", marginTop: 10 }}>Situação:</Text>
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
                <Picker.Item label="DOCUMENTACAO_OK" value="DOCUMENTACAO_OK" />
                <Picker.Item label="DOCUMENTACAO_OK" value="DOCUMENTACAO_OK" />
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

            <Text style={{ fontWeight: "bold", marginTop: 10 }}>
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

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleAtualizaImovel}
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
          <Info label="ID" value={imovel.id} />
          <Info label="Tipo de Imovel" value={imovel.tipoImovel} />
          <Text style={styles.labelTitle}>Situação:</Text>
          <View style={styles.situacaoBadge}>
            <Text style={styles.situacaoText}>{imovel.situacao}</Text>
          </View>
          <Text style={styles.labelTitle}>Valores</Text>
          <Info
            label="Final"
            value={new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(imovel.valorTotal)}
          />
          <Info
            label="IPTU"
            value={new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(imovel.valorIptu)}
          />
          <Info
            label="Cond."
            value={new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(imovel.valorCondominio)}
          />
          <Text style={styles.labelTitle}>Endereço</Text>
          <Info label="Logradouro" value={imovel.logradouro} />
          <Info label="Numero" value={imovel.numero} />
          <Info label="Bairro" value={imovel.bairro} />
          <Info label="Cidade" value={imovel.cidade} />
          <Info label="Estado" value={imovel.estado} />
          <Info label="CEP" value={imovel.cep} />
          <Text style={styles.labelTitle}>Observação:</Text>
          <View style={styles.observacaoContainer}>
            <ScrollView>
              <Text style={styles.observacaoText}>
                {imovel.observacao || "N/A"}
              </Text>
            </ScrollView>
          </View>
          <Text style={styles.labelTitle}>Caracteristicas</Text>
          <Info label="Area em m²" value={imovel.areaQuadrada} />
          <Info label="Quant. Quartos" value={imovel.quantidadeQuartos} />
          <Info label="Quant. Banheiros" value={imovel.quantidadeBanheiros} />
          <Info label="Quant. Suites" value={imovel.quantidadeSuites} />
          <InfoBoolean label="Tem garagem" value={imovel.temGaragem} />
          <Info label="Quant. Vagas" value={imovel.quantidadeVagasGaragem} />
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
            {formatDate(imovel.dataUltimoContato)}
          </Text>
        </View>
        <View style={styles.dateColumn}>
          <Text style={styles.footerLabel}>Criado em</Text>
          <Text style={styles.footerValue}>
            {formatDate(imovel.dataCriacao)}
          </Text>
        </View>
        <View style={styles.dateColumn}>
          <Text style={styles.footerLabel}>Última Alteração</Text>
          <Text style={styles.footerValue}>
            {formatDate(imovel.dataUltimaAlteracao)}
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

function InfoBoolean({ label, value }: { label: string; value: boolean }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value ? "Sim" : "Não"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom: 100,
    borderRadius: 15,
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
  labelTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#777777",
    marginTop: 10,
  },
  label: {
    fontSize: 14,
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
    padding: 8,
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
    bottom: 66,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
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
    backgroundColor: "#999",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pickerAndroid: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  pickerContainer: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
  },
  picker: {
    height: 40,
  },
});
