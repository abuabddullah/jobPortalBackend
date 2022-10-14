const ApiFeatures = require("../../utils/apiFeatures");
const JobsModel = require("./../../models/v1/jobsModel");
const UsersModel = require("./../../models/v1/usersModel");

// cadidate controllers
//  filter jobs by location, job type, salary range and also able to sort jobs
exports.getAllJobs = async (req, res, next) => {
  try {
    const apiFeature = new ApiFeatures(JobsModel.find(), req.query)
      .filter()
      .sort();

    const jobs = await apiFeature.query;

    res.status(200).json({
      status: "success",
      data: {
        jobs,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getAJob = async (req, res, next) => {
  try {
    const job = await JobsModel.findById(req.params.id);
    if (!job) {
      res.status(404).json({
        status: "fail",
        message: "No job found with this id",
      });
    }
    // const hiringManager = await UsersModel.findById(job.hiringBy.id);
    res.status(200).json({
      status: "success",
      data: {
        job,
        // hiringManager,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.applyAJob = async (req, res, next) => {
  try {
    // 1. find job by req.params.id if not found send res
    const job = await JobsModel.findById(req.params.id);
    if (!job) {
      res.status(404).json({
        status: "fail",
        message: "No job found with this id",
      });
    }
    // 2. check if user already applied for this job if yes send res
    if (job.candidates.includes(req.user._id)) {
      res.status(404).json({
        status: "fail",
        message: "You have already applied for this job",
      });
    }
    // 3. check if the deadline is passed if yes send res
    if (job.deadline < new Date()) {
      res.status(404).json({
        status: "fail",
        message: "You can't apply for this job because deadline is over",
      });
    }
    // 4. if all above conditions are false then FIND CANDIDATE if not found send res
    const candidate = await UsersModel.findById(req.user._id);
    if (!candidate) {
      res.status(404).json({
        status: "fail",
        message: "No candidate found with this id",
      });
    }
    // 5. if all above conditions are false then push candidate to job.candidates array
    job.candidates.push(candidate);
    // 6. increase candidate.appliedJobs by 1
    job.applyCount = job.applyCount + 1;
    // 7. save job
    await job.save({ validateBeforeSave: false });

    // 8. send final res
    res.status(200).json({
      status: "success",
      data: {
        job,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// authorized controllers
exports.createAJob = async (req, res, next) => {
  try {
    const job = await JobsModel.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Job created successfully",
      job,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllJobsByManager = async (req, res, next) => {
  try {
    const jobs = await JobsModel.find({ manager: req.user._id });
    res.status(200).json({
      status: "success",
      message: "All jobs by manager",
      jobs,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAJobByManager = async (req, res, next) => {
  try {
    const jobID = req.params.id;
    const jobs = await JobsModel.find({ manager: req.user._id });
    if (!jobs) {
      return res.status(404).json({
        status: "fail",
        message: "Job not found",
      });
    }
    const job = jobs.find((job) => job._id == jobID);
    res.status(200).json({
      status: "success",
      message: "A job by manager",
      job,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateAJobById = async (req, res, next) => {
  try {
    const jobID = req.params.id;
    const job = await JobsModel.findByIdAndUpdate(jobID, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) {
      return res.status(404).json({
        status: "fail",
        message: "Job not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Job updated successfully",
      job,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
