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
  res.render("signup.ejs", { isAuth: req.session.user ? true : false });
};

const getLoginPage = (req, res, next) => {
  res.render("login.ejs", { isAuth: req.session.user ? true : false });
};

const signup = async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    if (email !== undefined || password !== undefined) {
      await createUserWithEmailAndPassword(auth, email, password);
      let user = auth.currentUser;
      await updateProfile(user, { displayName: name });

      let newUser = {
        name: name,
        email: email,
        status: "active",
        rights: "admin",
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

      const snapshot = await db
        .collection("users")
        .where("email", "==", email)
        .get();

      let userData = snapshot.docs.map((item) => {
        return item.data();
      });

      let user = {
        userId: auth.currentUser.uid,
        email: auth.currentUser.email,
        name: auth.currentUser.displayName,
        rights: userData[0].rights,
      };

      req.session.user = user;

      return res.redirect(`/`);
    }
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};

const OauthCallback = async (req, res) => {
  try {
    await db.collection("users").doc(req.user.userId).set(req.user);
  } catch (e) {
    console.log(e.message);
  }

  req.session.user = req.user;
  res.redirect("/");
};

module.exports = {
  signup,
  login,
  getSignupPage,
  getLoginPage,
  OauthCallback,
};
