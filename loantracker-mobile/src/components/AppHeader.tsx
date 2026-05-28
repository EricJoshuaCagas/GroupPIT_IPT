import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/metrics';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, subtitle, right, style }) => (
  <View style={[styles.wrapper, style]}>
    <View style={styles.textGroup}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    {right ? <View>{right}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    lineHeight: 33,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
});
