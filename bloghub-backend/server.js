const connectDB = require("./db");
const express = require("express");
var cors = require("cors");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");

app.use(cors());

const port = process.env.PORT || 5000;

connectDB();

// middleware
app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
// Available Routes
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/posts", require("./routes/posts.js"));
app.use("/api/comments", require("./routes/comments.js"));
app.use("/api/subscribe", require("./routes/subscribe.js"));

app.listen(port, () => {
  console.log(`BlogHub backend listening on port ${port}`);
});
