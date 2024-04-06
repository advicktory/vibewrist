function manageStudyTime(dataCharacteristic, studyValue, breakValue) {
  const oneThirdStudyTime = studyValue / 3;

  // After 1/3 of the study time
  setTimeout(() => {
    console.log('(1,1,1)'); // replace with sending the data over the device connection
    const led1 = btoa('1,1,1');
    dataCharacteristic.writeWithResponse(led1);
  }, oneThirdStudyTime);

  // After 2/3 of the study time
  setTimeout(() => {
    console.log('(1,2,1)');
    const led2 = btoa('1,2,1');
    dataCharacteristic.writeWithResponse(led2);
  }, oneThirdStudyTime * 2);

  // After the full study time
  setTimeout(() => {
    console.log('(1,3,1)');
    const led3 = btoa('1,3,1');
    dataCharacteristic.writeWithResponse(led3);
    // Log "Done" five times at one-second intervals
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        // FLASHES ALL LIGHTS FIVE TIMES
        dataCharacteristic.writeWithResponse(btoa('1,1,1'));
        dataCharacteristic.writeWithResponse(btoa('1,2,1'));
        dataCharacteristic.writeWithResponse(btoa('1,3,1'));
        console.log('Done');
      }, i * 1000); // 1000 milliseconds = 1 second
    }
    // Will turn off each of the leds
    dataCharacteristic.writeWithResponse(btoa('1,1,0'));
    dataCharacteristic.writeWithResponse(btoa('1,2,0'));
    dataCharacteristic.writeWithResponse(btoa('1,3,0'));
  }, studyValue);

  // Tell esp to fall shleep
  dataCharacteristic.writeWithResponse(btoa(`3,${breakValue}`));
}

export default manageStudyTime;
