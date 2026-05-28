import React, { useMemo } from 'react';
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

interface AvatarProps {
  size?: number;
  uri?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  style?: StyleProp<ViewStyle>;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 72,
  uri,
  firstName,
  lastName,
  style,
}) => {
  const initials = useMemo(() => {
    const first = firstName?.trim()?.[0] ?? '';
    const last = lastName?.trim()?.[0] ?? '';
    return `${first}${last}`.toUpperCase() || 'LT';
  }, [firstName, lastName]);

  return (
    <View style={[styles.base, { width: size, height: size, borderRadius: size / 2 }, style]}>
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent,
  },
  initials: {
    fontWeight: '700',
    color: colors.primary,
    fontSize: 16,
  },
});
