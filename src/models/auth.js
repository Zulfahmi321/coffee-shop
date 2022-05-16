const db = require("../config/db");
const { v4: uuidV4 } = require("uuid");

const register = (email, hashedPassword, mobile_number) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = "INSERT INTO users(id, email, password, mobile_number, created_at) VALUES ($1,$2,$3,$4,$5)";
        const id = uuidV4();
        const created_at = new Date(Date.now());
        const values = [id, email, hashedPassword, mobile_number, created_at];
        db.query(sqlQuery, values)
            .then(() => {
                resolve();
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
    getPassByUserEmail,

};