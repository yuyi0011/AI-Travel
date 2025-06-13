import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
<<<<<<< HEAD
import { toast } from 'sonner'
import '../../Header.css' // 🎯 Our navigation styling arsenal

function Header() {
  const [user, setUser] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Simple user check - no complex hooks needed!
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
    setMounted(true)
  }, [])

  // Simple logout function
  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
    window.location.href = '/'
  }

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <>
        <div className='header-container'>
          <a href='/' className="logo-link">
            <img src='/logo.svg' alt="Logo" className="logo-image" />
          </a>
          <div className="loading-button"></div>
        </div>
        {/* Loading placeholder for top-right profile */}
        <div className="profile-loading-placeholder"></div>
      </>
    )
  }

  return (
    <>
      {/* 🎯 MAIN HEADER - Clean and minimal */}
      <div className='header-container'>
        <a href='/' className="logo-link">
          <img 
            src='/logo.svg' 
            alt="Logo"
            className="logo-image"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextElementSibling.style.display = 'block'
            }}
          />
          <div className="logo-fallback">✈️AI Trip Planner</div>
        </a>

        <div className="header-actions">
          {user ? (
            <div className='nav-buttons-container'>
              <a href='/create-trip'>
                <Button variant="outline" className="nav-button">
                  + Create Trip
                </Button>
              </a>
              <a href='/my-trips'>
                <Button variant="outline" className="nav-button">
                  My Trips
                </Button>
              </a>
              
              {/* 🚀 PROFILE BADGE - Integrated in header */}
              <Popover>
                <PopoverTrigger>
                  {user?.picture ? (
                    <img 
                      src={user.picture} 
                      className='profile-avatar'
                      alt="User profile"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        if (e.target.nextElementSibling) {
                          e.target.nextElementSibling.style.display = 'flex'
                        }
                      }}
                    />
                  ) : (
                    <div className="avatar-fallback">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </PopoverTrigger>
                
                <PopoverContent className="profile-popover">
                  <div className="user-info">
                    {user?.picture ? (
                      <img src={user.picture} className='popover-avatar' alt="User profile" />
                    ) : (
                      <div className="popover-avatar-fallback">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="user-name">{user?.name || 'User'}</p>
                      <p className="user-email">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="popover-actions">
                    <a href="/create-trip" className="popover-link">🎯 Create New Trip</a>
                    <a href="/my-trips" className="popover-link">📋 My Trips</a>
                    <button className='logout-btn' onClick={logout}>🚪 Sign Out</button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <a href="/login">
              <Button className="signin-button">
                Sign In
              </Button>
            </a>
          )}
        </div>
      </div>
    </>
=======
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigation } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axios from 'axios';
function Header() {

  const user = JSON.parse(localStorage.getItem('user'));
  const [openDailog, setOpenDailog] = useState(false);

  useEffect(() => {
    console.log(user)
  }, [])

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  })

  const GetUserProfile = async(tokenInfo) => {
    console.log("HERE",tokenInfo)
     axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?acess_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDailog(false);
      window.location.reload()
    })
  }

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
     <a href='/'>
      <img src='/logo.svg' />
      </a>
      <div>
        {user ?
          <div className='flex items-center gap-3'>
            <a href='/create-trip'>
            <Button variant="outline" 
            className="rounded-full">+ Create Trip</Button>
            </a>
            <a href='/my-trips'>
            <Button variant="outline" 
            className="rounded-full">My Trips</Button>
            </a>
            <Popover>
            <PopoverTrigger>
            <img src={user?.picture} className='h-[35px] w-[35px] rounded-full'/>
            </PopoverTrigger>
            <PopoverContent>
              <h2 className='cursor-pointer' onClick={()=>{
                googleLogout();
                localStorage.clear();
                window.location.reload();
              }}>Logout</h2>
            </PopoverContent>
          </Popover>
          </div>
          :
          <Button onClick={()=>setOpenDailog(true)}>Sign In</Button>
        }
      </div>
      <Dialog open={openDailog}>

<DialogContent>
  <DialogHeader>

    <DialogDescription>
      <img src="/logo.svg" />
      <h2 className='font-bold text-lg mt-7'>Sign In With Google</h2>
      <p>Sign in to the App with Google authentication securely</p>

      <Button

        onClick={login}
        className="w-full mt-5 flex gap-4 items-center">

        <FcGoogle className='h-7 w-7' />
        Sign In With Google

      </Button>

    </DialogDescription>
  </DialogHeader>
</DialogContent>
</Dialog>
    </div>
>>>>>>> f50de0aa62746a1f5e723ec9f5b3e4e0a1f6f2fc
  )
}

export default Header