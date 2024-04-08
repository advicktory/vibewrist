import { BleManager } from 'react-native-ble-plx';
import { atob, btoa } from 'react-native-quick-base64';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function manageStudyTime(dataCharacteristic, studyValue, breakValue) {
  const oneThirdStudyTime = studyValue / 3;
  const msTomin = 60000;
  // dataCharacteristic.writeWithResponse(btoa('1,1,0'));
  // console.log((studyValue / 3) * 60000);

  // After 1/3 of the study time
  setTimeout(() => {
    console.log('(1,1,1)'); // replace with sending the data over the device connection
    const led1 = btoa('1,1,1');
    dataCharacteristic.writeWithResponse(led1);
    console.log('Sent data for timer one');
  }, oneThirdStudyTime * msTomin);

  // After 2/3 of the study time
  setTimeout(() => {
    console.log('(1,2,1)');
    const led2 = btoa('1,2,1');
    dataCharacteristic.writeWithResponse(led2);
  }, oneThirdStudyTime * 2 * msTomin);

  // After study session is complete
  setTimeout(async () => {
    dataCharacteristic.writeWithResponse(btoa('1,3,1'));
    for (let i = 0; i < 4; i++) {
      await sleep(1000);
      await dataCharacteristic.writeWithResponse(btoa('1,1,0'));
      await dataCharacteristic.writeWithResponse(btoa('1,2,0'));
      await dataCharacteristic.writeWithResponse(btoa('1,3,0'));

      await sleep(1000);
      await dataCharacteristic.writeWithResponse(btoa('1,1,1'));
      await dataCharacteristic.writeWithResponse(btoa('1,2,1'));
      await dataCharacteristic.writeWithResponse(btoa('1,3,1'));
    }
    console.log('here');
    dataCharacteristic.writeWithResponse(btoa('1,1,0'));
    dataCharacteristic.writeWithResponse(btoa('1,2,0'));
    dataCharacteristic.writeWithResponse(btoa('1,3,0'));

    await sleep(3000);
    await dataCharacteristic.writeWithResponse(
      btoa(`3,${breakValue * msTomin}`)
    );
  }, studyValue * msTomin);
}

export default manageStudyTime;
