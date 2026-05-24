import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function ManageQuestions() {
  const { examId } = useParams();

  const emptyForm = {
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    marks: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const loadQuestions = () => {
    axios
      .get(`http://localhost:5000/questions/${examId}`)
      .then((res) => setQuestions(res.data));
  };

  useEffect(() => {
    loadQuestions();
  }, [examId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (editingId) {
      await axios.put(
        `http://localhost:5000/update-question/${editingId}`,
        {
          examId,
          ...form
        }
      );
      setEditingId(null);
    } else {
      await axios.post(
        "http://localhost:5000/add-question",
        {
          examId,
          ...form
        }
      );
    }

    setForm(emptyForm);
    loadQuestions();
  };

  const deleteQuestion = async (id) => {
    const ok = window.confirm("Delete question?");
    if (!ok) return;

    await axios.delete(
      `http://localhost:5000/delete-question/${id}`
    );

    loadQuestions();
  };

  const editQuestion = (q) => {
    setEditingId(q._id);

    setForm({
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      marks: q.marks
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="page-shell">
      <Navbar />

      <div style={{ padding: "24px 40px" }}>
        <h1 style={{ color: "var(--text)" }}>
          Manage Questions
        </h1>

        {/* FORM */}
        <div style={card}>
          <h2 style={{ color: "var(--text)" }}>
            {editingId ? "Edit Question" : "Add Question"}
          </h2>

          {[
            "question",
            "optionA",
            "optionB",
            "optionC",
            "optionD",
            "correctAnswer",
            "marks"
          ].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field}
              value={form[field]}
              onChange={handleChange}
              style={input}
            />
          ))}

          <button onClick={handleSubmit} style={btnPrimary}>
            {editingId ? "Save Changes" : "Add Question"}
          </button>

          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              style={{
                ...btnDanger,
                marginTop: "10px"
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* QUESTION LIST */}
        {questions.map((q, index) => (
          <div key={q._id} style={{ ...card, marginTop: "16px" }}>
            <h3 style={{ color: "var(--text)" }}>
              {index + 1}. {q.question}
            </h3>

            <p>A. {q.optionA}</p>
            <p>B. {q.optionB}</p>
            <p>C. {q.optionC}</p>
            <p>D. {q.optionD}</p>

            <p>
              <strong>Correct:</strong> {q.correctAnswer}
            </p>

            <p>
              <strong>Marks:</strong> {q.marks}
            </p>

            <button
              onClick={() => editQuestion(q)}
              style={btnBlue}
            >
              Edit Question
            </button>

            <button
              onClick={() => deleteQuestion(q._id)}
              style={{
                ...btnDanger,
                marginTop: "10px"
              }}
            >
              Delete Question
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 🔥 THEME BASED STYLES */

const card = {
  background: "var(--card)",
  padding: "24px",
  borderRadius: "20px",
  boxShadow: "var(--shadow)",
  border: "1px solid var(--border)"
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid var(--border)",
  background: "transparent",
  color: "var(--text)"
};

const btnPrimary = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "12px",
  background: "var(--primary)",
  color: "#fff",
  fontWeight: "700",
  cursor: "pointer"
};

const btnBlue = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "12px",
  background: "#2563eb",
  color: "#fff",
  fontWeight: "700",
  cursor: "pointer"
};

const btnDanger = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "12px",
  background: "#ef4444",
  color: "#fff",
  fontWeight: "700",
  cursor: "pointer"
};

export default ManageQuestions;