const express = require("express");
const Router = express.Router();

//import controllernya
const userController = require("../controllers/user");
const validate = require("../middlewares/validate");

// mendapatkan semua data user
Router.get("/all", userController.getAllUsers);

// mendapatkan satu data user berdasarkan id
Router.get("/:id", userController.getUserById);

// melakukan pencarian data user
Router.get("/", validate.queryFind, userController.findUserByQuery);

// menambahkan data user
Router.post("/", validate.userData, userController.postNewUser);

// update data user
Router.put("/:id", userController.updateUser);

// delete data user berdasarkan id
Router.delete("/:id", userController.deleteUserById);


module.exports = Router;