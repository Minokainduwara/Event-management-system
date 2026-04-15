import './App.css'
import './index.css'
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
