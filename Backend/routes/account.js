const { Router } = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/middleware");
const { Account } = require("../database/db");
const { transferValidation } = require("../validation");
const router = Router();

router.get("/", (req, res) => {
  res.send("hello from account router");
});

router.get("/balance", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;
  try {
    const account = await Account.findOne({ userId: userId });
    res.status(200).json({
      balance: account.balance,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/transfer", authMiddleware, async (req, res, next) => {
  const { to, amount } = req.body;

  const parsedData = transferValidation.safeParse({ to, amount });
  if (!parsedData.success) {
    return res.status(400).json({ message: "Invalid account/Invalid amount" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId } = req.user;
    console.log(userId);
    const sender = await Account.findOne({ userId }).session(session);
    const receiver = await Account.findOne({ userId: to }).session(session);

    if (!sender || !receiver) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid account" });
    }

    if (sender.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient Balance" });
    }

    await Account.updateOne({ userId }, { $inc: { balance: -amount } }).session(
      session
    );

    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();
    res.status(200).json({ message: "Transfer successful" });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

module.exports = router;
