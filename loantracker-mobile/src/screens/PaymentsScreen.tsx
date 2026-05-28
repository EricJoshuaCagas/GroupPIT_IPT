import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useScrollAnimation } from '../contexts/ScrollContext';
import { AppCard, AppHeader, Screen } from '../components';
import { paymentApi } from '../services/api';
import { Payment } from '../types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/metrics';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const PaymentsScreen: React.FC = () => {
  const { onScroll } = useScrollAnimation();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPayments = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const response = await paymentApi.getAll();
      setPayments(response.data?.results ?? []);
    } catch (err) {
      setError('Could not load payments right now.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const stats = useMemo(() => {
    const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const count = payments.length;
    const average = count > 0 ? totalAmount / count : 0;
    return { totalAmount, count, average };
  }, [payments]);

  const formatCurrency = (value: string | number) => {
    const amount = Number(value || 0);
    return `PHP ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getMethodIcon = (method: string) => {
    const icons: Record<string, string> = {
      cash: 'cash',
      check: 'check-circle',
      bank_transfer: 'bank',
      credit_card: 'credit-card',
    };
    return icons[method] || 'currency-php';
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: 'Cash',
      check: 'Check',
      bank_transfer: 'Bank Transfer',
      credit_card: 'Credit Card',
    };
    return labels[method] || method;
  };

  const filteredPayments = useMemo(() => {
    if (!searchQuery.trim()) return payments;
    const query = searchQuery.toLowerCase();
    return payments.filter((p) =>
      p.payment_method.toLowerCase().includes(query) ||
      p.payment_date.includes(query) ||
      p.amount.includes(query)
    );
  }, [payments, searchQuery]);

  const renderItem = useCallback(({ item }: { item: Payment }) => (
    <AppCard style={styles.paymentCard}>
      <View style={styles.paymentTop}>
        <View style={styles.paymentMethodIcon}>
          <MaterialCommunityIcons
            name={getMethodIcon(item.payment_method) as any}
            size={24}
            color={colors.primary}
          />
        </View>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentMethod}>{getMethodLabel(item.payment_method)}</Text>
          <Text style={styles.paymentDate}>{item.payment_date}</Text>
        </View>
        <Text style={styles.paymentAmount}>{formatCurrency(item.amount)}</Text>
      </View>
      {item.notes && (
        <View style={styles.paymentNotes}>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}
    </AppCard>
  ), []);

  return (
    <Screen style={styles.screen}>
      <FlatList
        data={filteredPayments}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchPayments(true)} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View style={styles.content}>
            <AppHeader
              title="Payments"
              subtitle="Track all payment records and transaction history."
            />

            {/* Stats Cards */}
            <View style={styles.statsRow}>
              <AppCard style={styles.statCard}>
                <Text style={styles.statLabel}>Total Payments</Text>
                <Text style={styles.statValue}>{formatCurrency(stats.totalAmount)}</Text>
              </AppCard>
              <AppCard style={styles.statCard}>
                <Text style={styles.statLabel}>Records</Text>
                <Text style={styles.statValue}>{stats.count}</Text>
              </AppCard>
              <AppCard style={styles.statCard}>
                <Text style={styles.statLabel}>Average</Text>
                <Text style={styles.statValue}>{formatCurrency(stats.average)}</Text>
              </AppCard>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {loading && (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>Loading payments...</Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons name="receipt-text-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyTitle}>No payments yet</Text>
              <Text style={styles.emptySubtitle}>Payments will appear here as you record them</Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: 16,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  paymentCard: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    borderRadius: 20,
  },
  paymentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentMethod: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.3,
  },
  paymentDate: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  paymentAmount: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 16,
  },
  paymentNotes: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  notesText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
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
});
