// import all your necessary libraries
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");

// app routes
const authRoutes = require("./routes/auth.routes");
const landingPageRoute = require("./routes/landingPage.routes");
const userRoutes = require("./routes/student.routes");
const adminRoutes = require("./routes/admin.routes");
const studentRoutes = require("./routes/student.routes");

// bring in the passport config file
require("./passportConfig/passport");

// avail .env files
require("dotenv").config();

// initialize the express app
const app = express();

// add sessions to your app
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// add passport to our express app
app.use(passport.initialize());
app.use(passport.session());

// render static files
app.use(express.static("public"));
app.set("views", "./views");

// set view engine to ejs
app.set("view-engine", "ejs");

// use morgan to get meaningful logs
app.use(logger("dev"));

// use cors to protect against cors attacks
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT;

// define how to access different routes
app.use("/auth", authRoutes);
app.use("/", landingPageRoute);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/students", studentRoutes);

// get your node server up and running
app.listen(PORT, () => {
  console.log(`${PORT} up and running`);
});
