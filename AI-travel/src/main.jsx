<<<<<<< HEAD
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import CreateTrip from './create-trip/index.jsx'
import Header from './components/custom/Header.jsx'  
import { Toaster } from './components/ui/sonner.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Viewtrip from './view-trip/[tripId]/index.jsx'
import MyTrips from './my-trips/index.jsx'
import Login from './login.jsx'  // This login compoent is used to handle Google OAuth login

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/login',      
    element: <Login />   
  },
  {
    path: '/create-trip',
    element: <CreateTrip />
  },
  {
    path: '/view-trip/:tripId',
    element: <Viewtrip />
  },
  {
    path: '/my-trips',
    element: <MyTrips />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Header />
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
=======
import { StrictMode } from 'react'
import React from 'react'  
import ReactDOM from 'react'
import { createRoot } from 'react-dom/client';  // import this for the Root
import './index.css'
import App from './App.jsx'
import { RouterProvider,createBrowserRouter } from 'react-router-dom'
import CreateTrip from './create-trip/index.jsx'  // Add this import
import Header from './components/custom/Header'  // import Header
import Hero from './components/custom/Hero'
import {Toaster} from 'sonner'

const router=createBrowserRouter([
  {
    path:'/',
    element:<App/>
  },
{
  path:'/create-trip',
  element:<CreateTrip/>
}
])

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header/>
    <Toaster/>
    <RouterProvider router={router} />
  </React.StrictMode>
);
>>>>>>> f50de0aa62746a1f5e723ec9f5b3e4e0a1f6f2fc
