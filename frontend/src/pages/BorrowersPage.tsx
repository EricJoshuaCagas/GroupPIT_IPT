import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Input, Modal, Table } from '../components';
import { borrowerApi } from '../services/api';
import { Borrower } from '../types';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';

export const BorrowersPage: React.FC = () => {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    contact_number: '',
    email: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadBorrowers();
  }, []);

  const loadBorrowers = async () => {
    setLoading(true);
    try {
      const response = await borrowerApi.getAll();
      setBorrowers(response.data.results);
    } catch (error) {
      // Silently handle errors
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (borrower?: Borrower) => {
    if (borrower) {
      setFormData(borrower);
      setEditingId(borrower.id);
    } else {
      setFormData({ full_name: '', contact_number: '', email: '', address: '' });
      setEditingId(null);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ full_name: '', contact_number: '', email: '', address: '' });
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.contact_number.trim()) newErrors.contact_number = 'Contact number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (editingId) {
        await borrowerApi.update(editingId, formData);
      } else {
        await borrowerApi.create(formData);
      }
      loadBorrowers();
      handleCloseModal();
    } catch (error: any) {
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const errorMessages: Record<string, string> = {};
        Object.keys(apiErrors).forEach((key) => {
          errorMessages[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
        });
        setErrors(errorMessages);
      } else {
        setErrors({ form: 'Failed to save borrower. Please try again.' });
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this borrower?')) {
      try {
        await borrowerApi.delete(id);
        loadBorrowers();
      } catch (error) {
        // Silently handle errors
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="text-blue-600" size={36} />
            Borrowers
          </h1>
          <p className="text-gray-600 mt-2">Manage and track all borrower information</p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Add Borrower
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <Table
            columns={[
              {
                key: 'full_name',
                label: 'Name',
                render: (value) => <span className="font-semibold text-gray-900">{value}</span>,
              },
              {
                key: 'email',
                label: 'Email',
                render: (value) => (
                  <span className="text-blue-600 hover:underline cursor-pointer">{value}</span>
                ),
              },
              {
                key: 'contact_number',
                label: 'Contact',
                render: (value) => <span className="font-medium">{value}</span>,
              },
              {
                key: 'address',
                label: 'Address',
                render: (value) => <span className="text-gray-600 text-sm">{value}</span>,
              },
              {
                key: 'id',
                label: 'Actions',
                render: (_, row) => (
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOpenModal(row)}
                      className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(row.id)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                ),
              },
            ]}
            data={borrowers}
            keyExtractor={(row) => row.id}
            loading={loading}
          />
        </Card>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        title={editingId ? 'Edit Borrower' : 'Add New Borrower'}
        onClose={handleCloseModal}
        onConfirm={handleSubmit}
        confirmText={editingId ? 'Update' : 'Create'}
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter borrower's full name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            error={errors.full_name}
          />
          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />
          <Input
            label="Contact Number"
            placeholder="+63 906 123 4567"
            value={formData.contact_number}
            onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
            error={errors.contact_number}
          />
          <Input
            label="Address"
            placeholder="Enter full address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            error={errors.address}
          />
        </div>
      </Modal>
    </motion.div>
  );
};
