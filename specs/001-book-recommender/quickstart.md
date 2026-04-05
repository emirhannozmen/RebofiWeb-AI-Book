# Quickstart: Personalized Book Recommender

## Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL 15+**
- **Google Gemini API Key**

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd <repo-name>
   ```

2. **Backend Setup (FastAPI)**
   ```bash
   cd backend
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   
   pip install -r requirements.txt
   
   # Configure .env
   cp .env.example .env
   # Edit .env with your DB credentials and Gemini API Key
   ```

3. **Frontend Setup (React)**
   ```bash
   cd frontend
   npm install
   
   # Configure .env
   cp .env.example .env
   # Ensure REACT_APP_API_URL points to backend (default: http://localhost:8000)
   ```

4. **Database Setup**
   ```bash
   # Make sure PostgreSQL service is running
   # Create the database
   createdb bookrec
   
   # Run migrations
   cd backend
   alembic upgrade head
   ```

## Running the Application

1. **Start Backend**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   # API docs available at http://localhost:8000/docs
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm start
   # App running at http://localhost:3000
   ```

## Common Commands

- **Run Tests**:
  - Backend: `pytest`
  - Frontend: `npm test`
- **Linting**:
  - Backend: `flake8 .`
  - Frontend: `npm run lint`
