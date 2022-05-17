const express = require("express");
const Router = express.Router();

//import controllernya
const productController = require("../controllers/product");
const { bodyPostProduct } = require("../middlewares/fieldsValidator");
const { checkToken, adminRole, userRole } = require("../middlewares/auth");
const upImageFile = require("../middlewares/upload");

Router.get("/all", productController.getAllProducts);

Router.get("/best", productController.getBestProducts);

Router.get("/:id", userRole, checkToken, productController.getProductById);

Router.post("/", adminRole, checkToken, upImageFile, bodyPostProduct, productController.postNewProduct);

Router.patch("/:id", adminRole, checkToken, upImageFile, productController.updateProduct);

Router.delete("/:id", adminRole, productController.deleteProductById);

module.exports = Router;