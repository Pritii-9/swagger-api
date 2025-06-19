
const errorHandler = (err, req, res, next) => {
  // Determine the status code based on the error. Default to 500 (Internal Server Error).
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Send a JSON response with the error message.
  // In development, also send the error stack for debugging purposes.
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler; // Export the 