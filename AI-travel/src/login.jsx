import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useGoogleLogin } from '@react-oauth/google'
import { FcGoogle } from "react-icons/fc"
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const login = useGoogleLogin({
    onSuccess: (codeResp) => {
      console.log('✅ Google login successful')
      getUserProfile(codeResp)
    },
    onError: (error) => {
      console.error('❌ Google login error:', error)
      toast.error('Login failed. Please try again.')
    }
  })
  
  const getUserProfile = async (tokenInfo) => {
    setLoading(true)
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: 'application/json'
          }
        }
      )
      
      localStorage.setItem('user', JSON.stringify(response.data))
      toast.success(`Welcome, ${response.data.name}!`)
      navigate('/create-trip')
      
    } catch (error) {
      console.error('❌ Error getting user profile:', error)
      toast.error('Error during login')
      setLoading(false)
    }
  }
  
  const useTestUser = () => {
    const testUser = {
      email: 'test@example.com',
      name: 'Test User',
      picture: null
    }
    localStorage.setItem('user', JSON.stringify(testUser))
    toast.success('🎭 Test user logged in!')
    navigate('/create-trip')
  }
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">✈️</div>
          <h1 className="login-title">Welcome to AI Travel</h1>
          <p className="login-subtitle">Sign in to start planning your next adventure</p>
        </div>
        
        <div className="login-form">
          <Button
            onClick={login}
            disabled={loading}
            className="google-login-btn"
          >
            <FcGoogle className="google-icon" />
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          
          <div className="divider">
            <span className="divider-text">or</span>
          </div>
          
          <Button
            onClick={useTestUser}
            variant="outline"
            className="test-login-btn"
          >
            <span className="test-icon">🎭</span>
            Use Test Account
          </Button>
        </div>
        
        <div className="login-footer">
          <p className="footer-text">Secure authentication powered by Google</p>
        </div>
      </div>
    </div>
  )
}

export default Login