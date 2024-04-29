// // recordViolation.js
let isViolationRecorded = false; // This state persists across function calls
let violations = 0; // should reset when the loop restarts
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
    //violations = 0; // should reset when the loop restarts
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

const getViolations = () => {
  return violations;
  //console.log('Violations in bleViolations: ', violations);
};

export { recordViolation, getViolations };
