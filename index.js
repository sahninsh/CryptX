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
function lastLetter(str){
    return str[str.length-1]
}
// app.get('/levels/:level',ensureLoggedIn, function(req,res,next){
//     // res.send(req.params.level)
//     model.findById(req.id)
//         .then(function(item){
        
//             let object = JSON.parse(JSON.stringify(item.levels));
//             object.level1 = true;
//             object.level2 = true;
//             if(Object.keys(object).includes(req.params.level)){
//                 let number = parseInt(lastLetter(req.params.level))

//                 let previousLevelCleared = (object['level' + String(number-1)] === true)
//                 if(previousLevelCleared){
//                     res.render(__dirname + '/views/level' + String(number)  )
//                 }
//                 else {
//                     res.redirect('/levels/' + String(number-1))
//                 }
//             }
//         })
// })
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
            // res.send(item)

            let obj = JSON.parse(JSON.stringify(item.levels))
            
            let keys = Object.keys(obj);
            
            let level;
            for(let i = 0; i< keys.length; i+=1){
                if(obj[keys[i]] == false){
                    level = keys[i]
                    break;
                }
            }
            console.log(level)

            
            res.redirect('/levels/' + level)
        })  
        .catch(function(err){
            res.redirect('/login')
        })    
})


app.get('/levels/:level',ensureLoggedIn, function(req,res,next){
    model.findById(req.id)
        .then(function(item){
            let object = JSON.parse(JSON.stringify(item.levels));
            if(object[req.params.level] == true){
                res.redirect('/logic')
            }
            else{
                next();
            }
        })
},function(req,res,next){
    model.findById(req.id)
        .then(function(item){
            let userInfo = JSON.parse(JSON.stringify(item.levels));
            if(Object.keys(userInfo).includes(req.params.level) ){
                // for(let i =0; i < Object.keys(userInfo).length; i+=1){
                    if(parseInt(lastLetter(req.params.level)) == 1){
                        res.render('level1.ejs')
                    }
                    else{
                        let lastLevelPassed = 'level' + (parseInt(lastLetter(req.params.level)) - 1).toString();
                        console.log(userInfo[lastLevelPassed] === true)
                        if(userInfo[lastLevelPassed] === true){
                           res.render(req.params.level)
                        }
                        else {
                           res.redirect('/logic')
                        }
                    }
            }
            else {
                res.redirect('/404')
            }
        })
    // res.render(req.params.level)
})

// , function(req,res,next){
//     // if(req.params.level
//     model.findById(req.id)
//         .then(function(item){
//             if(Object.keys(item.levels).includes(req.params.level)){
//                 let previousLevel = 'level'+ (parseInt(lastLetter(req.params.level)) - 1).toString();
//                 console.log(previousLevel)
//                 if(item.levels[previousLevel] == true){
//                     next()
//                 }
//                 else {
//                     res.redirect('/logic')
//                 }
//             }
//         })
//         .catch(function(){
//             res.send('tum mein hee koi galti hein')
//         })
// }
// app.listen(80)

