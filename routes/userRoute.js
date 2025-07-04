const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { restrictTo } = require("../middlewares/restrictTo");

router.use(isAuthenticated);
router.route("/me").get(isAuthenticated, userController.getMyInformation);


router
  .route("/")
  .get(
    restrictTo("Only admins are allowed", "admin"),
    userController.getAllUsers
  );

router
  .route("/:id")
  .get(
    restrictTo("Only admins are allowed", "admin"),
    userController.getUserByID
  )
  .delete(
    restrictTo("Only admins are allowed", "admin"),
    userController.deleteUserByID
  )
  .patch(
    restrictTo("Only admins are allowed", "admin"),
    userController.updateUserByID
  );




module.exports = router;
