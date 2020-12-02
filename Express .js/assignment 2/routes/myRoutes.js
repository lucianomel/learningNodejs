const express=require('express')
const path=require('path')
const route=express.Router()

const rootDir=require('../util/path');

route.get('/',(req,res)=>{
    res.sendFile(path.join(rootDir,'views','index.html'))
})
route.get('/users',(req,res)=>{
    res.sendFile(path.join(rootDir,'views','users.html'))
})
module.exports=route;