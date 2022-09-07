import React, {useEffect, useState} from 'react'
import { connect } from 'react-redux'
import blank from '../images/blank.png'
import axios from 'axios'

const width = 8

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

  useEffect(() => {
    axios.get('/api/pokedex').then(res => {
      setPokemons(res.data)
    })
  }, [])

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      const decidedColor = currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === blank

      if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
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

      if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
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

      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
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

      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
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
      currentColorArrangement[squareBeingReplacedId] = JSON.parse(squareBeingReplaced.getAttribute('data-pokemon'))
      currentColorArrangement[squareBeingDraggedId] = JSON.parse(squareBeingDragged.getAttribute('data-pokemon'))
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
  }, [])

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

  return (
    <div className="app">
      <h3>Welcome, {username}</h3>
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor ? candyColor.imageUrl: ''}
            alt={candyColor ? candyColor.imageUrl: ''}
            className={candyColor ? candyColor.type: ''}
            data-id={index}
            data-pokeman={JSON.stringify(candyColor)}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <div className="score-board">
        <h2>{scoreDisplay}</h2>
      </div>
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
