const mongoose = require("mongoose");
require("dotenv").config();

async function dropIndex() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      if (collection.name === 'users') {
        console.log("Found users collection, dropping indexes...");
        await db.collection('users').dropIndexes();
        console.log("Indexes dropped successfully");
      }
    }

    console.log("Operation completed");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

dropIndex(); 