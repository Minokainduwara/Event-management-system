import './App.css'
import './index.css'
import { Routes, Route, Navigate } from "react-router";
import { Login } from "./pages/login.tsx";
import { Home } from "./pages/Home.tsx";
import { EventDetail } from "./pages/EventDetail.tsx";
import { MyEvents } from "./pages/MyEvents.tsx";
import { CreateEvent } from "./pages/CreateEvent.tsx";
import { Analytics } from "./pages/Analytics.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { Routes, Route } from "react-router";
import { Navigate, Outlet } from "react-router";
import {Login} from "./pages/login.tsx";
import { Dashboard } from "./pages/dashboard.tsx";
import { EventsPage } from "./pages/events.tsx";
import { MyRegistrationsPage } from "./pages/myRegistrations.tsx";
import { ProfilePage } from "./pages/profile.tsx";

function StudentRoute() {
    const isStudent = localStorage.getItem("userRole") === "student";

    if (!isStudent) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

function App() {
  return (
      <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes — redirect to /login if not authenticated */}
          <Route path="/" element={
              <ProtectedRoute><Home /></ProtectedRoute>
          } />
          <Route path="/events/:id" element={
              <ProtectedRoute><EventDetail /></ProtectedRoute>
          } />
          <Route path="/my-events" element={
              <ProtectedRoute><MyEvents /></ProtectedRoute>
          } />
          <Route path="/create-event" element={
              <ProtectedRoute><CreateEvent /></ProtectedRoute>
          } />
          <Route path="/analytics" element={
              <ProtectedRoute><Analytics /></ProtectedRoute>
          } />

          {/* Catch-all — redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
      <div className="p-4">
          <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route element={<StudentRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/my-registrations" element={<MyRegistrationsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
      </div>
  )
}

export default App
