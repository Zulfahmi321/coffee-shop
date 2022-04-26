const express = require("express");
const Router = express.Router();

//import controllernya
const productController = require("../controllers/product");
// const validate = require("../middlewares/validate");

Router.get("/all", productController.getAllProducts);

Router.get("/:id", productController.getProductById);

Router.get("/", productController.findProductByQuery);

Router.post("/", productController.postNewProduct);

Router.put("/:id", productController.updateProduct);

Router.delete("/:id", productController.deleteProductById);

module.exports = Router;