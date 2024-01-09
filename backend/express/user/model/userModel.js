const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    contact: Number,
    email: String,
    password: String,
    otp:String,
    verified: {type:Boolean, default:false},
    token: String,
    resetOTP: String,
role:{
    type:String,
    enum:["Admin","User"],
    default:"User"
},
    address: String,
    birthday: Date, 
    gender: String,
    image: String,
    
}, {timestamps:true});

const User = mongoose.model("Users", userSchema)
module.exports = User;


