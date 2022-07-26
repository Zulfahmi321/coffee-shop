const express = require("express");
const Router = express.Router();

const promosController = require("../controllers/promos");
const { bodyPostPromo } = require("../middlewares/fieldsValidator");

Router.get("/all", promosController.getAllPromos);

Router.get("/:id", promosController.getPromosById);

Router.get("/", promosController.findPromosByQuery);

Router.post("/new", bodyPostPromo, promosController.postNewPromos);

Router.patch("/:id", promosController.updatePromos);

Router.delete("/:id", promosController.deleteProductById);


module.exports = Router;