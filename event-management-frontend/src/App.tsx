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
}

export default App
