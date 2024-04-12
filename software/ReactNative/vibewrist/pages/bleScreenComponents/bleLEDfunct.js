import { BleManager } from 'react-native-ble-plx';
import { atob, btoa } from 'react-native-quick-base64';
import getDistance from '../bleScreenComponents/bleDistance.js';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function manageStudyTime(dataCharacteristic, studyValue, breakValue) {
  const oneThirdStudyTime = studyValue / 3;
  const msTomin = 60000;


  // Using an async function to await the completion of each timed section
  const executeAfterDelay = async (delay, callback) => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    callback();
  };

  await executeAfterDelay(oneThirdStudyTime * msTomin, () => {
    console.log('(1,1,1)');
    const led1 = btoa('1,1,1');

    dataCharacteristic.writeWithResponse(led1);
  });


  await executeAfterDelay(oneThirdStudyTime * msTomin, () => {
    console.log('(1,2,1)');
    const led2 = btoa('1,2,1');

    dataCharacteristic.writeWithResponse(led2);
  });

  await executeAfterDelay(oneThirdStudyTime * msTomin, async () => {
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
    await dataCharacteristic.writeWithResponse(btoa('1,1,0'));
    await dataCharacteristic.writeWithResponse(btoa('1,2,0'));
    await dataCharacteristic.writeWithResponse(btoa('1,3,0'));
    await sleep(3000);
  });

}
export default manageStudyTime;
