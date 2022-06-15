const psql = require("pg");
// koneksi dengan database menggunakan method pool, ada juga client
const { Pool } = psql;

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: false,
    },
});

module.exports = db;
