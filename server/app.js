const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const feedRoutes = require("./routes/feed");

const app = express();

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization,");
  next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log("error handler", error);
  const status = error.statusCode || 500;
  const message = error.message;
  return res.status(status).json({ message: message });
});

mongoose
  .connect(
    "mongodb+srv://ahtishamshakir000:shaam777@cluster0.fyh6w91.mongodb.net/messages?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(8080);
    console.log("Connected!");
  })
  .catch((err) => {
    console.log(err);
  });
