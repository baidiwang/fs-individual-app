import React, {useEffect, useState} from 'react'
import { connect } from 'react-redux'
import blank from '../images/blank.png'
import pokemonDefault from '../images/pokemon-default.png'
import axios from 'axios'
import pokemonBall from '../images/pokemon_ball.png'
import stopIcon from '../images/stop.png'
import gameOver from '../images/game_over.png'
import star from '../images/stars.png'

const width = 8

let timingInterval

/**
 * COMPONENT
 */
export const Home = props => {
  const {username} = props

  const [currentColorArrangement, setCurrentColorArrangement] = useState([])
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
  const [scoreDisplay, setScoreDisplay] = useState(0)
  const [pokemons, setPokemons] = useState([])
  const [seconds, setSeconds] = useState(30)

  useEffect(() => {
    axios.get('/api/pokedex').then(res => {
      setPokemons(res.data)
    })
    startTiming()

    return () => {
      clearInterval(timingInterval)
    }
  }, [])

  const stopGame = () => {
    if (timingInterval) {
      clearInterval(timingInterval)
      timingInterval = undefined;
    } else {
      startTiming()
    }
  }

  const startOver = () => {
    setSeconds(30)
    setScoreDisplay(0)
    createBoard()
    startTiming()
  }

  const startTiming = () => {
    timingInterval = setInterval(() => {
      setSeconds(prevState => {
        if (prevState > 0) {
          return prevState - 1
        } else {
          clearInterval(timingInterval)
          return 0
        }
      })
    }, 1000)
  }

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      const decidedColor = currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === blank

      if (columnOfFour.every(square => currentColorArrangement[square].id === decidedColor.id && !isBlank)) {
        setScoreDisplay((score) => score + 4)
        columnOfFour.forEach(square => currentColorArrangement[square] = blank)
        return true
      }
    }
  }

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3]
      const decidedColor = currentColorArrangement[i]
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
      const isBlank = currentColorArrangement[i] === blank

      if (notValid.includes(i)) continue

      if (rowOfFour.every(square => currentColorArrangement[square].id === decidedColor.id && !isBlank)) {
        setScoreDisplay((score) => score + 4)
        rowOfFour.forEach(square => currentColorArrangement[square] = blank)
        return true
      }
    }
  }

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2]
      const decidedColor = currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === blank

      if (columnOfThree.every(square => currentColorArrangement[square].id === decidedColor.id && !isBlank)) {
        setScoreDisplay((score) => score + 3)
        columnOfThree.forEach(square => currentColorArrangement[square] = blank)
        return true
      }
    }
  }

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2]
      const decidedColor = currentColorArrangement[i]
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
      const isBlank = currentColorArrangement[i] === blank

      if (notValid.includes(i)) continue

      if (rowOfThree.every(square => currentColorArrangement[square].id === decidedColor.id && !isBlank)) {
        setScoreDisplay((score) => score + 3)
        rowOfThree.forEach(square => currentColorArrangement[square] = blank)
        return true
      }
    }
  }

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if (isFirstRow && currentColorArrangement[i] === blank) {
        let randomNumber = Math.floor(Math.random() * pokemons.length)
        currentColorArrangement[i] = pokemons[randomNumber]
      }

      if ((currentColorArrangement[i + width]) === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i]
        currentColorArrangement[i] = blank
      }
    }
  }

  const dragStart = (e) => {
    setSquareBeingDragged(e.target)
  }
  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target)
  }
  const dragEnd = () => {
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

    currentColorArrangement[squareBeingReplacedId] = JSON.parse(squareBeingDragged.getAttribute('data-pokemon'))
    currentColorArrangement[squareBeingDraggedId] = JSON.parse(squareBeingReplaced.getAttribute('data-pokemon'))

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width
    ]

    const validMove = validMoves.includes(squareBeingReplacedId)

    const isAColumnOfFour = checkForColumnOfFour()
    const isARowOfFour = checkForRowOfFour()
    const isAColumnOfThree = checkForColumnOfThree()
    const isARowOfThree = checkForRowOfThree()

    if (squareBeingReplacedId &&
      validMove &&
      (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)) {
      setSquareBeingDragged(null)
      setSquareBeingReplaced(null)
    } else {
      currentColorArrangement[squareBeingReplacedId] = JSON.parse(squareBeingDragged.getAttribute('data-pokemon'))
      currentColorArrangement[squareBeingDraggedId] = JSON.parse(squareBeingReplaced.getAttribute('data-pokemon'))
      setCurrentColorArrangement([...currentColorArrangement])
    }
  }


  const createBoard = () => {
    const randomColorArrangement = []
    for (let i = 0; i < width * width; i++) {
      const randomColor = pokemons[Math.floor(Math.random() * pokemons.length)]
      randomColorArrangement.push(randomColor)
    }
    setCurrentColorArrangement(randomColorArrangement)
  }

  useEffect(() => {
    if (pokemons.length > 0) {
      createBoard()
    }
  }, [pokemons])

  useEffect(() => {
    const timer = setInterval(() => {
      if (pokemons.length > 0) {
        checkForColumnOfFour()
        checkForRowOfFour()
        checkForColumnOfThree()
        checkForRowOfThree()
        moveIntoSquareBelow()
        setCurrentColorArrangement([...currentColorArrangement])
      }
    }, 100)
    return () => clearInterval(timer)
  }, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, currentColorArrangement])

  const imageLoad = (pokemon) => {
    pokemon.load = true;
    setCurrentColorArrangement([...currentColorArrangement]);
  }

  return (
    <div className="app">
      <div className="game-header">
        <div className="action-wrapper">
          <img src={pokemonBall} alt="pokemon-ball" className="pokemon-ball" />
          <button style={{width: 150, cursor: 'default'}}>Score: {scoreDisplay}</button>
        </div>
        <div>
          <img src={stopIcon} alt="stop-icon" className="stop-icon" onClick={stopGame} />
        </div>
        <div className="action-wrapper">
          <img src={pokemonBall} alt="pokemon-ball" className="pokemon-ball" />
          <button style={{width: 150, cursor: 'default'}}>History Score: {scoreDisplay}</button>
        </div>
      </div>
      <div className="timing">
        <div className="timing-progress" style={{width: (seconds / 30 * 100) + '%'}}></div>
      </div>
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <div className="item">
            <img
              key={index}
              src={candyColor ? candyColor.imageUrl: pokemonDefault}
              alt={candyColor ? candyColor.imageUrl: ''}
              className={candyColor ? candyColor.type: ''}
              data-id={index}
              data-pokemon={JSON.stringify(candyColor)}
              draggable={true}
              onDragStart={dragStart}
              onLoad={() => imageLoad(candyColor)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onDrop={dragDrop}
              onDragEnd={dragEnd}
            />
            {
              !candyColor.load && <img src={pokemonDefault} key={1000 + index} alt="pokemon-default" className="item-default-img" />
            }
          </div>
        ))}
      </div>
      {
        seconds === 0 && (
          <div className="modal-wrapper">
            <div className="modal-content">
              {
                scoreDisplay > 50 ? <img className="star" src={star} /> :
                  <img className="over" src={gameOver} />
              }
              <div>
                {scoreDisplay > 50 ? 'YOU WIN!' : 'YOU LOSE!'}
              </div>
              <div>
                <div>Your score: {scoreDisplay}</div>
                <div>History score: {scoreDisplay}</div>
              </div>
              <div className="action-wrapper">
                <img src={pokemonBall} alt="pokemon-ball" className="pokemon-ball" />
                <button onClick={() => startOver()}>Star Over</button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    username: state.auth.username
  }
}

export default connect(mapState)(Home)
