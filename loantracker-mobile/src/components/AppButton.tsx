import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/metrics';

type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: AppButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  compact?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
  compact = false,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const isDisabled = disabled || loading;

  const animatePress = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 35,
      bounciness: 5,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animatePress(0.98)}
        onPressOut={() => animatePress(1)}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.buttonBase,
          compact ? styles.buttonCompact : undefined,
          variantStyles[variant],
          isDisabled ? styles.disabled : undefined,
          pressed && !isDisabled ? styles.pressed : undefined,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'ghost' ? colors.primary : colors.white} />
        ) : (
          <Text style={[styles.label, textVariantStyles[variant], textStyle]}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
});

const textVariantStyles = StyleSheet.create({
  primary: {
    color: colors.white,
  },
  secondary: {
    color: colors.textPrimary,
  },
  ghost: {
    color: colors.primary,
  },
  danger: {
    color: colors.white,
  },
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  buttonBase: {
    minHeight: 50,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  buttonCompact: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.65,
  },
});
