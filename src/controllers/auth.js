const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { register, getPassByUserEmail } = require("../models/auth");
const { successResponse, errorResponse } = require("../helper/response");

const auth = {};

auth.register = (req, res) => {
    const { body } = req;
    const { username, first_name, last_name, email, password, mobile_number, photo, date_of_birth, gender, address } = body;
    bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
            register(username, first_name, last_name, email, hashedPassword, mobile_number, photo, date_of_birth, gender, address)
                .then(() => {
                    successResponse(res, 201, { msg: "Register Success" }, null);
                })
                .catch((error) => {
                    const { status, err } = error;
                    errorResponse(res, status, err);
                });
        })
        .catch((err) => {
            errorResponse(res, 500, err);
        });
};

auth.signIn = async (req, res) => {
    try {
        // mendapatkan body email dan password
        const { body } = req;
        const { email, password } = body;

        // cek kecocokan email dan password
        const data = await getPassByUserEmail(email);
        const result = await bcrypt.compare(password, data.password);
        if (!result)
            return errorResponse(res, 400, { msg: "Email or Password is wrong" });
        //generate jwt
        const payload = {
            id: data.id,
            email,
        };
        const jwtOptions = {
            issuer: process.env.JWT_ISSUER,
            expiresIn: "190s",
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, jwtOptions);
        //return
        successResponse(res, 200, { email, token }, null);
    }
    catch (error) {
        const { status, err } = error;
        errorResponse(res, status, err);
    }
};


module.exports = auth;
