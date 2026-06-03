import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function StudentResults() {
  const [results, setResults] = useState([]);

 useEffect(() => {
  const fetchResults = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/results`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
        const sorted = res.data.sort(
  (a, b) =>
    new Date(b.createdAt) -
    new Date(a.createdAt)
);

setResults(sorted);
      } catch (error) {
        console.log(error.response?.data);
        setResults([]);
      }
    };

    fetchResults();
  }, []);

  const totalAttempts = results.length;

  const suspiciousCount = results.filter(
    (item) => item.status === "Suspicious"
  ).length;

  const avgPercent =
    results.length > 0
      ? Math.round(
          results.reduce((sum, item) => {
            const percent =
              item.totalMarks > 0
                ? (item.score / item.totalMarks) * 100
                : 0;

            return sum + percent;
          }, 0) / results.length
        )
      : 0;

  const formatTimeTaken = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}m ${secs}s`;
  };

  const formatViolations = (arr) => {
    if (!arr || arr.length === 0) return "None";

    return arr
      .map((v) =>
        v.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
      )
      .join(", ");
  };

  return (
    <div className="page-shell">
      <Navbar />

      <div style={{ padding: "30px 40px" }}>
        <h1 style={{ color: "var(--text)", marginBottom: "10px" }}>
          Teacher Monitoring Dashboard
        </h1>

        <p style={{ marginBottom: "24px", color: "var(--subtext)" }}>
          Review exam attempts and student performance.
        </p>

        {/* CARDS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "28px"
        }}>
          <div style={cardBlue}>
            <h3>Total Attempts</h3>
            <p style={bigText}>{totalAttempts}</p>
          </div>

          <div style={cardRed}>
            <h3>Suspicious Cases</h3>
            <p style={bigText}>{suspiciousCount}</p>
          </div>

          <div style={cardGreen}>
            <h3>Average %</h3>
            <p style={bigText}>{avgPercent}%</p>
          </div>
        </div>

        {/* TABLE */}
        <div style={{
          background: "var(--card)",
          borderRadius: "22px",
          padding: "20px",
          overflowX: "auto",
          boxShadow: "var(--shadow)",
          border: "1px solid var(--border)"
        }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse"
          }}>
            <thead>
              <tr>
                <th style={th}>Exam</th>
                <th style={th}>Student</th>
                <th style={th}>Score</th>
                <th style={th}>Violations</th>
                <th style={th}>Violation Types</th>
                <th style={th}>Time Taken</th>
<th style={th}>Submitted</th>
<th style={th}>Trust Score</th>
<th style={th}>Risk Level</th>
<th style={th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                    No results found
                  </td>
                </tr>
              ) : (
                results.map((item) => (
                  <tr
                    key={item._id}
                    style={{
                      background:
                        item.status === "Suspicious"
                          ? "rgba(239,68,68,0.1)"
                          : "transparent"
                    }}
                  >
                    <td style={td}>{item.examTitle || "Unknown Exam"}</td>
                    <td style={td}>{item.name}</td>

                    <td style={td}>
                      <strong>
                        {item.score} / {item.totalMarks || 1}
                      </strong>
                    </td>

                    <td style={td}>{item.violations}</td>

                    <td style={td}>
                      {formatViolations(item.violationTypes)}
                    </td>

                    <td style={td}>
                      {formatTimeTaken(item.timeTaken || 0)}
                    </td>

                    <td style={td}>
  {new Date(item.createdAt).toLocaleString()}
</td>

<td style={td}>
  {item.trustScore ?? 100}
</td>

<td style={td}>
  <span
    style={{
      padding: "6px 14px",
      borderRadius: "999px",
      color: "#fff",
      fontWeight: "700",
      background:
        item.riskLevel === "Low"
          ? "#22c55e"
          : item.riskLevel === "Medium"
          ? "#f59e0b"
          : "#ef4444"
    }}
  >
    {item.riskLevel || "Low"}
  </span>
</td>

<td style={td}>
  <span style={{
                        padding: "6px 14px",
                        borderRadius: "999px",
                        color: "#fff",
                        fontWeight: "700",
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        minWidth: "120px",
                        textAlign: "center",
                        background:
                          item.status === "Clean"
                            ? "#22c55e"
                            : item.status === "Warning"
                            ? "#f59e0b"
                            : "#ef4444"
                      }}>
                        {item.status === "Clean" && "SAFE"}
                        {item.status === "Warning" && "MEDIUM RISK"}
                        {item.status === "Suspicious" && "HIGH RISK"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* THEME STYLES */

const th = {
  textAlign: "left",
  padding: "14px",
  borderBottom: "1px solid var(--border)",
  color: "var(--text)"
};

const td = {
  padding: "14px",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "top",
  color: "var(--text)"
};

const bigText = {
  fontSize: "40px",
  fontWeight: "800",
  margin: 0
};

const cardBlue = {
  background: "var(--secondary)",
  padding: "24px",
  borderRadius: "20px"
};

const cardRed = {
  background: "rgba(239,68,68,0.1)",
  padding: "24px",
  borderRadius: "20px"
};

const cardGreen = {
  background: "rgba(34,197,94,0.1)",
  padding: "24px",
  borderRadius: "20px"
};

export default StudentResults;