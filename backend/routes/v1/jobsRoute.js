const express = require('express');
const { verifyJWT } = require('../../middleware/verifyJWT.js');
const { verifyRole } = require('../../middleware/verifyRole.js');
const router = express.Router();

const jobController = require('./../../controllers/v1/jobController.js');



// cadidate routes
// router.route('/jobs').get(jobController.getAllJobs);
// router.route('/jobs/:id').get(jobController.getAJob);



// authorized routes
// router.use(verifyJWT,verifyRole("hiring-manager","admin"));
router.route('/jobs').post(verifyJWT,verifyRole("hiring-manager","admin"),jobController.createAJob).get(jobController.getAllJobs);
router.route('/manager/jobs').get(verifyJWT,verifyRole("hiring-manager","admin"),jobController.getAllJobsByManager);





router.route('/manager/jobs/:id').get(verifyJWT,verifyRole("hiring-manager","admin"),jobController.getAJobByManager);
router.route('/jobs/:id').patch(verifyJWT,verifyRole("hiring-manager","admin"),jobController.updateAJobById).get(jobController.getAJob);
router.route('/jobs/:id/apply').post(verifyJWT,jobController.applyAJob);



module.exports = router;