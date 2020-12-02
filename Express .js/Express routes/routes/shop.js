const express =require('express')

const path =require('path')

const rootDir=require('../util/path')

const router=express.Router();

router.get('/',(req,res,next)=>{
    // console.log("Im in another middleware!")
    // res.send('<h1>Hello from express</h1>')
    res.sendFile(path.join(rootDir,'views','shop.html'))
}); 
 
module.exports=router;
