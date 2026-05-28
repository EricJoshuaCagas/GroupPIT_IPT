import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useScrollAnimation } from '../contexts/ScrollContext';
import { borrowerApi, loanApi, paymentApi } from '../services/api';
import { Loan, Payment } from '../types';
import { AppButton, AppCard, AppHeader, Screen } from '../components';
import { radius, spacing } from '../theme/metrics';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color = colors.primary }) => (
  <AppCard style={styles.card}>
    <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.cardLabel}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </AppCard>
);

const QuickActionButton: React.FC<{
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress: () => void;
}> = ({ title, icon, onPress }) => (
  <AppButton
    title={title}
    onPress={onPress}
    style={styles.quickActionButton}
  />
);

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { onScroll } = useScrollAnimation();
  const [stats, setStats] = useState({
    borrowers: 0,
    loans: 0,
    payments: 0,
    activeLoanCount: 0,
    overdueLoanCount: 0,
    completedLoanCount: 0,
    totalLoansAmount: 0,
    totalPaidAmount: 0,
    totalRemainingAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const formatCurrency = (value: number | string) => {
    const amount = Number(value || 0);
    return `PHP ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const loadStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const [borrowersRes, loansRes, paymentsRes] = await Promise.all([
        borrowerApi.getAll(),
        loanApi.getAll(),
        paymentApi.getAll(),
      ]);

      const loanData = loansRes.data?.results || [];
      const paymentData = paymentsRes.data?.results || [];

      const activeLoanCount = loanData.filter((l: Loan) => l.status === 'active').length;
      const overdueLoanCount = loanData.filter((l: Loan) => l.status === 'overdue').length;
      const completedLoanCount = loanData.filter((l: Loan) => l.status === 'completed').length;

      const totalLoansAmount = loanData.reduce((sum: number, l: Loan) => sum + parseFloat(l.total_payable), 0);
      const totalPaidAmount = loanData.reduce((sum: number, l: Loan) => sum + parseFloat(l.total_paid), 0);
      const totalRemainingAmount = loanData.reduce((sum: number, l: Loan) => sum + parseFloat(l.remaining_balance), 0);

      setStats({
        borrowers: borrowersRes.data?.results?.length || 0,
        loans: loanData.length,
        payments: paymentData.length,
        activeLoanCount,
        overdueLoanCount,
        completedLoanCount,
        totalLoansAmount,
        totalPaidAmount,
        totalRemainingAmount,
      });
    } catch (error) {
      // Silent for now; show zero stats
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const totalRecords = useMemo(
    () => stats.borrowers + stats.loans + stats.payments,
    [stats.borrowers, stats.loans, stats.payments]
  );

  const paidPercent = stats.totalLoansAmount > 0 
    ? Math.round((stats.totalPaidAmount / stats.totalLoansAmount) * 100)
    : 0;

  return (
    <Screen style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadStats(true)} />}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <AppHeader title="Dashboard" subtitle="Complete portfolio overview and insights." />

        <AppCard style={styles.heroCard}>
          <Text style={styles.heroLabel}>Total tracked records</Text>
          <Text style={styles.heroValue}>{totalRecords}</Text>
          {loading ? (
            <View style={styles.loadingLine}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Refreshing summary...</Text>
            </View>
          ) : null}
        </AppCard>

        {/* Portfolio Summary */}
        <View>
          <Text style={styles.sectionTitle}>Portfolio</Text>
          <View style={styles.portfolioRow}>
            <AppCard style={styles.portfolioCard}>
              <Text style={styles.portfolioLabel}>Total Amount</Text>
              <Text style={styles.portfolioValue}>{formatCurrency(stats.totalLoansAmount)}</Text>
            </AppCard>
            <AppCard style={styles.portfolioCard}>
              <Text style={styles.portfolioLabel}>Total Paid</Text>
              <Text style={[styles.portfolioValue, { color: colors.success }]}>
                {formatCurrency(stats.totalPaidAmount)}
              </Text>
            </AppCard>
            <AppCard style={styles.portfolioCard}>
              <Text style={styles.portfolioLabel}>Remaining</Text>
              <Text style={[styles.portfolioValue, { color: colors.primary }]}>
                {formatCurrency(stats.totalRemainingAmount)}
              </Text>
            </AppCard>
          </View>

          {stats.totalLoansAmount > 0 && (
            <AppCard style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Portfolio Paid</Text>
                <Text style={styles.progressPercent}>{paidPercent}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${paidPercent}%` }]}
                />
              </View>
            </AppCard>
          )}
        </View>

        {/* Loan Status Breakdown */}
        <View>
          <Text style={styles.sectionTitle}>Loan Status</Text>
          <View style={styles.grid}>
            <SummaryCard
              title="Active"
              value={`${stats.activeLoanCount}`}
              icon="clock-outline"
              color={colors.primary}
            />
            <SummaryCard
              title="Completed"
              value={`${stats.completedLoanCount}`}
              icon="check-circle-outline"
              color={colors.success}
            />
            <SummaryCard
              title="Overdue"
              value={`${stats.overdueLoanCount}`}
              icon="alert-circle-outline"
              color={colors.danger}
            />
          </View>
        </View>

        {/* Quick Stats */}
        <View>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.grid}>
            <SummaryCard title="Borrowers" value={`${stats.borrowers}`} icon="account-group-outline" />
            <SummaryCard title="Loans" value={`${stats.loans}`} icon="file-document-outline" />
            <SummaryCard title="Payments" value={`${stats.payments}`} icon="cash-multiple" />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <AppButton
              title="View Loans"
              onPress={() => navigation.navigate('Loans')}
              style={styles.actionButtonSmall}
            />
            <AppButton
              title="Manage Borrowers"
              variant="secondary"
              onPress={() => navigation.navigate('Borrowers')}
              style={styles.actionButtonSmall}
            />
            <AppButton
              title="View Payments"
              variant="secondary"
              onPress={() => navigation.navigate('Payments')}
              style={styles.actionButtonSmall}
            />
            <AppButton
              title="Chat Assistant"
              variant="secondary"
              onPress={() => navigation.navigate('ChatAssistant')}
              style={styles.actionButtonSmall}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  heroCard: {
    borderRadius: 20,
    padding: spacing.lg,
    backgroundColor: '#ECFEFF',
    borderColor: '#CCFBF1',
  },
  heroLabel: {
    color: colors.primaryDark,
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: -0.3,
  },
  heroValue: {
    marginTop: 6,
    color: colors.textPrimary,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  loadingLine: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: spacing.sm,
  },
  portfolioRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  portfolioCard: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: 16,
  },
  portfolioLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  portfolioValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  progressCard: {
    borderRadius: 16,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  progressLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  progressPercent: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.divider,
    overflow: 'hidden',
    marginHorizontal: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 3,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginTop: spacing.xs,
  },
  actionsSection: {
    marginTop: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionButtonSmall: {
    flexBasis: '48%',
    minHeight: 44,
  },
  quickActionButton: {
    flex: 1,
  },
});
