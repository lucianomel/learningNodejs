const express=require('express')

const app=express();

// app.use('/',(req,res,next)=>{
//     console.log("Hello from app.js")
//     next()
// })
// app.use('/',(req,res,next)=>{
//     console.log("Hello again from app.js")
//     res.send("<h1>I'm in the second middleware</h1>")
// }) 

// app.use('/users',(req,res,next)=>{
//     console.log("From /users");
//     res.send("<h1>from /users</h1>");
// });

// app.use('/',(req,res,next)=>{
//     console.log("from /");
//     res.send("<h1>from '/' </h1>");
// });
app.get('/users',(req,res,next)=>{
    console.log("From /users");
    res.send("<h1>from /users</h1>");
})
app.get('/',(req,res,next)=>{
    console.log("from /");
    res.send("<h1>from '/' </h1>");
})


app.listen(3000);