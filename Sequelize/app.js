// const http= require("http");

const express=require("express"), bodyParser=require('body-parser'), path=require('path');
const expressHbs=require("express-handlebars")
const app=express();

// Database
const sequelize=require('./util/database')
const Product=require('./models/product')
const User=require('./models/user')
const Cart=require('./models/cart')
const CartItem=require('./models/cart-item')
const Order=require('./models/order')
const OrderItem=require('./models/order-items')

app.set('view engine','ejs');
app.set('views','views'); //this is default, is not actually needed. It directs the 
//templating views to the views folder

const shopRoutes=require('./routes/shop')
const adminRoutes=require('./routes/admin')
const errorController=require('./controllers/404');
// const Cart = require("./models/cart");

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))

app.use((req,res,next)=>{
    User.findByPk(1)
        .then(user=>{
            req.user=user
            next()
        })
        .catch(err=>{
            console.log(err)
        })
})

// Middlewares, pointing to controllers
app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404)

// Database relations
Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'})
User.hasMany(Product)

User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product,{through:CartItem})
Product.belongsToMany(Cart,{through:CartItem})
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product,{through:OrderItem})
// Product.belongsToMany(Order,{through:OrderItem})

// Sync method: Looks all models defined and creates tables for them
let fetchedUser
sequelize
    // .sync({force:true}) //If execute this, all products are gone! 
    .sync() 
    .then(result=>{
        // console.log(result)
        return User.findByPk(1)
    })
    .then(user=>{
        fetchedUser=user
        if(!user){
            return User.create({name:'Luciano',email:'anemail@mail.com'})
        }else{
            // return Promise.resolve(user) Not needed, because when you return a object on a promise it's always converted to a promise
            return user
        }
    })
    .then(user=>{
        if(fetchedUser){
            return user.getCart()
        }   
        return user.createCart() 
    })
    .then(cart=>{
        app.listen(3000)
    })
    .catch(err=>{
        console.log(err)
    })