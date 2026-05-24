import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  useEffect(() => {
    axios
      .get("http://localhost:5000/exams")
      .then((res) => setExams(res.data))
      .catch(() => alert("Failed to load exams"));
  }, []);

  const startExam = (exam) => {
    localStorage.setItem("examId", exam._id);
    localStorage.setItem("examTitle", exam.title);
    localStorage.setItem("examDuration", exam.duration);

    navigate("/instructions");
  };

  const deleteExam = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this exam?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/delete-exam/${id}`);

      // remove from UI instantly
      setExams((prev) => prev.filter((exam) => exam._id !== id));
    } catch (error) {
      alert("Failed to delete exam");
    }
  };

  return (
    <div className="page-shell">
      <Navbar />

      <div className="container">
        {/* Hero Section */}
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg,#6c5ce7,#8b7cff)",
            color: "white",
            marginBottom: "24px",
          }}
        >
          <p>Welcome back</p>

          <h1 style={{ fontSize: "42px", margin: "8px 0" }}>
            {name}
          </h1>

          <p>Ready to continue your journey?</p>
        </div>

        {/* Teacher Create Exam Button */}
        {role === "teacher" && (
          <div style={{ marginBottom: "20px" }}>
            <button
              className="btn-primary"
              onClick={() => navigate("/create-exam")}
            >
              + Create New Exam
            </button>
          </div>
        )}

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "18px",
            marginBottom: "24px",
          }}
        >
          <div className="card">
            <p className="small-muted">Total Exams</p>
            <h2>{exams.length}</h2>
          </div>

          <div className="card">
            <p className="small-muted">Security</p>
            <h2>Active</h2>
          </div>

          <div className="card">
            <p className="small-muted">Role</p>
            <h2>{role}</h2>
          </div>
        </div>

        {/* Exams */}
        <h2 style={{ marginBottom: "16px" }}>
          Available Exams
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: "18px",
          }}
        >
          {exams.map((exam) => (
            <div key={exam._id} className="card">
              <p
                style={{
                  color: "var(--primary)",
                  fontWeight: "700",
                }}
              >
                {exam.subject}
              </p>

              <h3 style={{ margin: "10px 0" }}>
                {exam.title}
              </h3>

              <p className="small-muted">
                Duration: {exam.duration} mins
              </p>

              <div style={{ marginTop: "18px" }}>
                {role === "student" ? (
                  <button
                    className="btn-primary"
                    style={{ width: "100%" }}
                    onClick={() => startExam(exam)}
                  >
                    Start Exam
                  </button>
                ) : (
                  <>
                    <Link to={`/manage-questions/${exam._id}`}>
                      <button
                        className="btn-primary"
                        style={{ width: "100%" }}
                      >
                        Manage Exam
                      </button>
                    </Link>

                    <button
                      className="btn-danger"
                      style={{
                        width: "100%",
                        marginTop: "10px",
                      }}
                      onClick={() => deleteExam(exam._id)}
                    >
                      Delete Exam
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;