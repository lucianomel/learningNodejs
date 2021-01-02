const mongodb=require('mongodb')
const getDb=require('../util/database').getDb

class Product {
  constructor(title, price, description, imageUrl,id,userId){
    this.title=title
    this.price=price
    this.description=description
    this.imageUrl=imageUrl
    if(id){
      this._id=mongodb.ObjectId(id)
    }
    this.userId=userId
  }

  save(){
    const db=getDb()
    console.log(this._id)
    let dbOp
    if(this._id){
      dbOp= db.collection('products').updateOne({_id:new mongodb.ObjectId(this._id)},{$set:this})
    }else{
      dbOp= db.collection('products').insertOne(this) //can pass any object to insertOne
    }
    return dbOp
      .catch(err=>{
        console.log(err)
      })
  }
  static fetchAll(){
    const db=getDb()
    return db.collection('products').find().toArray()
    .then(products=>{
      // console.log(products)
      return products
    })
    .catch(err=>{
      console.log(err)
    })
  }
  static fetchById(id){
    const db=getDb()
    console.log(id)
    return db.collection('products').find({_id:new mongodb.ObjectId(id)}).next()
    .then(product=>{
      return product
    })
  }
  static deleteById(id){
    const db=getDb() 
    return db.collection('products').deleteOne({_id:new mongodb.ObjectId(id)})
    .catch(err=>{
      console.log(err)
    })
  }
}

module.exports=Product