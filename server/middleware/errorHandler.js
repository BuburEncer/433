export default function errorHandler(err, req, res, next) {
  console.error(err);
  // Client errors (multer limits, rejected uploads) keep their status; anything else is a 500.
  const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 400 : 500);
  res.status(status).json({
    message: err.message || 'Internal Server Error'
  });
}
