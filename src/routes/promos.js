const express = require("express");
const Router = express.Router();

const promosController = require("../controllers/promos");
const validate = require("../middlewares/validate");

Router.get("/all", promosController.getAllPromos);

Router.get("/:id", promosController.getPromosById);

Router.get("/", promosController.findPromosByQuery);

Router.post("/", validate.promosData, promosController.postNewPromos);

Router.put("/:id", promosController.updatePromos);

Router.delete("/:id", promosController.deleteProductById);


module.exports = Router;