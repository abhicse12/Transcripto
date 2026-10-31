const { getAuth } = require("@clerk/express")

const requireUser = (req, res, next) => {

  const { userId } = getAuth(req)

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    })
  }

  req.userId = userId

  next()
}

module.exports = requireUser
