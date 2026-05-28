import React, { ReactNode } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-border p-6">
                <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="rounded-lg p-1 text-text-secondary transition-colors hover:bg-slate-100 hover:text-slate-dark"
                >
                  <X size={24} />
                </motion.button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">{children}</div>
              <div className="flex items-center gap-3 border-t border-border bg-slate-50 p-6">
                <Button variant="secondary" onClick={onClose} className="flex-1">
                  {cancelText}
                </Button>
                {onConfirm && (
                  <Button
                    variant="primary"
                    onClick={onConfirm}
                    loading={isLoading}
                    className="flex-1"
                  >
                    {confirmText}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
