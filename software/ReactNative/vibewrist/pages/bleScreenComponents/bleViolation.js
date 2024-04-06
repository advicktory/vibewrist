// recordViolation.js

let isViolationRecorded = false; // This state persists across function calls
let violations = 0;
let intervalId = null; // To keep track of the interval

const recordViolation = (
  startRecording,
  actualDistance,
  startThreshold,
  endThreshold,
  onViolation
) => {
  if (startRecording) {
// Interval to check distance
const intervalId = setInterval(() => {
    if (actualDistance >= endThreshold && actualDistance <= startThreshold && !isViolationRecorded) {
        violations++;
        isViolationRecorded = true;
        onViolation(true);  // Call the callback function when a violation occurs
        console.log(`Violation recorded. Total violations: ${violations}`);
    } else if (actualDistance < endThreshold) {
        isViolationRecorded = false;
    }
}, 500); // Check every second

return () => clearInterval(intervalId); // Return a cleanup function
  }
};

export { recordViolation, violations };
