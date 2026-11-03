import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="navbar navbar-expand bg-dark navbar-dark px-3">
      <Link to="/" className="navbar-brand fw-bold">
        Jobby
      </Link>
      <ul className="navbar-nav me-auto">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/jobs" className="nav-link">
            Jobs
          </Link>
        </li>
      </ul>
      <button type="button" className="btn btn-outline-light btn-sm" onClick={onLogout}>
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
