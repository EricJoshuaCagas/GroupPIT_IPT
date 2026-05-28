import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollAnimation } from '../contexts/ScrollContext';
import { AppCard, AppHeader, AppButton, Screen } from '../components';
import { loanApi } from '../services/api';
import { Loan } from '../types';
import { AppStackParamList } from '../types/navigation';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/metrics';

const formatCurrency = (value: string) => {
  const amount = Number(value || 0);
  return `PHP ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const statusColors: Record<Loan['status'], string> = {
  active: colors.primary,
  completed: colors.success,
  overdue: colors.danger,
};

const statusLabels: Record<Loan['status'], string> = {
  active: 'Active',
  completed: 'Completed',
  overdue: 'Overdue',
};

export const LoansScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { onScroll } = useScrollAnimation();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [error, setError] = useState('');

  const fetchLoans = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const response = await loanApi.getAll();
      setLoans(response.data?.results ?? []);
    } catch (err) {
      setError('Could not load loan records right now.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const summary = useMemo(() => {
    const active = loans.filter((loan) => loan.status === 'active').length;
    const completed = loans.filter((loan) => loan.status === 'completed').length;
    const overdue = loans.filter((loan) => loan.status === 'overdue').length;
    return { active, completed, overdue };
  }, [loans]);

  const renderItem = useCallback(
    ({ item }: { item: Loan }) => (
      <TouchableOpacity onPress={() => navigation.navigate('LoanDetails', { id: item.id })}>
        <AppCard style={[styles.loanCard, isTablet ? styles.loanCardTablet : undefined]}>
          <View style={styles.loanTop}>
            <Text style={styles.borrowerName}>{item.borrower_name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: `${statusColors[item.status]}1A` }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColors[item.status] }]} />
              <Text style={[styles.statusLabel, { color: statusColors[item.status] }]}>
                {statusLabels[item.status]}
              </Text>
            </View>
          </View>
          <Text style={styles.amount}>{formatCurrency(item.total_payable)}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Remaining</Text>
            <Text style={styles.metaValue}>{formatCurrency(item.remaining_balance)}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Due Date</Text>
            <Text style={styles.metaValue}>{item.due_date}</Text>
          </View>
        </AppCard>
      </TouchableOpacity>
    ),
    [isTablet, navigation]
  );

  return (
    <Screen style={styles.screen} edges={['top', 'right', 'left']}>
      <FlatList
        data={loans}
        keyExtractor={(item) => `${item.id}`}
        numColumns={isTablet ? 2 : 1}
        renderItem={renderItem}
        columnWrapperStyle={isTablet ? styles.tabletGrid : undefined}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchLoans(true)} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View style={styles.content}>
            <AppHeader
              title="Loans"
              subtitle="Track balances, due dates, and payment status in one view."
            />
            <View style={styles.summaryRow}>
              <AppCard style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{summary.active}</Text>
                <Text style={styles.summaryLabel}>Active</Text>
              </AppCard>
              <AppCard style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{summary.completed}</Text>
                <Text style={styles.summaryLabel}>Completed</Text>
              </AppCard>
              <AppCard style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{summary.overdue}</Text>
                <Text style={styles.summaryLabel}>Overdue</Text>
              </AppCard>
            </View>

            <AppButton
              title="Create New Loan"
              onPress={() => navigation.navigate('CreateLoan', { loanId: undefined })}
              style={styles.createButton}
            />

            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading loans...</Text>
              </View>
            ) : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <AppCard style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No loans yet</Text>
              <Text style={styles.emptySubtitle}>
                Add loan records from your web dashboard and they will appear here.
              </Text>
            </AppCard>
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
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  summaryCard: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: 16,
  },
  summaryValue: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  summaryLabel: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  createButton: {
    marginVertical: spacing.md,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  tabletGrid: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  loanCard: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    borderRadius: 20,
  },
  loanCardTablet: {
    flex: 1,
    marginHorizontal: 0,
  },
  loanTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  borrowerName: {
    flex: 1,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: -0.3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  amount: {
    marginTop: spacing.sm,
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  metaRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  metaValue: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  emptyCard: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 17,
  },
  emptySubtitle: {
    marginTop: spacing.xs,
    textAlign: 'center',
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
