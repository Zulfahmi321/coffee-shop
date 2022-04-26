const promosModel = require("../models/promos");
const { getPromosFromServer, getSinglePromosFromServer, updatePromosFromServer, findPromos, deletePromosFromServer, createNewPromos } = promosModel;

const getAllPromos = (_, res) => {
    getPromosFromServer()
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

const getPromosById = (req, res) => {
    const id = req.params.id;
    getSinglePromosFromServer(id)
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
        })
};

const findPromosByQuery = (req, res) => {
    findPromos(req.query)
        .then(({ data, total }) => {
            res.status(200).json({
                err: null,
                data,
                total
            })
        })
        .catch(({ status, err }) => {
            res.status(status).json({
                data: [],
                err
            });
        })
};

const postNewPromos = (req, res) => {
    createNewPromos(req.body)
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

const deleteProductById = (req, res) => {
    const id = req.params.id;
    deletePromosFromServer(id)
        .then(({ data }) => {
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

const updatePromos = (req, res) => {
    const id = req.params.id;
    updatePromosFromServer(id, req.body)
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
                err
            })
        });
};


module.exports = {
    getAllPromos,
    deleteProductById,
    getPromosById,
    findPromosByQuery,
    postNewPromos,
    updatePromos
}
