import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Users, FileText, CreditCard, Menu, X, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const links = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/borrowers', label: 'Borrowers', icon: Users },
    { path: '/loans', label: 'Loans', icon: FileText },
    { path: '/payments', label: 'Payments', icon: CreditCard },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to={isAuthenticated ? '/dashboard' : '/'}
              className="flex items-center gap-3 text-slate-dark transition-opacity hover:opacity-90"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="rounded-lg bg-primary-500 p-2 text-white"
              >
                <BarChart3 size={24} />
              </motion.div>
              <span className="text-2xl font-bold">LoanTracker</span>
            </Link>
          </motion.div>

          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated &&
              links.map(({ path, label, icon: Icon }) => (
                <motion.div key={path} whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                  <Link
                    to={path}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-all ${
                      isActive(path)
                        ? 'border-primary-200 bg-primary-50 font-semibold text-primary-600 shadow-sm'
                        : 'border-transparent text-slate-dark hover:bg-slate-100 hover:text-primary-600'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden lg:inline">{label}</span>
                  </Link>
                </motion.div>
              ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated && user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-dark transition-colors hover:bg-slate-100"
                >
                  <User size={18} />
                  <span className="hidden max-w-[180px] truncate lg:inline">
                    {user.first_name} {user.last_name}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-white shadow-lg"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-slate-dark transition-colors hover:bg-slate-50"
                      >
                        <User size={17} />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-3 text-left font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut size={17} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 font-medium text-slate-dark transition-colors hover:bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-primary-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-slate-dark transition-colors hover:bg-slate-100 md:hidden"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </motion.button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-2 border-t border-border pb-4 md:hidden"
            >
              {isAuthenticated &&
                links.map(({ path, label, icon: Icon }, index) => (
                  <motion.div
                    key={path}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Link
                      to={path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-all ${
                        isActive(path)
                          ? 'border-primary-200 bg-primary-50 font-semibold text-primary-600'
                          : 'border-transparent text-slate-dark hover:bg-slate-100 hover:text-primary-600'
                      }`}
                    >
                      <Icon size={20} />
                      {label}
                    </Link>
                  </motion.div>
                ))}

              {isAuthenticated && user && (
                <>
                  <div className="my-2 border-t border-border" />
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-dark transition-all hover:bg-slate-100"
                  >
                    <User size={20} />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-medium text-red-600 transition-all hover:bg-red-50"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <div className="my-2 border-t border-border" />
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-4 py-3 text-slate-dark transition-all hover:bg-slate-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg bg-primary-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-primary-600"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
