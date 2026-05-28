import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function FileUploader({ onFileUpload, apiUrl, template, disable = false }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [pdfurl, setPdfurl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState('');
    const [processingMessage, setProcessingMessage] = useState('');
    const navigate = useNavigate();
    const [selectedApi, setSelectedApi] = useState('api_1');
    const [showApiInfo, setShowApiInfo] = useState(false);
    const [pId, setpId] = useState(null);
    const [isTailoredResume, setIsTailoredResume] = useState(false);
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const handleFileSelect = (event) => {
        if (disable) return;
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setUploadProgress(0);
            setIsUploading(false);
            setIsUploaded(false);
        }
    };

    const uploadToCloudinary = async () => {
        if (disable || !selectedFile) return null;
        
        setIsUploading(true);
        setProcessingStep('uploading');
        setProcessingMessage('Uploading resume to Cloudinary...');
        
        const formData = new FormData();
        formData.append('resume', selectedFile);

        try {
            const response = await axios.post(`${apiUrl}/upload-pdf`, formData, {
                headers: {
                    'Content-Type': 'application/pdf',
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
                console.log('Upload response:', response.data);
                console.log('Setting pdfurl to:', response.data.data.url);
                setPdfurl(response.data.data.url);
                setpId(response.data.data.publicId);
            }
            return response.data.data.url;
        } catch (error) {
            console.error('Upload failed:', error);
            setIsUploading(false);
            toast.error('Upload failed. Please try again.', {
                position: 'bottom-center',
                duration: 3000,
            });
            throw error;
        }
    };

    const handleDelete = () => {
        if (disable) return;
        setSelectedFile(null);
        setUploadProgress(0);
        setIsUploading(false);
        setIsUploaded(false);
    };

    const handleApiChange = (e) => {
        if (disable) return;
        setSelectedApi(e.target.value);
        toast.success(`Switched to ${e.target.value}`, {
            position: 'bottom-center',
            duration: 2000,
        });
    };

    const handleProcess = async () => {
        setIsProcessing(true);
        try {
            // Step 0: Upload to Cloudinary first
            const uploadedUrl = await uploadToCloudinary();
            if (!uploadedUrl) {
                throw new Error('Failed to upload resume');
            }
            
            // Step 1: Extract PDF
            setProcessingStep('extracting');
            setProcessingMessage('Extracting data from PDF...');
            const response = await axios.post(`${apiUrl}/extract-pdf`, {
                pdfUrl: uploadedUrl,
                apiProvider: selectedApi
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const extractedData = response.data;
            console.log('Extracted data:', extractedData);
            console.log('Template:', template);

            // Step 2: Gemini Processing
            setProcessingStep('gemini');
            setProcessingMessage('Getting sections and links...');
            try {
                const geminicall = await axios.post(`${apiUrl}/convert-latex`, {
                    extractedData: extractedData,
                    template: template,
                    apiProvider: selectedApi,
                    isTailoredResume: isTailoredResume,
                    jobTitle: jobTitle,
                    jobDescription: jobDescription
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Geminicall:', geminicall.data.formattedLatex);
                const recEmail = geminicall.data.email;
                const recName = geminicall.data.name;
                const recTitle = geminicall.data.title;
                // setfileName(geminicall.data.name)
                
                // Step 3: LaTeX Ready
                setProcessingStep('latex');
                setProcessingMessage('LaTeX code is ready...');
                await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause to show message

                const LatexUrl = await axios.post(`${apiUrl}/tex-content`, {
                    formattedLatex: geminicall.data.formattedLatex,
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const latexFileUrl = LatexUrl.data.data.url;

                // Step 4: PDF Conversion
                setProcessingStep('converting');
                setProcessingMessage('Converting to PDF...');
                const Pdflink = await axios.post(`${apiUrl}/convertJsonTexToPdfLocally`, {
                    formattedLatex: geminicall.data.formattedLatex,
                    email : recEmail,
                    name : recName,
                    title : recTitle
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                console.log('Pdflink:', Pdflink.data);

                const DeleteFiles = await axios.post(`${apiUrl}/delete-files`, {
                    publicId: pId
                }, {
                    headers: {
                        'Content-Type':'application/json'
                    }

                })
                console.log('Delete Response :', DeleteFiles.response )

                // Note: Rate limit call is recorded on the server (recordSuccessfulCall middleware)
                // Response headers contain: X-RateLimit-Remaining, X-RateLimit-Limit, etc.
                const remaining = geminicall.headers?.['x-ratelimit-remaining'];
                if (remaining !== undefined) {
                    toast.success(`Conversions remaining today: ${remaining}`, {
                        position: 'bottom-center',
                        duration: 2000,
                    });
                }

                // Navigate to response page with data
                setTimeout(() => {
                }, 2000);
                navigate('/response', {
                    state: {
                        pdfUrl: Pdflink.data.pdfUrl,
                        latexCode: geminicall.data.formattedLatex,
                        latexFileUrl: latexFileUrl,
                        // name: fileName
                    }
                });

            } catch (geminiError) {
                if (geminiError.response?.data?.error?.includes('overloaded')) {
                    toast.error(
                        <div className="flex flex-col">
                            <span>Gemini API is currently overloaded</span>
                            <span className="text-sm">Try switching to a different model or API</span>
                        </div>,
                        {
                            position: 'bottom-center',
                            duration: 4000,
                            icon: '⚠️',
                        }
                    );
                } else {
                    toast.error(`Processing failed: ${geminiError.message}`, {
                        position: 'bottom-center',
                        duration: 3000,
                    });
                }
                throw geminiError;
            }

        } catch (error) {
            console.error('Processing failed:', error);
            
            // Handle rate limit error (429)
            if (error.response?.status === 429) {
                const resetTime = error.response?.data?.retryAfter 
                    ? new Date(error.response.data.retryAfter).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })
                    : 'midnight';
                    
                toast.error(
                    <div className="flex flex-col">
                        <span className="font-bold">Daily Limit Reached</span>
                        <span className="text-sm">You can make 2 conversions per day</span>
                        <span className="text-sm">Try again at {resetTime}</span>
                    </div>,
                    {
                        position: 'top-center',
                        duration: 6000,
                        icon: '⏱️',
                    }
                );
            } else if (!error.message.includes('Gemini API')) {  // Don't show if Gemini error already shown
                toast.error(`Processing failed: ${error.message}`, {
                    position: 'bottom-center',
                    duration: 3000,
                });
            }
        } finally {
            setIsProcessing(false);
            setProcessingStep('');
            setProcessingMessage('');
        }
    };

    // Processing Modal Component
    const ProcessingModal = () => {
        if (!isProcessing) return null;

        const steps = [
            { id: 'uploading', label: 'Uploading Resume' },
            { id: 'extracting', label: 'Extracting Data' },
            { id: 'gemini', label: 'Processing with AI' },
            { id: 'latex', label: 'Generating LaTeX' },
            { id: 'converting', label: 'Converting to PDF' },
        ];

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-semibold text-gray-800">Processing Your Resume</h2>
                        <p className="text-sm text-gray-500 mt-1">Please wait while we process your file...</p>
                    </div>

                    {/* Spinner */}
                    <div className="flex justify-center mb-8">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 rounded-full border-3 border-gray-200"></div>
                            <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-[#2563EB] animate-spin"></div>
                        </div>
                    </div>

                    {/* Steps Progress */}
                    <div className="space-y-2 mb-8">
                        {steps.map((step) => {
                            const isActive = processingStep === step.id;
                            const isCompleted = steps.findIndex(s => s.id === processingStep) > steps.findIndex(s => s.id === step.id);

                            return (
                                <div
                                    key={step.id}
                                    className="flex items-center space-x-3 py-2"
                                >
                                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                        {isCompleted ? (
                                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#2563EB]' : 'bg-gray-300'}`}></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm ${isActive ? 'font-semibold text-[#2563EB]' : isCompleted ? 'text-gray-600' : 'text-gray-500'}`}>
                                            {step.label}
                                        </p>
                                        {isActive && processingMessage && (
                                            <p className="text-xs text-gray-500 mt-0.5">{processingMessage}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Message */}
                    <div className="text-center text-xs text-gray-400 border-t pt-4">
                        <p>Estimated time: 30-60 seconds</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <ProcessingModal />
            <div className={`w-full max-w-[500px] bg-white rounded-lg border ${isProcessing || disable ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Status Strip - Simplified to yellow only */}
            {/* <div className="h-6 rounded-t-lg flex items-center justify-end px-3 bg-yellow-400/20">
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-yellow-600">
                        Sometimes the Pdf may not be produced, In that case please try again. 
                    </span>
                    <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></div>
                </div>
            </div> */}

            {/* Header with Toggle */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                <div>
                <h2 className="text-lg sm:text-xl font-semibold">Upload Resume</h2>

                </div>
                <div className="flex items-center">
                    <span className="text-xs mr-2">Targeted Resume</span>
                    <label className="inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={isTailoredResume}
                            onChange={() => setIsTailoredResume(!isTailoredResume)}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            {/* Job details section - conditionally rendered */}
            {isTailoredResume && (
                <div className="p-3 sm:p-4 border-b space-y-3 ">
                    <div className='flex items-center gap-1'>
                    <h3 className="text-sm font-semibold text-gray-700">Job Details</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded ">BETA</span>
                    </div>

                    <div className="space-y-2">
                        <div>
                            <label htmlFor="jobTitle" className="block text-xs font-medium text-gray-700 mb-1">Job Title</label>
                            <input
                                type="text"
                                id="jobTitle"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                className="w-full p-2 border rounded-md text-sm"
                                placeholder="e.g. Software Engineer"
                            />
                        </div>
                        <div>
                            <label htmlFor="jobDescription" className="block text-xs font-medium text-gray-700 mb-1">Job Description</label>
                            <textarea
                                id="jobDescription"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="w-full p-2 border rounded-md text-sm"
                                rows="4"
                                placeholder="Leave blank if no description is available"
                            ></textarea>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Panel - Always visible */}
            <div className="p-3 sm:p-4 border-b space-y-3 sm:space-y-4">
                {/* API Selection */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">API Provider</label>
                        <div className="relative">
                            <button
                                className="text-gray-400 hover:text-gray-600"
                                onMouseEnter={() => setShowApiInfo(true)}
                                onMouseLeave={() => setShowApiInfo(false)}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                            {showApiInfo && (
                                <div className="absolute z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg -left-20 top-6">
                                    Choose from five listed api when model is overloaded or api is exhausted.
                                </div>
                            )}
                        </div>
                    </div>
                    <select
                        value={selectedApi}
                        onChange={handleApiChange}
                        disabled={disable}
                        className={`w-full p-1.5 sm:p-2 border rounded-md text-xs sm:text-sm bg-white ${disable ? 'cursor-not-allowed' : ''}`}
                    >
                        <option value="api_1">API 1 (Default)</option>
                        <option value="api_2">API 2</option>
                        <option value="api_3">API 3</option>
                        <option value="api_4">API 4</option>
                        <option value="api_5">API 5</option>
                    </select>
                    {/* <p className="text-xs text-gray-500 mt-1">Using API key from environment variables</p> */}
                </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {/* Upload Area */}
                {!selectedFile && (
                    <div className={`border-2 border-dashed ${template ? 'border-gray-200' : 'border-gray-200 opacity-50'} rounded-lg p-2`}>
                        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 py-4">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            <p className="text-xs sm:text-sm text-gray-600 text-center">
                                Drag & drop your PDF file here or
                            </p>
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileSelect}
                                id="fileInput"
                                accept=".pdf"
                                disabled={!template || disable}
                            />
                            <label
                                htmlFor="fileInput"
                                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm ${
                                    template ? 'bg-gray-100 hover:bg-gray-200 cursor-pointer' : 'bg-gray-100 cursor-not-allowed'
                                } rounded-md`}
                            >
                                Choose PDF file
                            </label>
                        </div>
                    </div>
                )}

                {/* File Info and Template Info */}
                {selectedFile && (
                    <div className="space-y-2">
                        <h3 className="text-xs sm:text-sm font-medium">File and Template Information</h3>
                        <div className="rounded-lg border p-2 sm:p-3 space-y-2 sm:space-y-3">
                            {/* File Information */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium">{selectedFile.name}</p>
                                        <span className="text-xs text-gray-500">
                                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} mb
                                        </span>
                                        {isUploading && (
                                            <div className="mt-2 h-1 w-[180px] bg-gray-200 rounded-full">
                                                <div
                                                    className="h-1 bg-[#2563EB] rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex space-x-2">
                                    {(
                                        <button
                                            onClick={handleDelete}
                                            className="p-2 hover:bg-red-100 rounded-full"
                                        >
                                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                    )}
                                </div>
                            </div>

                            {/* Template Information */}
                            <div className="flex items-center space-x-3 pt-2 border-t">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium">Selected Template</p>
                                    <p className="text-sm text-blue-600">{template}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <p className="text-xs text-gray-500">Only PDF files. Maximum file size: 5MB</p>
            </div>

            {/* Footer */}
            <div className="flex justify-center p-3 sm:p-4 border-t">
                <button
                    className="px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm text-white bg-[#2563EB] hover:bg-[#1d4ed8] rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    disabled={!selectedFile || isProcessing || (isTailoredResume && !jobTitle) || disable}
                    onClick={handleProcess}
                >
                    {isProcessing ? 'Processing...' : 'Process'}
                </button>
            </div>
        </div>
        </>
    );
}

