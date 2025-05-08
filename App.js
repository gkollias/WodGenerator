import { React, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';

// Import screens
import WodGenerator from './components/WodGenerator';
import HomeScreen from './components/HomeScreen';
import EquipmentScreen from './components/EquipmentScreen';
import CreditsScreen from './components/CreditsScreen';
import SavedWorkoutsScreen from './components/SavedWorkoutsScreen';
import WorkoutDetailScreen from './components/WorkoutDetailScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
});

const Stack = createStackNavigator();

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
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4c669f',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Equipment" 
          component={EquipmentScreen} 
          options={{
            title: 'Select Equipment',
            headerTitleAlign: 'center',
            headerLeft: (props) => (
              <FontAwesome5
                name="arrow-left"
                size={20}
                color="white"
                style={{ marginLeft: 15 }}
                onPress={props.onPress}
              />
            ),
          }}
        />
        <Stack.Screen 
          name="Workout" 
          component={WorkoutScreen} 
          options={{
            title: 'Your Workout',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen 
          name="Credits" 
          component={CreditsScreen} 
          options={{
            title: 'About & Credits',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="SavedWorkouts" 
          component={SavedWorkoutsScreen} 
          options={{
            title: 'Saved Workouts',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen 
          name="WorkoutDetail" 
          component={WorkoutDetailScreen} 
          options={{
            title: 'Workout Details',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}