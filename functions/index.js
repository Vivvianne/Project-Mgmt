// import all your necessary libraries
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const engines = require("consolidate");
const fileUpload = require("express-fileupload");

// app routes
const authRoutes = require("./routes/auth.routes");
const landingPageRoute = require("./routes/landingPage.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");

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
app.use(express.static("../public"));

// set view engine to ejs
app.engine("ejs", engines.ejs);

// tell express where our frontend code is
app.set("views", "./views");
app.set("view engine", "ejs");

// support file upload
app.use(fileUpload());
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

// exports.app = functions.https.onRequest(app)

app.listen(PORT, () => {
  console.log("node app running on port", PORT);
});
