const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/constants');

const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({}).then((users) => res.send({ users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (user === null) { return res.status(NOT_FOUND).send({ message: 'Пользователь с таким id не найден' }); }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный id' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  User.create({ ...req.body })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении данных пользователя' });
      }
      if (err.name === 'CastError') { return res.status(NOT_FOUND).send({ message: 'Пользователь с таким id не найден' }); }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body; // чтобы валидация не ломалась
  req.body = { name, about }; // чтобы валидация не ломалась
  return updateUser(req, res);
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body; // чтобы валидация не ломалась
  req.body = { avatar }; // чтобы валидация не ломалась
  return updateUser(req, res);
};
