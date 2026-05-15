// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);

  // Handle specific PostgreSQL error types
  if (err.code === "22P02") {
    return res.status(400).json({ message: "Invalid input format" });
  }

  if (err.code === "23505") {
    return res.status(409).json({ message: "Duplicate entry found" });
  }

  if (err.code === "23503") {
    return res
      .status(400)
      .json({ message: "Referenced record does not exist" });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res
      .status(401)
      .json({ message: "Token expired, please login again" });
  }

  // Default server error
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
};

module.exports = errorHandler;
