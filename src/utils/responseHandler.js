const success = (res, { message = 'Success', data = null, pagination = null }, status = 200) => {
  return res.status(status).json({ success: true, message, data, pagination });
};

const error = (res, { message = 'Something went wrong', data = null }, status = 500) => {
  return res.status(status).json({ success: false, message, data, pagination: null });
};

const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found', data: null, pagination: null });
};

// Express error handler
const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, message, data: null, pagination: null });
};

module.exports = { success, error, notFound, errorHandler };
