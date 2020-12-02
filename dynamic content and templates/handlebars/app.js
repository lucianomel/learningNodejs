// const http= require("http");

const express=require("express"), bodyParser=require('body-parser'), path=require('path');
const expressHbs=require("express-handlebars")
const app=express();


app.engine('hbs',expressHbs({layoutsDir:'views/layouts',defaultLayout:'main-layout',extname:'hbs'}))
app.set('view engine','hbs');
app.set('views','views'); //this is default, is not actually needed. It directs the 
//templating views to the views folder

const shopRoutes=require('./routes/shop')
const adminData=require('./routes/admin')

 
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))

app.use('/admin',adminData.routes);
app.use(shopRoutes);

app.use((req,res,next)=>{
    // res.status(404).send('<h1>Page not found</h1>');
    // res.status(404).sendFile(path.join(__dirname,'views','error-page.html'))
    res.status(404).render("404",{pageTitle:"Error page"})
})

// app.use((req,res,next)=>{
//     console.log("Im in the middleware!")
//     next(); //Allows the request to continue to the next middleware in line
// });



// const server= http.createServer(app);

// server.listen(3000);

app.listen(3000)