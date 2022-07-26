const express = require("express");

const Router = express.Router();


//import kedalam main router
const userRouter = require("./user");
const productRouter = require("./product");
const transactionRouter = require("./transaction");
const promosRoutes = require("./promos");
const authRouter = require("./auth");
const notifRouter = require("./notification")

Router.get("/", (_, res) => {
    res.json({
        message: "Welcome to Project Coffee Shop",
    });
});
// menjalankan Router berdasarkan router yang di import
Router.use("/user", userRouter);
Router.use("/product", productRouter);
Router.use("/transaction", transactionRouter);
Router.use("/promos", promosRoutes);
Router.use("/auth", authRouter);
Router.use("/notif", notifRouter);

module.exports = Router;