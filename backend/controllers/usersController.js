const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const userModel = require("../models/usersModel");



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
    const users = await userModel.find();
    res.status(200).json({
        success: true,
        message: "getAllUsers route is working",
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