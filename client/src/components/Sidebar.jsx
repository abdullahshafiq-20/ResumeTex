import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '../context/AuthContext';
import logo from '../../public/logo.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser, user } = useAuth();
  const { getUserProfile } = useAuth();

  // Detect if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  // Optimized animation variants for better mobile performance
  const sidebarVariants = {
    hidden: { x: -280 },
    visible: { x: 0 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // Reduced motion transitions
  const sidebarTransition = prefersReducedMotion 
    ? { duration: 0 }
    : { 
        type: "tween", 
        ease: "easeOut", 
        duration: 0.15 
      };

  const overlayTransition = prefersReducedMotion 
    ? { duration: 0 }
    : { duration: 0.1 };

  // Function to get user initials for default avatar
  const getUserInitials = (user) => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={overlayTransition}
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={toggleSidebar}
          ></motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className="fixed inset-y-4 left-4 z-30 w-64 lg:w-64 overflow-y-auto lg:relative lg:inset-auto"
        variants={sidebarVariants}
        initial="hidden"
        animate={isOpen || window.innerWidth >= 1024 ? "visible" : "hidden"}
        transition={sidebarTransition}
      >
        <div className="h-full rounded-lg border border-gray-200 bg-white shadow-lg relative overflow-hidden">
          {/* Reduced gradient blobs - fewer and less blur for mobile performance */}
          <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-40 blur-lg md:w-32 md:h-32 md:blur-2xl md:opacity-50"></div>
          <div className="absolute bottom-8 right-2 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 opacity-35 blur-md md:w-28 md:h-28 md:blur-xl md:opacity-45"></div>
          <div className="hidden md:block absolute top-24 right-4 w-24 h-24 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-40 blur-xl"></div>
          
          {/* Content */}
          <div className="relative flex flex-col h-full py-6 px-4">
            {/* Brand Logo */}
            <div className="flex items-center justify-start mb-8">
              <Link to="/dashboard" className="flex items-center space-x-2" onClick={handleLinkClick}>
                <motion.div
                  className="w-14 h-14 rounded-lg bg-transparent flex items-center border border-gray-200 justify-center"
                >
                  <img 
                    src="/logo.png" 
                    alt="ResumeTex Logo" 
                    className="w-10 h-10 object-contain"
                  />
                </motion.div>
                <span className="font-semibold text-lg text-gray-800">ResumeTex</span>
              </Link>
            </div>
            
            {/* Simple User Profile Card */}
            {user && (
              <div className="mb-6 p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  {/* Profile Avatar */}
                  <div className="flex-shrink-0">
                    {getUserProfile().picture ? (
                      <img 
                        src={getUserProfile().picture} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                        {getUserInitials(user)}
                      </div>
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {getUserProfile().name || 'User'}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {getUserProfile().email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation */}
            <nav className="flex-1 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      onClick={handleLinkClick}
                      className={`flex items-center px-3 py-2 rounded-md transition-colors duration-150 group relative text-sm ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 border border-blue-500 font-medium'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600 border border-transparent'
                      }`}
                    >
                      <item.icon className={`h-4 w-4 mr-2.5 transition-colors duration-150 ${
                        isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                      }`} />
                      <span className={`text-sm ${isActive ? 'font-medium' : 'font-normal'}`}>{item.name}</span>
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="pt-3 mt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 group border border-transparent hover:border-red-200 text-sm"
              >
                <LogoutIcon className="h-4 w-4 mr-2.5 text-gray-500 group-hover:text-red-600 transition-colors duration-150" />
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