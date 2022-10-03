const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const { isAuthenticated, isAdmin } = require("../middleware/auth_guard");

router.post("/new-user", isAuthenticated, isAdmin, adminController.createUser);

router.post("/new-project", isAuthenticated, adminController.createProject);

router.post(
  "/:projectTitle/new-task",
  isAuthenticated,
  adminController.createTask
);

router.put(
  "/edit-student/:id",
  isAuthenticated,
  adminController.changeStudentStatus
);

router.delete(
  "/delete-user/:userId",
  isAuthenticated,
  adminController.deleteUser
);

router.post(
  "/delete-project/:title",
  isAuthenticated,
  adminController.deleteProject
);

router.post("/delete/:taskId", isAuthenticated, adminController.deleteTask);

router.post(
  "/comment/:id/:taskId",
  isAuthenticated,
  adminController.addComment
);

router.post(
  "/assign-task/:projectId",
  isAuthenticated,
  adminController.assignTasks
);

module.exports = router;
