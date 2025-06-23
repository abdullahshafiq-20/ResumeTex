import React, { useState } from 'react';
import { useDashboard } from '../context/DashbaordContext';

const PrefPage = () => {
    const { preferences, loading, error, refreshPreferences } = useDashboard();
    const [selectedRecord, setSelectedRecord] = useState(0);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-600 mb-4">Error: {error}</div>
                <button
                    onClick={refreshPreferences}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!preferences || preferences.records.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">No Preferences Found</h2>
                <p className="text-gray-600">You haven't set up any preferences yet.</p>
            </div>
        );
    }

    const currentRecord = preferences.records[selectedRecord];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">User Preferences</h1>
                    <p className="text-gray-600">
                        Total Records: {preferences.aggregated.totalRecords} | 
                        Last Updated: {new Date(preferences.aggregated.lastUpdated).toLocaleDateString()}
                    </p>
                </div>

                {/* Reminder Section */}
                <div className="mb-6 bg-blue-50 border-blue-200 border p-4 rounded-lg">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">
                                About Your Preferences
                            </h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <p>
                                    These preferences are automatically extracted from your uploaded resumes and are used to personalize your email generation. 
                                    The system analyzes your skills, projects, and professional summary to create tailored content when generating emails.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Records Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-lg font-semibold mb-4">Preference Records</h3>
                            <div className="space-y-2">
                                {preferences.records.map((record, index) => (
                                    <button
                                        key={record._id}
                                        onClick={() => setSelectedRecord(index)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                                            selectedRecord === index
                                                ? 'bg-blue-100 border-2 border-blue-500'
                                                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                    >
                                        <div className="font-medium text-sm text-gray-900">
                                            {record.preferences || 'Untitled'}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(record.createdAt).toLocaleDateString()}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Current Record Details */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {currentRecord.preferences || 'Untitled Preference'}
                                </h2>
                                <span className="text-sm text-gray-500">
                                    Record {selectedRecord + 1} of {preferences.records.length}
                                </span>
                            </div>

                            {/* Summary */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Summary</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {currentRecord.summary || 'No summary provided'}
                                </p>
                            </div>

                            {/* Skills */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    Skills ({currentRecord.skills.length})
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {currentRecord.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Projects */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    Projects ({currentRecord.projects.length})
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {currentRecord.projects.map((project, index) => (
                                        <div
                                            key={index}
                                            className="p-3 bg-green-50 border border-green-200 rounded-lg"
                                        >
                                            <div className="font-medium text-green-800">{project}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Created: {new Date(currentRecord.createdAt).toLocaleString()}</span>
                                    <span>Updated: {new Date(currentRecord.updatedAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Aggregated Data */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Aggregated Overview</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* All Unique Skills */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                                        All Unique Skills ({preferences.aggregated.allSkills.length})
                                    </h4>
                                    <div className="max-h-48 overflow-y-auto">
                                        <div className="flex flex-wrap gap-2">
                                            {preferences.aggregated.allSkills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* All Projects */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                                        All Projects ({preferences.aggregated.allProjects.length})
                                    </h4>
                                    <div className="max-h-48 overflow-y-auto space-y-2">
                                        {preferences.aggregated.allProjects.map((project, index) => (
                                            <div
                                                key={index}
                                                className="p-2 bg-gray-50 rounded text-sm text-gray-700"
                                            >
                                                {project}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Latest Summary */}
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">Latest Summary</h4>
                                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                    {preferences.aggregated.latestSummary || 'No summary available'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrefPage;