const express = require('express');
const router = express.Router();
const multer = require('multer');
const product = require('../../models/product');
const response = require('../../helpers/response');
const cloudinary = require('cloudinary');
const datauri = require('datauri');
const upload = require('../../middlewares/multer');
const uploader = multer().single('image')
const auth = require('../../middlewares/auth');
const merchant = require('../../middlewares/merchant');

router.post('/:id', auth.isAuthenticated, merchant, upload.single('image'), (req, res) => {

    var fileUp = req.file

    /*  istanbul ignore if */
    if (!fileUp) {
        return res.status(415).send({
            success: false,
            message: 'No file received: Unsupported Media Type'
        })
    }

    const dUri = new datauri()

    uploader(req, res, err => {
        var file = dUri.format(`${req.file.originalname}-${Date.now()}`, req.file.buffer);
        cloudinary.uploader.upload(file.content)
            .then(data => {
                product.updateOne({_id: req.params.id},
                    {$set: {pict: data.secure_url}},
                    {new: true})
                    .then((product) => {
                        return res.status(201).json(
                            response.successResponse('Updated!', product)
                        )
                    })
            })   
            .catch(err => {
                /* istanbul ignore next */
                res.send(err);
            })
    })
})

module.exports = router;