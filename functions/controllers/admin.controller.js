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
const storage = getStorage();

// create project
exports.createTask = async (req, res, next) => {
  const projectTitle = req.params.projectTitle;

  let author = req.session.user.name;
  const { name, desc } = req.body;
  // data from the formData
  const file = req.files.myFile;

  // setup the storage reference for the file
  var storageRef = ref(storage, file.name);

  // set custom content type of file
  const metadata = {
    contentType: "video/mp4",
  };

  try {
    // upload via blob or file
    await uploadBytes(storageRef, file.data, metadata);
    console.log(`uploaded ${file.name} to storage`);
    // get the download url for the video
    getDownloadURL(ref(storage, file.name)).then((url) => {
      db.collection("tasks")
        .add({
          projectId: projectTitle.toLowerCase(),
          name: name,
          description: desc,
          author: author,
          videoUrl: url,
        })
        .then(() => {
          console.log("task added to firestore");
        });
    });
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

  const { taskName, userId } = req.body;

  let task = {
    name: taskName,
    userId: userId,
    project: projectId,
  };

  try {
    // create a tasks collection with name and userId
    await db.collection("tasks").add(task);

    await db.collection("TasktoUser").add(task);

    console.log(`Task assigned to user ${userId}`);
    res.redirect("/");
  } catch (err) {
    console.log(err.message);
  }
};

exports.addComment = async (req, res) => {
  const { id, taskId } = req.params;
  const commentContent = req.body;

  let comment = {
    content: commentContent,
    user: req.session.user.name,
  };

  let commentByAdmin = {
    content: commentContent,
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
      .add(comment);

    await db.collection("comments").add(commentByAdmin);

    res.redirect(`/students`);
  } catch (e) {
    console.log(e.message);
  }
};
