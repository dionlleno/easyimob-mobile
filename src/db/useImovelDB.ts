import { useSQLiteContext } from "expo-sqlite";
import { Imovel } from "../types/imovel";

export function useImovelDB() {
  const database = useSQLiteContext();

  async function adicionar(imovel: Omit<Imovel, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO imoveis (logradouro, numero, complemento, bairro, cidade, estado, cep, valorTotal, valorCondominio, valorIptu, areaQuadrada, quantidadeQuartos, quantidadeBanheiros, quantidadeSuites, temGaragem, quantidadeVagasGaragem, tipoImovel, observacao, situacao, dataUltimoContato, dataCriacao, dataUltimaAlteracao) VALUES ($logradouro, $numero, $complemento, $bairro, $cidade, $estado, $cep, $valorTotal, $valorCondominio, $valorIptu, $areaQuadrada, $quantidadeQuartos, $quantidadeBanheiros, $quantidadeSuites, $temGaragem, $quantidadeVagasGaragem, $tipoImovel, $observacao, $situacao, $dataUltimoContato, $dataCriacao, $dataUltimaAlteracao)"
    );
    try {
      const agora = new Date().toISOString();
      const result = await statement.executeAsync({
        $logradouro: (imovel.logradouro ?? "").toUpperCase(),
        $numero: (imovel.numero ?? "").toUpperCase(),
        $complemento: (imovel.complemento ?? "").toUpperCase(),
        $bairro: (imovel.bairro ?? "").toUpperCase(),
        $cidade: (imovel.cidade ?? "").toUpperCase(),
        $estado: (imovel.estado ?? "").toUpperCase(),
        $cep: imovel.cep ?? "",
        $valorTotal: parseFloat(imovel.valorTotal?.toString() || "0"),
        $valorCondominio: parseFloat(imovel.valorCondominio?.toString() || "0"),
        $valorIptu: parseFloat(imovel.valorIptu?.toString() || "0"),
        $areaQuadrada: parseFloat(imovel.areaQuadrada?.toString() || "0"),
        $quantidadeQuartos: parseInt(
          imovel.quantidadeQuartos?.toString() || "0"
        ),
        $quantidadeBanheiros: parseInt(
          imovel.quantidadeBanheiros?.toString() || "0"
        ),
        $quantidadeSuites: parseInt(imovel.quantidadeSuites?.toString() || "0"),
        $temGaragem: imovel.temGaragem ? 1 : 0,
        $quantidadeVagasGaragem: parseInt(
          imovel.quantidadeVagasGaragem?.toString() || "0"
        ),
        $tipoImovel: imovel.tipoImovel ?? "apartamento",
        $observacao: (imovel.observacao ?? "").toUpperCase(),
        $situacao: imovel.situacao ?? "DISPONIVEL",
        $dataUltimoContato: agora,
        $dataCriacao: agora,
        $dataUltimaAlteracao: agora,
      });
      console.log("Banco de Dados: Imovel adicionado ->\n  ", result);
      const insertedId = result.lastInsertRowId.toLocaleString();
      return { insertedId };
    } catch (error) {
      console.error("Banco de Dados: Erro ao adicionar imovel ->\n  ", error);
      throw error;
    }
  }

  async function atualizar(imovel: Imovel) {
    const statement = await database.prepareAsync(
      "UPDATE imoveis SET logradouro = $logradouro, numero = $numero, complemento = $complemento, bairro = $bairro, cidade = $cidade, estado = $estado, cep = $cep, valorTotal = $valorTotal, valorCondominio = $valorCondominio, valorIptu = $valorIptu, areaQuadrada = $areaQuadrada, quantidadeQuartos = $quantidadeQuartos, quantidadeBanheiros = $quantidadeBanheiros, quantidadeSuites = $quantidadeSuites, temGaragem = $temGaragem, quantidadeVagasGaragem = $quantidadeVagasGaragem, tipoImovel = $tipoImovel, observacao = $observacao, situacao = $situacao, dataUltimoContato = $dataUltimoContato, dataUltimaAlteracao = $dataUltimaAlteracao WHERE id = $id"
    );
    try {
      const agora = new Date().toISOString();
      await statement.executeAsync({
        $id: imovel.id,
        $logradouro: (imovel.logradouro ?? "").toUpperCase(),
        $numero: (imovel.numero ?? "").toUpperCase(),
        $complemento: (imovel.complemento ?? "").toUpperCase(),
        $bairro: (imovel.bairro ?? "").toUpperCase(),
        $cidade: (imovel.cidade ?? "").toUpperCase(),
        $estado: (imovel.estado ?? "").toUpperCase(),
        $cep: imovel.cep ?? "",
        $valorTotal: imovel.valorTotal ?? 0,
        $valorCondominio: imovel.valorCondominio ?? 0,
        $valorIptu: imovel.valorIptu ?? 0,
        $areaQuadrada: imovel.areaQuadrada ?? 0,
        $quantidadeQuartos: imovel.quantidadeQuartos ?? 0,
        $quantidadeBanheiros: imovel.quantidadeBanheiros ?? 0,
        $quantidadeSuites: imovel.quantidadeSuites ?? 0,
        $temGaragem: imovel.temGaragem ?? false,
        $quantidadeVagasGaragem: imovel.quantidadeVagasGaragem ?? 0,
        $tipoImovel: imovel.tipoImovel ?? "apartamento",
        $observacao: (imovel.observacao ?? "").toUpperCase(),
        $situacao: imovel.situacao ?? "DISPONIVEL",
        $dataUltimoContato: agora,
        $dataUltimaAlteracao: agora,
      });
      console.log("Banco de Dados: Imovel atualizado ->\n  ", imovel)
      return true;
    } catch (error) {
      console.error("Banco de Dados: Erro ao atualizar imovel ->\n  ", error);
      throw error;
    }
  }

  async function listar() {
    try {
      const result = await database.getAllAsync<Imovel>(
        "SELECT * FROM imoveis ORDER BY logradouro ASC"
      );
      console.log("Banco de Dados: Listagem de imoveis")
      return result;
    } catch (error) {
      console.error("Banco de Dados: Erro ao listar imoveis ->\n  ", error);
      throw error;
    }
  }

  async function buscarPorId(id: string) {
    try {
      const result = await database.getFirstAsync<Imovel>(
        "SELECT * FROM imoveis WHERE id = ?",
        [id]
      );
      console.log("Banco de Dados: Buscando imovel por ID ->\n  ", result);
      return result;
    } catch (error) {
      console.error("Banco de Dados: Erro ao buscar o imovel por ID ->\n  ", error);
      throw error;
    }
  }

  async function excluir(id: number) {
    const statement = await database.prepareAsync(
      "DELETE FROM imoveis WHERE id = ?"
    );
    try {
      await statement.executeAsync([id]);
      console.log("Banco de Dados: Compromiso excluido");
      return true;
    } catch (error) {
      console.error("Banco de Dados: Erro ao excluir imovel ->\n  ", error);
      throw error;
    }
  }

  async function deletarTabela() {
    try {
      await database.execAsync(`
        DELETE FROM imoveis;
        DELETE FROM sqlite_sequence WHERE name='imoveis';
      `);
      console.log('Banco de Dados: Tabela de imoveis deletada com sucesso');
      return true;
    } catch (error) {
      console.error('Banco de Dados: Erro ao deletar a tabela de imoveis:', error);
      throw error;
    }
  }

  return { adicionar, listar, atualizar, buscarPorId, excluir, deletarTabela };
}
