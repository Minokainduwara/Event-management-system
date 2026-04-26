import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

/* ================= ADMIN ================= */

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminAddEvent from "./pages/admin/AdminAddEvent";
import AdminEditEvent from "./pages/admin/AdminEditEvent";

import ManageCatogory from "./pages/admin/ManageCatogory";
import AdminAddCatogory from "./pages/admin/AdminAddCatogory";
import AdminEditCatogory from "./pages/admin/AdminEditCatogory";

import ViewStudent from "./pages/admin/ViewStudent";
import AdminEventRegistration from "./pages/admin/AdminEventRegistration";
import AdminEventStudent from "./pages/admin/AdminEventStudent";

import AdminAddAnnoucement from "./pages/admin/AdminAddAnnoucement";
import ShowAllAnnoucement from "./pages/admin/ShowAllAnnoucement";
import EditAnnoucemet from "./pages/admin/EditAnnoucemet";

import AdminProfile from "./pages/admin/AdminProfile";

/* ================= STUDENT ================= */

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentBrowseEvents from "./pages/student/StudentdBrowseEvent";
import StudentRegisteredEvents from "./pages/student/StudentRegisteredEvent";
import StudentAnnouncements from "./pages/student/StudentAnnoucement";
import StudentProfile from "./pages/student/StudentProfile";
import StudentEventDetails from "./pages/student/StudentEventDetails";

/* ================= AUTH ================= */

import { Login } from "./pages/login";

/* ================= ROUTES ================= */

const router = createBrowserRouter([

  /* ---------- AUTH ---------- */

  {
    path: "/",
    element: <Login />,
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
    path: "/events",
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

  {
    path: "/catogory",
    element: <ManageCatogory />,
  },

  {
    path: "/admin/catogory/add",
    element: <AdminAddCatogory />,
  },

  {
    path: "/admin/catogory/edit/:id",
    element: <AdminEditCatogory />,
  },

  {
    path: "/viewstudents",
    element: <ViewStudent />,
  },

  {
    path: "/registration",
    element: <AdminEventRegistration />,
  },

  {
    path: "/announcement",
    element: <AdminAddAnnoucement />,
  },

  {
    path: "/showannouncement",
    element: <ShowAllAnnoucement />,
  },

  {
    path: "/editannoucement/:id",
    element: <EditAnnoucemet />,
  },

  {
    path: "/profile",
    element: <AdminProfile />,
  },

  /* ---------- STUDENT ---------- */

  {
    path: "/student",
    element: <StudentDashboard />,
  },

  {
    path: "/studentbrowseevent",
    element: <StudentBrowseEvents />,
  },

  {
    path: "/studentevents",
    element: <StudentRegisteredEvents />,
  },

  {
    path: "/studentannoucement",
    element: <StudentAnnouncements />,
  },

  {
    path: "/studentprofile",
    element: <StudentProfile />,
  },

  {
    path: "/studenteventdetails/:id",
    element: <StudentEventDetails />,
  },

]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);