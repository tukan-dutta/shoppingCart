var express = require('express');
var router = express.Router();
var passport=require('passport');
var bcrypt=require('bcryptjs');

//var users model
var User=require('../models/user');

// Get register
router.get('/register',function(req,res){

    res.render('register',{
        title:'Register'
    }); 
});


// post register
router.post('/register',function(req,res){

    var name=req.body.name;
    var email=req.body.email;
    var username=req.body.username;
    var password=req.body.password;
    var password2 =req.body.password2;

    req.checkBody('name','Name is required !').not().isEmpty();
    req.checkBody('email','Email is required !').isEmail();
    req.checkBody('username','Username is required !').not().isEmpty();
    req.checkBody('password','Password is required !').not().isEmpty();
    req.checkBody('password2','Passwords do not match').equals(password);

    var errors=req.validationErrors();

    if(errors){
        res.render('register',{
            errors:errors,
            users:null,
            title:'Register'
        }); 
    }else{
        User.findOne({username:username},function(err,user){
            if(err)return console.log(err);
            if(user){
                req.flash('danger','Username exists choose another');
                res.redirect('/users/register');
            }
            else
            {
                var user=new User({ 
                    name:name,
                    email:email,
                    username:username,
                    password:password,
                    admin:0
                });

                bcrypt.genSalt(10, function(err,salt){
                        bcrypt.hash(user.password,salt,function(err,hash){
                            if(err)console.log(err);

                            user.password=hash;
                             
                            user.save(function(err){
                                if(err){
                                    console.log(err);
                                }
                                else
                                {
                                    req.flash('success','You are now registered');
                                    res.redirect('/users/login');
                                }
                            });
                        });
                });
            }

        })
    }



});

// Get login
router.get('/login',function(req,res){

    if(res.locals.users)res.redirect('/');

    else{
        res.render('login',{
            title:'Login'
        }); 
    }
    
});

// Post login
router.post('/login',function(req,res,next){

    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next); 
});

// Get logout
router.get('/logout',function(req,res){

    req.logout();

    req.flash('success', 'You are logged out');
    res.redirect('/users/login')
    
});




module.exports=router;