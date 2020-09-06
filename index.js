const express = require('express');
const morgan = require('morgan');
const {join} = require('path')
const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
app.set('view engine','ejs');
app.use(morgan('dev'))
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
    },
    answers : {
        level1 : {
            type : String,
            default : '$2y$08$DE2DuVYB4gPib6Pc6x1N.OTEJK6CKn8Hm.9QjrQyoT8/yYxB9ylFC'
        },
        level2 : {
            type : String,
            default : '$2y$08$DE2DuVYB4gPib6Pc6x1N.OTEJK6CKn8Hm.9QjrQyoT8/yYxB9ylFC'
        },
        level3 : {
            type : String,
            default : '$2y$08$DE2DuVYB4gPib6Pc6x1N.OTEJK6CKn8Hm.9QjrQyoT8/yYxB9ylFC'
        },
        level4 : {
            type : String,
            default : '$2y$08$DE2DuVYB4gPib6Pc6x1N.OTEJK6CKn8Hm.9QjrQyoT8/yYxB9ylFC'
        },
        level5 : {
            type : String,
            default : '$2y$08$DE2DuVYB4gPib6Pc6x1N.OTEJK6CKn8Hm.9QjrQyoT8/yYxB9ylFC'
        },
        level6 : {
            type : String,
            default : '$2y$08$DE2DuVYB4gPib6Pc6x1N.OTEJK6CKn8Hm.9QjrQyoT8/yYxB9ylFC'
        },
        level7 : {
            type : String,
            default : '$2y$08$DE2DuVYB4gPib6Pc6x1N.OTEJK6CKn8Hm.9QjrQyoT8/yYxB9ylFC'
        },
        level8 : {
            type : String,
            default : '$2y$08$DE2DuVYB4gPib6Pc6x1N.OTEJK6CKn8Hm.9QjrQyoT8/yYxB9ylFC'
        },
        level9 : {
            type : String,
            default : '$2y$08$DE2DuVYB4gPib6Pc6x1N.OTEJK6CKn8Hm.9QjrQyoT8/yYxB9ylFC'
        },
        level10 : {
            type : String,
            default : '$2y$08$DE2DuVYB4gPib6Pc6x1N.OTEJK6CKn8Hm.9QjrQyoT8/yYxB9ylFC'
        }
    }
}, {timestamps : true})
let answerModel = mongoose.model('answer', {answer1 : String})
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
            console.log('tum hee koi kharabi hein')
            res.redirect('/login')
        }
    })
    // res.send('hello')
}
// function lastLetter(str){
//     // return str[str.length-1]
//     let i = 0;
//     let number = '';
//     while( i < str.length){
//         if(Boolean(Number(str[i]))){
            
//             number = number + str[i]
//         }
//         i= i+1
//     }
//     return number
// }


function lastLetter(str){
    let i =0;
    let number = ''
    while( i < str.length){
        
        if(parseInt(str[i]) != NaN){
            number = number + str[i]
        }
        i+=1
    }
    return number;
}

// console.log(lastLetter('level10'))

app.route('/login')
    .get(isLoggedIn,function(req,res,next){
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
                        res.send('error')
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
    .get(isLoggedIn,function(req,res,next){ 
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
    console.log('yes')
    model.findById(req.id)
        .then(function(item){
            // res.send(item)

            let obj = JSON.parse(JSON.stringify(item.levels))
            
            let keys = Object.keys(obj);
            
            let level;
            for(let i = 0; i< keys.length; i+=1){
                
                console.log(obj[keys[i]] + 'yoyoyo')
                if(obj[keys[i]] == false){
                    level = keys[i]
                    break;
                }
            }
            console.log(level + 'nskalns')

            if(level){
                res.redirect('/levels/' + level)
            }
            else {
                res.redirect('/leaderboard')
            }
        })  
        .catch(function(err){
            res.redirect('/login')
        })    
})
function lastAlgo(str){
    // let i = 0;
    return str[str.length -1]
}
function isLoggedIn(req,res,next){
    jwt.verify(req.cookies.token , 'secretkey', function(err, token){
        if(!err){
            res.redirect('/profile')
        }
        else {
            next();
        }

    })
}


// isLoggedIn({cookies : {token : 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjVmNTQyMDQwMGU4OTE2NTk5NGQ0Mzk0YiJ9.8ydrl3Dt5ScfFk_CEhjFhlSauhsVr9TH8MK4UsP04sI'}})
// isLoggedIn({name : 'ANsh', cookies : {token : '123'}})
app.get('/levels/:level',ensureLoggedIn, function(req,res,next){
    model.findById(req.id)
        .then(function(item){
            let object = JSON.parse(JSON.stringify(item.levels));
            if(object[req.params.level] == true){
                res.redirect('/logic')
            }
            else{
                console.log('next')
                next();
            }
        })
},function(req,res,next){
    model.findById(req.id)
        .then(function(item){
            let userInfo = JSON.parse(JSON.stringify(item.levels));
            // console.log(userInfo)
            console.log('before if stateemt')
            if(Object.keys(userInfo).includes(req.params.level) ){
                console.log(parseInt(lastLetter(req.params.level)), 12345678 )
                    if(parseInt(lastAlgo(req.params.level)) == 1){
                        res.render('level1.ejs')
                    }
                    else{
                        let lastLevelPassed = 'level' + (parseInt(lastLetter(req.params.level)) - 1).toString();
                        // console.log(lastLevelPassed)
                        if(userInfo[lastLevelPassed] === true){
                            console.log('debugging')
                           res.render(req.params.level)


                        }
                        else {
                           res.redirect('/logic')
                        }
                    }
            }
            else {
                res.redirect('/fourofour')
            }
        })
    
})
app.post('/levels/:level', ensureLoggedIn, function(req,res,next){
      model.findById(req.id)
        .then((item) => {
            console.log(12)
            let object = JSON.parse(JSON.stringify(item.levels));
            // console.log(object.answers)
            bcrypt.compare(req.body.answer, item.answers[req.params.level])
                .then(function(compare){
                    if(compare){
                        object[req.params.level] = true
                        model.findByIdAndUpdate(req.id , {levels : object})
                            .then(function(item){
                                res.redirect('/logic')
                            })
                    }
                })          
                .catch(function(){
                    console.log('error')
                })  
        }) 
})

app.get('/leaderboard', function(req,res,next){
    models.find()
        .then(function(item){
            console.log(item)
        })
})
app.get('/fourofour', function(req,res,next){
    res.send(  '<b>404</b>' )
})

app.use('/', function(req,res,next){
    res.redirect('/fourofour')
})

