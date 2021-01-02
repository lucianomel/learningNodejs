const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const Order=sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    }
    // Can add, for example, an address
})

module.exports=Order