const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({

    _id: mongoose.Schema.Types.ObjectId,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    detail_order: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'detailOrder'
    }],
    total: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const order = mongoose.model('order', orderSchema);

module.exports = order