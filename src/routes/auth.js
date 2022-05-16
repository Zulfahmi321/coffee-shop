const express = require("express");
const Router = express.Router();

const authController = require("../controllers/auth");
const { checkDuplicate } = require("../middlewares/auth");
const { bodyPostRegisterUser, bodyPostSignInUser } = require("../middlewares/fieldsValidator");
//register
Router.post("/new", bodyPostRegisterUser, checkDuplicate, authController.register);
//sign in
Router.post("/", bodyPostSignInUser, authController.signIn);
//logout
Router.delete("/", (_, res) => {
    res.json({
        msg: "Berhasil Logout",
    });
});

module.exports = Router;