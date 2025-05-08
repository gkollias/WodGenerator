import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

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

// Define related equipment that should be auto-selected
const RELATED_EQUIPMENT = {
  'Dumbbells': ['Dumbbell']
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
    let newSelectedEquipment;
    
    if (selectedEquipment.includes(singleEquipment)) {
      // Deselect the equipment
      newSelectedEquipment = selectedEquipment.filter(t => t !== singleEquipment);
      
      // If there are related equipment items, keep them if they were independently selected
      // This is a more sophisticated approach that you might want to customize
    } else {
      // Select the equipment
      newSelectedEquipment = [...selectedEquipment, singleEquipment];
      
      // Auto-select related equipment
      if (RELATED_EQUIPMENT[singleEquipment]) {
        RELATED_EQUIPMENT[singleEquipment].forEach(related => {
          if (!newSelectedEquipment.includes(related)) {
            newSelectedEquipment.push(related);
          }
        });
      }
    }
    
    setSelectedEquipment(newSelectedEquipment);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Select Available Equipment</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {equipment.map((item, index) => {
          const SvgIcon = ICONS[item.icon];
          const isSelected = selectedEquipment.includes(item.name);
          
          // Check if this equipment is auto-selected due to a relationship
          const isAutoSelected = !isSelected && 
            selectedEquipment.some(selected => 
              RELATED_EQUIPMENT[selected] && 
              RELATED_EQUIPMENT[selected].includes(item.name)
            );
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.equipmentButton,
                isSelected && styles.selectedEquipment,
                isAutoSelected && styles.autoSelectedEquipment,
              ]}
              onPress={() => toggleEquipment(item.name)}
            >
              <SvgIcon
                width={36}
                height={36}
                fill={isSelected || isAutoSelected ? 'white' : '#333'}
              />
              <Text
                style={[
                  styles.equipmentText,
                  isSelected && styles.selectedEquipmentText,
                  isAutoSelected && styles.autoSelectedEquipmentText,
                ]}
              >
                {item.name}
              </Text>
              {isAutoSelected && (
                <Text style={styles.autoSelectedLabel}>Auto-selected</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.generateButton,
          selectedEquipment.length === 0 && styles.disabledButton
        ]}
        disabled={selectedEquipment.length === 0}
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
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: 'relative',
  },
  selectedEquipment: {
    backgroundColor: '#4c669f',
  },
  autoSelectedEquipment: {
    backgroundColor: '#6d87cc', // Lighter blue to indicate auto-selection
  },
  equipmentText: {
    marginTop: 10,
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedEquipmentText: {
    color: 'white',
  },
  autoSelectedEquipmentText: {
    color: 'white',
  },
  autoSelectedLabel: {
    position: 'absolute',
    bottom: 5,
    fontSize: 10,
    color: '#ffe6e6',
  },
  generateButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    margin: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EquipmentScreen;