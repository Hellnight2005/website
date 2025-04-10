const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/meeting", messageRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "Welcome to the backend project 🚀",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
