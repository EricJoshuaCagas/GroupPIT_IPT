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
    { path: '/', label: 'Dashboard', icon: BarChart3 },
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
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl hover:opacity-80 transition-opacity">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <BarChart3 size={32} />
              </motion.div>
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                LoanTracker
              </span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated && links.map(({ path, label, icon: Icon }) => (
              <motion.div
                key={path}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Link
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(path)
                      ? 'bg-white bg-opacity-20 font-semibold shadow-lg'
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon size={20} />
                  <span className="hidden lg:inline">{label}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Right Side - User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
                >
                  <User size={20} />
                  <span className="hidden lg:inline truncate">{user.first_name} {user.last_name}</span>
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-3 hover:bg-gray-100 rounded-t-lg transition-colors flex items-center gap-2"
                      >
                        <User size={18} />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-b-lg transition-colors flex items-center gap-2 text-red-600 font-medium"
                      >
                        <LogOut size={18} />
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
                  className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden pb-4 space-y-2 border-t border-white border-opacity-10"
            >
              {isAuthenticated && links.map(({ path, label, icon: Icon }, index) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(path)
                        ? 'bg-white bg-opacity-20 font-semibold'
                        : 'hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <Icon size={22} />
                    {label}
                  </Link>
                </motion.div>
              ))}

              {isAuthenticated && user && (
                <>
                  <div className="border-t border-white border-opacity-10 my-2"></div>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
                  >
                    <User size={22} />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-all text-red-200 font-medium"
                  >
                    <LogOut size={22} />
                    Logout
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <div className="border-t border-white border-opacity-10 my-2"></div>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all font-medium"
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
