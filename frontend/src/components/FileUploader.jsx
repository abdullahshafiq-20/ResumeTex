import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function FileUploader({ onFileUpload, apiUrl, template }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [pdfurl, setPdfurl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState('');
    const [processingMessage, setProcessingMessage] = useState('');
    const navigate = useNavigate();
    const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
    const [selectedApi, setSelectedApi] = useState('api_1');
    const [showModelInfo, setShowModelInfo] = useState(false);
    const [showApiInfo, setShowApiInfo] = useState(false);
    const [pId, setpId] = useState(null);
    const [fileName, setfileName] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setUploadProgress(0);
            setIsUploading(false);
            setIsUploaded(false);
        }
    };

    const handleUploadFile = async () => {
        if (!selectedFile) return;
        
        setIsUploading(true);
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
        } catch (error) {
            console.error('Upload failed:', error);
            setIsUploading(false);
            alert('Upload failed. Please try again.');
        }
    };

    const handleDelete = () => {
        setSelectedFile(null);
        setUploadProgress(0);
        setIsUploading(false);
        setIsUploaded(false);
    };

    const handleModelChange = (e) => {
        setSelectedModel(e.target.value);
        toast.success(`Switched to ${e.target.value}`, {
            position: 'bottom-center',
            duration: 2000,
        });
    };

    const handleApiChange = (e) => {
        setSelectedApi(e.target.value);
        toast.success(`Switched to ${e.target.value}`, {
            position: 'bottom-center',
            duration: 2000,
        });
    };

    const handleProcess = async () => {
        setIsProcessing(true);
        try {
            // Step 1: Extract PDF
            setProcessingStep('extracting');
            setProcessingMessage('Extracting data from PDF...');
            const response = await axios.post(`${apiUrl}/extract-pdf`, {
                pdfUrl: pdfurl,
                model: selectedModel,
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
            setProcessingMessage('Getting sections and links from Gemini...');
            try {
                const geminicall = await axios.post(`${apiUrl}/convert-latex`, {
                    extractedData: extractedData,
                    template: template,
                    model: selectedModel,
                    apiProvider: selectedApi
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Geminicall:', geminicall.data.formattedLatex);
                setfileName(geminicall.data.name)
                
                // Step 3: LaTeX Ready
                setProcessingStep('latex');
                setProcessingMessage('LaTeX code is ready...');
                await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause to show message

                const LatexUrl = await axios.post(`${apiUrl}/tex-content`, {
                    formattedLatex: geminicall.data.formattedLatex
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const latexFileUrl = LatexUrl.data.data.url;

                // Step 4: PDF Conversion
                setProcessingStep('converting');
                setProcessingMessage('Converting to PDF...');
                const Pdflink = await axios.post(`${apiUrl}/convert-json-tex-to-pdf`, {
                    formattedLatex: geminicall.data.formattedLatex
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

                // Navigate to response page with data
                setTimeout(() => {
                }, 2000);
                navigate('/response', {
                    state: {
                        pdfUrl: Pdflink.data.pdfUrl,
                        latexCode: geminicall.data.formattedLatex,
                        latexFileUrl: latexFileUrl,
                        name: fileName
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
            if (!error.message.includes('Gemini API')) {  // Don't show if Gemini error already shown
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

    return (
        <div className="w-full max-w-[500px] bg-white rounded-lg border shadow-md">
            {/* Header */}
            <div className="flex items-center justify-center p-3 sm:p-4 border-b">
                <h2 className="text-lg sm:text-xl font-semibold">Upload Files</h2>
            </div>

            {/* Settings Panel - Always visible */}
            <div className="p-3 sm:p-4 border-b space-y-3 sm:space-y-4">
                {/* Model Selection */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Model Selection</label>
                        <div className="relative">
                            <button
                                className="text-gray-400 hover:text-gray-600"
                                onMouseEnter={() => setShowModelInfo(true)}
                                onMouseLeave={() => setShowModelInfo(false)}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                            {showModelInfo && (
                                <div className="absolute z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg -left-20 top-6">
                                    Select from listed Gemini models when models are overloaded or api is exhausted.
                                </div>
                            )}
                        </div>
                    </div>
                    <select
                        value={selectedModel}
                        onChange={handleModelChange}
                        className="w-full p-1.5 sm:p-2 border rounded-md text-xs sm:text-sm bg-white"
                    >
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                        <option value="gemini-1.5-flash-8b">Gemini 1.5 Flash 8B</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                        {/* <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="claude-3-opus">Claude 3 Opus</option>
                        <option value="claude-3-sonnet">Claude 3 Sonnet</option> */}
                    </select>
                </div>

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
                        className="w-full p-1.5 sm:p-2 border rounded-md text-xs sm:text-sm bg-white"
                    >
                        <option value="api_1">API 1 (Default)</option>
                        <option value="api_2">API 2</option>
                        <option value="api_3">API 3</option>
                        <option value="api_4">API 4</option>
                        <option value="api_5">API 5</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Using API key from environment variables</p>
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
                                disabled={!template}
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
                                    {!isUploading && !isUploaded && (
                                        <>
                                            <button
                                                onClick={handleUploadFile}
                                                className="p-2 hover:bg-blue-100 rounded-full"
                                            >
                                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="p-2 hover:bg-red-100 rounded-full"
                                            >
                                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                    {isUploaded && (
                                        <div className="flex space-x-2">
                                            <div className="p-2">
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <button
                                                onClick={handleDelete}
                                                className="p-2 hover:bg-red-100 rounded-full"
                                            >
                                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
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

                <p className="text-xs text-gray-500">Only PDF files. Maximum file size: 10MB</p>
            </div>

            {/* Footer */}
            <div className="flex justify-center p-3 sm:p-4 border-t">
                <button
                    className="px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm text-white bg-[#2563EB] hover:bg-[#1d4ed8] rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    disabled={!selectedFile || isUploading || !isUploaded || isProcessing}
                    onClick={handleProcess}
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {processingMessage || 'Processing...'}
                        </>
                    ) : (
                        'Process'
                    )}
                </button>
            </div>
        </div>
    );
}
  
  