const { BAD_REQUEST } = require('../utils/constants');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = 'CastError';
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = BadRequest;
