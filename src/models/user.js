const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email adress " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password " + value);
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this; // current instance
  const token = await jwt.sign({ _id: user._id }, "DEV@TINDER11", {
    expiresIn: "1d", //0d ,1d ,100d, 1h
  });
  return token;
};

// password
userSchema.methods.validatePassword = async function (passwordByInput) {
  const hashingPassword = this.password;
  const isPawordValid = await bcrypt.compare(passwordByInput, hashingPassword);
  return isPawordValid;
};
const User = mongoose.model("UserModel", userSchema);
module.exports = User;
