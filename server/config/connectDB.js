const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  try {
    console.log("Connecting to MongoDB...");
    

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Database Connected Successfully")
    

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
