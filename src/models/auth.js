const db = require("../config/db");
const { v4: uuidV4 } = require("uuid");

const register = (username, first_name, last_name, email, hashedPassword, mobile_number, photo, date_of_birth, gender, address) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = "INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)";
        const id = uuidV4();
        const created_at = new Date(Date.now());
        const values = [id, username, first_name, last_name, email, hashedPassword, mobile_number, photo, date_of_birth, gender, address, created_at];
        db.query(sqlQuery, values)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject({ status: 500, err });
            });
    });
};

const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = "SELECT email FROM users WHERE email = $1";
        db.query(sqlQuery, [email])
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject({ status: 500, err });
            });
    });
};

const getPassByUserEmail = async (email) => {
    try {
        const sqlQuery = "SELECT id, password FROM users WHERE email = $1";
        const result = await db.query(sqlQuery, [email]);
        // cek apakah ada pass
        if (result.rowCount === 0)
            throw { status: 400, err: { msg: "Email is not registered" } };
        return result.rows[0];
    } catch (error) {
        const { status = 500, err } = error;
        throw { status, err };
    }
};

module.exports = {
    register,
    getUserByEmail,
    getPassByUserEmail
};