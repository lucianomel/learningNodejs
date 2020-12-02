const express =require('express')

const path=require('path')

const rootDir=require('../util/path');

const router=express.Router();

// admin/add-product 
router.get('/add-product',(req,res,next)=>{
    // console.log("Im in a middleware!")
    // res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add product</button></input></form>')
    res.sendFile(path.join(rootDir,'views','add-product.html'))
}); 
 
// admin/product 
router.post('/add-product',(req,res,next)=>{
    console.log(req.body.title);
    res.redirect('/');
})

module.exports=router;
