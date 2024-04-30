import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Button,
  Modal,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { useUser } from '../UserContext';

const GoalTimeModal = ({ isVisible, onClose, onSave }) => {
  const [selectedTime, setSelectedTime] = useState(''); // State to store selected goal time
  const user = useUser();

  const updateGoal = async (username, newGoal) => {
    try {
      const response = await fetch('http://10.229.10.189:3000/updateGoal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          newGoal: newGoal,
        }),
      });

      if (response.ok) {
        console.log('Goal updated successfully');
      } else {
        const errorText = await response.text();
        console.error('Failed to update goal:', errorText);
      }
    } catch (error) {
      console.error('Network or other error:', error);
    }
  };

  const handleSaveGoalTime = () => {
    // Save the selected goal time and call the onSave function passed as prop
    onSave(selectedTime);
    //setSelectedTime(''); // Clear the selected time
    updateGoal(user.getUserName(), Number(selectedTime));
    user.setUserGoalTime(selectedTime);
    //user.setUserGoalTime(selectedTime);
    onClose(); // Close the modal
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>Select your goal time:</Text>
          {/* Example: TextInput to allow users to input their goal time */}
          <TextInput
            style={styles.input}
            placeholder="Enter your goal time (e.g., 60 minutes)"
            value={selectedTime}
            onChangeText={setSelectedTime}
          />
          {/* Button to save the selected goal time */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveGoalTime}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '80%',
  },
  saveButton: {
    backgroundColor: '#007AFF', // Default color
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GoalTimeModal;
