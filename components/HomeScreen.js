import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => (
  <LinearGradient
    colors={['#4c669f', '#3b5998', '#192f6a']}
    style={styles.background}
  >
    <View style={styles.container}>
      <Image 
        source={require('../assets/app-logo.png')} 
        style={styles.logo}
      />
      <Text style={styles.title}>WOD Generator</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Equipment')}
      >
        <Text style={styles.buttonText}>Create Workout</Text>
      </TouchableOpacity>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;