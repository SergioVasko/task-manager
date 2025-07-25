run:
	@docker-compose down
	@docker-compose up
	@docker ps
	@sleep 2
	@docker ps

stop:
	@docker-compose down
	@docker ps

install:
	@echo "Stopping and removing old containers/volumes..."
	@docker-compose down --remove-orphans -v

	@echo "Fixing file permissions (chown)..."
	@sudo chown -R $$(id -u):$$(id -g) backend/

	@echo "Cleaning backend & frontend..."
	@rm -rf backend/vendor backend/var/cache backend/var/log frontend/node_modules

	@echo "Building containers..."
	@docker-compose up -d --build

	@echo "Installing PHP dependencies..."
	@docker-compose run --rm task-manager-php composer install

	@echo "Running Symfony migrations..."
	@docker-compose exec task-manager-php bin/console doctrine:database:create --if-not-exists
	@docker-compose run --rm task-manager-php php bin/console doctrine:migrations:migrate --no-interaction

	@echo "Loading fixtures..."
	@docker-compose run --rm task-manager-php php bin/console doctrine:fixtures:load --no-interaction

	@echo "Installing frontend dependencies..."
	@docker-compose run --rm task-manager-react yarn install

	@echo "Done. Containers:"
	@docker ps