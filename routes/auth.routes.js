const passport = require("passport");
const router = require("express").Router();

const {
  signup,
  getSignupPage,
  getLoginPage,
  login,
  logout,
} = require("../controllers/auth.controller");

router.get("/signup", getSignupPage);

router.post("/signup", signup);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);

router.get("/login", getLoginPage);

router.post("/login", login);

module.exports = router;
