import React, { useState } from 'react'
import {connect} from 'react-redux'
import { authenticate } from '../store'
import pokemonLogo from '../images/pokemon_logo.png'
import pokemonBall from '../images/pokemon_ball.png'
import { useHistory } from 'react-router-dom'

const Navbar = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSignIn, setShowSignIn] = useState(false);
  const {handleSubmit, error} = props

  const history = useHistory();

  return (
    <div className="navbar">
      <img src={pokemonLogo} alt="pokemon-logo" className="pokemon-logo" />
      {
        !showSignIn ? (
          <div>
            <div className="action-wrapper">
              <img src={pokemonBall} alt="pokemon-ball" className="pokemon-ball" />
              <button onClick={() => setShowSignIn(true)}>Sign To Play</button>
            </div>
            <div className="action-wrapper">
              <img src={pokemonBall} alt="pokemon-ball" className="pokemon-ball" />
              <button onClick={() => history.push('/home')}>Play as a guest</button>
            </div>
          </div>
        ) : (
          <div className="login-wrapper">
            <div className="title">Sign In</div>
            <div className="login-row">
              <div className="login-row-title">User Name</div>
              <div className="login-row-input">
                <input type="text" name="username" autoComplete="off" value={username} onChange={e => setUsername(e.target.value)} />
              </div>
            </div>
            <div className="login-row">
              <div className="login-row-title">Password</div>
              <div className="login-row-input">
                <input type="password" name="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
            {error && error.response && <div> {error.response.data} </div>}
            <div className="login-row">
              <button onClick={() => handleSubmit(username, password)}>PLAY</button>
            </div>
          </div>
        )
      }
      <div>
        <img src={pokemonBall} alt="pokemon-ball" className="pokemon-ball-big" />
      </div>
    </div>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.auth.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(username, password) {
      dispatch(authenticate(username, password, 'login'))
    }
  }
}

export default connect(mapLogin, mapDispatch)(Navbar)
