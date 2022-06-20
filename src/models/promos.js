const db = require("../config/db");
const { v4: uuidV4 } = require("uuid");


const getPromosFromServer = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM promos")
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

const getSinglePromosFromServer = (id_promo) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = "SELECT * FROM promos WHERE id= $1";
        db.query(sqlQuery, [id_promo])
            .then(result => {
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "Promos Not Found"
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

const findPromos = (query) => {
    return new Promise((resolve, reject) => {
        // asumsikan query berisikan username, order, sort
        const { code, order, sort } = query;
        let sqlQuery = "SELECT * FROM promos WHERE LOWER(code) LIKE LOWER('%' || $1 || '%')";
        if (order) {
            sqlQuery += " order by " + sort + " " + order;
        }
        db.query(sqlQuery, [code])
            .then(result => {
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "Promo Not Found"
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

const createNewPromos = (body) => {
    return new Promise((resolve, reject) => {
        const { code, discount, description, expired_start, expired_end, normal_price } = body;
        const sqlQuery = "INSERT INTO promos(id, code, discount, expired_start, expired_end, description, normal_price) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *";
        // const expired_start = new Date(Date.now());
        // const expired_end = new Date();
        // expired_end.setDate(expired_end.getDate() + 6);
        const id = uuidV4();
        db.query(sqlQuery, [id, code, discount, expired_start, expired_end, description, normal_price])
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

const deletePromosFromServer = (id_promo) => {
    return new Promise((resolve, reject) => {
        // parameterized query
        const sqlQuery = "DELETE FROM promos WHERE id = $1 RETURNING *";
        db.query(sqlQuery, [id_promo])
            .then(result => {
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "Promos Not Found"
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

const updatePromosFromServer = (id_promo, body) => {
    return new Promise((resolve, reject) => {
        const { normal_price, code, discount, expired_start, expired_end, description } = body;
        const sqlQuery =
            "UPDATE promos SET normal_price= COALESCE(NULLIF($1, '')::int4, normal_price), code= COALESCE(NULLIF($2, ''), code), discount= COALESCE(NULLIF($3, '')::numeric, discount), expired_start= COALESCE(NULLIF($4, '')::date, expired_start), expired_end= COALESCE(NULLIF($5, '')::date, expired_end), description= COALESCE(NULLIF($6, ''), description) WHERE id=$7 RETURNING *";
        db.query(sqlQuery, [normal_price, code, discount, expired_start, expired_end, description, id_promo])
            .then((result) => {
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "Promo Not Found"
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
    getPromosFromServer,
    getSinglePromosFromServer,
    findPromos,
    createNewPromos,
    deletePromosFromServer,
    updatePromosFromServer
};