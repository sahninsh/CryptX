const express = require('express');

// require('dotenv').config();
// const { response } = require('express');
const morgan = require('morgan');
const {join} = require('path')
const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
console.log(bcrypt)
const app = express();
app.set('view engine','ejs');
app.use(morgan('combined'))
app.use(express.static(join(__dirname,'static')))
app.use(express.json())
mongoose.connect('mongodb+srv://sahninsh:8baNEERqqjA8Oizd@cluster0.nnubt.mongodb.net/this', {useNewUrlParser: true,useUnifiedTopology:true})
    .then(() => app.listen(80))
    .catch(() => console.log('errr'))
const userSchema =  new mongoose.Schema({
    username : {
        type : String,
        required: true,
    },
    email : {
        type : String,
        required: true,
    },
    password : {
        type : String,
        required: true,
    }
}, {timestamps : true})
let model = mongoose.model('User', userSchema)

app.route('/')
    .get(function(req,res,next){
        // res.send('hello')
        res.render('index')
    })



app.route('/login')
    .get(function(req,res,next){
        res.render('login.ejs')
    })
    .post(function(req,res){
        console.log(req.body)
        res.send('hello')
        model.find({email : req.body.email})
            .then(item => {
                let it = item.reverse()[0]
                console.log(item.reverse()[0])
                bcrypt.compare(req.body.password,it.password )
                    .then(function(item){
                        console.log(item)
                    })
                // item.reverse()
            })
            
    })

function hashingPassword(password,cb){
    bcrypt.genSalt(8)
        .then(function(salt){
            bcrypt.hash(password, salt)
                .then(function(item){
                    cb(null,item)                    
                })
                .catch(function(err){
                    console.log(err)
                    cb(err,null)
                })
        })
        .catch(function(err){
            // console.log(err)
            cb(err,null)
        })

}
app.route('/register')
    .get(function(req,res,next){ 
        res.render('register.ejs')
    })
    .post(function(req,res,next){
        console.log(req.body)
        if(validator.isEmail(req.body.email) &&
        validator.isLength(req.body.password, {min : 8,max : undefined}))
        {   
            hashingPassword(req.body.password, function(err,hashedPassword){
                if(!(Boolean(err))){        
                    new model({
                        username : req.body.username,
                        email : req.body.email,
                        password: hashedPassword
                    })
                    .save()
                    .then(function(item){
                        res.redirect('/login')

                    })
                    .catch(function(err){
                        console.log(err)
                        next()
                    })

                }
            })
        }
     
    })

// app.listen(80)

