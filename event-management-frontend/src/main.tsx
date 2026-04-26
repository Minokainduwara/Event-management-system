import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminEditEvent from "./pages/admin/AdminEditEvent.tsx";
import AdminEventRegistration from "./pages/admin/AdminEventRegistration.tsx";
import AdminAddAnnoucement from "./pages/admin/AdminAddAnnoucement.tsx";
import ShowAllAnnoucement from "./pages/admin/ShowAllAnnoucement.tsx";
import AdminEventStudent from "./pages/admin/AdminEventStudent.tsx";
import { Login } from "./pages/login.tsx";
import StudentDashboard from "./pages/student/StudentDashboard.tsx";
import StudentBrowseEvents from "./pages/student/StudentdBrowseEvent.tsx";
import StudentRegisteredEvents from "./pages/student/StudentRegisteredEvent.tsx";
import StudentAnnouncements from "./pages/student/StudentAnnoucement.tsx";
import StudentProfile from "./pages/student/StudentProfile.tsx";
import StudentEventDetails from "./pages/student/StudentEventDetails.tsx";
import AdminProfile from "./pages/admin/AdminProfile.tsx";
import HomePage from "./pages/HomePage.tsx";
import EventsBrowseHome from "./components/Eventsbrowsehome.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
  },
  {
    path: "/home",
    element: <HomePage/>,
  },
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
    path: "/admin/events/edit/:id",
    element: <AdminEditEvent />,
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
    path: "/admin/events/students/:eventId",
    element: <AdminEventStudent />,
  },
  {
    path: "/profile",
    element: <AdminProfile />,
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Login />,
  },
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
  {
    path: "/home-events",
    element: <EventsBrowseHome />,
  },

    {
        path: "/organizer",
        element: <OrganizerHomePage />,
    },
    {
        path: "/organizer/my-events",
        element: <MyEventsPage />,
    },
    {
        path: "/organizer/create-event",
        element: <CreateEventPage />,
    },
    {
        path: "/organizer/analytics",
        element: <AnalyticsPage />,
    },
    {
        path: "/organizer/announcements",
        element: <AnnouncementsPage />,
    },
    {
        path: "/organizer/profile",
        element: <ProfilePage />,
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);