const mysql = require('mysql2');
require('dotenv').config();

// Configuração da conexão com o MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.message);
        process.exit(1); // Finaliza o processo em caso de erro
    }
    console.log('Conexão ao MySQL bem-sucedida');
});

module.exports = db;
