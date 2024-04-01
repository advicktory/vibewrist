function manageStudyTime(device, studyValue) {
  const oneThirdStudyTime = studyValue / 3;

  // After 1/3 of the study time
  setTimeout(() => {
    console.log('(1,1,1)'); // replace with sending the data over the device connection
    //const base64data = btoa('1,1,1');
    //await dataCharacteristic.writeWithResponse(base64data);
  }, oneThirdStudyTime);

  // After 2/3 of the study time
  setTimeout(() => {
    console.log('(1,2,1)');
    //const base64data = btoa('1,2,1');
    //await dataCharacteristic.writeWithResponse
  }, oneThirdStudyTime * 2);

  // After the full study time
  setTimeout(() => {
    console.log('(1,3,1)');
    //const base64data = btoa('1,3,1');
    //await dataCharacteristic.writeWithResponse
    // Log "Done" five times at one-second intervals
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        // FLASHES ALL LIGHTS FIVE TIMES
        //const base64data = btoa('1,1,1');
        //await dataCharacteristic.writeWithResponse
        //const base64data = btoa('1,2,1');
        //await dataCharacteristic.writeWithResponse
        //const base64data = btoa('1,3,1');
        //await dataCharacteristic.writeWithResponse
        console.log('Done');
      }, i * 1000); // 1000 milliseconds = 1 second
    }
    // Will turn off each of the leds
    //const base64data = btoa('1,1,0');
    //await dataCharacteristic.writeWithResponse
    //const base64data = btoa('1,2,0');
    //await dataCharacteristic.writeWithResponse
    //const base64data = btoa('1,3,0');
    //await dataCharacteristic.writeWithResponse
  }, studyValue);
}

export default manageStudyAndBreakTimes;
