import { useState } from 'react'
import { Button } from './components/ui/button'
<<<<<<< HEAD
import Hero from './components/custom/Hero'  
import './App.css'
import './index.css'
=======
import Hero from './components/custom/Hero'  // Add this import
import './App.css'
>>>>>>> f50de0aa62746a1f5e723ec9f5b3e4e0a1f6f2fc

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <>
      {/* Hero section */}
      <Hero />
    </>
  )
}

export default App