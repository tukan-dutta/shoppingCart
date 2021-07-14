var express = require('express');
const Category = require('../models/category');
var router = express.Router();
var auth = require('../config/auth');
var isAdmin= auth.isAdmin;

//var category model
var Page=require('../models/category');

//get category index
router.get('/',isAdmin,function(req,res){
    Category.find(function(err,categories){

        if(err)return console.log(err);
        res.render('admin/categories',{
            categories:categories 
        });
    });

});

//get add category

router.get('/add-category',isAdmin,function(req,res){
    var title= ""; 

    res.render('admin/add_category',{
        title:title,
    });

});



//post add category

router.post('/add-category',function(req,res){

    req.checkBody('title','Title must have a value').not().isEmpty(); 

    var title=req.body.title;
    var slug=title.replace(/\s+/g,'-').toLowerCase();

    var errors=req.validationErrors();
    if(errors)
    {
        res.render('admin/add_category',{
            errors:errors,
            title:title,
        });

        console.log('UnSuccess');
        
    }
    else
    {
        // console.log('Success');

        Category.findOne({slug:slug}, function(err, category){
            if(category)
            {
                // console.log("duplicate");
                req.flash('danger','Category title exists choose another');
                res.render('admin/add_category',{
                    title:title,
            
                });
            }
            else
            {
                // console.log("not dup duplicate");
                var category = new Category({
                    title:title,
                    slug:slug,
                   
                });

                category.save(function(err){
                    if(err)
                    {
                        return console.log(err);
                    }

                    Category.find(function(err,categories) {
                        if(err){
                          console.log(err);
                        }
                        else
                        {
                          req.app.locals.categories=categories;
                        }
                      });

                    req.flash('success','Category Added !');
                    res.redirect('/admin/categories');
                });
            }
        });

    }

});




//get edit category

router.get('/edit-category/:id',isAdmin,function(req,res){
    
    Category.findById(req.params.id,function(err,category){
         if(err)console.log(err);

         res.render('admin/edit_category',{
            title:category.title,
            id:category._id
         });
    });

});


//post edit category

router.post('/edit-category/:id',function(req,res){

    req.checkBody('title','Title must have a value').not().isEmpty(); 

    var title=req.body.title;
    var slug=title.replace(/\s+/g,'-').toLowerCase(); 
    var id=req.params.id;

    var errors=req.validationErrors();

    console.log('run');
    if(errors)
    {
        res.render('admin/edit_category',{
            errors:errors,
            title:title,
            id:id
        });

        console.log('UnSuccess');
        
    }
    else
    {
        // console.log('Success');

        Category.findOne({slug:slug , _id: {'$ne':id }}, function(err, category){
            if(category)
            {
                // console.log("duplicate");
                req.flash('danger','Category slug exists choose another');
                res.render('admin/edit_category',{
                    title:title,
                    id:id 
                });
            }
            else
            {
                // console.log("not dup duplicate");
              
                Category.findById(id, function(err,category){
                    if(err)return console.log(err);

                    category.title=title;
                    category.slug=slug;

                    category.save(function(err){
                        if(err)
                        {
                            return console.log(err);
                        }

                        Category.find(function(err,categories) {
                            if(err){
                              console.log(err);
                            }
                            else
                            {
                              req.app.locals.categories=categories;
                            }
                          });
    
                        req.flash('success','Category Edited !');
                        // console.log(req.flash('success'));
                        res.redirect('/admin/categories/edit-category/'+id);
                    }); 

                });

               
            }
        });

    }

});

//get delete category
router.get('/delete-category/:id', isAdmin,function(req,res){
    Category.findByIdAndRemove( req.params.id, function(err){
        if(err) return console.log(err);

        Category.find(function(err,categories) {
            if(err){
              console.log(err);
            }
            else
            {
              req.app.locals.categories=categories;
            }
          });
        req.flash('success','Category Deleted !');
        res.redirect('/admin/categories/');
    });
  
});

module.exports=router;