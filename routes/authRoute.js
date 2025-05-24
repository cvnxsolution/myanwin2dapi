const express = require("express");
const router = express.Router();
const limiter = require("../middlewares/limiter");

const { isAuthenticated } = require("../middlewares/isAuthenticated");
const authController = require("../controllers/authController");
const { restrictTo } = require("../middlewares/restrictTo");

router.route("/login").post(limiter.loginLimiter, authController.login);
router.route("/signup").post(limiter.signUpLimiter, authController.signUp);

router.use(isAuthenticated);

router
  .route("/")
  .get(
    restrictTo("Only admins are allowed", "admin"),
    authController.getAllAuthAccounts
  );

module.exports = router;
