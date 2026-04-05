# Research & Decisions: Personalized Book Recommender

**Feature**: Personalized Book Recommender
**Date**: 2025-11-28

## Technology Stack Decisions

### Frontend Framework
- **Decision**: React 18+ with Vite
- **Rationale**: Industry standard, rich ecosystem, component-based architecture fits the UI requirements perfectly.
- **Alternatives**: Vue (less preferred by team), Angular (too heavy for MVP).

### Styling
- **Decision**: Tailwind CSS
- **Rationale**: Utility-first approach speeds up development, ensures consistency, and handles responsive design easily.
- **Alternatives**: Bootstrap (dated look), Material UI (heavy bundle size).

### Backend Framework
- **Decision**: FastAPI (Python 3.11+)
- **Rationale**: High performance (async), easy OpenAPI generation, native Python support for AI/ML libraries.
- **Alternatives**: Django (too monolithic), Flask (too much boilerplate for async).

### Database
- **Decision**: PostgreSQL 15+ with SQLAlchemy (Async)
- **Rationale**: Robust relational data integrity, native UUID support, excellent for structured data (Users, Books).
- **Alternatives**: MongoDB (relational data structure suits SQL better here).

### AI Service
- **Decision**: Google Gemini API (`gemini-pro`)
- **Rationale**: State-of-the-art performance, generous free tier/pricing, good Python SDK (`google-generativeai`).
- **Alternatives**: OpenAI GPT-4 (higher cost), Local LLM (too resource intensive for web host).

### State Management
- **Decision**: React Context API
- **Rationale**: Sufficient for Auth and Theme state. Avoids complexity of Redux for this scope.

## Technical Constraints & Standards
- **Code Quality**: ESLint + Prettier (Frontend), Black + Flake8 (Backend).
- **Testing**: Jest/RTL for Frontend components, Pytest for Backend logic.
- **Auth**: JWT (HS256) with HTTP-only considerations (localStorage for MVP).
