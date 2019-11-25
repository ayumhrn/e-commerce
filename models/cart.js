const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    quantity: { type: Number, default: 1 },
    total: {type: Number, default: 0}
})

const cart = mongoose.model('cart', cartSchema);

module.exports = cart;