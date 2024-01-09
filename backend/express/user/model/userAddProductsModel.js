const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    previousPrice: Number,
    image: String,
    description: String,
    category: String,
    sizes:[String],

},
{timestamps:true});

const Product = mongoose.model("Product", productSchema)
module.exports = Product;
