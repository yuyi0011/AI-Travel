
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import CreateTrip from './create-trip/index.jsx'
import Footer from './view-trip/components/Footer.jsx'
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
      <div className="app-layout">
        <Header />
        <main className="main-content">
          <RouterProvider router={router} />
        </main>
        <Footer />  {/* 🎉 FIXED: Footer now shows on ALL pages! */}
      </div>
      <Toaster />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)


