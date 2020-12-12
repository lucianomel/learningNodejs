const { addProduct } = require('../models/cart');
const Product =require('../models/product')
// import Product from '../models/product'
// const Cart=require('../models/cart')
// const Order=require('../models/order')

exports.getProducts=(req,res,next)=>{
    // Can restrict find all with argument {where: ...}
    Product.findAll().then(products=>{
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
    // Product.fetchAllFromCart((cartToDisplay,totalPrice)=>{
    //     if(cartToDisplay){
    //         res.render('shop/cart',{pageTitle:"Your Cart",path:"/cart",prods:cartToDisplay,totalPrice:totalPrice})
    //     }else{
    //         res.redirect('/')
    //     }
    // })
    req.user
        .getCart()
        .then(cart=>{
            return cart.getProducts()
        })
        .then(products=>{
            res.render('shop/cart',{pageTitle:"Your Cart",path:"/cart",prods:products,totalPrice:""})
        })
        .catch(err=>{
            console.log(err)
        })
}
exports.postAddToCart=(req,res)=>{
    let productId=req.body.productId;
    let fetchedCart
    // console.log(productId)
    // Product.findById(productId,product=>{
    //     Cart.addProduct(productId,product.price)
    //     res.redirect('/cart')
    // })
    req.user
        .getCart()
        .then(cart=>{
            fetchedCart=cart
            return cart.getProducts({where:{id:productId}})
        })
        .then(products=>{
            let product
            if(products.length>0){
                product=products[0]
            }
            let newQuantity=1
            if(product){
                // 
                const oldQuantity=product.cartItem.quantity
                newQuantity=oldQuantity+1
                return fetchedCart.addProduct(product,{through:{quantity:newQuantity}}) 
            }
            return Product.findByPk(productId)
            .then(product=>{
                return fetchedCart.addProduct(product,{through:{quantity:newQuantity}})
            })
        })
        .then(()=>{
            res.redirect('/cart')
        })
        .catch(err=>{
            console.log(err)
        })
}
exports.getDeleteFromCart=(req,res)=>{
    const id=req.params.id
    req.user
        .getCart()
        .then(cart=>{
            return cart.getProducts({where:{id:id}})
        })
        .then(([product])=>{
            // Want to delete that product in the in between cart table that connects both
            return product.cartItem.destroy()
        })
        .then(result=>{
            res.redirect('/cart')
        })
        .catch(err=>console.log(err))
    // Product.findById(id,product=>{
    //     Cart.deleteProduct(id,product.price,(err)=>{
    //         if(err){
    //             return console.log(err)
    //         }
    //         res.redirect('/cart')
    //     })
    // })
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
    Product.findAll()
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
    Product.findByPk(id)
    .then(product=>{
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
        .getOrders({include:['products']})
        .then(orders=>{
            console.log(orders)
            res.render('shop/orders',{pageTitle:"Your orders",path:"/orders",orders:orders})
        })
        .catch(err=>{
            console.log(err)
        })
}

exports.postOrder=(req,res)=>{
    let fetchedCart
    req.user
        .getCart()
        .then(cart=>{
            fetchedCart=cart
            return cart.getProducts()
        })
        .then(products=>{
            return req.user.createOrder()
            .then(order=>{
                return order.addProducts(products.map(product=>{
                    product.orderItem={quantity: product.cartItem.quantity}
                    return product
                    })
                )
            })
            .catch(err=>{
                console.log(err)
            })
        })
        .then(result=>{
            return fetchedCart.setProducts(null)
        })
        .then(result=>{
            res.redirect('/orders')
        })
        .catch(err=>{
            console.log(err)
        })
}
