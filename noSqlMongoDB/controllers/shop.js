// const { addProduct } = require('../models/cart');
const Product =require('../models/product');
const { mongoConnect } = require('../util/database');
// import Product from '../models/product'
// const Cart=require('../models/cart')
// const Order=require('../models/order')

exports.getProducts=(req,res,next)=>{
    // Can restrict find all with argument {where: ...}
    Product.fetchAll()
        .then(products=>{
        res.render('shop/product-list',{
            prods:products,
            pageTitle:'Shop Products',
            path:"/products"
        });
    })
    .catch(err=>{
        console.log(err)
    })
}
exports.getCart=(req,res)=>{
    req.user
        .getCart()
        .then(products=>{
            res.render('shop/cart',{pageTitle:"Your Cart",path:"/cart",prods:products,totalPrice:""})
        })
        .catch(err=>{
            console.log(err)
        })
}
exports.postAddToCart=(req,res)=>{
    let productId=req.body.productId;
    Product.fetchById(productId)
    .then(product=>{
        return req.user.addToCart(product)
    })
    .then(result=>{
        res.redirect('/cart')
    })
    .catch(err=>{
        console.log(err)
    })
}
exports.getDeleteFromCart=(req,res)=>{
    const id=req.params.id
    req.user.deleteCartItemById(id)
    .then(result=>{
        res.redirect('/cart')
    })
    .catch(err=>{
        console.log(err)
    })
}
exports.postCheckout=(req,res)=>{
    const newCart=JSON.parse(req.body.cart)
    Cart.updateCart(newCart,(err)=>{
        if(err){
            //error, return a res.redirec 
        }
        console.log(newCart)
        Product.fetchAllFromCart((prods,totalPrice)=>{
            if(prods){
                res.render('shop/checkout',{pageTitle:"Checkout",path:"/checkout",prods:prods,totalPrice:totalPrice})
            }else{
                res.redirect('/')
            }
        })
    })
}
exports.getShop=(req,res)=>{
    Product.fetchAll()
    .then(products=>{
        res.render('shop/index',{
            prods:products,
            pageTitle:'Shop',
            path:"/"
        });
    })
    .catch(err=>{
        console.log(err)
    })
}
exports.getProductDetails=(req,res)=>{
    const id=req.params.productId;
    Product.fetchById(id)
    .then(product=>{
        // console.log(product)
        res.render('shop/product-detail',{pageTitle:product.title,product:product,path:'/products'})
    })
    // Can also use find method of SEQUELIZE
    // Product.findAll({where:{id:id}})
    // .then(([product])=>{
    //     res.render('shop/product-detail',{pageTitle:product.title,product:product,path:'/products'})
    // })
}
exports.getOrders=(req,res)=>{
    req.user
        .getOrders()
        .then(orders=>{
            res.render('shop/orders',{pageTitle:"Your orders",path:"/orders",orders:orders})
        })
        .catch(err=>{
            console.log(err)
        })
}

exports.postOrder=(req,res)=>{
    req.user
        .addOrder()
        .then(result=>{
            res.redirect('/orders')
        })
        .catch(err=>{
            console.log(err)
        })
}
