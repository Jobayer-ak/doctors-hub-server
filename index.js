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
// app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));

// middlewares
app.use(express.json());
// app.use(express.urlencoded());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://doctorshubbd.netlify.app",
    ],
    credentials: true,
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Access-Control-Allow-Origin", "Content-Type"],
  })
);

// routes
const userRoute = require("./routes/user.route.js");
const bookingRoute = require("./routes/booking.route");
const doctorRoute = require("./routes/doctor.route");
const { default: jwtDecode } = require("jwt-decode");
const verifyToken = require("./middlewares/verifyToken");
const User = require("./models/user.model");

// db connection
dbConnection();

// api calling
// user Routes
app.use("/api/v1/", userRoute);

// doctors route
app.use("/api/v1/", doctorRoute);

// booking routes
app.use("/api/v1/", bookingRoute);

app.listen(port, () => {
  console.log(`App is running at ${port}!`.yellow.bold);
});
