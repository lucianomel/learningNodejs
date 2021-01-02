const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session=require('express-session')
const MongoDbStore=require('connect-mongodb-session')(session)

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI='mongodb+srv://luciano:nTjBZ7K5Ac9ZPNAR@cluster0.zwd4t.mongodb.net/shop'

const app = express();
const store= new MongoDbStore({
  uri:MONGODB_URI,
  collection:'sessions',
  // Can add expire
})
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(
  {secret:'thisValueIsUsedToHashTheSessionCookie',resave:false,saveUninitialized:false,store:store}
  ))
app.use((req,res,next) =>{
  if(!req.session.user){
    return next()
  }
  User.findById(req.session.user._id)
  .then(user => {
      req.user= user
      next()
    })
  .catch(err => console.log(err));  
}
)
// app.use((req, res, next) => {
//   User.findById('5fdd49fba1661c34dcf599f8')
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err));
// });


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)

app.use(errorController.get404);


mongoose.connect(MONGODB_URI)
.then(()=>{
    User.find()
    .then(user=>{
        if(user.length==0){
            const user=new User({
                name:"Luciano",
                email:"luciano@text.com",
                cart:{
                    items:[]
                }
            })
            return user.save()
        }else{
            return user
        }
    }) 
    .then(()=>{
        app.listen(3000)
    })   
})
  .catch(err => {
    console.log(err);
  });
