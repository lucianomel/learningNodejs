// const {Product}=require('../models/product')
const Cart=require('../models/cart')
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
    console.log(req.body.title);
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const description=req.body.description;
    const price=req.body.price;
    req.user
        .createProduct({
            title:title,
            price:price,
            imageUrl:imageUrl,
            description:description,
            // userId:req.user.id This is created by sequelize
        })
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
    req.user
        .getProducts({where:{id:req.params.productId}})
    // Product.findByPk(req.params.productId) This is replaced by the line above, which also filters by user
    // .then(product=>{
    .then(([product])=>{
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
    Product.findByPk(req.body.id)
    .then(product=>{
        product.title=updatedTitle
        product.imageUrl=updatedimageUrl
        product.description=updatedDescription
        product.price=updatedPrice
        return product.save()
    })
    .then(result=>{
        console.log('Updated product!')
        res.redirect('/admin/products')
    })
    .catch(err=>{
        console.log(err)
    })
}
exports.getAdminProducts=(req,res)=>{
    // Product.findAll()
    req.user
        .getProducts()
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
    // let prodPrice=req.body.price
    console.log(prodId)
    let productToDelete;
    Product.findByPk(prodId)
    .then(product=>{
        productToDelete=product
        return product.destroy()
    })
    .then(result=>{
        console.log(`Product ${productToDelete.title} deleted`)
        res.redirect('/admin/products')
    })
    .catch(err=>{
        console.log(err)
    })
}
