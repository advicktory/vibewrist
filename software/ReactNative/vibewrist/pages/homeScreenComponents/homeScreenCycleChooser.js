import { useState } from 'react';
// import { View, Text, Button } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';

export default function cycleLengthSelector() {
  const [studyLengthSelected, setStudyLengthSelected] = useState([]);
  const [breakLengthSelected, setBreakLengthSelected] = useState([]);
  const [cycleAmountSelected, setCycleAmountSelected] = useState([]);

  const studyOptions = [
    { key: 0, value: 'None' },
    { key: 15, value: 15 },
    { key: 30, value: 30 },
    { key: 45, value: 45 },
    { key: 60, value: 60 },
  ];
  const breakOptions = [
    { key: 0, value: 'None' },
    { key: 15, value: 15 },
    { key: 30, value: 30 },
    { key: 45, value: 45 },
    { key: 60, value: 60 },
  ];
  const cycleOptions = [
    { key: 0, value: 'None' },
    { key: 1, value: 1 },
    { key: 2, value: 2 },
    { key: 3, value: 3 },
    { key: 4, value: 4 },
  ];

  return {
    cycleOptions: (
      <>
        <SelectList
          setSelected={(val) => setStudyLengthSelected(val)}
          data={studyOptions}
          search={false}
          placeholder="Study Length"
          save="key"
        />
        <SelectList
          setSelected={(val) => setBreakLengthSelected(val)}
          data={breakOptions}
          search={false}
          placeholder="Break Length"
          save="key"
        />
        <SelectList
          setSelected={(val) => setCycleAmountSelected(val)}
          data={cycleOptions}
          search={false}
          placeholder="How many Cycles?"
          save="key"
        />
      </>
    ),
    cycleOptionResponces: [
      studyLengthSelected,
      breakLengthSelected,
      cycleAmountSelected,
    ],
  };
}
