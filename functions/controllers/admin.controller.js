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

      let newUser = {
        name: name,
        email: email,
        status: status,
        rights: rights,
      };

      await db.collection("users").doc(user.uid).set(newUser);
      // redirect to student or teamlead accordingly
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

// create project
exports.createProject = async (req, res, next) => {
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

const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const { user } = require("firebase-functions/v1/auth");
const storage = getStorage();

// create project
exports.createTask = async (req, res, next) => {
  const projectTitle = req.params.projectTitle;

  let author = req.session.user.name;
  const { name, desc } = req.body;

  try {
    if (req.files !== null) {
      // data from the formData
      const file = req.files.myFile;

      // setup the storage reference for the file
      var storageRef = ref(storage, file.name);

      // set custom content type of file
      const metadata = {
        contentType: "video/mp4",
      };

      // upload via blob or file
      await uploadBytes(storageRef, file.data);
      console.log(`uploaded ${file.name} to storage`);
      // get the download url for the video
      url = await getDownloadURL(ref(storage, file.name));
    } else {
      url = "";
    }

    db.collection("tasks").add({
      projectId: projectTitle.toLowerCase(),
      name: name,
      description: desc,
      author: author,
      videoUrl: url,
    });

    console.log("task added to firestore");
  } catch (e) {
    console.log(e.message);
  }
};

// delete all the above
// user
exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    // delete the user and all records associated with the user
    await db.collection("users").doc(userId).delete();

    // enrolled projects
    const enrolledProjectQuery = await db
      .collection("enrolledProjects")
      .where("userId", "==", userId);
    enrolledProjectQuery.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        doc.ref.delete();
      });
      console.log(`deleted ${snapshot} successfully`);
    });

    // assigned tasks
    const assignedTaskQuery = await db
      .collection("TasktoUser")
      .where("userId", "==", userId);
    assignedTaskQuery
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.delete();
        });
      })
      .then(() => {
        console.log(`deleted record`);
      });

    // user comments
    const commentsQuery = await db
      .collection("comments")
      .where("to", "==", userId);
    commentsQuery
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.delete();
        });
      })
      .then(() => {
        console.log(`deleted record`);
      });

    return res.status(201).json({ msg: "successfully deleted" });
  } catch (e) {
    console.log(e.message);
  }
};

// projects + related tasks
exports.deleteProject = async (req, res, next) => {
  const projectTitle = req.params.title;

  try {
    await db.collection("projects").doc(projectTitle).delete();
    return res.redirect("/");
  } catch (e) {
    console.log(e.message);
  }
};

exports.deleteTask = async (req, res) => {
  const taskId = req.params.taskId;

  try {
    await db.collection("tasks").doc(taskId).delete();
    res.redirect("/");
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
  const projectId = req.params.projectId;

  const { taskName, userId, username } = req.body;

  let task = {
    name: taskName,
    userId: userId,
    username: username,
    project: projectId,
  };

  try {
    // create a tasks collection with name and userId
    await db.collection("TasktoUser").add(task);

    res.redirect("/");
  } catch (err) {
    console.log(err.message);
  }
};

exports.addComment = async (req, res) => {
  const { id, taskId } = req.params;
  const { comment, taskName } = req.body;

  let commentData = {
    content: comment,
    user: req.session.user.name,
    task: taskName,
  };

  let commentByAdmin = {
    content: comment,
    task: taskName,
    to: id,
    from: req.session.user.name,
  };

  try {
    await db
      .collection("users")
      .doc(id)
      .collection("tasks")
      .doc(taskId)
      .collection("comments")
      .add(commentData);

    await db.collection("comments").add(commentByAdmin);

    res.redirect(`/students`);
  } catch (e) {
    console.log(e.message);
  }
};
