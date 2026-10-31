const { rateLimit } = require("express-rate-limit")

// Limits per signed-in user, so it must run after requireUser
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => req.userId,
  message: {
    success: false,
    message: "Upload limit reached. Please try again later.",
  },
})

module.exports = uploadLimiter
