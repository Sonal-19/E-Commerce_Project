const mongoose = require('mongoose');

const blogLikeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
  createdAt: { type: Date, default: Date.now },
});

// blogLikeSchema.method('customRemove', function (callback) {
//   return this.deleteOne(callback);
// }, { suppressWarning: true });

const BlogLike = mongoose.model('BlogLike', blogLikeSchema);
module.exports = BlogLike;
