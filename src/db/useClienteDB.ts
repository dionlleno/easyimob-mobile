import { useSQLiteContext } from "expo-sqlite";
import { Cliente } from "../types/cliente";

export function useClienteDB() {
  const database = useSQLiteContext();

  async function adicionar(cliente: Omit<Cliente, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO clientes (nome, telefone, email, observacao, situacao, dataUltimoContato, dataCriacao, dataUltimaAlteracao) VALUES ($nome, $telefone, $email, $observacao, $situacao, $dataUltimoContato, $dataCriacao, $dataUltimaAlteracao)"
    );
    try {
      const result = await statement.executeAsync({
        $nome: (cliente.nome ?? "").toUpperCase(),
        $telefone: cliente.telefone ?? "",
        $email: (cliente.email ?? "").toUpperCase(),
        $observacao: (cliente.observacao ?? "").toUpperCase(),
        $situacao: cliente.situacao,
        $dataUltimoContato: cliente.dataUltimoContato,
        $dataCriacao: cliente.dataCriacao,
        $dataUltimaAlteracao: cliente.dataUltimaAlteracao,
      });
      console.log("Bando de Dados: Cliente adicionado ->\n  ", result);
      const insertedId = result.lastInsertRowId.toLocaleString();
      return { insertedId };
    } catch (error) {
      console.error("Bando de Dados: Erro ao adicionar cliente ->\n  ", error);
      throw error;
    }
  }

  async function atualizar(cliente: Cliente) {
    const statement = await database.prepareAsync(
      "UPDATE clientes SET nome = $nome, telefone = $telefone, email = $email, observacao = $observacao, situacao = $situacao, dataUltimaAlteracao = $dataUltimaAlteracao WHERE id = $id"
    );
    try {
      await statement.executeAsync({
        $id: cliente.id,
        $nome: (cliente.nome ?? "").toUpperCase(),
        $telefone: cliente.telefone ?? "",
        $email: (cliente.email ?? "").toUpperCase(),
        $observacao: (cliente.observacao ?? "").toUpperCase(),
        $situacao: cliente.situacao,
        $dataUltimaAlteracao: new Date().toISOString(),
      });
      console.log("Bando de Dados: Cliente atualizado ->\n  ", cliente)
      return true;
    } catch (error) {
      console.error("Bando de Dados: Erro ao atualizar cliente ->\n  ",error);
      throw error;
    }
  }

  async function listar() {
    try {
      const result = await database.getAllAsync<Cliente>(
        "SELECT * FROM clientes ORDER BY nome ASC"
      );
      console.log("Bando de Dados: Listagem de clientes")
      return result;
    } catch (error) {
      console.error("Bando de Dados: Erro ao listar clientes ->\n  ",error);
      throw error;
    }
  }

  async function buscarPorId(id: string) {
    try {
      const result = await database.getFirstAsync<Cliente>(
        "SELECT * FROM clientes WHERE id = ?",
        [id]
      );
      console.log("Bando de Dados: Buscando cliente por ID ->\n  ", result);
      return result;
    } catch (error) {
      console.error("Banco de Dados: Erro ao buscar cliente por ID ->\n", error);
      throw error;
    }
  }

  async function excluir(id: number) {
    const statement = await database.prepareAsync(
      "DELETE FROM clientes WHERE id = ?"
    );
    try {
      await statement.executeAsync([id]);
      console.log("Banco de Dados: Cliente excluido");
      return true;
    } catch (error) {
      console.error("Banco de Dados: Erro ao excluir cliente ->\n  ", error);
      throw error;
    }
  }

  async function deletarTabela() {
    try {
      await database.execAsync(`
        DELETE FROM clientes;
        DELETE FROM sqlite_sequence WHERE name='clientes';
      `);
      console.log('Banco de Dados: Tabela de clientes deletada com sucesso');
      return true;
    } catch (error) {
      console.error('Banco de Dados: Erro ao deletar a tabela de clientes ->\n', error);
      throw error;
    }
  }

  return { adicionar, listar, atualizar, buscarPorId, excluir, deletarTabela };
}
