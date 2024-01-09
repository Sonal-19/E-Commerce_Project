const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogComment' }], // Add this line
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogLike' }],
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
