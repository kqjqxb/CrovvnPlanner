import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Text, Image, Dimensions, PanResponder, ImageBackground, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear, 
        useNativeDriver: true,
      })
    ).start();
  }, [rotateValue]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });


  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Home');
    }, 2100);
  }, [])

  return (
    <ImageBackground
      resizeMode="stretch"
      source={require('../assets/images/loader.png')}
      style={{
        height: dimensions.height,
        width: dimensions.width,
        justifyContent: 'center', flex: 1, alignItems: 'center',
      }}
    >
      <Animated.Image
        resizeMode='contain'
        style={{
          width: dimensions.height * 0.05,
          height: dimensions.height * 0.05,
          transform: [{ rotate }],
        }}
        source={require('../assets/icons/loadingIcon.png')}
      />
    </ImageBackground>
  );
};

export default OnboardingScreen;