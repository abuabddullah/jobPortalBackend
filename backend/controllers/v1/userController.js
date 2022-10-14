const { generateToken } = require("../../utils/jwt");
const UserModel = require("./../../models/v1/usersModel");
exports.signup = async (req, res, next) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User Not Found",
      });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }
    if (user.status != "active") {
      return res.status(401).json({
        status: "fail",
        error: "Your account is not active yet.",
      });
    }
    const token = generateToken(user);
    const {password:pws, ...rest}=user.toObject();
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token,
      user:rest,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({email:req.user.email});
    res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
