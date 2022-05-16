const productModel = require("../models/product");
const { getProductsFromServer, getSingleProductFromServer, createNewProduct, deleteProductFromServer, updateProductFromServer, getBestSellingProducts } = productModel;

const { successResponse, errorResponse } = require("../helper/response");

const getAllProducts = (req, res) => {
    getProductsFromServer(req.query)
        .then((result) => {
            const { totalData, totalPage, data } = result;
            const { name, category_name, sort, order, page = 1, limit } = req.query;
            let nextPage = "/product/all?";
            let prevPage = "/product/all?";
            if (name) {
                nextPage += `name=${name}&`;
                prevPage += `name=${name}&`;
            }
            if (category_name) {
                nextPage += `category_name=${category_name}&`;
                prevPage += `category_name=${category_name}&`;
            }
            if (sort) {
                nextPage += `sort=${sort}&`;
                prevPage += `sort=${sort}&`;
            }
            if (order) {
                nextPage += `order=${order}&`;
                prevPage += `order=${order}&`;
            }
            if (limit) {
                nextPage += `limit=${limit}&`;
                prevPage += `limit=${limit}&`;
            }
            nextPage += `page=${Number(page) + 1}`;
            prevPage += `page=${Number(page) - 1}`;
            const meta = {
                totalData,
                totalPage,
                currentPage: Number(page),
                nextPage: Number(page) === totalPage ? null : nextPage,
                prevPage: Number(page) === 1 ? null : prevPage
            };
            successResponse(res, 200, data, meta);
        })
        .catch((error) => {
            const { err, status } = error;
            errorResponse(res, status, err);
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
    const { file = null } = req;
    createNewProduct(file, req.body)
        .then((result) => {
            successResponse(res, 200, result.data, null);
        })
        .catch(error => {
            errorResponse(res, 500, error);
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
    const idProduct = req.params.id;
    const { file } = req;
    let photo = "";

    if (file !== undefined) {
        photo = file.path.replace("public", "").replace(/\\/g, "/");
    }
    updateProductFromServer(photo, idProduct, req.body)
        .then((result) => {
            successResponse(res, 200, result.data, null);
        })
        .catch((error) => {
            errorResponse(res, 500, error);
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