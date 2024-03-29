/* istanbul ignore file */
var nodemailer = require('nodemailer');
var nodemailersendGrid = require('nodemailer-sendgrid');
require('dotenv').config();

var transporter = nodemailer.createTransport(
    nodemailersendGrid({
        apiKey: process.env.SENDGRID_API_KEY
    })
);

var jwt = require('jsonwebtoken');
var user = require('../models/user');
var { successResponse, errorResponse } = require('../helpers/response');

exports.sendResetPassword = async (email, res) => {
    const userExist = await user.findOne({ email: email });
    if (!userExist) {
        return res.status(404).json(errorResponse('Not found', err, 404))
    }
    const token = jwt.sign({
        _id: userExist._id,
        email: userExist.email
    }, process.env.SECRET_KEY, {
        algorithm: 'HS256'
    })

    transporter.sendMail({
        from: 'no-reply@ga.com',
        to: email,
        subject: 'Reset Password',
        html: `<p>Klik link dibawah ini untuk reset password</p>
        <a href="http://localhost:3000/user/reset/${token}" target="_blank">Reset Password</a>`
    })
        .then(() => res.status(200).json(successResponse(`Email sent to ${email}`)))
        .catch(err => res.send(err));
}