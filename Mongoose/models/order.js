const mongoose=require('mongoose')

const Schema=mongoose.Schema

// const orderSchema=new Schema({
//     userId:{
//         type:Schema.Types.ObjectId,
//         ref:'User',
//         required:true
//     },
//     items:[
//         {
//             productId:{type:Schema.Types.ObjectId,ref:"Product"},
//             qty:Number,_id:false
//         }
//     ]
// })
// orderSchema.statics.getOrders=function(userId){
//     return this.find({userId:userId}).populate('items.productId').lean()
//         .then(orders=>{
//             for (let i = 0; i < orders.length; i++) {
//                 for (let j = 0; j < orders[i].items.length; j++) {
//                     let elem=orders[i].items[j]
//                     orders[i].items[j]={...elem.productId,qty:elem.qty}
//                     console.log(orders[i].items[j])
//                 }                
//             }
//             return orders
//         })
// }
const orderSchema=new Schema({
    products:[{
        product:{type:Object,required:true},
        qty:{type:Number,required:true}
    }],
    user:{
        name:{
            type:String,required:true
        },
        userId:{
            type:Schema.Types.ObjectId,required:true,ref:'User'
        }
    }
})
orderSchema.statics.getOrders=function(userId){
    return this.find({'user.userId':userId}).select('products')
    .then(orders=>{
        orders.forEach(order=>{
            let totalOrderPrice=0
            order.products.forEach(item=>{
                totalOrderPrice+=item.qty*item.product.price
            })
            order.totalPrice=totalOrderPrice
        })
        return orders
    })
}
module.exports=mongoose.model('Order',orderSchema)