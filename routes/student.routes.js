const router = require("express").Router();

const {
  enrollToCourse,
  enrolledCourses,
} = require("../controllers/user.controllers");

router.post("/enroll/:projectId", enrollToCourse);

// router.get("/enrolled-courses", enrolledCourses);

module.exports = router;
