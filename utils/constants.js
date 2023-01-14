const rateLimit = require('express-rate-limit');

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;
const UNAUTHORIZED = 401;
const CONFLICT_ERROR = 409;
const FORBIDDEN = 403;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {
  limiter,
  FORBIDDEN,
  CONFLICT_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
};
