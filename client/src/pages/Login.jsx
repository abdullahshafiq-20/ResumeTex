import React from "react";
import { motion } from "framer-motion";
import Squares from "../components/background/Squares";
import "../App.css";

export default function LoginPage() {
  const handleLogin = () => {
    // Redirect to your backend Google OAuth endpoint
    window.location.href = import.meta.env.VITE_API_URL + "/auth/google";
    
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Squares */}
      <div className="fixed inset-0 z-0">
        <Squares
          speed={0.1}
          squareSize={30}
          direction="diagonal"
          borderColor="rgba(0, 0, 0, 0.01)"
          hoverFillColor="#2563EB"
        />
      </div>

      {/* Login Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden backdrop-blur-sm bg-white/90">
            {/* Logo at the top of card */}
            <div className="pt-8 pb-4 flex justify-center">
              <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                <img
                  src="/logo.png"
                  alt="ResumeTex Logo"
                  className="h-12 w-auto"
                />
              </div>
            </div>

            {/* Card Content */}
            <div className="px-8 pb-8 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Welcome</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Log in to manage and create professional resumes
                </p>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-md shadow-sm transition duration-200 group"
              >
                <svg
                  className="w-5 h-5"
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
                <span className="font-medium">Continue with Google</span>
              </button>

              <div className="text-center text-xs text-gray-500 mt-4">
                By continuing, you agree to our
                <a href="#" className="text-blue-600 hover:underline ml-1">
                  Terms of Service
                </a>{" "}
                and
                <a href="#" className="text-blue-600 hover:underline ml-1">
                  Privacy Policy
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t text-center">
              <p className="text-xs text-gray-500">
                © 2025 ResumeTex. All rights reserved.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}