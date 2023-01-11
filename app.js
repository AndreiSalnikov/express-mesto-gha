const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { NOT_FOUND } = require('./utils/constants');
const auth = require('./middlewares/auth');
const errorHandler = require('./errors/errorHandler');

const { PORT = 3000, MONGODB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGODB_URL);

app.use('/', require('./routes/auth'));

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.all('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Неправильный путь' });
});

app.use(errors());
app.use(errorHandler);

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
