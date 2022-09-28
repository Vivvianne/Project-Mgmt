const db = require("../config").firestore();

const enrollToProject = async (req, res, next) => {
  const projectId = req.params.projectId;
 
  try {
    await db.collection("enrolledProjects").doc().add({
      userId: req.session.user.userId,
      user: req.session.user,
      title: projectId,
    });

    res.redirect("/");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { enrollToProject };
