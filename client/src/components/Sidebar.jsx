import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser, user } = useAuth();

  // Navigation menu items with professional matched icons
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
    { name: 'My Resumes', href: '/my-resume', icon: DocumentTextIcon },
    { name: 'Preferences', href: '/preferences', icon: CogIcon },
    { name: 'Posts', href: '/posts', icon: NewspaperIcon },
    { name: 'Email', href: '/email', icon: EnvelopeIcon },
    { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
  ];

  // Handle link click with auto-close on mobile
  const handleLinkClick = () => {
    // Close sidebar on mobile devices when link is clicked
    if (window.innerWidth < 1024 && toggleSidebar) {
      toggleSidebar();
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutUser(); // Call logout from AuthContext
      navigate('/login'); // Redirect to login page
      if (toggleSidebar) {
        toggleSidebar(); // Close sidebar on mobile
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logout fails
      navigate('/login');
    }
  };

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
        className="fixed inset-y-4 left-4 z-30 w-64 lg:w-64 overflow-y-auto lg:relative lg:inset-auto"
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
        <div className="h-full rounded-lg border border-gray-200 bg-white shadow-lg relative overflow-hidden">
          {/* Bigger gradient blobs with blur */}
          <div className="absolute top-4 left-4 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-50 blur-2xl"></div>
          <div className="absolute bottom-8 right-2 w-28 h-28 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 opacity-45 blur-xl"></div>
          <div className="absolute top-24 right-4 w-24 h-24 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-40 blur-xl"></div>
          <div className="absolute bottom-24 left-2 w-26 h-26 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-300 opacity-35 blur-2xl"></div>
          <div className="absolute top-40 left-8 w-20 h-20 rounded-full bg-gradient-to-br from-pink-200 to-rose-300 opacity-30 blur-lg"></div>
          
          {/* Content */}
          <div className="relative flex flex-col h-full py-6 px-4">
            {/* Brand Logo */}
            <div className="flex items-center justify-center mb-8">
              <Link to="/dashboard" className="flex items-center space-x-2" onClick={handleLinkClick}>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl h-10 w-10 shadow-md">
                  R
                </div>
                <span className="font-semibold text-lg text-gray-800">ResumeWizard</span>
              </Link>
            </div>
            
            {/* User Info */}
            {user && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {user.email}
                </p>
              </div>
            )}
            
            <nav className="flex-1 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      onClick={handleLinkClick}
                      className={`flex items-center px-3 py-2 rounded-md transition-all duration-200 group relative text-sm ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 border border-blue-500 font-medium'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600 border border-transparent'
                      }`}
                    >
                      <item.icon className={`h-4 w-4 mr-2.5 transition-colors ${
                        isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                      }`} />
                      <span className={`text-sm ${isActive ? 'font-medium' : 'font-normal'}`}>{item.name}</span>
                    </Link>
                  </div>
                );
              })}
            </nav>

            <div className="pt-3 mt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group border border-transparent hover:border-red-200 text-sm"
              >
                <LogoutIcon className="h-4 w-4 mr-2.5 text-gray-500 group-hover:text-red-600 transition-colors" />
                <span className="font-normal text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// Professional matched icons
const DashboardIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
  </svg>
);

const DocumentTextIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CogIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const NewspaperIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

const EnvelopeIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
  </svg>
);

const BriefcaseIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const LogoutIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default Sidebar;