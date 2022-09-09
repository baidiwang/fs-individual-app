import React from 'react'

import Navbar from './components/Navbar'
import Routes from './Routes'
import bgAudio from './images/bg.mp3';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
      <audio controls autoPlay loop>
          <source src={bgAudio} type="audio/mpeg" />
      </audio>
    </div>
  )
}

export default App
