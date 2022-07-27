const transactionModel = require("../models/transaction");
const { messaging } = require('../config/firebase');
const notif = messaging();
const { createNewTransaction, findTransactionUser, getTransactionFromServer, getSingleTransactionsFromServer } = transactionModel;

// const postNewTransaction = (req, res) => {
//     const id = req.userPayload.id;
//     createNewTransaction(req.body, id)
//         .then(({ data }) => {
//             res.status(200).json({
//                 err: null,
//                 data,
//             });
//         })
//         .catch(error => {
//             res.status(500).json({
//                 err: error,
//                 data: [],
//             });
//         });
// };

const postNewTransaction = async (req, res) => {
    try {
        // const { body } = req;
        const id = req.userPayload.id;
        const msg = {
            token: process.env.TOKEN_NOTIF,
            notification: {
                body: `User Created Transaction`,
                title: 'TRANSACTION',
            },
        };
        const result = await createNewTransaction(req.body, id);
        const { data } = result;
        await notif.send(msg);
        return res.status(200).json({
            err: null,
            data,
        });
    } catch (error) {
        // const { status, err } = error;
        res.status(500).json({
            err: error,
            data: [],
        });
    }
};

const getAllTransaction = (_, res) => {
    getTransactionFromServer()
        .then((result) => {
            const { total, data } = result;
            res.status(200).json({
                data,
                total,
                err: null
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

const findTransactionUserById = (req, res) => {
    const id = req.userPayload.id;
    findTransactionUser(id)
        .then(({ data, total }) => {
            res.status(200).json({
                err: null,
                data,
                total,
            });
        })
        .catch(({ status, err }) => {
            res.status(status).json({
                data: [],
                err,
            });
        });
};

const getTransactionById = (req, res) => {
    const id = req.params.id;
    getSingleTransactionsFromServer(id)
        .then((data) => {
            res.status(200).json({
                data,
                err: null
            });
        })
        .catch((error) => {
            const { err, status } = error;
            res.status(status).json({
                data: [],
                err
            });
        });
};

module.exports = {
    postNewTransaction,
    getAllTransaction,
    getTransactionById,
    findTransactionUserById
};