
const jwt = require("jsonwebtoken");

function requireOrganizer(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Organizer login required",
    });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      decoded.role !== "organizer" ||
      decoded.username !== process.env.ORGANIZER_USERNAME
    ) {
      return res.status(403).json({
        message: "Organizer access required",
      });
    }

    req.organizer = {
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired login token. Please log in again.",
    });
  }
}

module.exports = requireOrganizer;
