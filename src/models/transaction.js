const db = require("../config/db");

const getTransactionFromServer = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT users.username, products.product_name, products.product_price, product_sizes.product_size_name , item_total ,product_price * item_total as subtotal, (product_price * item_total / 100)*5 as tax, range, range*5000 as shipping, payment_methods.payment_method_name, delivery_methods.name_delivery_method ,transaction_date, address_details FROM transactions JOIN users ON transactions.id_user = users.id_user JOIN product_sizes ON transactions.id_product_size = product_sizes.id_product_size JOIN products ON transactions.id_product = products.id_product JOIN payment_methods ON transactions.id_payment_method = payment_methods.id_payment_method JOIN delivery_methods ON transactions.id_delivery_method  = delivery_methods.id_delivery_method")
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
        const sqlQuery = "SELECT users.username, products.product_name, products.product_price, product_sizes.product_size_name , item_total ,product_price * item_total as subtotal, (product_price * item_total / 100)*5 as tax, range, range*5000 as shipping, payment_methods.payment_method_name, delivery_methods.name_delivery_method ,transaction_date, address_details FROM transactions JOIN users ON transactions.id_user = users.id_user JOIN product_sizes ON transactions.id_product_size = product_sizes.id_product_size JOIN products ON transactions.id_product = products.id_product JOIN payment_methods ON transactions.id_payment_method = payment_methods.id_payment_method JOIN delivery_methods ON transactions.id_delivery_method  = delivery_methods.id_delivery_method WHERE id_transaction = $1";
        db.query(sqlQuery, [id_transaction])
            .then(result => {
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "Data Transaction Not Found"
                    })
                }
                const response = {
                    data: result.rows
                };
                resolve(response)
            })
            .catch(error => {
                reject({
                    status: 500,
                    error
                })
            });
    });
}

const deleteTransactionFromServer = (id_transaction) => {
    return new Promise((resolve, reject) => {
        // parameterized query
        const sqlQuery = "DELETE FROM transactions WHERE id_transaction = $1 RETURNING *";
        db.query(sqlQuery, [id_transaction])
            .then(result => {
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "Transaction Not Found"
                    })
                }
                const response = {
                    data: result.rows[0]
                };
                resolve(response)
            })
            .catch(error => {
                reject({
                    status: 500,
                    error
                })
            });
    });
};

const createNewTransaction = (body) => {
    return new Promise((resolve, reject) => {
        const { id_user, id_product, item_total, transaction_date, address_details, id_product_size, range, id_payment_method, id_delivery_method } = body
        const sqlQuery = "INSERT INTO transactions(id_user, id_product, item_total, transaction_date, address_details, id_product_size, range,id_payment_method, id_delivery_method) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
        db.query(sqlQuery, [id_user, id_product, item_total, transaction_date, address_details, id_product_size, range, id_payment_method, id_delivery_method])
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
    getTransactionFromServer,
    getSingleTransactionsFromServer,
    deleteTransactionFromServer
}