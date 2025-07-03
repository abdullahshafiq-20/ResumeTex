import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FileUploader from "../components/FileUploader";
import PDFCard from "../components/PdfCard";
import { useResumes } from "../context/ResumeContext";
import { Wand2, Rocket, Target, Sparkles } from "lucide-react";
import { useDashboard } from "../context/DashbaordContext";

const apiUrl = import.meta.env.VITE_API_URL;

const MyResume = () => {
  const { resumes, loading, isSocketConnected } = useResumes();
  const { lastUpdated, isLive } = useDashboard();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Handle file upload completion
  const handleFileUpload = async (data) => {
    setIsUploading(false);
    setUploadSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setUploadSuccess(false);
    }, 3000);
  };

  // Handle upload start
  const handleUploadStart = () => {
    setIsUploading(true);
    setUploadSuccess(false);
  };

  // Handle upload error
  const handleUploadError = (error) => {
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
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.2 },
    },
};

  return (
    <div className="relative">
      {/* Background gradient blobs */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-15 blur-2xl -z-10"></div>
      <div className="absolute top-32 left-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 opacity-10 blur-xl -z-10"></div>

      {/* Live Status Indicator */}
      {/* Live Status Indicator */}
      <motion.div
        className="mb-6 p-3 rounded-lg border border-gray-200 bg-white relative overflow-hidden"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}></div>
            <span className={`text-sm font-medium ${isLive ? "text-green-700" : "text-yellow-700"}`}>
              Live Update
            </span>
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                • {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded border border-blue-200 hover:border-blue-300 transition-colors"
          >
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Professional AI Notice */}
      <motion.div
        className="mb-6 border border-purple-200 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-lg p-4 relative overflow-hidden"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Subtle animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-2 left-1/4 w-4 h-4 bg-purple-200/40 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-2 right-1/3 w-3 h-3 bg-blue-200/30 rounded-full animate-pulse delay-700"></div>
          <div className="absolute top-1/2 right-6 w-2 h-2 bg-indigo-200/50 rounded-full animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <Wand2 className="h-4 w-4 text-purple-600 animate-pulse" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-sm font-semibold text-gray-800">AI-Powered Resume Transformation</h3>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-400"></div>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 leading-relaxed mb-2">
              Refactor your resume with AI and convert it into non-ATS removable LaTeX format. 
              The title you choose will completely refactor your resume to match the target position.
            </p>
            
            <div className="flex items-center space-x-2 text-xs">
              <Target className="h-3 w-3 text-gray-500" />
              <span className="text-gray-500">Example: "AI Automation Engineer" transforms entire resume focus and content</span>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <Sparkles className="h-4 w-4 text-blue-600 animate-pulse delay-500" />
          </div>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        className="mb-6"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-1">My Resumes</h2>
        <p className="text-sm text-gray-600">
          Manage and organize your resume collection
        </p>
      </motion.div>

      {/* File Uploader */}
      <motion.div
        className="mb-6 relative overflow-hidden"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-20 blur-xl"></div>
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
          className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-700 text-sm font-medium">
              Processing your resume... This may take a few moments.
            </span>
          </div>
        </motion.div>
      )}

      {/* Show success message */}
      {uploadSuccess && (
        <motion.div
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center space-x-3">
            <div className="h-4 w-4 text-green-600">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-green-700 text-sm font-medium">
              Resume uploaded successfully!
            </span>
          </div>
        </motion.div>
      )}

      {/* Resume Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          // Loading skeleton
          [...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden animate-pulse"
              style={{ aspectRatio: '1/1.4' }}
            >
              <div className="h-4/5 bg-gray-200"></div>
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              </div>
            </motion.div>
          ))
        ) : resumes && resumes.length > 0 ? (
          resumes.map((resume, index) => (
            <motion.div key={resume._id || index} variants={itemVariants}>
              <PDFCard
                pdfUrl={resume.resume_link}
                imageUrl={resume.thumbnail}
                title={resume.resume_title || "Untitled Resume"}
                openedDate={formatDate(resume.createdAt)}
                owner={`Created ${formatDate(resume.createdAt)}`}
              />
            </motion.div>
          ))
        ) : (
          <motion.div
            variants={itemVariants}
            className="col-span-full text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No resumes found. Upload your first resume to get started!</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MyResume;
