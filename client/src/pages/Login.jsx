import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Shield, Sparkles, ArrowRight, X, Mail, Lock, CheckCircle } from "lucide-react";
import "../App.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const [showModal, setShowModal] = useState(false);

  // Detect if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleLoginClick = () => {
    setShowModal(true);
  };

  const handleProceedLogin = () => {
    // Redirect to your backend Google OAuth endpoint
    window.location.href = apiUrl + "/auth/google";
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Simplified animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  // Reduced motion transitions
  const cardTransition = prefersReducedMotion 
    ? { duration: 0 }
    : { duration: 0.3, ease: "easeOut" };

  const modalTransition = prefersReducedMotion 
    ? { duration: 0 }
    : { duration: 0.2, ease: "easeOut" };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Simplified Background - fewer blobs, hidden on mobile */}
      <div className="hidden md:block blob blob1"></div>
      <div className="hidden md:block blob blob2"></div>
      <div className="blob blob3"></div>

      {/* Simplified overlay */}
      <div className="fixed inset-0 z-5 bg-white/10 backdrop-blur-[0.1px]"></div>

      {/* Reduced floating particles - fewer and hidden on mobile */}
      {!prefersReducedMotion && (
        <div className="hidden md:block fixed inset-0 z-5 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 8,
                delay: Math.random() * 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Simplified white overlay */}
      <div className="fixed inset-0 z-8 bg-white/15 backdrop-blur-sm"></div>

      {/* Login Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Main Login Card */}
          <motion.div
            className="relative"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={cardTransition}
          >
            {/* Card Background with Glass Effect */}
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl overflow-hidden relative">
              {/* Simplified gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/30 pointer-events-none"></div>

              {/* Logo Section */}
              <div className="pt-4 pb-3 flex flex-col items-center relative z-10">
                <div className="w-20 h-20 rounded-lg bg-transparent flex items-center border border-gray-200 justify-center mb-2 shadow-sm">
                  <img 
                    src="/logo.png" 
                    alt="ResumeTex Logo" 
                    className="w-16 h-16 object-contain"
                  />
                </div>

                <h1 className="text-lg font-bold text-gray-800 mb-1">
                  ResumeTex
                </h1>
                <p className="text-xs text-gray-500 text-center max-w-xs leading-relaxed px-2">
                  AI-Powered Resume Transformation
                </p>
              </div>

              {/* Welcome Section */}
              <div className="px-4 sm:px-6 pb-3 text-center relative z-10">
                <p className="text-xs text-gray-600 leading-relaxed px-2">
                  Sign in to transform your resume with AI magic and create stunning LaTeX documents.
                </p>
              </div>

              {/* Login Button */}
              <div className="px-4 sm:px-6 pb-4 relative z-10">
                <motion.button
                  onClick={handleLoginClick}
                  className="group w-full flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-gray-800 border border-gray-200 hover:border-purple-300 px-4 py-2.5 rounded-lg transition-colors duration-200 backdrop-blur-sm relative overflow-hidden"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="flex items-center space-x-2 relative z-10">
                    {/* Google Icon */}
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span className="font-medium text-sm">
                      Continue with Google
                    </span>
                    <ArrowRight className="w-3 h-3 opacity-60" />
                  </div>
                </motion.button>

                {/* Trust Indicators */}
                <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span>AI-Powered</span>
                  </div>
                </div>
              </div>

              {/* Terms Section */}
              <div className="px-4 sm:px-6 pb-3 text-center text-xs text-gray-500 leading-relaxed relative z-10">
                By continuing, you agree to our{" "}
                <a href="#" className="text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200">
                  Privacy Policy
                </a>
              </div>

              {/* Footer */}
              <div className="px-4 sm:px-6 py-2 bg-gradient-to-r from-gray-50/80 to-purple-50/80 border-t border-gray-100/50 text-center relative z-10">
                <p className="text-xs text-gray-500">
                  © 2025 ResumeTex
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile-Responsive Privacy Info Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={modalTransition}
          >
            {/* Modal Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            {/* Mobile-Responsive Modal Content */}
            <motion.div
              className="relative w-full max-w-sm sm:max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={modalTransition}
            >
              {/* Close button for mobile */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 sm:hidden"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              {/* Simplified gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 via-transparent to-blue-50/20 pointer-events-none"></div>

              {/* Modal Header */}
              <div className="pt-4 sm:pt-6 pb-3 sm:pb-4 px-4 sm:px-6 text-center relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  Email Permission Required
                </h2>
                <p className="text-sm text-gray-600">
                  Understanding our email access
                </p>
              </div>

              {/* Modal Body */}
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4 relative z-10">
                {/* Info Points */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        <strong>Direct Email Sending:</strong> We require sensitive scope access to send emails directly from your account, so you won't be overwhelmed with sending them one by one.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        <strong>User Control:</strong> This action is solely taken by you, not us. You have complete control over when emails are sent.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        <strong>Encrypted Data:</strong> We save encrypted data that only you have access to. Your data is encoded - even we cannot decode it or read it.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Encouragement Message */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                  <p className="text-xs sm:text-sm text-center text-gray-700 font-medium">
                    🚀 Happy using ResumeTex and get hired quickly!
                  </p>
                </div>

                {/* Action Buttons - Stacked on mobile, side by side on desktop */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
                  <motion.button
                    onClick={closeModal}
                    className="w-full px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleProceedLogin}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
                  >
                    Continue with Google
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
