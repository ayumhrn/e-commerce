const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    pict: { type: String },
    stock: {type: Number, required: true},
    description: {type: String},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    category: {
        type: String,
        enum: ['anak', 'wanita', 'pria']
    }
})

const product = mongoose.model('product', productSchema);

module.exports = product;