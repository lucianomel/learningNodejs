const User = require('../models/user');

const bcryptjs =require('bcryptjs')
const sgMail=require('@sendgrid/mail')
const crypto=require('crypto')
const { validationResult }=require('express-validator')


const API_KEY='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'

sgMail.setApiKey(API_KEY)

exports.getLogin = (req, res, next) => {
  let message=req.flash('error')
  if(message.length>0){
    message=message[0]
  }else{
    message=null
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage:message,
    oldInput:{
      email:'',
      password:''
    },
    validationErrors:[]
  });
};

exports.getSignup = (req, res, next) => {
  let message=req.flash('error')
  if(message.length>0){
    message=message[0]
  }else{
    message=null
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage:message,
    oldInput:{
      email:'',
      password:'',
      confirmPassword:''
    },
    validationErrors:[]
  });
};

exports.postLogin = (req, res, next) => {
  const email=req.body.email
  const password=req.body.password
  const errors=validationResult(req)
  if(!errors.isEmpty()){
    return res.status(422).render('auth/login',{
      path: '/login',
      pageTitle: 'Login Error',
      errorMessage:errors.array()[0].msg,
      oldInput:{
        email:email,
        password:password
      },
      validationErrors:errors.array()
    })
  }
  bcryptjs.compare(password,req.user.password)
  .then(doMatch=>{
    if(doMatch){
      req.session.isLoggedIn = true;
      req.session.user = req.user;
      return req.session.save(err => {
        console.log(err);
        res.redirect('/')
      });
    }
    return res.status(401).render('auth/login',{
      path: '/login',
      pageTitle: 'Login Error',
      errorMessage:"invalid password",
      oldInput:{
        email:email,
        password:''
      },
      validationErrors:errors.array()
    })
    // req.flash('error','invalid password')
    // return res.redirect('/login')
  })
  .catch(err=>{
    res.redirect('/login')
  })
};

exports.postSignup = (req, res, next) => {
  const email=req.body.email
  const password=req.body.password
  const errors=validationResult(req)
  if(!errors.isEmpty()){
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage:errors.array()[0].msg,
      oldInput:{
        email:email,
        password:password,
        confirmPassword:req.body.confirmPassword
      },
      validationErrors:errors.array()
    });
  }
  bcryptjs.hash(password,12)
    .then(hashedPassword=>{
      const user =new User({
        email:email,
        password:hashedPassword,
        cart:{items:[]}
      })
      return user.save()
    })
    .then(()=>{
      res.redirect('/login')
// https://www.youtube.com/watch?v=qFDgH6dHRA4 How to send emails using Sendgrid (Twilio) and NodeJS
      const message={
        to:email,
        // to: arrayEmails,
        from:{
          email:'test_96_node@hotmail.com',
          name:'Node app' //sender name
        },
        subject:'Sing up succesfull',
        html:'<h1>Thank you for subscribing</h1>'
      }
      return sgMail.send(message)
      .then(result=>console.log('Email sent'))
      .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset=(req, res, next) => {
  let message=req.flash('error')
  if(message.length>0){
    message=message[0]
  }else{
    message=null
  }
  res.render('auth/reset',{
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage:message
  })
};

exports.postReset=(req, res, next) => {
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      console.log(err)
      return res.redirect('/reset')
    }
    const token=buffer.toString('hex')
    console.log(req.body.email)
    User.findOne({email:req.body.email})
    .then(user=>{
      if(!user){
        req.flash('error','No account with that email found')
        return res.redirect('/reset')
      }
      user.resetToken=token
      user.resetTokenExpiration=Date.now()+ 1000*60*60;
      return user.save()
    })
    .then(()=>{
      res.redirect('/')
      const message={
        to:req.body.email,
        from:{
          email:'test_96_node@hotmail.com',
          name:'Node app' //sender name
        },
        subject:'Reset password',
        html:`
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
        `
      }
      return sgMail.send(message)
      .then(result=>console.log('Password reset email sent'))
      .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
  })
};

exports.getNewPassword=(req, res, next) => {
  const tokenRecieved=req.params.token
  User.findOne({resetToken:tokenRecieved,resetTokenExpiration:{$gt: Date.now()}})
  .then(user=>{
    let message=req.flash('error')
    if(message.length>0){
      message=message[0]
    }else{
      message=null
    }
    res.render('auth/new-password',{
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage:message,
      userId:user._id.toString(),
      passwordToken:tokenRecieved
    })
  })
  .catch(err=>console.log(err))
}

exports.postNewPassword=(req, res, next) => {
  const newPassword=req.body.password
  const userId=req.body.userId
  const passwordToken=req.body.passwordToken
  let resetUser
  User.findOne({resetToken:passwordToken,resetTokenExpiration:{$gt:Date.now()},_id:userId})
  .then(user=>{
    resetUser=user
    return bcryptjs.hash(newPassword,12)
  })
  .then(hashedPassword=>{
    resetUser.password=hashedPassword
    resetUser.resetToken=undefined
    resetUser.resetTokenExpiration=undefined
    return resetUser.save()
  })
  .then(result=>{
    res.redirect('/login')
  })
  .catch(err=>console.log(err))
}