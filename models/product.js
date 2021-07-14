var mongoose=require('mongoose');

var ProductSchema= mongoose.Schema({

    title: {
        type: String,
        required:true
    },

    slug: {
        type: String
        
    },
    image: {
        type: String
        
    },

    desc: {
        type: String,
        required:true
    },

    category: {
        type: String,
        required:true
    },

    price: {
        type: Number ,   
        required:true
    }

});

var Product=module.exports= mongoose.model('Product',ProductSchema);


 