const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner }).then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).populate(['owner', 'likes'])
  // eslint-disable-next-line consistent-return
  .then((card) => {
    if (card === null) { return res.status(404).send({ message: 'Такого пользователя не сущестувует' }); }
    res.send({ card });
  })
  .catch((err) => {
    if (err.name === 'CastError') { return res.status(400).send({ message: 'Передан некорректный id карточки' }); }
    return res.status(500).send({ message: err.message });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
// eslint-disable-next-line consistent-return
).then((card) => {
  if (card === null) { return res.status(404).send({ message: 'Такого пользователя не сущестувует' }); }
  res.send({ card });
}).catch((err) => {
  if (err.name === 'CastError') { return res.status(400).send({ message: 'Передан некорректный id' }); }
  return res.status(500).send({ message: err.message });
});

module.exports.getCards = (req, res) => Card.find({})
  .then((cards) => res.send(cards)).catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

module.exports.deleteCard = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .then((card) => res.send({ card }))
  .catch((err) => {
    if (err.name === 'CastError') { return res.status(404).send({ message: 'Карточка с указанным id не найдена' }); }
    return res.status(500).send({ message: err.message });
  });
