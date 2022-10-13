// const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
// const userModel = require("../models/usersModel");
// const ApiFeatures = require("../utils/apiFeatures");



// // create a user - AdminRoute
// exports.createUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
//     const user = await userModel.create(req.body);
//     res.status(201).json({
//         success: true,
//         user,
//     });
// })


// // Get All users
// exports.getAllUsers = catchAsyncErrorsMiddleware(async (req, res, next) => {
//     const limit = req.query.limit;
//     const usersCount = await userModel.countDocuments();

//     const apiFeature = new ApiFeatures(userModel.find(), req.query)
//         .pagination(limit);

//     const users = await apiFeature.query;

//     res.status(200).json({
//         success: true,
//         message: limit && limit <= usersCount ? `${limit} user is showing out of ${usersCount} users` : `All ${usersCount} users are showing`,
//         users,
//     });
// });


// // update a User - AdminRoute
// exports.updateUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
//     const id = req.params.id;
//     const updateInfo = req.body;
//     const user = await userModel.findById(id);
//     if (!user) {
//         return res.status(404).json({
//             success: false,
//             message: "User not found",
//         });
//     }
//     const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false,
//     });
//     res.status(200).json({
//         success: true,
//         message: "User updated successfully",
//         updatedUser,
//     });
// })


// // delete a User - AdminRoute
// exports.deleteUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
//     const id = req.params.id;
//     const user = await userModel.findById(id);
//     if (!user) {
//         return res.status(404).json({
//             success: false,
//             message: "User not found",
//         });
//     }

//     await user.remove();
//     // await productModel.findByIdAndDelete(id); // এটাও চলবে

//     res.status(200).json({
//         success: true,
//         message: "User deleted successfully",
//     });
// })


// // Get User details by ID
// exports.getUserDetails = catchAsyncErrorsMiddleware(async (req, res, next) => {
//     const id = req.params.id;
//     const user = await userModel.findById(id);
//     if (!user) {
//         return res.status(404).json({
//             success: false,
//             message: "User not found",
//         });
//     }
//     res.status(200).json({
//         success: true,
//         message: "getUserDetails route is working",
//         user,
//     });
// })


// // Get a random user from the database
// exports.getRandomUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
//     const users = await userModel.find();
//     const randomUser = users[Math.floor(Math.random() * users.length)];
//     res.status(200).json({
//         success: true,
//         message: "getRandomUser route is working",
//         randomUser,
//     });
// })

// // update multiple users information based on given id and information through body
// exports.updateMultipleUsers = catchAsyncErrorsMiddleware(async (req, res, next) => {
//     const users = await userModel.updateMany(
//         { _id: { $in: req.body.ids } },
//         { $set: { name: req.body.name } }
//     );
//     res.status(200).json({
//         success: true,
//         message: "updateMultipleUsers route is working",
//         users,
//     });
// })















const UserModel = require("./../../models/v1/usersModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../utils/jwt");
// const { sendMailWithGmail } = require("../../utils/sendMailWithGmail");

/**
 *
 * 1. reciving user detials from req.body
 * 2. create user
 * 3. generating token, token expires date and setling it in db UserModel
 * 4. saving the updated info(token,expTokenDt) in db
 * 5. sending email to user with token
 */
exports.signup = async (req, res, next) => {
  try {
    const userInfo = req.body;
    const user = await UserModel.create(userInfo);
    const token = user.generateConfirmationToken(); // customk method in UserModel
    await user.save({ validateBeforeSave: false });


    /* const mailData = {
      to: [user.email],
      subject: "Verify your Account",
      text: `Thank you for creating your account. Please confirm your account here: ${
        req.protocol
      }://${req.get("host")}${req.originalUrl}/confirmation/${token}`,
    };
    await sendMailWithGmail(mailData); */
    
    
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};




/* exports.confirmEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await UserModel.findOne({ confirmationToken: token });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }
    const isExpired = new Date() > new Date(user.confirmationTokenExpires);

    if (isExpired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired",
      });
    }

    user.status = "active";
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;

    // user.save({ validateBeforeSave: false });
    // await user.save({ validateBeforeSave: false });

    // alternative to .save()
    await user.update(
      {
        status: "active",
        confirmationToken: undefined,
        confirmationTokenExpires: undefined,
      },
      { validateBeforeSave: false }
    );

    res.status(200).json({
      success: true,
      message: "Email confirmed successfully",
      user,
    });
  } catch (error) {
    // console.log(error)
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}; */




/**
 * 1. Check if Email and password are given
 * 2. Load user with email
 * 3. if not user send res
 * 4. compare password
 * 5. if password not correct send res
 * 6. check if user is active
 * 7. if not active send res
 * 8. generate token
 * 9. remove password from user response
 * 10. send user and token
 */

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check if Email and password are given
    if (!email || !password) {
      throw new Error("Please provide email and password");
    }

    // 2. Load user with email
    /**
     * যেহেতু UserModel এ আমরা select: false দিয়েছি password এর জন্য তাই normally এটা দেখাবে না কিন্তু আমরা এখানে token generate করার সময় দেখাতে চাই তাই আমরা এখানে select করে নিচ্ছি
     */
    const user = await UserModel.findOne({ email }).select("+password");

    // 3. if not user send res
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // 4. compare password
    const isPasswordCorrect = user.comparePassword(password, user.password);

    // 5. if password not correct send res
    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }

    // 6. check if user is active
    // 7. if not active send res
    if (user.status !== "active") {
      throw new Error("User is not active");
    }

    // 8. generate token
    const token = generateToken(user);

    // 9. remove password from user response
    /**
     * 9.1 : প্রথমে আমরা rest-operator এর সাহায্যে password বাদে user-variable এ বাকি যা আছে সে সব জিনিস rest নামক variaboe এ রাখবো।
     * 9.2 : এক্ষেত্রে পূরবে যেহেতু already password নামক variable use করা হয়েগেছে তাই password এর নামে edit করে pwd নামে রাখবো।
     * 9.3 : এবার console করলে দেখা যাবে যে rest-variable এর ভিতরে mongoose generated অনেক extra information আছে। এগুলো আমরা বাদ দিবো user.toObject() method এর মাধ্যমে।
     *  */
    const { password: pwd, ...rest } = user.toObject();
    /** alternative way to remove password from user
     * alt1: user.password = undefined;
     * alt2: delete user.password;
     * alt3: delete user["password"];
     *  */

    //  10. send user and token
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: rest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const userInfo = req.user; // here req.user = {email:kdjflkd,password:#####,iat:12345678,exp:12345678} recieved from auth middleware verifyJWT

    const user = await UserModel.findOne({ email: userInfo.email });
    res.status(200).json({
      success: true,
      message: "User details",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};