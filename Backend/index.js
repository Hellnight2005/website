const express = require("express");

const app = express();
const PORT = 4000;

// Root route
app.get("/", (req, res) => {
  res.json({ message: "This is the first API of the project. Sure or not?" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});
