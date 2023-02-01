const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');
    req.user = jwt.verify(token, process.env.JWT_SECRET); // записываем пейлоуд в объект запроса
  } catch (err) {
    next(err);
  }
  next(); // пропускаем запрос дальше
};
