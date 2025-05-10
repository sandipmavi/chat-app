const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  try {
    console.log("Connecting to MongoDB...");
    console.log("Using URI:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);

    mongoose.connection.on("connected", () => {
      console.log("Successfully connected to MongoDB.");
    });

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
