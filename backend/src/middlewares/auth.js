const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 🔓 Allow public GET routes
  if (
    req.method === "GET" &&
    (req.originalUrl.includes("/search") ||
     req.originalUrl.match(/^\/api\/articles\/[a-f\d]{24}$/))
  ) {
    return next();
  }

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// const isAdmin = (req, res, next) => {
//   if (req.user?.role !== "SuperAdmin" ) {
//     return res.status(403).json({ message: "Admin only" });
//   }
//   next();
// };
const isAdmin = (req, res, next) => {
  const allowedRoles = ['Admin', 'SuperAdmin', 'Trainer'];
  console.log('User role:', req.user.role); // for debugging

  if (allowedRoles.includes(req.user.role)) {
    next(); // allowed
  } else {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
};


module.exports = { verifyToken, isAdmin };
