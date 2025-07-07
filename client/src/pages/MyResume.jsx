import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FileUploader from "../components/FileUploader";
import PDFCard from "../components/PdfCard";
import { useResumes } from "../context/ResumeContext";
import { Wand2, Rocket, Target, Sparkles, Brain, Upload, X, Info, CheckCircle, AlertCircle, Lightbulb, FileText, Zap } from "lucide-react";
import { useDashboard } from "../context/DashbaordContext";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const apiUrl = import.meta.env.VITE_API_URL;

// Simple Resume Upload Modal Component
const SimpleResumeUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [titleInput, setTitleInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isValid, setIsValid] = useState(false);

  // Title suggestions for simple resume names
  const titleSuggestions = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "AI Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Cybersecurity Engineer",
    "DevOps Engineer",
  ];

  useEffect(() => {
    // Validation: at least 3 characters, not just spaces, and contains letters
    const trimmed = titleInput.trim();
    setIsValid(
      trimmed.length >= 3 && 
      /[a-zA-Z]/.test(trimmed) && 
      trimmed.length <= 100
    );
  }, [titleInput]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file only');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size should be less than 10MB');
        return;
      }
      setSelectedFile(file);
      handleUploadFile(file);
    }
  };

  const handleUploadFile = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await api.post(`${apiUrl}/upload-pdf`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setIsUploading(false);
      setPdfUrl(response.data.data.url);
      toast.success("Resume uploaded successfully!");
      
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      toast.error("Upload failed. Please try again.");
    }
  };

  const handleAnalyze = async () => {
    if (!isValid || !pdfUrl) {
      toast.error("Please provide a valid title and upload a resume");
      return;
    }

    setIsAnalyzing(true);
    try {
      await onUpload(pdfUrl, titleInput.trim());
      onClose();
      // Reset state
      setTitleInput("");
      setSelectedFile(null);
      setPdfUrl(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClose = () => {
    if (!isAnalyzing) {
      onClose();
      // Reset state
      setTitleInput("");
      setSelectedFile(null);
      setPdfUrl(null);
      setUploadProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mr-3">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Simple Resume Upload
                </h3>
                <p className="text-xs text-gray-500">Upload resume as-is to your collection</p>
              </div>
            </div>
            {!isAnalyzing && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Simple Upload Explanation */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-2">Simple Upload Mode:</p>
                  <ul className="space-y-1 list-disc list-inside text-xs">
                    <li><strong>No AI transformation</strong> - Your resume stays exactly as it is</li>
                    <li>Basic analysis extracts summary, skills, and projects</li>
                    <li>Perfect for storing resumes without modifications</li>
                    <li>Quick way to add existing resumes to your collection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload Resume (PDF)
            </label>
            
            {!selectedFile ? (
              <div 
                className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => document.getElementById("simpleUploadFileInput").click()}
              >
                <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload your resume</p>
                <p className="text-xs text-gray-400">PDF files only, max 10MB</p>
                <input
                  id="simpleUploadFileInput"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-md bg-red-100">
                      <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  {pdfUrl ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  )}
                </div>
                
                {/* Upload Progress */}
                {isUploading && (
                  <div className="mt-3">
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Resume Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume Title
            </label>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="e.g., My Current Resume, Professional Resume..."
              className={`w-full px-3 py-3 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:outline-none ${
                titleInput && isValid
                  ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                  : titleInput && !isValid
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              disabled={isAnalyzing}
            />
            
            {/* Validation feedback */}
            <div className="mt-2 flex items-center space-x-2">
              {titleInput && (
                isValid ? (
                  <div className="flex items-center text-xs text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span>Perfect title for your resume collection</span>
                  </div>
                ) : (
                  <div className="flex items-center text-xs text-red-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>Please enter at least 3 characters with letters</span>
                  </div>
                )
              )}
            </div>
            
            {/* Title Suggestions */}
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-600 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-1">
                {titleSuggestions.slice(0, 6).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setTitleInput(suggestion)}
                    className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs transition-colors"
                    disabled={isAnalyzing}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleAnalyze}
              disabled={!isValid || !pdfUrl || isAnalyzing}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-green-600"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding to Collection...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>Add to Collection</span>
                </>
              )}
            </button>
            
            {!isAnalyzing && (
              <button
                onClick={handleClose}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const MyResume = () => {
  const { resumes, loading, isSocketConnected, deleteResume } = useResumes();
  const { lastUpdated, isLive } = useDashboard();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showSimpleUploadModal, setShowSimpleUploadModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { getUserId } = useAuth();

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

  // Handle Simple Resume Upload
  const handleSimpleUpload = async (pdfUrl, title) => {
    setIsAnalyzing(true);
    try {
      const response = await api.post('/manual-resume', {
        pdfUrl: pdfUrl,
        pref: title
      });

      toast.success(`Resume "${title}" added to your collection!`);
      
      // Trigger resume list refresh
      // The new resume should appear in the list automatically via socket events
      
    } catch (error) {
      console.error('Simple upload failed:', error);
      
      // More detailed error handling
      if (error.response?.data?.error) {
        toast.error(`Upload failed: ${error.response.data.error}`);
      } else {
        toast.error('Upload failed. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
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

  // Handle resume deletion
  const handleDeleteResume = async (resumeId) => {
    try {
      await deleteResume(resumeId);
      // The resumes state will be updated automatically via socket events
    } catch (error) {
      console.error('Failed to delete resume:', error);
      throw error; // Re-throw to let PDFCard handle the error display
    }
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

      {/* Header */}
      <motion.div
        className="mb-6"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-1">My Resumes</h2>
        <p className="text-sm text-gray-600">
          Upload and manage your resume collection with AI-powered tools
        </p>
      </motion.div>

      {/* Upload Options Section */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-1 gap-6">
        
        {/* AI Resume Transformation */}
        <motion.div
          className="relative overflow-hidden"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="border border-purple-200 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-lg p-4 relative overflow-hidden">
            {/* Subtle animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-2 left-1/4 w-4 h-4 bg-purple-200/40 rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-2 right-1/3 w-3 h-3 bg-blue-200/30 rounded-full animate-pulse delay-700"></div>
              <div className="absolute top-1/2 right-6 w-2 h-2 bg-indigo-200/50 rounded-full animate-pulse delay-1000"></div>
            </div>
            
            <div className="relative flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <Wand2 className="h-5 w-5 text-purple-600 animate-pulse" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-sm font-semibold text-gray-800">AI Resume Transformation</h3>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-400"></div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  <strong>Smart AI tweaking:</strong> Upload your resume and target job title. 
                  AI will transform and optimize your entire resume content to match the position perfectly.
                </p>
                
                <div className="flex items-center space-x-2 text-xs mb-3">
                  <Target className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-500">Example: "AI Engineer" → Complete resume refactoring</span>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Zap className="h-4 w-4 text-purple-600 animate-pulse delay-500" />
              </div>
            </div>

            {/* FileUploader spans full width */}
            <div className="w-full mt-4">
              <FileUploader
                apiUrl={apiUrl}
                template="v2"
                onFileUpload={handleFileUpload}
                onUploadStart={handleUploadStart}
                onUploadError={handleUploadError}
              />
            </div>
          </div>
        </motion.div>

        {/* Simple Resume Upload */}
        <motion.div
          className="relative overflow-hidden"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 relative h-full">
            {/* Background decoration */}
            <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-green-200 opacity-20 blur-xl"></div>
            
            <div className="relative flex items-start space-x-4 h-full">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Simple Resume Upload
                    </h3>
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    <strong>No modifications:</strong> Upload your existing resume as-is to your collection. 
                    Perfect for storing resumes without any AI tweaking or changes.
                  </p>
                  
                  <div className="flex items-center space-x-2 text-xs mb-4">
                    <Info className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-500">Basic analysis + secure storage</span>
                  </div>
                  
                </div>
                
                <button
                  onClick={() => setShowSimpleUploadModal(true)}
                  disabled={isAnalyzing}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      <span>Simple Upload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

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
              AI is transforming your resume... This may take a few moments.
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
              Resume processed and added to your collection!
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
                onDelete={handleDeleteResume}
                resumeId={resume._id}
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

      {/* Simple Resume Upload Modal */}
      <SimpleResumeUploadModal
        isOpen={showSimpleUploadModal}
        onClose={() => setShowSimpleUploadModal(false)}
        onUpload={handleSimpleUpload}
      />
    </div>
  );
};

export default MyResume;
