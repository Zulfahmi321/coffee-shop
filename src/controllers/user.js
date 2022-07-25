const userModel = require("../models/user");
const { getUsersFromServer, getSingleUserFromServer, findUser, updateUserPassword, deleteUserFromServer, updateUserFromServer } = userModel;

const { successResponse, errorResponse } = require("../helper/response");
const { client } = require("../config/redis");

const getAllUsers = (_, res) => {
    getUsersFromServer()
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


// didalam object request,
//  kita bisa mengirimkan input diantaranya melalui 
// 1. path params => req.params
// ex: localhost/user/:id/
// 2. query params => req.query
// ex: localhost/user?username=zul
// 3. body => req.body
// - form-urlencoded
// - raw json
const getUserById = (req, res) => {
    const id = req.userPayload.id;
    getSingleUserFromServer(id)
        .then((data) => {
            // const {data} = result
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

const findUserByQuery = (req, res) => {
    findUser(req.query)
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

const postNewUser = (req, res) => {
    createNewUser(req.body)
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

const deleteUserById = (req, res) => {
    const id = req.params.id;
    deleteUserFromServer(id)
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

const updateUser = (req, res) => {
    const { file = null } = req;
    let photo = null;
    if (file !== null) {
        // photo = file.path.replace("public", "").replace(/\\/g, "/");
        photo = file.path;
    }
    const id = req.userPayload.id;
    updateUserFromServer(id, photo, req.body)
        .then((result) => {
            successResponse(res, 200, result.data, { msg: "Update Success" }, null);
        })
        .catch((error) => {
            errorResponse(res, 500, error);
        });
};

const resetUserPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmCode } = req.body;
        const confirm = await client.get(`forgotpass${email}`);
        if (confirm !== confirmCode) {
            res.status(403).json({ error: "Invalid Confirmation Code !" });
            return;
        }
        const message = await updateUserPassword(newPassword, email);
        if (message) {
            await client.del(`forgotpass${email}`);
        }
        res.status(200).json({
            message,
        });
    } catch (error) {
        const { message, status } = error;
        res.status(status ? status : 500).json({
            error: message,
        });
    }
};

const patchUserPassword = async (req, res) => {
    try {
        const id = req.userPayload.id;
        const { newPassword } = req.body;
        const message = await updateUserPassword(newPassword, id);
        res.status(200).json({
            message,
        });
    } catch (error) {
        const { message, status } = error;
        res.status(status ? status : 500).json({
            error: message,
        });
    }
};


module.exports = {
    getAllUsers,
    getUserById,
    findUserByQuery,
    postNewUser,
    deleteUserById,
    updateUser,
    resetUserPassword,
    patchUserPassword
};