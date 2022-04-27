const db = require("../config/db");


const getProductsFromServer = (query) => {
    return new Promise((resolve, reject) => {
        const { category_name, order, sort, transaction } = query;
        let sqlQuery = "SELECT * FROM products";
        if (category_name) {
            sqlQuery += " JOIN category_products ON products.id_category = category_products.id_category WHERE category_products.category_name = '" + category_name + "'";
        }
        if (sort) {
            sqlQuery += " order by " + sort + " " + order
        }
        db.query(sqlQuery)
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

const getBestSellingProducts = () => {
    return new Promise((resolve, reject) => {
        let sqlQuery = "SELECT product_name, product_price, product_photo, product_description, delivery_info, stock_product, SUM(item_total) AS total_purchases FROM transactions JOIN products ON transactions.id_product = products.id_product GROUP BY products.id_product ORDER BY total_purchases DESC";
        db.query(sqlQuery)
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

const getSingleProductFromServer = (id_product) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = "SELECT * FROM products WHERE id_product = $1";
        db.query(sqlQuery, [id_product])
            .then(result => {
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
        let sqlQuery = "SELECT * FROM products WHERE LOWER(product_name) LIKE LOWER('%' || $1 || '%')";
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
        const { product_name, product_price, product_photo, product_description, delivery_info, stock_product, id_category, id_product_size } = body;
        const sqlQuery = "INSERT INTO products(product_name, product_price, product_photo, product_description, delivery_info, stock_product, id_category, id_product_size) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
        db.query(sqlQuery, [product_name, product_price, product_photo, product_description, delivery_info, stock_product, id_category, id_product_size])
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

const deleteProductFromServer = (id_product) => {
    return new Promise((resolve, reject) => {
        // parameterized query
        const sqlQuery = "DELETE FROM products WHERE id_product = $1 RETURNING *";
        db.query(sqlQuery, [id_product])
            .then(result => {
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
        const { product_name, product_price, product_photo, product_description, delivery_info, stock_product, id_category } = body;
        const sqlQuery =
            "UPDATE products SET product_name= COALESCE(NULLIF($1, ''), product_name), product_price= COALESCE(NULLIF($2, '')::money, product_price), product_photo= COALESCE(NULLIF($3, ''), product_photo), product_description= COALESCE(NULLIF($4, ''), product_description), delivery_info= COALESCE(NULLIF($5, ''), delivery_info), stock_product= COALESCE(NULLIF($6, '')::numeric, stock_product),id_category= COALESCE(NULLIF($7, '')::int8, id_category) WHERE id_product=$8 RETURNING *";
        db.query(sqlQuery, [product_name, product_price, product_photo, product_description, delivery_info, stock_product, id_category, id_product])
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
    updateProductFromServer,
    getBestSellingProducts
}