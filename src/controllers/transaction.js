const transactionModel = require("../models/transaction");
const { createNewTransaction, getTransactionFromServer } = transactionModel;

const postNewTransaction = (req, res) => {
    createNewTransaction(req.body)
        .then(({ data }) => {
            res.status(200).json({
                err: null,
                data,
            });
        })
        .catch(error => {
            res.status(500).json({
                err: error,
                data: [],
            });
        });
};

const getAllTransaction = (_, res) => {
    getTransactionFromServer()
        .then((result) => {
            const { total, data } = result;
            res.status(200).json({
                data,
                total,
                err: null,
            });
        })
        .catch((error) => {
            const { err, status } = error;
            res.status(status).json({
                data: [],
                err,
            });
        });
};

module.exports = {
    postNewTransaction,
    getAllTransaction
};