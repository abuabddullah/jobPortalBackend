const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const userModel = require("../models/usersModel");
const ApiFeatures = require("../utils/apiFeatures");



// create a user - AdminRoute
exports.createUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const user = await userModel.create(req.body);
    res.status(201).json({
        success: true,
        user,
    });
})


// Get All users
exports.getAllUsers = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const limit = req.query.limit;
    const usersCount = await userModel.countDocuments();

    const apiFeature = new ApiFeatures(userModel.find(), req.query)
        .pagination(limit);

    const users = await apiFeature.query;

    res.status(200).json({
        success: true,
        message: limit && limit <= usersCount ? `${limit} user is showing out of ${usersCount} users` : `All ${usersCount} users are showing`,
        users,
    });
});


// update a User - AdminRoute
exports.updateUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const id = req.params.id;
    const updateInfo = req.body;
    const user = await userModel.findById(id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        updatedUser,
    });
})


// delete a User - AdminRoute
exports.deleteUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const id = req.params.id;
    const user = await userModel.findById(id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    await user.remove();
    // await productModel.findByIdAndDelete(id); // এটাও চলবে

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
})


// Get User details by ID
exports.getUserDetails = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const id = req.params.id;
    const user = await userModel.findById(id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    res.status(200).json({
        success: true,
        message: "getUserDetails route is working",
        user,
    });
})


// Get a random user from the database
exports.getRandomUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const users = await userModel.find();
    const randomUser = users[Math.floor(Math.random() * users.length)];
    res.status(200).json({
        success: true,
        message: "getRandomUser route is working",
        randomUser,
    });
})