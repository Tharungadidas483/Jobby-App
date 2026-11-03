import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from './Header'
import JobCard from './JobCard'
import Loader from './Loader'
import Failure from './Failure'

const status = {loading: 'LOADING', success: 'SUCCESS', failure: 'FAILURE'}

class JobItemDetails extends Component {
  state = {job: null, similar: [], skills: [], life: null, apiStatus: status.loading}

  componentDidMount() {
    this.getDetails()
  }

  componentDidUpdate(prevProps) {
    const {match} = this.props
    if (prevProps.match.params.id !== match.params.id) this.getDetails()
  }

  getDetails = async () => {
    const {match} = this.props
    this.setState({apiStatus: status.loading})
    try {
      const response = await fetch(`https://apis.ccbp.in/jobs/${match.params.id}`, {
        headers: {Authorization: `Bearer ${Cookies.get('jwt_token')}`},
      })
      if (!response.ok) throw new Error('details')
      const data = await response.json()
      const d = data.job_details
      this.setState({
        job: {
          id: d.id,
          title: d.title,
          rating: d.rating,
          location: d.location,
          employmentType: d.employment_type,
          packagePerAnnum: d.package_per_annum,
          jobDescription: d.job_description,
          companyLogoUrl: d.company_logo_url,
          companyWebsiteUrl: d.company_website_url,
        },
        skills: d.skills.map(s => ({name: s.name, imageUrl: s.image_url})),
        life: {description: d.life_at_company.description, imageUrl: d.life_at_company.image_url},
        similar: data.similar_jobs.map(j => ({
          id: j.id,
          title: j.title,
          rating: j.rating,
          location: j.location,
          employmentType: j.employment_type,
          jobDescription: j.job_description,
          packagePerAnnum: '',
          companyLogoUrl: j.company_logo_url,
        })),
        apiStatus: status.success,
      })
    } catch (error) {
      this.setState({apiStatus: status.failure})
    }
  }

  renderBody = () => {
    const {job, similar, skills, life, apiStatus} = this.state
    if (apiStatus === status.loading) return <Loader />
    if (apiStatus === status.failure) return <Failure onRetry={this.getDetails} />
    return (
      <>
        <div className="job-card">
          <div className="d-flex align-items-center gap-3 mb-2">
            <img src={job.companyLogoUrl} alt="job details company logo" className="logo" />
            <div>
              <h1 className="h4 mb-0">{job.title}</h1>
              <small className="text-warning-emphasis">Rating: {job.rating}</small>
            </div>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>
              {job.location} | {job.employmentType}
            </span>
            <strong>{job.packagePerAnnum}</strong>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h2 className="h6">Description</h2>
            <a href={job.companyWebsiteUrl} target="_blank" rel="noreferrer">
              Visit
            </a>
          </div>
          <p>{job.jobDescription}</p>
          <h2 className="h6">Skills</h2>
          <ul className="skills">
            {skills.map(s => (
              <li key={s.name}>
                <img src={s.imageUrl} alt={s.name} />
                <span>{s.name}</span>
              </li>
            ))}
          </ul>
          <h2 className="h6">Life at company</h2>
          <div className="d-flex flex-wrap gap-3">
            <p className="flex-grow-1 mb-0">{life.description}</p>
            <img src={life.imageUrl} alt="life at company" className="life-img" />
          </div>
        </div>
        <h2 className="h5 mt-4">Similar jobs</h2>
        <ul className="job-list">
          {similar.map(j => (
            <JobCard key={j.id} job={j} />
          ))}
        </ul>
      </>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="container py-4">{this.renderBody()}</div>
      </>
    )
  }
}

export default JobItemDetails
