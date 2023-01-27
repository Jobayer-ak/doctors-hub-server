const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const colors = require("colors");
const { dbConnection } = require("./db");
const port = process.env.PORT || 5001;

const app = express();
// cookie parser
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// middlewares
app.use(express.json());
app.use(express.urlencoded());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// routes
const slotRoute = require("./routes/slot.route");
const userRoute = require("./routes/user.route.js");
const bookingRoute = require("./routes/booking.route");
const { default: jwtDecode } = require("jwt-decode");
const verifyToken = require("./middlewares/verifyToken");

// db connection
dbConnection();


// api calling
// user Routes
app.use("/api/v1/", userRoute);

// slots route
app.use("/api/v1/", slotRoute);

// booking routes
app.use("/api/v1/", bookingRoute);

app.listen(port, () => {
  console.log(`App is running at ${port}!`.yellow.bold);
});
