var mongoose = require('mongoose');
var product = require('../models/product');
var response = require('../helpers/response');

exports.createProduct = async (req, res) => {

    var userId = req.decoded._id;

    var newproduct = new product({
        _id: new mongoose.Types.ObjectId(),
        productName: req.body.productName,
        pict: req.body.pict,
        price: req.body.price,
        userId,
        stock: req.body.stock,
        description: req.body.description,
        category: req.body.category
    });

    newproduct.save()
        .then((product) => {
            return res.status(201).json(
                response.successResponse('New product has been add!', product)
            )
        })
        .catch((err) => {
            return res.status(406).json(
                response.errorResponse('Failed', err, 406)
            )
        })
}


exports.showAllProduct = (req, res) => {

    product.find()
        .limit(12)
        .select('-__v')
        .then(product => {
            return res.status(200).json(
                response.successResponse('All list product: ', product)
            )
        })
}

exports.showOneProduct = (req, res) => {

    product.findOne({ _id: req.params.id })
        .select('-__v')
        .then(product => {
            return res.status(200).json(
                response.successResponse('Product', product)
            )
        })
        .catch(err => {
            return res.status(404).json(
                response.errorResponse('Not found', err.message, 404)
            )
        })
}

exports.showproductbyCategory = (req, res) => {

    product.find({ category: req.params.category })
        .select('-__v')
        .then(product => {
            return res.status(200).json(
                response.successResponse('Product', product)
            )
        })
}

exports.updateProduct = async (req, res) => {

    var userId = req.decoded._id;

    product.updateOne({ _id: req.params.id, userId: userId },
        { $set: req.body },
        { new: true })
        .then((product) => {
            return res.status(201).json(
                response.successResponse('Product successfully updated!', product)
            )
        })
}

exports.deleteOne = async (req, res) => {

    var userId = req.decoded._id;

    product.findByIdAndRemove({ _id: req.params.id, userId: userId }).exec()
        .then((product) => {
            return res.status(200).json(
                response.successResponse('Success!', product)
            )
        })
}

