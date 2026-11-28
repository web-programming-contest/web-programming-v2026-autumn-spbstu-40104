# Gadget Hub

Курсовой проект по дисциплине «Web-разработка». Интернет-магазин гаджетов с
каталогом товаров, авторизацией, корзиной и оформлением заказов.

## Функциональность

- Главная страница с каруселями новинок и хитов продаж.
- Авторизация пользователя.
- Каталог товаров.
- Фильтрация по цене, категории и цвету.
- Сортировка по цене, популярности и новизне.
- Пагинация каталога.
- Модальные окна с информацией о товарах.
- Корзина с сохранением данных в localStorage.
- Оформление заказа.
- История заказов.

## Используемые технологии

### Frontend

- React
- TypeScript
- Vite
- SCSS Modules
- Zustand
- React Router
- Bun

### Backend

- Python 3.12+
- FastAPI
- Uvicorn
- Pydantic
- aiofiles
- pwdlib (Argon2)
- pytest
- uv

Данные о товарах, пользователях и заказах хранятся в JSON-файлах.

## Структура проекта

```text
project/
├── backend/
│   ├── src/backend/
│   │   ├── data/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── create_user.py
│   │   └── main.py
│   ├── tests/
│   └── pyproject.toml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── store/
│   │   ├── styles/
│   │   └── types/
│   └── package.json
└── README.md
```

## Установка и запуск

Для запуска необходимы Git, Python 3.12 или выше, uv, Node.js и Bun.

### Клонирование репозитория

```bash
git clone https://github.com/NadiaQlivka/web-programming-with-Alena.git
cd web-programming-with-Alena
```

### Запуск backend

```bash
cd backend
uv sync
```

При первом запуске необходимо создать пользователя:

```bash
uv run python src/backend/create_user.py
```

Введите логин и пароль. Пароль сохраняется в виде хеша. Файл users.json
создается локально.

Запуск сервера:

```bash
uv run uvicorn backend.main:app --app-dir src --reload --port 8000
```

Backend: http://127.0.0.1:8000

Swagger UI: http://127.0.0.1:8000/docs

### Запуск frontend

В отдельном терминале из корневой папки проекта:

```bash
cd frontend
bun install
```

Создайте файл .env в папке frontend:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Запустите сервер:

```bash
bun run dev --host 127.0.0.1 --port 5173
```

Приложение доступно по адресу:

http://127.0.0.1:5173

## REST API

| Метод | Путь        | Назначение                      |
| ----- | ----------- | ------------------------------- |
| GET   | /health     | Проверка состояния сервера      |
| POST  | /login      | Авторизация                     |
| POST  | /logout     | Завершение сессии               |
| GET   | /me         | Получение текущего пользователя |
| GET   | /goods      | Получение списка товаров        |
| GET   | /goods/{id} | Получение товара по ID          |
| GET   | /orders     | Получение истории заказов       |
| POST  | /orders     | Создание заказа                 |

## Хранение данных

- goods.json — данные о товарах.
- users.json — данные пользователя и хеш пароля.
- orders.json — оформленные заказы.
- localStorage — содержимое корзины.

Файлы users.json и orders.json не публикуются в репозитории и создаются
локально.

Для авторизации используются серверные сессии и HTTP-only cookie.

## Тестирование

Запуск тестов backend:

```bash
cd backend
uv run pytest
```

Проверка frontend:

```bash
cd frontend
bun run lint
bun run build
```

## Авторы

Студенты СПбПУ, направление «Программная инженерия».

- Надежда — backend, API, общая логика frontend, каталог.
- Алёна — пользовательский интерфейс, главная страница, авторизация, корзина,
  оформление и история заказов.
