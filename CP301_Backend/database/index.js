const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
      mongoose.set('strictQuery', false);
      const conn = await mongoose.connect(url);

      console.log(`MongoDB Connected: ${conn.connection.host}`)
  }
  catch (error) {
      console.log(error);
      process.exit(1);
  }
}

module.exports = connectDB;