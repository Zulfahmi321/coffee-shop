const express = require("express");
const Router = express.Router();

//import controllernya
const productController = require("../controllers/product");
const { bodyPostProduct } = require("../middlewares/fieldsValidator");
const { checkToken } = require("../middlewares/auth");

Router.get("/all", productController.getAllProducts);

Router.get("/best", productController.getBestProducts);

Router.get("/:id", productController.getProductById);

Router.post("/", checkToken, bodyPostProduct, productController.postNewProduct);

Router.patch("/:id", productController.updateProduct);

Router.delete("/:id", productController.deleteProductById);

module.exports = Router;