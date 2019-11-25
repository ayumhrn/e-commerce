/* istanbul ignore file */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        unique: true,
        required: [true, 'You must have a username!']
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: function (email) {
            return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
        }
    },
    password: {
        type: String,
        min: 8,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'merchant'],
        default: 'customer'
    },
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order'
    }]
})

userSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next()
})

userSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

const user = mongoose.model('user', userSchema)

module.exports = user;