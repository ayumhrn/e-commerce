const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const detailOrderSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    product_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    alltotal: {
        type: Number,
        required: true
    }
})

const detailOrder = mongoose.model('detailOrder', detailOrderSchema);

module.exports = detailOrder;