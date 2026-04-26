import './App.css'
import './index.css'
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./pages/login.tsx";

import { RoleGuard } from "./shared/ui/RoleGuard.tsx";

function App() {

  return (
      <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          <Route element={<RoleGuard allowedRoles={["student"]} />}>
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              {/* <Route path="/events" element={<EventsPage />} />
              <Route path="/my-registrations" element={<MyRegistrationsPage />} />
              <Route path="/profile" element={<ProfilePage />} /> */}
          </Route>

          {/* <Route element={<RoleGuard allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Route>

          <Route element={<RoleGuard allowedRoles={["faculty"]} />}>
              <Route path="/faculty/dashboard" element={<FacultyDashboardPage />} />
          </Route> */}

          <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  )
}

export default App
