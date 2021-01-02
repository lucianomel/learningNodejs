const user = require('../../Websockets/models/user')
const User=require('../models/user')
const bcrypt=require('bcryptjs')
const {default:validator} =require('validator')
const jwt=require('jsonwebtoken')
const Post=require('../models/post')
const {clearImage}=require('../util/file')

module.exports={
    createUser: async function({userInput},req){
        // const email=args.userInput.email
        // const email=userInput.email
        const errors=[]
        if(!validator.isEmail(userInput.email)){
            errors.push({message:'E-mail is invalid'})
        }
        if(validator.isEmpty(userInput.password)|| !validator.isLength(userInput.password,{min:5})){
            errors.push({message:'Password is not long enough'})
        }
        if(errors.length>0){
            const error=new Error('Invalid input')
            error.data=errors
            error.code=422
            throw error
        }
        const existingUser= await User.findOne({email:userInput.email})
        if(existingUser){
            const error=new Error('User already exists')
            throw error
        }
        const hashedPw= await bcrypt.hash(userInput.password,12)
        const user=new User({
            email:userInput.email,
            name:userInput.name,
            password:hashedPw
        })
        const createdUser=await user.save()
        return { ...createdUser._doc,_id:createdUser._id.toString()}
    },
    login:async function({email, password},req){
        const user=await User.findOne({email:email})
        if(!user){
            const error=new Error('No user with that email')
            error.code=401
            throw error
        }
        const doMatch= await bcrypt.compare(password,user.password)
        if(!doMatch){
            const error=new Error('Password Incorrect')
            error.code=401
            throw error
        }
        const token=jwt.sign({
            userId:user._id.toString(),
            email:user.email
        },'secretusedforsignandverify',
        {expiresIn:'1h'}
        )
        return {token:token,userId:user._id.toString()}
    },
    createPost:async function({postInput},req){
        if(!req.isAuth){
            const error=new Error('Not authenticated')
            error.code=401
            throw error
        }
        const errors=[]
        if(!validator.isLength(postInput.title,{min:5})){
            errors.push({message:'Post title is too short'})
        }
        if(!validator.isLength(postInput.content,{min:5})){
            errors.push({message:'Post content is too short'})
        }
        if(errors.length>0){
            const error=new Error('Invalid post input')
            error.data=errors
            error.code=422
            throw error
        }
        console.log("User id in request object, after auth func: ",req.userId)
        const user=await User.findById(req.userId)
        if(!user){
            const error= new Error('User not found')
            error.code=401
            throw error
        }
        let newPost=new Post({...postInput,creator:user})
        newPost=await newPost.save()
        //add post to user posts
        user.posts.push(newPost)
        await user.save()
        newPost.createdAt.toISOString()
        newPost._doc.createdAt=(new Date(newPost._doc.createdAt)).toISOString()
        newPost._doc.updatedAt=(new Date(newPost._doc.updatedAt)).toISOString()
        return newPost
    },
    getPosts:async function ({page},req){
        if(!req.isAuth){
            const error=new Error('Not authenticated')
            error.code=401
            throw error
        }
        const currentPage=page||1
        const perPage=2
        const posts=await Post.find().populate('creator').skip((currentPage-1)*perPage).limit(perPage).sort({createdAt:-1}) 
        const totalPosts=await Post.find().countDocuments()
        return {
            posts:posts.map(p=>{
            return {...p._doc,_id:p._id.toString(),createdAt:p.createdAt.toISOString(),updatedAt:p.updatedAt.toISOString()}}),
            totalPosts:totalPosts
        }
    },
    getUser:async function (_,req){
        if(!req.isAuth){
            const error=new Error('Not authenticated')
            error.code=401
            throw error
        }
        const user=await User.findById(req.userId)
        if(!user){
            const error= new Error('User not found')
            error.code=401
            throw error
        }
        user._doc._id=user._doc._id.toString()
        return user
    },
    updateStatus:async function({inputStatus},req){
        if(!req.isAuth){
            const error=new Error('Not authenticated')
            error.code=401
            throw error
        }
        const user=await User.findById(req.userId)
        if(!user){
            const error= new Error('User not found')
            error.code=401
            throw error
        }
        user.status=inputStatus
        try{
            await user.save()
        }catch(err){
            throw err
        }
        return true
    },
    getPost:async function({postId},req){
        if(!req.isAuth){
            const error=new Error('Not authenticated')
            error.code=401
            throw error
        }
        const post=await Post.findById(postId).populate('creator')
        if(!post){
            throw new Error('Post not found')
        }
        // if(post.creator._id.toString()!=req.userId){
        //     const error= new Error('User not authorized to view')
        //     error.code=404
        //     throw error
        // }
        return {
            ...post._doc,
            _id:post._doc._id.toString(),
            createdAt:post._doc.createdAt.toISOString()
        }
    },
    updatePost:async function({postId,postInput},req){
        if(!req.isAuth){
            const error=new Error('Not authenticated')
            error.code=401
            throw error
        }
        const post=await Post.findById(postId).populate('creator')
        if(!post){
            const error=new Error('Post not found')
            error=404
            throw error
        }
        if(post.creator._id.toString()!=req.userId){
            error=new Error('User not authorized')
            error.code=403
            throw error
        }
        const errors=[]
        if(!validator.isLength(postInput.title,{min:5})){
            errors.push({message:'Post title is too short'})
        }
        if(!validator.isLength(postInput.content,{min:5})){
            errors.push({message:'Post content is too short'})
        }
        if(errors.length>0){
            const error=new Error('Invalid post input')
            error.data=errors
            error.code=422
            throw error
        }
        post.title=postInput.title
        post.content=postInput.content
        if(postInput.imageUrl!='undefined'){
            post.imageUrl=postInput.imageUrl
        }
        const updatedPost=await post.save()
        return {...updatedPost._doc,_id:updatedPost._id.toString(),createdAt:updatedPost._doc.createdAt.toISOString(),updatedAt:updatedPost._doc.updatedAt.toISOString()}
    },
    deletePost:async function({postId},req){
        if(!req.isAuth){
            const error=new Error('Not authenticated')
            error.code=401
            throw error
        }
        const post=await Post.findById(postId)
        if(!post){
            const error=new Error('Post not found')
            error=404
            throw error
        }
        if(post.creator.toString()!=req.userId){
            const error=new Error('User not authorized to delete')
            error.code=403
            throw error
        }
        clearImage(post.imageUrl)
        await post.delete()
        const user= await User.findById(req.userId)
        if(!user){
            const error=new Error('User not found')
            error.code=404
            throw error
        }
        user.posts.pull(postId)
        await user.save()
        return post._id.toString()
    }
}