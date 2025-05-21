const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const noteRoutes = require("./routes/noteRoutes");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/authRoutes");

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Middleware
app.use(express.json()); // Parse JSON requests

// Test Route
app.get("/", (req, res) => {
  res.send("Notes App Backend is Running!");
});

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/notes", noteRoutes); // Note routes

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1); // Exit process with failure
  });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});