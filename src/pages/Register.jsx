import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    teacherCode: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/register`,
    form
  );

  alert("Registration successful");
  navigate("/login");
} catch (error) {
  alert(
    error.response?.data?.message ||
      "Registration failed"
  );
}
};

  return (
    <div className="page-shell">
      <Navbar />

      <div
        style={{
          maxWidth: "520px",
          margin: "50px auto",
          background: "var(--card)",
          padding: "36px",
          borderRadius: "24px",
          boxShadow: "var(--shadow)",
          border: "1px solid var(--border)"
        }}
      >
        <p
          style={{
            color: "var(--primary)",
            fontWeight: "700",
            marginBottom: "8px"
          }}
        >
          Create Account
        </p>

        <h1
          style={{
            color: "var(--text)",
            marginBottom: "24px"
          }}
        >
          Register
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={input}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={input}
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={input}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          {form.role === "teacher" && (
            <input
              type="text"
              name="teacherCode"
              placeholder="Teacher Access Code"
              value={form.teacherCode}
              onChange={handleChange}
              required
              style={input}
            />
          )}

          <button type="submit" style={btn}>
            Register
          </button>
        </form>

        <p
          style={{
            marginTop: "18px",
            textAlign: "center",
            color: "var(--subtext)"
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: "600" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

/* 🔥 THEME INPUT */
const input = {
  width: "100%",
  padding: "14px",
  marginBottom: "14px",
  borderRadius: "12px",
  border: "1px solid var(--border)",
  background: "transparent",
  color: "var(--text)",
  fontSize: "15px"
};

/* 🔥 BUTTON */
const btn = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "12px",
  background: "var(--primary)",
  color: "#fff",
  fontWeight: "700",
  fontSize: "16px",
  cursor: "pointer"
};

export default Register;