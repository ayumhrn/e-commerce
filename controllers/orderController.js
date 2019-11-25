var mongoose = require('mongoose');
var Cart = require('../models/cart');
var user = require('../models/user');
var detailOrder = require('../models/detailOrder');
var order = require('../models/order');
var product = require('../models/product');
var response = require('../helpers/response');

exports.InserttoOrder = async (req, res) => {

    var userId = req.decoded._id

    let cart = await Cart.find({user_id: userId})
        .populate({path: 'product_id', select: 'productName price'})
        .select('-__v')

    var length = cart.length

    /* istanbul ignore if */
    if(length === 0) {
        return res.status(404).json(
            response.errorResponse('Cart is empty', cart)
        )
    }

    let listCart = []
    let total = 0

    for (let i = 0; i < length; i++) {
        
        var { productName, price, _id } = cart[i].product_id

        var stock = await product.findOne(_id)

        /* istanbul ignore if */
        if (cart[i].quantity > stock.stock) {
            return res.status(422).json(
                response.errorResponse(`Insufficient stock of ${productName}`)
            )
        }

        var data = {
            _id: new mongoose.Types.ObjectId(),
            userId: userId,
            product_id: _id,
            quantity: cart[i].quantity,
            price,
            alltotal: cart[i].total
        }

        listCart.push(data)

        total = total + data.alltotal
    }

    var savedetailOrder = await detailOrder.create(listCart)

    var detail_order = []
    var currentStock = 0

    for (let i = 0; i < length; i++) {
        detail_order.push(savedetailOrder[i]._id)
        var { _id} = cart[i].product_id

        var stock = await product.findOne(_id)

        console.log(stock)

        var currentStock = Number(stock.stock - Number(cart[i].quantity))

        await product.findOneAndUpdate(
            {_id},
            {stock: currentStock},
            {new: true}
        )
    }

    var newOrder = new order({
        _id: new mongoose.Types.ObjectId(),
        user_id: userId,
        detail_order, total
        
    })

    newOrder.save()

    await Cart.deleteMany({user_id: userId})

    await user.findOneAndUpdate(userId, {$set: {history: newOrder._id}}, {new: true});

    return res.status(201).json(
        response.successResponse('Order succes!', newOrder)
    )


}

exports.history = async (req, res) => {

    var userId = req.decoded._id

    order.find({user_id: userId})
        .populate('detail_order')
        .select('-__v')
        .then(order => {
            return res.status(200).json(
                response.successResponse('History order', order)
            )
        })
}