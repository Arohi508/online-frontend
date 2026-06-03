export const calculateTrustScore = (
  violationTypes = []
) => {
  let score = 100;

  violationTypes.forEach((v) => {
    switch (v) {
      case "tab_switch":
        score -= 10;
        break;

      case "fullscreen_exit":
        score -= 15;
        break;

      case "camera_off":
        score -= 20;
        break;

      case "face_missing":
        score -= 20;
        break;

      case "mobile_detected":
        score -= 25;
        break;

      case "multiple_faces":
        score -= 30;
        break;

      default:
        break;
    }
  });

  if (score < 0) score = 0;

  let riskLevel = "Low";

  if (score < 80) {
    riskLevel = "Medium";
  }

  if (score < 50) {
    riskLevel = "High";
  }

  return {
    trustScore: score,
    riskLevel
  };
};