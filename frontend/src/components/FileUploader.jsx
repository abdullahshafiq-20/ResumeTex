import React, { useState } from 'react';

export default function FileUploader() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);

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
        // Simulating upload progress
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setIsUploaded(true);
                    return 100;
                }
                return prev + 10;
            });
        }, 500);
    };

    const handleDelete = () => {
        setSelectedFile(null);
        setUploadProgress(0);
        setIsUploading(false);
        setIsUploaded(false);
    };

    return (
        <div className="w-[480px] bg-white rounded-lg border">
            {/* Header */}
            <div className="flex items-center justify-center p-4 border-b">
                <h2 className="text-xl font-semibold">Upload Files</h2>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Upload Area */}
                {!selectedFile && (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            <p className="text-sm text-gray-600">Drag & drop your files here or</p>
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileSelect}
                                id="fileInput"
                                accept=".pdf"
                            />
                            <label
                                htmlFor="fileInput"
                                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
                            >
                                Choose files
                            </label>
                        </div>
                    </div>
                )}

                <p className="text-xs text-gray-500">Only .jpg and .png files. 500kb max file size.</p>

                {/* Selected File */}
                {selectedFile && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Selected File</h3>
                        <div className="flex items-center justify-between rounded-lg border p-3">
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
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-500">
                                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} mb
                                        </span>
                                    </div>
                                    {/* Progress bar */}
                                    {isUploading && (
                                        <div className="mt-2 h-1 w-[180px] bg-gray-200 rounded-full">
                                            <div
                                                className="h-1 bg-green-600 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
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
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-center p-4 border-t">
                <button
                    className="px-6 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedFile || isUploading || !isUploaded}
                >
                    Process
                </button>
            </div>
        </div>
    );
}
  
  