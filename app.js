import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import taskRoutes from "./routes/tasks.js"; // Add .js for file imports
import ejsMate from "ejs-mate"; //For EJS rendering
import dotenv from "dotenv";
import flash from "express-flash";
import session from "express-session";
import connectFlash from "connect-flash";

dotenv.config();

const ATLASDB_URL = process.env.ATLASDB_URL;

const app = express();

// Setup session middleware
app.use(
  session({
    secret: process.env.SECRET, // Change this to a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }, // Session expiry time (optional)
  })
);

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
// Use connect-flash for flash messages
app.use(connectFlash());
app.use(flash());
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

// Make flash messages available in views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Connect to MongoDB
//Mongo URL = mongodb://127.0.0.1:27017/task_tracker

async function main() {
  try {
    await mongoose.connect(ATLASDB_URL);
    console.log("Connection successful!!!!!");
  } catch (err) {
    console.error("Connection failed:", err.message);
  }
}

main();

// Routes.....................................
app.use("/tasks", taskRoutes);
app.use("/", taskRoutes);

// Start server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
