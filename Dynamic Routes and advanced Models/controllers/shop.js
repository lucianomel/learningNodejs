const Product =require('../models/product')

exports.getProducts=(req,res,next)=>{
    // console.log("Im in another middleware!")
    // res.send('<h1>Hello from express</h1>')
    // console.log(adminData.products);
    // res.sendFile(path.join(rootDir,'views','shop.html'))
    // const products=adminData.products
    Product.fetchAll(products=>{
        res.render('shop/product-list',{
            prods:products,
            pageTitle:'Shop Products',
            path:"/products-list"
        });
    })
}
exports.getCart=(req,res)=>{
    res.render('shop/cart',{pageTitle:"Your Cart",path:"/cart"})
}
exports.getCheckout=(req,res)=>{
    res.render('shop/checkout',{pageTitle:"Checkout",path:"/checkout"})
}
exports.getShop=(req,res)=>{
    Product.fetchAll(products=>{
        res.render('shop/index',{
            prods:products,
            pageTitle:'Shop',
            path:"/"
        });
    })
}
exports.getProductDetails=(req,res)=>{
    res.render('shop/product-detail')
}
exports.getOrder=(req,res)=>{
    res.render('shop/orders',{pageTitle:"Your orders",path:"/orders"})
}