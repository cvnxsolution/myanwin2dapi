const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { restrictTo } = require("../middlewares/restrictTo");
const betController = require("../controllers/betController");

router
  .route("/")
  .post(
    isAuthenticated,
    restrictTo("only users are allowed", "user"),
    betController.createBet
  );

module.exports = router;
