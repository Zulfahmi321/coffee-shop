const db = require("../config/db");
const { v4: uuidV4 } = require("uuid");

const getTransactionFromServer = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT users.username, products.name, products.price, sizes.name, quantity ,(price * quantity / 100) * 5 as tax, (price * quantity) + (price * quantity / 100) * 5 as subtotal, payments.name, deliverys.name, date, users.address  FROM transactions JOIN users ON transactions.user_id = users.id JOIN sizes ON transactions.size_id = sizes.id JOIN products ON transactions.product_id = products.id JOIN payments ON transactions.payment_id = payments.id JOIN deliverys ON transactions.delivery_id = deliverys.id")
            .then(result => {
                const response = {
                    total: result.rowCount,
                    data: result.rows
                };
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

const findTransactionUser = (query) => {
    return new Promise((resolve, reject) => {
        const { id_user } = query;
        let sqlQuery = "SELECT  users.username, products.name, products.price, sizes.name, quantity ,(price * quantity / 100) * 5 as tax, (price * quantity) + (price * quantity / 100) * 5 as subtotal, payments.name, deliverys.name, date, users.address  FROM transactions JOIN users ON transactions.user_id = users.id JOIN sizes ON transactions.size_id = sizes.id JOIN products ON transactions.product_id = products.id JOIN payments ON transactions.payment_id = payments.id JOIN deliverys ON transactions.delivery_id = deliverys.id WHERE users.id =$1";
        db.query(sqlQuery, [id_user])
            .then(result => {
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "User Not Found"
                    });
                }
                const response = {
                    total: result.rowCount,
                    data: result.rows
                };
                resolve(response);
            })
            .catch((err) => {
                reject({
                    status: 500,
                    err,
                });
            });
    });

};

const getSingleTransactionsFromServer = (id_transaction) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = "SELECT users.username, products.name, products.price, sizes.name, quantity ,(price * quantity / 100) * 5 as tax, (price * quantity) + (price * quantity / 100) * 5 as subtotal, payments.name, deliverys.name, date, users.address  FROM transactions JOIN users ON transactions.user_id = users.id JOIN sizes ON transactions.size_id = sizes.id JOIN products ON transactions.product_id = products.id JOIN payments ON transactions.payment_id = payments.id JOIN deliverys ON transactions.delivery_id = deliverys.id WHERE transactions.id = $1";
        db.query(sqlQuery, [id_transaction])
            .then(result => {
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "Data Transaction Not Found"
                    });
                }
                const response = {
                    data: result.rows
                };
                resolve(response);
            })
            .catch(error => {
                reject({
                    status: 500,
                    error
                });
            });
    });
};

const createNewTransaction = (body) => {
    return new Promise((resolve, reject) => {
        const { user_id, product_id, quantity, size_id, payment_id, delivery_id, promo_id } = body;
        const sqlQuery = "INSERT INTO transactions(id, user_id, product_id, quantity, date, size_id, payment_id, delivery_id, promo_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
        const date = new Date(Date.now());
        const id = uuidV4();
        db.query(sqlQuery, [id, user_id, product_id, quantity, date, size_id, payment_id, delivery_id, promo_id])
            .then(({ rows }) => {
                const response = {
                    data: rows[0]
                };
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
    getTransactionFromServer,
    getSingleTransactionsFromServer,
    findTransactionUser
};