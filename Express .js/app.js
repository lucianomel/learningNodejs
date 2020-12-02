// const http= require("http");

const express=require("express"), bodyParser=require('body-parser');

const app=express();

app.use(bodyParser.urlencoded({extended:false}))

// app.use((req,res,next)=>{
//     console.log("Im in the middleware!")
//     next(); //Allows the request to continue to the next middleware in line
// });
app.use('/',(req,res,next)=>{
    // console.log("This always runs")
    next();
});
app.use('/add-product',(req,res,next)=>{
    // console.log("Im in a middleware!")
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add product</button></input></form>')
});
app.post('/product',(req,res,next)=>{
    console.log(req.body.title);
    res.redirect('/');
})
app.use('/',(req,res,next)=>{
    // console.log("Im in another middleware!")
    res.send('<h1>Hello from express</h1>')
});

// const server= http.createServer(app);

// server.listen(3000);

app.listen(3000)