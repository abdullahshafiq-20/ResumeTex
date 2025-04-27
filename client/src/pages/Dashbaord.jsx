import React from 'react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <>
      <motion.h2 
        className="text-2xl font-semibold text-gray-700 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Welcome to your Resume Dashboard
      </motion.h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white shadow rounded-lg p-6 border border-gray-200/60">
          <h3 className="font-semibold text-lg mb-2">My Resumes</h3>
          <p className="text-gray-600">Manage all your created resumes</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 border border-gray-200/60">
          <h3 className="font-semibold text-lg mb-2">Templates</h3>
          <p className="text-gray-600">Browse available resume templates</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 border border-gray-200/60">
          <h3 className="font-semibold text-lg mb-2">Profile</h3>
          <p className="text-gray-600">Update your personal information</p>
        </div>
      </motion.div>
    </>
  );
};

export default Dashboard;