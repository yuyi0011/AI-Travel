import { useState } from 'react'
import { Button } from './components/ui/button'
import Hero from './components/custom/Hero'  
import './App.css'
import './index.css'

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