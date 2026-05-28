import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Button, Input, Modal, Table, StatusBadge } from '../components';
import { loanApi, paymentApi } from '../services/api';
import { Loan } from '../types';
import { ArrowLeft, Plus, DollarSign, TrendingUp, Percent } from 'lucide-react';

export const LoanDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadLoan();
  }, [id]);

  const loadLoan = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await loanApi.getById(parseInt(id));
      setLoan(response.data);
    } catch (error) {
      // Silently handle errors - not found state shown
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      amount: '',
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'cash',
      notes: '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.amount) newErrors.amount = 'Amount is required';
    else if (parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';
    else if (parseFloat(formData.amount) > parseFloat(loan!.remaining_balance)) {
      newErrors.amount = `Amount cannot exceed remaining balance of PHP ${parseFloat(
        loan!.remaining_balance
      ).toFixed(2)}`;
    }
    if (!formData.payment_date) newErrors.payment_date = 'Payment date is required';
    if (!formData.payment_method) newErrors.payment_method = 'Payment method is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await paymentApi.create({
        loan: parseInt(id!),
        amount: formData.amount,
        payment_date: formData.payment_date,
        payment_method: formData.payment_method,
        notes: formData.notes,
      });
      loadLoan();
      setIsModalOpen(false);
    } catch (error: any) {
      if (error.response?.data?.detail) {
        setErrors({ general: error.response.data.detail });
      } else if (error.response?.data) {
        const apiErrors = error.response.data;
        const errorMessages: Record<string, string> = {};
        Object.keys(apiErrors).forEach((key) => {
          errorMessages[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
        });
        setErrors(errorMessages);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    return `PHP ${parseFloat(value as string).toFixed(2)}`;
  };

  if (loading) {
    return (
      <motion.div className="flex items-center justify-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="mx-auto mb-4 h-8 w-8 rounded-full border-4 border-primary-100 border-t-primary-500"
          />
          <p className="text-text-secondary">Loading loan details...</p>
        </div>
      </motion.div>
    );
  }

  if (!loan) {
    return (
      <motion.div className="flex items-center justify-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="text-text-secondary">Loan not found</p>
      </motion.div>
    );
  }

  const detailCards = [
    {
      label: 'Principal',
      value: formatCurrency(loan.principal_amount),
      icon: DollarSign,
      wrapperClass: 'bg-primary-100 text-primary-600',
    },
    {
      label: 'Total Payable',
      value: formatCurrency(loan.total_payable),
      icon: TrendingUp,
      wrapperClass: 'bg-slate-100 text-slate-dark',
    },
    {
      label: 'Total Paid',
      value: formatCurrency(loan.total_paid),
      icon: DollarSign,
      wrapperClass: 'bg-primary-50 text-primary-600',
    },
    {
      label: 'Interest Rate',
      value: `${loan.interest_rate}%`,
      icon: Percent,
      wrapperClass: 'bg-slate-100 text-slate-dark',
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <motion.button
        onClick={() => navigate('/loans')}
        className="mb-8 flex items-center gap-2 rounded-lg px-3 py-2 text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={20} />
        Back to Loans
      </motion.button>

      <motion.div
        className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.15 }}>
          <Card>
            <div className="text-center">
              <motion.div className="mb-3 flex justify-center" whileHover={{ scale: 1.1 }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-100 to-primary-50">
                  <DollarSign className="text-primary-600" size={24} />
                </div>
              </motion.div>
              <p className="mb-1 text-sm text-text-secondary">Borrower</p>
              <h3 className="text-xl font-bold text-text-primary">{loan.borrower_name}</h3>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <Card>
            <div className="text-center">
              <p className="mb-3 text-sm text-text-secondary">Status</p>
              <div className="flex justify-center">
                <StatusBadge status={loan.status as any}>
                  {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                </StatusBadge>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.25 }}>
          <Card>
            <div className="text-center">
              <motion.div className="mb-3 flex justify-center" whileHover={{ scale: 1.1 }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-50">
                  <TrendingUp className="text-slate-dark" size={24} />
                </div>
              </motion.div>
              <p className="mb-1 text-sm text-text-secondary">Remaining Balance</p>
              <h3 className="text-xl font-bold text-text-primary">{formatCurrency(loan.remaining_balance)}</h3>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {detailCards.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 + idx * 0.05 }}
          >
            <Card>
              <div className="mb-2 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.wrapperClass}`}>
                  <item.icon size={20} />
                </div>
                <p className="text-sm text-text-secondary">{item.label}</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{item.value}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card title="Payment History">
          <motion.div className="mb-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="primary" onClick={handleOpenModal}>
              <Plus size={20} className="mr-2" />
              Record Payment
            </Button>
          </motion.div>

          <Table
            columns={[
              {
                key: 'amount',
                label: 'Amount',
                render: (value) => <span className="font-semibold text-primary-600">{formatCurrency(value)}</span>,
              },
              {
                key: 'payment_date',
                label: 'Date',
                render: (value) => new Date(value).toLocaleDateString(),
              },
              { key: 'payment_method', label: 'Method' },
              { key: 'notes', label: 'Notes' },
            ]}
            data={loan.payments || []}
            keyExtractor={(row) => row.id}
            emptyMessage="No payments recorded yet"
          />
        </Card>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        title="Record Payment"
        onClose={handleCloseModal}
        onConfirm={handleSubmit}
        confirmText="Record"
        isLoading={submitting}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {errors.general && (
            <motion.div
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.general}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <Input
              label="Amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              error={errors.amount}
              helperText={`Remaining Balance: ${formatCurrency(loan.remaining_balance)} | Cannot exceed this amount`}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Input
              label="Payment Date"
              type="date"
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              error={errors.payment_date}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <label className="mb-2 block text-sm font-semibold text-slate-dark">Payment Method</label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className={`input-field transition-all duration-200 ${errors.payment_method ? 'border-red-500 ring-red-100' : ''}`}
            >
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit_card">Credit Card</option>
            </select>
            {errors.payment_method && (
              <motion.p
                className="mt-1 text-sm text-red-500"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.payment_method}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <label className="mb-2 block text-sm font-semibold text-slate-dark">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field resize-none"
              rows={3}
              placeholder="Add any payment notes..."
            />
          </motion.div>
        </motion.div>
      </Modal>
    </motion.div>
  );
};
