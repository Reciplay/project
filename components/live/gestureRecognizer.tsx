import { Landmark } from "@mediapipe/tasks-vision";

function calculateAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);

  if (angle > 180.0) {
    angle = 360 - angle;
  }

  return angle;
}

export function recognizeGesture(landmarks: Landmark[]): string {
  if (!landmarks || landmarks.length < 17) {
    return "";
  }

  const leftEye = landmarks[2];
  const rightEye = landmarks[5];
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftElbow = landmarks[13];
  const rightElbow = landmarks[14];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];

  const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

  // Crossed Arm gesture
  const areArmsCrossed = leftWrist.x < rightWrist.x

  if (areArmsCrossed) {
    return "Crossed Arm";
  }


  // "Hands Up" gesture
  // Check if both wrists are above their respective eyes
  if (leftWrist.y < leftEye.y && rightWrist.y < rightEye.y) {
    // Further check if arms are somewhat straight
    return "Hands Up";
  }

  if (rightWrist.y < rightEye.y) {
    return "right Hand Up"
  }


  // "handOnShoulder" gesture
  // Check if wrists are at shoulder height and arms are bent
  const leftHandAtShoulderHeight =
    Math.abs(leftWrist.y - leftShoulder.y) < 0.15;
  const rightHandAtShoulderHeight =
    Math.abs(rightWrist.y - rightShoulder.y) < 0.15;

  if (leftHandAtShoulderHeight && rightHandAtShoulderHeight) {
    const wristDistance = Math.sqrt(
      Math.pow(rightWrist.x - leftWrist.x, 2) +
      Math.pow(rightWrist.y - leftWrist.y, 2),
    );

    if (wristDistance < 0.2) {
      return "Clap";
    }

    if (leftArmAngle < 80 && rightArmAngle < 80) {
      return "handOnShoulder";
    }
  }


  return "";
}
