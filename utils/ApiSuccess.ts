const ApiSuccess = (success: any, object = {}, message: any) => {
  return {
    success,
    data: object,
    message,
  };
};

module.exports = ApiSuccess;
