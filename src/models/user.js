const db = require("../config/db");

const getUsersFromServer = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT id username, first_name, last_name,email, mobile_number, photo, to_char(date_of_birth, 'yyyy-MM-dd') as date_of_birth,gender,address FROM users")
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

const getSingleUserFromServer = (id_user) => {
    return new Promise((resolve, reject) => {
        // parameterized query
        const sqlQuery = "SELECT * FROM users WHERE id = $1";
        db.query(sqlQuery, [id_user])
            .then(result => {
                // handler jika user berdasarkan id tidak ada/ditemukan
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "User Not Found"
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

const findUser = (query) => {
    return new Promise((resolve, reject) => {
        // asumsikan query berisikan username, order, sort
        const { username, order, sort } = query;
        let sqlQuery = "SELECT * FROM users WHERE LOWER(username) LIKE LOWER('%' || $1 || '%')";
        if (order) {
            sqlQuery += " order by " + sort + " " + order;
        }
        db.query(sqlQuery, [username])
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

const deleteUserFromServer = (id_user) => {
    return new Promise((resolve, reject) => {
        // parameterized query
        const sqlQuery = "DELETE FROM users WHERE id = $1 RETURNING *";
        db.query(sqlQuery, [id_user])
            .then(result => {
                // handler jika user berdasarkan id tidak ada/ditemukan
                if (result.rows.length === 0) {
                    return reject({
                        status: 404,
                        err: "User Not Found"
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

const updateUserFromServer = (id, photo, body) => {
    return new Promise((resolve, reject) => {
        const { username, first_name, last_name, email, password, mobile_number, date_of_birth, gender, address } = body;
        //Fungsi MySQL COALESCE adalah mengembalikan ekspresi non-null pertama dalam daftar. Yang berguna untuk memeriksa suatu kolom ada datanya atau tidak.
        const sqlQuery =
            "UPDATE users SET username= COALESCE(NULLIF($1, ''), username), first_name= COALESCE(NULLIF($2, ''), first_name), last_name= COALESCE(NULLIF($3, ''), last_name), email= COALESCE(NULLIF($4, ''), email), password= COALESCE(NULLIF($5, ''), password), mobile_number= COALESCE(NULLIF($6, ''), mobile_number), photo= COALESCE($7, photo), date_of_birth= COALESCE(NULLIF($8, '')::date, date_of_birth), gender= COALESCE(NULLIF($9, ''), gender), address= COALESCE(NULLIF($10, ''), address) WHERE id=$11 RETURNING username, first_name, last_name,email, mobile_number, photo, date_of_birth,gender,address";
        db.query(sqlQuery, [username, first_name, last_name, email, password, mobile_number, photo, date_of_birth, gender, address, id])
            .then((result) => {
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
    getUsersFromServer,
    getSingleUserFromServer,
    findUser,
    deleteUserFromServer,
    updateUserFromServer

};