// const http= require("http");

const express=require("express"), path=require('path'), mongoose=require('mongoose')
const app=express();

// Mongo DB
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
    User.findById("5fdd49fba1661c34dcf599f8") 
    .then(user=>{
        req.user=user //This is a mongoose model
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
mongoose.connect('mongodb+srv://luciano:nTjBZ7K5Ac9ZPNAR@cluster0.zwd4t.mongodb.net/shop?retryWrites=true&w=majority')
.then(()=>{
    User.find()
    .then(user=>{
        if(user.length==0){
            const user=new User({
                name:"Luciano",
                email:"luciano@text.com",
                cart:{
                    items:[]
                }
            })
            return user.save()
        }else{
            return user
        }
    }) 
    .then(()=>{
        app.listen(3000)
    })   
})
.catch(err=>{
    console.log(err)
})

