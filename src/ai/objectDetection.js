import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

let model = null;
let lastViolationTime = 0;

export const loadObjectDetector = async () => {
  try {
    if (!model) {
      console.log("Loading AI model...");
      model = await cocoSsd.load();
      console.log("AI model loaded successfully");
    }

    return model;
  } catch (error) {
    console.error("Model load failed:", error);
  }
};

export const detectObjects = async (
  video,
  addViolation
) => {
  try {
    if (!model || !video) return;

    const predictions = await model.detect(video);

    console.log("========== AI DETECTIONS ==========");

    predictions.forEach((p) => {
      console.log(
        `Detected: ${p.class} | Score: ${(
          p.score * 100
        ).toFixed(2)}%`
      );
    });

    console.log("===================================");

    const now = Date.now();

    const phoneFound = predictions.some(
      (p) =>
        ["cell phone", "remote"].includes(
          p.class
        ) &&
        p.score > 0.5
    );

    const bookFound = predictions.some(
      (p) =>
        p.class === "book" &&
        p.score > 0.5
    );

    const persons = predictions.filter(
      (p) =>
        p.class === "person" &&
        p.score > 0.5
    );

    // Cooldown to avoid spam
    const canAddViolation =
      now - lastViolationTime > 10000;

    // No face visible
    if (
      persons.length === 0 &&
      canAddViolation
    ) {
      console.log(
        "🚨 Face Not Visible"
      );

      addViolation(
        "Face Not Visible!",
        "face_missing"
      );

      lastViolationTime = now;
    }

    // Multiple persons
    if (
      persons.length > 1 &&
      canAddViolation
    ) {
      console.log(
        "🚨 Multiple Persons Detected"
      );

      addViolation(
        "Multiple Persons Detected!",
        "multiple_faces"
      );

      lastViolationTime = now;
    }

    // Mobile phone
    if (
      phoneFound &&
      canAddViolation
    ) {
      console.log(
        "🚨 Mobile Phone Detected"
      );

      addViolation(
        "Mobile Phone Detected!",
        "mobile_detected"
      );

      lastViolationTime = now;
    }

    // Book
    if (
      bookFound &&
      canAddViolation
    ) {
      console.log(
        "🚨 Book Detected"
      );

      addViolation(
        "Book Detected!",
        "book_detected"
      );

      lastViolationTime = now;
    }
  } catch (error) {
    console.error(
      "Detection Error:",
      error
    );
  }
};