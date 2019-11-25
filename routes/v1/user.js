const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController')
const auth = require('../../middlewares/auth');

router.get('/get-all', userController.getAllUser);

router.post('/register', userController.register);

router.post('/login', userController.login);

router.route('/id')
    .get(auth.isAuthenticated, userController.getUserbyId)
    .put(auth.isAuthenticated, userController.updateUserbyId)
    .delete(auth.isAuthenticated, userController.deleteUserbyId)

router.post('/reset-password', userController.resetPassword);

router.post('/reset/:token', userController.changePassword);

module.exports = router;