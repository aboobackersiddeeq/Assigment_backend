require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const userRouter = require("./routers/user-router");
const { fileFilter, fileStorage } = require('./utils/multer-helper');

// Set the "public" directory path
app.set("public", `${__dirname}/public`);

// Enable strict mode for querying in Mongoose
mongoose.set("strictQuery", true);

// Parse JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Limit JSON payload size to 1100kb
app.use(bodyParser.json({ limit: "1100kb" }));

// Connect to the database
mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log("Connected to the database successfully");
});

// File upload configuration
app.use(
  multer({ storage: fileStorage, fileFilter }).fields([
    { name: "img" },
    { name: "images", maxCount: 5 },
  ])
);

// Configure CORS settings
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Logging middleware
app.use(logger("dev"));

// Serve static files from the "public" directory
app.use(express.static(__dirname + "/public"));

// Parse cookies
app.use(cookieParser());

// Mount the user router at the "/api" route
app.use("/api", userRouter);

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;

