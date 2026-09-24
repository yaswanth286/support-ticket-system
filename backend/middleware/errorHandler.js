/**
 * Centralized error handler. Keeps error responses consistent and avoids
 * leaking internal details (stack traces, SQL, credentials) to the client.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('Unhandled error:', err);

  const status = err.status || 500;
  const message = status === 500 ? 'Something went wrong. Please try again later.' : err.message;

  res.status(status).json({ success: false, message });
}

/**
 * Catches requests to routes that don't exist.
 */
function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: 'Resource not found' });
}

module.exports = { errorHandler, notFoundHandler };
