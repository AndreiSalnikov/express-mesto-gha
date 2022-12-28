const Card = require('../models/user');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).then((card) => res.send({ data: card })).catch((err) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
  }
  if (err.name === 'CastError') { return res.status(404).send({ message: 'Пользователь по указанному _id не найден' }); }
  return res.status(500).send({ message: err.message });
});

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).then((card) => res.send({ data: card })).catch((err) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
  }
  if (err.name === 'CastError') { return res.status(404).send({ message: 'Пользователь по указанному _id не найден' }); }
  return res.status(500).send({ message: err.message });
});

module.exports.getCards = (req, res) => Card.find({})
  .then((cards) => res.send(cards)).catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

module.exports.deleteCard = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') { return res.status(404).send({ message: 'Пользователь по указанному _id не найден' }); }
    return res.status(500).send({ message: err.message });
  });
