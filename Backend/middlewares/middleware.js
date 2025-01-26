const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Unauthorized user",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.userId) {
      req.user = { userId: decoded.userId };
      next();
    } else {
      throw new Error("Unauthorized user");
    }
  } catch (error) {
    console.log("Unauthorized user", error);
    return res.status(403).json({
      message: "Unauthorized user",
    });
  }
}

module.exports = authMiddleware;
