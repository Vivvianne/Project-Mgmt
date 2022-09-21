const bcrypt = require("bcrypt");
const passport = require("passport");

const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} = require("firebase/auth");

const admin = require("../config");
const app = require("../db");

const db = admin.firestore();
const auth = getAuth(app);

const getSignupPage = (req, res, next) => {
  res.render("signup.ejs", { isAuth: req.session.isAuth });
};

const getLoginPage = (req, res, next) => {
  res.render("login.ejs", { isAuth: req.session.isAuth });
};

const signup = async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    if (email !== undefined || password !== undefined) {
      await createUserWithEmailAndPassword(auth, email, password);
      let user = auth.currentUser;
      await updateProfile(user, { displayName: name });

      const hashedPassword = await bcrypt.hash(password, 12);

      let newUser = {
        name: name,
        email: email,
        status: "active",
        rights: "admin",
        password: hashedPassword,
      };

      await db.collection("users").add(newUser);

      return res.redirect("/auth/login");
    } else {
      return res.status(400).json({ msg: "fill in the fields" });
    }
  } catch (err) {
    return res.status(401).json({ msg: err.message });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (email !== undefined || password !== undefined) {
      await signInWithEmailAndPassword(auth, email, password);
      console.log(auth.currentUser.uid);
      const snapshot = await db
        .collection("users")
        .where("email", "==", email)
        .get();

      req.session.uid = auth.currentUser.uid;

      let rights = snapshot.docs.map((item) => {
        req.session.user = item.data();
        return item.data().rights;
      });

      req.session.rights = rights;
      req.session.isAuth = true;

      // log the session to console
      console.log(req.session);
      return res.redirect(`/`);
    }
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};

const googleSignIn = (req, res, next) => {
  res.redirect("/");
};

const googleCallback = async (req, res, next) => {
  res.redirect("/auth/login");
};

const logout = (req, res, next) => {
  auth.signOut();
  req.session.rights = "";
  req.session.isAuth = false;
  return res.redirect("/");
};

module.exports = {
  signup,
  login,
  getSignupPage,
  getLoginPage,
  logout,
  googleSignIn,
  googleCallback,
};
