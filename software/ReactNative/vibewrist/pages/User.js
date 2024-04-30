// // Class used to quickly obtain user data.

/**
 * Defines a potential user for our project.
 * @class User
 * */

export default class User {
  /**
   * Defines a potential user for our project.
   * @class User
   * @param {string} [userName="unnamed"] Defines a user's specified user name. Default is "unnamed".
   * @param {string} [devName="VibeWrist"] Defines a user's specified Device Name. Default is "VibeWrist".
   * @param {string} [serUUID="TTT"] Defines a user's specified Service UUID of the Bracelet. Default is "TTT".
   * @param {string} [charUUID="SSS"] Defines a user's Specified Characteristic UUID.
   * @param {number} [sLen=0] Defines a user's Study Length
   * @param {number} [bLen=0] Defines a user's Break Length
   * @param {number} [cAmo=0] Defines a user's last Cycle Amount
   * @param {number} [bRange=0] Defines a user's Buzz Range.
   * @param {number} [bDur=0] Defines a user's Duration.
   * @param {number} [bFreq=0] Defines a user's Buzz Frequency.
   * @param {number} [violations=0] Defines a user's violations.
   * @param {number} [userGoalTime=0] Defines a user's Goal Time.
   * @param {number} [userCurrentTime=0] Defines a user's Current Time.
   * */
  constructor(
    userName = "unnamed",
    devName = "VibeWrist", // Name of the bracelet
    serUUID = "TTT", // Service UUID of the bracelet
    charUUID = "SSS", // Characteristic UUID of the bracelet
    sLen = 0, // Users study length
    bLen = 0, // Users break length
    cAmo = 0, // Cycle Amount
    bRange = 0, // Buzz Range
    bDur = 0, // Buzz Duration
    bFreq = 0, // Buzz Frequency
    violations = 0,
    userGoalTime = 0,
    userCurrentTime = 0,
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
    this.userGoalTime = userGoalTime;
    this.userCurrentTime = userCurrentTime;
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
  getUserGoalTime() {
    return this.userGoalTime;
  }
  getUserCurrTime() {
    return this.userCurrentTime;
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
  setUserGoalTime(userGoalTime) {
    this.userGoalTime = userGoalTime;
  }
  setUserCurrTime(userCurrentTime) {
    this.userCurrentTime = userCurrentTime;
  }
}
