const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age about  photoUrl";
// get all pending req of login user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const connenctionRequests = await ConnectionRequest.find({
      toUserId: loggedUser._id,
      status: "intrested",
      // }).populate("fromUserId", ["firstName", "lastName"]); //"firstName", "lastName" from req user
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    res.json({ message: "user requests are ", data: connenctionRequests });
  } catch (error) {
    res.status(400).send("error in pending req " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const connenctionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedUser._id, status: "accepted" },
        { fromUserId: loggedUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    const data = connenctionRequests.map((row) => {
      if (row.fromUserId._id.toString() == loggedUser._id.toString()) {
        return row.fromUserId;
      }
      return row.toUserId;
    });
    // res.send(connenctionRequests);
    res.send(connenctionRequests);
  } catch (error) {
    res.status(400).send("error in pending req " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    limit = limit > 50 ? 50 : limit;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedUser._id }, { toUserId: loggedUser._id }],
    }).select("fromUserId toUserId");
    const hideUserFromFeed = new Set(); // hide duplicate
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } }, // not in
        { _id: { $ne: loggedUser._id } }, // not equal
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({ message: "feed", data: user });
  } catch (error) {
    res.status(400).send("feed  " + error.message);
  }
});

module.exports = userRouter;
