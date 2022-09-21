const passport = require("passport");
const router = require("express").Router();

const {
  signup,
  getSignupPage,
  getLoginPage,
  login,
  logout,
  googleSignIn,
  googleCallback,
} = require("../controllers/auth.controller");

router.get("/signup", getSignupPage);

router.post("/signup", signup);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  googleSignIn
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login" }),
  googleCallback
);

router.get("/login", getLoginPage);

router.post("/login", login);

router.post("/logout", logout);

module.exports = router;
