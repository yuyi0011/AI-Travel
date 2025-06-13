// 🔐 Authentication Utilities
// This module provides utility functions for user authentication,

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

// ===== UTILITY FUNCTIONS =====

// Check if user is logged in
export const isUserLoggedIn = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user) return false;
    
    const parsedUser = JSON.parse(user);
    return !!(parsedUser?.email && parsedUser?.name);
  } catch (error) {
    console.error('Error checking user login status:', error);
    return false;
  }
};

// Get current user data
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Clear user session
export const logoutUser = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
  localStorage.removeItem('redirectAfterLogin');
  toast.success('Logged out successfully');
};

// Redirect to login with current location saved
export const redirectToLogin = (message = 'Please sign in to continue') => {
  console.log('🔐 Redirecting to login:', message);
  
  // Save current path for redirect after login
  const currentPath = window.location.pathname + window.location.search;
  if (currentPath !== '/login') {
    localStorage.setItem('redirectAfterLogin', currentPath);
  }
  
  toast.info(message);
  window.location.href = '/login';
};

// Handle post-login redirect
export const handlePostLoginRedirect = () => {
  const redirectPath = localStorage.getItem('redirectAfterLogin');
  localStorage.removeItem('redirectAfterLogin');
  
  if (redirectPath && redirectPath !== '/login') {
    console.log('🎯 Redirecting after login to:', redirectPath);
    window.location.href = redirectPath;
  } else {
    // Default redirect after login
    window.location.href = '/create-trip';
  }
};

// ===== PROTECTED ROUTE COMPONENT =====

export const ProtectedRoute = ({ children, fallback = null }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    console.log('🔐 ProtectedRoute: Checking authentication...');
    
    const checkAuth = () => {
      const authenticated = isUserLoggedIn();
      console.log('🔐 Authentication status:', authenticated);
      
      if (!authenticated) {
        console.log('❌ User not authenticated, redirecting to login...');
        redirectToLogin('Please sign in to access this page');
        return;
      }
      
      console.log('✅ User authenticated');
      setIsAuthenticated(true);
      setIsChecking(false);
    };
    
    // Small delay to prevent flash
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Show loading while checking
  if (isChecking) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // Only render children if authenticated
  return isAuthenticated ? children : null;
};

// ===== AUTHENTICATION HOOK =====

export const useAuth = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);
  
  const logout = () => {
    logoutUser();
    setUser(null);
    window.location.href = '/';
  };
  
  const refreshUser = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };
  
  return {
    user,
    isLoggedIn: !!user,
    logout,
    refreshUser,
    redirectToLogin
  };
};