const express =require('express')

// const path=require('path')

// const rootDir=require('../util/path');

const productsController=require('../controllers/products')

const router=express.Router();

// admin/add-product 
router.get('/add-product',productsController.getAddProduct); 
 
// admin/product 
router.post('/add-product',productsController.postAddProduct)

module.exports=router;
// exports.products=products;