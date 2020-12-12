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
router.get('/edit-product/:productId',adminController.getEditProduct)

//admin/editProduct => PUT
router.post('/edit-product',adminController.putEditProduct)

//admin/delete-product =>PUT
router.post('/delete-product',adminController.postDeleteProduct)

module.exports=router;
// exports.products=products;