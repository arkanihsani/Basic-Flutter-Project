import StatusCodes from './status-codes.js'

class BaseError extends Error {
  constructor(errorCode, statusCode, errorName, message) {
    super(message)
    this.errorCode = errorCode
    this.statusCode = statusCode
    this.errorName = errorName
  }

  static notFound(message = 'Resource does not exist') {
    return new BaseError(
      StatusCodes.NOT_FOUND.code,
      StatusCodes.NOT_FOUND.message,
      'Resource Not Found',
      message,
    )
  }

  static badRequest(message = 'Bad Request') {
    return new BaseError(
      StatusCodes.BAD_REQUEST.code,
      StatusCodes.BAD_REQUEST.message,
      'Bad Request',
      message,
    )
  }

  static unauthorized(message = 'Unauthorized') {
    return new BaseError(
      StatusCodes.UNAUTHORIZED.code,
      StatusCodes.UNAUTHORIZED.message,
      'Unauthorized',
      message,
    )
  }

  static forbidden(message = 'Forbidden') {
    return new BaseError(
      StatusCodes.FORBIDDEN.code,
      StatusCodes.FORBIDDEN.message,
      'Forbidden',
      message,
    )
  }

  static internalServerError(message = 'Internal Server Error') {
    return new BaseError(
      StatusCodes.INTERNAL_SERVER_ERROR.code,
      StatusCodes.INTERNAL_SERVER_ERROR.message,
      'Internal Server Error',
      message,
    )
  }
}

export default BaseError
