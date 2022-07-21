const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generator = require('otp-generator')
const { register, getPassByUserEmail, userActivation } = require("../models/auth");
const { successResponse, errorResponse } = require("../helper/response");
const { client } = require("../config/redis");
const { sendConfirmationEmail, sendPasswordConfirmation } = require("../config/nodemailer");

const auth = {};

auth.register = (req, res) => {
    const { body } = req;
    const { email, password, mobile_number } = body;
    bcrypt
        .hash(password, 10)
        .then(async (hashedPassword) => {
            const payload = {
                email
            }
            const jwtOptions = {
                issuer: process.env.JWT_ISSUER,
                expiresIn: "900s",
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, jwtOptions);
            await sendConfirmationEmail(email, email, token)
            register(email, hashedPassword, mobile_number)
                .then(() => {
                    successResponse(res, 201, { msg: "Register Success, Check Your Email" }, null);
                })
                .catch((error) => {
                    const { status, err } = error;
                    errorResponse(res, status, err);
                });
        })
        .catch((err) => {
            console.log(err);
            errorResponse(res, 500, err);
        });
};

auth.activation = async (req, res) => {
    try {
        const { email } = req.userEmail
        await userActivation(email)
        successResponse(res, 200, { msg: 'Your Account Has Been Active, Please Login' })
        // const html = `<h2>Juncoffee Email Confirmation</h2>
        // <h3>Hi,</h3>
        // <h3>Thank you for register. Please confirm your email by clicking on the following link:</h3>
        // </div>`
        // res.send(html)
    }
    catch (error) {
        const { status, err } = error;
        errorResponse(res, status, err);
    }
};

auth.forgotPassword = async (req, res) => {
    try {
        const { email } = req.params;
        const confirmCode = generator.generate(6, { upperCaseAlphabets: false, specialChars: false })
        console.log(confirmCode);

        await sendPasswordConfirmation(email, email, confirmCode);
        await client.set(`forgotpass${email}`, confirmCode);
        res.status(200).json({
            message: "Please check your email for password confirmation",
        });
    } catch (error) {
        const { message, status } = error;
        res.status(status ? status : 500).json({
            error: message,
        });
    }
};

auth.signIn = async (req, res) => {
    try {
        // mendapatkan body email dan password
        const { body } = req;
        const { email, password } = body;

        // cek kecocokan email dan password
        const data = await getPassByUserEmail(email);
        if (data.status !== 'active') {
            return errorResponse(res, 403, { msg: "Account is not activation, confirm your email" });
        }
        const match = await bcrypt.compare(password, data.password);
        if (!match)
            return errorResponse(res, 400, { msg: "Password or Email is wrong" });
        //generate jwt
        const payload = {
            id: data.id,
            email,
            roles: data.roles
        };
        const jwtOptions = {
            issuer: process.env.JWT_ISSUER,
            expiresIn: "30000s",
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, jwtOptions);
        await client.set(`jwt${data.id}`, token)
        //return
        successResponse(res, 200, { email, token, msg: "Login Success" }, null);
    }
    catch (error) {
        const { status, err } = error;
        errorResponse(res, status, err);
    }
};

auth.signOut = async (req, res) => {
    try {
        await client.del(`jwt${req.userPayload.id}`)
        successResponse(res, 200, { msg: 'Success Logout' })
    }
    catch (error) {
        console.log(error);
        const { status = 500, err } = error;
        errorResponse(res, status, err);
    }
};

module.exports = auth;
