const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;

const admin = require("../config");

require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        userId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        provider: profile.provider,
        rights: "admin",
        status: "active",
      };

      return done(null, newUser);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/facebook/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        name: profile.displayName,
        userId: profile.id,
        provider: profile.provider,
        rights: "admin",
        status: "active",
      };

      done(null, newUser);
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: "http://localhost:8080/auth/twitter/callback",
    },
    async (token, tokenSecret, profile, cb) => {
      const newUser = {
        name: profile.displayName,
        provider: profile.provider,
        userId: profile.id,
        rights: "admin",
        status: "active",
      };

      return cb(null, newUser);
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});
