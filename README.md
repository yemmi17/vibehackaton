# 🐿️ СтрахоБелка: Беги, спасай и страхуй!

Игра-кликер с элементами апгрейдов и соревнования, где главный герой - Белка Гарантия помогает лесным жителям страховаться от разных опасностей.

## 🎮 Игровой процесс

- Кликайте для получения гарант-баллов
- Покупайте улучшения
- Участвуйте в лотерее
- Соревнуйтесь в таблице лидеров
- Выполняйте ежедневные миссии
- Собирайте коллекцию стикеров

## 🚀 Установка и запуск

### Предварительные требования

1. Установите [Node.js](https://nodejs.org/) (версия 16 или выше)
2. Установите [Git](https://git-scm.com/)

### Шаги установки

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yemmi17/vibehackaton
cd vibehackaton
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите проект:
```bash
npm start
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

## 🛠 Технологии

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase
- Redux Toolkit

## 📁 Структура проекта

```
src/
├── components/        # React компоненты
│   ├── core/         # Основные компоненты игры
│   ├── game/         # Игровая логика
│   └── ui/           # UI компоненты
├── hooks/            # React хуки
├── context/          # React Context
├── services/         # API и Firebase/Supabase
├── utils/            # Вспомогательные функции
├── assets/           # Изображения и анимации
└── styles/           # Глобальные стили
```

## 👥 Команда разработки

1. Frontend Core - Основной игровой интерфейс
2. Game Logic - Игровая механика и бэкенд
3. UI/UX - Пользовательский интерфейс и контент

## 🔧 Скрипты

- `npm start` - запуск проекта в режиме разработки
- `npm build` - сборка проекта
- `npm test` - запуск тестов
- `npm eject` - извлечение конфигурации (необратимо)

## 🐛 Решение проблем

### Проблемы с установкой npm

Если у вас возникают проблемы с установкой npm, попробуйте следующие шаги:

1. Очистите кэш npm:
```bash
npm cache clean --force
```

2. Удалите node_modules и package-lock.json:
```bash
rm -rf node_modules package-lock.json
```

3. Переустановите зависимости:
```bash
npm install
```

### Другие проблемы

- Если возникают ошибки с TypeScript, убедитесь, что установлены все необходимые типы:
```bash
npm install --save-dev @types/react @types/react-dom @types/node
```

- Если возникают проблемы с Tailwind CSS, проверьте установку:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 📝 Лицензия

MIT