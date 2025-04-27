import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Builder", path: "/builder" },
    { name: "Templates", path: "/templates" },
    { name: "About", path: "/about" },
  ];

  return (
    <div className="flex justify-center fixed top-4 left-0 right-0 z-50">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-[90%] max-w-7xl rounded-xl border border-gray-200/60 bg-white/80 relative"
      >
        {/* Background with blurred blobs - contained within the navbar */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          {/* Positioned blobs that stay within the container */}
          <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-blue-300/20 blur-3xl transform translate-x-[-30%] translate-y-[-30%]"></div>
          <div className="absolute bottom-0 right-20 w-32 h-32 rounded-full bg-blue-400/20 blur-2xl"></div>
          <div className="absolute bottom-4 left-10 w-24 h-24 rounded-full bg-indigo-300/20 blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-blue-500/10 blur-xl"></div>
          
          {/* Backdrop overlay */}
          <motion.div
            className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-xl"
            animate={{
              opacity: scrolled ? 0.8 : 0.7,
            }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </div>

        <motion.div
          className="relative flex items-center justify-between"
          animate={{
            padding: scrolled ? "0.5rem 1rem" : "0.75rem 1rem",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                className="bg-[#2563EB] rounded-md flex items-center justify-center text-white font-bold text-xl"
                animate={{
                  height: scrolled ? "2rem" : "2.25rem",
                  width: scrolled ? "2rem" : "2.25rem",
                }}
                transition={{ duration: 0.3 }}
              >
                R
              </motion.div>
              <motion.span
                className="font-semibold hidden sm:block"
                animate={{
                  fontSize: scrolled ? "0.95rem" : "1.125rem",
                }}
                transition={{ duration: 0.3 }}
              >
                ResumeWizard
              </motion.span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-md transition-colors ${
                  location.pathname === link.path
                    ? "text-[#2563EB] font-medium bg-blue-50/80"
                    : "text-gray-600 hover:text-[#2563EB] hover:bg-blue-50/60"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Profile & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Link
              to="/profile"
              className="relative rounded-full overflow-hidden border-2 border-gray-200 hover:border-[#2563EB] transition-colors"
            >
              <motion.div
                className="bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium"
                animate={{
                  height: scrolled ? "2rem" : "2.25rem",
                  width: scrolled ? "2rem" : "2.25rem",
                }}
                transition={{ duration: 0.3 }}
              >
                U
              </motion.div>
            </Link>

            {/* Mobile menu button */}
            <motion.button
              className="md:hidden text-gray-600 hover:text-[#2563EB]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Navigation Menu - with animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="relative md:hidden border-t border-gray-200/60"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="py-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={link.path}
                      className={`block px-4 py-2 rounded-md my-1 mx-2 ${
                        location.pathname === link.path
                          ? "bg-blue-50/80 text-[#2563EB] font-medium"
                          : "text-gray-600 hover:bg-blue-50/60"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shadow effect when scrolled */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl"
          animate={{
            boxShadow: scrolled
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              : "0 0 0 0 rgba(0, 0, 0, 0)",
          }}
          transition={{ duration: 0.3 }}
        ></motion.div>
      </motion.nav>
    </div>
  );
};

export default Navbar;