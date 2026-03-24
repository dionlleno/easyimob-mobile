import { useSQLiteContext } from "expo-sqlite";
import { Compromisso } from "../types/compromisso";

export function useCompromissoDB() {
  const database = useSQLiteContext();

  async function adicionar(compromisso: Omit<Compromisso, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO compromissos (titulo, data, anotacao, status, dataCriacao, dataUltimaAlteracao) VALUES ($titulo, $data, $anotacao, $status, $dataCriacao, $dataUltimaAlteracao);"
    );
    try {
      const result = await statement.executeAsync({
        $titulo: (compromisso.titulo ?? "").toUpperCase(),
        $data: compromisso.data ?? "",
        $anotacao: (compromisso.anotacao ?? "").toUpperCase(),
        $status: compromisso.status,
        $dataCriacao: compromisso.dataCriacao,
        $dataUltimaAlteracao: compromisso.dataUltimaAlteracao,
      });
      console.log("Banco de Dados: Compromisso adicionado ->\n  ", compromisso);
      const insertedId = result.lastInsertRowId.toLocaleString();
      return { insertedId };
    } catch (error) {
      console.error("Banco de Dados: Erro ao adicionar compromisso ->\n  ", error);
      throw error;
    }
  }

  async function atualizar(compromisso: Compromisso) {
    const statement = await database.prepareAsync(
      "UPDATE compromissos SET titulo = $titulo, data = $data, horario = $horario, anotacao = $anotacao, status = $status, dataCriacao = $dataCriacao, dataUltimaAlteracao = $dataUltimaAlteracao WHERE id = $id;"
    );
    try {
      await statement.executeAsync({
        $id: compromisso.id,
        $titulo: (compromisso.titulo ?? "").toUpperCase(),
        $data: compromisso.data ?? "",
        $anotacao: (compromisso.anotacao ?? "").toUpperCase(),
        $status: compromisso.status,
        $dataCriacao: compromisso.dataCriacao,
        $dataUltimaAlteracao: compromisso.dataUltimaAlteracao,
      });
      console.log("Banco de Dados: Compromisso adicionado ->\n  ", compromisso)
      return true;
    } catch (error) {
      console.error("Banco de Dados: Erro ao adicionar compromisso ->\n  ", error);
      throw error;
    }
  }

  async function listar() {
    try {
      const result = await database.getAllAsync<Compromisso>(
        "SELECT * FROM compromissos ORDER BY data ASC"
      );
      console.log("Banco de Dados: Listagem de conpromissos");
      return result;
    } catch (error) {
      console.error("Banco de Dados: Erro ao listar compromissos ->\n  ", error);
      throw error;
    }
  }

  async function buscarPorId(id: string) {
    try {
      const result = await database.getFirstAsync<Compromisso>(
        "SELECT * FROM compromissos WHERE id = ?",
        [id]
      );
      console.log("Bando de Dados: Buscando compromisso por ID:\n  ", result)
      return result;
    } catch (error) {
      console.error("Banco de Dados: Erro ao buscar compromisso por ID:\n  ", error);
      throw error;
    }
  }

  async function excluir(id: string) {
    const statement = await database.prepareAsync(
      "DELETE FROM compromissos WHERE id = ?"
    );
    try {
      await statement.executeAsync([id]);
      console.log("Banco de Dados: Compromisso excluido");
      return true;
    } catch (error) {
      console.error("Banco de Dados: Erro ao excluir compromisso ->\n  ", error);
      throw error;
    }
  }

  async function deletarTabela() {
    try {
      await database.execAsync(`
        DELETE FROM compromissos;
        DELETE FROM sqlite_sequence WHERE name='compromissos';
      `);
      console.log('Banco de Dados: Tabela de compromissos deletada com sucesso');
      return true;
    } catch (error) {
      console.error('Banco de Dados: Erro ao deletar a tabela de compromissos ->\n  ', error);
      throw error;
    }
  }

  return { adicionar, listar, atualizar, buscarPorId, excluir, deletarTabela };
}
