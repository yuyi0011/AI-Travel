import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'  // this import is for the Link component


function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-9'>
        <h1
        className='font-extrabold text -[60px] text-center mt-16'>
            <span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span> Personalized Itineraries!</h1>
            <p className='text-xl text-gray-500 text-center'>
                Your Personalized trip planner and travel creater, which is creating customized itineraires tailored to your interests and budget.
            </p>
            <Link to={'/create-trip'}></Link>
            <Button>Get started, it's free!</Button>
    </div>
  )
}

export default Hero