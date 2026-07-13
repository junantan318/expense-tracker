import { Link, Navigate } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const token = localStorage.getItem("access_token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing-page">
      <header className="landing-navbar">
        <Link to="/" className="landing-logo">
          ExpenseTracker
        </Link>

        <nav className="landing-nav-actions">
          <Link to="/login" className="login-link">
            Log in
          </Link>

          <Link to="/register" className="navbar-register-button">
            Get started
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-label">Simple expense management</span>

            <h1>Understand where your money goes.</h1>

            <p>
              Record expenses, organize spending into categories, and review
              clear summaries from one simple dashboard.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="hero-primary-button">
                Start tracking
              </Link>

              <Link to="/login" className="hero-secondary-button">
                Log in
              </Link>
            </div>
          </div>

          <div className="dashboard-preview">
            <div className="preview-header">
              <div>
                <span>Monthly spending</span>
                <strong>RM 1,284.50</strong>
              </div>

              <span className="preview-period">July</span>
            </div>

            <div className="preview-cards">
              <article>
                <span>This month</span>
                <strong>RM 1,284.50</strong>
              </article>

              <article>
                <span>Top category</span>
                <strong>Food</strong>
              </article>
            </div>

            <div className="preview-transactions">
              <div className="preview-transaction">
                <div>
                  <strong>Groceries</strong>
                  <span>Food</span>
                </div>

                <strong>RM 85.50</strong>
              </div>

              <div className="preview-transaction">
                <div>
                  <strong>Fuel</strong>
                  <span>Transport</span>
                </div>

                <strong>RM 60.00</strong>
              </div>

              <div className="preview-transaction">
                <div>
                  <strong>Internet bill</strong>
                  <span>Utilities</span>
                </div>

                <strong>RM 120.00</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <span>Core features</span>
            <h2>Everything needed to manage everyday spending.</h2>
          </div>

          <div className="features-grid">
            <article className="feature-card">
              <h3>Track expenses</h3>
              <p>
                Add, edit, and remove transactions while keeping your expense
                history organized.
              </p>
            </article>

            <article className="feature-card">
              <h3>Organize categories</h3>
              <p>
                Group purchases into categories such as food, transport, and
                utilities.
              </p>
            </article>

            <article className="feature-card">
              <h3>Review summaries</h3>
              <p>
                See monthly totals, category breakdowns, and recent spending
                from your dashboard.
              </p>
            </article>
          </div>
        </section>

        <section className="landing-cta">
          <h2>Take control of your spending.</h2>
          <p>Create an account and record your first expense.</p>

          <Link to="/register" className="hero-primary-button">
            Create free account
          </Link>
        </section>
      </main>

      <footer className="landing-footer">
        <span>ExpenseTracker</span>
        <span>Built with React and FastAPI</span>
      </footer>
    </div>
  );
}

export default Landing;