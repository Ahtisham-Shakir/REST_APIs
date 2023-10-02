const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is content for first post",
        creator: {
          name: "Ahtisham",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation Failed", errors: errors.array() });
  }

  const post = new Post({
    title: title,
    imageUrl: "images/duck.png",
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
      console.log(err);
    });
};
