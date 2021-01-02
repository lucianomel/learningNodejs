const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const isAuth=require('../protection middleware/is-auth')

const { body }=require('express-validator')

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth,adminController.getAddProduct);

// /admin/products => GET
router.get('/products',isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',isAuth,
[
    body('title')
    .trim()
    .isLength({min:3}).withMessage('must include a title at least 3 char long')
    .isLength({max:100}).withMessage('title must not be more than 100 characters long'),
    body('price')
    .trim()
    .isFloat().withMessage('Please enter a number in price'),
    body('description','Description is required, at least 5 characters long')
    .trim()
    .isLength({min:5})
],
adminController.postAddProduct);

router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

router.post('/edit-product',isAuth,
[
    body('title')
    .trim()
    .isLength({min:3}).withMessage('must include a title at least 3 char long')
    .isAlphanumeric().withMessage('title must contain just numbers and letters')
    .isLength({max:100}).withMessage('title must not be more than 100 characters long'),
    // body('imageUrl')
    // .trim()
    // .isURL({protocols:'https'}).withMessage('Please enter a secure and valid image Url (https)'),
    body('price')
    .trim()
    .isFloat().withMessage('Please enter a number in price'),
    body('description','Description is required, at least 5 characters long')
    .trim()
    .isLength({min:5})
],
adminController.postEditProduct);

router.post('/delete-product',isAuth, adminController.postDeleteProduct);

module.exports = router;
