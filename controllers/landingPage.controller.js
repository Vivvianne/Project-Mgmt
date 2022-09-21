const db = require("../config").firestore();

exports.getLandingPage = async (req, res, next) => {
  try {
    const snapshot = await db.collection("projects").get();
    if (snapshot.empty) {
      return res.render("landingPage.ejs", {
        data: [],
        rights: req.session.rights,
        isAuth: req.session.isAuth,
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
      isAuth: req.session.isAuth,
      data: data,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getProjectDetailsPage = async (req, res, next) => {
  const projectId = req.params.id;

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
        rights: req.session.rights[0],
        isAuth: req.session.isAuth,
      });
    }

    let data = snapshot.docs.map((program) => {
      return {
        title: program.data().program,
      };
    });

    return res.render("project_details.ejs", {
      title: projectId,
      rights: req.session.rights[0],
      isAuth: req.session.isAuth,
      data: data,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getNewProjectPage = async (req, res, next) => {
  res.render("new-project.ejs", {
    isAuth: req.session.isAuth,
    rights: req.session.rights[0],
  });
};

exports.getNewProgramPage = async (req, res, next) => {
  const title = req.params.projectId;

  res.render("new-program.ejs", {
    title: title,
    isAuth: req.session.isAuth,
    rights: req.session.rights[0],
  });
};

exports.getStudentsPage = async (req, res, next) => {
  try {
    const snapshot = await db
      .collection("users")
      .where("rights", "==", "student")
      .get();

    if (snapshot.empty) {
      return res.render("students.ejs", {
        students: [],
        isAuth: req.session.isAuth,
        rights: req.session.rights[0],
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
      isAuth: req.session.isAuth,
      rights: req.session.rights[0],
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getNewUserPage = (req, res, next) => {
  res.render("new-user.ejs", {
    isAuth: req.session.isAuth,
    rights: req.session.rights[0],
  });
};

exports.getTeamleadsPage = async (req, res, next) => {
  try {
    const snapshot = await db
      .collection("users")
      .where("rights", "==", "teamlead")
      .get();

    if (snapshot.empty) {
      return res.render("teamleads.ejs", {
        data: [],
        isAuth: req.session.isAuth,
        rights: req.session.rights[0],
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
      isAuth: req.session.isAuth,
      rights: req.session.rights[0],
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getProfilePage = async (req, res, next) => {
  const snapshot = await db
    .collection("users")
    .doc(req.session.uid)
    .collection("courses")
    .get();

  if (snapshot.empty) {
    res.json({ msg: "no courses enrolled yet" });
  }

  let data = snapshot.docs.map((course) => {
    return {
      title: course.data().title,
    };
  });
  
  return res.render("profile.ejs", {
    user: req.session.user,
    rights: req.session.rights[0],
    isAuth: req.session.isAuth,
    courses: data
  });
};
