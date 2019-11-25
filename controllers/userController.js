const mongoose = require('mongoose');
const user = require('../models/user');
const bcrypt = require('bcrypt');
const response = require('../helpers/response');
const jwt = require('jsonwebtoken');
const { sendResetPassword } = require('../services/nodemailer');
require('dotenv').config();


exports.register = async (req, res) => {

    const _id = new mongoose.Types.ObjectId()
    const {
        username,
        name,
        email,
        password,
        role
    } = req.body
    const history = []

    const newuser = new user({
        _id: _id,
        username: username,
        name: name,
        email: email,
        role: role,
        password: password,
        history
    })

    const emailExist = await user.findOne({
        email: req.body.email
    })

    if (emailExist) {
        return res.status(409).json(
            response.errorResponse('Already exist', 409)
        )
    }

    newuser.save()
        .then((newuser) => {
            return res.status(201).json(
                response.successResponse('User successfully created!', newuser)
            )
        })
        .catch((err) => {
            return res.status(406).json(
                response.errorResponse('Failed', err.message, 406)
            )
        })
}

exports.getAllUser = (req, res) => {

    user.find()
        .select('-__v')
        .exec()
        .then((users) => {
            return res.status(200).json(
                response.successResponse('List user', users)
            )
        })
}

exports.getUserbyId = async (req, res) => {

    const userId = req.decoded._id

    user.findOne({ _id: userId })
        .select('-password -__v')
        .then((users) => {
            return res.status(200).json(
                response.successResponse('User found', users)
            )
        })

}

exports.login = async (req, res) => {

    const exist = await user.findOne({
        username: req.body.username
    })

    if (!exist) {
        return res.status(404).json(
            response.errorResponse('Not found', 404)
        )
    }

    user.findOne({
        username: req.body.username
    }).exec(function (err, user) {

        bcrypt.compare(req.body.password, user.password).then(function (result) {

            if (result) {
                var token = jwt.sign(user.toJSON(), process.env.SECRET_KEY, {
                    algorithm: 'HS256'
                    // expiresIn: '900000000'
                })

                res.setHeader('Authorization', token)

                res.json({
                    message: 'Login success',
                    token: token,
                    success: true
                })
            }

            else {
                res.status(401).json({
                    message: 'Password incorrect',
                    success: false
                })
            }
        })
    })
}

exports.updateUserbyId = async (req, res) => {

    const userId = req.decoded._id

    /*istanbul ignore next */

    user.updateOne(
        { _id: userId },
        { $set: req.body }, { new: true })
        .exec()
        .then((users) => {
            return res.status(201).json(
                response.successResponse('User successfully updated!', users)
            )
        })
        .catch((err) => {
            return res.status(406).json(
                response.errorResponse('Update failed', err.message, 406)
            )
        })
}

exports.deleteUserbyId = async (req, res) => {

    const userId = req.decoded._id

    user.deleteOne({ _id: userId })
        .exec()
        .then((users) => {
            return res.status(200).json(
                response.successResponse('User sucessfully deleted!', users)
            )
        })

}

exports.resetPassword = (req, res) => {
    var email = req.body.email;
    sendResetPassword(email, res)
}

/* istanbul ignore next */
exports.changePassword = (req, res) => {
    const token = req.params.token;
    const password = req.body.password;

    const decoded = jwt.verify(token, process.env.SECRET_KEY)

    if (!decoded) {
        return res.status(404).json(
            response.errorResponse('The token is expired or invalid', err, 404)
        )
    }

    bcrypt.hash(password, 10, (err, hash) => {

        if (err) throw err;
        user.updateOne(
            { _id: decoded._id },
            { $set: { password: hash } },
            { new: true })
            .exec()
            .then(() => {
                return res.status(200).json(
                    response.successResponse('Password successfully updated!', 200)
                )
            })
    })


}




