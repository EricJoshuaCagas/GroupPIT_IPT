import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';
import { AppButton, AppCard, AppHeader, AppInput, Avatar, Screen } from '../components';
import { radius, spacing } from '../theme/metrics';

export const ProfileScreen: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    age: user?.age ? String(user.age) : '',
    birthday: user?.birthday ?? '',
    address: user?.address ?? '',
  });

  useEffect(() => {
    if (!editing) {
      setForm({
        first_name: user?.first_name ?? '',
        last_name: user?.last_name ?? '',
        age: user?.age ? String(user.age) : '',
        birthday: user?.birthday ?? '',
        address: user?.address ?? '',
      });
    }
  }, [editing, user]);

  const hasChanges = useMemo(
    () =>
      form.first_name !== (user?.first_name ?? '') ||
      form.last_name !== (user?.last_name ?? '') ||
      form.age !== (user?.age ? String(user.age) : '') ||
      form.birthday !== (user?.birthday ?? '') ||
      form.address !== (user?.address ?? ''),
    [form, user]
  );

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setFeedback('');
    try {
      await updateProfile({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        age: form.age ? Number(form.age) : null,
        birthday: form.birthday || null,
        address: form.address.trim(),
      });
      setFeedback('Profile updated successfully.');
      setEditing(false);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      if (detail) {
        setError(detail);
      } else {
        const data = err?.response?.data;
        if (data && typeof data === 'object') {
          const firstField = Object.keys(data)[0];
          const value = firstField ? data[firstField] : null;
          if (Array.isArray(value) && value.length > 0) {
            setError(String(value[0]));
          } else if (typeof value === 'string') {
            setError(value);
          } else {
            setError('Could not update profile right now.');
          }
        } else {
          setError('Could not update profile right now.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Screen style={styles.screen}>
        <View style={styles.loadingFallback}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll style={styles.screen} contentContainerStyle={styles.content}>
      <AppHeader title="Profile" subtitle="Manage your account details and personal information." />

      <AppCard style={styles.profileTop}>
        <Avatar
          size={84}
          uri={user.profile_image}
          firstName={user.first_name}
          lastName={user.last_name}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </AppCard>

      <AppCard>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <AppButton
            title={editing ? 'Cancel' : 'Edit'}
            variant="ghost"
            onPress={() => {
              setEditing((prev) => !prev);
              setError('');
              setFeedback('');
            }}
            style={styles.editButton}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {feedback ? <Text style={styles.success}>{feedback}</Text> : null}

        <AppInput
          label="First name"
          value={form.first_name}
          onChangeText={(value) => handleChange('first_name', value)}
          editable={editing}
        />
        <AppInput
          label="Last name"
          value={form.last_name}
          onChangeText={(value) => handleChange('last_name', value)}
          editable={editing}
        />
        <AppInput label="Email" value={user.email} editable={false} />
        <AppInput
          label="Age"
          value={form.age}
          onChangeText={(value) => handleChange('age', value.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          editable={editing}
        />
        <AppInput
          label="Birthday (YYYY-MM-DD)"
          value={form.birthday}
          onChangeText={(value) => handleChange('birthday', value)}
          editable={editing}
        />
        <AppInput
          label="Address"
          value={form.address}
          onChangeText={(value) => handleChange('address', value)}
          editable={editing}
          multiline
        />

        {editing ? (
          <AppButton
            title={loading ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            loading={loading}
            disabled={!hasChanges}
          />
        ) : null}
      </AppCard>

      <View style={styles.logoutWrap}>
        <AppButton title="Logout" variant="danger" onPress={logout} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  loadingFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    color: colors.textSecondary,
  },
  profileTop: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderRadius: 20,
    backgroundColor: '#F0FFFE',
  },
  avatar: {
    marginBottom: spacing.sm,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: spacing.md,
  },
  email: {
    color: colors.textSecondary,
    marginTop: 4,
    fontSize: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  editButton: {
    width: 92,
    minHeight: 40,
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
  logoutWrap: {
    marginTop: spacing.xs,
  },
});
