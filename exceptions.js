export function SystemError(message) {
  const error = new Error(message);
  error.status = 500;
  error.code = "SYSTEM_ERROR";
  return error;
}

SystemError.prototype = Object.create(Error.prototype);

export function BadRequestError(message) {
  const error = new Error(message);
  error.status = 400;
  error.code = "BAD_REQUEST";
  return error;
}

BadRequestError.prototype = Object.create(Error.prototype);

export function NotFoundError(message) {
  const error = new Error(message);
  error.status = 404;
  error.code = "NOT_FOUND";
  return error;
}

NotFoundError.prototype = Object.create(Error.prototype);
