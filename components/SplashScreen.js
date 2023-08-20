import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      // Navigate to other screen after splash
      navigation.navigate('Home');
    }, 2000);
    
    // Cleanup function to clear the timeout
    return () => clearTimeout(timer);
  }, []);

  return (
    visible ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Splash Screen</Text>
      </View>
    ) : null
  );
};

export default SplashScreen;