const mongoose=require('mongoose')

const Schema=mongoose.Schema
const Order=require('../models/order')

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    cart:{
        items: [{
            productId:{type:Schema.Types.ObjectId,ref:"Product",required:true},
            qty:{type:Number,required:true}
        }]
    }
})

userSchema.methods.addToCart=function(product){
        const cartProductIndex=this.cart.items.findIndex(cp=>cp.productId.toString()==product._id.toString()) //Cannot compare two mongo db objects by == or ===. Must convert to string
        // let newQuantity=1
        const updatedCartItems=[...this.cart.items]
        if(cartProductIndex>=0){
            updatedCartItems[cartProductIndex].qty++
        }else if(cartProductIndex==-1){
            updatedCartItems.push({productId:product._id,qty:1 })
        }
        const updatedCart={
            items:updatedCartItems
        }
        this.cart=updatedCart
        return this.save()
}
userSchema.methods.getCart=function(){
    // console.log(this.cart.items)
    return mongoose.model('User').findById(this._id).select('-cart.items._id').populate('cart.items.productId','-userId').lean()
    .then(user=>{
        let items = user.cart.items
        items=items.map(i=>{
            return {...i.productId,qty:i.qty}
        })
        return items
    })
}
userSchema.methods.deleteCartItemById=function(incomingProductId){
    let updatedCartItems=[...this.cart.items]
    // console.log(incomingProductId.toString())
    updatedCartItems= updatedCartItems.filter(i=>i.productId.toString()!=incomingProductId.toString())
    this.cart.items=updatedCartItems
    return this.save()
}

// userSchema.methods.addOrder=function(){
//     const order=new Order({userId:this._id,items:this.cart.items})
//     return order.save()
//     .then(()=>{
//         this.cart.items=[]
//         return this.save()
//     })
// }
userSchema.methods.clearCart=function(){
    this.cart.items=[]
    return this.save()
}

module.exports=mongoose.model('User',userSchema)
// const mongodb=require('mongodb')
// const { getDb } = require('../util/database')
// const Product = require('./product')

// class User{
//     constructor(username,email,cart,id){
//         this.name=username
//         this.email=email
//         this.cart=cart //{items:[]}
//         this._id=id
//     }
//     save(){
//         const db=getDb()
//         return db.collection('users').insertOne(this)
//     }
//     addToCart(product){
//         // In cart and increase qty
//         // Not in cart and save it for 1st time
//         const cartProductIndex=this.cart.items.findIndex(cp=>cp.productId.toString()==product._id.toString()) //Cannot compare two mongo db objects by == or ===. Must convert to string
//         // let newQuantity=1
//         const updatedCartItems=[...this.cart.items]
//         if(cartProductIndex>=0){
//             updatedCartItems[cartProductIndex].qty++
//         }else if(cartProductIndex==-1){
//             updatedCartItems.push({productId:new mongodb.ObjectId(product._id),qty:1 })
//         }
//         const db=getDb()
//         return db.collection('users').updateOne(
//             {_id:new mongodb.ObjectId(this._id)},
//             {$set:{cart:{items:updatedCartItems}}})
//     }
//     getCart(){
//         const db=getDb()
//         const productsIds=this.cart.items.map(item=>item.productId)
//         return db.collection('products').find({_id:{$in:productsIds}}).toArray()
//         .then(products=>{
//             if(productsIds.length!=products.length){
//                 console.log("Cleaning cart")
//                 return this.cleanCart(products)
//                 .then(()=>{
//                     return products
//                 })
//             }
//             return products
//         })
//         .then(products=>{
//             return products.map(p=>{
//                 return {...p,qty:this.cart.items.find(i=>i.productId.toString()==p._id.toString()).qty}
//             })
//         })
//     }
//     cleanCart(products){
//         const db=getDb()
//         const updatedCartItems=this.cart.items.filter(cp=>{
//             for (let i = 0; i < products.length; i++) {
//                 if(products[i]._id.toString()==cp.productId.toString()){
//                     return cp
//                 }
//             }
//         })
//         console.log(updatedCartItems)
//         return db.collection('users').updateOne(
//             {_id:new mongodb.ObjectId(this._id)},
//             {$set:{cart:{items:updatedCartItems}}})
//     }
//     deleteCartItemById(incomingProductId){
//         const db=getDb()
//         let updatedCartItems=[...this.cart.items]
//         // console.log(incomingProductId.toString())
//         updatedCartItems= updatedCartItems.filter(i=>i.productId.toString()!=incomingProductId.toString())
//         return db.collection('users').updateOne(
//             {_id:new mongodb.ObjectId(this._id)},
//             {$set:{cart:{items:updatedCartItems}}})
//     }
//     addOrder(){
//         const db=getDb()
//         return this.getCart()
//         .then(updatedProducts=>{
//             const order={
//                 items:updatedProducts,
//                 user:{
//                     _id:new mongodb.ObjectId(this._id),
//                     name:this.name
//                 }
//             }
//             return db.collection('orders').insertOne(order)
//         })
//         .then(result=>{
//             this.cart={items:[]}
//             return db.collection('users').updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:{items:[]}}})
//         })
//     }
//     getOrders(){
//         const db=getDb()
//         return db.collection('orders').find({'user._id':new mongodb.ObjectId(this._id)}).toArray()
//     }
//     static findById(userId){
//         const db=getDb()
//         return db.collection('users').findOne({_id:new mongodb.ObjectId(userId)})
//     }
// }
// module.exports=User