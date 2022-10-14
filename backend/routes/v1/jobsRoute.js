const express = require('express');
const { verifyJWT } = require('../../middleware/verifyJWT.js');
const { verifyRole } = require('../../middleware/verifyRole.js');
const router = express.Router();

const jobController = require('./../../controllers/v1/jobController.js');



// cadidate routes
router.route('/jobs').get(jobController.getAllJobs);
router.route('/jobs/:id').get(jobController.getAJob);



// authorized routes
router.use(verifyJWT,verifyRole("hiring-manager","admin"));
router.route('/jobs').post(jobController.createAJob);
router.route('/manager/jobs').get(jobController.getAllJobsByManager);





router.route('/manager/jobs/:id').get(jobController.getAJobByManager);
router.route('/jobs/:id').patch(jobController.updateAJobById);



module.exports = router;