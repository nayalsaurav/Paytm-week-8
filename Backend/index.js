const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const rootRouter = require("./routes/index");
app.use(express.json());
app.use(cors());

app.use("/api/v1", rootRouter);
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({
    message: "internal server error",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 \n http://localhost:3000");
});
