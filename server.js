const express = require('express')
const {connectMongoose, User} = require('./database.js')
const asyncHandler = require('express-async-handler')
const ejs = require('ejs')
const passport = require('passport')
const {initializingPassport , isAuthenticated} = require('./passportConfig.js')
const expressSession = require('express-session')

//Connect to Database
connectMongoose()

initializingPassport(passport)

const app = express()

//middleware
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(expressSession({secret : 'secret', resave: false, saveUninitialized: false}))
app.use(passport.initialize())
app.use(passport.session())

//Setup View Engine
app.set('view engine', 'ejs')

//Routes
app.get('/',(req,res)=>{
    res.render('index')
})
app.get('/register',(req,res)=>{
    res.render('register')
})
app.get('/login',(req,res)=>{
    res.render('login')
})


app.post('/register',asyncHandler(async(req,res)=>{
    const user = await User.findOne({username : req.body.username})
    
    if(user) return res.status(400).send('User already exists')
    
    const newUser = await User.create(req.body)

    res.status(201).send(newUser)
       
}))

app.post('/login', passport.authenticate('local',{
    failureRedirect : '/register' , successRedirect : '/'
}))

app.get('/profile' , isAuthenticated, (req,res)=>{
    res.send(req.user)
})
app.get('/logout', function(req, res, next){
    req.logout((err)=> {
      if (err) { return next(err); }
      res.send('Logged out');
    });
  });

app.listen(3000, ()=>{
    console.log('Server Started')
})