SHELL := /bin/bash

DEV_COMPOSE := docker compose -f compose.dev.yaml
PROD_COMPOSE := docker compose -f compose.prod.yaml

build:
	$(DEV_COMPOSE) up --build -d --remove-orphans
up:
	$(DEV_COMPOSE) up -d --remove-orphans
down:
	$(DEV_COMPOSE) down --remove-orphans
stop:
	$(DEV_COMPOSE) stop
restart:
	$(DEV_COMPOSE) restart
down-v:
	$(DEV_COMPOSE) down -v --remove-orphans
logs:
	$(DEV_COMPOSE) logs --follow --tail=100
ps:
	$(DEV_COMPOSE) ps
exec:
	$(DEV_COMPOSE) exec backend bash
migrations:
	$(DEV_COMPOSE) exec backend python manage.py makemigrations
migrate:
	$(DEV_COMPOSE) exec backend python manage.py migrate
seed:
	$(DEV_COMPOSE) exec backend python manage.py seed_db --force
flush:
	$(DEV_COMPOSE) exec backend python manage.py flush
app:
	$(DEV_COMPOSE) exec backend python manage.py startapp "$(name)"
messages:
	$(DEV_COMPOSE) exec backend python manage.py makemessages -l uk -e py,html --ignore=static --ignore=migrations
compilemessages:
	$(DEV_COMPOSE) exec backend django-admin compilemessages
collectstatic:
	$(DEV_COMPOSE) exec backend python manage.py collectstatic --no-input
test:
# 	$(DEV_COMPOSE) exec backend pytest
	$(DEV_COMPOSE) exec backend pytest core_apps/categories/tests/services/test_category_tree_service.py

prod-build:
	$(PROD_COMPOSE) build
prod-up:
	$(PROD_COMPOSE) up -d --remove-orphans
prod-down:
	$(PROD_COMPOSE) down --remove-orphans
prod-logs:
	$(PROD_COMPOSE) logs --follow --tail=100
prod-ps:
	$(PROD_COMPOSE) ps
prod-migrate:
	$(PROD_COMPOSE) exec backend python manage.py migrate --no-input
prod-collectstatic:
	$(PROD_COMPOSE) exec backend python manage.py collectstatic --no-input
prod-bootstrap-http:
	NGINX_CONF=default.prod.http.conf $(PROD_COMPOSE) build nginx
	NGINX_CONF=default.prod.http.conf $(PROD_COMPOSE) up -d backend frontend nginx postgres redis --remove-orphans
prod-certbot-issue:
	@test -n "$(EMAIL)" || (echo "Usage: make prod-certbot-issue DOMAIN=NEW_PROJECT_DOMAIN EMAIL=NEW_PROJECT_EMAIL" && exit 1)
	@test -n "$(DOMAIN)" || (echo "Usage: make prod-certbot-issue DOMAIN=NEW_PROJECT_DOMAIN EMAIL=NEW_PROJECT_EMAIL" && exit 1)
	$(PROD_COMPOSE) run --rm certbot certonly \
		--webroot \
		--webroot-path=/var/www/certbot \
		--email "$(EMAIL)" \
		--agree-tos \
		--no-eff-email \
		-d "$(DOMAIN)" \
		-d "www.$(DOMAIN)"
prod-deploy: prod-deploy-https
prod-deploy-https:
	NGINX_CONF=default.prod.conf $(PROD_COMPOSE) build
	NGINX_CONF=default.prod.conf $(PROD_COMPOSE) up -d --remove-orphans
	$(PROD_COMPOSE) exec backend python manage.py migrate --no-input
	$(PROD_COMPOSE) exec backend python manage.py collectstatic --no-input
