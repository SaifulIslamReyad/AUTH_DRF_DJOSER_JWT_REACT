# Enhanced Django Makefile - Cross Platform

# Default target - run full development cycle
migraterun:
	make migrate
	make run

# Just run migrations without starting server
migrate:
	cd backend && python manage.py makemigrations && python manage.py migrate

# Start server without migrations
run:
	cd backend && python manage.py runserver

# Start server on specific port
serve:
	cd backend && python manage.py runserver 127.0.0.1:$(port)

# Create new Django app
app:
	cd backend && python manage.py startapp $(name)

# Create superuser
superuser:
	cd backend && python manage.py createsuperuser

# Collect static files
static:
	cd backend && python manage.py collectstatic --noinput

# Run tests
test:
	cd backend && python manage.py test

# Clean up everything - database, migrations, cache
clean:
	make clean-cache
	make reset-db
	@echo "Removing migration files (keeping __init__.py)..."
	@python -c "import os, glob; [os.remove(f) for f in glob.glob('backend/**/migrations/*.py', recursive=True) if not f.endswith('__init__.py') and os.path.exists(f)]"
	@echo "Clean completed!"

# Soft clean - only cache files
clean-cache:
	@echo "Cleaning Python cache files..."
	@python -c "import os, shutil, glob; [os.remove(f) for f in glob.glob('**/*.pyc', recursive=True) if os.path.exists(f)]; [shutil.rmtree(d) for d in glob.glob('**/__pycache__', recursive=True) if os.path.exists(d)]"
	@echo "Cache cleaned!"

# Reset database only
reset-db:
	@echo "Removing database..."
	@python -c "import os; os.remove('backend/db.sqlite3') if os.path.exists('backend/db.sqlite3') else None"
	@echo "Database removed!"

# Fresh start - clean everything and run initial setup
fresh:
	@echo "Starting fresh setup..."
	make clean
	cd backend && python manage.py makemigrations
	cd backend && python manage.py migrate
	@echo "Fresh setup completed! You may want to create a superuser with 'make superuser'"

all:
	make build
	make clean
	make migraterun

build:
	cd frontend && npm run build && cd ..

reyad:
	make build
	make run

front:
	cd frontend && npm start

# Show available commands
help:
	@echo "Available commands:"
	@echo "  make migraterun         - Run makemigrations, migrate, and start server"
	@echo "  make migrate     - Run makemigrations and migrate only"
	@echo "  make run         - Start migraterunelopment server only"
	@echo "  make serve port=8080 - Start server on specific port"
	@echo "  make app name=myapp  - Create new Django app"
	@echo "  make superuser   - Create superuser"
	@echo "  make static      - Collect static files"
	@echo "  make test        - Run tests"
	@echo "  make clean       - Remove db, migrations, and cache files"
	@echo "  make clean-cache - Remove only Python cache files"
	@echo "  make reset-db    - Remove only database file"
	@echo "  make fresh       - Clean everything and run initial setup"
	@echo "  make help        - Show this help message"

.PHONY: migraterun migrate run serve app superuser static test clean clean-cache reset-db fresh help reyad build front all


