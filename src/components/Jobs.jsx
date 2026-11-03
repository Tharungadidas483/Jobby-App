import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from './Header'
import JobCard from './JobCard'
import Loader from './Loader'
import Failure from './Failure'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const status = {loading: 'LOADING', success: 'SUCCESS', failure: 'FAILURE'}

class Jobs extends Component {
  state = {
    profile: null,
    profileStatus: status.loading,
    jobs: [],
    jobsStatus: status.loading,
    employmentTypes: [],
    minimumPackage: '',
    searchInput: '',
    search: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  headers = () => ({Authorization: `Bearer ${Cookies.get('jwt_token')}`})

  getProfile = async () => {
    this.setState({profileStatus: status.loading})
    try {
      const response = await fetch('https://apis.ccbp.in/profile', {headers: this.headers()})
      if (!response.ok) throw new Error('profile')
      const data = await response.json()
      const p = data.profile_details
      this.setState({
        profile: {name: p.name, image: p.profile_image_url, bio: p.short_bio},
        profileStatus: status.success,
      })
    } catch (error) {
      this.setState({profileStatus: status.failure})
    }
  }

  getJobs = async () => {
    const {employmentTypes, minimumPackage, search} = this.state
    this.setState({jobsStatus: status.loading})
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes.join(
      ',',
    )}&minimum_package=${minimumPackage}&search=${search}`
    try {
      const response = await fetch(url, {headers: this.headers()})
      if (!response.ok) throw new Error('jobs')
      const data = await response.json()
      const jobs = data.jobs.map(j => ({
        id: j.id,
        title: j.title,
        rating: j.rating,
        location: j.location,
        employmentType: j.employment_type,
        packagePerAnnum: j.package_per_annum,
        jobDescription: j.job_description,
        companyLogoUrl: j.company_logo_url,
      }))
      this.setState({jobs, jobsStatus: status.success})
    } catch (error) {
      this.setState({jobsStatus: status.failure})
    }
  }

  onToggleType = event => {
    const {value, checked} = event.target
    this.setState(
      prev => ({
        employmentTypes: checked
          ? [...prev.employmentTypes, value]
          : prev.employmentTypes.filter(t => t !== value),
      }),
      this.getJobs,
    )
  }

  onSelectSalary = event => {
    this.setState({minimumPackage: event.target.value}, this.getJobs)
  }

  onSearch = event => {
    event.preventDefault()
    const {searchInput} = this.state
    this.setState({search: searchInput}, this.getJobs)
  }

  renderProfile = () => {
    const {profile, profileStatus} = this.state
    if (profileStatus === status.loading) return <Loader />
    if (profileStatus === status.failure) {
      return (
        <button type="button" className="btn btn-primary btn-sm" onClick={this.getProfile}>
          Retry
        </button>
      )
    }
    return (
      <div className="profile-card">
        <img src={profile.image} alt="profile" />
        <h2 className="h6 mt-2">{profile.name}</h2>
        <p className="small mb-0">{profile.bio}</p>
      </div>
    )
  }

  renderJobs = () => {
    const {jobs, jobsStatus} = this.state
    if (jobsStatus === status.loading) return <Loader />
    if (jobsStatus === status.failure) return <Failure onRetry={this.getJobs} />
    if (jobs.length === 0) {
      return (
        <div className="state-box">
          <h2 className="h4">No jobs found</h2>
          <p>Try a different keyword or clear some filters.</p>
        </div>
      )
    }
    return (
      <ul className="job-list">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </ul>
    )
  }

  render() {
    const {searchInput, minimumPackage} = this.state
    return (
      <>
        <Header />
        <div className="container-fluid jobs-layout">
          <aside className="filters">
            {this.renderProfile()}
            <hr />
            <h3 className="h6">Type of employment</h3>
            {employmentTypesList.map(t => (
              <div className="form-check" key={t.employmentTypeId}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={t.employmentTypeId}
                  value={t.employmentTypeId}
                  onChange={this.onToggleType}
                />
                <label className="form-check-label" htmlFor={t.employmentTypeId}>
                  {t.label}
                </label>
              </div>
            ))}
            <hr />
            <h3 className="h6">Salary range</h3>
            {salaryRangesList.map(s => (
              <div className="form-check" key={s.salaryRangeId}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="salary"
                  id={s.salaryRangeId}
                  value={s.salaryRangeId}
                  checked={minimumPackage === s.salaryRangeId}
                  onChange={this.onSelectSalary}
                />
                <label className="form-check-label" htmlFor={s.salaryRangeId}>
                  {s.label}
                </label>
              </div>
            ))}
          </aside>
          <section className="results">
            <form className="input-group mb-3" onSubmit={this.onSearch}>
              <input
                type="search"
                className="form-control"
                placeholder="Search jobs"
                value={searchInput}
                onChange={e => this.setState({searchInput: e.target.value})}
              />
              <button type="submit" className="btn btn-primary" aria-label="Search">
                Search
              </button>
            </form>
            {this.renderJobs()}
          </section>
        </div>
      </>
    )
  }
}

export default Jobs
