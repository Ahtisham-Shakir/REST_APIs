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

  res.status(201).json({
    message: "Post Created Successfully",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      creator: {
        name: "Ahtisham",
      },
      createdAt: new Date(),
    },
  });
};
