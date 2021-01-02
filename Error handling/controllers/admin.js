const { validationResult } = require('express-validator');
const Product = require('../models/product');

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
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const productObject={
    // _id: new mongoose.Types.ObjectId('5fe0c3997b8a0b2450317991'),
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
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
  const updatedImageUrl = req.body.imageUrl;
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
        imageUrl: updatedImageUrl,
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
      product.imageUrl = updatedImageUrl;
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
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode = 500
      return next(error)
    });};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({_id:prodId,userId:req.user._id})
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode = 500
      return next(error)
    });};
