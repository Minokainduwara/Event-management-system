# Student Dashboard Frontend Agent Reference

## Scope

- Project: University of Ruhuna Event Management System
- This document covers the student dashboard implementation and the new role-ready frontend structure.
- Admin and faculty have placeholder dashboards and isolated feature folders ready for each team.
- UI is aligned to the provided Figma student screenshots for:
  - Dashboard view
  - View Events page
  - My Registered Events page

## Implemented Routes

- /login
- /dashboard
- /events
- /my-registrations
- /profile
- /admin/dashboard
- /faculty/dashboard

Role routes are guarded by a reusable role guard using local storage userRole values.

## Architecture

### Role Feature Folders

- src/features/student/...
- src/features/admin/...
- src/features/faculty/...

### Shared Modules

- src/shared/api
- src/shared/ui
- src/shared/types

### Reusable Role Guard

- Guard component: src/shared/ui/RoleGuard.tsx
- Role type and role-home mapping: src/shared/types/auth.ts
- App routes map each protected section through RoleGuard with allowedRoles.
- Wrong role on a protected route is redirected to that role's home route.

## Figma-Aligned Layout System

### Global Student Layout

- Sidebar navigation on desktop with:
  - UEMS brand block
  - Dashboard, View Events, and My Registered Events nav items
  - Logout action anchored at sidebar bottom
- Mobile fallback:
  - Compact top brand row
  - Horizontal scroll nav chips
- Main content area:
  - Page header section (title and subtitle)
  - Light-gray canvas for page body cards

### Dashboard Page

- Header:
  - Title: Dashboard
  - Subtitle: Welcome back, student first name
- Metric cards:
  - Available Events
  - My Registrations
  - Attended Events
- Upcoming Events table:
  - Columns: Event Name, Category
- Recent Activity card:
  - Registration and attendance feed with icon badges and relative time labels

### View Events Page

- Search bar for title and description
- Category filter dropdown (All + specific categories)
- Two-column responsive event card grid
- Event card includes:
  - Category badge
  - Event name
  - Description
  - Date and location rows
  - Register button
- Duplicate registrations are blocked and a feedback toast is shown

### My Registered Events Page

- Top section: desktop-friendly registration table
  - Columns: Event Name, Date, Location, Status, Registered On
- Bottom section: detailed registration cards for each registered event
- Status styles:
  - Confirmed (green)
  - Pending (amber)
  - Attended (blue)

### Profile Page

- Existing editable profile flow remains active on /profile:
  - fullName
  - registrationNumber
  - email
- Validation and save/cancel behavior preserved

## Data Layer

- File: src/features/student/services/studentData.ts
- Current mode: mock-first local storage implementation.
- API-ready approach: swap service implementation later while keeping page UI stable.
- Seeded behavior:
  - If no registration data exists in local storage, default sample registrations are seeded.
  - Legacy status "registered" is normalized to "confirmed".

## Types

- File: src/shared/types/student.ts
- Core models:
  - StudentProfile
  - EventItem
  - StudentRegistration
  - DashboardStats
  - RegisterEventResult

Auth and role models:

- File: src/shared/types/auth.ts
- Core models:
  - UserRole
  - ROLE_HOME_ROUTE map
  - getStoredUserRole

### Current Status Model

- pending
- confirmed
- attended

### Current Event Categories

- Technology
- Sports
- Cultural
- Career
- Business
- Science

## Key Files

- src/App.tsx
- src/main.tsx
- src/pages/login.tsx
- src/features/student/pages/dashboard.tsx
- src/features/student/pages/events.tsx
- src/features/student/pages/myRegistrations.tsx
- src/features/student/pages/profile.tsx
- src/features/student/components/StudentLayout.tsx
- src/features/student/services/studentData.ts
- src/features/admin/pages/dashboard.tsx
- src/features/faculty/pages/dashboard.tsx
- src/shared/ui/RoleGuard.tsx
- src/shared/types/student.ts
- src/shared/types/auth.ts
- src/shared/api/api.ts

## Backend Integration Notes

When backend endpoints are ready, replace service internals in src/features/student/services/studentData.ts with API calls while preserving exported function signatures.

Recommended backend contracts:

- GET /events
- GET /events?category=categoryName
- POST /events/{id}/register
- GET /students/me/registrations
- GET /students/me/profile
- PUT /students/me/profile

Registration payload must include:

- fullName
- registrationNumber
- email
- eventId

## How To Run And View Student Dashboard

1. Open terminal in event-management-frontend.
2. Run npm install (first time only).
3. Run npm run dev.
4. Open the local Vite URL in browser.
5. Login from /login.
6. You will be redirected to /dashboard as student role.

Demo notes:

- Login flow currently seeds userRole as student.
- Admin route is /admin/dashboard and faculty route is /faculty/dashboard.
- To test non-student guards quickly in dev mode, set localStorage userRole manually.

## QA Checklist

1. Login as student and access protected routes.
2. Event search and category filter update the cards correctly.
3. Event registration shows feedback and appears in my registrations.
4. Profile updates persist across refresh.
5. Registration uses latest profile values.
6. Status pills render correctly for confirmed, pending, and attended.
7. Student routes only allow student role.
8. Admin and faculty routes are isolated and guard-protected.
9. Build passes without TypeScript errors.
