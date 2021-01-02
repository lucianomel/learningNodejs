const express=require('express')
const {body}=require('express-validator')
const { route } = require('../../Mongoose/routes/shop')

const feedController=require('../controllers/feed')
const isAuth=require('../middleware/is-auth')

const router=express.Router()

// GET => /feed/posts
router.get('/posts',isAuth,feedController.getPosts)

// POST => /feed/posts
router.post('/posts',[
    body('title')
    .trim()
    .isLength({min:5}),
    body('content')
    .trim()
    .isLength({min:5})
],isAuth,feedController.createPost)

router.get('/post/:postId',isAuth,feedController.getPost)

router.put('/post/:postId',isAuth,[
    body('title')
    .trim()
    .isLength({min:5}),
    body('content')
    .trim()
    .isLength({min:5})
],feedController.updatePost)

router.delete('/post/:postId',isAuth,feedController.deletePost)

router.get('/status',isAuth,feedController.getStatus)

router.put('/status',isAuth,[
    body('status')
    .trim()
    .not().isEmpty()
],feedController.updateStatus)

module.exports=router