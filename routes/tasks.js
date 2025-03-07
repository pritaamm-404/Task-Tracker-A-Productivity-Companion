// const express = require('express');
// const router = express.Router();
// const Task = require('../models/task');

import { Router } from "express";
import Task from "../models/task.js"; // Add .js for file imports
import fetch from "node-fetch";
import fs from "fs/promises";

const router = Router();

//Add a fetch utility to retrieve quotes...........
// const fetch = require('node-fetch');

// Get all tasks.....................................

router.get("/", async (req, res) => {
  const { search, category, priority } = req.query;

  let filter = {};

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  if (category) {
    filter.category = category;
  }

  if (priority) {
    filter.priority = priority;
  }

  const tasks = await Task.find(filter).sort({ dueDate: 1 });

  // Pass the message if no tasks were found
  const message =
    tasks.length === 0
      ? "No tasks found matching your search or category or priority."
      : null;

  res.render("index", { tasks, search, category, priority, message });
});

//Index page........................................
router.get("/tasks", async (req, res) => {
  const tasks = await Task.find().sort({ dueDate: 1 });
  res.render("index.ejs", { tasks });
});

// Render form to create a new task...................
router.get("/new", (req, res) => {
  res.render("new.ejs", {
    search: "",
    category: "",
    priority: "",
  });
});

// Create a new task...............................................
// router.post("/", async (req, res) => {
//   const task = new Task(req.body);
//   await task
//     .save()
//     .then((res) => {
//       console.log("Data saved");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   req.flash("success", "Task added successfully!"); // Send success message
//   res.redirect("/tasks");
// });

router.post("/", async (req, res) => {
  try {
    const { title, description, priority, dueDate, category } = req.body;
    const newTask = new Task({
      title,
      description,
      priority,
      dueDate,
      category,
      status: "Pending",
    });
    await newTask.save();

    req.flash("success", "Task added successfully!");
    res.redirect("/tasks?success=added"); // Use query param instead of relying only on flash
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong!");
    res.redirect("/tasks?error=1");
  }
});

// Mark task as completed.........................

router.post("/:id/complete", async (req, res) => {
  try {
    let randomQuote;

    // Try fetching a quote from the API
    try {
      const response = await fetch("https://zenquotes.io/api/random");
      if (!response.ok) throw new Error("Failed to fetch quotes from API");
      const quotes = await response.json();
      randomQuote = {
        text: quotes[0]?.q || "Keep pushing forward!",
        author: quotes[0]?.a || "Anonymous",
      };
    } catch (apiError) {
      console.error("API fetch error:", apiError.message);

      // Use fallback quote if API fails
      randomQuote = {
        text: "Great job! Keep pushing forward!",
        author: "Anonymous",
      };
    }

    // Update the task status
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: "Completed" },
      { new: true }
    );
    if (!task) return res.status(404).send("Task not found");

    // Render the completion page with the quote
    // Render the quote page and pass required variables
    res.render("quote", {
      quote: randomQuote,
      search: "", // Define `search` to prevent errors in navbar
      category: "", // Define `category`
      priority: "", // Define `priority`
    });
  } catch (error) {
    console.error("Error completing task:", error.message);
    res.status(500).send("An error occurred while completing the task.");
  }
});

// Delete a task
router.post("/:id/delete", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  req.flash("success", "Task deleted successfully!");
  res.redirect("/tasks?success=deleted"); // Use query param instead of relying only on flash
  // res.redirect("/tasks");
});

export default router;
// module.exports = router;
