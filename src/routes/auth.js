const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { vailidateSignupData } = require("../utils/validation");

// adding users
authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    vailidateSignupData(req);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savesuser = await user.save();
    const token = await savesuser.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
    res.json({ message: "user addes successfully", data: savesuser });
  } catch (error) {
    res.status(400).send("Error in signup :" + error.message);
  }
});

// login user
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      // throw new Error("Invalid crendentials  ");
      return res.status(400).send("Please login");
    }
    const isPawordValid = await user.validatePassword(password);
    if (isPawordValid) {
      const token = await user.getJWT(); // from schema
      res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
      // res.json({ message: "User login successfull..", user: user });
      res.send(user);
    } else {
      throw new Error("Invalid crendentials");
    }
  } catch (error) {
    res.status(400).send("Login error " + error.message);
  }
});

// logout user
authRouter.post("/logout", async (req, res) => {
  // res.cookie("token", null, { expires: new Date(Date.now()) });
  // res.send("User logout successfull..");
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("User logout successfull..");
});

// reset password
authRouter.patch("/resetpassword", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not found with this emailId");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;
    await user.save();
    res.send("Reset password successfull..");
  } catch (error) {
    res.status(400).send("Error in resetting password: " + error.message);
  }
});
module.exports = authRouter;
