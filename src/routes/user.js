const express = require("express");
const Router = express.Router();
// const db = require("../config/db");
// const { successResponse, errorResponse } = require("../helper/response");

//import controllernya
const userController = require("../controllers/user");
const { checkToken } = require("../middlewares/auth");
const imageUpload = require("../middlewares/upload");

// mendapatkan semua data user
Router.get("/all", userController.getAllUsers);

// mendapatkan satu data user berdasarkan id
Router.get("/:id", userController.getUserById);

// melakukan pencarian data user
Router.get("/", userController.findUserByQuery);

// menambahkan data user
Router.post("/", userController.postNewUser);

// update data user
Router.patch("/", checkToken, imageUpload.single("photo"), userController.updateUser);
// Router.patch("/", checkToken, imageUpload.single("photo"), (req, res) => {
//     const id = req.userPayload.id;
//     const { file = null } = req;
//     const photo = file.path.replace("public", "").replace(/\\/g, "/");
//     db.query("UPDATE users SET photo = $1 WHERE id = $2 RETURNING photo", [
//         photo,
//         id
//     ])
//         .then((result) => {
//             successResponse(res, 200, result.rows[0], null);
//         })
//         .catch((err) => {
//             errorResponse(res, 500, err);
//         });
// });

// delete data user berdasarkan id
Router.delete("/:id", userController.deleteUserById);


module.exports = Router;