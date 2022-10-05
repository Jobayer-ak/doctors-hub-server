const mongoose = require("mongoose");
const colors = require("colors");

exports.dbConnection = () => {
  try {
    const url = process.env.URL;
    mongoose.connect(url, () => {
      console.log("Database is connected!".red.bold);
    });
  } catch (error) {
    console.log(error.message);
  }
};
