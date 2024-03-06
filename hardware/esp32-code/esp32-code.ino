#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
// #include <EEPROM> //used for writing to flash memory, to maintain certain information

#define LED_PIN 32
#define SERVICE_UUID           "7A0247E7-8E88-409B-A959-AB5092DDB03E"
#define CHARACTERISTIC_UUID    "82258BAA-DF72-47E8-99BC-B73D7ECD08A5"

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
BLEDescriptor *pDescr;
BLE2902 *pBLE2902;
bool deviceConnected = false;

class MyServerCallbacks: public BLEServerCallbacks { // basically overrides for preexisting functions
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
    }
};

void setup() {
    pinMode(LED_PIN, OUTPUT);
    Serial.begin(115200);
    BLEDevice::init("ESP32"); // Initialize BLE
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());

    // Create the BLE Service
    BLEService *pService = pServer->createService(SERVICE_UUID);

    // Create a BLE Characteristic
    pCharacteristic = pService->createCharacteristic(
                        CHARACTERISTIC_UUID,
                        BLECharacteristic::PROPERTY_NOTIFY |
                        BLECharacteristic::PROPERTY_READ |
                        BLECharacteristic::PROPERTY_WRITE
                      );                   

    // Create a BLE Descriptor
    pDescr = new BLEDescriptor((uint16_t)0x2901);
    pDescr->setValue("A very interesting variable");
    pCharacteristic->addDescriptor(pDescr);
    
    pBLE2902 = new BLE2902();
    pBLE2902->setNotifications(true);
    pCharacteristic->addDescriptor(pBLE2902);

    // Start the service
    pService->start();

    // Start advertising
    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(false);
    pAdvertising->setMinPreferred(0x0);  // set value to 0x00 to not advertise this parameter
    BLEDevice::startAdvertising(); // waiting for clients to connect at this point
    Serial.println("Waiting a client connection to notify...");
}

void loop() {
    if (deviceConnected) {
        // pCharacteristic->setValue((uint8_t*)1, 4); // (uint8_t* data, size_t size) accepts other fields tho, max of 20 bytes
        // pCharacteristic->notify(); ping connected client
        digitalWrite(LED_PIN, HIGH);
        // this is where i would receive packets and do something with the received data
        std::string rxValue = pCharacteristic->getValue();
        Serial.print("Characteristic 2 (getValue): ");
        Serial.println(rxValue.c_str());

        String txValue = "String with random value from Server: " + String(random(1000));
        pCharacteristic->setValue(txValue.c_str());
        Serial.println("Characteristic 2 (setValue): " + txValue);
        Serial.println("Device connected");
        delay(1000);
    }

    // disconnecting
    else {
        delay(500); // give the bluetooth stack the chance to get things ready
        pServer->startAdvertising(); // restart advertising
        Serial.println("No device connected, advertising");
        // send some sort of data back to the device indicating that the device is disconnected
        digitalWrite(LED_PIN, LOW);
    }
}
