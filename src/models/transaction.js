const db = require("../config/db");

const getTransactionFromServer = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT username product_name, product_total, item_total, transaction_date, address_details FROM transactions JOIN products ON transactions.id_product = products.id_product JOIN users ON transactions.id_user = users.id_user")
            .then(result => {
                const response = {
                    total: result.rowCount,
                    data: result.rows
                }
                resolve(response);
            })
            .catch(err => {
                reject({
                    status: 500,
                    err
                });
            });
    });
};

const getSingleTransactionsFromServer = (id_transaction) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = "SELECT username product_name, product_total, item_total, transaction_date, address_details FROM transactions JOIN products ON transactions.id_product = products.id_product JOIN users ON transactions.id_user = users.id_user WHERE id_transaction =$1"
    });
}

const createNewTransaction = (body) => {
    return new Promise((resolve, reject) => {
        const { username, product_name, product_size_name, product_total, item_total, transaction_date, address_details } = body
        const sqlQuery = "INSERT INTO transactions(username, product_name, product_size_name, product_total, item_total, transaction_date, address_details) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *";
        db.query(sqlQuery, [username, product_name, product_size_name, product_total, item_total, transaction_date, address_details])
            .then(({ rows }) => {
                const response = {
                    data: rows[0]
                }
                resolve(response);
            })
            .catch((error) => {
                reject({
                    status: 500,
                    err: error
                });
            });
    });
};


module.exports = {
    createNewTransaction,
    getTransactionFromServer
}