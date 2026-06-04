import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  loadObjectDetector,
  detectObjects
} from "../ai/objectDetection";
import { calculateTrustScore }
from "../ai/trustScore";

function ExamPage() {
  const navigate = useNavigate();
const videoRef = useRef(null);
const streamRef = useRef(null);
const intervalRef = useRef(null);
const examEndedRef = useRef(false);

  const examId = localStorage.getItem("examId");
  const examTitle =
    localStorage.getItem("examTitle") || "Online Exam";

  const examDuration =
    Number(localStorage.getItem("examDuration")) || 5;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(examDuration * 60);

  const [violations, setViolations] = useState(0);
  const [violationTypes, setViolationTypes] = useState([]);
  const [warning, setWarning] = useState("");
  const [cameraStatus, setCameraStatus] = useState("Active");
  const [locked, setLocked] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [examEnded, setExamEnded] = useState(false);

  const addViolation = (msg, type) => {
    setViolations((prev) => prev + 1);
    setWarning(msg);
    if (type) {
      setViolationTypes((prev) => [...prev, type]);
    }
  };

  const returnFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setLocked(false);
      setWarning("");
    } catch {}
  };

  const handleAnswer = (qid, option) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: option
    }));
  };

  const calculateScore = () => {
    let total = 0;
    questions.forEach((q) => {
      if (answers[q._id] === q.correctAnswer) {
        total += Number(q.marks) || 1;
      }
    });
    return total;
  };

  const handleSubmit = async () => {
  if (submitted) return;

setSubmitted(true);
setExamEnded(true);
examEndedRef.current = true;

  try {
      const score = calculateScore();
      const {
  trustScore,
  riskLevel
} = calculateTrustScore(
  violationTypes
);

console.log("========== TRUST SCORE DEBUG ==========");
console.log("Violations Count:", violations);
console.log("Violation Types:", violationTypes);
console.log("Trust Score:", trustScore);
console.log("Risk Level:", riskLevel);
console.log("======================================");

      const totalMarks = questions.reduce(
        (sum, q) => sum + (Number(q.marks) || 1),
        0
      );

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      await axios.post(
  `${import.meta.env.VITE_API_URL}/save-result`,
  {
    examId,
    examTitle,
    name: localStorage.getItem("name") || "Student",
    email: "student@gmail.com",
    score,
    totalMarks,
    violations,
    violationTypes,

    trustScore,
    riskLevel,

    timeTaken: examDuration
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

localStorage.setItem("latestScore", score);
localStorage.setItem("latestTotalMarks", totalMarks);
localStorage.setItem("latestExamTitle", examTitle);

// Stop AI detection
if (intervalRef.current) {
  clearInterval(intervalRef.current);
  intervalRef.current = null;
}

// Stop camera completely
if (streamRef.current) {
  streamRef.current.getTracks().forEach((track) => {
    track.stop();
  });
}

if (videoRef.current) {
  videoRef.current.pause();
  videoRef.current.srcObject = null;
}

// Force browser to release stream
streamRef.current = null;

// Exit fullscreen
if (document.fullscreenElement) {
  await document.exitFullscreen();
}

// Give browser time to release camera
await new Promise((resolve) =>
  setTimeout(resolve, 1000)
);

window.location.href = "/result";

} catch (error) {
  console.log("ERROR:", error.response?.data || error.message);
  alert(
    error.response?.data?.message ||
      "Submit failed. Check console."
  );
}
};

const formatTime = () => {
const mins = Math.floor(timeLeft / 60);
const secs = timeLeft % 60;
return `${mins}:${String(secs).padStart(2, "0")}`;
};

useEffect(() => {
axios
  .get(`${import.meta.env.VITE_API_URL}/questions/${examId}`)
  .then((res) => setQuestions(res.data));

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      loadObjectDetector().then(() => {
  intervalRef.current = setInterval(() => {
    detectObjects(
      videoRef.current,
      addViolation
    );
  }, 5000);
});
    }

    stream.getVideoTracks()[0].onended = () => {
  setCameraStatus("Stopped");
};
  })
  .catch(() => {
    addViolation("Camera denied!", "camera_denied");
    setCameraStatus("Denied");
  });

const handleVisibility = () => {
  if (document.hidden) {
    addViolation("Tab switching detected!", "tab_switch");
  }
};

const handleFullscreen = () => {
  if (examEndedRef.current) return;

  if (!document.fullscreenElement) {
    addViolation(
      "Fullscreen exited!",
      "fullscreen_exit"
    );

    setLocked(true);
  }
};
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("fullscreenchange", handleFullscreen);

    return () => {
  clearInterval(timer);

  if (intervalRef.current) {
  clearInterval(intervalRef.current);
  intervalRef.current = null;
}

  if (streamRef.current) {
    streamRef.current
      .getTracks()
      .forEach((track) => track.stop());

    streamRef.current = null;
  }

  if (videoRef.current) {
  videoRef.current.pause();
  videoRef.current.srcObject = null;
}

  document.removeEventListener(
    "visibilitychange",
    handleVisibility
  );

  document.removeEventListener(
    "fullscreenchange",
    handleFullscreen
  );
};
  }, [examId]);

  useEffect(() => {
    if (timeLeft <= 0 || violations >= 5) {
      handleSubmit();
    }
  }, [timeLeft, violations]);

  return (
    <div className="page-shell">
      <Navbar />

      {/* FULLSCREEN LOCK */}
      {locked && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.85)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "var(--card)",
            padding: "40px",
            borderRadius: "20px",
            border: "1px solid var(--border)",
            textAlign: "center"
          }}>
            <h2 style={{ color: "var(--text)" }}>
              Fullscreen Required
            </h2>

            <button
              onClick={returnFullscreen}
              style={{
                marginTop: "12px",
                padding: "12px 20px",
                border: "none",
                borderRadius: "10px",
                background: "var(--primary)",
                color: "#fff",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              Return Fullscreen
            </button>
          </div>
        </div>
      )}

      <div
  style={{
    padding: "24px 40px",
    paddingRight: "420px"
  }}
>
       <h1 style={{ color: "var(--text)" }}>
  {examTitle}
</h1>

<div
 style={{
  position: "fixed",
  right: "30px",
  top: "120px",
  width: "340px",
  zIndex: 999,
  background: "var(--card)",
  padding: "16px",
  borderRadius: "18px",
  border: "1px solid var(--border)",
  boxShadow: "var(--shadow)"
}}
>
  <p style={{ color: "var(--subtext)" }}>
    Time Left: {formatTime()}
  </p>

  <p style={{ color: "var(--subtext)" }}>
    Violations: {violations}
  </p>

  {warning && (
    <p style={{ color: "#ef4444" }}>
      {warning}
    </p>
  )}

  <video
    ref={videoRef}
    autoPlay
    muted
    width="320"
    height="220"
   style={{
  width: "100%",
  height: "240px",
  objectFit: "cover",
  background: "#000",
  borderRadius: "14px",
  marginTop: "12px"
}}
  />
</div>

        {/* QUESTIONS */}
        {questions.map((q, index) => (
          <div key={q._id} style={{
            background: "var(--card)",
            padding: "20px",
            marginBottom: "16px",
            borderRadius: "16px",
            border: "1px solid var(--border)"
          }}>
            <h3 style={{ color: "var(--text)" }}>
              {index + 1}. {q.question}
            </h3>

            {["A","B","C","D"].map((letter) => (
              <label
                key={letter}
                style={{
                  display: "block",
                  marginTop: "10px",
                  color: "var(--text)"
                }}
              >
                <input
                  type="radio"
                  name={q._id}
                  checked={answers[q._id] === letter}
                  onChange={() => handleAnswer(q._id, letter)}
                />{" "}
                {q[`option${letter}`]}
              </label>
            ))}
          </div>
        ))}

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
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
          Submit Exam
        </button>
      </div>
    </div>
  );
}

export default ExamPage;