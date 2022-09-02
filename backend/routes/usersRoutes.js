const express = require("express");
const { getAllUsers, createUser, updateUser, deleteUser, getUserDetails } = require("../controllers/usersController");



const router = express.Router();



router.route("/all").get(getAllUsers);
router.route("/save").post(createUser);
router.route("/update/:id").patch(updateUser);
router.route("/delete/:id").delete(deleteUser);
router.route("/random/:id").get(getUserDetails);







module.exports = router;