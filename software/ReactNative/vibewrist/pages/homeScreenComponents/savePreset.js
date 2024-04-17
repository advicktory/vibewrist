import React, { useState } from "react";
import { View, StyleSheet, Button, Modal, TextInput,Image,TouchableOpacity,Text } from "react-native";

export default function NewPresetCycleButton(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [preset, setPreset] = useState([]);
  // Define additional states for studyLengthSelected, breakLengthSelected, and cycleAmountSelected


  const handleSavePreset = () => {
    // Handle saving the new preset cycle with the name `newPresetName`
    // and the selected options
    const newPreset = {
      key: preset.length,
      value: newPresetName,
      studyLength: props.studyLengthSelected,
      breakLength: props.breakLengthSelected,
      cycleAmount: props.cycleAmountSelected,
    };
    // Update the preset state to include the new preset
    setPreset([...preset, newPreset]);
    
    
    // Close the modal after saving
    setModalVisible(false);
    // Reset the input field
    setNewPresetName("");
    console.log("New preset data:", newPreset);
    props.onUpdatePreset(newPreset);

  };
  

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Image
                    source={require("./../../assets/close.png")}
                    style={styles.imageStyle}
                />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Enter Custom Cycle Name"
              placeholderTextColor="black" 
              value={newPresetName}
              onChangeText={setNewPresetName}
            />
            <Button title="Save Preset" onPress={handleSavePreset} />
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.customCycleButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.customCycleButtonText}>Set Custom Cycle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    // color:"black",
  },
  imageStyle:{
    width:20,
    height:20,
    position: "relative",
    bottom:10,
    right:13,

  },
  customCycleButton: {
    // backgroundColor:'#0066ff',
    backgroundColor:"#1c1b1d",

    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  customCycleButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
