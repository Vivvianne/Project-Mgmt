const {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} = require("firebase/auth");

const db = require("../config").firestore();
const app = require("../db");

const auth = getAuth(app);

// create user
exports.createUser = async (req, res, next) => {
  const { name, email, password, status, rights } = req.body;

  if (
    name != undefined ||
    email != undefined ||
    password != undefined ||
    status != undefined ||
    rights != undefined
  ) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      let user = auth.currentUser;
      await updateProfile(user, { displayName: name });
      console.log(user);

      let newUser = {
        name: name,
        email: email,
        status: status,
        rights: rights,
      };

      await db.collection("users").doc(user.uid).set(newUser);
      if (rights === "student") {
        return res.redirect("/students");
      } else if (rights === "teamlead") {
        return res.redirect("/teamleads");
      } else {
        return res.redirect("/");
      }
    } catch (err) {
      console.log(err.message);
    }
  }
};

// create topic
exports.createTopic = async (req, res, next) => {
  const { title, desc } = req.body;

  try {
    await db
      .collection("projects")
      .doc(title.toLowerCase())
      .set({ title: title, description: desc });

    return res.redirect("/");
  } catch (e) {
    console.log(e.message);
    res.status(401).send("failed to");
  }
};

// create project
exports.createProgram = async (req, res, next) => {
  const projectTitle = req.params.projectTitle;

  const { name, desc, video } = req.body;

  let author = req.session.user.name;

  const program = {
    name: name,
    description: desc,
    author: author,
  };

  try {
    await db
      .collection("projects")
      .doc(projectTitle.toLowerCase())
      .collection("programs")
      .add({ program });

    return res.redirect(`/projects/${projectTitle}`);
  } catch (e) {
    console.log(e.message);
  }
};

// delete all the above
// user
exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;
  const collectionName = req.body.name;

  try {
    await db.collection(collectionName).doc(userId).delete();

    return res.status(201).json({ msg: "successfully deleted" });
  } catch (e) {
    console.log(e.message);
  }
};

// projects + related programs
exports.deleteProject = async (req, res, next) => {
  const projectTitle = req.params.title;

  try {
    await db.collection("projects").doc(projectTitle).delete();
    return res.redirect("/");
  } catch (e) {
    console.log(e.message);
  }
};

// view all students + team leads
// students
exports.getAllStudents = async (req, res, next) => {
  let data;

  try {
    const snapshot = await db.collection("students").get();
    if (snapshot.empty) {
      data = [];
    }

    data = snapshot.docs.map((student) => {
      return {
        name: student.data().name,
        email: student.data().email,
        status: student.data().status,
      };
    });

    return res.status(200).json({ data: data });
  } catch (e) {
    console.log(e.message);
  }
};

// projects
exports.getAllProjects = async (req, res, next) => {
  let data;

  try {
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

    return res.status(200).json({ data: data });
  } catch (e) {
    console.log(e.messaage);
  }
};

// programs
exports.getProjectPrograms = async (req, res, next) => {
  const projectTitle = req.params.projectTitle;

  let data;

  try {
    const snapshot = await db
      .collection("projects")
      .doc(projectTitle.toLowerCase())
      .collection("programs")
      .get();

    if (snapshot.empty) {
      data = [];
    }

    data = snapshot.docs.map((project) => {
      return {
        title: project.data().program,
      };
    });

    return res.status(200).json({ data: data });
  } catch (e) {
    console.log(e.message);
  }
};

// make student active/inactive
exports.changeStudentStatus = async (req, res, next) => {
  const id = req.params.id;
  const status = req.body.status;

  try {
    await db.collection("students").doc(id).update({ status: status });
    return res.status(201).json({ msg: "success" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ msg: e.message });
  }
};

// assign tasks to students and team leads
exports.assignTasks = async (req, res) => {
  const { taskName, userId } = req.body;

  task = {
    name: taskName,
  };

  try {
    await db
      .collection("users")
      .doc(userId)
      .collection("tasks")
      .doc()
      .set(task);

    console.log(`Task assigned to user ${userId}`);
    
    res.redirect("/");
  } catch (err) {
    console.log(err.message);
  }
};
