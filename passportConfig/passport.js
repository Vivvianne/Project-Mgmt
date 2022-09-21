// const passport=require('passport')
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const admin = require("../config");
const db = admin.firestore();

require("dotenv").config();

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google",
        // passReqToCallback: true,
      },
      async (accessToken, refreshToken, profile, cb) => {
        console.log(`profile is \n${profile}`);
        console.log(`accessToken is \n${accessToken}`);
        // return done(null, profile);
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        };

        console.log(newUser);

        try {
          await db.collection("users").doc(profile.id).set(newUser);
          console.log("created successfully");
        } catch (e) {
          console.log(e.message);
        }
      }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });
};
