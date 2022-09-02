const mongoose = require("mongoose");
const validator = require("validator");


const userSchema = new mongoose.Schema({
    gender: {
        type: String,
        required: [true, "Please Enter Your Gender"],
        maxLength: [10, "Gender cannot exceed 10 characters"],
        minLength: [4, "Gender should have more than 4 characters"],
    },
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    },
    contact: {
        type: String,
        required: [true, "Please Enter Your 11 digit contact number"],
        minLength: [11, "ontact number should have 11 characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    photoUrl: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const userModel = mongoose.model("User", userSchema);
module.exports = userModel;