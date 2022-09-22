const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const admin = require("../config");
const db = admin.firestore();

require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
      // passReqToCallback: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        rights: "admin",
        status: "active",
        name: profile.displayName,
        email: profile.emails[0].value,
      };

      try {
        await db.collection("users").doc(profile.id).set(newUser);
      } catch (e) {
        console.log(e.message);
      }
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});
