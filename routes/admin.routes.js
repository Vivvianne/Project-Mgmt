const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const { isAuthenticated, isAdmin } = require("../middleware/auth_guard");

router.post("/new-user", isAuthenticated, isAdmin, adminController.createUser);

router.post(
  "/new-topic",
  isAuthenticated,
  isAdmin,
  adminController.createTopic
);

router.post(
  "/:projectTitle/new-task",
  isAuthenticated,
  adminController.createTask
);

router.put(
  "/edit-student/:id",
  isAuthenticated,
  isAdmin,
  adminController.changeStudentStatus
);

router.delete(
  "/delete-user/:userId",
  isAuthenticated,
  isAdmin,
  adminController.deleteUser
);

router.post(
  "/delete-project/:title",
  isAuthenticated,
  isAdmin,
  adminController.deleteProject
);

router.post(
  "/delete/:taskId",
  isAuthenticated,
  isAdmin,
  adminController.deleteTask
);

router.get(
  "/students",
  isAuthenticated,
  isAdmin,
  adminController.getAllStudents
);

router.get(
  "/projects",
  isAuthenticated,
  isAdmin,
  adminController.getAllProjects
);

router.post(
  "/comment/:id/:taskId",
  isAuthenticated,
  adminController.addComment
);

router.post("/assign-task", isAuthenticated, adminController.assignTasks);

module.exports = router;
