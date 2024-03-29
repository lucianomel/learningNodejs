const { urlencoded } = require('express');
const express=require('express')
const mongoose=require('mongoose')
const path=require('path')
const multer =require('multer')

const app=express()

const { v4: uuidv4 } = require('uuid');
 
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4()+'-'+file.originalname)
    }
});

const fileFilter=(req,file,cb)=>{
    if(file.mimetype=='image/png'||file.mimetype=='image/jpg'||file.mimetype=='image/jpeg'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

// app.use(express.urlencoded({ extended: false })); x-www-form-urlencoded <form>

app.use(express.json()) //application/json, parses incoming json data
app.use(multer({storage:storage,fileFilter:fileFilter}).single('image'))
app.use('/images',express.static(path.join(__dirname,'images')))
const feedRoutes=require('./routes/feed')
const authRoutes=require('./routes/auth')

// To avoid the CORS error
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use('/feed',feedRoutes)
app.use('/auth',authRoutes)

app.use((error,req,res,next)=>{
    console.log(error)
    const status=error.statusCode || 500
    const message=error.message
    const data=error.data
    res.status(status).json({message:message,data:data})
})

mongoose.connect('mongodb+srv://luciano:nTjBZ7K5Ac9ZPNAR@cluster0.zwd4t.mongodb.net/messages?retryWrites=true&w=majority')
.then(result=>{
    const server=app.listen(8080)
    const io=require('./socket').init(server)
    io.on('connection',socket=>{
        console.log('Client connected')
    })
})
.catch(err=> console.log(err))