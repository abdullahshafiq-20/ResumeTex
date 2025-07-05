import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationToast from '../components/NotificationToast';
import { useProcessing } from '../context/ProcessingContext';

const DashboardLayout = () => {
  // Set sidebarOpen to true by default for larger screens
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const { isProcessing } = useProcessing();
  
  // Track window resize to automatically show sidebar on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 p-2 sm:p-4 gap-2 sm:gap-4 relative overflow-hidden">
      {/* Aurora Border Effect - Only when AI is processing */}
      <AnimatePresence>
        {isProcessing && (
          <>
            {/* Top Border */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-1 z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-full h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60 blur-sm"
                animate={{ 
                  background: [
                    "linear-gradient(90deg, transparent, #3b82f6, transparent)",
                    "linear-gradient(90deg, transparent, #8b5cf6, transparent)",
                    "linear-gradient(90deg, transparent, #06b6d4, transparent)",
                    "linear-gradient(90deg, transparent, #3b82f6, transparent)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Right Border */}
            <motion.div
              className="absolute top-0 right-0 bottom-0 w-1 z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.div 
                className="w-full h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-60 blur-sm"
                animate={{ 
                  background: [
                    "linear-gradient(180deg, transparent, #8b5cf6, transparent)",
                    "linear-gradient(180deg, transparent, #ec4899, transparent)",
                    "linear-gradient(180deg, transparent, #6366f1, transparent)",
                    "linear-gradient(180deg, transparent, #8b5cf6, transparent)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.75 }}
              />
            </motion.div>

            {/* Bottom Border */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <motion.div 
                className="w-full h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60 blur-sm"
                animate={{ 
                  background: [
                    "linear-gradient(270deg, transparent, #6366f1, transparent)",
                    "linear-gradient(270deg, transparent, #06b6d4, transparent)",
                    "linear-gradient(270deg, transparent, #8b5cf6, transparent)",
                    "linear-gradient(270deg, transparent, #6366f1, transparent)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              />
            </motion.div>

            {/* Left Border */}
            <motion.div
              className="absolute top-0 left-0 bottom-0 w-1 z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <motion.div 
                className="w-full h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-60 blur-sm"
                animate={{ 
                  background: [
                    "linear-gradient(0deg, transparent, #06b6d4, transparent)",
                    "linear-gradient(0deg, transparent, #3b82f6, transparent)",
                    "linear-gradient(0deg, transparent, #ec4899, transparent)",
                    "linear-gradient(0deg, transparent, #06b6d4, transparent)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2.25 }}
              />
            </motion.div>

            {/* Corner Glows */}
            <motion.div 
              className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-transparent opacity-50 blur-xl z-50 pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-purple-400 to-transparent opacity-50 blur-xl z-50 pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-cyan-400 to-transparent opacity-50 blur-xl z-50 pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div 
              className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-pink-400 to-transparent opacity-50 blur-xl z-50 pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <motion.div 
        className="flex-1 flex flex-col overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <div className="container mx-auto">
            <div className="flex items-center mb-4 sm:mb-6">
              {/* Mobile sidebar toggle */}
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-blue-600 mr-4 focus:outline-none lg:hidden"
              >
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6H20M4 12H20M4 18H11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            
            {/* Page content will be rendered here */}
            <Outlet />
          </div>
        </main>
      </motion.div>
      
      {/* Add notification toast */}
      <NotificationToast />
    </div>
  );
};

export default DashboardLayout;