// const express = require("express");




// const router = express.Router();



// router.route("/random").get(getRandomUser);
// router.route("/all").get(getAllUsers);
// router.route("/save").post(createUser);
// router.route("/update/:id").patch(updateUser);
// router.route("/delete/:id").delete(deleteUser);
// router.route("/random/:id").get(getUserDetails);
// router.route("/bulk-update").patch(updateMultipleUsers);







// module.exports = router;














const express = require('express');
const { verify } = require('jsonwebtoken');
const { verifyJWT } = require('../../middleware/verifyJWT');
const router = express.Router();

const UserController = require('./../../controllers/v1/usersController');


router.route('/user/signup').post(UserController.signup);

router.route('/user/login').post(UserController.login);


// inline verifyJWT middleware
router.route('/user/getMe').get(verifyJWT,UserController.getMe);





module.exports = router;