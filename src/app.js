const express = require("express");
const User = require("./models/user");
const connectDb = require("./config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const app = express();
var cors = require("cors");

// env
require("dotenv").config();
// connecting with frontend

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

//  database connecting

connectDb()
  .then(() => {
    console.log("database is connecting succesfully 👍");
    app.listen(process.env.PORT, () => {
      console.log(` server is running in port⬆️  ${process.env.PORT} `);
    });
  })
  .catch(() => {
    console.log("database is not connecting 🤦‍♂️");
  });
