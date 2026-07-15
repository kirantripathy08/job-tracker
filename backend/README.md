# Job Application Tracker — Backend

FastAPI + PostgreSQL CRUD API.

## Setup
1. Install PostgreSQL, create the DB: `createdb jobtracker`
2. Apply schema: `psql -d jobtracker -f schema.sql`
3. `python -m venv venv && source venv/bin/activate`
4. `pip install -r requirements.txt`
5. Update `DATABASE_URL` in `database.py` if your credentials differ
6. `uvicorn main:app --reload`
7. Visit http://localhost:8000/docs for interactive Swagger UI
