// const products=[];
// const { findById } = require('../models/product');
const Product =require('../models/product')
const Cart=require('../models/cart')

exports.getAddProduct=(req,res,next)=>{
    // console.log("Im in a middleware!")
    // res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add product</button></input></form>')
    // res.sendFile(path.join(rootDir,'views','add-product.html'))
    res.render("admin/edit-product",{
        pageTitle:"Add Products",
        path:"/admin/add-product",
        editing:false
    })
}
exports.postAddProduct=(req,res,next)=>{
    console.log(req.body.title);
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const description=req.body.description;
    const price=req.body.price;
    const product=new Product(null,title,imageUrl,description,price);
    product.save()
    // products.push({title:req.body.title});
    res.redirect('/');
}
exports.getEditProduct=(req,res)=>{
    const editMode =req.query.edit =='true'  
    if(!editMode){
        return res.redirect('/')
    }
    Product.findById(req.params.productId,product=>{
        if(!product){
            return res.redirect('/')
        }
        res.render('admin/edit-product',{
            pageTitle:"Edit Products",
            path:"/admin/edit-product",
            editing:editMode,
            product:product})
    })
}
exports.putEditProduct=(req,res)=>{
    // const updateProduct=req.body
    console.log('In put controller')
    // console.log(JSON.stringify(req.body)) 
    const updateProduct=new Product(req.body.id,req.body.title,req.body.imageUrl,req.body.description,req.body.price)
    updateProduct.save(()=>{
        res.redirect('/admin/products')
    })
    // let err=Product.updateProduct(updateProduct)
    // if(!err){
    //     res.redirect('/')
    // }else{
    //     //Not succesfully updated
    //     console.log(err)
    // }
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
exports.postDeleteProduct=(req,res)=>{
    let prodId=req.body.id
    let prodPrice=req.body.price
    console.log(prodId)
    Product.delete(prodId,(productDeleted)=>{
        console.log(`Product ${productDeleted.title} deleted`)
        res.redirect('/admin/products')}
        )
    // Cart.deleteProduct(prodId,id=>{
    //     Product.delete(id,()=>{
    //         res.redirect('/admin/products')
    //     })
    // })
}
