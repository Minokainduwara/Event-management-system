import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

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

/* ================= AUTH / PUBLIC ================= */

import HomePage from "./pages/Homepage";
import { Login } from "./pages/login";

/* ================= ROUTES ================= */

const router = createBrowserRouter([
  /* ---------- PUBLIC ---------- */

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

  /* ---------- ADMIN ---------- */

  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/events",
    element: <AdminEvents />,
  },
  {
    path: "/admin/events/add",
    element: <AdminAddEvent />,
  },
  {
    path: "/admin/events/edit/:id",
    element: <AdminEditEvent />,
  },
  {
    path: "/admin/events/students/:eventId",
    element: <AdminEventStudent />,
  },

  /* CATEGORY (FIXED SPELLING + STRUCTURE) */

  {
    path: "/admin/category",
    element: <ManageCategory />,
  },
  {
    path: "/admin/category/add",
    element: <AdminAddCategory />,
  },
  {
    path: "/admin/category/edit/:id",
    element: <AdminEditCategory />,
  },

  {
    path: "/admin/view-students",
    element: <ViewStudent />,
  },
  {
    path: "/admin/registration",
    element: <AdminEventRegistration />,
  },

  /* ANNOUNCEMENTS */

  {
    path: "/admin/announcements",
    element: <AdminAddAnnouncement />,
  },
  {
    path: "/admin/announcements/all",
    element: <ShowAllAnnouncement />,
  },
  {
    path: "/admin/announcements/edit/:id",
    element: <EditAnnouncement />,
  },

  {
    path: "/admin/profile",
    element: <AdminProfile />,
  },

  /* ---------- STUDENT ---------- */

  {
    path: "/student",
    element: <StudentDashboard />,
  },

  /* ✅ FIXED ROUTE (your original bug) */
  {
    path: "/browse-events",
    element: <StudentBrowseEvents />,
  },

  {
    path: "/student/registered-events",
    element: <StudentRegisteredEvents />,
  },
  {
    path: "/student/announcements",
    element: <StudentAnnouncements />,
  },
  {
    path: "/student/profile",
    element: <StudentProfile />,
  },
  {
    path: "/student/event/:id",
    element: <StudentEventDetails />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);