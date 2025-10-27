# Быстрый старт Medusa Dropshipping

## Локальная разработка

### 1. Установка зависимостей

```bash
# Backend
npm install

# Storefront
cd storefront
npm install
cd ..
```

### 2. Запуск базы данных

```bash
# Запустить PostgreSQL и Redis через Docker
docker-compose up -d

# Проверить статус
docker-compose ps
```

### 3. Запуск приложения

#### Вариант 1: Использование Makefile (рекомендуется)

```bash
# Показать все доступные команды
make help

# Запустить Docker контейнеры
make docker-up

# В первом терминале - Backend
make dev-backend

# Во втором терминале - Storefront
make dev-storefront
```

#### Вариант 2: Ручной запуск

```bash
# Terminal 1 - Backend (порт 9000)
npm run dev

# Terminal 2 - Storefront (порт 8001)
cd storefront
npm run dev
```

### 4. Доступ к приложению

- **Backend API**: http://localhost:9000
- **Admin Panel**: http://localhost:9000/app
- **Storefront**: http://localhost:8001

### 5. Первый запуск (опционально)

```bash
# Заполнить БД тестовыми данными
npm run seed
```

## Остановка

```bash
# Остановить Docker контейнеры
docker-compose down

# Или с удалением данных
docker-compose down -v
```

## Деплой на VPS

См. подробную инструкцию в [DEPLOYMENT.md](./DEPLOYMENT.md)

### Краткая версия:

1. **Настроить VPS** (выполнить один раз):
```bash
# На VPS
./scripts/setup-vps.sh
```

2. **Клонировать репозиторий на VPS**:
```bash
cd ~/apps
git clone <your-repo-url> medusa-dropshipping
cd medusa-dropshipping
```

3. **Создать production .env файлы**:
```bash
cp .env.production.example .env.production
cp storefront/.env.production.example storefront/.env.production
# Отредактировать файлы с реальными значениями
```

4. **Запустить деплой**:
```bash
./scripts/deploy.sh
```

## Полезные команды

```bash
# Логи Docker контейнеров
docker-compose logs -f

# Логи backend
pm2 logs medusa-backend

# Логи storefront
pm2 logs medusa-storefront

# Статус процессов
pm2 status

# Перезапуск
pm2 restart all

# Сброс БД (ОСТОРОЖНО!)
make reset-db
```

## Структура проекта

```
.
├── src/                    # Backend код (Medusa)
├── storefront/            # Frontend (Next.js)
├── scripts/               # Скрипты для деплоя
├── docker-compose.yml     # PostgreSQL + Redis
├── ecosystem.config.js    # PM2 конфигурация
├── Makefile              # Удобные команды
└── DEPLOYMENT.md         # Подробная инструкция по деплою
```

## Troubleshooting

### База данных не подключается

```bash
# Проверить статус контейнеров
docker-compose ps

# Перезапустить контейнеры
docker-compose restart

# Проверить логи
docker-compose logs postgres
```

### Ошибки при сборке

```bash
# Очистить кеш и пересобрать
rm -rf node_modules dist .medusa
npm install
npm run build
```

### Порты заняты

```bash
# Найти процесс на порту 9000
lsof -i :9000

# Убить процесс
kill -9 <PID>
```
