// const products=[];
const Product =require('../models/product')

exports.getAddProduct=(req,res,next)=>{
    // console.log("Im in a middleware!")
    // res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add product</button></input></form>')
    // res.sendFile(path.join(rootDir,'views','add-product.html'))
    res.render("add-product",{
        pageTitle:"Add Products",
        path:"admin/add-product",
        activeProduct:true,
        productCSS:true
    })
}
exports.postAddProduct=(req,res,next)=>{
    console.log(req.body.title);
    const product=new Product(req.body.title);
    product.save()
    // products.push({title:req.body.title});
    res.redirect('/');
}

exports.getProducts=(req,res,next)=>{
    // console.log("Im in another middleware!")
    // res.send('<h1>Hello from express</h1>')
    // console.log(adminData.products);
    // res.sendFile(path.join(rootDir,'views','shop.html'))
    // const products=adminData.products
    Product.fetchAll(products=>{
        res.render('shop',{
            prods:products,
            pageTitle:'Shop',
            path:"/",
            hasPoducts:products.length>0,
            activeShop:true,
            productCSS:true
        });
    })
}