#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <esp_sleep.h>
// #include <EEPROM> //used for writing to flash memory, to maintain certain information

#define LED_PIN_1 32 // TODO: change this and add different pins for different LEDs
#define LED_PIN_2 33 // TODO: use actual GPIO pin
#define LED_PIN_3 34 // TODO: use actual GPIO pin
#define VIBRATION_PIN 32
#define BUTTON_PIN 4 // button used to wake up the esp32

#define SERVICE_UUID           "7A0247E7-8E88-409B-A959-AB5092DDB03E"
#define CHARACTERISTIC_UUID    "82258BAA-DF72-47E8-99BC-B73D7ECD08A5"

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
BLEDescriptor *pDescr;
BLE2902 *pBLE2902;
bool deviceConnected = false;
int connectAttempts = 0;

class MyServerCallbacks: public BLEServerCallbacks { // basically overrides for preexisting functions
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
    }
};

bool detectProximity() {
    // TODO: Placeholder implementation, replace actual proxmity detection later
    return false;
}

uint64_t minutesToMicroseconds(int minutes) {
    return (uint64_t)minutes * 60 * 1000000;
}

void runSession(int durationMinutes) {
    pulsePattern(1);
    // Calculate duration in milliseconds
    unsigned long durationMillis = durationMinutes * 60 * 1000;

    // Calculate time intervals for turning on LEDs
    unsigned long oneThirdTime = durationMillis / 3;
    unsigned long twoThirdsTime = 2 * oneThirdTime;

    // Initialize violations count
    int violations = 0;

    // Start time of the session
    unsigned long sessionStartTime = millis();

    // Loop until the session duration elapses
    while (millis() - sessionStartTime < durationMillis) {
        // Run detectProximity function every 5 seconds
        if ((millis() - sessionStartTime) % 5000 == 0) {
            if (detectProximity()) {
                // Increment violations count if proximity is detected
                violations++;
            }
        }

        // Check if 1/3 of the session is complete
        if (millis() - sessionStartTime >= oneThirdTime) {
            digitalWrite(LED_PIN_1, HIGH);
        }

        // Check if 2/3 of the session is complete
        if (millis() - sessionStartTime >= twoThirdsTime) {
            // Turn on LEDs to indicate 2/3 completion
            digitalWrite(LED_PIN_2, HIGH);
        }
    }
    pCharacteristic->setValue(String(violations).c_str());
    pCharacteristic->notify();
    // Turn on LEDs to indicate completion of the session
    digitalWrite(LED_PIN_3, HIGH);
    pulsePattern(2);
}

void buttonInterruptHandler() {
  // This function is called to wake up the ESP32 from deep sleep when the button is presseD
  // esp_deep_sleep_pd_config(ESP_PD_DOMAIN_RTC_PERIPH, ESP_PD_OPTION_ON);
  // esp_deep_sleep_pd_config(ESP_PD_DOMAIN_RTC_FAST_MEM, ESP_PD_OPTION_ON);
  // esp_deep_sleep_pd_config(ESP_PD_DOMAIN_RTC_SLOW_MEM, ESP_PD_OPTION_ON);
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
        esp_sleep_enable_timer_wakeup(minutesToMicroseconds(off));
        // Enter deep sleep mode
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
                delay(100);
                digitalWrite(VIBRATION_PIN, LOW);
                delay(100);
            }
            break;
        // Add more cases for additional patterns
        default:
            // Default behavior if an invalid pattern is provided
            Serial.println("Invalid pattern");
            break;
    }
    String txValue = String(random(1000));
    pCharacteristic->setValue(txValue.c_str());
    Serial.println("Characteristic 2 (setValue): " + txValue);
    pCharacteristic->notify();
}


void setup() {
    connectAttempts = 0;
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), buttonInterruptHandler, FALLING);
    pinMode(LED_PIN_1, OUTPUT);
    pinMode(LED_PIN_2, OUTPUT);
    pinMode(LED_PIN_3, OUTPUT);
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
    pDescr->setValue("A very interesting variable");
    pCharacteristic->addDescriptor(pDescr);

    pBLE2902 = new BLE2902();
    pBLE2902->setNotifications(true);
    pCharacteristic->addDescriptor(pBLE2902);

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
        Serial.print("Original value: ");
        Serial.println(value.c_str());
        // Convert std::string to String
        String stringValue(value.c_str());
        // Print the converted value
        Serial.print("Converted value: ");
        Serial.println(stringValue);
        // Process the value
        processString(stringValue);
        delay(5000); // every 5 seconds, scan for update to value and process it
    }


    else {
        delay(500); // give the bluetooth stack the chance to get things ready
        pServer->startAdvertising(); // restart advertising
        Serial.println("No device connected, advertising");
        // if a device does not connect within 30 seconds, go into deep sleep mode
        if (connectAttempts == 60) {
          // esp_deep_sleep_start();
          Serial.println("deep sleep... zzz");
        }
    }
}
