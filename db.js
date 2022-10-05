const mongoose = require("mongoose");
const colors = require("colors");

exports.dbConnection = () =>{
    const url = process.env.URL;
    mongoose.connect(url, ()=>{
        console.log("Database is connected!".red.bold);
    })
}