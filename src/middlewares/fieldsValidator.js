const fieldsValidator = {};

fieldsValidator.bodyPostRegisterUser = (req, res, next) => {
    const { email, password, mobile_number } = req.body;
    if (!email) {
        return res.status(400).json({
            err: "Input email!"
        });
    }
    if (!password) {
        return res.status(400).json({
            err: "Input password!"
        });
    }
    if (!mobile_number) {
        return res.status(400).json({
            err: "Input mobile_number!"
        });
    }
    next();
};

fieldsValidator.bodyPostProduct = (req, res, next) => {
    const { name, price, description, delivery_info, stock, category_id } = req.body;
    const { file } = req;
    if (!name) {
        return res.status(400).json({
            err: "Input name!"
        });
    }
    if (!price) {
        return res.status(400).json({
            err: "Input price!"
        });
    }
    if (!description) {
        return res.status(400).json({
            err: "Input description!"
        });
    }
    if (!delivery_info) {
        return res.status(400).json({
            err: "Input delivery info!"
        });
    }
    if (!stock) {
        return res.status(400).json({
            err: "Input stock!"
        });
    }
    if (!category_id) {
        return res.status(400).json({
            err: "Input category!"
        });
    }
    if (!file) {
        return res.status(400).json({
            err: "Input photo!"
        });
    }
    next();
};

fieldsValidator.bodyPostPromo = (req, res, next) => {
    const { normal_price, code, discount, description } = req.body;
    if (!normal_price) {
        return res.status(400).json({
            err: "Input Normal price!"
        });
    }
    if (!code) {
        return res.status(400).json({
            err: "Input promo code!"
        });
    }
    if (!discount) {
        return res.status(400).json({
            err: "Input discount!"
        });
    }
    if (!description) {
        return res.status(400).json({
            err: "Input description promo!"
        });
    }
    next();
};

fieldsValidator.bodyPostTransaction = (req, res, next) => {
    const { product_id, quantity, size_id, payment_id, delivery_id} = req.body;

    if (!product_id) {
        return res.status(400).json({
            err: "Input id product!"
        });
    }
    if (!quantity) {
        return res.status(400).json({
            err: "Input quantity!"
        });
    }
    if (!size_id) {
        return res.status(400).json({
            err: "Input size id!"
        });
    }
    if (!payment_id) {
        return res.status(400).json({
            err: "Input payment id!"
        });
    }
    if (!delivery_id) {
        return res.status(400).json({
            err: "Input delivery id!"
        });
    }

    next();
};

fieldsValidator.bodyPostSignInUser = (req, res, next) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({
            err: "Input email!"
        });
    }
    if (!password) {
        return res.status(400).json({
            err: "Input password!"
        });
    }
    next();
};

module.exports = fieldsValidator;