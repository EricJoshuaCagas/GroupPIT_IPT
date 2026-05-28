import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Table } from '../components';
import { paymentApi } from '../services/api';
import { Payment } from '../types';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const response = await paymentApi.getAll();
      setPayments(response.data.results);
    } catch (error) {
      // Silently handle errors - empty state shown to user
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    return `PHP ${parseFloat(value as string).toFixed(2)}`;
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

  const getMethodIcon = (method: string) => {
    const icons: Record<string, string> = {
      cash: '$',
      check: 'CHK',
      bank_transfer: 'BANK',
      credit_card: 'CARD',
    };
    return icons[method] || 'PAY';
  };

  const totalPayments = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const paymentCount = payments.length;
  const avgPayment = paymentCount > 0 ? totalPayments / paymentCount : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.h1
          className="gradient-text text-4xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Payments
        </motion.h1>
        <motion.p
          className="mt-1 text-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          View all recorded payments
        </motion.p>
      </motion.div>

      <motion.div
        className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-100 to-primary-50">
                <DollarSign className="text-primary-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Total Payments</p>
                <p className="text-2xl font-bold text-text-primary">{formatCurrency(totalPayments)}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-50">
                <TrendingUp className="text-slate-dark" size={24} />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Total Records</p>
                <p className="text-2xl font-bold text-text-primary">{paymentCount}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-slate-100">
                <Calendar className="text-primary-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Average Payment</p>
                <p className="text-2xl font-bold text-text-primary">{formatCurrency(avgPayment)}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <Card>
          <Table
            columns={[
              {
                key: 'loan',
                label: 'Loan ID',
                render: (value) => (
                  <motion.span
                    className="inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    #{value}
                  </motion.span>
                ),
              },
              {
                key: 'amount',
                label: 'Amount',
                render: (value) => <span className="font-semibold text-primary-600">{formatCurrency(value)}</span>,
              },
              {
                key: 'payment_date',
                label: 'Date',
                render: (value) => <span className="text-text-secondary">{new Date(value).toLocaleDateString()}</span>,
              },
              {
                key: 'payment_method',
                label: 'Method',
                render: (value: string) => (
                  <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.03 }}>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-dark">
                      {getMethodIcon(value)}
                    </span>
                    <span className="text-text-secondary">{getMethodLabel(value)}</span>
                  </motion.div>
                ),
              },
              {
                key: 'notes',
                label: 'Notes',
                render: (value) => <span className="line-clamp-1 text-sm text-text-secondary">{value || '-'}</span>,
              },
            ]}
            data={payments}
            keyExtractor={(row) => row.id}
            loading={loading}
            emptyMessage="No payments found"
          />
        </Card>
      </motion.div>
    </motion.div>
  );
};
