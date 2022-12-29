const Card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/constants');

module.exports.createCard = (req, res) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).populate(['owner', 'likes'])
  // eslint-disable-next-line consistent-return
  .then((card) => {
    if (card === null) { return res.status(NOT_FOUND).send({ message: 'Карточка с таким id не найдена' }); }
    res.send({ card });
  })
  .catch((err) => {
    if (err.name === 'CastError') { return res.status(BAD_REQUEST).send({ message: 'Передан некорректный id карточки' }); }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
// eslint-disable-next-line consistent-return
).then((card) => {
  if (card === null) { return res.status(NOT_FOUND).send({ message: 'Карточка с таким id не найдена' }); }
  res.send({ card });
}).catch((err) => {
  if (err.name === 'CastError') { return res.status(BAD_REQUEST).send({ message: 'Передан некорректный id' }); }
  return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
});

module.exports.getCards = (req, res) => Card.find({}).populate(['owner', 'likes'])
  // eslint-disable-next-line max-len
  .then((cards) => res.send(cards)).catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: err.message }));

module.exports.deleteCard = (req, res) => Card.findByIdAndRemove(
  req.params.cardId,
)
  .populate(['owner', 'likes'])
  // eslint-disable-next-line consistent-return
  .then((card) => {
    if (card === null) { return res.status(NOT_FOUND).send({ message: 'Карточка с таким id не найдена' }); }
    res.send({ card });
  })
  .catch((err) => {
    if (err.name === 'CastError') { return res.status(BAD_REQUEST).send({ message: 'Передан некорректный id' }); }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
  });
