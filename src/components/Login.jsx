import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

class Login extends Component {
  state = {username: '', password: '', showError: false, errorMsg: '', loading: false}

  onChange = event => {
    this.setState({[event.target.name]: event.target.value})
  }

  onSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    this.setState({loading: true, showError: false})
    try {
      const response = await fetch('https://apis.ccbp.in/login', {
        method: 'POST',
        body: JSON.stringify({username, password}),
      })
      const data = await response.json()
      if (response.ok) {
        Cookies.set('jwt_token', data.jwt_token, {expires: 30})
        const {history} = this.props
        history.replace('/')
      } else {
        this.setState({showError: true, errorMsg: data.error_msg, loading: false})
      }
    } catch (error) {
      this.setState({
        showError: true,
        errorMsg: 'Network error. Please try again.',
        loading: false,
      })
    }
  }

  render() {
    if (Cookies.get('jwt_token') !== undefined) {
      return <Redirect to="/" />
    }
    const {username, password, showError, errorMsg, loading} = this.state
    return (
      <div className="login-page">
        <form className="login-card" onSubmit={this.onSubmit}>
          <h1 className="h3 text-center mb-4">Jobby</h1>
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            id="username"
            name="username"
            className="form-control mb-3"
            value={username}
            onChange={this.onChange}
            placeholder="Username"
            required
          />
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-control mb-3"
            value={password}
            onChange={this.onChange}
            placeholder="Password"
            required
          />
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {showError && <p className="text-danger mt-3 mb-0">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
