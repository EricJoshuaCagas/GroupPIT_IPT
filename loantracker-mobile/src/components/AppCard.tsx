import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { radius, shadow, spacing } from '../theme/metrics';

interface AppCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({ children, style, padded = true }) => (
  <View style={[styles.card, padded ? styles.padded : undefined, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.xs,
    overflow: 'hidden',
  },
  padded: {
    padding: spacing.md,
  },
});
