const db = require("../config/db");


const getProductsFromServer = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM products")
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

const getSingleProductFromServer = () => {
    return new Promise((resolve, reject) => {
        const sqlQuery = "SELECT * FROM Products WHERE id_product = $1";
        db.query(sqlQuery, [id_product])
            .then(result => {
                // handler jika user berdasarkan id tidak ada/ditemukan
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "Product Not Found"
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
};

const findProduct = (query) => {
    return new Promise((resolve, reject) => {
        // asumsikan query berisikan username, order, sort
        const { product_name, order, sort } = query;
        let sqlQuery = "SELECT * FROM Product WHERE LOWER(product_name) LIKE LOWER('%' || $1 || '%')";
        if (order) {
            sqlQuery += " order by " + sort + " " + order;
        }
        db.query(sqlQuery, [product_name])
            .then(result => {
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "Product Not Found"
                    });
                }
                const response = {
                    total: result.rowCount,
                    data: result.rows
                }
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

const createNewProduct = (body) => {
    return new Promise((resolve, reject) => {
        const { product_name, product_price, product_photo, product_description, delivery_info, stock_product } = body;
        const sqlQuery = "INSERT INTO products(product_name, product_price, product_photo, product_description, delivery_info, stock_product) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
        db.query(sqlQuery, [product_name, product_price, product_photo, product_description, delivery_info, stock_product])
            .then(({ rows }) => {
                const response = {
                    data: rows[0],
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

const deleteProductFromServer = (id_user) => {
    return new Promise((resolve, reject) => {
        // parameterized query
        const sqlQuery = "DELETE FROM products WHERE id_user = $1 RETURNING *";
        db.query(sqlQuery, [id_user])
            .then(result => {
                // handler jika user berdasarkan id tidak ada/ditemukan
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "Product Not Found"
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

const updateProductFromServer = (id_product, body) => {
    return new Promise((resolve, reject) => {
        const { product_name, product_price, product_photo, product_description, delivery_info, stock_product } = body;
        const sqlQuery =
            "UPDATE products SET product_name= COALESCE(NULLIF($1, ''), product_name), product_price= COALESCE(NULLIF($2, '')::money, product_price), product_photo= COALESCE(NULLIF($3, ''), product_photo), product_description= COALESCE(NULLIF($4, ''), product_description), delivery_info= COALESCE(NULLIF($5, ''), delivery_info), stock_product= COALESCE(NULLIF($6, '')::numeric, stock_product) WHERE id_product=$7 RETURNING *";
        db.query(sqlQuery, [product_name, product_price, product_photo, product_description, delivery_info, stock_product, id_product])
            .then((result) => {
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "Product Not Found"
                    });
                };
                const response = {
                    data: result.rows[0]
                };
                resolve(response)
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
    getProductsFromServer,
    getSingleProductFromServer,
    findProduct,
    createNewProduct,
    deleteProductFromServer,
    updateProductFromServer
}