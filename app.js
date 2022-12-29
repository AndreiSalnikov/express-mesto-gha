const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { NOT_FOUND } = require('./utils/constants');

const { PORT = 3000, MONGODB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGODB_URL);

app.use((req, res, next) => {
  req.user = {
    _id: '63ac0567d82c0cf9d725ff4b',
  };
  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.all('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Неправильный путь' });
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
