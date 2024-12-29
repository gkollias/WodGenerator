import { React, useState } from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import WodGenerator from './components/WodGenerator';
import HomeScreen from './components/HomeScreen';
import EquipmentScreen from './components/EquipmentScreen';

const Stack = createStackNavigator();

// const HomeScreen = ({ navigation }) => (
//   <LinearGradient
//     colors={['#4c669f', '#3b5998', '#192f6a']}
//     style={styles.background}
//   >
//     <View style={styles.container}>
//       <Image 
//         source={require('../assets/app-logo.png')} 
//         style={styles.logo}
//       />
//       <Text style={styles.title}>WOD Generator</Text>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => navigation.navigate('Equipment')}
//       >
//         <Text style={styles.buttonText}>Create Workout</Text>
//       </TouchableOpacity>
//     </View>
//   </LinearGradient>
// );

// const EquipmentScreen = ({ navigation }) => (
//   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//     <Text>Equipment Screen</Text>
//     <Button
//       title="Go to Workout"
//       onPress={() => navigation.navigate('Workout', {equipment : ["Barbell", "Dumbbell"]})}
//     />
//   </View>
// );

  // const EquipmentScreen = ({ navigation }) => {
  //   const [selectedEquipment, setSelectedEquipment] = useState([]);

  //   const equipment = ['Barbell', 'Bench', 'Dumbbells', 'Dumbbell', 'Rings', 'Rope', 'Pull-up Bar', 'Rowing Machine', 'Jump Rope', 'Bicycle or Stationary Bike', 'Swimming Pool', 'Ski Ergometer', 'Box', 'Medicine Ball', 'Kettlebell', 'GHD', 'Weighted Sled'];

  //   const toggleEquipment = (singleEquipment) => {
  //     if (selectedEquipment.includes(singleEquipment)) {
  //       setSelectedEquipment(selectedEquipment.filter(t => t !== singleEquipment));
  //     } else {
  //       setSelectedEquipment([...selectedEquipment, singleEquipment]);
  //     }
  //   };

  //   console.log(selectedEquipment);

  //   return (
  //     <View style={{flex: 1}}>
  //       <ScrollView pagingEnabled={false}>
  //         <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
  //           {equipment.map((singleEquipment, index) => (
  //             <TouchableOpacity 
  //               key={index} 
  //               style={[styles.singleEquipment, selectedEquipment.includes(singleEquipment) && styles.selectedSingleEquipment]} 
  //               onPress={() => toggleEquipment(singleEquipment)}
  //             >
  //               <Text style={styles.singleEquipmentText}>{singleEquipment}</Text>
  //             </TouchableOpacity>
  //           ))}
  //         </View>
  //         <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
  //           <Button
  //             title="Generate Workout"
  //             onPress={() => navigation.navigate('Workout', {equipment: selectedEquipment})}
  //           />
  //         </View>
  //       </ScrollView>
  //     </View>
  //   );
  // };

const WorkoutScreen = ({ route }) => {
  const { equipment } = route.params;
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <WodGenerator equipment={equipment}/>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Equipment" component={EquipmentScreen} />
        <Stack.Screen name="Workout" component={WorkoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10
  },
  singleEquipment: {
    width: '30%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#ccc',
  },
  selectedSingleEquipment: {
    backgroundColor: '#6c3',
  },
  singleEquipmentText: {
    color: '#333',
    fontSize: 16,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});
