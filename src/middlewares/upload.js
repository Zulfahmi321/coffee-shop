const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// set storage
// const imageStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "./public/images");
//     },
//     filename: (req, file, cb) => {
//         const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//         const filename = `${file.fieldname}-${suffix}${path.extname(file.originalname)}`;
//         cb(null, filename);
//     },
// });

// SET STORAGE CLOUDINARY
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: "coffee-shop"
    }
});

// menentukan ukuran
const limit = {
    fileSize: 2e6,
};

//  menentukan ektensi file upload
const imageOnlyFilter = (req, file, cb) => {
    const extName = path.extname(file.originalname);
    const allowedExt = /jpg|jpeg|png|JPG|JPEG|PNG/;
    if (!allowedExt.test(extName))
        return cb(new Error("File Extension JPG or PNG 2mb"), false);
    cb(null, true);
};

// upload image
const imageUpload = multer({
    // storage: imageStorage,
    storage: cloudinaryStorage,
    limits: limit,
    fileFilter: imageOnlyFilter,
}).single("photo");

const upImageFile = (req, res, next) => {
    imageUpload(req, res, (err) => {
        if (err) {
            res.status(400).json({
                error: err.message,
            });
            return;
        }
        next();
    });
};

module.exports = upImageFile;