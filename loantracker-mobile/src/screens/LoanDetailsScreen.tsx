import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { AppCard, AppHeader, AppButton, AppInput, Screen, StatusBadge } from '../components';
import { loanApi, paymentApi } from '../services/api';
import { Loan, Payment } from '../types';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/metrics';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type LoanDetailsRoute = RouteProp<{ LoanDetails: { id: number } }, 'LoanDetails'>;

export const LoanDetailsScreen: React.FC = () => {
  const route = useRoute<LoanDetailsRoute>();
  const navigation = useNavigation();
  const { id } = route.params;

  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    notes: '',
  });

  const fetchLoan = useCallback(async () => {
    setLoading(true);
    try {
      const response = await loanApi.getById(id);
      setLoan(response.data);
      
      const paymentsResponse = await loanApi.getPayments(id);
      setPayments(paymentsResponse.data?.results ?? response.data.payments ?? []);
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLoan();
  }, [fetchLoan]);

  const formatCurrency = (value: string | number) => {
    const amount = Number(value || 0);
    return `PHP ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleOpenPaymentForm = () => {
    setFormData({
      amount: '',
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'cash',
      notes: '',
    });
    setFormErrors({});
    setShowPaymentForm(true);
  };

  const handleClosePaymentForm = () => {
    setShowPaymentForm(false);
    setFormData({
      amount: '',
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'cash',
      notes: '',
    });
    setFormErrors({});
  };

  const handleSubmitPayment = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.amount.trim()) newErrors.amount = 'Amount is required';
    else if (parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';
    else if (loan && parseFloat(formData.amount) > parseFloat(loan.remaining_balance)) {
      newErrors.amount = `Cannot exceed remaining balance of ${formatCurrency(loan.remaining_balance)}`;
    }
    if (!formData.payment_date) newErrors.payment_date = 'Payment date is required';

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await paymentApi.create({
        loan: id,
        amount: formData.amount,
        payment_date: formData.payment_date,
        payment_method: formData.payment_method,
        notes: formData.notes,
      });
      await fetchLoan();
      handleClosePaymentForm();
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

  const handleDeletePayment = async (paymentId: number) => {
    if (confirm('Are you sure you want to delete this payment?')) {
      try {
        await paymentApi.delete(paymentId);
        await fetchLoan();
      } catch (error) {
        // Handle error
      }
    }
  };

  const renderPaymentItem = useCallback(({ item }: { item: Payment }) => (
    <AppCard style={styles.paymentItem}>
      <View style={styles.paymentItemTop}>
        <View>
          <Text style={styles.paymentItemDate}>{item.payment_date}</Text>
          <Text style={styles.paymentItemMethod}>{item.payment_method}</Text>
        </View>
        <Text style={styles.paymentItemAmount}>{formatCurrency(item.amount)}</Text>
        <AppButton
          title="Delete"
          variant="danger"
          onPress={() => handleDeletePayment(item.id)}
          style={styles.deleteButton}
        />
      </View>
      {item.notes && <Text style={styles.paymentItemNotes}>{item.notes}</Text>}
    </AppCard>
  ), []);

  if (loading) {
    return (
      <Screen style={styles.screen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading loan details...</Text>
        </View>
      </Screen>
    );
  }

  if (!loan) {
    return (
      <Screen style={styles.screen}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={styles.errorTitle}>Loan not found</Text>
          <AppButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>
      </Screen>
    );
  }

  const progressPercent = Math.min(
    (parseFloat(loan.total_paid) / parseFloat(loan.total_payable)) * 100,
    100
  );

  return (
    <Screen style={styles.screen}>
      <FlatList
        data={payments}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderPaymentItem}
        scrollEnabled={false}
        ListHeaderComponent={
          <View style={styles.content}>
            <AppButton
              title="← Back"
              variant="ghost"
              onPress={() => navigation.goBack()}
              style={styles.backButtonSmall}
            />

            <AppCard style={styles.loanHeader}>
              <View style={styles.loanHeaderTop}>
                <View>
                  <Text style={styles.borrowerName}>{loan.borrower_name}</Text>
                  <Text style={styles.loanId}>Loan #{loan.id}</Text>
                </View>
                <StatusBadge status={loan.status} />
              </View>
            </AppCard>

            <View style={styles.metricsRow}>
              <AppCard style={styles.metricCard}>
                <Text style={styles.metricLabel}>Principal</Text>
                <Text style={styles.metricValue}>{formatCurrency(loan.principal_amount)}</Text>
              </AppCard>
              <AppCard style={styles.metricCard}>
                <Text style={styles.metricLabel}>Interest Rate</Text>
                <Text style={styles.metricValue}>{loan.interest_rate}%</Text>
              </AppCard>
              <AppCard style={styles.metricCard}>
                <Text style={styles.metricLabel}>Term</Text>
                <Text style={styles.metricValue}>{loan.term_months}mo</Text>
              </AppCard>
            </View>

            <AppCard style={styles.balanceCard}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Total Payable</Text>
                <Text style={styles.balanceValue}>{formatCurrency(loan.total_payable)}</Text>
              </View>
              <View style={[styles.balanceItem, styles.balanceItemDivider]}>
                <Text style={styles.balanceLabel}>Total Paid</Text>
                <Text style={[styles.balanceValue, { color: colors.success }]}>
                  {formatCurrency(loan.total_paid)}
                </Text>
              </View>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Remaining</Text>
                <Text style={[styles.balanceValue, { color: colors.primary }]}>
                  {formatCurrency(loan.remaining_balance)}
                </Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progressPercent}%`, backgroundColor: colors.success },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{Math.round(progressPercent)}% Paid</Text>
              </View>
            </AppCard>

            <View style={styles.datesRow}>
              <AppCard style={styles.dateCard}>
                <MaterialCommunityIcons name="calendar-start" size={20} color={colors.primary} />
                <View style={styles.dateContent}>
                  <Text style={styles.dateLabel}>Start Date</Text>
                  <Text style={styles.dateValue}>{loan.start_date}</Text>
                </View>
              </AppCard>
              <AppCard style={styles.dateCard}>
                <MaterialCommunityIcons name="calendar-end" size={20} color={colors.danger} />
                <View style={styles.dateContent}>
                  <Text style={styles.dateLabel}>Due Date</Text>
                  <Text style={styles.dateValue}>{loan.due_date}</Text>
                </View>
              </AppCard>
            </View>

            <AppButton
              title="Record Payment"
              onPress={handleOpenPaymentForm}
              style={styles.paymentButton}
            />

            <View style={styles.paymentsHeader}>
              <Text style={styles.paymentsTitle}>Payment History</Text>
              <Text style={styles.paymentsCount}>{payments.length} payments</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyPayments}>
            <MaterialCommunityIcons name="file-document-outline" size={40} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No payments yet</Text>
          </View>
        }
        contentContainerStyle={styles.paymentsList}
        showsVerticalScrollIndicator={false}
      />

      {showPaymentForm && (
        <View style={styles.formOverlay}>
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Record Payment</Text>

            <AppInput
              label="Amount"
              placeholder="Enter amount"
              keyboardType="decimal-pad"
              value={formData.amount}
              onChangeText={(value) => setFormData({ ...formData, amount: value })}
            />
            {formErrors.amount && <Text style={styles.fieldError}>{formErrors.amount}</Text>}

            <AppInput
              label="Payment Date"
              placeholder="YYYY-MM-DD"
              value={formData.payment_date}
              onChangeText={(value) => setFormData({ ...formData, payment_date: value })}
            />
            {formErrors.payment_date && <Text style={styles.fieldError}>{formErrors.payment_date}</Text>}

            <AppInput
              label="Payment Method"
              placeholder="cash, check, bank_transfer, credit_card"
              value={formData.payment_method}
              onChangeText={(value) => setFormData({ ...formData, payment_method: value })}
            />

            <AppInput
              label="Notes (Optional)"
              placeholder="Additional notes"
              value={formData.notes}
              onChangeText={(value) => setFormData({ ...formData, notes: value })}
              multiline
            />

            <View style={styles.formActions}>
              <AppButton
                title="Cancel"
                variant="ghost"
                onPress={handleClosePaymentForm}
                style={styles.cancelButton}
              />
              <AppButton
                title={submitting ? 'Saving...' : 'Save Payment'}
                onPress={handleSubmitPayment}
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
  backButtonSmall: {
    alignSelf: 'flex-start',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  errorTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  backButton: {
    marginTop: spacing.md,
  },
  loanHeader: {
    borderRadius: 20,
  },
  loanHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  borrowerName: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  loanId: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: 16,
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  metricValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  balanceCard: {
    borderRadius: 20,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  balanceItemDivider: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.divider,
  },
  balanceLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  balanceValue: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  progressContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.divider,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.sm,
    fontWeight: '600',
  },
  datesRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dateCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  dateContent: {
    flex: 1,
  },
  dateLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  dateValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  paymentButton: {
    marginVertical: spacing.md,
  },
  paymentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  paymentsTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  paymentsCount: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  paymentsList: {
    paddingBottom: spacing.xl,
  },
  paymentItem: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: 16,
  },
  paymentItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  paymentItemDate: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  paymentItemMethod: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  paymentItemAmount: {
    color: colors.success,
    fontWeight: '800',
    fontSize: 14,
  },
  deleteButton: {
    minHeight: 32,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  paymentItemNotes: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  emptyPayments: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginHorizontal: spacing.lg,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.sm,
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
    maxHeight: '70%',
  },
  formTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.lg,
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
