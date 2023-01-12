const { FORBIDDEN } = require('../utils/constants');

class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = FORBIDDEN;
  }
}

module.exports = Forbidden;
