import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Instructions() {
  const navigate = useNavigate();

  const [agreed, setAgreed] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const enableCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: true
      });

      setCameraReady(true);
      alert("Camera access granted");
    } catch (error) {
      alert("Camera permission denied");
    }
  };

  const startExam = async () => {
    if (!agreed) {
      alert("Please accept rules first");
      return;
    }

    if (!cameraReady) {
      alert("Please allow camera first");
      return;
    }

    setLoading(true);

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }

      navigate("/exam");
    } catch (error) {
      alert("Fullscreen required");
    }

    setLoading(false);
  };

  return (
    <div className="page-shell">
      <Navbar />

      <div style={{ padding: "35px 40px" }}>
        {/* HEADER */}
        <div
          style={{
            background: "var(--secondary)",
            borderRadius: "24px",
            padding: "34px",
            marginBottom: "28px"
          }}
        >
          <p
            style={{
              margin: 0,
              color: "var(--primary)",
              fontWeight: "700"
            }}
          >
            Read Carefully
          </p>

          <h1
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              fontSize: "42px",
              color: "var(--text)"
            }}
          >
            Exam Instructions
          </h1>

          <p style={{ color: "var(--subtext)" }}>
            Complete all checks before starting exam.
          </p>
        </div>

        {/* MAIN CARD */}
        <div
          style={{
            background: "var(--card)",
            padding: "30px",
            borderRadius: "22px",
            boxShadow: "var(--shadow)",
            border: "1px solid var(--border)"
          }}
        >
          <ul
            style={{
              lineHeight: "2",
              paddingLeft: "22px",
              color: "var(--text)",
              fontSize: "17px"
            }}
          >
            <li>No tab switching allowed.</li>
            <li>Camera must remain ON.</li>
            <li>Exam auto submits when timer ends.</li>
            <li>Multiple violations mark attempt suspicious.</li>
            <li>Stable internet recommended.</li>
            <li>Fullscreen mode required.</li>
          </ul>

          {/* CAMERA BUTTON */}
          <button
            onClick={enableCamera}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "20px",
              border: "none",
              borderRadius: "12px",
              background: cameraReady
                ? "#22c55e"
                : "var(--secondary)",
              color: cameraReady ? "#fff" : "var(--text)",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            {cameraReady
              ? "Camera Ready ✓"
              : "Allow Camera"}
          </button>

          {/* CHECKBOX */}
          <label
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "22px",
              alignItems: "center",
              fontWeight: "600",
              color: "var(--text)"
            }}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              style={{
                width: "18px",
                height: "18px"
              }}
            />

            I agree to follow all exam rules.
          </label>

          {/* START BUTTON */}
          <button
            onClick={startExam}
            disabled={!agreed || !cameraReady}
            style={{
              marginTop: "26px",
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "12px",
              background:
                agreed && cameraReady
                  ? "var(--primary)"
                  : "var(--secondary)",
              color:
                agreed && cameraReady
                  ? "#fff"
                  : "var(--subtext)",
              fontSize: "16px",
              fontWeight: "700",
              cursor:
                agreed && cameraReady
                  ? "pointer"
                  : "not-allowed"
            }}
          >
            {loading
              ? "Starting..."
              : "Start Exam"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Instructions;