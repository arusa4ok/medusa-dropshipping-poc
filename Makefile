.PHONY: help install dev build start stop clean deploy

help: ## Показать помощь
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Установить все зависимости
	npm install
	cd storefront && npm install

docker-up: ## Запустить Docker контейнеры (PostgreSQL + Redis)
	docker-compose up -d

docker-down: ## Остановить Docker контейнеры
	docker-compose down

docker-logs: ## Показать логи Docker контейнеров
	docker-compose logs -f

db-migrate: ## Применить миграции БД
	npm run build

db-seed: ## Заполнить БД тестовыми данными
	npm run seed

dev: ## Запустить в режиме разработки (требует 2 терминала)
	@echo "Запустите в разных терминалах:"
	@echo "  Terminal 1: make dev-backend"
	@echo "  Terminal 2: make dev-storefront"

dev-backend: ## Запустить backend в dev режиме
	npm run dev

dev-storefront: ## Запустить storefront в dev режиме
	cd storefront && npm run dev

build: ## Собрать проекты для production
	npm run build
	cd storefront && npm run build

start: ## Запустить в production режиме
	npm run start &
	cd storefront && npm run start &

stop: ## Остановить все процессы
	pkill -f "medusa start" || true
	pkill -f "next start" || true

clean: ## Очистить node_modules и build файлы
	rm -rf node_modules dist .medusa
	cd storefront && rm -rf node_modules .next

reset-db: ## Сбросить базу данных
	docker-compose down -v
	docker-compose up -d
	sleep 5
	npm run build

logs-backend: ## Показать логи backend
	pm2 logs medusa-backend

logs-storefront: ## Показать логи storefront
	pm2 logs medusa-storefront

status: ## Показать статус процессов
	pm2 status

deploy-vps: ## Деплой на VPS (требует настройки SSH)
	@echo "Убедитесь, что вы настроили SSH доступ к VPS"
	git push origin main
	@echo "Теперь выполните на VPS: cd ~/apps/medusa-dropshipping && ./deploy.sh"
