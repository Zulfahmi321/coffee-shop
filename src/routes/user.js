const express = require("express");
const Router = express.Router();
// const db = require("../config/db");
// const { successResponse, errorResponse } = require("../helper/response");

//import controllernya
const userController = require("../controllers/user");
const { checkToken, adminRole } = require("../middlewares/auth");
const upImagefile = require("../middlewares/upload");

// mendapatkan semua data user
Router.get("/all", checkToken, adminRole, userController.getAllUsers);

// mendapatkan satu data user berdasarkan id
Router.get("/", checkToken, userController.getUserById);

// melakukan pencarian data user
Router.get("/userid", checkToken, adminRole, userController.findUserByQuery);

// menambahkan data user
// Router.post("/", userController.postNewUser);

// update data user
Router.patch("/", checkToken, upImagefile, userController.updateUser);

// delete data user berdasarkan id
Router.delete("/:id", checkToken, adminRole, userController.deleteUserById);

Router.patch("/reset", userController.resetUserPassword);

Router.patch("/password", checkToken, userController.patchUserPassword);


module.exports = Router;