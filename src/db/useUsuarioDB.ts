import bcrypt from 'bcryptjs';
import { useSQLiteContext } from "expo-sqlite";
import { Usuario } from "../types/usuario";

export function useUsuarioDB() {
  const database = useSQLiteContext();

  async function adicionar(usuario: Omit<Usuario, "id">) {

    const salt = bcrypt.genSaltSync(10);
    const senhaHash = bcrypt.hashSync(usuario.senha, salt);

    const statement = await database.prepareAsync(
      "INSERT INTO usuarios (nome, email, senha, dataCriacao) VALUES ($nome, $email, $senha, $dataCriacao)"
    );
    try {
      const result = await statement.executeAsync({
        $nome: usuario.nome.toUpperCase(),
        $email: usuario.email.toLowerCase(),
        $senha: senhaHash, // Idealmente, criptografar a senha
        $dataCriacao: usuario.dataCriacao,
      });
      const insertedId = result.lastInsertRowId.toString();
      return { insertedId };
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      throw error;
    }
  }

  async function buscarPorEmailSenha(email: string, senha: string) {
    const result = await database.getFirstAsync<Usuario>(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (!result) {
      throw new Error('Usuário não encontrado');
    }

    const senhaCorreta = bcrypt.compareSync(senha, result.senha);

    if (!senhaCorreta) {
      throw new Error('Senha incorreta');
    }

    return result;
  }

  async function listar() {
    try {
      const result = await database.getAllAsync<Usuario>(
        "SELECT * FROM usuarios ORDER BY nome ASC"
      );
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function excluir(id: number) {
    const statement = await database.prepareAsync(
      "DELETE FROM usuarios WHERE id = ?"
    );
    try {
      await statement.executeAsync([id]);
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function deletarTabela() {
    try {
      await database.execAsync(`
        DELETE FROM usuarios;
        DELETE FROM sqlite_sequence WHERE name='usuarios';
      `);
      console.log('Tabela "usuarios" deletada com sucesso.');
      return true;
    } catch (error) {
      console.error('Erro ao deletar a tabela "usuarios":', error);
      throw error;
    }
  }

  return {
    adicionar,
    buscarPorEmailSenha,
    listar,
    excluir,
    deletarTabela,
  };
}
