const router = require("express").Router();

const {
  enrollToProject,
  taskDone,
  doneTasks,
} = require("../controllers/user.controllers");

const { isAuthenticated } = require("../middleware/auth_guard");

router.post("/enroll/:projectId", isAuthenticated, enrollToProject);

router.post("/done/:projectId/:taskName", isAuthenticated, taskDone);

router.post("/doneTasks/:projectId", doneTasks);

module.exports = router;
