
// src/main.tsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";

/* ================= PROTECTED ROUTE ================= */

import ProtectedRoute from "./components/ProtectedRoute";

/* ================= ADMIN ================= */

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminAddEvent from "./pages/admin/AdminAddEvent";
import AdminEditEvent from "./pages/admin/AdminEditEvent";

import ManageCategory from "./pages/admin/ManageCatogory";
import AdminAddCategory from "./pages/admin/AdminAddCatogory";
import AdminEditCategory from "./pages/admin/AdminEditCatogory";

import ViewStudent from "./pages/admin/ViewStudent";
import AdminEventRegistration from "./pages/admin/AdminEventRegistration";
import AdminEventStudent from "./pages/admin/AdminEventStudent";

import AdminAddAnnouncement from "./pages/admin/AdminAddAnnoucement";
import ShowAllAnnouncement from "./pages/admin/ShowAllAnnoucement";
import EditAnnouncement from "./pages/admin/EditAnnoucemet";

import AdminProfile from "./pages/admin/AdminProfile";

/* ================= STUDENT ================= */

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentBrowseEvents from "./pages/student/StudentdBrowseEvent";
import StudentRegisteredEvents from "./pages/student/StudentRegisteredEvent";
import StudentAnnouncements from "./pages/student/StudentAnnoucement";
import StudentProfile from "./pages/student/StudentProfile";
import StudentEventDetails from "./pages/student/StudentEventDetails";

/* ================= PUBLIC ================= */

import HomePage from "./pages/Homepage";
import { Login } from "./pages/login";

/* ================= ROUTER ================= */

const router = createBrowserRouter([
  /* ================= PUBLIC ================= */

  {
    path: "/",
    element: <HomePage />,
  },

  {
    path: "/home",
    element: <HomePage />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/browse-events",
    element: <StudentBrowseEvents />,
  },

  /* ================= ADMIN ================= */

  {
    path: "/admin",
    element: (
      <ProtectedRoute role="ADMIN">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/events",
    element: (
      <ProtectedRoute role="ADMIN">
        <AdminEvents />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/events/add",
    element: (
      <ProtectedRoute role="ADMIN">
        <AdminAddEvent />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/events/edit/:id",
    element: (
      <ProtectedRoute role="ADMIN">
        <AdminEditEvent />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/events/students/:eventId",
    element: (
      <ProtectedRoute role="ADMIN">
        <AdminEventStudent />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/category",
    element: (
      <ProtectedRoute role="ADMIN">
        <ManageCategory />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/category/add",
    element: (
      <ProtectedRoute role="ADMIN">
        <AdminAddCategory />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/category/edit/:id",
    element: (
      <ProtectedRoute role="ADMIN">
        <AdminEditCategory />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/view-students",
    element: (
      <ProtectedRoute role="ADMIN">
        <ViewStudent />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/registration",
    element: (
      <ProtectedRoute role="ADMIN">
        <AdminEventRegistration />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/announcements",
    element: (
      <ProtectedRoute role="ADMIN">
        <AdminAddAnnouncement />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/announcements/all",
    element: (
      <ProtectedRoute role="ADMIN">
        <ShowAllAnnouncement />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/announcements/edit/:id",
    element: (
      <ProtectedRoute role="ADMIN">
        <EditAnnouncement />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/profile",
    element: (
      <ProtectedRoute role="ADMIN">
        <AdminProfile />
      </ProtectedRoute>
    ),
  },

  /* ================= STUDENT ================= */

  {
    path: "/student",
    element: (
      <ProtectedRoute role="STUDENT">
        <StudentDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/student/registered-events",
    element: (
      <ProtectedRoute role="STUDENT">
        <StudentRegisteredEvents />
      </ProtectedRoute>
    ),
  },

  {
    path: "/student/announcements",
    element: (
      <ProtectedRoute role="STUDENT">
        <StudentAnnouncements />
      </ProtectedRoute>
    ),
  },

  {
    path: "/student/profile",
    element: (
      <ProtectedRoute role="STUDENT">
        <StudentProfile />
      </ProtectedRoute>
    ),
  },

  {
    path: "/student/event/:id",
    element: (
      <ProtectedRoute role="STUDENT">
        <StudentEventDetails />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

