const express = require("express");
const cors = require("cors");
require("dotenv").config();
const colors = require("colors");
const {dbConnection} = require("./db");

const app = express();
const port = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(cors());

// routes
const slotRoute = require("./routes/slot.route");
const userRoute = require("./routes/user.route.js");

// db connection
dbConnection();

// api calling
app.use("/api/v1/", slotRoute);
app.use("/api/v1/", userRoute);
app.use("/api/v1/", userRoute)

app.listen(port, () => {
  console.log(`App is running at ${port}!`.yellow.bold);
});
