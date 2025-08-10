const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});

profileRouter.put("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error("Invalid data for profile update");
    } else {
      const loginUser = req.user;
      console.log(loginUser);

      Object.keys(req.body).forEach((key) => {
        loginUser[key] = req.body[key];
      });
      await loginUser.save();

      res.json({
        message: "Profile updated successfully",
        data: loginUser,
      });
      // console.log("Updated user data", loginUser);
    }
  } catch (error) {
    res.status(400).send("Error in updating profile " + error.message);
  }
});
module.exports = profileRouter;
