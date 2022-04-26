const validate = {};

validate.queryFind = (req, res, next) => {
    // cek apakah query sesuai dengan yang diinginkan
    const { query } = req;
    const validQuery = Object.keys(query).filter((key) => key === "username" || key === "sort" || key === "order");
    // query harus ada 3
    if (validQuery.length < 3) {
        return res.status(400).json({
            err: "Body harus diisikan secara lengkap"
        });
    }
    // mau cek tipe data
    // for (const key of validQuery) {
    //     if (typeof query[key] !== "string") {
    //         return res.status(400).json({
    //             err: "Invalid Query",
    //         });
    //     }
    // }
    next()
};

// validasi userdata 
validate.userData = (req, res, next) => {
    // cek apakah body sesuai dengan yang diinginkan
    const { body } = req;
    const validBody = Object.keys(body).filter((key) => key === "username" || key === "first_name" || key === "last_name" || key === "email" || key === "password" || key === "mobile_number" || key === "photo" || key === "date_of_birth" || key === "gender" || key === "address");
    // body harus ada 10
    if (validBody.length < 10) {
        return res.status(400).json({
            err: "Body harus diisikan secara lengkap"
        });
    }
    next()
};

module.exports = validate;