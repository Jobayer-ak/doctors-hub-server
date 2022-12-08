const express = require("express");
const cors = require("cors");
require("dotenv").config();
const colors = require("colors");
const { dbConnection } = require("./db");
const slotRoute = require("./routes/slot.route");

const app = express();
const port = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(cors());

// db connection
dbConnection();

// api calling
app.use("/api/v1/slots", slotRoute);
app.use("/api/v1/register")

app.listen(port, () => {
  console.log(`App is running at ${port}!`.yellow.bold);
});
