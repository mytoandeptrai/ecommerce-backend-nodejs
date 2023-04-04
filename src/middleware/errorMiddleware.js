const errorMiddleware = (error, req, res, next) => {
   const errorCode = error?.errorCode || 'ERROR_CODE_NOT_FOUND';
   const time = Date.now() - req.startTime;
   const status = error?.status || 500;

   res.status(status).json({
      name: error.name,
      message: error.message,
      status,
      errorCode,
      time,
   });
};

module.exports = { errorMiddleware };
