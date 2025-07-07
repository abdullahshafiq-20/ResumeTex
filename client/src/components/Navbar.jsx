import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";

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
    { name: "Templates", path: "/templates" },
    { name: "Examples", path: "/examples" },
    { name: "Pricing", path: "/pricing" },
  ];

  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200/50" 
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className={`transition-all duration-300 ${
        scrolled ? "max-w-6xl mx-auto px-4" : "max-w-7xl mx-auto px-6"
      }`}>
        <motion.div
          className="flex items-center justify-between"
          animate={{
            padding: scrolled ? "0.75rem 0" : "1rem 0",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center overflow-hidden"
              animate={{
                height: scrolled ? "2rem" : "2.5rem",
                width: scrolled ? "2rem" : "2.5rem",
              }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="/logo.png"
                alt="ResumeTex Logo"
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <FileText className="w-5 h-5 text-white hidden" />
            </motion.div>
            <motion.div
              className="hidden sm:block"
              animate={{
                opacity: scrolled ? 0.9 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                animate={{
                  fontSize: scrolled ? "1.125rem" : "1.25rem",
                }}
                transition={{ duration: 0.3 }}
              >
                ResumeTex
              </motion.span>
              <div className="text-xs text-gray-500 font-medium">
                AI Resume Enhancement
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? "text-purple-600 bg-purple-50"
                    : "text-gray-600 hover:text-purple-600 hover:bg-purple-50/50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className={`px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                scrolled ? "text-sm" : "text-sm"
              }`}
            >
              Get Started
            </Link>

            {/* Mobile menu button */}
            <motion.button
              className="md:hidden text-gray-600 hover:text-purple-600 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
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
                  className="w-5 h-5"
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

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-gray-200/50 bg-white/95"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={link.path}
                      className={`block px-4 py-3 rounded-lg mx-2 text-sm font-medium transition-colors ${
                        location.pathname === link.path
                          ? "bg-purple-50 text-purple-600"
                          : "text-gray-600 hover:bg-purple-50/50 hover:text-purple-600"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="px-2 pt-2">
                  <Link
                    to="/dashboard"
                    className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center rounded-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;