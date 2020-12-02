const express =require('express')

// const path=require('path')

// const rootDir=require('../util/path');

const adminController=require('../controllers/admin')

const router=express.Router();

// admin/product => POST
router.post('/add-product',adminController.postAddProduct)

// admin/add-product 
router.get('/add-product',adminController.getAddProduct); 

// admin/products
router.get('/products',adminController.getAdminProducts)

// admin/editProduct
router.get('/editProduct',adminController.getEditProduct)

module.exports=router;
// exports.products=products;