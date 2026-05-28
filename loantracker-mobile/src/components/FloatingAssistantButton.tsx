import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { shadow, spacing } from '../theme/metrics';

interface FloatingAssistantButtonProps {
  onPress: () => void;
  bottom: number;
  right?: number;
}

export const FloatingAssistantButton: React.FC<FloatingAssistantButtonProps> = ({
  onPress,
  bottom,
  right = spacing.lg,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animate = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  };

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          styles.wrapper,
          {
            bottom,
            right,
            transform: [{ scale }],
          },
        ]}
      >
        <Pressable
          onPress={onPress}
          onPressIn={() => animate(0.96)}
          onPressOut={() => animate(1)}
          style={({ pressed }) => [styles.button, pressed ? styles.pressed : undefined]}
        >
          <MaterialCommunityIcons name="robot-happy" size={28} color={colors.white} />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.lg,
  },
  pressed: {
    opacity: 0.8,
  },
});
