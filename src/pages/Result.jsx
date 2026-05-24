import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Result() {
  const navigate = useNavigate();

  const examTitle =
    localStorage.getItem("latestExamTitle") ||
    "Exam";

  const score = Number(
    localStorage.getItem("latestScore") || 0
  );

  const totalMarks = Number(
    localStorage.getItem("latestTotalMarks") || 100
  );

  const percent =
    totalMarks > 0
      ? Math.round((score / totalMarks) * 100)
      : 0;

  let message = "Good Attempt";

  if (percent >= 85) {
    message = "Excellent Performance";
  } else if (percent >= 60) {
    message = "Well Done";
  } else {
    message = "Needs Improvement";
  }

  return (
    <div className="page-shell">
      <Navbar />

      <div
        style={{
          maxWidth: "700px",
          margin: "40px auto",
          background: "var(--card)",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "var(--shadow)",
          border: "1px solid var(--border)",
          textAlign: "center"
        }}
      >
        <p
          style={{
            color: "var(--primary)",
            fontWeight: "700",
            marginBottom: "10px"
          }}
        >
          Submission Successful
        </p>

        <h1
          style={{
            color: "var(--text)",
            marginBottom: "12px"
          }}
        >
          {examTitle}
        </h1>

        <p
          style={{
            color: "var(--subtext)",
            marginBottom: "30px"
          }}
        >
          Your exam has been submitted.
        </p>

        {/* SCORE BOX */}
        <div
          style={{
            background: "var(--secondary)",
            padding: "28px",
            borderRadius: "20px",
            marginBottom: "22px"
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "52px",
              color: "var(--text)"
            }}
          >
            {score} / {totalMarks}
          </h2>

          <p
            style={{
              marginTop: "10px",
              color: "var(--subtext)"
            }}
          >
            Final Score
          </p>
        </div>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "26px"
          }}
        >
          <div
            style={{
              background: "rgba(34,197,94,0.1)",
              padding: "20px",
              borderRadius: "18px"
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "#22c55e"
              }}
            >
              {percent}%
            </h3>

            <p
              style={{
                marginTop: "8px",
                color: "var(--subtext)"
              }}
            >
              Percentage
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,90,44,0.1)",
              padding: "20px",
              borderRadius: "18px"
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "var(--primary)"
              }}
            >
              {message}
            </h3>

            <p
              style={{
                marginTop: "8px",
                color: "var(--subtext)"
              }}
            >
              Performance
            </p>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: "12px",
            background: "var(--primary)",
            color: "#fff",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Result;