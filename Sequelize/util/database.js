// import {Sequelize} from 'sequelize'
const Sequelize =require('sequelize').Sequelize
const sequelize= new Sequelize('node-complete','root','choco96',{dialect:'mysql',host:'localhost'})

// export {sequelize}
module.exports=sequelize