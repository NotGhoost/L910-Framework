# Театр (вариант 13)

Мини-фреймворк на Node.js (без внешних модулей) и сервис для темы "Театр".
Запуск: npm i + npm start.

## Сущности
- plays: { id, title (string), duration (number), isPremiere (boolean), genres (Array<string>), premiereDate (Date string) }
- actors: { id, name (string), age (number), isAvailable (boolean), roles (Array<string>), joinedDate (Date string) }

## Роуты

### Plays
- GET /plays
- GET /plays/:id
- POST /plays
- PUT /plays/:id
- PATCH /plays/:id
- DELETE /plays/:id

### Actors
- GET /actors
- GET /actors/:id
- POST /actors
- PUT /actors/:id
- PATCH /actors/:id
- DELETE /actors/:id
