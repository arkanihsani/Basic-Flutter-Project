import StatusCodes from './status-codes.js'
import BaseError from './base-error.js'

const errorHandler = (err, req, res, next) => {
  if (err instanceof BaseError) {
    return res.status(err.errorCode).json({
      success: false,
      status: err.errorName,
      message: err.message,
    })
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
    success: false,
    status: 'Internal Server Error',
    message: err.message || StatusCodes.INTERNAL_SERVER_ERROR.message,
  })
}

export default errorHandler
