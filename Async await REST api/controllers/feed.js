const {validationResult}=require('express-validator')
const fs=require('fs')
const path=require('path')
const Post=require('../models/post')
const User=require('../models/user')

exports.getPosts=async (req,res,next)=>{  
    const currentPage=req.query.page||1
    const perPage=2
    try{
        const totalItems= await Post.find().countDocuments()
        const posts= await Post.find().skip((currentPage-1)*perPage).limit(perPage).populate('creator')   
        res.status(200)
             .json({messsage:'Fetched posts succesfull',posts:posts,totalItems:totalItems})
    }catch(err){
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    }
}
exports.createPost =async (req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const error=new Error('Validation failed, data entered is incorrect')
        error.statusCode=422
        throw error
        // return res.status(422).json({message:'Validation failed',errors:errors.array()})
    }
    if(!req.file){
        const error=new Error('No image provided')
        error.statusCode=422
        throw error
    }
    const imageUrl = req.file.path.replace("\\" ,"/");
    const title=req.body.title
    const content=req.body.content
    // Create post in DB
    const post=new Post({
        title:title,
        content:content,
        imageUrl:imageUrl,
        creator:req.userId
    })
    try{
        await post.save()
        const creator= await User.findById(req.userId.toString())
        creator.posts.push(post)
        await creator.save()
        return res.status(201).json({
            message:'Post created succesfully',
            post:post,
            creator:{
                _id:creator._id,
                name:creator.name
            }
        })
    }catch(err){
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    }        
}

exports.getPost=async (req,res,next)=>{
    const postId=req.params.postId
    try{
        const post=await Post.findById(postId)
        if(!post){
            const error= new Error('No post found')
            error.statusCode=404
            throw error
        }
        return res.status(200).json({message:'Post fetched',post:post})
    }catch(err){
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    }
}

exports.updatePost=async(req,res,next)=>{
    const postId=req.params.postId
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const error=new Error('Validation failed, data entered is incorrect')
        error.statusCode=422
        throw error
        // return res.status(422).json({message:'Validation failed',errors:errors.array()})
    }
    const title=req.body.title
    const content=req.body.content
    let imageUrl=req.body.image
    if(req.file){
        imageUrl = req.file.path.replace("\\","/");
    }
    if(!imageUrl){
        const error=new Error('No file picked')
        error.statusCode=422
        throw error
    }
    try{
        const post=await Post.findById(postId)
        if(!post){
            const error= new Error('No post found')
            error.statusCode=404
            throw error
        }
        if(post.creator.toString()!=req.userId){
            const error=new Error('User not authorized')
            error.statusCode=403
            throw error
        }
        if(imageUrl!=post.imageUrl){
            clearImage(post.imageUrl)
        }
        post.title=title
        post.imageUrl=imageUrl
        post.content=content
        const newPost=await post.save()
        return res.status(200).json({message:'Post updated',post:newPost})
    }catch(err){
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    }
}

exports.deletePost=async (req,res,next)=>{
    const postId=req.params.postId
    try{
        const post=await Post.findById(postId)
        if(!post){
            const error= new Error('No post found')
            error.statusCode=404
            throw error
        }
        if(post.creator.toString()!=req.userId){
            const error=new Error('User not authorized')
            error.statusCode=403
            throw error
        }
        //Check loged in user
        clearImage(post.imageUrl)
        await Post.findByIdAndDelete(postId)
        const user= await User.findById(req.userId)
        user.posts.pull(postId)
        await user.save()
        return res.status(200).json({message:'Deleted post'})
    }catch(err){
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    }
}

exports.getStatus=async (req,res,next)=>{
    try{
        const user = await User.findById(req.userId)
        if(!user){
            const error=new Error('No user found')
            error.statusCode=500
            throw error
        }
        const status=user.status
        return res.status(200).json({status:status})
    }catch(err){
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    }
}

exports.updateStatus=async (req,res,next)=>{
    const status=req.body.status
    try{
        const user= await User.findById(req.userId)
        if(!user){
            const error=new Error('No user found')
            error.statusCode=500
            throw error
        }
        user.status=status
        await user.save()
        return res.status(200).json({message:'Status changed succesfully'})
    }catch(err){
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    }
}

const clearImage= filePath=>{
    filePath=path.join(__dirname,'..',filePath)
    fs.unlink(filePath,err=>console.log(err))
}

// html file
/* <button id="get">Get Posts</button>
<button id="post">Create a Post</button> */
// js file
// const getBtn=document.getElementById('get')
// const postBtn=document.getElementById('post')

// getBtn.addEventListener('click',(e)=>{
//   fetch('http://localhost:8080/feed/posts')
//   .then(res=>{
//     return res.json()
//   })
//   .then(resData=>{
//     console.log(resData)
//   })
//   .catch(err=>{
//     console.log(err)
//   })
// })
// postBtn.addEventListener('click',e=>{
//   fetch('http://localhost:8080/feed/posts',{
//     method:'POST',
//     body:JSON.stringify({
//       title:'A Codepen post',
//       content:'Created by codepen'
//     }),
//     headers:{
//       'Content-Type':'application/json'
//     }
//   })
//   .then(res=>{
//     return res.json()
//   })
//   .then(resData=>{
//     console.log(resData)
//   })
//   .catch(err=>{
//     console.log(err)
//   })
// })