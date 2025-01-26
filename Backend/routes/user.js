const express = require("express");
const router = express.Router();
const { User, Account } = require("../database/db");
const jwt = require("jsonwebtoken");
const { userSignup, userSignin, userUpdate } = require("../validation");
const { genSalt, hash, compare } = require("bcrypt");
const authMiddleware = require("../middlewares/middleware");
router.get("/", (req, res) => {
  res.send("hello from user router");
});

// SIGNUP
router.post("/signup", async (req, res, next) => {
  const { username, firstname, lastname, password } = req.body;
  const parsedData = userSignup.safeParse({
    username,
    firstname,
    lastname,
    password,
  });
  if (!parsedData.success) {
    return res.status(411).json({
      message: "incorect inputs",
    });
  }
  try {
    const isUser = await User.findOne({ username });
    if (isUser) {
      return res.status(411).json({
        message: "Email already Taken",
      });
    }
    // Password hashing
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const newUser = await User.create({
      username,
      firstname,
      lastname,
      password: hashedPassword,
    });
    await Account.create({
      userId: newUser._id,
      balance: 1 + Math.floor(Math.random() * 10000),
    });
    const authToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
    res.status(200).json({
      message: "User created sucessfully",
      token: authToken,
    });
  } catch (error) {
    next(error);
  }
});

// SIGNIN
router.post("/signin", async (req, res, next) => {
  const { username, password } = req.body;
  const parsedData = userSignin.safeParse({ username, password });
  if (!parsedData.success) {
    return res.status(411).json({
      message: "incorect inputs",
    });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(411).json({
        message: "No user found",
      });
    }
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      return res.status(411).json({
        message: "Invalid password. Please try again.",
      });
    }
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      message: "User created sucessfully",
      token: authToken,
    });
  } catch (error) {
    next(error);
  }
});

// UPDATE USER DETAILTS
router.put("/", authMiddleware, async (req, res, next) => {
  const { password, firstname, lastname } = req.body;
  const { userId } = req.user;
  try {
    const parsedData = userUpdate.safeParse({ password, firstname, lastname });
    if (!parsedData.success) {
      res.status(411).json({
        message: "Invalid Inputs",
      });
    }
    // Password hashing
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    const user = await User.findById({ _id: userId });
    const updatedUser = await User.updateOne(
      { _id: userId },
      {
        firstname: firstname || user.firstname,
        lastname: lastname || user.lastname,
        password: hashedPassword || user.password,
      }
    );
    res.status(200).json({
      message: "Updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

// SEARCH USER
router.get("/bulk", authMiddleware, async (req, res, next) => {
  const { filter } = req.query;
  try {
    const allUsers = await User.find({
      $or: [
        { firstname: { $regex: filter, $options: "i" } },
        { lastname: { $regex: filter, $options: "i" } },
      ],
    }).select("firstname lastname");
    res.status(200).json({
      users: allUsers,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
