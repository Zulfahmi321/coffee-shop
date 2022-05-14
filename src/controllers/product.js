const productModel = require("../models/product");
const { getProductsFromServer, getSingleProductFromServer, createNewProduct, deleteProductFromServer, updateProductFromServer, getBestSellingProducts } = productModel;

const getAllProducts = (req, res) => {
    getProductsFromServer(req.query)
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

const getBestProducts = (_, res) => {
    getBestSellingProducts()
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

const getProductById = (req, res) => {
    const id = req.params.id;
    getSingleProductFromServer(id)
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


const postNewProduct = (req, res) => {
    createNewProduct(req.body)
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
    deleteProductFromServer(id)
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

const updateProduct = (req, res) => {
    const id = req.params.id;
    updateProductFromServer(id, req.body)
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
            });
        });
};

module.exports = {
    getAllProducts,
    getProductById,
    postNewProduct,
    deleteProductById,
    updateProduct,
    getBestProducts
};