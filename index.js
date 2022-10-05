const express = require("express");
const cors = require("cors");
require("dotenv").config();
const colors = require("colors");
const { dbConnection } = require("./db");

const port = process.env.PORT || 50001;
const app = express();
// middlewares
app.use(express());
app.use(express.json());

// db connection 
dbConnection();

// api calling 


app.listen(port, () => {
  console.log(`App is running at ${port}!`.yellow.bold);
});
