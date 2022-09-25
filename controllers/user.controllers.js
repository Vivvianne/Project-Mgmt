const db = require("../config").firestore();

const enrollToCourse = async (req, res, next) => {
  const projectId = req.params.projectId;

  let newCourse = {
    title: projectId,
  };

  try {
    await db
      .collection("users")
      .doc(req.session.user.userId)
      .collection("courses")
      .doc(projectId)
      .set(newCourse);

    res.redirect("/");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { enrollToCourse };
