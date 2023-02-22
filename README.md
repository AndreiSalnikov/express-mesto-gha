[![Tests](../../actions/workflows/tests-13-sprint.yml/badge.svg)](../../actions/workflows/tests-13-sprint.yml) [![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)
# Бэкенд проекта Mesto 

Бэкенд на express в связке с mongoDB, для предыдущего проекта: <a href="https://github.com/AndreiSalnikov/mesto-react">место</a>

Ссылка на репозиторий, в котором ведётся работа: <a href="https://github.com/AndreiSalnikov/express-mesto-gha">место-экспресс</a> (для ревью)

## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки  
  
Остальные директории вспомогательные

## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload

## Технологии
* Node.js
* Express.js
* MongoDB + Mongoose.js

## Функции
* авторизация пользователя;
* аутентификация через JWT;
* редактирование данных профиля пользователя;
* размещение и удаление картинок;
* возможность лайкать/дизлайкать картинки;
* логгер запросов и ошибок
* лиммитер запросов
* валидация с помощью celebrate
* секретный ключ хранится на сервере и берётся из .env

## Планы по дальнейшей доработке проекта:
* сделать авторизацию через куки
