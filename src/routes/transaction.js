const express = require("express");
const Router = express.Router();

const transactionController = require("../controllers/transaction");
const { checkToken } = require("../middlewares/auth");
const { bodyPostTransaction } = require("../middlewares/fieldsValidator");

Router.get("/all", transactionController.getAllTransaction);

Router.get("/:id", transactionController.getTransactionById);

Router.get("/",checkToken, transactionController.findTransactionUserById);

Router.post("/",checkToken, bodyPostTransaction, transactionController.postNewTransaction);

module.exports = Router;