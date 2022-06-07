const express = require("express");
const Router = express.Router();

//import controllernya
const productController = require("../controllers/product");
const { bodyPostProduct } = require("../middlewares/fieldsValidator");
const { checkToken, adminRole } = require("../middlewares/auth");
const upImageFile = require("../middlewares/upload");

Router.get("/", productController.getAllProducts);

Router.get("/best", productController.getBestProducts);

Router.get("/:id", productController.getProductById);

Router.post("/", checkToken, adminRole, upImageFile, bodyPostProduct, productController.postNewProduct);

Router.patch("/:id", checkToken, adminRole, upImageFile, productController.updateProduct);

Router.delete("/:id", checkToken, adminRole, productController.deleteProductById);

module.exports = Router;