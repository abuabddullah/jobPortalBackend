const express = require('express');
const router = express.Router();
const {verifyJWT} = require('./../../middleware/verifyJWT');

const userController = require('./../../controllers/v1/userController.js');

router.route('/user/signup').post(userController.signup);
router.route('/user/login').post(userController.login);
router.route('/user/me').get(verifyJWT,userController.getMe);



module.exports = router;
