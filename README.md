# L910-Framework: Объединенный проект

Мини-фреймворк на Node.js без внешних модулей. Включает в себя функционал для тем "Театр" и "Кинотеатр".

## Запуск
1. `npm install`
2. `npm start` (запускает `node ./src/server.js`)

---

## Проект 1: Театр (Вариант 13)

### Сущности
- **plays**: { id, title, duration, isPremiere, genres, premiereDate }
- **actors**: { id, name, age, isAvailable, roles, joinedDate }

### API Роуты (Театр)
| Метод | Путь | Описание |
| :--- | :--- | :--- |
| GET | `/plays` | Список пьес |
| POST | `/plays` | Создать пьесу |
| ... | `/plays/:id` | Операции по ID |
| GET | `/actors` | Список актеров |
| POST | `/actors` | Добавить актера |
| ... | `/actors/:id` | Операции по ID |

---

## Проект 2: Кинотеатр (Вариант 2)

### Сущности
- **Movie**: { id, title, duration, is3D, releaseDate, genres }
- **Session**: { id, movieId, hallName, price, isVip, showTime }

### API Роуты (Кинотеатр)
| Метод | Путь | Описание |
| :--- | :--- | :--- |
| GET | `/movies` | Список фильмов |
| POST | `/movies` | Создать фильм |
| ... | `/movies/:id` | Операции по ID |
| GET | `/sessions` | Список сеансов |
| POST | `/sessions` | Создать сеанс |
| ... | `/sessions/:id` | Операции по ID |

## Команда (из ветки Cinema)
*   Студент 1
*   Студент 2
*   Студент 3