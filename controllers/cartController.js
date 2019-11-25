const mongoose = require('mongoose');
const cart = require('../models/cart');
const product = require('../models/product')
const user = require('../models/user');
const response = require('../helpers/response');

exports.inserttoCart = async (req, res) => {

    const {
        product_id,
        quantity
    } = req.body
    const userId = req.decoded._id

    const newCart = new cart({
        _id: new mongoose.Types.ObjectId(),
        user_id: userId,
        product_id,
        quantity
    })

    product.findOne({ _id: product_id })
        .then(result => {
                /* istanbul ignore if */
            if (quantity > result.stock) {
                return res.status(422).json(
                    response.errorResponse('Insufficient stock')
                )
            }

        })

    await newCart.save()

    let finduser = await user.findById(userId)

    let pushuser = await user.findByIdAndUpdate(finduser, { $set: { history: newCart } }, { new: true })

    let theProduct = await product.findById(product_id)

    var totalprice2 = quantity * theProduct.price

    let findCart = await cart.findByIdAndUpdate(newCart._id, { $set: { total: totalprice2 } }, { new: true })
        .then((findCart) => {
            return res.status(201).json(
                response.successResponse('Added to cart!', findCart)
            )
        })

}

exports.getCart = async (req, res) => {

    const userId = req.decoded._id

    cart.find({ user_id: userId })
        .populate({ path: 'product_id', select: 'productName price' })
        .select('-__v')
        .then((cart) => {

            var length = cart.length
            var total = 0

            for (i = 0; i < length; i++) {
                total = total + cart[i].total
            }

            var data = {
                total_price: total,
                cart
            }

            return res.status(200).json(
                response.successResponse('All cart', data)
            )
        })
}

exports.updateCart = async (req, res) => {

    const userId = req.decoded._id

    const quantity = req.body.quantity

    cart.findOne({ _id: req.params.id })
        .then(result => {
            product.findOne({ _id: result.product_id })
                .then(result => {
                    if (quantity > result.stock) {
                        return res.status(422).json(
                            response.errorResponse('Insufficient Stock')
                        )
                    }
                })

            cart.findOneAndUpdate({ _id: req.params.id, user_id: userId },
                { $set: {quantity: req.body.quantity} },
                { new: true })
                .then((cart) => {
                    return res.status(201).json(
                        response.successResponse('Cart updated!', cart)
                    )
                })
                .catch((err) => {
                    return res.status(406).json(
                        response.errorResponse('Failed', err, 406)
                    )
                })
        })


}

exports.removeOneCart = async (req, res) => {

    const userId = req.decoded._id

    cart.deleteOne({ _id: req.params.id, user_id: userId })
        .then((cart) => {
            return res.status(200).json(
                response.successResponse('Cart deleted', cart)
            )
        })
}
