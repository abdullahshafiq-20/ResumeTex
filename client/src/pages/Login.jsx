import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Shield, Sparkles, ArrowRight, X, Mail, Lock, CheckCircle } from "lucide-react";
import "../App.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Floating Blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>
      <div className="blob blob4"></div>
      <div className="blob blob5"></div>



      {/* Overlay for better readability */}
      <div className="fixed inset-0 z-5 bg-white/5 backdrop-blur-[0.2px]"></div>

      {/* Floating Particles */}
      <div className="fixed inset-0 z-5 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>


      {/* White Overlay beneath the card */}
      <div className="fixed inset-0 z-8 bg-white/20 backdrop-blur-sm"></div>

      {/* Login Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Main Login Card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Card Background with Glass Effect */}
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl overflow-hidden relative">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-blue-50/50 pointer-events-none"></div>

              {/* Floating elements inside card */}
              <motion.div
                className="absolute top-3 right-3 w-1.5 h-1.5 bg-purple-400/30 rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-4 left-4 w-1 h-1 bg-blue-400/30 rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
              />

              {/* Logo Section */}
              <motion.div
                className="pt-4 pb-3 flex flex-col items-center relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-lg bg-transparent flex items-center border border-gray-200 justify-center mb-2 shadow-sm"
                  // whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src="/logo.png" 
                    alt="ResumeTex Logo" 
                    className="w-16 h-16 object-contain"
                  />
                </motion.div>

                <motion.h1
                  className="text-lg font-bold text-gray-800 mb-1"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(139, 92, 246, 0.1)",
                      "0 0 20px rgba(59, 130, 246, 0.15)",
                      "0 0 10px rgba(139, 92, 246, 0.1)",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  ResumeTex
                </motion.h1>
                <p className="text-xs text-gray-500 text-center max-w-xs leading-relaxed px-2">
                  AI-Powered Resume Transformation
                </p>
              </motion.div>

              {/* Welcome Section */}
              <motion.div
                className="px-4 sm:px-6 pb-3 text-center relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >

                <p className="text-xs text-gray-600 leading-relaxed px-2">
                  Sign in to transform your resume with AI magic and create stunning LaTeX documents.
                </p>
              </motion.div>

              {/* Login Button */}
              <motion.div
                className="px-4 sm:px-6 pb-4 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.button
                  onClick={handleLoginClick}
                  className="group w-full flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-gray-800 border border-gray-200 hover:border-purple-300 px-4 py-2.5 rounded-lg transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
                  whileHover={{
                    scale: 1.02,
                    y: -1,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Subtle shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/50 to-transparent opacity-0 group-hover:opacity-100"
                    animate={{ x: [-200, 200] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

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
                    <motion.div
                      className="group-hover:translate-x-0.5 transition-transform duration-200"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </motion.div>
                  </div>
                </motion.button>

                {/* Trust Indicators */}
                <motion.div
                  className="mt-3 flex items-center justify-center space-x-4 text-xs text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span>AI-Powered</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Terms Section */}
              <motion.div
                className="px-4 sm:px-6 pb-3 text-center text-xs text-gray-500 leading-relaxed relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                By continuing, you agree to our{" "}
                <motion.a
                  href="#"
                  className="text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                >
                  Terms
                </motion.a>{" "}
                and{" "}
                <motion.a
                  href="#"
                  className="text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                >
                  Privacy Policy
                </motion.a>
              </motion.div>

              {/* Footer */}
              <motion.div
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-gray-50/80 to-purple-50/80 border-t border-gray-100/50 text-center relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <p className="text-xs text-gray-500">
                  © 2025 ResumeTex
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Privacy Info Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            {/* Modal Content */}
            <motion.div
              className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/30 pointer-events-none"></div>

              {/* Modal Header */}
              <div className="pt-6 pb-4 px-6 text-center relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Email Permission Required
                </h2>
                <p className="text-sm text-gray-600">
                  Understanding our email access
                </p>
              </div>

              {/* Modal Body */}
              <div className="px-6 pb-6 space-y-4 relative z-10">
                {/* Info Points */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <Mail className="w-3 h-3 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <strong>Direct Email Sending:</strong> We require sensitive scope access to send emails directly from your account, so you won't be overwhelmed with sending them one by one.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <strong>User Control:</strong> This action is solely taken by you, not us. You have complete control over when emails are sent.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <Lock className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <strong>Encrypted Data:</strong> We save encrypted data that only you have access to. Your data is encoded - even we cannot decode it or read it.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Encouragement Message */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                  <p className="text-sm text-center text-gray-700 font-medium">
                    🚀 Happy using ResumeTex and get hired quickly!
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-6">
                  <motion.button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleProceedLogin}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
