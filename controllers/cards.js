const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');

module.exports.createCard = (req, res, next) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const toggleLike = (option, req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { [option]: { likes: req.user._id } },
  { new: true },
).populate(['owner', 'likes'])
  // eslint-disable-next-line consistent-return
  .then((card) => {
    if (card === null) { throw new NotFound('Карточка с таким id не найдена'); }
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') { next(new BadRequest('Передан некорректный id карточки')); } else {
      next(err);
    }
  });

module.exports.likeCard = (req, res) => toggleLike('$addToSet', req, res);

module.exports.dislikeCard = (req, res) => toggleLike('$pull', req, res);

module.exports.getCards = (req, res, next) => Card.find({}).populate(['owner', 'likes'])
  // eslint-disable-next-line max-len
  .then((cards) => res.send(cards)).catch(next);

module.exports.deleteCard = (req, res, next) => Card.findByIdAndRemove(
  req.params.cardId,
)
  .populate(['owner', 'likes'])
  // eslint-disable-next-line consistent-return
  .then((card) => {
    if (card === null) { throw new NotFound('Карточка с таким id не найдена'); }
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') { next(new BadRequest('Передан некорректный id')); } else {
      next(err);
    }
  });
