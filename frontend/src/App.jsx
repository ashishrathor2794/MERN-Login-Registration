import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  Link,
  useNavigate,
  useSearchParams
} from "react-router-dom";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  forgotPassword,
  resetPassword
} from "./api.js";

function AuthCard({ mode }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();

  const [form, setForm] = useState(
    isRegister
      ? { name: "", email: "", password: "" }
      : { email: "", password: "" }
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await registerUser(form);
      } else {
        await loginUser(form);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="auth-card">
        <div className="brand">Skillfied Auth</div>

        <h1>{isRegister ? "Create Account" : "Welcome Back"}</h1>

        <p className="subtitle">
          {isRegister
            ? "Register to access your dashboard."
            : "Login to continue to your dashboard."}
        </p>

        {error && <div className="alert">{error}</div>}

        <form onSubmit={submit}>
          {isRegister && (
            <label>
              Full name
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter your name"
                required
                minLength="2"
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder="Minimum 6 characters"
              required
              minLength="6"
            />
          </label>

          {!isRegister && (
            <p className="switch">
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>
          )}

          <button className="primary-btn" disabled={loading}>
            {loading
              ? "Please wait..."
              : isRegister
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        <p className="switch">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}

          <Link to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </div>
    </div>
  );
}


// Forgot Password
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setToken("");
    setLoading(true);

    try {
      const data = await forgotPassword(email);

      setMessage(data.message);
      setToken(data.resetToken);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="auth-card">
        <div className="brand">Skillfied Auth</div>

        <h1>Forgot Password?</h1>

        <p className="subtitle">
          Enter your registered email to reset your password.
        </p>

        {message && <div className="alert">{message}</div>}

        {error && <div className="alert">{error}</div>}

        <form onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <button className="primary-btn" disabled={loading}>
            {loading ? "Please wait..." : "Generate Reset Token"}
          </button>
        </form>

        {token && (
          <div className="alert">
            <strong>Reset Token:</strong>
            <br />
            {token}
            <br />
            <br />
            <Link to={`/reset-password?token=${token}`}>
              Reset Password
            </Link>
          </div>
        )}

        <p className="switch">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}


// Reset Password
function ResetPassword() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword({
        token,
        password
      });

      setMessage(data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="auth-card">
        <div className="brand">Skillfied Auth</div>

        <h1>Reset Password</h1>

        <p className="subtitle">
          Enter your new password below.
        </p>

        {message && <div className="alert">{message}</div>}

        {error && <div className="alert">{error}</div>}

        <form onSubmit={submit}>
          <label>
            New Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              minLength="6"
            />
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Enter password again"
              required
              minLength="6"
            />
          </label>

          <button className="primary-btn" disabled={loading}>
            {loading ? "Please wait..." : "Reset Password"}
          </button>
        </form>

        <p className="switch">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}


function Dashboard({ user, setUser }) {
  const navigate = useNavigate();

  const logout = async () => {
    await logoutUser();
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <strong>Auth Dashboard</strong>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </nav>

      <main className="dashboard-content">
        <div className="welcome-card">
          <span className="badge">Authenticated</span>

          <h1>Hello, {user.name} 👋</h1>

          <p>
            You have successfully logged in to the MERN Authentication
            System.
          </p>

          <div className="profile-grid">
            <div>
              <small>Name</small>
              <strong>{user.name}</strong>
            </div>

            <div>
              <small>Email</small>
              <strong>{user.email}</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="page-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={<AuthCard mode="login" />}
      />

      <Route
        path="/register"
        element={<AuthCard mode="register" />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user}>
            <Dashboard
              user={user}
              setUser={setUser}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}