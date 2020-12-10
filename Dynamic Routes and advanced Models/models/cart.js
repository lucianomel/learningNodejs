const fs=require('fs'),path=require('path');

const cartPath = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json'
  );

module.exports=class Cart {
    static addProduct(id,productPrize){
        // Fetch the previous cart
        fs.readFile(cartPath,(err,fileConent)=>{
            let cart ={products:[],totalPrice:0}
            if(!err){
                cart=JSON.parse(fileConent)
            }
            // if(err){
            //     cart.products.push({id:id,qty:1})
            //     cart.totalPrice+=parseFloat(productPrize)
            // }else{
            const existingProductIndex=cart.products.findIndex(prod=>prod.id==id)
            const existingProduct=cart.products[existingProductIndex]
            let updatedProduct
            if(existingProduct){
                updatedProduct={...existingProduct}
                updatedProduct.qty=parseFloat(updatedProduct.qty)+1
                // cart.products=[...cart.products]
                cart.products[existingProductIndex]=updatedProduct
            }else{
                updatedProduct={id:id,qty:1}
                cart.products=[...cart.products,updatedProduct]
            }
            cart.totalPrice+=parseFloat(productPrize)
            // }
            fs.writeFile(cartPath,JSON.stringify(cart),err=>{
                console.log(err)
            })
        })
    }
    static deleteProduct(id,productPrice,cb){
        fs.readFile(cartPath,(err,fileConent)=>{
            if(err){
                console.log(err)
                return cb(err);
            }
            let cart ={products:[],totalPrice:0}
            // var newCart={products:[],totalPrice:0}
            // let indexInCart=-2
            cart=JSON.parse(fileConent)
            const productDeletedMatchedInCart=cart.products.find(prod=>prod.id==id)
            if(productDeletedMatchedInCart){
                const qtyProductDeleted=productDeletedMatchedInCart.qty
                cart.totalPrice-=qtyProductDeleted*productPrice;
                cart.products=cart.products.filter(prod=>prod.id!=id)
                fs.writeFile(cartPath,JSON.stringify(cart),err=>{
                    console.log(err)
                    return cb(err)
                })
            }else{
                cb()
            }
            // for (let i=0;i<cart.products.length;i++){
            //     if(cart.products[i].id!=id){
            //         newCart.products.push(cart.products[i])
            //         console.log("newcart: ",newCart)
            //     }
            // }
            // Product.findById(id, product=> {
            //     if(indexInCart!=-2){
            //         newCart.totalPrice-= cart.products[indexInCart].qty * parseFloat(product.price)
            //     }
            //     fs.writeFile(cartPath,JSON.stringify(newCart),err=>{
            //         console.log(err)
            //     })
            //     cb(id)
            // })
        })
    }
    static fetchAllProducts(cb){
        fs.readFile(cartPath,(err,fileConent)=>{
            if(err){
                return cb()
            }
            const cart=JSON.parse(fileConent)
            return cb(cart)
        })
    }
    static updateCart(newcart,cb){
        newcart.products=newcart.products.filter(prod=>prod.qty>0)
        // console.log(newcart.products.filter(prod=>prod.qty>0))
        fs.writeFile(cartPath,JSON.stringify(newcart),err=>{
            cb(err)
        })
    }
}
