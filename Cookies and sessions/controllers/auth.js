const User=require('../models/user')

exports.getLogin = (req, res, next) => {
    // const isLoggedIn=req.get('Cookie').split('=')[1]==='true'
    console.log(req.session.isLoggedIn)
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated:false
    });
};
  
exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie','loggedIn=true; Secure')
    User.findById('5fdd49fba1661c34dcf599f8')
    .then(user => {
        // req.session.userId=user._id
        req.session.user = user
        // req.session.user=user
        req.session.isLoggedIn=true
        req.session.save((err)=>{
            res.redirect('/')
        })
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err)=>{
        console.log(err)
        res.redirect('/')
    })
}