const db = require("../config/db");

const getUsersFromServer = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT username, first_name, last_name,email, mobile_number, photo, date_of_birth,gender,address FROM users")
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

const createNewUser = (body) => {
    return new Promise((resolve, reject) => {
        const { username, first_name, last_name, email, password, mobile_number, photo, date_of_birth, gender, address } = body;
        const sqlQuery = "INSERT INTO users(username, first_name, last_name, email, password, mobile_number, photo, date_of_birth, gender, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING username, first_name, last_name,email, mobile_number, photo, date_of_birth,gender,address";
        db.query(sqlQuery, [username, first_name, last_name, email, password, mobile_number, photo, date_of_birth, gender, address])
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

// const updateUserFromServer = (id_user, body) => {
//     return new Promise((resolve, reject) => {
//         const { username, first_name, last_name, email, password, mobile_number, photo, date_of_birth, gender, address } = body;
//         //Fungsi MySQL COALESCE adalah mengembalikan ekspresi non-null pertama dalam daftar. Yang berguna untuk memeriksa suatu kolom ada datanya atau tidak.
//         const sqlQuery =
//             "UPDATE users SET username= COALESCE($1, username), first_name= COALESCE($2, first_name), last_name= COALESCE($3, last_name), email= COALESCE($4, email), password= COALESCE($5, password), mobile_number= COALESCE($6, mobile_number), photo= COALESCE($7, photo), date_of_birth= COALESCE($8::date, date_of_birth), gender= COALESCE($9, gender), address= COALESCE($1), address) WHERE id=$11 RETURNING username, first_name, last_name,email, mobile_number, photo, date_of_birth,gender,address";
//         db.query(sqlQuery, [username, first_name, last_name, email, password, mobile_number, photo, date_of_birth, gender, address, id_user])
//             .then((result) => {
//                 if (result.rows.length === 0) {
//                     return reject({
//                         status: 404,
//                         err: "User Not Found"
//                     });
//                 }
//                 const response = {
//                     data: result.rows[0]
//                 };
//                 resolve(response);
//             })
//             .catch((error) => {
//                 reject({
//                     status: 500,
//                     err: error
//                 });
//             });
//     });
// };

const updateUserFromServer = (id, file, body) => {
    return new Promise((resolve, reject) => {
        // const id = req.userPayload.id;
        // const { file = null } = req;
        const photo = file.path.replace("public", "").replace(/\\/g, "/");
        const { username, first_name, last_name, email, password, mobile_number, date_of_birth, gender, address } = body;
        //Fungsi MySQL COALESCE adalah mengembalikan ekspresi non-null pertama dalam daftar. Yang berguna untuk memeriksa suatu kolom ada datanya atau tidak.
        const sqlQuery =
            "UPDATE users SET username= COALESCE($1, username), first_name= COALESCE($2, first_name), last_name= COALESCE($3, last_name), email= COALESCE($4, email), password= COALESCE($5, password), mobile_number= COALESCE($6, mobile_number), photo= COALESCE($7, photo), date_of_birth= COALESCE($8::date, date_of_birth), gender= COALESCE($9, gender), address= COALESCE($10, address) WHERE id=$11 RETURNING username, first_name, last_name,email, mobile_number, photo, date_of_birth,gender,address";
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
    createNewUser,
    deleteUserFromServer,
    updateUserFromServer

};