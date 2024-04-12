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
    //console.log('In violationFunction');
    if (actualDistance >= startThreshold && !isViolationRecorded) {
      violations++;
      isViolationRecorded = true;
      onViolation(true); // Call the callback function when a violation occurs
      console.log(`Violation recorded. Total violations: ${violations}`);
    } else if (actualDistance < endThreshold) {
      onViolation(false);
      isViolationRecorded = false;
    }
  } else {
    return 'Finished';
  }
};

export { recordViolation, violations };
