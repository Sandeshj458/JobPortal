import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from './components/admin/AdminJobs'
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import UpdateJobForm from './components/admin/UpdateJobForm'
import ProtectedRoute from './components/admin/ProtectedRoute'
import { Toaster } from 'react-hot-toast';
import Help from './components/Help'
import ForgotPassword from './components/ForgotPassword'

const appRouter = createBrowserRouter([
  // Client / User side
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/jobs',
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: '/browse',
    element: <Browse />
  },
  {
    path: '/profile',
    element: <Profile />
  },

  // Admin side
  {
    path: '/admin/companies',
    element: <ProtectedRoute> <Companies /> </ProtectedRoute>
  },
  {
    path: '/admin/companies/create',
    element: <ProtectedRoute> <CompanyCreate /> </ProtectedRoute>
  },
  {
    path: '/admin/companies/:id',
    element: <ProtectedRoute> <CompanySetup /> </ProtectedRoute>
  },
  {
    path: '/admin/jobs',
    element: <ProtectedRoute> <AdminJobs /> </ProtectedRoute>
  },
  {
    path: '/admin/jobs/create',
    element: <ProtectedRoute> <PostJob /> </ProtectedRoute>
  },
  {
    path: '/admin/jobs/:id/applicants',
    element: <ProtectedRoute> <Applicants /> </ProtectedRoute>
  },
  {
    path: '/admin/jobs/edit/:id',
    element: <ProtectedRoute> <UpdateJobForm /> </ProtectedRoute>
  },

  // For All 
   {
    path: '/help',
    element: <Help />
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
])

function App() {

  return (
    <>
      <RouterProvider router={appRouter} />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default App
