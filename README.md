# L910-Framework: Кинотеатр (Вариант 2)

Минималистичный веб-фреймворк для Node.js без использования сторонних библиотек (без Express, body-parser и т.д.).

## Команда
*   **Студент 1:** (Впиши ФИО)
*   **Студент 2:** (Впиши ФИО)
*   **Студент 3:** (Впиши ФИО)

## Сущности данных

### 1. Фильм (Movie)
Хранится в `movies.json`.
*   `id` (String) - уникальный ID
*   `title` (String) - название
*   `duration` (Number) - длительность в минутах
*   `is3D` (Boolean) - формат 3D
*   `releaseDate` (Date String) - дата выхода
*   `genres` (Array) - массив жанров

### 2. Сеанс (Session)
Хранится в `sessions.json`.
*   `id` (String) - уникальный ID
*   `movieId` (String) - ID фильма
*   `hallName` (String) - название зала
*   `price` (Number) - цена билета
*   `isVip` (Boolean) - VIP места
*   `showTime` (Date String) - время начала

## API Роутинг

### Фильмы
| Метод  | Путь          | Описание |
| :---   | :---          | :--- |
| GET    | `/movies`     | Получить список всех фильмов |
| GET    | `/movies/:id` | Получить фильм по ID |
| POST   | `/movies`     | Создать новый фильм |
| PUT    | `/movies/:id` | Полное обновление фильма |
| PATCH  | `/movies/:id` | Частичное обновление фильма |
| DELETE | `/movies/:id` | Удаление фильма |

### Сеансы
| Метод  | Путь            | Описание |
| :---   | :---            | :--- |
| GET    | `/sessions`     | Получить список всех сеансов |
| GET    | `/sessions/:id` | Получить сеанс по ID |
| POST   | `/sessions`     | Создать новый сеанс |
| PUT    | `/sessions/:id` | Полное обновление сеанса |
| DELETE | `/sessions/:id` | Удаление сеанса |

## Запуск
1. `npm init -y`
2. `node src/index.js`