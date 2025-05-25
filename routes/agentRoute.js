const express = require("express");
const router = express.Router();

const agentController = require("../controllers/agentController");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { restrictTo } = require("../middlewares/restrictTo");

router.use(isAuthenticated);

router.post(
  "/deposit",
  restrictTo("only agents are allowed", "agent"),
  agentController.deposit
);

router
  .route("/")
  .get(
    restrictTo("Only admins are allowed", "admin"),
    agentController.getAllAgents
  )
  .post(
    restrictTo("Only admins are allowed", "admin"),
    agentController.createAgent
  );

router
  .route("/:id")
  .get(
    restrictTo("Only admins are allowed", "admin"),
    agentController.getAgentByID
  )
  .delete(
    restrictTo("Only admins are allowed", "admin"),
    agentController.deleteAgentByID
  )
  .patch(
    restrictTo("Only admins are allowed", "admin"),
    agentController.updateAgentByID
  );

router.route("/me", isAuthenticated, agentController.getMyInformation);

module.exports = router;
