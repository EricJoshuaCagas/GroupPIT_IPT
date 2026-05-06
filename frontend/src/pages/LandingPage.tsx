import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Users,
  FileText,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  Lock,
  Smartphone,
  ChevronDown,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      transition: { duration: 0.6 },
    },
  };

  const features = [
    {
      icon: <BarChart3 size={28} />,
      title: 'Smart Dashboard',
      description: 'Real-time analytics and insights at a glance',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Users size={28} />,
      title: 'Borrower Management',
      description: 'Organize and track all borrowers efficiently',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: <FileText size={28} />,
      title: 'Loan Tracking',
      description: 'Monitor loan details with comprehensive docs',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: <CreditCard size={28} />,
      title: 'Payment Records',
      description: 'Detailed payment tracking and automation',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const stats = [
    { value: '100%', label: 'Secure & Encrypted' },
    { value: '24/7', label: 'Available Anytime' },
    { value: '0ms', label: 'Setup Time' },
  ];

  const testimonials = [
    {
      name: 'Maria Santos',
      role: 'Business Owner',
      text: 'LoanTracker transformed how I manage my lending business. Highly recommended!',
    },
    {
      name: 'Juan Dela Cruz',
      role: 'Financial Manager',
      text: 'The ease of use and powerful features make it indispensable for our team.',
    },
    {
      name: 'Ana Garcia',
      role: 'Entrepreneur',
      text: 'Finally, a solution that understands our needs perfectly.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20"
          animate={{ y: scrollY * 0.5 }}
          transition={{ type: 'spring', stiffness: 100 }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20"
          animate={{ y: -scrollY * 0.5 }}
          transition={{ type: 'spring', stiffness: 100 }}
        />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <BarChart3 size={24} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LoanTracker
              </span>
            </motion.div>

            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium hover:text-blue-400 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-32 pb-20 md:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-4 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full"
              >
                <span className="text-sm font-semibold text-blue-300">✨ Welcome to Financial Freedom</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                Track Your
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Loans Effortlessly
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-lg"
              >
                Simple, smart, and secure loan tracking in one place. Manage borrowers, track payments, and take control of your finances with LoanTracker.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl font-semibold text-white transition-all duration-300 group"
                  >
                    Get Started Free
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-600 hover:border-blue-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-blue-500/10"
                  >
                    Sign In
                    <ArrowRight size={20} />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="grid grid-cols-3 gap-6"
              >
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center sm:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">{stat.value}</div>
                    <p className="text-xs sm:text-sm text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative z-10 hidden md:block"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                {/* Dashboard Mock */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
                  {/* Mock Header */}
                  <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 px-6 py-4 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <span className="text-xs text-slate-400">LoanTracker Dashboard</span>
                    </div>
                  </div>

                  {/* Mock Content */}
                  <div className="p-6 space-y-4">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                        className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg p-3 border border-blue-500/30"
                      >
                        <p className="text-xs text-slate-400 mb-1">Total Loans</p>
                        <p className="text-lg font-bold text-blue-400">₱125,000</p>
                      </motion.div>
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
                        className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg p-3 border border-purple-500/30"
                      >
                        <p className="text-xs text-slate-400 mb-1">Active Borrowers</p>
                        <p className="text-lg font-bold text-purple-400">48</p>
                      </motion.div>
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.4 }}
                        className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg p-3 border border-green-500/30"
                      >
                        <p className="text-xs text-slate-400 mb-1">Paid This Month</p>
                        <p className="text-lg font-bold text-green-400">₱18,500</p>
                      </motion.div>
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
                        className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-lg p-3 border border-orange-500/30"
                      >
                        <p className="text-xs text-slate-400 mb-1">Pending</p>
                        <p className="text-lg font-bold text-orange-400">₱25,000</p>
                      </motion.div>
                    </div>

                    {/* Fake Chart */}
                    <div className="mt-6">
                      <p className="text-xs text-slate-400 mb-3">Payment Trend</p>
                      <div className="flex items-end gap-2 h-16">
                        {[40, 60, 45, 70, 50, 80, 65].map((height, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <motion.div
                  animate={{ x: [-10, 10, -10], y: [-5, 5, -5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-4 -right-4 bg-slate-800 rounded-lg p-3 shadow-lg border border-slate-700/50 w-40"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-400" />
                    <span className="text-xs text-slate-300">Payment Received</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ x: [10, -10, 10], y: [5, -5, 5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-0 -left-4 bg-slate-800 rounded-lg p-3 shadow-lg border border-slate-700/50 w-40"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-blue-400" />
                    <span className="text-xs text-slate-300">+12% This Month</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex justify-center mt-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-slate-400 flex flex-col items-center gap-2"
            >
              <span className="text-sm font-medium">Scroll to explore</span>
              <ChevronDown size={20} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to manage loans and borrowers with confidence
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ translateY: -10 }}
                className="group relative p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`} />

                <div className={`mb-4 p-3 bg-gradient-to-br ${feature.color} w-fit rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Why Choose
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  LoanTracker?
                </span>
              </h2>

              <div className="space-y-6">
                {[
                  { icon: Shield, title: 'Bank-Level Security', desc: 'Your data is encrypted and protected' },
                  { icon: Zap, title: 'Lightning Fast', desc: 'Instant updates and real-time analytics' },
                  { icon: Clock, title: '5-Minute Setup', desc: 'Get started in minutes, not hours' },
                  { icon: Lock, title: 'Privacy First', desc: 'We never sell or share your data' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <div className="p-3 bg-blue-500/20 rounded-lg h-fit border border-blue-500/30">
                      <item.icon size={24} className="text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Smartphone, label: 'Mobile Ready', color: 'from-blue-500' },
                { icon: BarChart3, label: 'Analytics', color: 'from-purple-500' },
                { icon: Users, label: 'Team Collab', color: 'from-green-500' },
                { icon: TrendingUp, label: 'Growth', color: 'from-orange-500' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gradient-to-br ${item.color} to-slate-900 rounded-xl p-6 border border-slate-700/50 text-center`}
                >
                  <item.icon size={32} className="mx-auto mb-3 opacity-80" />
                  <p className="font-semibold text-sm">{item.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by Users
            </h2>
            <p className="text-xl text-slate-400">
              Join thousands of satisfied users managing their loans with LoanTracker
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="text-yellow-400"
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
                <p className="text-slate-300 mb-4 leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-slate-400 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-t border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Take Control?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Start managing your loans smarter today. Sign up for free and get access to all features.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-white group"
              >
                Get Started Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-700/50 py-12 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <BarChart3 size={20} />
                </div>
                <span className="text-lg font-bold">LoanTracker</span>
              </div>
              <p className="text-slate-400">
                Professional loan management for modern businesses.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link to="/login" className="hover:text-blue-400 transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-blue-400 transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="border-t border-slate-700/50 pt-8 text-center text-slate-400"
          >
            <p>&copy; 2026 LoanTracker. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

