const { addProduct } = require('../models/cart');
const Product =require('../models/product')
const Cart=require('../models/cart')


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
            path:"/products"
        });
    })
}
exports.getCart=(req,res)=>{
    Product.fetchAllFromCart((cartToDisplay,totalPrice)=>{
        if(cartToDisplay){
            res.render('shop/cart',{pageTitle:"Your Cart",path:"/cart",prods:cartToDisplay,totalPrice:totalPrice})
        }else{
            res.redirect('/')
        }
    })
}
exports.postAddToCart=(req,res)=>{
    let productId=req.body.productId;
    console.log(productId)
    Product.findById(productId,product=>{
        Cart.addProduct(productId,product.price)
        res.redirect('/cart')
    })
}
exports.getDeleteFromCart=(req,res)=>{
    const id=req.params.id
    Product.findById(id,product=>{
        Cart.deleteProduct(id,product.price,(err)=>{
            if(err){
                return console.log(err)
            }
            res.redirect('/cart')
        })
    })
}
exports.getCheckout=(req,res)=>{
    res.render('shop/checkout',{pageTitle:"Checkout",path:"/checkout"})
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
    Product.fetchAll(products=>{
        res.render('shop/index',{
            prods:products,
            pageTitle:'Shop',
            path:"/"
        });
    })
}
exports.getProductDetails=(req,res)=>{
    const id=req.params.productId;
    // console.log(id);
    Product.findById(id,product=>{
        res.render('shop/product-detail',{pageTitle:product.title,product:product,path:'/products'})
    })
}
exports.getOrder=(req,res)=>{
    res.render('shop/orders',{pageTitle:"Your orders",path:"/orders"})
}
