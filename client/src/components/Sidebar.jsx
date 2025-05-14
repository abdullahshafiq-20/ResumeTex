import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  // Navigation menu items
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'My Resumes', href: '/my-resume', icon: DocumentIcon },
    { name: 'Posts', href: '/posts', icon: TemplateIcon },
    { name: 'Email', href: '/email', icon: UserIcon },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={toggleSidebar}
          ></motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className="fixed inset-y-0 left-0 z-30 w-64 lg:w-64 overflow-y-auto lg:relative lg:inset-auto"
        initial={{ x: -280 }}
        animate={{ 
          x: isOpen || window.innerWidth >= 1024 ? 0 : -280 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 40 
        }}
      >
        <div className="h-full rounded-r-xl border-r border-gray-200/60 bg-white/80 relative">
          {/* Background with blurred blobs - similar to navbar */}
          <div className="absolute inset-0 overflow-hidden rounded-r-xl">
            <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-blue-300/20 blur-3xl transform translate-x-[-30%] translate-y-[-30%]"></div>
            <div className="absolute bottom-0 right-10 w-32 h-32 rounded-full bg-blue-400/20 blur-2xl"></div>
            <div className="absolute top-1/3 left-1/4 w-24 h-24 rounded-full bg-indigo-300/20 blur-2xl"></div>
            
            {/* Backdrop overlay */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md"></div>
          </div>

          {/* Content */}
          <div className="relative flex flex-col h-full py-6 px-4">
            {/* Brand Logo */}
            <div className="flex items-center justify-center mb-8">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="bg-[#2563EB] rounded-md flex items-center justify-center text-white font-bold text-xl h-10 w-10">
                  R
                </div>
                <span className="font-semibold text-lg">ResumeWizard</span>
              </Link>
            </div>
            
            <nav className="flex-1 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center px-4 py-2.5 rounded-md transition-all ${
                        isActive
                          ? 'bg-blue-50/80 text-[#2563EB] font-medium'
                          : 'text-gray-600 hover:bg-blue-50/60 hover:text-[#2563EB]'
                      }`}
                    >
                      <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-[#2563EB]' : 'text-gray-500'}`} />
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="pt-2 mt-6 border-t border-gray-200/60">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/logout"
                  className="flex items-center px-4 py-2.5 rounded-md text-gray-600 hover:bg-red-50/60 hover:text-red-600 transition-all"
                >
                  <LogoutIcon className="h-5 w-5 mr-3 text-gray-500" />
                  Logout
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Subtle shadow on right edge */}
          <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-r from-transparent to-gray-200/50"></div>
        </div>
      </motion.div>
    </>
  );
};

// Icon components remain the same
const HomeIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const DocumentIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const TemplateIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const UserIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SettingsIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default Sidebar;