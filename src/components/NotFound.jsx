import {Link} from 'react-router-dom'

const NotFound = () => (
  <div className="state-box vh-100 d-flex flex-column justify-content-center">
    <h1 className="h3">Page not found</h1>
    <p>The page you are looking for does not exist.</p>
    <Link to="/" className="btn btn-primary align-self-center">
      Go to home
    </Link>
  </div>
)

export default NotFound
