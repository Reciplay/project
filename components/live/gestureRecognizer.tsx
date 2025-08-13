// import { Landmark } from "@mediapipe/tasks-vision";

// function calculateAngle(a: Landmark, b: Landmark, c: Landmark): number {
//   const radians =
//     Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
//   let angle = Math.abs((radians * 180.0) / Math.PI);

//   if (angle > 180.0) {
//     angle = 360 - angle;
//   }

//   return angle;
// }

// export function recognizeGesture(landmarks: Landmark[]): string {
//   if (!landmarks || landmarks.length < 17) {
//     return "";
//   }

//   const leftEye = landmarks[2];
//   const rightEye = landmarks[5];
//   const leftShoulder = landmarks[11];
//   const rightShoulder = landmarks[12];
//   const leftElbow = landmarks[13];
//   const rightElbow = landmarks[14];
//   const leftWrist = landmarks[15];
//   const rightWrist = landmarks[16];

//   const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
//   const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

//   // Crossed Arm gesture
//   const areArmsCrossed = leftWrist.x < rightWrist.x;

//   if (areArmsCrossed) {
//     return "Crossed Arm";
//   }

//   // "Hands Up" gesture
//   // Check if both wrists are above their respective eyes
//   if (leftWrist.y < leftEye.y && rightWrist.y < rightEye.y) {
//     // Further check if arms are somewhat straight
//     return "Hands Up";
//   }

//   if (rightWrist.y < rightEye.y) {
//     return "right Hand Up";
//   }

//   // "handOnShoulder" gesture
//   // Check if wrists are at shoulder height and arms are bent
//   const leftHandAtShoulderHeight =
//     Math.abs(leftWrist.y - leftShoulder.y) < 0.15;
//   const rightHandAtShoulderHeight =
//     Math.abs(rightWrist.y - rightShoulder.y) < 0.15;

//   if (leftHandAtShoulderHeight && rightHandAtShoulderHeight) {
//     const wristDistance = Math.sqrt(
//       Math.pow(rightWrist.x - leftWrist.x, 2) +
//         Math.pow(rightWrist.y - leftWrist.y, 2),
//     );

//     if (wristDistance < 0.2) {
//       return "Clap";
//     }

//     if (leftArmAngle < 80 && rightArmAngle < 80) {
//       return "handOnShoulder";
//     }
//   }

//   return "";
// }
import { Landmark } from "@mediapipe/tasks-vision";

function calculateAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) angle = 360 - angle;
  return angle;
}

/** 주어진 인덱스의 Landmark가 유효하면 Landmark, 아니면 null */
function getLM(arr: Landmark[], i: number): Landmark | null {
  const v = arr[i];
  // x/y/z 가 number로 존재하면 Landmark로 간주
  return v && typeof v.x === "number" && typeof v.y === "number" ? v : null;
}

/** 필요한 인덱스들이 모두 유효한 Landmark인지 점검하고 묶어서 반환 */
function need(arr: Landmark[], idx: number[]): (Landmark | null)[] {
  return idx.map((i) => getLM(arr, i));
}

export function recognizeGesture(landmarks: Landmark[]): string {
  // 최소 개수는 보장하되, 요소별로도 개별 확인(배열 길이 체크만으론 TS가 추론 못 함)
  if (!Array.isArray(landmarks) || landmarks.length < 17) return "";

  // 사용 인덱스: 2,5,11,12,13,14,15,16
  const [
    leftEye,
    rightEye,
    leftShoulder,
    rightShoulder,
    leftElbow,
    rightElbow,
    leftWrist,
    rightWrist,
  ] = need(landmarks, [2, 5, 11, 12, 13, 14, 15, 16]);

  // 하나라도 없으면 제스처 인식 불가
  if (
    !leftEye ||
    !rightEye ||
    !leftShoulder ||
    !rightShoulder ||
    !leftElbow ||
    !rightElbow ||
    !leftWrist ||
    !rightWrist
  ) {
    return "";
  }

  const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

  // 팔 교차
  const areArmsCrossed = leftWrist.x < rightWrist.x;
  if (areArmsCrossed) return "Crossed Arm";

  // 양손 들기
  if (leftWrist.y < leftEye.y && rightWrist.y < rightEye.y) {
    return "Hands Up";
  }

  // 오른손만 들기
  if (rightWrist.y < rightEye.y) {
    return "right Hand Up";
  }

  // 어깨 높이 + 박수/어깨에 손
  const leftHandAtShoulderHeight =
    Math.abs(leftWrist.y - leftShoulder.y) < 0.15;
  const rightHandAtShoulderHeight =
    Math.abs(rightWrist.y - rightShoulder.y) < 0.15;

  if (leftHandAtShoulderHeight && rightHandAtShoulderHeight) {
    const wristDistance = Math.hypot(
      rightWrist.x - leftWrist.x,
      rightWrist.y - leftWrist.y,
    );

    if (wristDistance < 0.2) return "Clap";
    if (leftArmAngle < 80 && rightArmAngle < 80) return "handOnShoulder";
  }

  return "";
}
