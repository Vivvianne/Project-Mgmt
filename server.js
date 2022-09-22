const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");

const authRoutes = require("./routes/auth.routes");
const landingPageRoute = require("./routes/landingPage.routes");
const userRoutes = require("./routes/student.routes");
const adminRoutes = require("./routes/admin.routes");
const studentRoutes = require("./routes/student.routes");

require("./passportConfig/passport");
require("dotenv").config();

const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// render static files
app.use(express.static("public"));

app.set("views", "./views");
// set view engine to ejs
app.set("view-engine", "ejs");
// app.use(express.static("views"));

app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT;

app.use("/auth", authRoutes);
app.use("/", landingPageRoute);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/students", studentRoutes);

app.listen(PORT, () => {
  console.log("App listening on port " + PORT);
});
