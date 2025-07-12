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

  const handleTermsClick = () => {
    window.location.href = "/terms-of-servic";
  };

  const handlePrivacyClick = () => {
    window.location.href = "/privacy-policy";
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
      {/* Ultra-minimal background - only on larger screens */}
      <div className="hidden lg:block blob blob1"></div>
      <div className="hidden lg:block blob blob2"></div>
      <div className="hidden sm:block blob blob3"></div>

      {/* Minimal overlay */}
      <div className="fixed inset-0 z-5 bg-white/5 backdrop-blur-[0.05px]"></div>

      {/* Fewer floating particles - only on desktop */}
      {!prefersReducedMotion && (
        <div className="hidden lg:block fixed inset-0 z-5 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/10 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 6,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Minimal white overlay */}
      <div className="fixed inset-0 z-8 bg-white/5 backdrop-blur-sm"></div>

      {/* Login Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-2 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-xs sm:max-w-sm">
          {/* Main Login Card - Ultra compact */}
          <motion.div
            className="relative"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={cardTransition}
          >
            {/* Card Background with Glass Effect */}
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden relative">
              {/* Simplified gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 via-transparent to-blue-50/20 pointer-events-none"></div>

              {/* Ultra-compact Logo Section */}
              <div className="pt-3 sm:pt-4 pb-2 sm:pb-3 flex flex-col items-center relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-transparent flex items-center border border-gray-200 justify-center mb-1 sm:mb-2 shadow-sm">
                  <img 
                    src="/logo.png" 
                    alt="ResumeTex Logo" 
                    className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                  />
                </div>

                <h1 className="text-base sm:text-lg font-bold text-gray-800 mb-0.5 sm:mb-1">
                  ResumeTex
                </h1>
                <p className="text-xs text-gray-500 text-center max-w-xs leading-tight px-2">
                  AI-Powered Resume Transformation
                </p>
              </div>

              {/* Compact Welcome Section */}
              <div className="px-3 sm:px-4 pb-2 sm:pb-3 text-center relative z-10">
                <p className="text-xs text-gray-600 leading-tight px-1 sm:px-2">
                  Sign in to transform your resume with AI magic and create stunning LaTeX documents.
                </p>
              </div>

              {/* Compact Login Button */}
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 relative z-10">
                <motion.button
                  onClick={handleLoginClick}
                  className="group w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-white/90 hover:bg-white text-gray-800 border border-gray-200 hover:border-purple-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg transition-colors duration-200 backdrop-blur-sm relative overflow-hidden"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="flex items-center space-x-1.5 sm:space-x-2 relative z-10">
                    {/* Compact Google Icon */}
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
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
                    <span className="font-medium text-xs sm:text-sm">
                      Continue with Google
                    </span>
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-60" />
                  </div>
                </motion.button>

                {/* Compact Trust Indicators */}
                <div className="mt-2 sm:mt-3 flex items-center justify-center space-x-3 sm:space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-0.5 sm:space-x-1">
                    <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500" />
                    <span className="text-xs">Secure</span>
                  </div>
                  <div className="flex items-center space-x-0.5 sm:space-x-1">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-500" />
                    <span className="text-xs">AI-Powered</span>
                  </div>
                </div>
              </div>

              {/* Compact Terms Section */}
              <div className="px-3 sm:px-4 pb-2 sm:pb-3 text-center text-xs text-gray-500 leading-tight relative z-10">
                By continuing, you agree to our{" "}
                <a href="/terms-of-service" className="text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200">
                  Terms
                </a>{" "}
                and{" "}
                <a href="/privacy-policy" className="text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200">
                  Privacy Policy
                </a>
              </div>

              {/* Compact Footer */}
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-50/60 to-purple-50/60 border-t border-gray-100/50 text-center relative z-10">
                <p className="text-xs text-gray-500">
                  © 2025 ResumeTex
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ultra-compact Mobile-First Privacy Info Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={modalTransition}
          >
            {/* Modal Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            {/* Ultra-compact Modal Content */}
            <motion.div
              className="relative w-full max-w-xs sm:max-w-sm mx-auto bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={modalTransition}
            >
              {/* Always visible close button */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 z-20 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              </button>

              {/* Simplified gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/10 via-transparent to-blue-50/10 pointer-events-none"></div>

              {/* Compact Modal Header */}
              <div className="pt-3 sm:pt-4 pb-2 sm:pb-3 px-3 sm:px-4 text-center relative z-10">
                <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <h2 className="text-sm sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">
                  Email Permission Required
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Understanding our email access
                </p>
              </div>

              {/* Compact Modal Body */}
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2 sm:space-y-3 relative z-10">
                {/* Compact Info Points */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <Mail className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-700 leading-tight">
                        <strong>Direct Email Sending:</strong> We require sensitive scope access to send emails directly from your account, so you won't be overwhelmed with sending them one by one.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-700 leading-tight">
                        <strong>User Control:</strong> This action is solely taken by you, not us. You have complete control over when emails are sent.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <Lock className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-700 leading-tight">
                        <strong>Encrypted Data:</strong> We save encrypted data that only you have access to. Your data is encoded - even we cannot decode it or read it.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compact Encouragement Message */}
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-md sm:rounded-lg border border-purple-100">
                  <p className="text-xs text-center text-gray-700 font-medium">
                    🚀 Happy using ResumeTex and get hired quickly!
                  </p>
                </div>

                {/* Compact Action Buttons - Always stacked on mobile */}
                <div className="flex flex-col space-y-2 mt-3 sm:mt-4">
                  <motion.button
                    onClick={handleProceedLogin}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-md sm:rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium shadow-lg"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
                  >
                    Continue with Google
                  </motion.button>
                  <motion.button
                    onClick={closeModal}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 text-gray-600 rounded-md sm:rounded-lg hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm font-medium"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
                  >
                    Cancel
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
