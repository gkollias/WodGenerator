import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg from 'react-native-svg';

import Barbell from '../assets/icons/barbell.svg';
import Dumbbell from '../assets/icons/dumbbell.svg';
import Dumbbells from '../assets/icons/dumbbells.svg';
import Kettlebell from '../assets/icons/kettlebell.svg';
import Box from '../assets/icons/jump-box.svg';
import Rings from '../assets/icons/gymnastic-rings.svg';
import MedicineBall from '../assets/icons/medicine-ball.svg';
import JumpRope from '../assets/icons/skipping-rope.svg';

const ICONS = {
  Barbell,
  Dumbbell,
  Dumbbells,
  Kettlebell,
  Box,
  Rings,
  MedicineBall,
  JumpRope,
};


const EquipmentScreen = ({ navigation }) => {
  const [selectedEquipment, setSelectedEquipment] = useState([]);

  const equipment = [
    { name: 'Barbell', icon: 'Barbell' },
    { name: 'Dumbbell', icon: 'Dumbbell' },
    { name: 'Dumbbells', icon: 'Dumbbells' },
    { name: 'Kettlebell', icon: 'Kettlebell' },
    { name: 'Box', icon: 'Box' },
    { name: 'Rings', icon: 'Rings' },
    { name: 'Medicine Ball', icon: 'MedicineBall' },
    { name: 'Jump Rope', icon: 'JumpRope' },
  ];

  const toggleEquipment = (singleEquipment) => {
    if (selectedEquipment.includes(singleEquipment)) {
      setSelectedEquipment(selectedEquipment.filter(t => t !== singleEquipment));
    } else {
      setSelectedEquipment([...selectedEquipment, singleEquipment]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {equipment.map((item, index) => {
    const SvgIcon = ICONS[item.icon]; // Dynamically load the SVG component
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.equipmentButton,
          selectedEquipment.includes(item.name) && styles.selectedEquipment,
        ]}
      onPress={() => toggleEquipment(item.name)}
    >
      <SvgIcon
        width={36}
        height={36}
        fill={selectedEquipment.includes(item.name) ? 'white' : '#333'}
      />
      <Text
        style={[
          styles.equipmentText,
          selectedEquipment.includes(item.name) && styles.selectedEquipmentText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
})}

      </ScrollView>
      <TouchableOpacity
        style={styles.generateButton}
        onPress={() =>
          navigation.navigate('Workout', { equipment: selectedEquipment })
        }
      >
        <Text style={styles.generateButtonText}>Generate Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  equipmentButton: {
    width: '45%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  selectedEquipment: {
    backgroundColor: '#4c669f',
  },
  equipmentText: {
    marginTop: 5,
    color: '#333',
    fontSize: 14,
  },
  selectedEquipmentText: {
    color: 'white',
  },
  generateButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    margin: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EquipmentScreen;

    // { name: 'Rowing Machine', icon: 'RowingMachine' },
    // { name: 'Bench', icon: 'Bench' },
    // { name: 'GHD', icon: 'GHD' },
    // { name: 'Bicycle', icon: 'Bicycle' },
    // { name: 'Swimming Pool', icon: 'SwimmingPool' },
    // { name: 'Weighted Sled', icon: 'WeightedSled' },
    // { name: 'Rope', icon: 'Rope' },