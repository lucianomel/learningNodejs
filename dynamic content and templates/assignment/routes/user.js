const express=require('express')
const router=express.Router()
 
const users=[]

router.get('/add-name',(req,res)=>{
    res.render('inputUser',{pageTitle:"New User"})
})
router.post('/add-name',(req,res,next)=>{
    console.log(req.body.userName);
    users.push(req.body.userName)
    res.redirect('/users')
})
router.get('/',(req,res,next)=>{
    res.render('showUsers',{users:users,pageTitle:"Users"})
})

module.exports=router;