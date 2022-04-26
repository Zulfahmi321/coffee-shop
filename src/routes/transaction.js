const express = require("express");
const Router = express.Router();

const transactionController = require("../controllers/transaction");

Router.get("/all", transactionController.getAllTransaction);

module.exports = Router;