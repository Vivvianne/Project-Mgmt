const db = require("../config").firestore();

exports.getLandingPage = async (req, res, next) => {
  let isAuth;

  if (req.user) {
    isAuth = true;
    req.session.rights = "admin";
  } else if (req.session.isAuth) {
    isAuth = req.session.isAuth;
  }

  try {
    const snapshot = await db.collection("projects").get();
    if (snapshot.empty) {
      return res.render("landingPage.ejs", {
        data: [],
        rights: req.session.rights,
        isAuth: isAuth,
      });
    }

    let data = snapshot.docs.map((project) => {
      return {
        title: project.data().title,
        description: project.data().description,
        id: project.id,
      };
    });
    return res.render("landingPage.ejs", {
      rights: req.session.rights,
      isAuth: isAuth,
      data: data,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getProjectDetailsPage = async (req, res, next) => {
  let isAuth;
  const projectId = req.params.id;

  if (req.user) {
    isAuth = true;
    req.session.rights = "admin";
  } else if (req.session.isAuth) {
    isAuth = req.session.isAuth;
  }

  try {
    const snapshot = await db
      .collection("projects")
      .doc(projectId)
      .collection("programs")
      .get();
    if (snapshot.empty) {
      return res.render("project_details.ejs", {
        title: projectId,
        data: [],
        rights: req.session.rights,
        isAuth: isAuth,
      });
    }

    let data = snapshot.docs.map((program) => {
      // console.log(program.data());
      return {
        name: program.data().program.name,
        desc: program.data().program.description,
        author: program.data().program.author,
      };
    });

    console.log(data);

    return res.render("project_details.ejs", {
      title: projectId,
      rights: req.session.rights,
      isAuth: isAuth,
      data: data,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getNewProjectPage = async (req, res, next) => {
  let isAuth;

  if (req.user) {
    isAuth = true;
    req.session.rights = "admin";
  } else if (req.session.isAuth) {
    isAuth = req.session.isAuth;
  }

  res.render("new-topic.ejs", {
    isAuth: isAuth,
    rights: req.session.rights,
  });
};

exports.getNewProgramPage = async (req, res, next) => {
  let isAuth;

  if (req.user) {
    isAuth = true;
    req.session.rights = "admin";
  } else if (req.session.isAuth) {
    isAuth = req.session.isAuth;
  }

  const title = req.params.projectId;

  res.render("new-program.ejs", {
    title: title,
    isAuth: isAuth,
    rights: req.session.rights,
  });
};

exports.getStudentsPage = async (req, res, next) => {
  let isAuth;

  if (req.user) {
    isAuth = true;
    req.session.rights = "admin";
  } else if (req.session.isAuth) {
    isAuth = req.session.isAuth;
  }

  try {
    const snapshot = await db
      .collection("users")
      .where("rights", "==", "student")
      .get();

    if (snapshot.empty) {
      return res.render("students.ejs", {
        students: [],
        isAuth: isAuth,
        rights: req.session.rights,
      });
    }

    let data = snapshot.docs.map((student) => {
      return {
        name: student.data().name,
        email: student.data().email,
        status: student.data().status,
        rights: student.data().rights,
      };
    });

    return res.render("students.ejs", {
      students: data,
      isAuth: isAuth,
      rights: req.session.rights,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getNewUserPage = (req, res, next) => {
  let isAuth;

  if (req.user) {
    isAuth = true;
    req.session.rights = "admin";
  } else if (req.session.isAuth) {
    isAuth = req.session.isAuth;
  }

  res.render("new-user.ejs", {
    isAuth: isAuth,
    rights: req.session.rights,
  });
};

exports.getTeamleadsPage = async (req, res, next) => {
  let isAuth;

  if (req.user) {
    isAuth = true;
    req.session.rights = "admin";
  } else if (req.session.isAuth) {
    isAuth = req.session.isAuth;
  }

  try {
    const snapshot = await db
      .collection("users")
      .where("rights", "==", "teamlead")
      .get();

    if (snapshot.empty) {
      return res.render("teamleads.ejs", {
        data: [],
        isAuth: isAuth,
        rights: req.session.rights,
      });
    }

    let data = snapshot.docs.map((lead) => {
      return {
        name: lead.data().name,
        email: lead.data().email,
        status: lead.data().status,
        rights: lead.data().rights,
      };
    });

    return res.render("teamleads.ejs", {
      data: data,
      isAuth: isAuth,
      rights: req.session.rights,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getProfilePage = async (req, res, next) => {
  let isAuth;

  if (req.user) {
    isAuth = true;
    req.session.rights = "admin";
  } else if (req.session.isAuth) {
    isAuth = req.session.isAuth;
  }

  const snapshot = await db
    .collection("users")
    .doc(req.session.uid)
    .collection("courses")
    .get();

  if (snapshot.empty) {
    res.render("profile.ejs", {
      user: req.session.user,
      rights: req.session.rights,
      isAuth: isAuth,
      courses: {},
    });
  }

  let data = snapshot.docs.map((course) => {
    return {
      title: course.data().title,
      rights: req.session.rights,
      isAuth: req.session.isAuth,
    };
  });

  return res.render("profile.ejs", {
    user: req.session.user,
    rights: req.session.rights,
    isAuth: isAuth,
    courses: data,
  });
};

exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/auth/login");
};
