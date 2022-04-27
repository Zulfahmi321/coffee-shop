const express = require("express");
const Router = express.Router();

const transactionController = require("../controllers/transaction");

Router.get("/all", transactionController.getAllTransaction);

Router.get("/:id", transactionController.getTransactionById);

Router.post("/", transactionController.postNewTransaction);

Router.delete("/:id_transaction", transactionController.deleteTransactionById);

module.exports = Router;