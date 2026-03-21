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
    return `₱${parseFloat(value as string).toFixed(2)}`;
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
    const icons: Record<string, React.ReactNode> = {
      cash: '💵',
      check: '🏦',
      bank_transfer: '💳',
      credit_card: '💰',
    };
    return icons[method] || '💴';
  };

  // Calculate payment statistics
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
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Payments
        </motion.h1>
        <motion.p 
          className="text-gray-500 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          View all recorded payments
        </motion.p>
      </motion.div>

      {/* Payment Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
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
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPayments)}</p>
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{paymentCount}</p>
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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Average Payment</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgPayment)}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Payment Table */}
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
                    className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    #{value}
                  </motion.span>
                )
              },
              {
                key: 'amount',
                label: 'Amount',
                render: (value) => (
                  <span className="font-semibold text-green-600">{formatCurrency(value)}</span>
                ),
              },
              { 
                key: 'payment_date', 
                label: 'Date',
                render: (value) => (
                  <span className="text-gray-600">{new Date(value).toLocaleDateString()}</span>
                )
              },
              {
                key: 'payment_method',
                label: 'Method',
                render: (value: string) => (
                  <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-lg">{getMethodIcon(value)}</span>
                    <span className="text-gray-600">{getMethodLabel(value)}</span>
                  </motion.div>
                ),
              },
              { 
                key: 'notes', 
                label: 'Notes',
                render: (value) => (
                  <span className="text-gray-500 text-sm line-clamp-1">{value || '-'}</span>
                )
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
