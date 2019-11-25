var express = require('express');
var router = express.Router();
var auth = require('../../middlewares/auth');
var merchant = require('../../middlewares/merchant');
var productController = require('../../controllers/productController');

router.post('/create', auth.isAuthenticated, merchant, productController.createProduct);

router.get('/get-all', productController.showAllProduct);

router.get('/:category', productController.showproductbyCategory);

router.get('/one/:id', productController.showOneProduct);

router.put('/update/:id', auth.isAuthenticated, merchant, productController.updateProduct);

router.delete('/deleteone/:id', auth.isAuthenticated, merchant, productController.deleteOne);

module.exports = router;