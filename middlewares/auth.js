const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_SECRET = 'f218f886dc3a297935b07862ac035d827f1ec5599a9867adb95e63e0f55f310b' } = process.env;
// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');
    req.user = jwt.verify(token, JWT_SECRET); // записываем пейлоуд в объект запроса
  } catch (err) {
    next(err);
  }
  next(); // пропускаем запрос дальше
};
