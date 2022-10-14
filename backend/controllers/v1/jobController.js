const JobModel = require("./../../models/v1/jobsModel");

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
