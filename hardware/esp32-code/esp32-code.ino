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

void processString(const String& input) {
    // Check if the input string is empty
    if (input.length() == 0) {
        Serial.println("Empty input string");
        return;
    }

    // Extract the command type (first character)
    char commandType = input.charAt(0);

    // Process based on the command type
    switch (commandType) {
        case '1': // LED control
            processLEDCommand(input);
            break;
        case '2': // Vibration control
            processVibrationCommand(input);
            break;
        case '3': // Deep sleep
            processDeepSleepCommand(input);
            break;
        default:
            Serial.println("Invalid command type");
            break;
    }
}

void processLEDCommand(const String& input) {
    // Extract LED number and state from the input string
    int commaIndex1 = input.indexOf(',');
    int commaIndex2 = input.indexOf(',', commaIndex1 + 1);

    // Check if both commas are found
    if (commaIndex1 == -1 || commaIndex2 == -1) {
        Serial.println("Invalid LED command format");
        return;
    }

    // Extract LED number and state
    int ledNumber = input.substring(commaIndex1 + 1, commaIndex2).toInt();
    int ledState = input.substring(commaIndex2 + 1).toInt();

    // Perform LED control based on the extracted values
    switch (ledNumber) {
        case 1:
            digitalWrite(LED_PIN_1, ledState);
            break;
        case 2:
            digitalWrite(LED_PIN_2, ledState);
            break;
        case 3:
            digitalWrite(LED_PIN_3, ledState);
            break;
        default:
            Serial.println("Invalid LED number");
            break;
    }
}

void processVibrationCommand(const String& input) {
    // Extract vibration pattern, strength, and state from the input string
    int commaIndex1 = input.indexOf(',');
    int commaIndex2 = input.indexOf(',', commaIndex1 + 1);
    int commaIndex3 = input.indexOf(',', commaIndex2 + 1);

    // Check if all commas are found
    if (commaIndex1 == -1 || commaIndex2 == -1 || commaIndex3 == -1) {
        Serial.println("Invalid vibration command format");
        return;
    }

    // Extract vibration pattern, strength, and state
    int vibrationPattern = input.substring(commaIndex1 + 1, commaIndex2).toInt();
    int vibrationStrength = input.substring(commaIndex2 + 1, commaIndex3).toInt();
    int vibrationState = input.substring(commaIndex3 + 1).toInt();

    if (vibrationState == 0) {
      digitalWrite(VIBRATION_PIN, LOW);
      return;
    }

    // Perform vibration control based on the extracted values
    // Call the pulsePattern function with the processed pattern integer
    pulsePattern(vibrationPattern, vibrationStrength);
}


void processDeepSleepCommand(const String& input) {
    // Extract sleep duration from the input string
    int commaIndex = input.indexOf(',');

    // Check if comma is found
    if (commaIndex == -1) {
        Serial.println("Invalid deep sleep command format");
        return;
    }

    int sleepDuration = input.substring(commaIndex + 1).toInt();
    esp_sleep_enable_timer_wakeup(minutesToMicroseconds(sleepDuration));
    esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_PERIPH, ESP_PD_OPTION_ON);
    esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_FAST_MEM, ESP_PD_OPTION_ON);
    esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_SLOW_MEM, ESP_PD_OPTION_ON);
    esp_deep_sleep_start();
}


void pulsePattern(int pattern, int strength) {
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
        case 3:
            // hullabaloo caneck caneck
            digitalWrite(VIBRATION_PIN, HIGH); // hul
            delay(100);
            digitalWrite(VIBRATION_PIN, LOW);
            delay(100);
            digitalWrite(VIBRATION_PIN, HIGH); // a
            delay(100);
            digitalWrite(VIBRATION_PIN, LOW);
            delay(100);
            digitalWrite(VIBRATION_PIN, HIGH); // ba
            delay(100);
            digitalWrite(VIBRATION_PIN, LOW);
            delay(100);
            digitalWrite(VIBRATION_PIN, HIGH); // loo
            delay(100);
            digitalWrite(VIBRATION_PIN, LOW);
            delay(500);
            digitalWrite(VIBRATION_PIN, HIGH); // ca
            delay(100);
            digitalWrite(VIBRATION_PIN, LOW);
            delay(100);
            digitalWrite(VIBRATION_PIN, HIGH); // neck
            delay(100);
            digitalWrite(VIBRATION_PIN, LOW);
            delay(500);
            digitalWrite(VIBRATION_PIN, HIGH); // ca
            delay(100);
            digitalWrite(VIBRATION_PIN, LOW);
            delay(100);
            digitalWrite(VIBRATION_PIN, HIGH); // neck
            delay(100);
            digitalWrite(VIBRATION_PIN, LOW);
            delay(100);

            break;
        case 4:
            // 5 even shorter pulses
            for (int i = 0; i < 5; i++) {
                digitalWrite(VIBRATION_PIN, HIGH);
                delay(200);
                digitalWrite(VIBRATION_PIN, LOW);
                delay(200);
            }
            break;
        case 5:
            // 3 long pulses
            for (int i = 0; i < 3; i++) {
                digitalWrite(VIBRATION_PIN, HIGH);
                delay(800);
                digitalWrite(VIBRATION_PIN, LOW);
                delay(200);
            }
            break;
        case 6: 
            // case 6 used for violation indication (when phone is too close)
            switch(strength) {
                case 1:
                    // buzz for 25% of the time
                    digitalWrite(VIBRATION_PIN, HIGH);
                    delay(100);
                    digitalWrite(VIBRATION_PIN, LOW);
                    delay(300);
                case 2:
                    // buzz for 50% of the time
                    digitalWrite(VIBRATION_PIN, HIGH);
                    delay(200);
                    digitalWrite(VIBRATION_PIN, LOW);
                    delay(200);
                case 3:
                    // buzz for 75% of the time
                    digitalWrite(VIBRATION_PIN, HIGH);
                    delay(300);
                    digitalWrite(VIBRATION_PIN, LOW);
                    delay(100);
                case 4:
                    // buzz for 100% of the time
                    digitalWrite(VIBRATION_PIN, HIGH);
                    delay(400);
            }
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
    BLEDevice::init("VibeWrist"); // Initialize BLE
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
