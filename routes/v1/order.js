const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderController');
const auth = require('../../middlewares/auth');

router.post('/', auth.isAuthenticated, orderController.InserttoOrder);

router.get('/', auth.isAuthenticated, orderController.history);

module.exports = router;