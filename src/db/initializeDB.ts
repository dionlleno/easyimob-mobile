import { SQLiteDatabase } from "expo-sqlite";

export async function initializeDB(database: SQLiteDatabase) {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            telefone TEXT,
            email TEXT,
            observacao TEXT,
            dataCriacao TEXT,
            dataUltimaAlteracao TEXT,
            dataUltimoContato TEXT,
            situacao TEXT
        );
        
        CREATE TABLE IF NOT EXISTS imoveis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            logradouro TEXT,
            numero TEXT,
            complemento TEXT,
            bairro TEXT,
            cidade TEXT,
            estado TEXT,
            cep TEXT,
            valorTotal REAL,
            valorCondominio REAL,
            valorIptu REAL,
            areaQuadrada REAL,
            quantidadeQuartos INTEGER,
            quantidadeBanheiros INTEGER,
            quantidadeSuites INTEGER,
            temGaragem INTEGER,
            quantidadeVagasGaragem INTEGER,
            tipoImovel TEXT,
            observacao TEXT,
            situacao TEXT,
            dataUltimoContato TEXT,
            dataCriacao TEXT,
            dataUltimaAlteracao TEXT
        );

        CREATE TABLE IF NOT EXISTS compromissos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT,
            data TEXT,
            anotacao TEXT,
            status TEXT,
            dataCriacao TEXT,
            dataUltimaAlteracao TEXT
        );

        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            dataCriacao TEXT NOT NULL
        );
    `)
    console.log("Banco de Dados: Tabelas criadas ");
}