const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const usersRouter = require('./routes/users');

require('dotenv').config();

// Connect to MongoDB
//mongoose.connect("mongodb://127.0.0.1:27017/demo1");
console.log("Connecting to MongoDB...");
mongoose.connect("mongodb://localhost:27017/demo1");
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});3


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3059;
app.use('/upload', express.static('upload'));
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

