const multer = require("multer")

const errorHandler = (err, req, res, next) => {

  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof multer.MulterError) {

    const tooLarge = err.code === "LIMIT_FILE_SIZE"

    return res.status(tooLarge ? 413 : 400).json({
      success: false,
      message: tooLarge
        ? "File is too large. Maximum size is 100 MB."
        : err.message,
    })
  }

  if (err.status && err.status < 500) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    })
  }

  console.log(err)

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  })
}

module.exports = errorHandler
