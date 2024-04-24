// // Class used to quickly obtain user data.
export default class User {
  constructor(
    userName = 'unnamed',
    devName = 'VibeWrist', // Name of the bracelet
    serUUID = 'TTT', // Service UUID of the bracelet
    charUUID = 'SSS', // Characteristic UUID of the bracelet
    sLen = 0, // Users study length
    bLen = 0, // Users break length
    cAmo = 0, // Cycle Amount
    bRange = 0, // Buzz Range
    bDur = 0, // Buzz Duration
    bFreq = 0, // Buzz Frequency
    violations = 0
  ) {
    this.userName = userName;
    this.devName = devName;
    this.serUUID = serUUID;
    this.charUUID = charUUID;
    this.sLen = sLen;
    this.bLen = bLen;
    this.cAmo = cAmo;
    this.bRange = bRange;
    this.bDur = bDur;
    this.bFreq = bFreq;
    this.violations = violations;
  }
  getUserName() {
    return this.userName;
  }
  getDeviceName() {
    return this.devName;
  }
  getSerUUID() {
    return this.serUUID;
  }
  getCharUUID() {
    return this.charUUID;
  }
  getStudyLength() {
    return this.sLen;
  }
  getBreakLength() {
    return this.bLen;
  }
  getCycleAmount() {
    return this.cAmo;
  }
  getBuzzRange() {
    return this.bRange;
  }
  getBuzzDuration() {
    return this.bDur;
  }
  getBuzzFrequency() {
    return this.bFreq;
  }
  getViolations() {
    return this.violations;
  }

  setUserName(newUserName) {
    this.userName = newUserName;
  }
  setDeviceName(newDevName) {
    this.devName = newDevName;
  }
  setSerUUID(newSerUUID) {
    this.serUUID = newSerUUID;
  }
  setCharUUID(newCharUUID) {
    this.charUUID = newCharUUID;
  }
  setStudyLength(newSLen) {
    this.sLen = newSLen;
  }
  setBreakLength(newBLen) {
    this.bLen = newBLen;
  }
  setCycleAmount(newCAmo) {
    this.cAmo = newCAmo;
  }
  setBuzzRange(newBRange) {
    this.bRange = newBRange;
  }
  setBuzzDuration(newBDur) {
    this.bDur = newBDur;
  }
  setBuzzFrequency(newBFreq) {
    this.bFreq = newBFreq;
  }
  setViolations(violations) {
    this.violations = violations;
  }
}
