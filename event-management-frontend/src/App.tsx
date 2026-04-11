import './App.css'
import './index.css'
import { Routes, Route } from "react-router";
import {Login} from "./pages/login.tsx";
import { Home } from "./pages/Home.tsx";
import { EventDetail } from "./pages/EventDetail.tsx";
import { MyEvents } from "./pages/MyEvents.tsx";
import { CreateEvent } from "./pages/CreateEvent.tsx";

function App() {

  return (
      <div>
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/my-events" element={<MyEvents />} />
              <Route path="/create-event" element={<CreateEvent />} />
          </Routes>
      </div>
  )
}

export default App
