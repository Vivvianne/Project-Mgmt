exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    res.redirect("/auth/login");
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.session.rights === "admin") {
    return next();
  } else {
    console.log("Unauthorized!");
    return res.redirect("/");
  }
};
