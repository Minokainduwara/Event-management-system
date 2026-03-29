# Student Dashboard Frontend Agent Reference

## Scope
- Project: University of Ruhuna Event Management System
- This document covers student dashboard frontend implementation only.
- Faculty and admin dashboards are out of scope for this phase.

## Implemented Routes
- /login
- /dashboard
- /events
- /my-registrations
- /profile

Student-protected routes are guarded by role check in local storage (userRole=student).

## Feature Behavior
1. Event View
- Two event categories are available:
  - Open Events (view-only)
  - Registration Required Events (register action available)
- Event details can be opened in a modal.

2. Registration Flow
- Only restricted events allow registration.
- Register action sends request using student profile fields from profile storage:
  - fullName
  - registrationNumber
  - email
- Duplicate registrations are blocked in UI/service.
- User receives toast-style feedback messages.

3. Student Profile
- Editable fields:
  - fullName
  - registrationNumber
  - email
- Includes validation and save/cancel flow.
- Saved profile values are reused by dashboard and registration payloads.

4. My Registrations
- Shows requested events and current status (pending/registered).

5. UI/Styling Notes
- Global Layout: Uses `StudentLayout.tsx` which provides a sticky glassmorphism header, university branding, and active tab states.
- Dashboard Styling: Features a dense gradient hero block and responsive hover-animated metric cards.
- Icons: `lucide-react` is used heavily across components for visual accents.
- All styles strictly use Tailwinds v4 utility classes.

## Data Layer
- File: src/services/studentData.ts
- Current mode: mock-first local storage implementation.
- API-ready approach: swap service implementation later while keeping page UI stable.

## Types
- File: src/types/student.ts
- Core models:
  - StudentProfile
  - EventItem
  - StudentRegistration
  - DashboardStats
  - RegisterEventResult

## Key Files
- src/App.tsx
- src/main.tsx
- src/pages/login.tsx
- src/pages/dashboard.tsx
- src/pages/events.tsx
- src/pages/myRegistrations.tsx
- src/pages/profile.tsx
- src/components/StudentLayout.tsx
- src/services/studentData.ts
- src/types/student.ts

## Backend Integration Notes
When backend endpoints are ready, replace service internals in src/services/studentData.ts with API calls while preserving exported function signatures.

Recommended backend contracts:
- GET /events?category=open|restricted
- POST /events/{id}/register
- GET /students/me/registrations
- GET /students/me/profile
- PUT /students/me/profile

Registration payload must include:
- fullName
- registrationNumber
- email
- eventId

## QA Checklist
1. Login as student and access protected routes.
2. Open events are view-only.
3. Restricted event registration shows feedback and appears in my registrations.
4. Profile updates persist across refresh.
5. Registration uses latest profile values.
6. Build passes without TypeScript errors.
