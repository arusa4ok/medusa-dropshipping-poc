# Deployment Guide для VPS

## Локальная разработка

### 1. Установка зависимостей

```bash
# Установить зависимости backend
npm install

# Установить зависимости storefront
cd storefront
npm install
cd ..
```

### 2. Запуск базы данных (PostgreSQL + Redis)

```bash
# Запустить Docker контейнеры
docker-compose up -d

# Проверить статус
docker-compose ps
```

### 3. Настройка базы данных

```bash
# Применить миграции
npm run build

# Запустить seed (опционально - добавит тестовые данные)
npm run seed
```

### 4. Запуск в режиме разработки

```bash
# Terminal 1 - Backend (порт 9000)
npm run dev

# Terminal 2 - Storefront (порт 8001)
cd storefront
npm run dev
```

### 5. Доступ к приложению

- **Backend API**: http://localhost:9000
- **Admin Panel**: http://localhost:9000/app
- **Storefront**: http://localhost:8001

## Деплой на VPS

### Подготовка VPS

1. **Установить необходимое ПО на VPS:**

```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Установить PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Установить Redis
sudo apt install -y redis-server

# Установить Nginx
sudo apt install -y nginx

# Установить PM2 для управления процессами
sudo npm install -g pm2
```

2. **Настроить PostgreSQL:**

```bash
sudo -u postgres psql
CREATE DATABASE medusa_db;
CREATE USER medusa WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE medusa_db TO medusa;
\q
```

3. **Настроить Git на VPS:**

```bash
# Создать директорию для проекта
mkdir -p ~/apps/medusa-dropshipping
cd ~/apps/medusa-dropshipping

# Клонировать репозиторий
git clone your-git-repository-url .
```

### Настройка проекта на VPS

1. **Создать production .env файлы:**

```bash
# Backend .env
cp .env.production.example .env.production
nano .env.production
# Заполнить реальными значениями

# Storefront .env
cp storefront/.env.production.example storefront/.env.production
nano storefront/.env.production
# Заполнить реальными значениями
```

2. **Установить зависимости и собрать проекты:**

```bash
# Backend
npm install --production
npm run build

# Storefront
cd storefront
npm install --production
npm run build
cd ..
```

3. **Запустить с PM2:**

```bash
# Использовать ecosystem.config.js
pm2 start ecosystem.config.js --env production

# Сохранить конфигурацию PM2
pm2 save
pm2 startup
```

### Настройка Nginx

Создать конфигурацию Nginx:

```bash
sudo nano /etc/nginx/sites-available/medusa
```

```nginx
# Backend
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Storefront
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Активировать конфигурацию
sudo ln -s /etc/nginx/sites-available/medusa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL сертификаты (Let's Encrypt)

```bash
# Установить Certbot
sudo apt install -y certbot python3-certbot-nginx

# Получить сертификаты
sudo certbot --nginx -d your-domain.com -d api.your-domain.com
```

### Автоматический деплой через Git

1. **На локальной машине добавить VPS как remote:**

```bash
git remote add production user@your-vps-ip:/path/to/repo
```

2. **Создать скрипт деплоя на VPS:**

```bash
nano ~/apps/medusa-dropshipping/deploy.sh
```

```bash
#!/bin/bash
cd ~/apps/medusa-dropshipping

# Получить последние изменения
git pull origin main

# Backend
npm install --production
npm run build

# Storefront
cd storefront
npm install --production
npm run build
cd ..

# Перезапустить PM2
pm2 restart ecosystem.config.js
```

```bash
chmod +x deploy.sh
```

3. **Деплой:**

```bash
# На локальной машине
git push origin main

# На VPS
ssh user@your-vps-ip
cd ~/apps/medusa-dropshipping
./deploy.sh
```

## Мониторинг

```bash
# Просмотр логов PM2
pm2 logs

# Статус процессов
pm2 status

# Мониторинг в реальном времени
pm2 monit
```

## Резервное копирование

```bash
# Backup базы данных
pg_dump -U medusa medusa_db > backup_$(date +%Y%m%d).sql

# Восстановление
psql -U medusa medusa_db < backup_20241027.sql
```
