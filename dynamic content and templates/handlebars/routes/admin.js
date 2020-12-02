const express =require('express')

const path=require('path')

const rootDir=require('../util/path');

const router=express.Router();

const products=[];

// admin/add-product 
router.get('/add-product',(req,res,next)=>{
    // console.log("Im in a middleware!")
    // res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add product</button></input></form>')
    // res.sendFile(path.join(rootDir,'views','add-product.html'))
    res.render("add-product",{
        pageTitle:"Add Products",
        path:"admin/add-product",
        activeProduct:true,
        productCSS:true
    })
}); 
 
// admin/product 
router.post('/add-product',(req,res,next)=>{
    console.log(req.body.title);
    products.push({title:req.body.title});
    res.redirect('/');
})

exports.routes=router;
exports.products=products;