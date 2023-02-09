const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your full name"],
      trim: true,
      minLength: [3, "Name should be at least 3 characters"],
      maxLength: [40, "Name is too large"],
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Provide a valid Email!"],
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "Email is required!"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 6,
            minLowercase: 3,
            minNumbers: 1,
            minUppercase: 1,
            minSymbol: 1,
          }),
        messae: "Password {VALUE} is not strong enough.",
      },
    },
    confirmPassword: {
      type: String,
      trim: true,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Passwords doesn't match!",
      },
    },
    mobile: {
      type: String,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid contact number!",
      ],
      required: true,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Role value cannot be {VALUE}",
      },
      default: "user",
    },
    mobile: {
      type: String,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid contact number!",
      ],
      required: true,
    },
    gender: {
      type: String,
      required: [true, "Select Gender"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const hash = bcrypt.hashSync(this.password, saltRounds);

  this.password = hash;

  console.log(this.confirmPassword);
  // console.log(this.confirmPassword);
  this.confirmPassword = undefined;

  next();
});

userSchema.methods.comparePassword = function (password, hash) {
  const isPasswordValid = bcrypt.compareSync(password, hash); // true
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
