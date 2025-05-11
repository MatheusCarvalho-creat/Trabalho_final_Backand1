const mysql = require('mysql2/promise');
require('dotenv').config(); // Carrega as variáveis de ambiente

// Função para criar uma nova conexão com o banco
async function createConnection() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    });

    return connection;
}

module.exports = createConnection;
