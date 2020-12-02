const express =require('express'), path=require('path')
const app=express()

// const bodyParser=require('body-parser')

const userRoutes=require('./routes/user')

app.set('view engine','ejs')

app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:false}))

app.use('/users',userRoutes)

app.listen(3000,()=>{
    console.log('server started')
})
