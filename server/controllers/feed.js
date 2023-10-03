const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  const page = +req.query.page || 1;
  const perPage = 2;
  let totalItems;

  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((page - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Validation Failed");
    err.statusCode = 422;
    throw err;
  }

  if (!req.file) {
    const err = new Error("image not provided");
    err.statusCode = 422;
    throw err;
  }

  const imageUrl = req.file.destination + req.file.filename;

  const post = new Post({
    title: title,
    imageUrl: imageUrl,
    content: content,
    creator: {
      name: "Ahtisham",
    },
  });

  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post Created Successfully",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found!");
        error.statusCode = 422;
        throw error;
      }
      res.status(200).json({ message: "Post fetched", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Validation Failed");
    err.statusCode = 422;
    throw err;
  }

  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.destination + req.file.filename;
  }

  if (!imageUrl) {
    const err = new Error("No file picked");
    err.statusCode = 422;
    throw err;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Could not find post");
        err.statusCode = 422;
        throw err;
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Could not find post");
        err.statusCode = 422;
        throw err;
      }
      // Check logged in user
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      res.status(200).json({ message: "Post Deleted" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
