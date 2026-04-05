---
description: "Task list for Personalized Book Recommender implementation"
---

# Tasks: Personalized Book Recommender

**Input**: Design documents from `/specs/001-book-recommender/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md
**Tests**: Optional (not explicitly requested in spec), but unit tests included for backend logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directory structure for frontend and backend
- [x] T002 Initialize backend environment (venv, requirements.txt, .env) in backend/
- [x] T003 Initialize frontend environment (Vite React, Tailwind, Axios, .env) in frontend/
- [x] T004 Setup PostgreSQL database and create local DB 'bookrec'
- [x] T005 [P] Configure Prettier/ESLint (frontend) and Black/Flake8 (backend)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create backend configuration and environment loading in backend/app/config.py
- [x] T007 Implement database connection and session handling in backend/app/database.py
- [x] T008 Create base SQLAlchemy model mixins in backend/app/models/__init__.py
- [x] T009 Initialize Alembic and configure env.py for migrations in backend/
- [x] T010 Implement security utils (password hashing, JWT generation) in backend/app/utils/security.py
- [x] T011 Create custom exception handlers in backend/app/utils/exceptions.py
- [x] T012 Configure Axios instance with interceptors in frontend/src/services/api.js
- [x] T013 Implement AuthContext for global state in frontend/src/contexts/AuthContext.jsx
- [x] T014 Setup React Router and Main Layout structure in frontend/src/App.jsx and frontend/src/layout/Navbar.jsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication & Management (Priority: P1)

**Goal**: Users can securely register, log in, and recover their passwords.

**Independent Test**: Register a new user, log in to receive JWT, access protected route.

### Implementation for User Story 1

- [x] T015 [P] [US1] Create User and PasswordResetToken models in backend/app/models/user.py
- [x] T016 [P] [US1] Define Pydantic schemas for Auth/User in backend/app/schemas/auth.py
- [x] T017 [US1] Implement AuthService logic (login, register) in backend/app/services/auth_service.py
- [x] T018 [US1] Create Auth and User API endpoints in backend/app/routers/auth.py
- [x] T019 [US1] Register Auth router in backend/app/main.py
- [x] T020 [P] [US1] Create Login Form component in frontend/src/components/auth/LoginForm.jsx
- [x] T021 [P] [US1] Create Register Form component in frontend/src/components/auth/RegisterForm.jsx
- [x] T022 [P] [US1] Create Forgot Password components in frontend/src/components/auth/ForgotPasswordForm.jsx
- [x] T023 [US1] Implement useAuth hook and integrate forms in frontend/src/hooks/useAuth.js
- [x] T024 [US1] Create Auth Pages (Login, Register) in frontend/src/pages/

**Checkpoint**: User Authentication functional.

---

## Phase 4: User Story 2 - My Books Library Management (Priority: P1)

**Goal**: Users can maintain a personal library of books.

**Independent Test**: Add a book, see it in the grid, edit details, delete book.

### Implementation for User Story 2

- [x] T025 [P] [US2] Create Book SQLAlchemy model in backend/app/models/book.py
- [x] T026 [P] [US2] Define Pydantic schemas for Book CRUD in backend/app/schemas/book.py
- [x] T027 [US2] Implement BookService (CRUD operations) in backend/app/services/book_service.py
- [x] T028 [US2] Create Book API endpoints in backend/app/routers/books.py
- [x] T029 [US2] Implement frontend BookService API calls in frontend/src/services/bookService.js
- [x] T030 [P] [US2] Create BookCard component in frontend/src/components/books/BookCard.jsx
- [x] T031 [P] [US2] Create BookGrid component in frontend/src/components/books/BookGrid.jsx
- [x] T032 [US2] Create BookForm component (Add/Edit) with image upload in frontend/src/components/books/BookForm.jsx
- [x] T033 [US2] Implement MyBooksPage with filter/sort logic in frontend/src/pages/MyBooksPage.jsx
- [x] T034 [US2] Implement useBooks hook for state management in frontend/src/hooks/useBooks.js

**Checkpoint**: Book Management functional.

---

## Phase 5: User Story 3 - AI Recommendation Workflow (Priority: P2)

**Goal**: Users can generate AI recommendations based on a reference book.

**Independent Test**: Select book -> Generate -> View 3 results -> Accept one.

### Implementation for User Story 3

- [x] T035 [P] [US3] Create Recommendation SQLAlchemy model in backend/app/models/recommendation.py
- [x] T036 [P] [US3] Define Recommendation schemas in backend/app/schemas/recommendation.py
- [x] T037 [US3] Implement GeminiService for AI integration in backend/app/services/gemini_service.py
- [x] T038 [US3] Implement RecommendationService (generate logic) in backend/app/services/recommendation_service.py
- [x] T039 [US3] Create Recommendation Generate endpoint in backend/app/routers/recommendations.py
- [x] T040 [US3] Implement frontend RecommendationService in frontend/src/services/recommendationService.js
- [x] T041 [P] [US3] Create RecommendationCard component in frontend/src/components/recommendations/RecommendationCard.jsx
- [x] T042 [US3] Create GetRecommendationsPage with selection UI in frontend/src/pages/GetRecommendationsPage.jsx
- [x] T043 [US3] Implement generation loading state and result display in frontend/src/pages/GetRecommendationsPage.jsx

**Checkpoint**: AI Generation functional.

---

## Phase 6: User Story 4 - Recommendation Management (Priority: P3)

**Goal**: Users can manage accepted recommendations and view history.

**Independent Test**: View Accepted list, Mark Read, Move to My Books.

### Implementation for User Story 4

- [x] T044 [US4] Add Update/List endpoints to backend/app/routers/recommendations.py
- [x] T045 [US4] Implement logic to move Recommendation to Book in backend/app/services/book_service.py
- [x] T046 [P] [US4] Create RecommendationList component (Tabs: Accepted/All) in frontend/src/components/recommendations/RecommendationList.jsx
- [x] T047 [US4] Implement RecommendationsPage in frontend/src/pages/RecommendationsPage.jsx
- [x] T048 [US4] Add "Mark as Read" and "Move to Library" actions in frontend/src/hooks/useRecommendations.js

**Checkpoint**: Full Recommendation lifecycle functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T049 [P] Polish UI with consistent Tailwind classes across all pages
- [x] T050 Improve error handling and toast notifications in frontend
- [x] T051 Write README.md with setup and usage instructions

---

## Dependencies & Execution Order

1. **Setup & Foundational** (T001-T014) must complete first.
2. **US1 (Auth)** (T015-T024) blocks US2, US3, US4 (requires logged-in user).
3. **US2 (My Books)** (T025-T034) blocks US3 (requires reference books).
4. **US3 (AI Recs)** (T035-T043) blocks US4 (requires recommendations to manage).
5. **US4 (Rec Mgmt)** (T044-T048) is the final feature phase.

## Parallel Implementation Strategy

- **Frontend/Backend**: Within each story, frontend components (marked [P]) and backend models/schemas (marked [P]) can be built in parallel once the Foundation is set.
- **Team Split**:
  - Dev A: Backend Services & API
  - Dev B: Frontend Components & Pages
