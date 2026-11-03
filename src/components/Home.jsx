import {Link} from 'react-router-dom'
import Header from './Header'

const Home = () => (
  <>
    <Header />
    <main className="hero">
      <h1>Find the job that fits your life</h1>
      <p>Search thousands of roles by type, salary and keyword.</p>
      <Link to="/jobs" className="btn btn-primary btn-lg">
        Find jobs
      </Link>
    </main>
  </>
)

export default Home
