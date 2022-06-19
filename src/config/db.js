const psql = require("pg");
// koneksi dengan database menggunakan method pool, ada juga client
const { Pool } = psql;
const {DB_USER, DB_HOST, DB_DATABASE, DB_PASS,DB_PORT} = process.env;

const db = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASS,
    port: DB_PORT,
    // connectionString: process.env.DATABASE_URL,
    // ssl: {
    // rejectUnauthorized: false,
    // },
});

module.exports = db;
