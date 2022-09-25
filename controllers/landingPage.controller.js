const db = require("../config").firestore();

exports.getLandingPage = async (req, res, next) => {
  try {
    let data;
    const snapshot = await db.collection("projects").get();
    if (snapshot.empty) {
      data = [];
    }

    data = snapshot.docs.map((project) => {
      return {
        title: project.data().title,
        description: project.data().description,
        id: project.id,
      };
    });
    return res.render("landingPage.ejs", {
      isAuth: req.session.user ? true : false,
      rights: req.session.user ? req.session.user.rights : "guest",
      data: data,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getProjectDetailsPage = async (req, res, next) => {
  const projectId = req.params.id;
  let data;
  let userData;
  try {
    const snapshot = await db
      .collection("projects")
      .doc(projectId)
      .collection("programs")
      .get();

    if (snapshot.empty) {
      data = [];
    }

    data = snapshot.docs.map((program) => {
      return {
        id: program.id,
        name: program.data().program.name,
        desc: program.data().program.description,
        author: program.data().program.author,
      };
    });

    // fetch all users
    const usersSnapshot = await db
      .collection("users")
      .where("rights", "!=", "admin")
      .get();

    if (usersSnapshot.empty) {
      userData = [];
    }

    userData = usersSnapshot.docs.map((user) => {
      return {
        id: user.id,
        name: user.data().name,
        email: user.data().email,
      };
    });

    return res.render("project_details.ejs", {
      title: projectId,
      isAuth: req.session.user ? true : false,
      rights: req.session.user.rights,
      data: data,
      userData: userData,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getNewProjectPage = async (req, res, next) => {
  res.render("new-topic.ejs", {
    isAuth: req.session.user ? true : false,
    rights: req.session.user.rights,
  });
};

exports.getNewProgramPage = async (req, res, next) => {
  const title = req.params.projectId;

  res.render("new-program.ejs", {
    title: title,
    isAuth: req.session.user ? true : false,
    rights: req.session.user.rights,
  });
};

exports.getStudentsPage = async (req, res, next) => {
  let data;

  try {
    const snapshot = await db
      .collection("users")
      .where("rights", "==", "student")
      .get();

    if (snapshot.empty) {
      data = [];
    }

    data = snapshot.docs.map((student) => {
      return {
        name: student.data().name,
        email: student.data().email,
        status: student.data().status,
        rights: student.data().rights,
      };
    });

    return res.render("students.ejs", {
      students: data,
      isAuth: req.session.user ? true : false,
      rights: req.session.user.rights,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getNewUserPage = (req, res, next) => {
  res.render("new-user.ejs", {
    isAuth: req.session.user ? true : false,
    rights: req.session.user.rights,
  });
};

exports.getTeamleadsPage = async (req, res, next) => {
  let data;

  try {
    const snapshot = await db
      .collection("users")
      .where("rights", "==", "teamlead")
      .get();

    if (snapshot.empty) {
      data = [];
    }

    data = snapshot.docs.map((lead) => {
      return {
        name: lead.data().name,
        email: lead.data().email,
        status: lead.data().status,
        rights: lead.data().rights,
      };
    });

    return res.render("teamleads.ejs", {
      data: data,
      isAuth: req.session.user ? true : false,
      rights: req.session.user.rights,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getProfilePage = async (req, res, next) => {
  let courseData;
  let tasksData;

  let userId = req.session.user.userId;

  try {
    const courseSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("courses")
      .get();

    const taskSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("tasks")
      .get();

    if (courseSnapshot.empty) {
      courseData = [];
    }

    if (taskSnapshot.empty) {
      tasksData = [];
    }

    courseData = courseSnapshot.docs.map((course) => {
      return {
        title: course.data().title,
      };
    });

    tasksData = taskSnapshot.docs.map((task) => {
      return {
        title: task.data().name,
      };
    });

    console.log(req.session);

    return res.render("profile.ejs", {
      user: req.session.user,
      isAuth: req.session.user ? true : false,
      courses: courseData,
      tasks: tasksData,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/auth/login");
};
