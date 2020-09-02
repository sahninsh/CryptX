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
// const userSchema =  new mongoose.Schema({
//     username : {
//         type : String,
//         required: true,
//     },
//     email : {
//         type : String,
//         required: true,
//     },
//     password : {
//         type : String,
//         required: true,
//     }
// }, {timestamps : true})
// let model = mongoose.model('User', userSchema)

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
    })


app.route('/register')
    .get(function(req,res,next){ 
        res.render('register.ejs')
    })
    .post(function(req,res,next){
        console.log(req.body)
        if(validator.isEmail(req.body.email) &&
        validator.isLength(req.body.password, {min : 8,max : undefined}))
        {   

            new model({
                username : req.body.username,
                email : req.body.email,
                
            })
        }
        res.send('hello')
    })

// app.listen(80)

