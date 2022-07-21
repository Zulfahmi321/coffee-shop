const express = require("express");
const Router = express.Router();

const authController = require("../controllers/auth");
const { checkDuplicate, checkToken, confirmEmail } = require("../middlewares/auth");
const { bodyPostRegisterUser, bodyPostSignInUser } = require("../middlewares/fieldsValidator");
//register
Router.post("/new", bodyPostRegisterUser, checkDuplicate, authController.register);
//sign in
Router.post("/", bodyPostSignInUser, authController.signIn);
//logout
Router.delete("/logout", checkToken, authController.signOut);

Router.get("/confirm/:token", confirmEmail, authController.activation);

Router.get("/forgotpassword/:email", authController.forgotPassword);

module.exports = Router;