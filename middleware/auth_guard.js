exports.isAuthenticated = (req, res, next) => {
  if (req.session.isAuth) {
    return next();
  } else {
    return res.redirect("/auth/login");
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.session.rights[0] === "admin") {
    return next();
  } else {
    console.log("Unauthorized!");
    return res.redirect("/");
  }
};
