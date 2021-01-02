// const http= require("http");

const express=require("express"), path=require('path');
const app=express();

// Mongo DB
const mongoConnect=require('./util/database').mongoConnect
const User=require('./models/user')

app.set('view engine','ejs');
app.set('views','views'); //this is default, is not actually needed. It directs the 
//templating views to the views folder

const shopRoutes=require('./routes/shop')
const adminRoutes=require('./routes/admin')
const errorController=require('./controllers/404');

app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))

// Connect user
app.use((req,res,next)=>{
    User.findById("5fda7f9470732ae21e99e751")
    .then(user=>{
        req.user=new User (user.name,user.email,user.cart,user._id)
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

// Mongo DB connection
mongoConnect(()=>{
    app.listen(3000)
})

