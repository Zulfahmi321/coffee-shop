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
Router.delete("/:id", checkToken, adminRole, userController.deleteUserById);

Router.patch("/reset", userController.resetUserPassword);


module.exports = Router;