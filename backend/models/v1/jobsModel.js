const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongoose.Schema.Types;

const dateVar = new Date();

dateVar.setDate(dateVar.getDate() + 3);

const jobSchema = mongoose.Schema(
  {
    applyCount: {
      type: Number,
      default: 0,
      min: [0, "Apply count cannot be less than 0"],
    },
    salary: {
      type: Number,
      required: [true, "Please enter the salary"],
      min: [0, "Salary cannot be less than 0"],
    },
    location: {
      type: String,
      required: [true, "Please enter the location"],
    },
    description: {
      type: String,
      required: [true, "Please enter the description"],
      min: [50, "Description cannot be less than 50"],
      max: [1000, "Description cannot be more than 1000 characters"],
    },
    title: {
      type: String,
      required: [true, "Please enter the title"],
      min: [5, "Title cannot be less than 5"],
      max: [100, "Title cannot be more than 100 characters"],
    },
    company: {
      type: String,
      required: [true, "Please enter the company"],
      min: [5, "Company cannot be less than 5"],
      max: [100, "Company cannot be more than 100 characters"],
    },
    jobType: {
      type: String,
      required: [true, "Please enter the job type"],
      enum: {
        values: ["Full Time", "Part Time", "Contract", "Internship"],
        message:
          "{VALUE} is not acceptable. Please select the correct job type Full Time, Part Time, Contract, Internship",
      },
    },
    hiringBy: {
      name: {
        type: String,
        required: [true, "Please enter the hiring manager name"],
      },
      id: {
        type: ObjectId,
        ref: "User",
        required: [true, "Please enter the hiring manager id"],
      },
    },
    candidates: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    deadline: {
      type: Date,
      required: [true, "Please enter the deadline"],
      default: dateVar,
    },
    resumeURL: {
      type: String,
    },

  },
  {
    timestamps: true,
  }
);

const JobModel = mongoose.model("Job", jobSchema);

module.exports = JobModel;
