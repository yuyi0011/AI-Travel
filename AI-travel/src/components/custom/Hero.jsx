import React from 'react'
import { Button } from '../ui/button'
<<<<<<< HEAD
import { Link } from 'react-router-dom'
=======
import { Link } from 'react-router-dom'  // this import is for the Link component

>>>>>>> f50de0aa62746a1f5e723ec9f5b3e4e0a1f6f2fc

function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-9'>
<<<<<<< HEAD
      
      <h1
      className='font-extrabold text-[50px] text-center mt-16'
      >
        <span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span> Personalized Itineraries at Your Fingertips</h1>
      <p className='text-xl text-gray-500 text-center'>Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.</p>
   
      <Link to={'/create-trip'}>
        <Button> Get Started, It's Free </Button>
      </Link>

      <img src='/landing.png' className='' />
=======
        <h1
        className='font-extrabold text -[60px] text-center mt-16'>
            <span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span> Personalized Itineraries!</h1>
            <p className='text-xl text-gray-500 text-center'>
                Your Personalized trip planner and travel creater, which is creating customized itineraires tailored to your interests and budget.
            </p>
            <Link to={'/create-trip'}></Link>
            <Button>Get started, it's free!</Button>
>>>>>>> f50de0aa62746a1f5e723ec9f5b3e4e0a1f6f2fc
    </div>
  )
}

export default Hero