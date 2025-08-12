# Pharos AI - DevOps Makefile
# Comprehensive command center for development and production

.PHONY: help
help: ## Show this help message
	@echo "Pharos AI - Development & Production Commands"
	@echo "============================================="
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ==============================================================================
# VARIABLES
# ==============================================================================
DOCKER_COMPOSE = docker-compose
DOCKER_COMPOSE_DEV = $(DOCKER_COMPOSE) -f docker-compose.yml
DOCKER_COMPOSE_PROD = $(DOCKER_COMPOSE) -f docker-compose.prod.yml
BACKEND_SERVICE = backend
FRONTEND_SERVICE = frontend
DB_SERVICE = db
REDIS_SERVICE = redis

# ==============================================================================
# QUICK COMMANDS (Most Used)
# ==============================================================================

.PHONY: up
up: dev-up ## Alias for dev-up (start everything in background)

.PHONY: down
down: dev-down ## Alias for dev-down (stop everything)

.PHONY: restart
restart: dev-restart ## Alias for dev-restart

.PHONY: logs
logs: dev-logs ## Alias for dev-logs

.PHONY: ps
ps: dev-ps ## Alias for dev-ps (show running containers)

# ==============================================================================
# DEVELOPMENT COMMANDS
# ==============================================================================

.PHONY: dev
dev: ## Start development environment (all services)
	@echo "🚀 Starting development environment..."
	@$(DOCKER_COMPOSE_DEV) up

.PHONY: dev-build
dev-build: ## Build and start development environment
	@echo "🏗️  Building development containers..."
	@$(DOCKER_COMPOSE_DEV) build --no-cache
	@$(DOCKER_COMPOSE_DEV) up

.PHONY: dev-build-parallel
dev-build-parallel: ## Build all containers in parallel
	@echo "🏗️  Building all containers in parallel..."
	@$(DOCKER_COMPOSE_DEV) build --parallel --no-cache

.PHONY: dev-rebuild
dev-rebuild: ## Rebuild specific service (use SERVICE=backend make dev-rebuild)
	@echo "🏗️  Rebuilding $(SERVICE)..."
	@$(DOCKER_COMPOSE_DEV) build --no-cache $(SERVICE)
	@$(DOCKER_COMPOSE_DEV) up -d $(SERVICE)

.PHONY: dev-up
dev-up: ## Start development environment in background
	@echo "🚀 Starting development environment in background..."
	@$(DOCKER_COMPOSE_DEV) up -d
	@echo "✅ Development environment is running!"
	@echo "   Frontend: http://localhost:3100"
	@echo "   Backend:  http://localhost:8100"
	@echo "   Flower:   http://localhost:5565"

.PHONY: dev-down
dev-down: ## Stop development environment
	@echo "🛑 Stopping development environment..."
	@$(DOCKER_COMPOSE_DEV) down

.PHONY: dev-stop
dev-stop: ## Stop without removing containers
	@echo "⏸️  Stopping containers..."
	@$(DOCKER_COMPOSE_DEV) stop

.PHONY: dev-start
dev-start: ## Start existing containers
	@echo "▶️  Starting existing containers..."
	@$(DOCKER_COMPOSE_DEV) start

.PHONY: dev-restart
dev-restart: dev-down dev-up ## Restart development environment

.PHONY: dev-logs
dev-logs: ## Show logs from all services
	@$(DOCKER_COMPOSE_DEV) logs -f

.PHONY: dev-logs-backend
dev-logs-backend: ## Show backend logs
	@$(DOCKER_COMPOSE_DEV) logs -f $(BACKEND_SERVICE)

.PHONY: dev-logs-frontend
dev-logs-frontend: ## Show frontend logs
	@$(DOCKER_COMPOSE_DEV) logs -f $(FRONTEND_SERVICE)

.PHONY: dev-ps
dev-ps: ## Show running containers
	@$(DOCKER_COMPOSE_DEV) ps

.PHONY: dev-pull
dev-pull: ## Pull latest base images
	@echo "📥 Pulling latest base images..."
	@$(DOCKER_COMPOSE_DEV) pull

.PHONY: dev-exec
dev-exec: ## Execute command in service (use SERVICE=backend CMD="ls -la" make dev-exec)
	@$(DOCKER_COMPOSE_DEV) exec $(SERVICE) $(CMD)

.PHONY: dev-run
dev-run: ## Run one-off command in service (use SERVICE=backend CMD="python manage.py shell" make dev-run)
	@$(DOCKER_COMPOSE_DEV) run --rm $(SERVICE) $(CMD)

.PHONY: dev-attach
dev-attach: ## Attach to running container (use SERVICE=backend make dev-attach)
	@docker attach $$($(DOCKER_COMPOSE_DEV) ps -q $(SERVICE))

.PHONY: dev-top
dev-top: ## Show running processes in containers
	@$(DOCKER_COMPOSE_DEV) top

.PHONY: dev-port
dev-port: ## Show port mappings
	@$(DOCKER_COMPOSE_DEV) port $(SERVICE) $(PORT)

# ==============================================================================
# DATABASE COMMANDS
# ==============================================================================

.PHONY: db-migrate
db-migrate: ## Run database migrations
	@echo "🗃️  Running database migrations..."
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) python manage.py migrate

.PHONY: db-makemigrations
db-makemigrations: ## Create new migrations
	@echo "📝 Creating new migrations..."
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) python manage.py makemigrations

.PHONY: db-seed
db-seed: ## Seed database with initial data
	@echo "🌱 Seeding database..."
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) python manage.py seed_us_administration
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) python manage.py seed_israel_middle_east
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) python manage.py setup_periodic_tasks

.PHONY: db-reset
db-reset: ## Reset database (WARNING: destroys all data)
	@echo "⚠️  WARNING: This will destroy all data in the database!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo ""; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "🔄 Resetting database..."; \
		$(DOCKER_COMPOSE_DEV) down -v; \
		$(DOCKER_COMPOSE_DEV) up -d $(DB_SERVICE) $(REDIS_SERVICE); \
		sleep 5; \
		$(DOCKER_COMPOSE_DEV) up -d $(BACKEND_SERVICE); \
		sleep 5; \
		$(MAKE) db-migrate; \
		$(MAKE) db-create-superuser; \
		$(MAKE) db-seed; \
		echo "✅ Database reset complete!"; \
	else \
		echo "❌ Database reset cancelled."; \
	fi

.PHONY: db-create-superuser
db-create-superuser: ## Create Django superuser
	@echo "👤 Creating superuser..."
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) python manage.py shell -c "\
from django.contrib.auth.models import User; \
if not User.objects.filter(username='admin').exists(): \
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123'); \
    print('✅ Superuser created: admin/admin123'); \
else: \
    print('ℹ️  Superuser already exists');"

.PHONY: db-shell
db-shell: ## Open PostgreSQL shell
	@$(DOCKER_COMPOSE_DEV) exec $(DB_SERVICE) psql -U pharos_user -d pharos_db

# ==============================================================================
# TESTING COMMANDS
# ==============================================================================

.PHONY: test
test: test-backend test-frontend ## Run all tests

.PHONY: test-backend
test-backend: ## Run backend tests
	@echo "🧪 Running backend tests..."
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) python manage.py test

.PHONY: test-frontend
test-frontend: ## Run frontend tests
	@echo "🧪 Running frontend tests..."
	@$(DOCKER_COMPOSE_DEV) exec $(FRONTEND_SERVICE) npm test

.PHONY: test-daily-outlook
test-daily-outlook: ## Test daily outlook generation
	@echo "📰 Testing daily outlook generation..."
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) python manage.py test_daily_outlook

.PHONY: lint
lint: lint-backend lint-frontend ## Run all linters

.PHONY: lint-backend
lint-backend: ## Run backend linting
	@echo "🔍 Linting backend code..."
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) ruff check .
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) black --check .

.PHONY: lint-frontend
lint-frontend: ## Run frontend linting
	@echo "🔍 Linting frontend code..."
	@$(DOCKER_COMPOSE_DEV) exec $(FRONTEND_SERVICE) npm run lint

.PHONY: format
format: format-backend format-frontend ## Format all code

.PHONY: format-backend
format-backend: ## Format backend code
	@echo "✨ Formatting backend code..."
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) black .
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) ruff check --fix .

.PHONY: format-frontend
format-frontend: ## Format frontend code
	@echo "✨ Formatting frontend code..."
	@$(DOCKER_COMPOSE_DEV) exec $(FRONTEND_SERVICE) npm run format

# ==============================================================================
# SHELL COMMANDS
# ==============================================================================

.PHONY: shell-backend
shell-backend: ## Open bash shell in backend container
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) /bin/bash

.PHONY: shell-frontend
shell-frontend: ## Open bash shell in frontend container
	@$(DOCKER_COMPOSE_DEV) exec $(FRONTEND_SERVICE) /bin/sh

.PHONY: shell-django
shell-django: ## Open Django shell
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) python manage.py shell

.PHONY: shell-redis
shell-redis: ## Open Redis CLI
	@$(DOCKER_COMPOSE_DEV) exec $(REDIS_SERVICE) redis-cli

# ==============================================================================
# PRODUCTION COMMANDS
# ==============================================================================

.PHONY: prod
prod: ## Start production environment
	@echo "🚀 Starting production environment..."
	@$(DOCKER_COMPOSE_PROD) up -d
	@echo "✅ Production environment is running!"

.PHONY: prod-build
prod-build: ## Build production containers
	@echo "🏗️  Building production containers..."
	@$(DOCKER_COMPOSE_PROD) build --no-cache

.PHONY: prod-down
prod-down: ## Stop production environment
	@echo "🛑 Stopping production environment..."
	@$(DOCKER_COMPOSE_PROD) down

.PHONY: prod-logs
prod-logs: ## Show production logs
	@$(DOCKER_COMPOSE_PROD) logs -f

.PHONY: prod-deploy
prod-deploy: prod-build prod-down prod ## Full production deployment

# ==============================================================================
# DOCKER MANAGEMENT COMMANDS
# ==============================================================================

.PHONY: docker-stats
docker-stats: ## Show real-time container resource usage
	@docker stats $$($(DOCKER_COMPOSE_DEV) ps -q)

.PHONY: docker-inspect
docker-inspect: ## Inspect a service (use SERVICE=backend make docker-inspect)
	@docker inspect $$($(DOCKER_COMPOSE_DEV) ps -q $(SERVICE))

.PHONY: docker-logs-tail
docker-logs-tail: ## Tail logs with custom lines (use SERVICE=backend LINES=50 make docker-logs-tail)
	@$(DOCKER_COMPOSE_DEV) logs --tail=$(LINES) $(SERVICE)

.PHONY: docker-events
docker-events: ## Show Docker events
	@docker events --filter "label=com.docker.compose.project=$$(basename $$(pwd))"

.PHONY: docker-images
docker-images: ## List project Docker images
	@docker images | grep -E "pharos|REPOSITORY" || true

.PHONY: docker-volumes
docker-volumes: ## List project volumes
	@docker volume ls | grep -E "pharos|DRIVER" || true

.PHONY: docker-networks
docker-networks: ## List project networks
	@docker network ls | grep -E "pharos|DRIVER" || true

.PHONY: docker-prune-images
docker-prune-images: ## Remove unused images
	@echo "🧹 Pruning unused images..."
	@docker image prune -f

.PHONY: docker-prune-volumes
docker-prune-volumes: ## Remove unused volumes
	@echo "🧹 Pruning unused volumes..."
	@docker volume prune -f

# ==============================================================================
# DEBUGGING COMMANDS
# ==============================================================================

.PHONY: debug-backend
debug-backend: ## Start backend with debug mode
	@$(DOCKER_COMPOSE_DEV) run --rm -p 8100:8000 -p 5678:5678 $(BACKEND_SERVICE) python -m debugpy --listen 0.0.0.0:5678 manage.py runserver 0.0.0.0:8000

.PHONY: debug-env
debug-env: ## Show environment variables for a service
	@$(DOCKER_COMPOSE_DEV) exec $(SERVICE) env | sort

.PHONY: debug-network
debug-network: ## Test network connectivity between services
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) ping -c 3 $(DB_SERVICE)
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) ping -c 3 $(REDIS_SERVICE)

.PHONY: debug-ports
debug-ports: ## Check port availability
	@echo "Checking ports..."
	@lsof -i :3100 || echo "✅ Port 3100 (Frontend) is available"
	@lsof -i :8100 || echo "✅ Port 8100 (Backend) is available"
	@lsof -i :5442 || echo "✅ Port 5442 (PostgreSQL) is available"
	@lsof -i :6389 || echo "✅ Port 6389 (Redis) is available"
	@lsof -i :5565 || echo "✅ Port 5565 (Flower) is available"

# ==============================================================================
# UTILITY COMMANDS
# ==============================================================================

.PHONY: clean
clean: ## Clean up all containers, volumes, and images
	@echo "🧹 Cleaning up Docker resources..."
	@docker-compose down -v --remove-orphans
	@docker system prune -f
	@echo "✅ Cleanup complete!"

.PHONY: clean-all
clean-all: ## Deep clean including all Docker resources (WARNING: affects other projects)
	@echo "⚠️  WARNING: This will remove ALL Docker resources on your system!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo ""; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v --remove-orphans; \
		docker system prune -a -f --volumes; \
		echo "✅ Deep cleanup complete!"; \
	else \
		echo "❌ Cleanup cancelled."; \
	fi

.PHONY: clean-pyc
clean-pyc: ## Remove Python cache files
	@echo "🧹 Removing Python cache files..."
	@find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@find . -type f -name "*.pyo" -delete 2>/dev/null || true

.PHONY: clean-node
clean-node: ## Remove node_modules
	@echo "🧹 Removing node_modules..."
	@rm -rf pharos-ai-frontend/node_modules

.PHONY: backup
backup: ## Backup database
	@echo "💾 Backing up database..."
	@mkdir -p backups
	@$(DOCKER_COMPOSE_DEV) exec $(DB_SERVICE) pg_dump -U pharos_user pharos_db > backups/pharos_db_$$(date +%Y%m%d_%H%M%S).sql
	@echo "✅ Database backed up to backups/"

.PHONY: restore
restore: ## Restore database from backup (requires BACKUP_FILE=path/to/backup.sql)
	@if [ -z "$(BACKUP_FILE)" ]; then \
		echo "❌ Please specify BACKUP_FILE=path/to/backup.sql"; \
		exit 1; \
	fi
	@echo "📥 Restoring database from $(BACKUP_FILE)..."
	@$(DOCKER_COMPOSE_DEV) exec -T $(DB_SERVICE) psql -U pharos_user pharos_db < $(BACKUP_FILE)
	@echo "✅ Database restored!"

.PHONY: status
status: ## Show status of all services
	@echo "📊 Service Status:"
	@echo "=================="
	@$(DOCKER_COMPOSE_DEV) ps
	@echo ""
	@echo "📦 Docker Resource Usage:"
	@docker stats --no-stream

.PHONY: install-hooks
install-hooks: ## Install git hooks
	@echo "🔗 Installing git hooks..."
	@cp hooks/* .git/hooks/
	@chmod +x .git/hooks/*
	@echo "✅ Git hooks installed!"

# ==============================================================================
# CELERY COMMANDS
# ==============================================================================

.PHONY: celery-status
celery-status: ## Check Celery worker status
	@echo "📊 Celery Worker Status:"
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) celery -A pharos_backend inspect active

.PHONY: celery-purge
celery-purge: ## Purge all Celery tasks
	@echo "🧹 Purging Celery tasks..."
	@$(DOCKER_COMPOSE_DEV) exec $(BACKEND_SERVICE) celery -A pharos_backend purge -f

.PHONY: flower
flower: ## Open Flower monitoring interface
	@echo "🌸 Opening Flower interface..."
	@open http://localhost:5565 || xdg-open http://localhost:5565 || echo "Visit http://localhost:5565"

# ==============================================================================
# SERVICE MANAGEMENT
# ==============================================================================

.PHONY: restart-backend
restart-backend: ## Restart backend service
	@echo "🔄 Restarting backend..."
	@$(DOCKER_COMPOSE_DEV) restart $(BACKEND_SERVICE)

.PHONY: restart-frontend
restart-frontend: ## Restart frontend service
	@echo "🔄 Restarting frontend..."
	@$(DOCKER_COMPOSE_DEV) restart $(FRONTEND_SERVICE)

.PHONY: restart-db
restart-db: ## Restart database service
	@echo "🔄 Restarting database..."
	@$(DOCKER_COMPOSE_DEV) restart $(DB_SERVICE)

.PHONY: restart-redis
restart-redis: ## Restart Redis service
	@echo "🔄 Restarting Redis..."
	@$(DOCKER_COMPOSE_DEV) restart $(REDIS_SERVICE)

.PHONY: restart-celery
restart-celery: ## Restart Celery workers and beat
	@echo "🔄 Restarting Celery..."
	@$(DOCKER_COMPOSE_DEV) restart celery-worker celery-beat

.PHONY: health
health: ## Check health of all services
	@echo "🏥 Health Check Report:"
	@echo "======================"
	@$(DOCKER_COMPOSE_DEV) ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

.PHONY: wait-for-db
wait-for-db: ## Wait for database to be ready
	@echo "⏳ Waiting for database..."
	@until $(DOCKER_COMPOSE_DEV) exec -T $(DB_SERVICE) pg_isready -U pharos_user; do sleep 1; done
	@echo "✅ Database is ready!"

.PHONY: wait-for-backend
wait-for-backend: ## Wait for backend to be ready
	@echo "⏳ Waiting for backend..."
	@until curl -f http://localhost:8100/admin/ > /dev/null 2>&1; do sleep 1; done
	@echo "✅ Backend is ready!"

# ==============================================================================
# QUICK START
# ==============================================================================

.PHONY: init
init: ## Initialize project for first time
	@echo "🎉 Initializing Pharos AI..."
	@echo "=========================="
	@cp .env.example .env
	@echo "✅ Created .env file"
	@$(MAKE) dev-build-parallel
	@$(MAKE) wait-for-db
	@$(MAKE) db-migrate
	@$(MAKE) db-create-superuser
	@$(MAKE) db-seed
	@echo ""
	@echo "🎉 Initialization complete!"
	@echo "Run 'make dev' to start the development environment"

.PHONY: quick-start
quick-start: init dev ## Quick start for new developers

.PHONY: check-env
check-env: ## Check if .env file exists and has required variables
	@if [ ! -f .env ]; then \
		echo "❌ .env file not found. Run 'make init' first."; \
		exit 1; \
	fi
	@echo "✅ .env file exists"
	@grep -q "OPENAI_API_KEY" .env || echo "⚠️  Warning: OPENAI_API_KEY not set in .env"

.PHONY: urls
urls: ## Show all service URLs
	@echo "🌐 Service URLs:"
	@echo "================"
	@echo "Frontend:     http://localhost:3100"
	@echo "Backend:      http://localhost:8100"
	@echo "Admin Panel:  http://localhost:8100/admin/"
	@echo "API Docs:     http://localhost:8100/api/schema/swagger-ui/"
	@echo "Flower:       http://localhost:5565"
	@echo "PostgreSQL:   localhost:5442"
	@echo "Redis:        localhost:6389"

# Default target
.DEFAULT_GOAL := help