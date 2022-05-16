const db = require("../config/db");
const { v4: uuidV4 } = require("uuid");

const getProductsFromServer = (query) => {
    return new Promise((resolve, reject) => {
        const { name, category_name, sort = "category_id", order = "asc", page = 1, limit = 3 } = query;
        // page = 1 2 3 4
        // offset = 0 3 6 9
        // rumusan offset = (page - 1) * limit
        const offset = (parseInt(page) - 1) * Number(limit);
        let parameterized = [];
        let totalParam = [];
        let totalQuery = "SELECT COUNT(products.id) AS total_products FROM products JOIN categorys ON products.category_id = categorys.id";

        let sqlQuery = "SELECT products.id, products.name, products.price, products.photo, products.description, products.delivery_info, products.stock, categorys.name AS category_name, products.create_at FROM products JOIN categorys ON products.category_id = categorys.id";

        if (!name && !category_name) {
            sqlQuery += " ORDER BY " + sort + " " + order + " LIMIT $1 OFFSET $2";
            parameterized.push(Number(limit), offset);
        }
        if (name && !category_name) {
            sqlQuery += " WHERE LOWER(products.name) LIKE LOWER('%' || $1 || '%')  ORDER BY " + sort + " " + order + " LIMIT $2 OFFSET $3";
            totalQuery += " WHERE LOWER(products.name) LIKE LOWER('%' || $1 || '%')";
            parameterized.push(name, Number(limit), offset);
            totalParam.push(name);
        }
        if (!name && category_name) {
            sqlQuery += " WHERE LOWER(categorys.name) = $1 ORDER BY " + sort + " " + order + " LIMIT $2 OFFSET $3";
            totalQuery += " WHERE LOWER(categorys.name) = $1";
            parameterized.push(category_name, Number(limit), offset);
            totalParam.push(category_name);
        }
        if (name && category_name) {
            sqlQuery += " WHERE LOWER(products.name) LIKE LOWER('%' || $1 || '%') AND LOWER(categorys.name) = $2 ORDER BY " + sort + " " + order + " LIMIT $3 OFFSET $4";
            totalQuery += " WHERE LOWER(products.name) LIKE LOWER('%' || $1 || '%') AND LOWER(categorys.name) = $2";
            parameterized.push(name, category_name), Number(limit), offset;
            totalParam.push(name, category_name);
        }
        db.query(sqlQuery, parameterized)
            .then(result => {
                if (result.rows.length === 0) {
                    return reject({ status: 404, err: "Products Not Found" });
                }
                const response = {
                    total: result.rowCount,
                    data: result.rows,
                };
                db.query(totalQuery, totalParam)
                    .then((result) => {
                        response.totalData = parseInt(result.rows[0]["total_products"]);
                        response.totalPage = Math.ceil(response.totalData / parseInt(limit));
                        resolve(response);
                    })
                    .catch(err => {
                        reject({
                            status: 500,
                            err
                        });
                    });
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
        let sqlQuery = "SELECT name, price, photo, description, delivery_info, stock, SUM(quantity) AS total_purchases FROM transactions JOIN products ON transactions.product_id = products.id GROUP BY products.id ORDER BY total_purchases DESC";
        db.query(sqlQuery)
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

const getSingleProductFromServer = (id) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = "SELECT * FROM products WHERE id = $1";
        db.query(sqlQuery, [id])
            .then(result => {
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "Product Not Found"
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

const createNewProduct = (file, body) => {
    return new Promise((resolve, reject) => {
        const photo = file.path.replace("public", "").replace(/\\/g, "/");
        const { name, price, description, delivery_info, stock, category_id } = body;
        const sqlQuery = "INSERT INTO products(id, name, price, photo, description, delivery_info, stock, category_id, create_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
        const create_at = new Date(Date.now());
        const idProduct = uuidV4();
        db.query(sqlQuery, [idProduct, name, price, photo, description, delivery_info, stock, category_id, create_at])
            .then(({ rows }) => {
                const response = {
                    data: rows[0],
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

const deleteProductFromServer = (id) => {
    return new Promise((resolve, reject) => {
        // parameterized query
        const sqlQuery = "DELETE FROM products WHERE id = $1 RETURNING *";
        db.query(sqlQuery, [id])
            .then(result => {
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "Product Not Found"
                    });
                }
                const response = {
                    data: result.rows[0]
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

const updateProductFromServer = (photo, idProduct, body) => {
    return new Promise((resolve, reject) => {
        const { name, price, description, delivery_info, stock, category_id, create_at } = body;
        const sqlQuery =
            "UPDATE products SET name= COALESCE(NULLIF($1, ''), name), price= COALESCE(NULLIF($2, '')::money, price), photo= COALESCE($3, photo), description= COALESCE(NULLIF($4, ''), description), delivery_info= COALESCE(NULLIF($5, ''),delivery_info), stock= COALESCE(NULLIF($6, '')::numeric, stock),category_id= COALESCE(NULLIF($7, '')::int8, category_id),create_at= COALESCE(NULLIF($8, '')::date, create_at) WHERE id=$9 RETURNING *";
        db.query(sqlQuery, [name, price, photo, description, delivery_info, stock, category_id, create_at, idProduct])
            .then((result) => {
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "Product Not Found"
                    });
                }
                const response = {
                    data: result.rows[0]
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
    getProductsFromServer,
    getSingleProductFromServer,
    createNewProduct,
    deleteProductFromServer,
    updateProductFromServer,
    getBestSellingProducts
};