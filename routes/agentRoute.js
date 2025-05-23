const express = require("express");
const router = express.Router();

const agentController = require("../controllers/agentController");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { restrictTo } = require("../middlewares/restrictTo");

router.use(isAuthenticated);

router.post(
  "/deposit",
  restrictTo("only agents are allowed"),
  agentController.deposit
);

router
  .route("/")
  .all(restrictTo("only admins are allowed", "admin"))
  .get(agentController.getAllAgents)
  .post(agentController.createAgent);

module.exports = router;
