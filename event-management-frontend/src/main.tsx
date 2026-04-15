import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminDashboard from './pages/AdminDashboard.tsx'
import AdminAddCatogory from './pages/AdminAddCatogory.tsx'
import  AdminEditCatogory from './pages/AdminEditCatogory.tsx'
import ViewStudent from './pages/ViewStudent.tsx'
import AdminEvents from './pages/AdminEvents.tsx'
import EditAnnoucemet from './pages/EditAnnoucemet.tsx'
import AdminAddEvent from './pages/AdminAddEvent.tsx'
import  ManageCatogory from './pages/ManageCatogory.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import  AdminEditEvent from './pages/AdminEditEvent.tsx'
import AdminEventRegistration from './pages/AdminEventRegistration.tsx'
import AdminAddAnnoucement from './pages/AdminAddAnnoucement.tsx'
import ShowAllAnnoucement from './pages/ShowAllAnnoucement.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminDashboard/>,
  },  
  {
    path: "/events",
    element: <AdminEvents/>,
  },
  {
    path: "/admin/events/add",
    element: <AdminAddEvent />,
  },
  {
    path: "/catogory",
    element: <ManageCatogory/>,
  },
  {
    path: "/admin/catogory/add",
    element: <AdminAddCatogory/>,
  },
  {
    path: "/admin/catogory/edit/:id",
    element: <AdminEditCatogory/>,
  },
   {
    path: "/viewstudents",
    element: <ViewStudent/>,
  },
  {
    path: "/admin/events/edit/:id",
    element: <AdminEditEvent/>,
  },
  {
    path: "/registration",
    element: <AdminEventRegistration/>,
  },
  {
    path: "/announcement",
    element: <AdminAddAnnoucement/>,
  },
  {
    path: "/showannouncement",
    element: <ShowAllAnnoucement/>,
  },
  {
    path: "/editannoucement/:id",
    element: <EditAnnoucemet/>,
  },
]);

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <StrictMode>
            <App />
        </StrictMode>
    </BrowserRouter>
)

