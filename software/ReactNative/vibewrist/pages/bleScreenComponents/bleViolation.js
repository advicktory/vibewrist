// recordViolation.js

let isViolationRecorded = false; // This state persists across function calls
let violations = 0;
let intervalId = null; // To keep track of the interval

const recordViolation = (
  startRecording,
  actualDistance,
  startThreshold,
  endThreshold
) => {
  if (startRecording) {
    // Start the interval if not already started
    if (intervalId === null) {
      intervalId = setInterval(() => {
        if (
          actualDistance >= endThreshold &&
          actualDistance <= startThreshold &&
          !isViolationRecorded
        ) {
          violations++;
          isViolationRecorded = true;
          console.log(`Violation recorded. Total violations: ${violations}`);
        } else if (
          actualDistance < endThreshold ||
          actualDistance > startThreshold
        ) {
          // Reset when outside the threshold range
          isViolationRecorded = false;
        }
      }, 500); // Check every second
      return 'Violation';
    }
  } else {
    // Clear the interval if recording is stopped
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  return violations;
};

export { recordViolation, violations };
