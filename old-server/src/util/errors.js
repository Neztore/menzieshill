// Exports common errors and the generic error handling middleware.
// COPYRIGHT Josh Muir 2019.

// TODO: Add different error handling based on production or development
// "Unfriendly" error messages.
function errorHandler (error, req, res, next) {
  res.status(error.status || 500)
  res.send(errorGenerator(500, error.message))
  console.error(error)
}

// Takes inputs and returns a standard error object. Additional is an object whose properties are merged into the error object.
function errorGenerator (status, message, additional) {
  return {
    error: {
      status,
      message,
      ...additional
    }
  }
}

/*
  This is an error wrapper. It wraps express route functions and catches any async errors that are thrown.
  (i.e. the promise rejects)
  It then passes this error along to the global error handler so it can be dealt with consistently,
  by returning a 500.
 */
const errorCatch = fn => (
  (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
      routePromise.catch(err => next(err));
    }
  }
);

// Contains common errors
const errors = {
  unauthorized: errorGenerator(401, "Unauthorized: Please login or supply authorization token."),
  forbidden: errorGenerator(403, "Forbidden. Access denied."),
  notFound: errorGenerator(404, "Page not found."),

  notImplemented: errorGenerator(501, "Not implemented.")
}
module.exports = {
  errorHandler,
  errorGenerator,
  errors,
  errorCatch
}