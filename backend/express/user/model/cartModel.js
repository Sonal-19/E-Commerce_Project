const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
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
            quantity: Number,    //     default: 1,
            size: {
                type: String,
                default: 'S', // Default size is 'S' if not specified
            },
        },
    ],
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;