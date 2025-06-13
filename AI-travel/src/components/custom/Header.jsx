import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from 'sonner'
import '../../Header.css' // 🎯 The navigation styling arsenal

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
  )
}

export default Header