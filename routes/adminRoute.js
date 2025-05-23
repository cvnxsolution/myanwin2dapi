const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router
  .route("/")
  .post(adminController.createAdmin)
  .get(adminController.getAllAdmin);

module.exports = router;
