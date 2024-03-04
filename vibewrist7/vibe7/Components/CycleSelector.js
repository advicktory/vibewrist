import React,{useState} from 'react';
import { Autocomplete, TextInput } from 'react-native-paper';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';


const CycleSelector = () => {
    const [selectedCycle, setSelectedCycle] = useState(null);
    const [open, setOpen] = useState(false);
    const items = [
      { label: 'Pomodoro Method', value: 'pomodoro' },
      { label: '45-15', value: '45-15' },
      { label: 'Recommended', value: 'recommended' }
    ];
  
    return (
      // <Text>Hello World</Text>
      <DropDownPicker
        open={open}
        value={selectedCycle}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedCycle}
        placeholder="Select a Study Cycle"
        onChangeItem={(item) => setSelectedCycle(item.value)}
        containerStyle={styles.dropDownContainer}
  
      />
    );
  };
  const styles= StyleSheet.create({
    cycleSelectorContainer: {
        width:300, // Adjust as needed
        // marginTop: 20, // Add space between the search bar and the button
      },
      dropDownContainer: {
        width:300
        // borderWidth: 1,
        // borderColor: '#ccc',
        // borderRadius: 8,
      },
  })

export default CycleSelector;
