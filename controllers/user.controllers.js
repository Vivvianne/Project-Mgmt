const db = require("../config").firestore();

const enrollToCourse = async (req, res, next) => {
  const projectId = req.params.projectId;

  let newCourse = {
    title: projectId,
  };

  try {
    await db
      .collection("users")
      .doc(req.session.uid)
      .collection("courses")
      .doc(projectId)
      .set(newCourse);

    res.redirect("/");
  } catch (err) {
    console.log(err.message);
  }
};

// const enrolledCourses = async (req, res, next) => {
//   const snapshot = await db
//     .collection("users")
//     .doc(req.session.uid)
//     .collection("courses")
//     .get();
//   if (snapshot.empty) {
//     res.json({ msg: "no courses enrolled yet" });
//   }

//   let data = snapshot.docs.map((course) => {
//     return {
//       title: course.data().title,
//     };
//   });
//   res.status(200).json({ data: data });
// };

module.exports = { enrollToCourse };
