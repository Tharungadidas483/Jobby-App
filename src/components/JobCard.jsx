import {Link} from 'react-router-dom'

const JobCard = ({job}) => (
  <li className="job-card">
    <Link to={`/jobs/${job.id}`} className="text-decoration-none text-reset">
      <div className="d-flex align-items-center gap-3 mb-2">
        <img src={job.companyLogoUrl} alt="company logo" className="logo" />
        <div>
          <h2 className="h5 mb-0">{job.title}</h2>
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
      <h3 className="h6">Description</h3>
      <p className="mb-0">{job.jobDescription}</p>
    </Link>
  </li>
)

export default JobCard
