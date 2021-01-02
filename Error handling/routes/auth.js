const express = require('express');

const { check, body }=require('express-validator')

const User=require('../models/user')

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
[
    body('email')
    .normalizeEmail()
    .isEmail().withMessage('Please input a valid email')
    .custom((value,{req})=>{
        return User.findOne({email:value})
        .then(user=>{
          if(!user){
            return Promise.reject('Please enter a signed-up email')
          }else{
              req.user=user
          }
        })
    })
    ,
    body('password')
    .trim()
    .isLength({min:5,max:25}).withMessage('Password must be 5-25 characters long')
    .isAlphanumeric().withMessage('Password characters must be alphanumeric')
]
, authController.postLogin);

router.post('/signup',
    [   
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value,{req})=>{
            // if(value==='test@test.com'){
            //     throw new Error('This email address is forbidden')
            // }
            // return true
            return User.findOne({email:value})
            .then(userDoc=>{
                if(userDoc){
                return Promise.reject('Email exist already, please pick a different one')
                }
            })
            // .catch(err=>console.log(err)) VERY CAREFUL!!! THIS CATCHES THE ERROR SO IT IS LOGGED. YOU DON'T WANT TO DO TAHT BECAUSE IT WOULD NOT RETURN THE ERROR IN VALIDATION RESULTS IN THE NEXT MIDDLEWARE
        })
        .normalizeEmail()
    ,
    body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.'
    )
        .trim()
        .isLength({min:5,max:25})
        .isAlphanumeric()
    ,
    body('confirmPassword')
        .trim()
        .custom((value,{req})=>{
        if(value!==req.body.password){
            throw new Error('Passwords have to match')
        }
        return true
        })
    ],
    authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset',authController.getReset)

router.post('/reset',authController.postReset)

router.get('/reset/:token',authController.getNewPassword)

router.post('/new-password',authController.postNewPassword)

module.exports = router;