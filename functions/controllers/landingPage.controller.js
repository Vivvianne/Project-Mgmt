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
    return res.render("landingPage", {
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
  let taskData;
  let userData;
  let enrolledUsers;

  try {
    const enrolledUserSnapshot = await db
      .collection("enrolledProjects")
      .where("title", "==", projectId)
      .get();

    const snapshot = await db
      .collection("tasks")
      .where("projectId", "==", projectId)
      .get();

    // fetch all users
    const usersSnapshot = await db
      .collection("users")
      .where("rights", "!=", "admin")
      .get();

    if (enrolledUserSnapshot.empty) {
      enrolledUsers = [];
    }

    if (snapshot.empty) {
      data = [];
    }

    if (usersSnapshot.empty) {
      userData = [];
    }

    enrolledUsers = enrolledUserSnapshot.docs.map((enrUser) => {
      return {
        id: enrUser.data().user.userId,
        name: enrUser.data().user.name,
        rights: enrUser.data().user.rights,
      };
    });

    taskData = snapshot.docs.map((task) => {
      return {
        id: task.id,
        name: task.data().name,
        desc: task.data().description,
        author: task.data().author,
        videoUrl: task.data().videoUrl,
      };
    });

    userData = usersSnapshot.docs.map((user) => {
      return {
        id: user.id,
        name: user.data().name,
        email: user.data().email,
        rights: user.data().rights,
      };
    });

    return res.render("project_details", {
      title: projectId,
      isAuth: req.session.user ? true : false,
      rights: req.session.user.rights,
      data: taskData,
      userData: userData,
      enrolledUsers: enrolledUsers,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getNewProjectPage = async (req, res, next) => {
  res.render("new-project", {
    isAuth: req.session.user ? true : false,
    rights: req.session.user.rights,
  });
};

exports.getNewtaskPage = async (req, res, next) => {
  const title = req.params.projectId;

  res.render("new-task", {
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
        id: student.id,
        name: student.data().name,
        email: student.data().email,
        status: student.data().status,
        rights: student.data().rights,
      };
    });

    return res.render("students", {
      students: data,
      isAuth: req.session.user ? true : false,
      rights: req.session.user.rights,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getNewUserPage = (req, res, next) => {
  res.render("new-user", {
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
        id: lead.id,
        name: lead.data().name,
        email: lead.data().email,
        status: lead.data().status,
        rights: lead.data().rights,
      };
    });

    return res.render("teamleads", {
      data: data,
      isAuth: req.session.user ? true : false,
      rights: req.session.user.rights,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getProfilePage = async (req, res, next) => {
  let projectData;
  let tasksData;

  let userId = req.session.user.userId;

  try {
    const projectSnapshot = await db
      .collection("enrolledProjects")
      .where("userId", "==", userId)
      .get();

    const taskSnapshot = await db
      .collection("TasktoUser")
      .where("userId", "==", userId)
      .get();

    if (projectSnapshot.empty) {
      projectData = [];
    }

    if (taskSnapshot.empty) {
      tasksData = [];
    }

    projectData = projectSnapshot.docs.map((project) => {
      return {
        id: project.id,
        name: project.data().title,
      };
    });

    tasksData = taskSnapshot.docs.map((task) => {
      return {
        id: task.id,
        name: task.data().name,
        projectTitle: task.data().project,
      };
    });

    return res.render("profile", {
      user: req.session.user,
      isAuth: req.session.user ? true : false,
      projects: projectData,
      tasks: tasksData,
    });
  } catch (e) {
    console.log(e.message);
  }
};

// view student's details
exports.getStudentDetailsPage = async (req, res) => {
  // user id
  const { name, id } = req.params;

  let projectData;
  let taskData;
  let commentsData;

  try {
    const projectsSnapshot = await db
      .collection("enrolledProjects")
      .where("userId", "==", id)
      .get();

    const taskSnapshot = await db
      .collection("TasktoUser")
      .where("userId", "==", id)
      .get();

    const commentsSnapshot = await db
      .collection("comments")
      .where("to", "==", id)
      .get();

    if (commentsSnapshot.empty) {
      commentsData = [];
    }

    if (projectsSnapshot.empty) {
      projectData = [];
    }
    if (taskSnapshot.empty) {
      taskData = [];
    }

    commentsData = commentsSnapshot.docs.map((comment) => {
      return {
        content: comment.data().content,
        from: comment.data().from,
        taskName: comment.data().task
      };
    });

    projectData = projectsSnapshot.docs.map((project) => {
      return {
        id: project.id,
        title: project.data().title,
        userId: project.data().title,
      };
    });

    taskData = taskSnapshot.docs.map((task) => {
      return {
        id: task.id,
        title: task.data().name,
        userId: task.data().userId,
      };
    });

    res.render("userDetailsPage", {
      studentId: id,
      studentName: name,
      isAuth: req.session.user ? true : false,
      rights: req.session.user.rights,
      projects: projectData,
      tasks: taskData,
      comments: commentsData,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getCommentsPage = async (req, res) => {
  const { taskTitle, taskId } = req.params;

  let commentsData;

  const commentsSnapshot = await db
    .collection("users")
    .doc(req.session.user.userId)
    .collection("tasks")
    .doc(taskId)
    .collection("comments")
    .get();

  if (commentsSnapshot.empty) {
    commentsData = [];
  }
  commentsData = commentsSnapshot.docs.map((comment) => {
    return {
      id: comment.id,
      content: comment.data().content,
      commentBy: comment.data().user,
    };
  });

  res.render("comments-page", {
    taskTitle: taskTitle,
    comments: commentsData,
    isAuth: req.session.user ? true : false,
    rights: req.session.user.rights,
  });
};

exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/auth/login");
};
