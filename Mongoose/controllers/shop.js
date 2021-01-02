// const { addProduct } = require('../models/cart');
const Product =require('../models/product');
// import Product from '../models/product'
// const Cart=require('../models/cart')
// const Order=require('../models/order')
const Order=require('../models/order');

exports.getProducts=(req,res,next)=>{
    // Can restrict find all with argument {where: ...}
    Product.find()
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
    Product.findById(productId)
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
    Product.find()
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
    Product.findById(id)
    .then(product=>{
        res.render('shop/product-detail',{pageTitle:product.title,product:product,path:'/products'})
    })
}
exports.getOrders=(req,res)=>{
    // Order.getOrders(req.user._id)
    // .then(orders=>{
    //     res.render('shop/orders',{pageTitle:"Your orders",path:"/orders",orders:orders})
    // })
    Order.getOrders(req.user._id)
    .then(orders=>{
        res.render('shop/orders',{pageTitle:"Your orders",path:"/orders",orders:orders})
    })
}

exports.postOrder=(req,res)=>{
    // req.user
    //     .addOrder()
    //     .then(result=>{
    //         res.redirect('/orders')
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     })
    req.user.getCart()
    .then(products=>{
        console.log(products)
        const order=new Order({
            user:{name:req.user.name,userId:req.user._id},
            products:products.map(i=>{
                const constQty=i.qty
                delete i.qty
                return {qty:constQty,product:i}
            })
        })
        return order.save()
    })
    .then(()=>{
        return req.user.clearCart()
    })
    .then(()=>{
        res.redirect('/orders')
    })
}
