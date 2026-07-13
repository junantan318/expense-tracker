import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";
import { isAuthenticated, setToken } from "../services/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message;
  const redirectPath = location.state?.from || "/dashboard";

  if (isAuthenticated()) {
  return <Navigate to={redirectPath} replace />;
}


  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();

      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      setToken(response.data.access_token);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
          "Login failed. Check your email and password."
      );
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-logo">
          ExpenseTracker
        </Link>

        <h1>Welcome back</h1>

        <p className="auth-subtitle">
          Log in to manage your expenses and review your spending.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {successMessage && (
            <p className="auth-success">{successMessage}</p>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button
            className="auth-submit"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="auth-footer">
          Do not have an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;

