import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '../context/AuthContext';
import { useProcessing } from '../context/ProcessingContext';
import logo from '../../public/logo.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser, user } = useAuth();
  const { getUserProfile } = useAuth();
  const { isProcessing, processingMessage } = useProcessing();

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

  // Function to get a gradient based on user data
  const getUserGradient = (user) => {
    const gradients = [
      'bg-gradient-to-br from-blue-500 to-indigo-600',
      'bg-gradient-to-br from-purple-500 to-pink-600', 
      'bg-gradient-to-br from-green-500 to-teal-600',
      'bg-gradient-to-br from-orange-500 to-red-600',
      'bg-gradient-to-br from-cyan-500 to-blue-600',
      'bg-gradient-to-br from-violet-500 to-purple-600',
      'bg-gradient-to-br from-emerald-500 to-green-600',
      'bg-gradient-to-br from-rose-500 to-pink-600',
      'bg-gradient-to-br from-amber-500 to-orange-600',
      'bg-gradient-to-br from-slate-500 to-gray-600'
    ];

    // Use email or name to consistently select a gradient for each user
    const identifier = user?.email || user?.name || 'default';
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      const char = identifier.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  // Enhanced function to safely get user profile with fallbacks
  const getSafeUserProfile = () => {
    try {
      return getUserProfile() || user || {};
    } catch (error) {
      console.warn('Error getting user profile, falling back to user data:', error);
      return user || {};
    }
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

      {/* Sidebar - Compact mobile-friendly design */}
      <motion.div
        className="fixed inset-y-4 left-4 z-30 w-64 lg:w-64 overflow-y-auto lg:relative lg:inset-auto"
        variants={sidebarVariants}
        initial="hidden"
        animate={isOpen || window.innerWidth >= 1024 ? "visible" : "hidden"}
        transition={sidebarTransition}
      >
        <div className="h-full rounded-lg border border-gray-200 bg-white shadow-lg relative overflow-hidden">
          {/* Reduced gradient blobs - smaller and less opacity for cleaner mobile look */}
          <div className="absolute top-2 left-2 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-25 blur-md lg:opacity-40 lg:blur-lg"></div>
          <div className="absolute bottom-4 right-1 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 opacity-20 blur-sm lg:opacity-35 lg:blur-md"></div>
          <div className="hidden lg:block absolute top-16 right-2 w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-30 blur-md"></div>
          
          {/* Content - Compact spacing */}
          <div className="relative flex flex-col h-full py-3 sm:py-4 lg:py-6 px-3 sm:px-4">
            {/* Compact Brand Logo */}
            <div className="flex items-center justify-start mb-4 sm:mb-6 lg:mb-8">
              <Link to="/dashboard" className="flex items-center space-x-1.5 sm:space-x-2" onClick={handleLinkClick}>
                <motion.div
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-md lg:rounded-lg bg-transparent flex items-center border border-gray-200 justify-center"
                >
                  <img 
                    src="/logo.png" 
                    alt="ResumeTex Logo" 
                    className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 object-contain"
                  />
                </motion.div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="font-semibold text-sm sm:text-base lg:text-lg text-gray-800">ResumeTex</span>
                  
                  {/* Beta tag */}
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    BETA
                  </span>
                  
                  {/* Compact blinking dot when AI is processing */}
                  <AnimatePresence>
                    {isProcessing && (
                      <motion.div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: [1, 0.2, 1],
                          scale: [1, 0.8, 1]
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ 
                          duration: Math.random() * 2 + 1,
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: Math.random() * 2
                        }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            </div>
            
            {/* Compact User Profile Card */}
            {user && (
              <div className="mb-3 sm:mb-4 lg:mb-6 p-2 sm:p-3 border border-gray-200 rounded-md lg:rounded-lg">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {/* Compact Profile Avatar */}
                  <div className="flex-shrink-0">
                    {getSafeUserProfile().picture ? (
                      <div className="relative">
                        <img 
                          src={getSafeUserProfile().picture} 
                          alt="Profile" 
                          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full object-cover ring-1 lg:ring-2 ring-white shadow-sm"
                          onError={(e) => {
                            // Hide the image and show gradient fallback if image fails to load
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        {/* Hidden gradient fallback that shows if image fails */}
                        <div 
                          className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full ${getUserGradient(user)} items-center justify-center text-white font-medium text-xs sm:text-sm shadow-sm ring-1 lg:ring-2 ring-white transition-all duration-200 hover:scale-105 hover:shadow-md hidden`}
                        >
                          {getUserInitials(user)}
                        </div>
                      </div>
                    ) : (
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full ${getUserGradient(user)} flex items-center justify-center text-white font-medium text-xs sm:text-sm shadow-sm ring-1 lg:ring-2 ring-white transition-all duration-200 hover:scale-105 hover:shadow-md`}>
                        {getUserInitials(user)}
                      </div>
                    )}
                  </div>
                  
                  {/* Compact User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                      {getSafeUserProfile().name || 'User'}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {getSafeUserProfile().email || 'No email'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Compact Navigation */}
            <nav className="flex-1 space-y-0.5 sm:space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      onClick={handleLinkClick}
                      className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-colors duration-150 group relative text-xs sm:text-sm ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 border border-blue-500 font-medium'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600 border border-transparent'
                      }`}
                    >
                      <item.icon className={`h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2.5 transition-colors duration-150 ${
                        isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                      }`} />
                      <span className={`text-xs sm:text-sm ${isActive ? 'font-medium' : 'font-normal'}`}>{item.name}</span>
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Compact Logout Button */}
            <div className="pt-2 sm:pt-3 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 group border border-transparent hover:border-red-200 text-xs sm:text-sm"
              >
                <LogoutIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2.5 text-gray-500 group-hover:text-red-600 transition-colors duration-150" />
                <span className="font-normal text-xs sm:text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// Compact professional matched icons
const DashboardIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

const EnvelopeIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
  </svg>
);

const BriefcaseIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.20-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
  </svg>
);

const LogoutIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default Sidebar;