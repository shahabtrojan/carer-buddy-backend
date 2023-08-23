var express = require("express");
var router = express.Router();

const {
  signup,
  login_user,
  //   logout,
  get_profile,
  add_interest,
  add_location,
  add_disease,
} = require("../controllers/user");

const auth = require("../middleware/authenticate");

router.route("/signup").post(signup);
router.route("/login").post(login_user);
// router.route("/logout").get(logout);
router.route("/profile").get(auth, get_profile);
router.route("/interest").post(auth, add_interest);
router.route("/location").post(auth, add_location);
router.route("/disease").post(auth, add_disease);

module.exports = router;