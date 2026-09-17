import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Nav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="nav">
      <div className="nav-links">
        <Link to="/">Browse</Link>
        <Link to="/news">News</Link>
        {user && <Link to="/watchlist">My Watchlist</Link>}
      </div>
      <div className="nav-user">
        {user ? (
          <>
            <span>{user.username}</span>
            <button className="secondary" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}