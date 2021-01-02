// const {Product}=require('../models/product')
// const Cart=require('../models/cart')
// import {Product} from '../models/product'
const Product=require('../models/product')

exports.getAddProduct=(req,res,next)=>{
    res.render("admin/edit-product",{
        pageTitle:"Add Products",
        path:"/admin/add-product",
        editing:false
    })
}
exports.postAddProduct=(req,res,next)=>{
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const description=req.body.description;
    const price=req.body.price;
    const product=new Product(title,price,description,imageUrl,null,req.user._id)
    product.save()
        .then(result=>{
            console.log('Product created in DB!')
            res.redirect('/admin/products')
        })
        .catch(err=>console.log(err))
}
exports.getEditProduct=(req,res)=>{
    const editMode =req.query.edit =='true'  
    if(!editMode){
        return res.redirect('/')
    }
    Product.fetchById(req.params.productId)
    .then(product=>{
        if(!product){
            return res.redirect('/')
        }
        res.render('admin/edit-product',{
            pageTitle:"Edit Products",
            path:"/admin/edit-product",
            editing:editMode,
            product:product
        })
    })
    .catch(err=>{
        console.log(err)
    })
}
exports.putEditProduct=(req,res)=>{
    console.log('In put controller')
    const id=req.body.id
    const updatedTitle=req.body.title
    const updatedimageUrl=req.body.imageUrl
    const updatedDescription=req.body.description
    const updatedPrice=req.body.price
    const newProduct=new Product(updatedTitle,updatedPrice,updatedDescription,updatedimageUrl,id)
    newProduct.save()
    .then(result=>{
        console.log('Updated product!')
        res.redirect('/admin/products')
    })
    .catch(err=>{
        console.log(err)
    })
}
exports.getAdminProducts=(req,res)=>{
    Product.fetchAll()
    .then(products=>{ 
        res.render('admin/products',{
            prods:products,
            pageTitle:'Admin Products',
            path:"/admin/products"
        })
    })
    .catch(err=>{
        console.log(err)
    })
}
exports.postDeleteProduct=(req,res)=>{
    let prodId=req.body.id
    Product.deleteById(prodId)
    .then(()=>{
        console.log(`Product deleted`)
        res.redirect('/admin/products')
    })
    .catch(err=>{
        console.log(err)
    })
}