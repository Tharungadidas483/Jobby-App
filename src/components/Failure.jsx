const Failure = ({onRetry}) => (
  <div className="state-box">
    <h2 className="h4">Oops! Something went wrong</h2>
    <p>We could not load this page. Check your connection and try again.</p>
    <button type="button" className="btn btn-primary" onClick={onRetry}>
      Retry
    </button>
  </div>
)

export default Failure
