import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import FileUploader from "../components/FileUploader";
import PDFCard from "../components/PdfCard";
import { useResumes } from "../context/ResumeContext";

const apiUrl = import.meta.env.VITE_API_URL;

const MyResume = () => {
  const { resumes, loading, isSocketConnected } = useResumes();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Memoize console logs to prevent infinite logging
  const debugInfo = useMemo(() => ({
    resumesCount: resumes ? resumes.length : 0,
    isUploading,
    uploadSuccess,
    socketConnected: isSocketConnected
  }), [resumes, isUploading, uploadSuccess, isSocketConnected]);

  // Only log when values actually change
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Debug Info:", debugInfo);
    }
  }, [debugInfo]);

  // Handle file upload completion
  const handleFileUpload = async (data) => {
    console.log("File upload completed:", data);
    setIsUploading(false);
    setUploadSuccess(true);
    
    console.log("Resume will be updated automatically via socket");

    // Hide success message after 3 seconds
    setTimeout(() => {
      setUploadSuccess(false);
    }, 3000);
  };

  // Handle upload start
  const handleUploadStart = () => {
    console.log("Upload started");
    setIsUploading(true);
    setUploadSuccess(false);
  };

  // Handle upload error
  const handleUploadError = (error) => {
    console.error("Upload error:", error);
    setIsUploading(false);
    setUploadSuccess(false);
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
    hover: {
      y: -5,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Socket Connection Status */}
      <motion.div
        className={`mb-4 p-3 rounded-lg shadow-sm ${
          isSocketConnected 
            ? "bg-green-50 border border-green-200" 
            : "bg-red-50 border border-red-200"
        }`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${isSocketConnected ? "bg-green-500" : "bg-red-500"}`}></div>
          <span className={`text-sm font-medium ${isSocketConnected ? "text-green-700" : "text-red-700"}`}>
            {isSocketConnected ? "🟢 Live updates enabled" : "🔴 Live updates disconnected"}
          </span>
        </div>
      </motion.div>

      {/* Important Notice Header */}
      <motion.div
        className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start space-x-3">
          <div className="h-5 w-5 text-amber-600 mt-0.5">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-amber-800 font-semibold text-sm mb-1">Important Notice</h3>
            <p className="text-amber-700 text-sm">
              Please ensure your uploaded CV contains the same email address you logged in with. 
              {isSocketConnected 
                ? " Your resumes will update automatically in real-time once processing is complete."
                : " You may need to refresh the page to see updates if live updates are disabled."
              }
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Resumes</h2>
        <p className="text-gray-600">
          Manage and organize your resume collection
          {isSocketConnected && <span className="text-green-600 ml-2">• Live updates active</span>}
        </p>
      </motion.div>

      <motion.div
        className="mb-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <FileUploader
          apiUrl={apiUrl}
          template="v2"
          onFileUpload={handleFileUpload}
          onUploadStart={handleUploadStart}
          onUploadError={handleUploadError}
        />
      </motion.div>

      {/* Show uploading indicator */}
      {isUploading && (
        <motion.div
          className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-700 font-medium">
              Processing your resume... This may take a few moments.
              {isSocketConnected && " You'll see the new resume appear automatically when ready."}
            </span>
          </div>
        </motion.div>
      )}

      {/* Show success message */}
      {uploadSuccess && (
        <motion.div
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="flex items-center space-x-3">
            <div className="h-5 w-5 text-green-600">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-green-700 font-medium">
              Resume uploaded successfully!
              {isSocketConnected && " It will appear in your collection automatically."}
            </span>
          </div>
        </motion.div>
      )}

      {/* Loading state */}
      {loading && !isUploading && (
        <motion.div
          className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
            <span className="text-gray-700 font-medium">
              Loading resumes...
            </span>
          </div>
        </motion.div>
      )}

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={resumes?.length || 0}
      >
        {resumes && resumes.map((resume, index) => (
          <motion.div
            key={resume._id}
            variants={itemVariants}
            whileHover="hover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }
            }}
          >
            <PDFCard
              pdfUrl={resume.resume_link}
              imageUrl={resume.thumbnail}
              title={resume.resume_title}
              owner={`Modified: ${formatDate(resume.updatedAt)}`}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Show empty state if no resumes and not uploading/loading */}
      {resumes && resumes.length === 0 && !isUploading && !loading && (
        <motion.div
          className="text-center py-16 bg-white border border-gray-200 rounded-lg shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-gray-500 text-lg mb-2">No resumes yet</div>
          <div className="text-gray-400">Upload your first resume to get started!</div>
          {isSocketConnected && (
            <div className="text-green-600 text-sm mt-2">
              ✓ Real-time updates are active - new resumes will appear instantly
            </div>
          )}
        </motion.div>
      )}

      {/* Debug info in development - only show when values change */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm shadow-sm">
          <strong>Debug Info:</strong>
          <br />
          Resumes count: {debugInfo.resumesCount}
          <br />
          Is uploading: {debugInfo.isUploading ? 'Yes' : 'No'}
          <br />
          Is loading: {loading ? 'Yes' : 'No'}
          <br />
          Upload success: {debugInfo.uploadSuccess ? 'Yes' : 'No'}
          <br />
          Socket connected: {debugInfo.socketConnected ? 'Yes' : 'No'}
        </div>
      )}
    </div>
  );
};

export default MyResume;