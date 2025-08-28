
migrate-run:
	make migrate
	make run-backend


migrate:
	cd backend && python manage.py makemigrations && python manage.py migrate


run-backend:
	cd backend && python manage.py runserver


clean-backend:
	make clean-backend-cache
	make reset-db
	@python -c "import os, glob; [os.remove(f) for f in glob.glob('backend/**/migrations/*.py', recursive=True) if not f.endswith('__init__.py') and os.path.exists(f)]"


clean-backend-cache:
	@python -c "import os, shutil, glob; [os.remove(f) for f in glob.glob('**/*.pyc', recursive=True) if os.path.exists(f)]; [shutil.rmtree(d) for d in glob.glob('**/__pycache__', recursive=True) if os.path.exists(d)]"

reset-db:
	@python -c "import os; os.remove('backend/db.sqlite3') if os.path.exists('backend/db.sqlite3') else None"


all:
	make build
	make clean-backend
	make migrate-run

build:
	cd frontend && npm run build && cd ..

build-run-backend:
	make build
	make run-backend

run-frontend:
	cd frontend && npm start


help:
	@echo "  make all"
	@echo "  make migrate-run"
	@echo "  make migrate "
	@echo "  make run-backend "
	@echo "  make clean-backend "
	@echo "  make clean-backend-cache "
	@echo "  make reset-db "
	@echo "  make run-frontend "
	@echo "  make build-run-backend "
	@echo "  make build "

.PHONY: migrate-run migrate run-backend clean-backend clean-backend-cache reset-db  help build-run-backend build run-frontend all


