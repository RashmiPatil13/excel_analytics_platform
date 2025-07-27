const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id || decoded._id, role: decoded.role };
    console.log("Auth OK → req.user.id =", req.user.id);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
