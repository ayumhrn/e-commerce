/* istanbul ignore file */

const multer = require('multer');
const cloudinary = require('cloudinary');
const path = require('path');
require('dotenv').config();

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
})

var storage = multer.memoryStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images')
    },
    fileFilter: function (req, file, inst) {

        var allowedType = /jpeg|jpg|png|img/
        var extFile = allowedType.test(path.extname(file.originalname).toLowerCase())
        var mimeType = allowedType.test(file.mimetype)

        if (extFile && mimeType) {
            inst(null, true)
        } else {
            inst(null, false)
        }
    }
})
const upload = multer({ storage: storage })

module.exports = upload
