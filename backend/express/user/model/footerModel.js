const mongoose = require("mongoose");

const footerSchema = new mongoose.Schema({
  type:{
    type: String,
    enum:[0,1,2,3],//0-privacy, 1-t&c, 2-terms&use , 3-Accessibility
    default:0
},
description:String,
},
{timestamps:true}
);

const Footer = mongoose.model("Footer", footerSchema);
module.exports = Footer;