const express = require("express");
const app = express();

const Port = 4000;

app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "this is first route of the backend project ",
  });
});

app.listen(Port, console.log("this is serve is running here "));
