const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = mongoose.Schema(
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
        message: "role value cannot be {VALUE}",
      },
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const password = this.password;

  bcrypt.hash(password, saltRounds, function (err, hash) {
    this.password = hash;
    this.confirmPassword = undefined;
  });

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;