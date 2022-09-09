import React, { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Routes from './Routes'
import bgAudio from './images/bg.mp3';

const App = () => {
  const audioRef = useRef();

  useEffect(() => {
    function audioPlay() {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }

    document.addEventListener('click', audioPlay);

    return () => {
      document.removeEventListener('click', audioPlay);
    }
  }, []);

  return (
    <>
      <Routes />
      <audio controls autoPlay loop style={{display: 'none'}} ref={audioRef}>
          <source src={bgAudio} type="audio/mpeg" />
      </audio>
    </>
  )
}

export default App
