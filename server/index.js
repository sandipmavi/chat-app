const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB");
require("dotenv").config();
const router = require("./routes/index.js");

const cookieParser = require("cookie-parser");
const { app, server } = require("./socket/socket.js");

app.use(cookieParser());
app.use(
  cors({
    origin: "https://chat-app-mavi.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Server is running fine", // Changed "Message" to "message" for consistency
  });
});

app.use(express.json());

app.use("/api", router);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database: ", err);
  });
