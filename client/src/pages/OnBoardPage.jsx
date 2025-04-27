import React, { useState, useEffect, useRef } from "react";
import Stepper, { Step } from "../components/Stepper";
import axios from "axios";
import ShinyText from "../components/ShinnyText";
import Navbar from "../components/Navbar";
import Squares from "../components/background/Squares";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import "../App.css";

const OnBoardPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const eventSourceRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // User data states
  const [userData, setUserData] = useState({
    name: "",
    picture: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  
  // Resume preferences states
  const [preferences, setPreferences] = useState({
    pref1: "",
    pref2: "",
    pref3: "",
  });
  
  // Resume upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pId, setpId] = useState(null);
  
  // Processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState("");
  const [processResults, setProcessResults] = useState({
    pdfUrl1: null,
    pdfUrl2: null,
    pdfUrl3: null
  });
  const [processComplete, setProcessComplete] = useState(false);
  const [error, setError] = useState(null);
  
  // Step completion states
  const [stepsCompleted, setStepsCompleted] = useState({
    1: false, // Welcome
    2: false, // Job preferences
    3: false, // Resume upload
    4: false, // Processing
    5: false  // Final
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        
        const response = await axios.get(`${apiUrl}/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data) {
          setUserData({
            name: response.data.name || "User",
            picture: response.data.picture || "",
            email: response.data.email || "",
          });
          // Mark step 1 as completed
          setStepsCompleted(prev => ({ ...prev, 1: true }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [apiUrl, navigate]);

  // Handle preference change
  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Update step completion if first preference is filled
    if (name === 'pref1' && value.trim() !== '') {
      setStepsCompleted(prev => ({ ...prev, 2: true }));
    } else if (name === 'pref1' && value.trim() === '') {
      setStepsCompleted(prev => ({ ...prev, 2: false }));
    }
  };

  // Handle file select
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      setSelectedFile(file);
      setIsUploaded(false);
    }
  };

  // Handle file upload
  const handleUploadFile = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await axios.post(`${apiUrl}/upload-pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
      
      console.log('Upload response:', response.data);
      
      if (response.data && response.data.data && response.data.data.url) {
        setPdfUrl(response.data.data.url);
        setpId(response.data.data.publicId);
        toast.success('Resume uploaded successfully!');
        // Mark step 3 as completed
        setStepsCompleted(prev => ({ ...prev, 3: true }));
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      toast.error('Upload failed. Please try again.');
    }
  };

  // Update the processResume function to better handle all three preferences
  const processResume = async () => {
    if (!pdfUrl) {
      toast.error("Please upload a resume PDF first");
      return;
    }
    
    if (!preferences.pref1) {
      toast.error("Please provide at least one job title preference");
      return;
    }
    
    setIsProcessing(true);
    setProcessStatus("Connecting to server...");
    setError(null);
    
    // Close any existing SSE connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    
    try {
      // Set up SSE connection with query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('pdfUrl', pdfUrl);
      queryParams.append('pref1', preferences.pref1);
      
      if (preferences.pref2) {
        queryParams.append('pref2', preferences.pref2);
      }
      
      if (preferences.pref3) {
        queryParams.append('pref3', preferences.pref3);
      }
      
      const queryString = queryParams.toString();
      eventSourceRef.current = new EventSource(`${apiUrl}/onboard-resume?${queryString}`);
      
      // Handle the Extracting data event
      eventSourceRef.current.addEventListener('Extracting data', (event) => {
        const data = JSON.parse(event.data);
        if (data.status === 'started') {
          setProcessStatus('Extracting data from your resume...');
        } else if (data.status === 'completed') {
          setProcessStatus('Resume data extracted successfully!');
        }
      });
      
      // Handle template-specific events for each preference
      if (preferences.pref1) {
        const eventName1 = `Fetching data for : ${preferences.pref1}`;
        eventSourceRef.current.addEventListener(eventName1, (event) => {
          const data = JSON.parse(event.data);
          if (data.status === 'started') {
            setProcessStatus(`Creating resume for: ${preferences.pref1}...`);
          } else if (data.status === 'completed' && data.data && data.data.pdfUrl) {
            setProcessResults(prev => ({ ...prev, pdfUrl1: data.data.pdfUrl }));
            setProcessStatus(`Template ${preferences.pref1} completed`);
          }
        });
      }
      
      if (preferences.pref2) {
        const eventName2 = `Fetching data for : ${preferences.pref2}`;
        eventSourceRef.current.addEventListener(eventName2, (event) => {
          const data = JSON.parse(event.data);
          if (data.status === 'started') {
            setProcessStatus(`Creating resume for: ${preferences.pref2}...`);
          } else if (data.status === 'completed' && data.data && data.data.pdfUrl) {
            setProcessResults(prev => ({ ...prev, pdfUrl2: data.data.pdfUrl }));
            setProcessStatus(`Template ${preferences.pref2} completed`);
          }
        });
      }
      
      if (preferences.pref3) {
        const eventName3 = `Fetching data for : ${preferences.pref3}`;
        eventSourceRef.current.addEventListener(eventName3, (event) => {
          const data = JSON.parse(event.data);
          if (data.status === 'started') {
            setProcessStatus(`Creating resume for: ${preferences.pref3}...`);
          } else if (data.status === 'completed' && data.data && data.data.pdfUrl) {
            setProcessResults(prev => ({ ...prev, pdfUrl3: data.data.pdfUrl }));
            setProcessStatus(`Template ${preferences.pref3} completed`);
          }
        });
      }
      
      // Handle completion event
      eventSourceRef.current.addEventListener('complete', (event) => {
        const data = JSON.parse(event.data);
        setProcessResults(prev => ({
          pdfUrl1: data.pdfUrl1 || prev.pdfUrl1,
          pdfUrl2: data.pdfUrl2 || prev.pdfUrl2,
          pdfUrl3: data.pdfUrl3 || prev.pdfUrl3,
        }));
        setProcessStatus('All resumes have been created successfully!');
        setProcessComplete(true);
        setIsProcessing(false);
        eventSourceRef.current.close();
        
        // Mark processing step as completed
        setStepsCompleted(prev => ({ ...prev, 4: true }));
      });
      
      // Handle errors
      eventSourceRef.current.addEventListener('error', (err) => {
        console.error('EventSource error:', err);
        setError('Connection error. Please try again.');
        setIsProcessing(false);
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
      });
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Something went wrong');
      setIsProcessing(false);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    }
  };

  // Clean up event source when component unmounts
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // Handle step change
  const handleStepChange = (step) => {
    // Prevent unauthorized navigation
    if (step === 1) {
      // Always allow going back to step 1
      setActiveStep(step);
      return;
    }
    
    // For other steps, check if previous steps are completed
    if (step === 2 && stepsCompleted[1]) {
      setActiveStep(step);
      return;
    }
    
    if (step === 3 && stepsCompleted[2]) {
      setActiveStep(step);
      return;
    }
    
    if (step === 4 && stepsCompleted[3]) {
      processResume(); // Start processing when moving to step 4
      setActiveStep(step);
      return;
    }
    
    if (step === 5 && stepsCompleted[4]) {
      setActiveStep(step);
      return;
    }
    
    // If trying to navigate to an unauthorized step
    if (step > activeStep) {
      // Show appropriate error message
      if (!stepsCompleted[1]) {
        toast.error("Please complete the welcome step first");
      } else if (!stepsCompleted[2]) {
        toast.error("Please provide at least one job title preference");
      } else if (!stepsCompleted[3]) {
        toast.error("Please upload your resume first");
      } else if (!stepsCompleted[4]) {
        toast.error("Please wait for processing to complete");
      }
    } else {
      // Allow going back to previous steps
      setActiveStep(step);
    }
  };

  // Final completion handler
  const handleFinalCompletion = () => {
    if (stepsCompleted[4]) {
      navigate('/dashboard');
    } else {
      toast.error("Please complete all steps first");
    }
  };

  const getButtonText = (step) => {
    if (step === 3) return "Upload & Continue";
    if (step === 4) return isProcessing ? "Processing..." : "Next";
    return "Next";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar/>
      <div className="app-container">
        <div className="background-layer">
          <Squares
            speed={0.1}
            squareSize={30}
            direction="diagonal"
            borderColor="rgba(0, 0, 0, 0.01)"
            hoverFillColor="#2563EB"
          />
        </div>
        <div className="content-layer flex flex-col items-center justify-center min-h-screen py-10">
          <Stepper
            initialStep={1}
            onStepChange={handleStepChange}
            onFinalStepCompleted={handleFinalCompletion}
            backButtonText="Previous"
            nextButtonText={getButtonText(activeStep)}
            disableStepIndicators={false}
            disableNavigation={(step) => {
              // Only allow navigation to steps that should be accessible
              if (step === 1) return false; // Always allow step 1
              if (step === 2 && stepsCompleted[1]) return false;
              if (step === 3 && stepsCompleted[2]) return false;
              if (step === 4 && stepsCompleted[3]) return false;
              if (step === 5 && stepsCompleted[4]) return false;
              return true; // Disable navigation to other steps
            }}
            nextButtonProps={{
              disabled: (activeStep === 2 && !preferences.pref1) || 
                        (activeStep === 3 && !isUploaded) ||
                        (activeStep === 4 && isProcessing)
            }}
          >
            {/* Step 1: Welcome */}
            <Step>
              <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <div className="flex flex-col items-center mb-6">
                  {userData.picture ? (
                    <img
                      src={userData.picture}
                      alt={userData.name}
                      className="w-20 h-20 rounded-full mb-4 border-2 border-blue-500 object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(userData.name);
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl font-bold mb-4">
                      {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome, {userData.name}!
                  </h2>
                  
                  <ShinyText className="text-lg text-center mb-6">
                    Let's create your professional resumes
                  </ShinyText>
                  
                  <p className="text-gray-600 text-center">
                    We'll guide you through a simple process to create customized resumes
                    tailored to your desired job titles. Let's get started!
                  </p>
                </div>
              </div>
            </Step>

            {/* Step 2: Job Title Preferences */}
            <Step>
              <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Job Title Preferences</h2>
                
                <p className="text-gray-600 mb-6">
                  Please provide up to three job titles that you're interested in. 
                  We'll create tailored resumes for each of these positions.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pref1"
                      value={preferences.pref1}
                      onChange={handlePreferenceChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g. Software Engineer"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title 2 (Optional)
                    </label>
                    <input
                      type="text"
                      name="pref2"
                      value={preferences.pref2}
                      onChange={handlePreferenceChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g. Product Manager"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title 3 (Optional)
                    </label>
                    <input
                      type="text"
                      name="pref3"
                      value={preferences.pref3}
                      onChange={handlePreferenceChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g. Data Scientist"
                    />
                  </div>
                </div>
              </div>
            </Step>

            {/* Step 3: Resume Upload */}
            <Step>
              <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Upload Your Resume</h2>
                
                <p className="text-gray-600 mb-6 text-center">
                  Please upload your current resume in PDF format. We'll use this as a base for creating 
                  your customized resumes.
                </p>
                
                {/* File Upload UI */}
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    
                    {!selectedFile ? (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="mt-1 text-sm text-gray-600">
                          Click to browse or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF only (max 5MB)</p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          type="button"
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Select PDF
                        </button>
                      </>
                    ) : (
                      <div>
                        <svg
                          className="mx-auto h-12 w-12 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <p className="mt-2 text-sm font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {Math.round(selectedFile.size / 1024)} KB
                        </p>
                        <div className="flex gap-2 justify-center mt-4">
                          <button
                            onClick={() => {
                              setSelectedFile(null);
                              setIsUploaded(false);
                              setPdfUrl("");
                              setStepsCompleted(prev => ({ ...prev, 3: false }));
                            }}
                            className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm"
                          >
                            Change
                          </button>
                          {!isUploaded && !isUploading && (
                            <button
                              onClick={handleUploadFile}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                            >
                              Upload
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Upload Success */}
                  {isUploaded && pdfUrl && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-md">
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-green-800 font-medium">Resume uploaded successfully!</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Click "Upload & Continue" to proceed to the next step.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Step>
            
            {/* Step 4: Processing */}
            <Step>
              <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  Processing Your Resume
                </h2>
                
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-blue-700 font-medium mb-2">{processStatus || "Starting process..."}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                    <p className="font-medium">Error:</p>
                    <p>{error}</p>
                  </div>
                )}
                
                <p className="text-gray-500 text-sm text-center">
                  Please wait while we create your customized resumes. This may take a few minutes.
                </p>
              </div>
            </Step>

            {/* Step 5: Completion */}
            <Step>
              <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">All Set!</h2>
                  <ShinyText className="text-lg mb-6">Your resumes are ready</ShinyText>
                  
                  <p className="text-gray-600 mb-6">
                    We've created customized resumes for your selected job titles. 
                    You can now access and manage them from your dashboard.
                  </p>
                  
                  <div className="space-y-4">
                    {processResults.pdfUrl1 && (
                      <div className="p-3 bg-gray-50 border rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span>{preferences.pref1} Resume</span>
                        </div>
                        <a 
                          href={processResults.pdfUrl1}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      </div>
                    )}
                    
                    {processResults.pdfUrl2 && preferences.pref2 && (
                      <div className="p-3 bg-gray-50 border rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span>{preferences.pref2} Resume</span>
                        </div>
                        <a 
                          href={processResults.pdfUrl2}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      </div>
                    )}
                    
                    {processResults.pdfUrl3 && preferences.pref3 && (
                      <div className="p-3 bg-gray-50 border rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span>{preferences.pref3} Resume</span>
                        </div>
                        <a 
                          href={processResults.pdfUrl3}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-6">
                    Click "Complete" to go to your dashboard where you can manage all your resumes.
                  </p>
                </motion.div>
              </div>
            </Step>
          </Stepper>
        </div>
      </div>
    </>
  );
};

export default OnBoardPage;