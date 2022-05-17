const { errorResponse } = require("../helper/response");
const { getUserByEmail } = require("../models/auth");
const jwt = require("jsonwebtoken");

const checkDuplicate = (req, res, next) => {
    getUserByEmail(req.body.email)
        .then(result => {
            if (result.rowCount > 0)
                return errorResponse(res, 400, { msg: "Email is already in use" });
            next();
        })
        .catch(error => {
            const { status, err } = error;
            errorResponse(res, status, err);
        });
};

const checkToken = (req, res, next) => {
    const bearerToken = req.header("Authorization");
    // bearer token
    if (!bearerToken) {
        return errorResponse(res, 401, { msg: "Sign In needed" });
    }
    const token = bearerToken.split(" ")[1];
    // verifikasi token
    jwt.verify(token, process.env.JWT_SECRET, { issuer: process.env.JWT_ISSUER },
        (err, payload) => {
            // error handling
            if (err && err.name === "TokenExpiredError")
                return errorResponse(res, 401, {
                    msg: "You need to Sign In again"
                });
            req.userPayload = payload;
            next();
        });
};

const adminRole = (req, res, next) => {
    const { roles } = req.userPayload;
    if (roles !== "admin") {
        return errorResponse(res, 401, { msg: "You are not admin" });
    }
    next();
};

const userRole = (req, res, next) => {
    const { roles } = req.userPayload;
    if (roles !== "user") {
        return errorResponse(res, 401, { msg: "You are not user" });
    }
    next();
};

module.exports = {
    checkDuplicate,
    checkToken,
    adminRole,
    userRole
};