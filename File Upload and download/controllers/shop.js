const Product = require('../models/product');
const Order = require('../models/order');
const fs=require('fs')
const path=require('path');
const { set } = require('mongoose');

const PDFDocument =require('pdfkit')

const ITEMS_PER_PAGE=1

exports.getProducts = (req, res, next) => {
    let totalItems
    const page=parseInt(req.query.page) ||1
    Product.find().countDocuments()
    .then(numProducts=>{
      totalItems=numProducts
      return Product.find().skip((page-1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
    })
    .then(products => {
      console.log(products)
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        currentPage:page,
        hasNextPage: page*ITEMS_PER_PAGE<totalItems,
        hasPreviousPage:page>1,
        nextPage:page+1,
        previousPage:page-1,
        lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode = 500
      return next(error)
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode = 500
      return next(error)
    });
};
exports.getIndex = (req, res, next) => {
  let totalItems
  const page=parseInt(req.query.page) ||1
  Product.find().countDocuments()
  .then(numProducts=>{
    totalItems=numProducts
    return Product.find().skip((page-1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
  })
  .then(products => {
    console.log(products)
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      currentPage:page,
      hasNextPage: page*ITEMS_PER_PAGE<totalItems,
      hasPreviousPage:page>1,
      nextPage:page+1,
      previousPage:page-1,
      lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)
    });
  })
  .catch(err => {
    const error=new Error(err)
    error.httpStatusCode = 500
    return next(error)
  });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode = 500
      return next(error)
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode = 500
      return next(error)
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode = 500
      return next(error)
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email:req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode = 500
      return next(error)
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode = 500
      return next(error)
    });
};

exports.getInvoice=(req,res,next)=>{
  const orderId=req.params.orderId
  Order.findOne({_id:orderId})
  .then(order=>{
    if(!order){
      return next(new Error('No order found'))  
    }
    if(order.user.userId.toString()!=req.user._id.toString()){
      return next('Not authorized user')
    }
    const invoiceName='invoice-'+orderId+'.pdf'
    const invoicePath=path.join('data','invoices',invoiceName)
    console.log(invoicePath)

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="'+invoiceName+'"');
    const pdfDoc = new PDFDocument()
    pdfDoc.pipe(fs.createWriteStream(invoicePath))
    pdfDoc.pipe(res)
    let totalPrice=0
    pdfDoc.fontSize(26).text('Invoice',{underline:true})
    pdfDoc.text('------------------------------------------')
    order.products.forEach(p=>{
      totalPrice+=p.product.price*p.quantity
      pdfDoc.fontSize(14).text(p.product.title+'-'+p.quantity+'-'+'X'+'$'+p.product.price)
    })
    pdfDoc.fontSize(26).text('------------------------------------------')
    pdfDoc.fontSize(20).text('Total price: $ '+totalPrice)
    pdfDoc.end()


    // fs.readFile(invoicePath,(err,data)=>{
    //   if(err){
    //     return next(err)
    //   }
    //   res.setHeader('Content-Type', 'application/pdf');
    //   res.setHeader('Content-Disposition', 'inline; filename="'+invoiceName+'"');
    //   res.send(data)
    // })
    // Best practice is to stream the file, so that server memory doesn't overload
    // const file=fs.createReadStream(invoicePath)
    //   res.setHeader('Content-Type', 'application/pdf');
    //   res.setHeader('Content-Disposition', 'inline; filename="'+invoiceName+'"');
    //   file.pipe(res)      
  })
  .catch(err=>{
    return next(err)
  })
  
}