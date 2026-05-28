import React, { useState } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/metrics';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  secureTextEntry,
  containerStyle,
  inputStyle,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = Boolean(secureTextEntry);
  const isEditable = props.editable !== false;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputShell, !isEditable ? styles.readOnly : undefined, error ? styles.inputShellError : undefined]}>
        <TextInput
          {...props}
          secureTextEntry={isPassword && !showPassword}
          style={[styles.input, inputStyle]}
          placeholderTextColor={colors.textSecondary}
        />
        {isPassword && isEditable ? (
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.toggleButton}
            hitSlop={8}
          >
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              color={colors.textSecondary}
              size={20}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    letterSpacing: -0.3,
  },
  inputShell: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    minHeight: 50,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputShellError: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(239, 68, 68, 0.02)',
  },
  readOnly: {
    backgroundColor: '#F1F5F9',
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    paddingVertical: spacing.sm,
    fontWeight: '500',
  },
  toggleButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  error: {
    marginTop: 5,
    color: colors.danger,
    fontSize: 12,
  },
});
