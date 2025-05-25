const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { isAuthenticated } = require("../middlewares/isAuthenticated");

router
  .route("/")
  .post(adminController.createAdmin)
  .get(adminController.getAllAdmin);

router.route("/me", isAuthenticated, adminController.getMyInformation);

router
  .route("/:id")
  .get(
    restrictTo("Only admins are allowed", "admin"),
    adminController.getAdminByID
  )
  .delete(
    restrictTo("Only admins are allowed", "admin"),
    adminController.deleteAdminByID
  )
  .patch(
    restrictTo("Only admins are allowed", "admin"),
    adminController.updateAdminByID
  );

module.exports = router;
