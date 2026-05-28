import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Button, Input, Modal, Table, StatusBadge } from '../components';
import { loanApi, borrowerApi } from '../services/api';
import { Loan, Borrower } from '../types';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

export const LoansPage: React.FC = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    borrower: '',
    principal_amount: '',
    interest_rate: '',
    term_months: '',
    start_date: '',
    due_date: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadLoans();
    loadBorrowers();
  }, []);

  const loadLoans = async () => {
    setLoading(true);
    try {
      const response = await loanApi.getAll();
      setLoans(response.data.results);
    } catch (error) {
      // Silently handle errors
    } finally {
      setLoading(false);
    }
  };

  const loadBorrowers = async () => {
    try {
      const response = await borrowerApi.getAll();
      setBorrowers(response.data.results);
    } catch (error) {
      // Silently handle errors
    }
  };

  const handleOpenModal = (loan?: Loan) => {
    if (loan) {
      setFormData({
        borrower: loan.borrower.toString(),
        principal_amount: loan.principal_amount,
        interest_rate: loan.interest_rate,
        term_months: loan.term_months.toString(),
        start_date: loan.start_date,
        due_date: loan.due_date,
      });
      setEditingId(loan.id);
    } else {
      setFormData({
        borrower: '',
        principal_amount: '',
        interest_rate: '',
        term_months: '',
        start_date: '',
        due_date: '',
      });
      setEditingId(null);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      borrower: '',
      principal_amount: '',
      interest_rate: '',
      term_months: '',
      start_date: '',
      due_date: '',
    });
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.borrower) newErrors.borrower = 'Borrower is required';
    if (!formData.principal_amount) newErrors.principal_amount = 'Principal amount is required';
    if (!formData.interest_rate) newErrors.interest_rate = 'Interest rate is required';
    if (!formData.term_months) newErrors.term_months = 'Term is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.due_date) newErrors.due_date = 'Due date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = {
        borrower: parseInt(formData.borrower),
        principal_amount: formData.principal_amount,
        interest_rate: formData.interest_rate,
        term_months: parseInt(formData.term_months),
        start_date: formData.start_date,
        due_date: formData.due_date,
      };

      if (editingId) {
        await loanApi.update(editingId, data as any);
      } else {
        await loanApi.create(data as any);
      }
      loadLoans();
      handleCloseModal();
    } catch (error: any) {
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const errorMessages: Record<string, string> = {};
        Object.keys(apiErrors).forEach((key) => {
          errorMessages[key] = apiErrors[key][0];
        });
        setErrors(errorMessages);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      try {
        await loanApi.delete(id);
        loadLoans();
      } catch (error) {
        // Silently handle errors
      }
    }
  };

  const formatCurrency = (value: string | number) => {
    return `PHP ${parseFloat(value as string).toFixed(2)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="mb-8 flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div>
          <motion.h1
            className="gradient-text text-4xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Loans
          </motion.h1>
          <motion.p
            className="mt-1 text-text-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            Manage loans and track payments
          </motion.p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" />
            Create Loan
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <Table
            columns={[
              { key: 'borrower_name', label: 'Borrower' },
              {
                key: 'principal_amount',
                label: 'Principal',
                render: (value) => formatCurrency(value),
              },
              {
                key: 'total_paid',
                label: 'Paid',
                render: (value) => formatCurrency(value),
              },
              {
                key: 'remaining_balance',
                label: 'Balance',
                render: (value) => formatCurrency(value),
              },
              {
                key: 'status',
                label: 'Status',
                render: (value: string) => (
                  <StatusBadge status={value as any}>{value.charAt(0).toUpperCase() + value.slice(1)}</StatusBadge>
                ),
              },
              {
                key: 'id',
                label: 'Actions',
                render: (_, row) => (
                  <motion.div
                    className="flex gap-2"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <motion.button
                      onClick={() => navigate(`/loans/${row.id}`)}
                      className="rounded-lg p-1 text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleOpenModal(row)}
                      className="rounded-lg p-1 text-slate-dark transition-colors hover:bg-slate-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit2 size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(row.id)}
                      className="rounded-lg p-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </motion.div>
                ),
              },
            ]}
            data={loans}
            keyExtractor={(row) => row.id}
            loading={loading}
          />
        </Card>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        title={editingId ? 'Edit Loan' : 'Create Loan'}
        onClose={handleCloseModal}
        onConfirm={handleSubmit}
        confirmText={editingId ? 'Update' : 'Create'}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <label className="mb-2 block text-sm font-semibold text-slate-dark">Borrower</label>
            <select
              value={formData.borrower}
              onChange={(e) => setFormData({ ...formData, borrower: e.target.value })}
              className={`input-field transition-all duration-200 ${errors.borrower ? 'border-red-500 ring-red-100' : ''}`}
            >
              <option value="">Select a borrower</option>
              {borrowers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.full_name}
                </option>
              ))}
            </select>
            {errors.borrower && (
              <motion.p
                className="mt-1 text-sm text-red-500"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.borrower}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Input
              label="Principal Amount"
              type="number"
              step="0.01"
              value={formData.principal_amount}
              onChange={(e) => setFormData({ ...formData, principal_amount: e.target.value })}
              error={errors.principal_amount}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <Input
              label="Interest Rate (%)"
              type="number"
              step="0.01"
              value={formData.interest_rate}
              onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
              error={errors.interest_rate}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Input
              label="Term (months)"
              type="number"
              value={formData.term_months}
              onChange={(e) => setFormData({ ...formData, term_months: e.target.value })}
              error={errors.term_months}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <Input
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              error={errors.start_date}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Input
              label="Due Date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              error={errors.due_date}
            />
          </motion.div>
        </motion.div>
      </Modal>
    </motion.div>
  );
};
