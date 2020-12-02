// const products=[];
const Product =require('../models/product')

exports.getAddProduct=(req,res,next)=>{
    // console.log("Im in a middleware!")
    // res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add product</button></input></form>')
    // res.sendFile(path.join(rootDir,'views','add-product.html'))
    res.render("admin/add-product",{
        pageTitle:"Add Products",
        path:"admin/add-product",
        activeProduct:true,
        productCSS:true
    })
}
exports.postAddProduct=(req,res,next)=>{
    console.log(req.body.title);
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const description=req.body.description;
    const price=req.body.price;
    const product=new Product(title,imageUrl,description,price);
    product.save()
    // products.push({title:req.body.title});
    res.redirect('/');
}
exports.getAdminProducts=(req,res)=>{
    Product.fetchAll(products=>{
        res.render('admin/products',{
            prods:products,
            pageTitle:'Admin Products',
            path:"/admin/products"
        });
    })
}
exports.getEditProduct=(req,res)=>{
    res.render('admin/edit-product')
}