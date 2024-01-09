const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },

            name: String,
            price:Number,
            previousPrice: Number,
            image:String,
        },
    ],
});


const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;