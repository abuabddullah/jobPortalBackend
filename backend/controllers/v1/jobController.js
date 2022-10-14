const ApiFeatures = require("../../utils/apiFeatures");
const JobModel = require("./../../models/v1/jobsModel");

// cadidate controllers
//  filter jobs by location, job type, salary range and also able to sort jobs
exports.getAllJobs = async (req, res, next) => {
  try {
    const { limit = 0 } = req.query;
    const jobsCount = await JobModel.countDocuments();
    const apiFeature = new ApiFeatures(JobModel.find(), req.query)
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
    const job = await JobModel.findById(req.params.id);
    if (!job) throw new Error("No job found with this id");
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
    const job = await JobModel.create(req.body);
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
    const jobs = await JobModel.find({ manager: req.user._id });
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
    const jobs = await JobModel.find({ manager: req.user._id });
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
    const job = await JobModel.findByIdAndUpdate(jobID, req.body, {
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
