const express=require('express')
const path=require('path')

const app=express()

const myRoutes=require('./routes/myRoutes')

app.use(myRoutes)
app.use(express.static(path.join(__dirname,'public')))

app.listen(3000,()=>{
    console.log("Server started")
})