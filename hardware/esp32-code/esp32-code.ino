#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <esp_sleep.h>
// #include <EEPROM> //used for writing to flash memory, to maintain certain information

#define LED_PIN_1 32
#define LED_PIN_2 33 
#define LED_PIN_3 25
#define VIBRATION_PIN 26
#define BUTTON_PIN 27 // (RTC_GPIO_17) button used to wake up the esp32

#define SERVICE_UUID           "7A0247E7-8E88-409B-A959-AB5092DDB03E"
#define CHARACTERISTIC_UUID    "82258BAA-DF72-47E8-99BC-B73D7ECD08A5"

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
BLEDescriptor *pDescr;
bool deviceConnected = false;
int connectAttempts = 0;

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) override {
        deviceConnected = true;
    }

    void onDisconnect(BLEServer* pServer) override {
        deviceConnected = false;
    }
};

void print_wakeup_reason(){
  esp_sleep_wakeup_cause_t wakeup_reason;

  wakeup_reason = esp_sleep_get_wakeup_cause();

  switch(wakeup_reason){
    case ESP_SLEEP_WAKEUP_EXT0 : Serial.println("Wakeup caused by external signal using RTC_IO"); break;
    case ESP_SLEEP_WAKEUP_EXT1 : Serial.println("Wakeup caused by external signal using RTC_CNTL"); break;
    case ESP_SLEEP_WAKEUP_TIMER : Serial.println("Wakeup caused by timer"); break;
    case ESP_SLEEP_WAKEUP_TOUCHPAD : Serial.println("Wakeup caused by touchpad"); break;
    case ESP_SLEEP_WAKEUP_ULP : Serial.println("Wakeup caused by ULP program"); break;
    default : Serial.printf("Wakeup was not caused by deep sleep: %d\n",wakeup_reason); break;
  }
}

uint64_t minutesToMicroseconds(int minutes) {
    return (uint64_t)minutes * 60 * 1000000;
}

void checkViolation() {
    // Get the value from the characteristic
    std::string value = pCharacteristic->getValue();

    // Convert the std::string to a String
    String stringValue(value.c_str());

    // Check if the value is equal to "vibrate"
    if (stringValue.equals("vibrate")) {
        // Send a high signal to the VIBRATION_PIN
        digitalWrite(VIBRATION_PIN, HIGH);
        Serial.println("command to vibrate received");
    }
    else {
        digitalWrite(VIBRATION_PIN, LOW);
        Serial.println("not vibrating");
    }
}

void runSession(int durationMinutes) {

    pulsePattern(1);
    // Calculate duration in milliseconds
    unsigned long durationMillis = durationMinutes * 60 * 1000;
    // Serial.print("Session duration in milliseconds: ");
    // Serial.println(durationMillis);

    // Calculate time intervals for turning on LEDs
    unsigned long oneThirdTime = durationMillis / 3;
    unsigned long twoThirdsTime = 2 * oneThirdTime;
    // Serial.print("1/3 time interval: ");
    // Serial.println(oneThirdTime);
    // Serial.print("2/3 time interval: ");
    // Serial.println(twoThirdsTime);

    // Start time of the session
    unsigned long sessionStartTime = millis();
    // Serial.print("Session start time: ");
    // Serial.println(sessionStartTime);

    unsigned long lastProximityCheckTime;

    // Loop until the session duration elapses
    while (millis() - sessionStartTime < durationMillis) {
        // Run detectProximity function every 5 seconds
        unsigned long currentTime = millis();
        if (currentTime - lastProximityCheckTime >= 5000) {
            // Serial.println("Checking for violations at time: ");
            // Serial.println(currentTime);
            lastProximityCheckTime = currentTime;
            checkViolation();
        }

        // Check if 1/3 of the session is complete
        if (currentTime - sessionStartTime >= oneThirdTime) {
            digitalWrite(LED_PIN_1, HIGH);
            // Serial.println("LED_PIN_1 turned on.");
        }

        // Check if 2/3 of the session is complete
        if (currentTime - sessionStartTime >= twoThirdsTime) {
            // Turn on LEDs to indicate 2/3 completion
            digitalWrite(LED_PIN_2, HIGH);
            // Serial.println("LED_PIN_2 turned on.");
        }
    }
    digitalWrite(LED_PIN_3, HIGH);

    // Turn on LEDs to indicate completion of the session
    pulsePattern(2);
}

void processString(const String& input) {
    // Find the position of the comma in the input string
    int commaIndex = input.indexOf(',');

    // If the comma is found
    if (commaIndex != -1) {
        // Extract the substrings before and after the comma
        String onStr = input.substring(0, commaIndex);
        String offStr = input.substring(commaIndex + 1);

        // Convert string values to integers
        int on = onStr.toInt();
        int off = offStr.toInt();
        runSession(on);
        delay(15000); // delay going to sleep for 15 seconds, so the user can see the last light is on and know the session is completed
        digitalWrite(LED_PIN_1, LOW);
        digitalWrite(LED_PIN_2, LOW);
        digitalWrite(LED_PIN_3, LOW);
        esp_sleep_enable_timer_wakeup(minutesToMicroseconds(off));
        // Enter deep sleep mode
        esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_PERIPH, ESP_PD_OPTION_ON);
        esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_FAST_MEM, ESP_PD_OPTION_ON);
        esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_SLOW_MEM, ESP_PD_OPTION_ON);
        esp_deep_sleep_start();

    } else {
        Serial.println("Invalid input format");
    }
}

void pulsePattern(int pattern) {
    switch (pattern) {
        case 1:
            // Send a high signal for 1 second
            digitalWrite(VIBRATION_PIN, HIGH);
            delay(1000);
            digitalWrite(VIBRATION_PIN, LOW);
            break;
        case 2:
            // Send three quick pulses
            for (int i = 0; i < 3; i++) {
                digitalWrite(VIBRATION_PIN, HIGH);
                delay(500);
                digitalWrite(VIBRATION_PIN, LOW);
                delay(500);
            }
            break;
        // Add more cases for additional patterns
        default:
            // Default behavior if an invalid pattern is provided
            Serial.println("Invalid pulse pattern");
            break;
    }
}


void setup() {
    connectAttempts = 0;
    pinMode(BUTTON_PIN, INPUT);
    pinMode(LED_PIN_1, OUTPUT);
    pinMode(LED_PIN_2, OUTPUT);
    pinMode(LED_PIN_3, OUTPUT);
    pinMode(VIBRATION_PIN, OUTPUT);
    Serial.begin(115200);
    BLEDevice::init("ESP32"); // Initialize BLE
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());

    // Create the BLE Service
    // the service is what other devices can see and connect to
    BLEService *pService = pServer->createService(SERVICE_UUID); 

    // Create a BLE Characteristic
    // characteristic defines attributes about the service
    // think about a smart fan having a battery life characteristic that your phone can read
    pCharacteristic = pService->createCharacteristic( 
                        CHARACTERISTIC_UUID,
                        BLECharacteristic::PROPERTY_NOTIFY |
                        BLECharacteristic::PROPERTY_READ |
                        BLECharacteristic::PROPERTY_WRITE
                      );                   

    // Create a BLE Descriptor
    // Descriptors provide an specification about the value of the characteristic
    pDescr = new BLEDescriptor((uint16_t)0x2901);
    pCharacteristic->addDescriptor(pDescr);

    // Start the service
    pService->start();

    // Start advertising
    // all the information in the advertising fields is what the clients can see about the device before connecting
    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(false);
    pAdvertising->setMinPreferred(0x0);  // set value to 0x00 to not advertise this parameter
    // waiting for clients to connect at this point

    // not sure difference between next three lines; all seem to work, maybe one better than others?
    // BLEDevice::startAdvertising(); 
    // pAdvertising->start();
    pServer->startAdvertising();
    Serial.println("Waiting a client connection to notify...");
}

void loop() {
    connectAttempts++;
    if (deviceConnected) {
        Serial.println("Device connected");
        // Get the value from the characteristic
        std::string value = pCharacteristic->getValue();
        // Print the original value
        // Serial.print("Original value: ");
        // Serial.println(value.c_str());

        // Convert std::string to String
        String stringValue(value.c_str());

        // Print the converted value
        // Serial.print("Converted value: ");
        // Serial.println(stringValue);
        // Process the value
        processString(stringValue);
        delay(5000); // every 5 seconds, scan for update to value and process it
    }


    else {
        delay(500); // give the bluetooth stack the chance to get things ready
        pServer->startAdvertising(); // restart advertising
        Serial.print("No device connected, advertising: ");
        Serial.println(connectAttempts);
        // if a device does not connect within 30 seconds, go into deep sleep mode
        if (connectAttempts >= 60) {
            esp_sleep_enable_ext0_wakeup(GPIO_NUM_27, 1);
            esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_PERIPH, ESP_PD_OPTION_ON);
            esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_FAST_MEM, ESP_PD_OPTION_ON);
            esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_SLOW_MEM, ESP_PD_OPTION_ON);
            Serial.println("deep sleep... zzz");
            esp_deep_sleep_start();
        }
    }
}
