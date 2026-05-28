import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useScrollAnimation } from '../contexts/ScrollContext';
import { AppCard, AppHeader, AppButton, AppInput, Screen } from '../components';
import { borrowerApi } from '../services/api';
import { Borrower } from '../types';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/metrics';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const BorrowersScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const { onScroll } = useScrollAnimation();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    contact_number: '',
    email: '',
    address: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBorrowers = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const response = await borrowerApi.getAll();
      setBorrowers(response.data?.results ?? []);
    } catch (err) {
      setError('Could not load borrowers right now.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBorrowers();
  }, [fetchBorrowers]);

  const filteredBorrowers = useMemo(() => {
    if (!searchQuery.trim()) return borrowers;
    const query = searchQuery.toLowerCase();
    return borrowers.filter(
      (b) =>
        b.full_name.toLowerCase().includes(query) ||
        b.email.toLowerCase().includes(query) ||
        b.contact_number.includes(query)
    );
  }, [borrowers, searchQuery]);

  const handleOpenForm = (borrower?: Borrower) => {
    if (borrower) {
      setFormData(borrower);
      setEditingId(borrower.id);
    } else {
      setFormData({ full_name: '', contact_number: '', email: '', address: '' });
      setEditingId(null);
    }
    setFormErrors({});
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ full_name: '', contact_number: '', email: '', address: '' });
    setFormErrors({});
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.contact_number.trim()) newErrors.contact_number = 'Contact number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await borrowerApi.update(editingId, formData);
      } else {
        await borrowerApi.create(formData);
      }
      await fetchBorrowers();
      handleCloseForm();
    } catch (err: any) {
      const apiErrors = err?.response?.data;
      const errorMessages: Record<string, string> = {};
      if (apiErrors && typeof apiErrors === 'object') {
        Object.keys(apiErrors).forEach((key) => {
          errorMessages[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
        });
      }
      setFormErrors(errorMessages);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this borrower?')) {
      try {
        await borrowerApi.delete(id);
        await fetchBorrowers();
      } catch (err) {
        setError('Could not delete borrower.');
      }
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: Borrower }) => (
      <AppCard style={[styles.borrowerCard, isTablet ? styles.borrowerCardTablet : undefined]}>
        <View style={styles.borrowerTop}>
          <View style={styles.borrowerInfo}>
            <Text style={styles.borrowerName}>{item.full_name}</Text>
            <Text style={styles.borrowerEmail}>{item.email}</Text>
          </View>
          <View style={styles.borrowerActions}>
            <AppButton
              title="Edit"
              variant="ghost"
              onPress={() => handleOpenForm(item)}
              style={styles.actionButton}
            />
            <AppButton
              title="Delete"
              variant="danger"
              onPress={() => handleDelete(item.id)}
              style={styles.actionButton}
            />
          </View>
        </View>
        <View style={styles.borrowerMeta}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="phone" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.contact_number}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="map-marker" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.address}</Text>
          </View>
        </View>
      </AppCard>
    ),
    [isTablet]
  );

  return (
    <Screen style={styles.screen}>
      <FlatList
        data={filteredBorrowers}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchBorrowers(true)} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View style={styles.content}>
            <AppHeader
              title="Borrowers"
              subtitle="Manage borrower profiles and contact information."
            />

            <AppInput
              label="Search borrowers"
              placeholder="By name, email, or phone"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />

            <AppButton
              title="Add Borrower"
              onPress={() => handleOpenForm()}
              style={styles.addButton}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {loading && (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>Loading borrowers...</Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons name="account-multiple-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyTitle}>No borrowers yet</Text>
              <Text style={styles.emptySubtitle}>Add your first borrower to get started</Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {showForm && (
        <View style={styles.formOverlay}>
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>{editingId ? 'Edit Borrower' : 'Add Borrower'}</Text>
              <AppButton
                title="✕"
                variant="ghost"
                onPress={handleCloseForm}
                style={styles.closeButton}
              />
            </View>

            <AppInput
              label="Full Name"
              placeholder="Borrower's full name"
              value={formData.full_name}
              onChangeText={(value) => setFormData({ ...formData, full_name: value })}
            />
            {formErrors.full_name && <Text style={styles.fieldError}>{formErrors.full_name}</Text>}

            <AppInput
              label="Email"
              placeholder="Email address"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(value) => setFormData({ ...formData, email: value })}
            />
            {formErrors.email && <Text style={styles.fieldError}>{formErrors.email}</Text>}

            <AppInput
              label="Contact Number"
              placeholder="Phone number"
              value={formData.contact_number}
              onChangeText={(value) => setFormData({ ...formData, contact_number: value })}
            />
            {formErrors.contact_number && (
              <Text style={styles.fieldError}>{formErrors.contact_number}</Text>
            )}

            <AppInput
              label="Address"
              placeholder="Full address"
              value={formData.address}
              onChangeText={(value) => setFormData({ ...formData, address: value })}
              multiline
            />
            {formErrors.address && <Text style={styles.fieldError}>{formErrors.address}</Text>}

            <View style={styles.formActions}>
              <AppButton
                title="Cancel"
                variant="ghost"
                onPress={handleCloseForm}
                style={styles.cancelButton}
              />
              <AppButton
                title={submitting ? 'Saving...' : 'Save'}
                onPress={handleSubmit}
                loading={submitting}
                disabled={submitting}
              />
            </View>
          </View>
        </View>
      )}
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
    gap: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  searchInput: {
    marginBottom: spacing.sm,
  },
  addButton: {
    marginBottom: spacing.md,
  },
  borrowerCard: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    borderRadius: 20,
  },
  borrowerCardTablet: {
    flex: 1,
    marginHorizontal: 0,
  },
  borrowerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  borrowerInfo: {
    flex: 1,
  },
  borrowerName: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: -0.3,
  },
  borrowerEmail: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  borrowerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
  borrowerMeta: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
    marginVertical: spacing.sm,
  },
  emptyCard: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  formOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    paddingBottom: spacing.lg,
  },
  formContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: '80%',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  formTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
  fieldError: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  formActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
});
