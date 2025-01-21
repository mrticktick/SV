class ApiResponse {
  static success(data, message = "Success") {
    return {
      success: true,
      message,
      data
    };
  }

  static error(message, error = null, statusCode = 500) {
    return {
      success: false,
      message,
      error: error?.message || error,
      statusCode
    };
  }
}

module.exports = ApiResponse; 