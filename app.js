require('dotenv').config();
const cors = require('cors');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const NotFound = require('./errors/NotFound');
const auth = require('./middlewares/auth');
const errorHandler = require('./errors/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./utils/constants');

const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
if (process.env.NODE_ENV !== 'production') {
  process.env.JWT_SECRET = 'devKey';
}
const app = express();

app.use(express.json());
mongoose.connect(MONGODB_URL);
app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(cors({
  origin: 'https://mestoforyou.nomoredomainsclub.ru',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
}));
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use('/', require('./routes/auth'));

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.all('*', (req, res, next) => {
  next(new NotFound('Неправильный путь'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
