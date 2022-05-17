const express = require("express");
const Router = express.Router();

const transactionController = require("../controllers/transaction");
// const { checkToken, adminRole, userRole } = require("../middlewares/auth");
const { bodyPostTransaction } = require("../middlewares/fieldsValidator");

Router.get("/all", transactionController.getAllTransaction);

Router.get("/:id", transactionController.getTransactionById);

Router.post("/", bodyPostTransaction, transactionController.postNewTransaction);

Router.get("/", transactionController.findTransactionUserById);

module.exports = Router;