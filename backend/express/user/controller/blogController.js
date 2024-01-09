const mongoose = require('mongoose');
const Blog = require("../model/blogModel");
const User = require("../model/userModel");
const BlogLike = require("../model/blogLikeModal");
const BlogComment = require("../model/blogCommentModal");
const Notification = require("../model/notificationModel");

const blogController = {
  //Add Blog
  addBlog: async (req, res) => {
    try {
      const { name, description } = req.body;
      const image = req.file;
      const newBlog = new Blog({
        name,
        description,
        image: image.path,
      });
      await newBlog.save();
      console.log("New Blog:", newBlog);

      //Save the notification
      const newNotification = new Notification({content: "New Blog Add", type:4});
      await newNotification.save();

      res.status(201).json({ success: true, message: "Add New Blog Successfully", newBlog });
    } catch (error) {
      console.error("Error adding blog:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },


  //View all Blog
  getBlog: async (req, res) => {
    try {
      let search = req.query.search || "";
      let blogs;
      blogs = await Blog.find({ name: { $regex: search, $options: "i" } });
      return res.status(200).json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

 // Get Blog By Id
  // getBlogById: async (req, res) => {
  //   try {
  //     const blogId = req.params.blogId;
  //     const blog = await Blog.findById(blogId);

  //     if (!blog) {
  //       return res.status(404).json({ error: 'Blog not found' });
  //     }

  //     const blogWithDetails = await Blog.aggregate([
  //       { $match: { _id: blog._id } },
  //       {
  //         $lookup: {
  //           from: 'bloglikes', // The name of the BlogLike collection
  //           localField: '_id',
  //           foreignField: 'blog',
  //           as: 'likes',
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: 'blogcomments', // The name of the BlogComment collection
  //           localField: '_id',
  //           foreignField: 'blog',
  //           as: 'comments',
  //         },
  //       },
  //       {
  //         $unwind: '$comments', // Deconstruct the comments array
  //       },
  //       {
  //         $lookup: {
  //           from: 'users', // The name of the User collection
  //           localField: 'comments.user',
  //           foreignField: '_id',
  //           as: 'comments.user',
  //         },
  //       },
  //       {
  //         $unwind: '$comments.user', // Deconstruct the comments.user array
  //       },
  //       {
  //         $group: {
  //           _id: '$_id',
  //           name: { $first: '$name' },
  //           description: { $first: '$description' },
  //           image: { $first: '$image' },
  //           createdAt: { $first: '$createdAt' },
  //           updatedAt: { $first: '$updatedAt' },
  //           likeCount: { $first: { $size: '$likes' } },
  //           comments: { $push: '$comments' }, // Reconstruct the comments array
  //         },
  //       },
  //     ]);

  //     res.status(200).json(blogWithDetails[0]);
  //   } catch (error) {
  //     console.error('Error fetching blog:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // },

  getBlogById: async (req, res) => {
    try {
      const blogId = req.params.blogId;
      const blogWithDetails = await Blog.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(blogId) } },
        {
          $lookup: {
            from: 'bloglikes',
            localField: '_id',
            foreignField: 'blog',
            as: 'likes',
          },
        },
        {
          $lookup: {
            from: 'blogcomments',
            localField: '_id',
            foreignField: 'blog',
            as: 'comments',
          },
        },
        {
          $unwind: {
            path: '$comments',
            preserveNullAndEmptyArrays: true, // Include blogs with no comments
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'comments.user',
            foreignField: '_id',
            as: 'comments.user',
          },
        },
        {
          $unwind: {
            path: '$comments.user',
            preserveNullAndEmptyArrays: true, // Include blogs with no comments
          },
        },
        {
          $group: {
            _id: '$_id',
            name: { $first: '$name' },
            description: { $first: '$description' },
            image: { $first: '$image' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
            likeCount: { $first: { $size: '$likes' } },
            comments: { $push: '$comments' },
          },
        },
      ]);
  
      res.status(200).json(blogWithDetails[0]);
    } catch (error) {
      console.error('Error fetching blog:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  
  // Edit Blog by ID
  editBlog: async (req, res) => {
    try {
      const blogId = req.params.blogId;
      const { name, description } = req.body;
      const image = req.file;
      const updatedBlog = {name, description,};
      if (image) {
        updatedBlog.image = image.path;
      }
      const result = await  Blog.findByIdAndUpdate({_id:blogId}, updatedBlog, {
        new: true,
      });
      res.status(200).json({
        success: true,
        message: "Blog updated successfully",
        updatedBlog: result,
      });
    } catch (error) {
      console.error("Error editing blog:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Delete Blog by ID
  deleteBlog: async (req, res) => {
    try {
      const blogId = req.params.blogId;
      await Blog.findByIdAndDelete(blogId);
      
      res.status(200).json({
        success: true,
        message: "blog deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },


  // Like Blog by ID
  likeBlog: async (req, res) => {
    try {
      const userId = req.decoded.userId;
      if (!userId) {
        return res.status(400).send("User ID is missing in the request.");
      }
      const blogId = req.params.blogId;
  
      const existingLike = await BlogLike.findOne({ user: userId, blog: blogId });
  
      if (existingLike) {
        // Use deleteOne to remove the existing like
        await existingLike.deleteOne();
      } else {
        // User hasn't liked the blog, add the like
        const blogLike = new BlogLike({ user: userId, blog: blogId });
        await blogLike.save();
      }
  
      // Fetch the updated blog with likes and comments
      const updatedBlog = await Blog.findById(blogId)
        .populate({ path: 'comments', populate: { path: 'user', model: 'Users' } });

        
      // Update the likeCount in the blog document
      updatedBlog.likeCount = updatedBlog.likes.length;
  
      // Save the updated blog
      await updatedBlog.save();
  
      res.status(200).json({ success: true, message: 'Blog like updated successfully', updatedBlog });
    } catch (error) {
      console.error('Error liking blog:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Add Comment to Blog by ID
  addComment: async (req, res) => {
    try {
      const userId = req.decoded.userId;
      if (!userId) {
        return res.status(400).send("User ID is missing in the request.");
      }
      const blogId = req.params.blogId;
      const { text } = req.body;

      const newComment = new BlogComment({
        user: userId,
        blog: blogId,
        text,
      });
      await newComment.save();
      await Blog.findByIdAndUpdate(blogId, { $push: { comments: newComment._id } });

      // Populate the user field in the saved comment
      const populatedComment = await newComment.populate('user').execPopulate();

      res.status(201).json({ success: true, message: "Comment added successfully", newComment: populatedComment });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Edit Comment by ID
  editComment: async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const { text } = req.body;
      const updatedComment = { text };
      const result = await BlogComment.findByIdAndUpdate(
        { _id: commentId },
        updatedComment,
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Comment updated successfully",
        updatedComment: result,
      });
    } catch (error) {
      console.error("Error editing comment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Delete Comment by ID
  deleteComment: async (req, res) => {
    try {
      const commentId = req.params.commentId;
      await BlogComment.findByIdAndDelete(commentId);
      res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }


};

module.exports = blogController;