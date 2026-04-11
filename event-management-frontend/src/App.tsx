import './App.css'
import './index.css'
import { Routes, Route } from "react-router";
import {Login} from "./pages/login.tsx";
import { Home } from "./pages/Home.tsx";
import { EventDetail } from "./pages/EventDetail.tsx";

function App() {

  return (
      <div>
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/events/:id" element={<EventDetail />} />
          </Routes>
      </div>
  )
}

export default App
