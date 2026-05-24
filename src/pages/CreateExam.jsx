import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function CreateExam() {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    duration: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/create-exam`,
    form
  );
};

    alert(res.data.message);

    setForm({
      title: "",
      subject: "",
      duration: ""
    });
  };

  return (
    <div className="page-shell">
      <Navbar />

      <div style={{ padding: "20px 40px 50px" }}>
        {/* HERO */}
        <div
          style={{
            background: "var(--secondary)",
            borderRadius: "24px",
            padding: "35px",
            marginBottom: "30px"
          }}
        >
          <p
            style={{
              margin: 0,
              color: "var(--primary)",
              fontWeight: "700"
            }}
          >
            Teacher / Admin Panel
          </p>

          <h1
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              fontSize: "42px",
              color: "var(--text)"
            }}
          >
            Create New Exam
          </h1>

          <p
            style={{
              color: "var(--subtext)",
              maxWidth: "620px"
            }}
          >
            Set up secure online assessments with subject details,
            duration, and instant publishing for students.
          </p>
        </div>

        {/* FORM CARD */}
        <div
          style={{
            maxWidth: "620px",
            background: "var(--card)",
            padding: "30px",
            borderRadius: "22px",
            boxShadow: "var(--shadow)",
            border: "1px solid var(--border)"
          }}
        >
          <h2 style={{ marginTop: 0, color: "var(--text)" }}>
            Exam Details
          </h2>

          <p
            style={{
              color: "var(--subtext)",
              marginBottom: "22px"
            }}
          >
            Fill the details below to publish an exam.
          </p>

          <input
            name="title"
            placeholder="Exam Title"
            value={form.title}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="subject"
            placeholder="Subject Name"
            value={form.subject}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="duration"
            placeholder="Duration (minutes)"
            value={form.duration}
            onChange={handleChange}
            style={inputStyle}
          />

          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: "var(--primary)",
              color: "white",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              marginTop: "8px"
            }}
          >
            Create Exam
          </button>
        </div>
      </div>
    </div>
  );


/* 🔥 UPDATED INPUT STYLE */
const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "14px",
  borderRadius: "12px",
  border: "1px solid var(--border)",
  background: "transparent",
  color: "var(--text)",
  boxSizing: "border-box",
  fontSize: "15px"
};

export default CreateExam;