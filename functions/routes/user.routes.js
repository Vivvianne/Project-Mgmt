const router = require("express").Router();

const { enrollToProject } = require("../controllers/user.controllers");

router.post("/enroll/:projectId", enrollToProject);

module.exports = router;
