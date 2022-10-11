const db = require("../config").firestore();

const enrollToProject = async (req, res, next) => {
  const projectId = req.params.projectId;

  try {
    await db.collection("enrolledProjects").add({
      userId: req.session.user.userId,
      user: req.session.user,
      title: projectId,
    });

    res.redirect("/");
  } catch (err) {
    console.log(err.message);
  }
};

const taskDone = async (req, res) => {
  // get projectId from request
  const { projectId, taskName } = req.params;
  let progress;

  console.log(taskName);

  // get all tasks associated with the project
  db.collection("tasks")
    .where("projectId", "==", projectId)
    .where("name", "==", taskName)
    .get()
    .then((resp) => {
      resp.docs.forEach((doc) => {
        db.collection("tasks").doc(doc.id).update({ done: true });
      });
    })
    .then(() => {
      console.log("task marked as done!");
    })
    .catch((e) => console.log(e.message));

  // calculate the percentage from total tasks and the ones marked as done
};

const doneTasks = (req, res) => {
  let progress = 0;
  db.collection("tasks")
    .where("projectId", "==", projectId)
    .get()
    .then((resp) => {
      resp.docs.forEach((doc) => {
        if (doc.data().done) {
          var percentage = progress + (1 / resp.docs.length) * 100;
          console.log(percentage);
        }
      });
    });
};

module.exports = { enrollToProject, taskDone, doneTasks };
