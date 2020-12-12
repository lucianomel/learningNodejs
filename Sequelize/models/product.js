const Sequelize = require('sequelize')
// import {sequelize} from '../util/database'
const sequelize=require('../util/database') 
// 1st argument model name, 2nd arg structure of model and DB table

const Product=sequelize.define('product',{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey: true
  },
  title:Sequelize.STRING,
  price:{
    type: Sequelize.DOUBLE,
    allowNull:false
  },
  imageUrl:{
    type: Sequelize.STRING,
    allowNull:false
  },
  description:{
    type:Sequelize.STRING,
    allowNull:false
  }
})
module.exports=Product
// export {Product}