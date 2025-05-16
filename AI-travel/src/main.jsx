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