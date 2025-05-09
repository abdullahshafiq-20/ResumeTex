import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ResumeUploader = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resumeTitle, setResumeTitle] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);
  const { getUserId, isAuthenticated } = useAuth();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    // Check if file is a PDF or TEX file
    const validTypes = ['application/pdf', 'application/x-tex', 'text/x-tex'];
    const fileType = file.type;
    
    if (!validTypes.includes(fileType) && 
        !(fileType === '' && file.name.endsWith('.tex'))) { // Special handling for .tex files
      toast.error('Please upload a PDF or TEX file only');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    // Set a default title based on filename
    setResumeTitle(file.name.split('.')[0].replace(/_/g, ' '));
  };

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setResumeTitle('');
    setDescription('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to upload a resume');
      return;
    }

    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!resumeTitle.trim()) {
      toast.error('Please provide a title for your resume');
      return;
    }

    try {
      setIsUploading(true);
      
      const userId = getUserId();
      if (!userId) {
        throw new Error('User ID not found');
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('resumeTitle', resumeTitle);
      formData.append('description', description);
      formData.append('userId', userId);

      const response = await api.post('/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      toast.success('Resume uploaded successfully');
      setSelectedFile(null);
      setUploadProgress(0);
      setResumeTitle('');
      setDescription('');
      
      if (onUploadComplete) {
        onUploadComplete(response.data);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  // Get the file extension and set appropriate icon color
  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const getIconColor = (extension) => {
    switch(extension) {
      case 'pdf':
        return 'text-red-500';
      case 'tex':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <motion.div 
      className="w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
        <h2 className="text-lg font-semibold text-white">Upload Your Resume</h2>
        <p className="text-xs text-blue-100">PDF and TEX files supported (max 5MB)</p>
      </div>

      {/* Upload Area */}
      <div className="p-4">
        {!selectedFile ? (
          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer transition-all
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 text-blue-500 mb-2" />
            <p className="text-sm text-center text-gray-600 mb-2">
              Drag & drop your resume file here or click to browse
            </p>
            <p className="text-xs text-gray-500">PDF or TEX files only</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.tex"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Preview */}
            <div className="bg-gray-50 p-3 rounded-lg flex items-start">
              <div className={`p-2 rounded-md ${getIconColor(getFileExtension(selectedFile.name))} bg-opacity-10`}>
                <FileText className={`h-8 w-8 ${getIconColor(getFileExtension(selectedFile.name))}`} />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <p className="font-medium text-sm truncate" title={selectedFile.name}>
                    {selectedFile.name}
                  </p>
                  <button 
                    onClick={handleRemoveFile}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {getFileExtension(selectedFile.name).toUpperCase()}
                </p>
                
                {/* Progress Bar */}
                {isUploading && (
                  <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Resume Details Form */}
            <div className="space-y-3">
              <div>
                <label htmlFor="resumeTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Resume Title*
                </label>
                <input
                  type="text"
                  id="resumeTitle"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Software Engineer Resume"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  disabled={isUploading}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a brief description of this version of your resume"
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isUploading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Info Message */}
        <div className="mt-3 p-2 bg-blue-50 rounded-md flex items-start">
          <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="ml-2 text-xs text-blue-800">
            Your resume will be securely stored in your account for easy access and future updates.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 py-3 bg-gray-50 flex justify-end">
        <motion.button
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            selectedFile 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={selectedFile ? { scale: 1.02 } : {}}
          whileTap={selectedFile ? { scale: 0.98 } : {}}
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            'Upload Resume'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResumeUploader;