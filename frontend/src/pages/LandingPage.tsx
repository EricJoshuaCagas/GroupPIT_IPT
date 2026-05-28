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
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: <Users size={28} />,
      title: 'Borrower Management',
      description: 'Organize and track all borrowers efficiently',
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: <FileText size={28} />,
      title: 'Loan Tracking',
      description: 'Monitor loan details with comprehensive docs',
      color: 'from-primary-400 to-primary-500',
    },
    {
      icon: <CreditCard size={28} />,
      title: 'Payment Records',
      description: 'Detailed payment tracking and automation',
      color: 'from-primary-500 to-primary-600',
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
    <div className="min-h-screen bg-background text-text-primary overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full blur-3xl opacity-10"
          animate={{ y: scrollY * 0.5 }}
          transition={{ type: 'spring', stiffness: 100 }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400 rounded-full blur-3xl opacity-10"
          animate={{ y: -scrollY * 0.5 }}
          transition={{ type: 'spring', stiffness: 100 }}
        />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                <BarChart3 size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold text-slate-dark">
                LoanTracker
              </span>
            </motion.div>

            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-all"
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
                className="inline-block mb-4 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full"
              >
                <span className="text-sm font-semibold text-primary-600">Welcome to Financial Freedom</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-slate-900"
              >
                Track Your
                <span className="block bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                  Loans Effortlessly
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-lg"
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
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(20, 184, 166, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 rounded-xl font-semibold text-white transition-all duration-300 group shadow-lg hover:shadow-xl"
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
                    className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-300 hover:border-primary-600 text-slate-900 rounded-xl font-semibold transition-all duration-300 hover:bg-primary-50"
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
                    <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1">{stat.value}</div>
                    <p className="text-xs sm:text-sm text-slate-600">{stat.label}</p>
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
                <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
                  {/* Mock Header */}
                  <div className="bg-gradient-to-r from-slate-100 to-white px-6 py-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary-300" />
                        <div className="w-3 h-3 rounded-full bg-primary-500" />
                        <div className="w-3 h-3 rounded-full bg-slate-400" />
                      </div>
                      <span className="text-xs text-slate-600">LoanTracker Dashboard</span>
                    </div>
                  </div>

                  {/* Mock Content */}
                  <div className="p-6 space-y-4">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                        className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-3 border border-primary-200"
                      >
                        <p className="text-xs text-slate-600 mb-1">Total Loans</p>
                        <p className="text-lg font-bold text-primary-600">PHP 125,000</p>
                      </motion.div>
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
                        className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 border border-border"
                      >
                        <p className="text-xs text-slate-600 mb-1">Active Borrowers</p>
                        <p className="text-lg font-bold text-slate-900">48</p>
                      </motion.div>
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.4 }}
                        className="bg-gradient-to-br from-primary-50 to-slate-50 rounded-lg p-3 border border-border"
                      >
                        <p className="text-xs text-slate-600 mb-1">Paid This Month</p>
                        <p className="text-lg font-bold text-primary-600">PHP 18,500</p>
                      </motion.div>
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
                        className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 border border-border"
                      >
                        <p className="text-xs text-slate-600 mb-1">Pending</p>
                        <p className="text-lg font-bold text-slate-dark">PHP 25,000</p>
                      </motion.div>
                    </div>

                    {/* Fake Chart */}
                    <div className="mt-6">
                      <p className="text-xs text-slate-600 mb-3">Payment Trend</p>
                      <div className="flex items-end gap-2 h-16">
                        {[40, 60, 45, 70, 50, 80, 65].map((height, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="flex-1 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t opacity-70 hover:opacity-100 transition-opacity"
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
                  className="absolute -bottom-4 -right-4 bg-white rounded-lg p-3 shadow-lg border border-border w-40"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-primary-600" />
                    <span className="text-xs text-slate-700">Payment Received</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ x: [10, -10, 10], y: [5, -5, 5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-0 -left-4 bg-white rounded-lg p-3 shadow-lg border border-border w-40"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary-600" />
                    <span className="text-xs text-slate-700">+12% This Month</span>
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
              className="text-slate-600 flex flex-col items-center gap-2"
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
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
                className="group relative p-6 rounded-xl bg-white border border-border hover:border-primary-300 transition-all duration-300 shadow-md hover:shadow-xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`} />

                <div className={`mb-4 p-3 bg-gradient-to-br ${feature.color} w-fit rounded-lg group-hover:scale-110 transition-transform duration-300 text-white`}>
                  {feature.icon}
                </div>

                <h3 className="text-lg font-semibold mb-2 text-slate-900 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900">
                Why Choose
                <span className="block bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
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
                    <div className="p-3 bg-primary-100 rounded-lg h-fit border border-primary-200">
                      <item.icon size={24} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-slate-900">{item.title}</h3>
                      <p className="text-slate-600">{item.desc}</p>
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
                { icon: Smartphone, label: 'Mobile Ready', color: 'from-primary-500' },
                { icon: BarChart3, label: 'Analytics', color: 'from-primary-400' },
                { icon: Users, label: 'Team Collab', color: 'from-primary-500' },
                { icon: TrendingUp, label: 'Growth', color: 'from-primary-600' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gradient-to-br ${item.color} to-slate-200 rounded-xl p-6 border border-border text-center text-white shadow-md hover:shadow-lg transition-all`}
                >
                  <item.icon size={32} className="mx-auto mb-3" />
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Loved by Users
            </h2>
            <p className="text-xl text-slate-600">
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
                className="p-6 rounded-xl bg-white border border-border hover:border-primary-300 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="text-primary-500"
                    >*</motion.span>
                  ))}
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-slate-600 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-r from-primary-50 via-slate-50 to-primary-50 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Ready to Take Control?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Start managing your loans smarter today. Sign up for free and get access to all features.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-white group"
              >
                Get Started Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border py-12 bg-slate-dark text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                  <BarChart3 size={20} className="text-white" />
                </div>
                <span className="text-lg font-bold text-white">LoanTracker</span>
              </div>
              <p className="text-slate-300">
                Professional loan management for modern businesses.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <Link to="/login" className="hover:text-accent transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-accent transition-colors">
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
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
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
            className="border-t border-slate-500/40 pt-8 text-center text-slate-300/80"
          >
            <p>&copy; 2026 LoanTracker. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

