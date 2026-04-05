#!/bin/sh

# Wait for DB
python -m app.db_check

# Check if versions directory is empty or contains only __pycache__
if [ -z "$(ls -A alembic/versions | grep -v "__pycache__")" ]; then
    echo "No migrations found. Creating initial migration..."
    alembic revision --autogenerate -m "Initial migration"
fi

# Apply migrations
echo "Applying migrations..."
alembic upgrade head

# Start server
echo "Starting server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000
