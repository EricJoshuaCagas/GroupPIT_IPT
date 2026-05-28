import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';
import { API_BASE_URL } from '../config';
import { AppButton, AppCard, AppInput, Screen } from '../components';
import { radius, spacing } from '../theme/metrics';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      const serverMessage = err?.response?.data?.detail;
      const isNetworkError = !err?.response && (err?.message || '').toLowerCase().includes('network');
      if (isNetworkError) {
        setError(`Cannot reach server: ${API_BASE_URL}`);
      } else {
        setError(serverMessage || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.authCardWrap, isTablet ? styles.authCardWrapTablet : undefined]}>
          <AppCard style={styles.authCard}>
            <Text style={styles.brand}>LoanTracker</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue managing your loans.</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <AppInput
              label="Email"
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <AppInput
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <AppButton title={loading ? 'Signing In...' : 'Sign In'} onPress={handleLogin} loading={loading} />
            <AppButton
              title="Create an account"
              variant="ghost"
              onPress={() => navigation.navigate('Register')}
              style={styles.linkButton}
            />
            <Text style={styles.networkHint}>Server: {API_BASE_URL}</Text>
          </AppCard>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  authCardWrap: {
    width: '100%',
    alignSelf: 'center',
  },
  authCardWrapTablet: {
    maxWidth: 520,
  },
  authCard: {
    borderRadius: 24,
    padding: spacing.xl,
  },
  brand: {
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 0.4,
    fontSize: 15,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  linkButton: {
    marginTop: spacing.sm,
  },
  networkHint: {
    marginTop: spacing.sm,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.sm,
    fontWeight: '600',
    fontSize: 13,
  },
});
