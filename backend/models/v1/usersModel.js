// const mongoose = require("mongoose");
// const validator = require("validator");


// const userSchema = new mongoose.Schema({
//     gender: {
//         type: String,
//         required: [true, "Please Enter Your Gender"],
//         maxLength: [10, "Gender cannot exceed 10 characters"],
//         minLength: [4, "Gender should have more than 4 characters"],
//     },
//     name: {
//         type: String,
//         required: [true, "Please Enter Your Name"],
//         maxLength: [30, "Name cannot exceed 30 characters"],
//         minLength: [4, "Name should have more than 4 characters"],
//     },
//     contact: {
//         type: String,
//         required: [true, "Please Enter Your 11 digit contact number"],
//         minLength: [11, "ontact number should have 11 characters"],
//     },
//     email: {
//         type: String,
//         required: [true, "Please Enter Your Email"],
//         unique: true,
//         validate: [validator.isEmail, "Please Enter a valid Email"],
//     },
//     password: {
//         type: String,
//         required: [true, "Please Enter Your Password"],
//         minLength: [8, "Password should be greater than 8 characters"],
//         select: false,
//     },
//     photoUrl: {
//         type: String,
//         required: true,
//     },
//     role: {
//         type: String,
//         default: "user",
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });


// const userModel = mongoose.model("User", userSchema);
// module.exports = userModel;











const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      validate: [validator.isEmail, "Provide a valid Email"],
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "Email address is required"],
    },
    password: {
      select: false,
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 6,
            minLowercase: 3,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 1,
          }),
        message: "Password {VALUE} is not strong enough.",
      },
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Passwords don't match!",
      },
    },

    role: {
      type: String,
      enum: ["candidate", "hiring-manager", "admin"],
      default: "candidate",
    },

    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters."],
      maxLength: [100, "Name is too large"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide a first name"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters."],
      maxLength: [100, "Name is too large"],
    },
    contactNumber: {
      type: String,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid contact number",
      ],
    },

    qualification:String,

    resumeURL: {
      type: String,
      validate: [validator.isURL, "Please provide a valid url"],
    },

    imageURL: {
      type: String,
      validate: [validator.isURL, "Please provide a valid url"],
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive", "blocked"],
    },

    appliedjobs: [
        {
            type: ObjectId,
            ref: "Job",
        },
    ],

    confirmationToken: String,
    confirmationTokenExpires: Date,

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const password = this.password;
  const hashedPassword = bcrypt.hashSync(password);
  this.password = hashedPassword;
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.comparePassword = function (password, hash) {
  const isPasswordCorrect = bcrypt.compareSync(password, hash);
  return isPasswordCorrect;
};

userSchema.methods.generateConfirmationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  this.confirmationToken = token;

  const date = new Date();

  date.setDate(date.getDate() + 1);
  this.confirmationTokenExpires = date;

  return token;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;