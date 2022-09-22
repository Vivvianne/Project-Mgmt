const router = require("express").Router();
const landingPageController = require("../controllers/landingPage.controller");

const { isAuthenticated } = require("../middleware/auth_guard");

router.get("/", landingPageController.getLandingPage);

router.get(
  "/projects/:id",
  isAuthenticated,
  landingPageController.getProjectDetailsPage
);

router.get(
  "/new-topic",
  isAuthenticated,
  landingPageController.getNewProjectPage
);

router.get("/students", isAuthenticated, landingPageController.getStudentsPage);

router.get("/new-user", isAuthenticated, landingPageController.getNewUserPage);

router.get(
  "/teamleads",
  isAuthenticated,
  landingPageController.getTeamleadsPage
);

router.get(
  "/:projectId/new-program",
  isAuthenticated,
  landingPageController.getNewProgramPage
);

router.get("/profile", isAuthenticated, landingPageController.getProfilePage);

router.get("/logout", landingPageController.logout);

module.exports = router;
