const HttpStatus = require('http-status-codes')

// Generic error handler middleware for express app.
function errorHandler (error, request, response, next) {
  const message = error ? error.message : 'Ha ocurrido un error interno del servidor'

  response
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ message })
}

module.exports = errorHandler
