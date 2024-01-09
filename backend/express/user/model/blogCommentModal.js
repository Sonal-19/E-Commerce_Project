const mongoose = require("mongoose");

const blogCommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
  text: String,
},
{ timestamps: true }
);

const BlogComment = mongoose.model("BlogComment", blogCommentSchema);
module.exports = BlogComment;
