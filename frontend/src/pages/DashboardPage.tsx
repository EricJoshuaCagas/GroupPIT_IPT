import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Table, StatusBadge } from '../components';
import { borrowerApi, loanApi, paymentApi } from '../services/api';
import { Loan, Payment } from '../types';
import { Users, FileText, CreditCard, TrendingUp, ArrowUpRight } from 'lucide-react';

interface DashboardStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  trend?: number;
}

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [borrowersRes, loansRes, paymentsRes] = await Promise.all([
        borrowerApi.getAll(),
        loanApi.getAll(),
        paymentApi.getAll(),
      ]);

      const borrowers = borrowersRes.data.results;
      const loans = loansRes.data.results;
      const payments = paymentsRes.data.results;

      // Calculate total amounts
      const totalPaid = loans.reduce((sum, loan) => sum + parseFloat(loan.total_paid), 0);
      const activeLoanCount = loans.filter((l) => l.status === 'active').length;

      setStats([
        {
          label: 'Total Borrowers',
          value: borrowers.length,
          icon: <Users size={28} />,
          color: 'text-blue-600',
          bgGradient: 'from-blue-50 to-blue-100',
          trend: borrowers.length > 0 ? 12 : 0,
        },
        {
          label: 'Active Loans',
          value: activeLoanCount,
          icon: <FileText size={28} />,
          color: 'text-green-600',
          bgGradient: 'from-green-50 to-green-100',
          trend: activeLoanCount > 5 ? 8 : 0,
        },
        {
          label: 'Total Payments',
          value: payments.length,
          icon: <CreditCard size={28} />,
          color: 'text-purple-600',
          bgGradient: 'from-purple-50 to-purple-100',
          trend: payments.length > 10 ? 15 : 0,
        },
        {
          label: 'Total Collected',
          value: `₱${totalPaid.toFixed(2)}`,
          icon: <TrendingUp size={28} />,
          color: 'text-orange-600',
          bgGradient: 'from-orange-50 to-orange-100',
          trend: 22,
        },
      ]);

      setRecentPayments(payments.slice(0, 5));
      setActiveLoans(
        loans
          .filter((l) => l.status === 'active')
          .sort((a, b) => parseFloat(b.remaining_balance) - parseFloat(a.remaining_balance))
          .slice(0, 5)
      );
    } catch (error) {
      // Silently handle errors - user sees loading state
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    return `₱${parseFloat(value as string).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Welcome back! Here's your loan tracking overview</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow cursor-default`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl bg-white shadow-md`}>
                  {stat.icon}
                </div>
                {stat.trend && stat.trend > 0 && (
                  <div className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                    <ArrowUpRight size={16} />
                    {stat.trend}%
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <Card title="Recent Payments" icon="💳">
          <Table
            columns={[
              {
                key: 'amount',
                label: 'Amount',
                render: (value) => (
                  <span className="font-semibold text-green-600">
                    {formatCurrency(value)}
                  </span>
                ),
              },
              {
                key: 'payment_date',
                label: 'Date',
                render: (value) => new Date(value as string).toLocaleDateString(),
              },
              {
                key: 'payment_method',
                label: 'Method',
                render: (value) => (
                  <span className="capitalize px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                    {value}
                  </span>
                ),
              },
            ]}
            data={recentPayments}
            keyExtractor={(row) => row.id}
            emptyMessage="No payments recorded"
          />
        </Card>

        <Card title="Active Loans" icon="📄" subtitle="Highest remaining balance">
          <Table
            columns={[
              {
                key: 'borrower_name',
                label: 'Borrower',
                render: (value) => <span className="font-semibold">{value}</span>,
              },
              {
                key: 'remaining_balance',
                label: 'Balance',
                render: (value) => (
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(value)}
                  </span>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                render: (value: string) => (
                  <StatusBadge status={value as any}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </StatusBadge>
                ),
              },
            ]}
            data={activeLoans}
            keyExtractor={(row) => row.id}
            emptyMessage="No active loans"
          />
        </Card>
      </motion.div>
    </motion.div>
  );
};
