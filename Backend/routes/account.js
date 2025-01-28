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

  // Validate inputs
  const parsedData = transferValidation.safeParse({
    to,
    amount: Number(amount),
  });
  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsedData.error.errors,
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId } = req.user;
    const sender = await Account.findOne({ userId }).session(session);
    const receiver = await Account.findOne({ userId: to }).session(session);

    if (!sender) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Sender account not found" });
    }
    if (!receiver) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Receiver account not found" });
    }

    if (sender._id.equals(receiver._id)) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Cannot send money to own account" });
    }

    if (sender.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    await Promise.all([
      Account.updateOne({ userId }, { $inc: { balance: -amount } }).session(
        session
      ),
      Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(
        session
      ),
    ]);

    await session.commitTransaction();
    res.status(200).json({ message: "Transfer successful" });
  } catch (error) {
    await session.abortTransaction();
    console.error("Transfer failed:", error);
    next(error);
  } finally {
    session.endSession();
  }
});

module.exports = router;
