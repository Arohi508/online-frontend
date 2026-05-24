import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // ✅ Apply theme on load + toggle
  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/login`,
    form
  );
};

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);

      navigate("/dashboard");
    } else {
      alert(res.data.message);
    }
  };

  return (
    <div className="page-shell">
      {/* NAVBAR */}
      <div className="navbar">
        <div className="brand">Easy Exams</div>

        <div className="nav-links">
          <a href="#">Features</a>
          <a href="#">Schools</a>
          <a href="#">Security</a>

          {/* 🔥 DARK MODE BUTTON */}
          <button
            onClick={() => setDark(!dark)}
            style={{
              background: dark ? "#334155" : "#ff5a2c",
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              padding: "10px 16px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            {dark ? "☀ Light" : "🌙 Dark"}
          </button>

          <Link to="/login">Log in</Link>

          <Link to="/" className="btn-primary">
            Get Started
          </Link>
        </div>
      </div>

      {/* HERO */}
      <div className="hero">
        <div className="badge">Secure Student Access</div>

        <h1>Welcome Back to Easy Exams</h1>

        <p>
          Continue your exams, dashboard access and secure online
          assessments.
        </p>
      </div>

      {/* LOGIN FORM */}
      <div className="auth-section">
        <div className="auth-card">
          <h2>Login</h2>
          <p>Enter your credentials</p>

          <input
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button onClick={handleSubmit}>Login</button>

          <div className="auth-link">
            Don’t have an account?{" "}
            <Link to="/">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );


export default Login;