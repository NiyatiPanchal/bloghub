const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fetchuser = require("../middleware/fetchuser");
const upload = require("../middleware/upload");
const Post = require("../models/Post");
const { body, validationResult } = require("express-validator");
const grid = require("gridfs-stream");
const url = "http://localhost:5000";
let gfs;

const conn = mongoose.connection;
conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "fs",
  });
  gfs = grid(conn.db, mongoose.mongo);
  gfs.collection("fs");
});

router.post("/file/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(404).json({ message: "File not found" });
  }

  const imageUrl = `${url}/api/posts/file/${req.file.filename}`;
  return res.status(200).json({ imageUrl });
});

router.get("/file/:filename", async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    const readStream = gridfsBucket.openDownloadStream(file._id);
    readStream.pipe(res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// // ROUTE 1 : Get all the notes : GET "/api/notes/fetchallnotes" Login require
router.get("/fetchallposts", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/fetchallposts/:username", async (req, res) => {
  try {
    const posts = await Post.find({ username: req.params.username });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2 : Add a new note : POST "/api/notes/addnote" Login require
router.post("/createpost", async (req, res) => {
  // try {
  //   const { title, description, picture, username, catagory } = req.body;

  //   //   // If there are error return bad request and the error
  //   //   const errors = validationResult(req);
  //   //   if (!errors.isEmpty()) {
  //   //     return res.status(400).json({ errors: errors.array() });
  //   //   }

  //   const post = new Post({
  //     title,
  //     description,
  //     picture,
  //     username,
  //     catagory,
  //   });

  //   const savePost = await post.save();

  //   response.status(200).json(savePost);
  // }
  var success = false;

  try {
    const post = await new Post(req.body);
    post.save();
    success = true;
    res.status(200).json({ success, message: "Post saved successfully" });
  } catch (error) {
    res.status(500).json({ success, error });
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    // Find the note to be update and update it
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Not Found");
    }

    res.json(post);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 3 : Update an Existing note : PUT "/api/notes/updatenote" Login require
router.put("/updatepost/:id", fetchuser, async (req, res) => {
  const success = false;
  try {
    // Find the note to be update and update it
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, message: "Post updated successfully" });
  } catch (error) {
    res.status(500).json({ success: False, message: "Internal Server Error" });
  }
});

// ROUTE 3 : Delete an Existing note : DELETE "/api/notes/deletenote" Login require
router.delete("/deletepost/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be delete and delete it
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    post = await Post.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Post Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
