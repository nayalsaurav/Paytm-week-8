const { Router } = require("express");
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
    const account = await Account.findOne({ userId });
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

  const session = await mongoose.startSession(); // Start a new session for the transaction.
  session.startTransaction(); // Begin a transaction within the session.

  try {
    const { userId } = req.user;

    const sender = await Account.findOne({ _id: userId }).session(session);

    if (!sender || sender.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient Balance" });
    }

    // Fetch receiver's account using the transaction session.
    const receiver = await Account.findOne({ _id: to }).session(session);

    if (!receiver) {
      await session.abortTransaction(); // Abort transaction
      return res.status(400).json({ message: "Invalid account" });
    }

    await Account.updateOne(
      { _id: userId },
      { $inc: { balance: -amount } }
    ).session(session);

    await Account.updateOne({ _id: to }, { $inc: { balance: amount } }).session(
      session
    );

    await session.commitTransaction(); // Commit the transaction

    res.status(200).json({ message: "Transfer successful" });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

module.exports = router;
