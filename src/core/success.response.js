'use strict';

const StatusCode = {
   OK: 200,
   CREATED: 201,
};

const ReasonStatusCode = {
   CREATED: 'Created!',
   OK: 'Success',
};

class SuccessResponse {
   constructor({
      message,
      statusCode = StatusCode.OK,
      reasonStatusCode = StatusCode.OK,
      metadata = {},
   }) {
      this.message = !message ? reasonStatusCode : message;
      this.statusCode = statusCode;
      this.metadata = metadata;
   }

   send(res, headers = {}) {
      return res.status(this.statusCode).json(this);
   }
}

class OK extends SuccessResponse {
   constructor({ message, metadata }) {
      super({ message, metadata });
   }
}

class Created extends SuccessResponse {
   constructor({
      message,
      statusCode = StatusCode.CREATED,
      reasonStatusCode = ReasonStatusCode.CREATED,
      metadata,
      options,
   }) {
      super({ message, statusCode, reasonStatusCode, metadata });
      this.options = options || {};
   }
}

module.exports = {
   Created,
   OK,
   SuccessResponse,
};
