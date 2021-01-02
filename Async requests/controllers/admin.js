const { validationResult } = require('express-validator');
const Product = require('../models/product');

const fileHelper=require('../util/file')

exports.getAddProduct = (req, res, next) => {
  if(!req.session.isLoggedIn){
    return res.redirect('/login')
  }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMessage:'',
    validationErrors:[],
    oldInput:{
      title: '',
      price: '',
      description: '',
      imageUrl: '',
    }
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const productObject={
    title: title,
    price: price,
    description: description,
    userId: req.user
  }
  if(!image){
    return res.status(422).render('admin/edit-product',{
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage:'File attached not supported, must be jpeg, jpg or png',
      validationErrors:[],
      oldInput:productObject
    })
  }
  const product = new Product(productObject);
  const errors=validationResult(req)
  if(!errors.isEmpty()){
    console.log(errors.array())
    return res.status(422).render('admin/edit-product',{
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage:errors.array()[0].msg,
      validationErrors:errors.array(),
      oldInput:productObject
    })
  }
  product.imageUrl=image.path
  product
  .save()
  .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      // return res.status(500).render('admin/edit-product',{
      //   pageTitle: 'Add Product',
      //   path: '/admin/add-product',
      //   editing: false,
      //   errorMessage:'Database operation failed, please try again',
      //   validationErrors:[],
      //   oldInput:productObject
      // })
      // res.redirect('/500')
      const error=new Error(err)
      error.httpStatusCode = 500
      return next(error)
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        errorMessage:'',
        validationErrors:[],
        oldInput:{
          title: '',
          price: '',
          description: '',
          imageUrl: '',
        }
      });
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode = 500
      return next(error)
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors=validationResult(req)
  if(!errors.isEmpty()){
    console.log(errors.array())
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id:prodId
      },
      errorMessage:errors.array()[0].msg,
      validationErrors:errors.array()
    })
  }
  Product.findById(prodId)
    .then(product => {
      if(product.userId.toString()!=req.user._id.toString()){
        return res.redirect('/')
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if(image){
        product.imageUrl = image.path;
        fileHelper.deleteFile(product.imageUrl) //Fire and forget, dont care about result
      }
      return product.save()
      .then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      })
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode = 500
      return next(error)
    });};

exports.getProducts = (req, res, next) => {
  Product.find({userId:req.user._id})
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      // console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => {
      console.log(err)
      const error=new Error(err)
      error.httpStatusCode = 500
      return next(error)
    });};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findOne({_id:prodId})
  .then(product=>{
    if(!product){
      return next(new Error('No product found'))
    }
    fileHelper.deleteFile(product.imageUrl)
    return Product.deleteOne({_id:prodId,userId:req.user._id})
  })
  .then(() => {
    console.log('DESTROYED PRODUCT');
    res.status(200).json({message:'Success!'})
  })
  .catch(err => {
    res.status(500).json({message:"Deleting product failed"})
  });
  };
