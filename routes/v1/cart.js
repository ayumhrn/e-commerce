const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const cartController = require('../../controllers/cartController');

router.post('/add', auth.isAuthenticated, cartController.inserttoCart);

router.get('/get-all', auth.isAuthenticated, cartController.getCart);

router.put('/:id', auth.isAuthenticated, cartController.updateCart);

router.delete('/:id', auth.isAuthenticated, cartController.removeOneCart);

module.exports = router