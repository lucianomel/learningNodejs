// const http= require("http");

const express=require("express"), bodyParser=require('body-parser'), path=require('path');
const expressHbs=require("express-handlebars")
const app=express();


app.set('view engine','ejs');
app.set('views','views'); //this is default, is not actually needed. It directs the 
//templating views to the views folder

const shopRoutes=require('./routes/shop')
const adminRoutes=require('./routes/admin')
const errorController=require('./controllers/404')
 
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404)

// app.use((req,res,next)=>{
//     console.log("Im in the middleware!")
//     next(); //Allows the request to continue to the next middleware in line
// });



// const server= http.createServer(app);

// server.listen(3000);

app.listen(3000)