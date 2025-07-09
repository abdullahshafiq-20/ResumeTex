import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Sparkles,
  Zap,
  Stars,
  Brain,
  Settings,
  Cpu,
  Target,
  Wand2,
  Bot,
  X,
  Info,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useProcessing } from "../context/ProcessingContext";

// Mobile-Optimized Target Role Title Modal
const TargetRoleTitleModal = ({ isOpen, onClose, currentTitle, onSave }) => {
  const [titleInput, setTitleInput] = useState(currentTitle || "");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setTitleInput(currentTitle || "");
  }, [currentTitle, isOpen]);

  useEffect(() => {
    const trimmed = titleInput.trim();
    setIsValid(
      trimmed.length >= 3 && /[a-zA-Z]/.test(trimmed) && trimmed.length <= 100
    );
  }, [titleInput]);

  const handleSave = () => {
    if (isValid) {
      onSave(titleInput.trim());
      onClose();
    }
  };

  const handleClose = (e) => {
    if (e.target === e.currentTarget && !isValid) {
      return;
    }
    if (isValid) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-xl p-3 sm:p-5 w-full max-w-sm sm:max-w-md mx-2 sm:mx-4 shadow-xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Compact */}
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-6 h-6 sm:w-9 sm:h-9 bg-purple-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                <Target className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                  Target Role Title
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  Required for AI transformation
                </p>
              </div>
            </div>
            {isValid && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 sm:p-1"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
          </div>

          {/* Explanation - Compact */}
          <div className="mb-3 sm:mb-5">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5 sm:p-4">
              <div className="flex items-start">
                <Info className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 mt-0.5 mr-1.5 sm:mr-2 flex-shrink-0" />
                <div className="text-[10px] sm:text-xs text-purple-800">
                  <p className="font-medium mb-1.5 sm:mb-2">Why is this important?</p>
                  <ul className="space-y-0.5 sm:space-y-1 list-disc list-inside">
                    <li>Tailors your resume content to match the specific role</li>
                    <li>Optimizes keywords for ATS (Applicant Tracking Systems)</li>
                    <li>Highlights relevant skills and experiences</li>
                    <li>Increases your chances of getting noticed by recruiters</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Input Field - Compact */}
          <div className="mb-3 sm:mb-5">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Enter your target role title
            </label>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="e.g., Senior Software Engineer..."
              className={`w-full px-2.5 py-2 sm:px-3 sm:py-3 border rounded-lg text-xs sm:text-sm transition-all duration-200 focus:ring-2 focus:outline-none ${
                titleInput && isValid
                  ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                  : titleInput && !isValid
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
              }`}
              autoFocus
            />

            {/* Validation feedback - Compact */}
            <div className="mt-1.5 sm:mt-2 flex items-center space-x-1.5 sm:space-x-2">
              {titleInput &&
                (isValid ? (
                  <div className="flex items-center text-[10px] sm:text-xs text-green-600">
                    <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    <span>Great! This title looks professional</span>
                  </div>
                ) : (
                  <div className="flex items-center text-[10px] sm:text-xs text-red-600">
                    <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    <span>Please enter at least 3 characters with letters</span>
                  </div>
                ))}
            </div>

            {/* Examples - Compact */}
            <div className="mt-2 sm:mt-3">
              <p className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1">
                Examples:
              </p>
              <div className="flex flex-wrap gap-1">
                {[
                  "Full Stack Developer",
                  "Frontend Developer", 
                  "AI Engineer",
                  "Data Scientist"
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setTitleInput(example)}
                    className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[10px] sm:text-xs transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons - Compact */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleSave}
              disabled={!isValid}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center space-x-1.5 sm:space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
            >
              <Target className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Set Target Role</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function FileUploader({
  onFileUpload,
  apiUrl,
  template,
  disable = false,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [pdfurl, setPdfurl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [processingMessage, setProcessingMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash");
  const [selectedApi, setSelectedApi] = useState("api_1");
  const [pId, setpId] = useState(null);
  const [resumeTitle, setResumeTitle] = useState("");
  const [showTitleModal, setShowTitleModal] = useState(false);
  const { getUserId, isAuthenticated } = useAuth();
  const { startProcessing, stopProcessing, updateProcessingMessage } =
    useProcessing();

  const modelOptions = [
    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash", type: "Fast" },
    // { value: "Gemini 1.5 Pro", label: "Gemini 1.5 Pro", type: "Balanced" },
    // { value: "GPT-4", label: "GPT-4", type: "Premium" },
    // { value: "Claude 3", label: "Claude 3", type: "Advanced" },
  ];

  const apiOptions = [
    { value: "api_1", label: "API Endpoint 1", status: "Primary" },
    { value: "api_2", label: "API Endpoint 2", status: "Secondary" },
    { value: "api_3", label: "API Endpoint 3", status: "Backup" },
    { value: "api_4", label: "API Endpoint 4", status: "Backup" },
    { value: "api_5", label: "API Endpoint 5", status: "Backup" },
  ];

  // Auto-upload when file is selected
  useEffect(() => {
    if (selectedFile && !isUploaded && !isUploading) {
      handleUploadFile();
    }
  }, [selectedFile]);

  const handleFileSelect = (event) => {
    if (disable) return;
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadProgress(0);
      setIsUploading(false);
      setIsUploaded(false);
      // Remove auto-generation of title - let user fill manually
      setResumeTitle("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disable) return;
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setUploadProgress(0);
      setIsUploading(false);
      setIsUploaded(false);
      // Remove auto-generation of title - let user fill manually
      setResumeTitle("");
    }
  };

  const handleUploadFile = async () => {
    if (disable || !selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const response = await api.post(`${apiUrl}/upload-pdf`, formData, {
        headers: {
          "Content-Type": "application/pdf",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setIsUploading(false);
      setIsUploaded(true);
      if (onFileUpload) {
        onFileUpload(response.data);
        setPdfurl(response.data.data.url);
        setpId(response.data.data.publicId);
      }

      // Automatically show title modal after successful upload
      setTimeout(() => {
        setShowTitleModal(true);
      }, 500); // Small delay to let the upload success animation complete
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      toast.error("Upload failed. Please try again.");
    }
  };

  const handleDelete = () => {
    if (disable) return;
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsUploaded(false);
    setResumeTitle("");
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      setProcessingStep("processing");
      setProcessingMessage("AI is analyzing your resume...");
      startProcessing("AI is analyzing your resume...");

      const source = new EventSource(
        `${apiUrl}/onboard-resume?pdfUrl=${pdfurl}&pref=${resumeTitle}&apiKey=${selectedApi}&genmodel=${selectedModel}&token=${localStorage.getItem(
          "token"
        )}`
      );

      source.addEventListener("Extracting data", (event) => {
        setProcessingMessage("Extracting data from PDF...");
      });

      source.addEventListener(`Fetching data for : ${resumeTitle}`, (event) => {
        setProcessingMessage("Doing some magic...");
      });

      source.addEventListener("Adding resume to user", (event) => {
        setProcessingMessage("Adding resume to your collection...");
      });

      source.addEventListener("complete", (event) => {
        const data = JSON.parse(event.data);
        setProcessingStep("complete");
        setProcessingMessage("Process complete!");
        source.close();
        setIsProcessing(false);
        stopProcessing();
        onFileUpload({
          stage: "process",
          data: {
            pdfUrl: data.pdfUrl,
            publicId: pId,
            pdfName: resumeTitle,
          },
        });
      });

      source.addEventListener("error", (event) => {
        try {
          console.log("SSE Error Event:", event);

          if (event.data && event.data !== "undefined") {
            const errorData = JSON.parse(event.data);
            console.error("Error processing resume:", errorData);
            stopProcessing();

            if (errorData.errorCode === "EMAIL_MISMATCH") {
              toast.error(`${errorData.error}`, {
                duration: 6000,
                style: {
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                },
              });
            } else {
              toast.error(`Processing failed: ${errorData.error}`);
              stopProcessing();
            }
          } else {
            console.error("SSE Error: No valid data received");
            toast.error("Processing failed: Connection error");
            stopProcessing();
          }
        } catch (parseError) {
          console.error("Failed to parse error data:", parseError);
          toast.error("Processing failed: Invalid response format");
          stopProcessing();
        }

        source.close();
        setIsProcessing(false);
        setProcessingStep("idle");
        setProcessingMessage("");
        stopProcessing();
      });

      // source.onerror = (event) => {
      //   console.error("SSE Connection Error:", event);
      //   toast.error("Connection lost. Please try again.");
      //   source.close();
      //   setIsProcessing(false);
      //   setProcessingStep("idle");
      //   setProcessingMessage("");
      // };
    } catch (error) {
      console.error("Processing failed:", error);
      toast.error(`Processing failed: ${error.message || "Unknown error"}`);
      setIsProcessing(false);
      setProcessingStep("idle");
      setProcessingMessage("");
      stopProcessing();
    }
  };

  const handleTitleClick = () => {
    if (!disable) {
      setShowTitleModal(true);
    }
  };

  const handleTitleSave = (newTitle) => {
    setResumeTitle(newTitle);
    setShowTitleModal(false);
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 border border-gray-200 rounded-lg shadow-sm relative overflow-hidden">
      {/* Smaller floating blobs for mobile */}
      <div className="absolute top-0 right-0 w-16 h-16 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-200/40 to-purple-200/30 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-200/30 to-pink-200/20 blur-2xl"></div>

      <div className="relative z-10 p-3 sm:p-6">
        {/* Header - Compact */}
        <div className="flex items-center justify-between mb-3 sm:mb-6">
          <h3 className="text-xs sm:text-lg font-semibold text-gray-800 flex items-center">
            <Upload className="h-3 w-3 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-blue-600" />
            Resume Upload & Processing
          </h3>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] sm:text-xs text-gray-600 font-small">
              Auto-upload
            </span>
          </div>
        </div>

        {/* Main Upload Area - Compact */}
        <div className="mb-3 sm:mb-6">
          {!selectedFile ? (
            <div
              className="border-2 border-dashed border-blue-300/60 rounded-xl p-4 sm:p-8 text-center hover:border-blue-400 hover:bg-blue-50/40 transition-all duration-300 cursor-pointer bg-white/60 backdrop-blur-sm"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <div className="relative">
                <div className="mx-auto w-8 h-8 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-2 sm:mb-4">
                  <Upload className="h-4 w-4 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-800 mb-1 sm:mb-2">
                  Drop your resume here or{" "}
                  <span className="text-blue-600 underline">browse files</span>
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  PDF files only • Auto-uploads on select
                </p>
              </div>
              <input
                id="fileInput"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disable}
              />
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-2.5 sm:p-4 relative overflow-hidden">
              <div className="absolute top-1 right-1 w-3 h-3 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-green-200 to-blue-200 opacity-30 blur-sm"></div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-3 w-3 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to process
                  </p>
                </div>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700 text-[10px] sm:text-xs font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200"
                  disabled={disable}
                >
                  Remove
                </button>
              </div>

              {isUploading && (
                <div className="mt-2 sm:mt-3">
                  <div className="bg-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-600 mt-1 font-medium">
                    Auto-uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Configuration Panel - Compact */}
        {selectedFile && (
          <div className="space-y-3 sm:space-y-4">
            {/* AI Configuration - Compact */}
            <div className="backdrop-blur-sm rounded-xl p-3 sm:p-5">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-4 flex items-center">
                <Brain className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-purple-600" />
                AI Configuration
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                {/* Model Selection - Compact */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-2">
                    AI Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm transition-all duration-200"
                    disabled={disable}
                  >
                    {modelOptions.map((model) => (
                      <option key={model.value} value={model.value}>
                        {model.label} ({model.type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* API Selection - Compact */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-2">
                    API Endpoint
                  </label>
                  <select
                    value={selectedApi}
                    onChange={(e) => setSelectedApi(e.target.value)}
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm transition-all duration-200"
                    disabled={disable}
                  >
                    {apiOptions.map((api) => (
                      <option key={api.value} value={api.value}>
                        {api.label} ({api.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Resume Title - Compact */}
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1.5 sm:mb-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <button
                    type="button"
                    onClick={handleTitleClick}
                    disabled={disable}
                    className="flex items-center hover:text-purple-600 transition-colors cursor-pointer disabled:cursor-default disabled:hover:text-gray-700"
                  >
                    <Target className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-gray-600" />
                    Target Role Title
                  </button>
                  <span className="text-[10px] sm:text-xs text-purple-600 bg-purple-100 px-1.5 py-0.5 sm:px-2 rounded-full sm:ml-2 self-start sm:self-auto">
                    Transforms entire resume
                  </span>
                </label>
                <div
                  onClick={handleTitleClick}
                  className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm transition-all duration-200 ${
                    !disable
                      ? "cursor-pointer hover:border-purple-400 hover:shadow-sm"
                      : "cursor-default"
                  } ${
                    resumeTitle
                      ? "focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      : ""
                  }`}
                >
                  <input
                    type="text"
                    value={resumeTitle}
                    readOnly
                    placeholder="Click to set your target role title..."
                    className="w-full bg-transparent outline-none cursor-pointer placeholder-gray-400"
                    disabled={disable}
                  />
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                  💡 Tip: Be specific with the role title to get the best transformation results
                </p>
              </div>
            </div>

            {/* Process Button - Compact */}
            {isUploaded && (
              <button
                onClick={handleProcess}
                disabled={isProcessing || !resumeTitle.trim() || disable}
                className="w-full group relative px-4 py-2.5 sm:px-6 sm:py-4 bg-transparent border border-purple-500 hover:border-purple-600 text-purple-600 hover:text-purple-700 rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 hover:bg-purple-50 transform disabled:transform-none"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50/0 via-purple-100/50 to-purple-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>

                {/* Main content */}
                <div className="relative flex items-center justify-center space-x-2 sm:space-x-3">
                  {isProcessing ? (
                    <>
                      <div className="relative">
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-purple-500 border-t-transparent"></div>
                      </div>
                      <span className="font-semibold">Processing with AI...</span>
                      <Stars className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse text-purple-500" />
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:rotate-12" />
                      <span className="font-semibold">Transform Resume with {selectedModel}</span>
                      <Bot className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 group-hover:scale-110" />
                    </>
                  )}
                </div>
              </button>
            )}
          </div>
        )}

        {/* Processing Status - Compact */}
        {isProcessing && (
          <div className="mt-3 sm:mt-6 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border border-purple-200 rounded-xl p-3 sm:p-5 relative overflow-hidden">
            <div className="relative flex items-center space-x-2 sm:space-x-4">
              <div className="relative">
                <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                  <Brain className="h-3 w-3 sm:h-5 sm:w-5 text-purple-600 animate-pulse" />
                </div>
                <div className="absolute inset-0 border-2 border-transparent border-t-purple-400 rounded-full animate-spin"></div>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1 sm:mb-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-purple-800">
                    AI Processing Active
                  </h4>
                  <div className="flex space-x-0.5 sm:space-x-1">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-purple-600 font-medium">
                  {processingMessage}
                </p>
              </div>

              <div className="relative">
                <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-500 animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Target Role Title Modal */}
      <TargetRoleTitleModal
        isOpen={showTitleModal}
        onClose={() => setShowTitleModal(false)}
        currentTitle={resumeTitle}
        onSave={handleTitleSave}
      />
    </div>
  );
}
