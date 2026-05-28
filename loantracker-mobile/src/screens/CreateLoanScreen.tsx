import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { AppCard, AppHeader, AppButton, AppInput, Screen } from '../components';
import { borrowerApi, loanApi } from '../services/api';
import { Borrower } from '../types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/metrics';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type CreateLoanRoute = RouteProp<{ CreateLoan: { loanId?: number } }, 'CreateLoan'>;

export const CreateLoanScreen: React.FC = () => {
  const route = useRoute<CreateLoanRoute>();
  const navigation = useNavigation();
  const { loanId } = route.params || {};

  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedBorrower, setSelectedBorrower] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    principal_amount: '',
    interest_rate: '',
    total_payable: '',
    term_months: '',
    start_date: new Date().toISOString().split('T')[0],
    due_date: '',
  });

  useEffect(() => {
    loadBorrowers();
  }, []);

  const loadBorrowers = async () => {
    setLoading(true);
    try {
      const response = await borrowerApi.getAll();
      setBorrowers(response.data?.results ?? []);
    } catch (error) {
      setFormErrors({ general: 'Could not load borrowers' });
    } finally {
      setLoading(false);
    }
  };

  const calculateDueDate = () => {
    if (formData.start_date && formData.term_months) {
      const startDate = new Date(formData.start_date);
      const months = parseInt(formData.term_months);
      startDate.setMonth(startDate.getMonth() + months);
      return startDate.toISOString().split('T')[0];
    }
    return '';
  };

  const handleCalculatePayable = () => {
    if (formData.principal_amount && formData.interest_rate) {
      const principal = parseFloat(formData.principal_amount);
      const interestRate = parseFloat(formData.interest_rate);
      const totalPayable = principal + (principal * interestRate / 100);
      setFormData({ ...formData, total_payable: totalPayable.toFixed(2) });
    }
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedBorrower) newErrors.borrower = 'Borrower is required';
    if (!formData.principal_amount.trim()) newErrors.principal_amount = 'Principal amount is required';
    else if (parseFloat(formData.principal_amount) <= 0) newErrors.principal_amount = 'Must be greater than 0';
    
    if (!formData.interest_rate.trim()) newErrors.interest_rate = 'Interest rate is required';
    else if (parseFloat(formData.interest_rate) < 0) newErrors.interest_rate = 'Cannot be negative';
    
    if (!formData.total_payable.trim()) newErrors.total_payable = 'Total payable is required';
    if (!formData.term_months.trim()) newErrors.term_months = 'Term is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const dueDate = calculateDueDate();
      const payload = {
        borrower: selectedBorrower,
        principal_amount: formData.principal_amount,
        interest_rate: formData.interest_rate,
        total_payable: formData.total_payable,
        term_months: parseInt(formData.term_months),
        start_date: formData.start_date,
        due_date: dueDate,
      };

      if (loanId) {
        await loanApi.update(loanId, payload);
      } else {
        await loanApi.create(payload);
      }

      navigation.goBack();
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

  if (loading) {
    return (
      <Screen style={styles.screen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppButton
          title="← Back"
          variant="ghost"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />

        <Text style={styles.title}>{loanId ? 'Edit Loan' : 'Create New Loan'}</Text>

        {formErrors.general && <Text style={styles.generalError}>{formErrors.general}</Text>}

        {/* Borrower Selection */}
        <View>
          <Text style={styles.label}>Select Borrower</Text>
          <View style={styles.borrowerList}>
            {borrowers.length > 0 ? (
              borrowers.map((borrower) => (
                <AppButton
                  key={borrower.id}
                  title={borrower.full_name}
                  variant={selectedBorrower === borrower.id ? 'primary' : 'ghost'}
                  onPress={() => setSelectedBorrower(borrower.id)}
                  style={styles.borrowerButton}
                />
              ))
            ) : (
              <Text style={styles.noBorrowers}>No borrowers available</Text>
            )}
          </View>
          {formErrors.borrower && <Text style={styles.fieldError}>{formErrors.borrower}</Text>}
        </View>

        <AppCard style={styles.formCard}>
          <AppInput
            label="Principal Amount"
            placeholder="Enter principal amount"
            keyboardType="decimal-pad"
            value={formData.principal_amount}
            onChangeText={(value) => setFormData({ ...formData, principal_amount: value })}
          />
          {formErrors.principal_amount && (
            <Text style={styles.fieldError}>{formErrors.principal_amount}</Text>
          )}

          <AppInput
            label="Interest Rate (%)"
            placeholder="Enter interest rate"
            keyboardType="decimal-pad"
            value={formData.interest_rate}
            onChangeText={(value) => setFormData({ ...formData, interest_rate: value })}
          />
          {formErrors.interest_rate && (
            <Text style={styles.fieldError}>{formErrors.interest_rate}</Text>
          )}

          <AppButton
            title="Calculate Total Payable"
            variant="secondary"
            onPress={handleCalculatePayable}
            style={styles.calculateButton}
          />

          <AppInput
            label="Total Payable"
            placeholder="Auto-calculated"
            keyboardType="decimal-pad"
            value={formData.total_payable}
            onChangeText={(value) => setFormData({ ...formData, total_payable: value })}
            editable={true}
          />
          {formErrors.total_payable && (
            <Text style={styles.fieldError}>{formErrors.total_payable}</Text>
          )}

          <AppInput
            label="Loan Term (Months)"
            placeholder="Enter number of months"
            keyboardType="number-pad"
            value={formData.term_months}
            onChangeText={(value) => setFormData({ ...formData, term_months: value.replace(/[^0-9]/g, '') })}
          />
          {formErrors.term_months && <Text style={styles.fieldError}>{formErrors.term_months}</Text>}

          <AppInput
            label="Start Date (YYYY-MM-DD)"
            placeholder="Select start date"
            value={formData.start_date}
            onChangeText={(value) => setFormData({ ...formData, start_date: value })}
          />
          {formErrors.start_date && <Text style={styles.fieldError}>{formErrors.start_date}</Text>}

          {formData.start_date && formData.term_months && (
            <View style={styles.calculatedDate}>
              <MaterialCommunityIcons name="calendar-check" size={16} color={colors.primary} />
              <Text style={styles.calculatedDateText}>
                Due: {calculateDueDate()}
              </Text>
            </View>
          )}
        </AppCard>

        <View style={styles.actionButtons}>
          <AppButton
            title="Cancel"
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          />
          <AppButton
            title={submitting ? 'Creating...' : 'Create Loan'}
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  generalError: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
    marginVertical: spacing.sm,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  borrowerList: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  borrowerButton: {
    width: '100%',
    minHeight: 44,
  },
  noBorrowers: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  fieldError: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  formCard: {
    borderRadius: 20,
  },
  calculateButton: {
    marginVertical: spacing.md,
  },
  calculatedDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
  },
  calculatedDateText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
