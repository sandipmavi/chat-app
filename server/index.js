const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB");
require("dotenv").config();
const router = require("./routes/index.js");

const cookieParser = require("cookie-parser");
const { app, server } = require("./socket/index.js");

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies and other credentials
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
