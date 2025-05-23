const express = require("express");
const router = express.Router();
const limiter = require("../middlewares/limiter");

const authController = require("../controllers/authController");

router.route("/login").post(limiter.loginLimiter, authController.login);
router.route("/signup").post(authController.signUp);

router.route("/").get(authController.getAllAuthAccounts);

module.exports = router;
