const express = require("express")

const Router = express.Router();

//import kedalam main router
const userRouter = require("./user");
const productRouter = require("./product");
const transactionRouter = require("./transaction");

// menjalankan Router berdasarkan router yang di import
Router.use("/user", userRouter);
Router.use("/product", productRouter);
Router.use("/transaction", transactionRouter);

module.exports = Router;