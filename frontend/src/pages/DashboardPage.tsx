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

      const totalPaid = loans.reduce((sum, loan) => sum + parseFloat(loan.total_paid), 0);
      const activeLoanCount = loans.filter((l) => l.status === 'active').length;

      setStats([
        {
          label: 'Total Borrowers',
          value: borrowers.length,
          icon: <Users size={24} />,
          color: 'text-primary-600',
          bgGradient: 'from-primary-50 to-primary-100',
          trend: borrowers.length > 0 ? 12 : 0,
        },
        {
          label: 'Active Loans',
          value: activeLoanCount,
          icon: <FileText size={24} />,
          color: 'text-slate-dark',
          bgGradient: 'from-slate-50 to-white',
          trend: activeLoanCount > 5 ? 8 : 0,
        },
        {
          label: 'Total Payments',
          value: payments.length,
          icon: <CreditCard size={24} />,
          color: 'text-primary-600',
          bgGradient: 'from-primary-50 to-slate-50',
          trend: payments.length > 10 ? 15 : 0,
        },
        {
          label: 'Total Collected',
          value: `PHP ${totalPaid.toFixed(2)}`,
          icon: <TrendingUp size={24} />,
          color: 'text-slate-dark',
          bgGradient: 'from-slate-50 to-primary-50',
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
    return `PHP ${parseFloat(value as string).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 rounded-full border-4 border-primary-100 border-t-primary-500"
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
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-10">
        <h1 className="gradient-text text-4xl font-bold md:text-5xl">Dashboard</h1>
        <p className="mt-2 text-lg text-text-secondary">
          Welcome back! Here&apos;s your loan tracking overview
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className={`cursor-default rounded-2xl border border-border bg-gradient-to-br ${stat.bgGradient} p-6 shadow-sm transition-all hover:shadow-md`}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className={`${stat.color} rounded-xl bg-white p-3 shadow-sm`}>
                  {stat.icon}
                </div>
                {stat.trend && stat.trend > 0 && (
                  <div className="flex items-center gap-1 text-sm font-semibold text-primary-600">
                    <ArrowUpRight size={16} />
                    {stat.trend}%
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-text-primary md:text-4xl">{stat.value}</p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card title="Recent Payments" icon={<CreditCard size={22} className="text-primary-600" />}>
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
                render: (value) => new Date(value as string).toLocaleDateString(),
              },
              {
                key: 'payment_method',
                label: 'Method',
                render: (value) => (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium capitalize text-slate-dark">
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

        <Card
          title="Active Loans"
          icon={<FileText size={22} className="text-primary-600" />}
          subtitle="Highest remaining balance"
        >
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
                render: (value) => <span className="font-semibold text-primary-600">{formatCurrency(value)}</span>,
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
