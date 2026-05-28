import React, { useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';
import { AppButton, AppCard, AppInput, Screen } from '../components';
import { radius, spacing } from '../theme/metrics';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    re_password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const parseApiError = (err: any) => {
    const detail = err?.response?.data?.detail;
    if (detail) {
      return detail;
    }
    const data = err?.response?.data;
    if (data && typeof data === 'object') {
      const firstField = Object.keys(data)[0];
      const value = firstField ? data[firstField] : null;
      if (Array.isArray(value) && value.length > 0) {
        return String(value[0]);
      }
      if (typeof value === 'string') {
        return value;
      }
    }
    return 'Registration failed.';
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(form);
      setSuccess('Registration successful. Please check your email to activate.');
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll style={styles.screen} contentContainerStyle={styles.content}>
      <View style={[styles.cardWrap, isTablet ? styles.cardWrapTablet : undefined]}>
        <AppCard style={styles.card}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start tracking loans with a secure mobile workspace.</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}

          <AppInput
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(value) => handleChange('email', value)}
          />
          <AppInput
            label="First name"
            placeholder="First name"
            value={form.first_name}
            onChangeText={(value) => handleChange('first_name', value)}
          />
          <AppInput
            label="Last name"
            placeholder="Last name"
            value={form.last_name}
            onChangeText={(value) => handleChange('last_name', value)}
          />
          <AppInput
            label="Password"
            placeholder="Create password"
            secureTextEntry
            value={form.password}
            onChangeText={(value) => handleChange('password', value)}
          />
          <AppInput
            label="Confirm password"
            placeholder="Repeat password"
            secureTextEntry
            value={form.re_password}
            onChangeText={(value) => handleChange('re_password', value)}
          />

          <AppButton title={loading ? 'Creating Account...' : 'Create Account'} onPress={handleRegister} loading={loading} />
          <AppButton
            title="Back to Sign In"
            variant="ghost"
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          />
        </AppCard>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    justifyContent: 'center',
    minHeight: '100%',
  },
  cardWrap: {
    width: '100%',
    alignSelf: 'center',
  },
  cardWrapTablet: {
    maxWidth: 540,
  },
  card: {
    borderRadius: 24,
    padding: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  backButton: {
    marginTop: spacing.sm,
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  success: {
    color: colors.success,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
});
