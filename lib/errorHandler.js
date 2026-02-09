/**
 * Build error response for API routes
 */
function errorResponse(err, statusCode = 500) {
  let code = err.statusCode || statusCode;
  let message = err.message || "Erreur interne du serveur";
  if (err.name === "ValidationError") {
    code = 400;
    message = "Erreur de validation";
  }
  if (err.name === "UnauthorizedError") {
    code = 401;
    message = "Non autorisé";
  }
  return {
    statusCode: code,
    body: {
      error: message,
      ...(process.env.NODE_ENV === "development" && err.stack && { stack: err.stack }),
    },
  };
}

module.exports = { errorResponse };
