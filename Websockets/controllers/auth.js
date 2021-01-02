const User=require('../models/user')
const {validationResult}=require('express-validator')

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

exports.signup=async (req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const error=new Error('validation failed')
        error.statusCode=422
        error.data=errors.array()
        throw error
    }
    const email=req.body.email
    const name=req.body.name
    const password=req.body.password
    try{
        const hashedPassword=await bcrypt.hash(password,12)
        const user=new User({
            email:email,
            name:name,
            password:hashedPassword
        })
        const newUser=await user.save()
        return res.status(201).json({message:'User created',userId:newUser._id})
    }catch(err){
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    }
}

exports.login=async (req,res,next)=>{
    const email=req.body.email
    const password=req.body.password
    try{
        const loadedUser=await User.findOne({email:email})
        if(!loadedUser){
            const error=new Error('A user with this email could not be found')
            error.statusCode=401
            throw error
        }
        const doMatch=await bcrypt.compare(password,loadedUser.password)
        if(!doMatch){
            const error=new Error('Password incorrect')
            error.statusCode=401
            throw error
        }
        const token=jwt.sign({email:loadedUser.email,userId:loadedUser._id.toString()},'theSecretKeyforenvvarshere',{expiresIn:'1h'})
        return res.status(200).json({token:token,userId:loadedUser._id.toString()})
    }catch(err){
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    }
}