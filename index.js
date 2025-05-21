const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const noteRoutes = require("./routes/noteRoutes");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/authRoutes");

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000", // Local development
  "https://your-frontend.netlify.app", // Your Netlify frontend URL
  // Add any other domains you need to allow
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Enable credentials if needed
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"] // Allowed headers
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