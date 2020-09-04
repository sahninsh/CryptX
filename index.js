const express = require('express');

// require('dotenv').config();
// const { response } = require('express');
const morgan = require('morgan');
const {join} = require('path')
const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
app.set('view engine','ejs');
app.use(morgan('combined'))
app.use(express.static(join(__dirname,'static')))
app.use(express.json())
app.use(cookieParser())
let PORT = process.env.PORT || 3000
mongoose.connect('mongodb+srv://sahninsh:8baNEERqqjA8Oizd@cluster0.nnubt.mongodb.net/this', {useNewUrlParser: true,useUnifiedTopology:true})
    .then(() => {
        console.log('DB connected')
        app.listen(PORT, function(){
            console.log(`listening on port ${PORT.toString()}`)
        })
    })
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
    },
    levels : {
        level1 : {
            type : Boolean,
            default : false
        },
        level2 : {
            type : Boolean,
            default : false
        },
        level3 : {
            type : Boolean,
            default : false
        },
        level4 : {
            type : Boolean,
            default : false
        },
        level5 : {
            type : Boolean,
            default : false
        },
        level6 : {
            type : Boolean,
            default : false
        },
        level7 : {
            type : Boolean,
            default : false
        },
        level8 : {
            type : Boolean,
            default : false
        },
        level9 : {
            type : Boolean,
            default : false
        },
        level10 : {
            type : Boolean,
            default : false
        }
    }
}, {timestamps : true})
let model = mongoose.model('User', userSchema)

app.route('/')
    .get(function(req,res,next){
        // res.send('hello')
        res.render('index')
    })
app.route('/profile')
    .get(ensureLoggedIn, function(req,res,next){
        model.findById((req.id).toString())
            .then(function(item){
                if(item){
                    res.render('dashboard.ejs', {'user' : item})    
                }
                else {
                    res.send('yo')
                }
                
            })
            .catch(function(err){
                res.redirect('/login')
            })
    })
function ensureLoggedIn(req,res,next){
    // console.log(req.cookies.token)
    jwt.verify(req.cookies.token, 'secretkey', function(err,decoded){
        if(!Boolean(err)){
            // console.log(decoded);
            req.id = decoded.id;
            next();
        }
        else {
            // res.send('tum hee koi kharabi hein')
            res.redirect('/login')
        }
    })
    // res.send('hello')
}
app.get('/levels/:level', function(req,res,next){
    res.send(req.params.level)
})
app.route('/login')
    .get(function(req,res,next){
        res.render('login.ejs')
    })
    .post(function(req,res){
        console.log(req.body)
    
        model.find({email : req.body.email})
            .then(item => {
                let it = item.reverse()[0]
                console.log(item.reverse()[0])
                bcrypt.compare(req.body.password,it.password )
                    .then(function(match){
                        if(match){
                            jwt.sign(JSON.stringify({'id' : it._id}), 'secretkey', function(err,token){
                                if(!Boolean(err)){
                                    console.log(token)
                                    res.cookie('token', token)
                                    res.redirect('/profile');
                                    res.end();
                                }
                            })
                        }
                        else{ 
                            res.redirect('/login')
                        }
                    })
                    .catch(function(err){
                        console.log(err)
                    })
            })  
    })
app.route('/profile')
    .get(function(req,res,next){

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
                        password: hashedPassword,
                        
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

app.get('/logout', function(req,res,next){
    res.cookie('token', '')
    res.redirect('/')
})

app.get('/logic', ensureLoggedIn, function(req,res,next){
    model.findById(req.id)
        .then(function(item){
            let object = JSON.parse(JSON.stringify(item.levels));
            object.level1 = true
            
            let array = []
            for(let key in object){
                // console.log(key)
                array.push(object[key])
            }
            let everyItem = array.every(function(item){
                if(item === false){
                    return true;
                }
            })
            console.log(everyItem)
            let x = false;
            let y;
            for(let i =0; i < Object.values(object).length; i+=1){
                console.log(object[(Object.values(object))[i]])
                if(object[Object.values(object)[1]] === true){
                    if(i < 9){
                        y = (Object.values(object)[i+1])
                        x = true;
                        console.log(21)
                        break;
                    }
                }
            }
            
            if(Boolean(x)){
                let route = '/levels/' + y;
                console.log(route)
                res.redirect(route)
            }
            else {
                res.redirect('/levels/level1')
            }
        })   

})
// app.listen(80)

