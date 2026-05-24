import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const name =
    localStorage.getItem("name") || "User";

  const role =
    localStorage.getItem("role") || "student";

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

  // ✅ IMPORTANT: apply theme once on first load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      setDark(true);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      className="navbar"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--card)"
      }}
    >
      {/* LEFT */}
      <div className="nav-links">
        <Link to="/dashboard">
          <h2 style={{ color: "var(--primary)", margin: 0 }}>
            Easy Exams
          </h2>
        </Link>

        <Link to="/dashboard">Dashboard</Link>

        {role === "teacher" && (
          <Link to="/results">Results</Link>
        )}
      </div>

      {/* RIGHT */}
      <div
        style={{
          display: "flex",
          gap: "14px",
          alignItems: "center"
        }}
      >
        {/* 🔥 IMPROVED TOGGLE BUTTON */}
        <button
          onClick={() => setDark(!dark)}
          style={{
            background: dark
              ? "#334155"
              : "#ff5a2c",
            color: "#fff",
            border: "none",
            borderRadius: "999px",
            padding: "10px 18px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.2s"
          }}
        >
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>

        <span style={{ color: "var(--text)" }}>
          {name} ({role})
        </span>

        <button
          onClick={logout}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "10px 16px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;