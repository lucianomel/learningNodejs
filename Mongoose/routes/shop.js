const express =require('express')

// const path =require('path')

// const rootDir=require('../util/path')
// const adminData=require("./admin")

const router=express.Router();

const shopControllers=require('../controllers/shop')

router.get('/',shopControllers.getShop); 

router.get('/products',shopControllers.getProducts); 

router.get('/products/:productId',shopControllers.getProductDetails); 

router.get('/cart',shopControllers.getCart); 
router.post('/cart',shopControllers.postAddToCart)


// // router.post('/checkout',shopControllers.postCheckout); 
router.get('/cart/delete-cart/:id',shopControllers.getDeleteFromCart)


// router.get('/shop-index',shopControllers.getShop); 
router.get('/orders',shopControllers.getOrders);
router.post('/create-order',shopControllers.postOrder)


module.exports=router;
