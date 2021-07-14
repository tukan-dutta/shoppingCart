var express = require('express');
var router = express.Router();

//var page model
var Page=require('../models/page');

// Get /
router.get('/',function(req,res){

    Page.findOne({slug:'home'},function(err,page){
        if(err) return console.log(err);
        
            res.render('index',{
                title:page.title,
                content : page.content
                
            }); 
        
    });
});

// get a page
router.get('/:slug',function(req,res){

    var slug=req.params.slug;

    Page.findOne({slug:slug},function(err,page){
        if(err) return console.log(err);
        if(!page){
            res.redirect('/');
        }else{
            res.render('index',{
                title:page.title,
                content : page.content
                
            }); 
        }
    });
});



module.exports=router;