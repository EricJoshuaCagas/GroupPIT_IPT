import React, { createContext, useContext, useRef, useState } from 'react';
import { Animated } from 'react-native';

interface ScrollContextType {
  tabBarTranslateY: Animated.Value;
  onScroll: (event: any) => void;
  resetScroll: () => void;
  setTabBarHeight: (height: number) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const tabBarTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollYRef = useRef(0);
  const tabBarHeightRef = useRef(76);

  const onScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const lastScrollY = lastScrollYRef.current;
    
    const scrollDelta = currentScrollY - lastScrollY;
    lastScrollYRef.current = currentScrollY;

    if (Math.abs(scrollDelta) > 5) {
      if (scrollDelta > 0) {
        Animated.timing(tabBarTranslateY, {
          toValue: tabBarHeightRef.current,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(tabBarTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const resetScroll = () => {
    lastScrollYRef.current = 0;
    Animated.timing(tabBarTranslateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const setTabBarHeight = (height: number) => {
    tabBarHeightRef.current = height;
  };

  return (
    <ScrollContext.Provider value={{ tabBarTranslateY, onScroll, resetScroll, setTabBarHeight }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollAnimation = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollAnimation must be used within ScrollProvider');
  }
  return context;
};

