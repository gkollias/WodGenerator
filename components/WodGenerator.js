import { React, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Platform, ToastAndroid } from 'react-native';
import { generateWorkout } from '../utils/workoutGeneratorUtils';
import { saveWorkout } from '../utils/workoutStorageUtils';
import WorkoutDisplay from './WorkoutDisplay';

const WodGenerator = ({ equipment, route }) => {
  const [wodDescription, setWodDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'
  
  // Check if we're loading a saved workout
  const savedWorkout = route?.params?.savedWorkout;
  
  // Generate workout with useCallback to avoid unnecessary recreations
  const createWorkout = useCallback(() => {
    setIsLoading(true);
    
    // Simulate a slight delay for UX purposes
    setTimeout(() => {
      try {
        // If we have a saved workout, use that instead of generating a new one
        if (savedWorkout) {
          setWodDescription(savedWorkout);
        } else {
          const newWorkout = generateWorkout(equipment, difficulty);
          setWodDescription(newWorkout);
        }
      } catch (error) {
        console.error('Error generating workout:', error);
        Alert.alert(
          'Workout Generation Error',
          'There was a problem creating your workout. Please try again.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [equipment, difficulty, savedWorkout]);

  // Initial workout generation
  useEffect(() => {
    createWorkout();
  }, [createWorkout]);

  // Handle workout regeneration
  const handleRegenerate = () => {
    // Clear saved workout reference if regenerating
    if (route?.params?.savedWorkout) {
      route.params.savedWorkout = null;
    }
    createWorkout();
  };

  // Handle workout saving
  const handleSaveWorkout = async () => {
    const success = await saveWorkout(wodDescription);
    
    if (success) {
      if (Platform.OS === 'android') {
        // Use ToastAndroid on Android
        if (ToastAndroid) {
          ToastAndroid.show('Workout saved!', ToastAndroid.SHORT);
        } else {
          Alert.alert('Success', 'Workout saved!');
        }
      } else {
        // Use Alert on iOS and other platforms
        Alert.alert('Success', 'Workout saved successfully!');
      }
    } else {
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c669f" />
        <View style={styles.loadingTextContainer}>
          {savedWorkout ? (
            <Text style={styles.loadingText}>Loading saved workout...</Text>
          ) : (
            <Text style={styles.loadingText}>Generating your workout...</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WorkoutDisplay 
        workout={wodDescription}
        onRegenerate={handleRegenerate}
        onSave={handleSaveWorkout} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingTextContainer: {
    marginTop: 15,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default WodGenerator;