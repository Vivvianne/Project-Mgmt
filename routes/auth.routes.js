const passport = require("passport");
const router = require("express").Router();

const {
  signup,
  getSignupPage,
  getLoginPage,
  login,
  OauthCallback,
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
    failureRedirect: "/auth/login",
  }),
  OauthCallback
);

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/auth/login",
  }),
  OauthCallback
);

router.get("/twitter", passport.authenticate("twitter"));

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/auth/login",
  }),
  OauthCallback
);

router.get("/login", getLoginPage);

router.post("/login", login);

module.exports = router;
