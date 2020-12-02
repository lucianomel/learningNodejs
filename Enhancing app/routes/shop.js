const express =require('express')

// const path =require('path')

// const rootDir=require('../util/path')
// const adminData=require("./admin")

const router=express.Router();

const shopControllers=require('../controllers/shop')

router.get('/',shopControllers.getShop); 

router.get('/products-list',shopControllers.getProducts); 

router.get('/cart',shopControllers.getCart); 
router.get('/checkout',shopControllers.getCheckout); 
router.get('/shop-index',shopControllers.getShop); 
router.get('/product-details',shopControllers.getProductDetails); 

router.get('/orders',shopControllers.getOrder);

module.exports=router;
