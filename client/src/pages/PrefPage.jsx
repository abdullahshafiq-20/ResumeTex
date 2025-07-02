import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDashboard } from "../context/DashbaordContext";
import {
  Brain,
  Settings,
  FileText,
  Calendar,
  Target,
  Sparkles,
  Code,
  FolderOpen,
  Users,
  TrendingUp,
  Layers,
  RefreshCw,
} from "lucide-react";

const PrefPage = () => {
  const { preferences, loading, error, refreshPreferences, isSocketConnected } =
    useDashboard();
  const [selectedRecord, setSelectedRecord] = useState(0);

  if (loading) {
    return (
      <div className="relative">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
            <p className="text-sm text-gray-600">Loading your preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="text-red-600 text-sm font-medium">Error: {error}</div>
          <button
            onClick={refreshPreferences}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  if (!preferences || preferences.records.length === 0) {
    return (
      <div className="relative">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Settings className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            No Preferences Found
          </h2>
          <p className="text-sm text-gray-600 text-center max-w-md">
            You haven't set up any preferences yet. Upload a resume to
            automatically generate your preferences.
          </p>
        </div>
      </div>
    );
  }

  const currentRecord = preferences.records[selectedRecord];
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
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-10 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-8 blur-2xl -z-10"></div>
      <div className="absolute top-32 left-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 opacity-6 blur-xl -z-10"></div>

      <motion.div
        className=""
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Live Status Indicator */}
        <motion.div
          className="mb-6 p-3 rounded-lg border border-gray-200 bg-white relative overflow-hidden"
          variants={itemVariants}
        >
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-br from-green-200/30 to-blue-200/20 blur-sm"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  isSocketConnected
                    ? "bg-green-500 animate-pulse"
                    : "bg-yellow-500"
                }`}
              ></div>
              <span
                className={`text-sm font-medium ${
                  isSocketConnected ? "text-green-700" : "text-yellow-700"
                }`}
              >
                Live Update
              </span>
              {isSocketConnected && (
                <span className="text-xs text-gray-500">
                  • Real-time sync active
                </span>
              )}
            </div>
            <button
              onClick={refreshPreferences}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded border border-blue-200 hover:border-blue-300 transition-colors flex items-center space-x-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* AI Notice */}
        <motion.div
          className="mb-6 border border-purple-200 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-lg p-4 relative overflow-hidden"
          variants={itemVariants}
        >
          {/* Subtle animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-2 left-1/4 w-3 h-3 bg-purple-200/30 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-2 right-1/3 w-2 h-2 bg-blue-200/20 rounded-full animate-pulse delay-700"></div>
            <div className="absolute top-1/2 right-6 w-1.5 h-1.5 bg-indigo-200/40 rounded-full animate-pulse delay-1000"></div>
          </div>

          <div className="relative flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <Brain className="h-4 w-4 text-purple-600 animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  AI-Generated Preferences
                </h3>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                  <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse delay-400"></div>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                These preferences are automatically extracted from your uploaded
                resumes and are used to personalize your email generation. The
                system analyzes your skills, projects, and professional summary
                to create tailored content when generating emails.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Sparkles className="h-4 w-4 text-blue-600 animate-pulse delay-500" />
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div className="mb-6" variants={itemVariants}>
          <h1 className="text-xl font-semibold text-gray-800 mb-1 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-600" />
            User Preferences
          </h1>
          <div className="flex items-center space-x-4 text-xs text-gray-600">
            <span className="flex items-center">
              <FileText className="h-3 w-3 mr-1" />
              {preferences.aggregated.totalRecords} Records
            </span>
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Updated{" "}
              {new Date(
                preferences.aggregated.lastUpdated
              ).toLocaleDateString()}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Records Sidebar */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <div className="bg-white border border-gray-200 rounded-lg p-4 relative overflow-hidden">
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-200/15 blur-md"></div>

              <h3 className="text-sm font-semibold mb-3 flex items-center text-gray-800">
                <Layers className="h-4 w-4 mr-2 text-gray-600" />
                Preference Records
              </h3>
              <div className="space-y-2">
                {preferences.records.map((record, index) => (
                  <button
                    key={record._id}
                    onClick={() => setSelectedRecord(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 relative overflow-hidden ${
                      selectedRecord === index
                        ? "bg-blue-50 border border-blue-200 shadow-sm"
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    {selectedRecord === index && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-60"></div>
                    )}
                    <div className="font-medium text-xs text-gray-900 truncate">
                      {record.preferences || "Untitled"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <Calendar className="h-2 w-2 mr-1" />
                      {new Date(record.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Current Record Details */}
            <motion.div
              className="bg-white border border-gray-200 rounded-lg p-5 relative overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gradient-to-br from-green-200/20 to-blue-200/15 blur-lg"></div>

              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-600" />
                  {currentRecord.preferences || "Untitled Preference"}
                </h2>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Record {selectedRecord + 1} of {preferences.records.length}
                </span>
              </div>

              {/* Summary */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <FileText className="h-3 w-3 mr-1 text-gray-600" />
                  Summary
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                  {currentRecord.summary || "No summary provided"}
                </p>
              </div>

              {/* Skills */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <Code className="h-3 w-3 mr-1 text-gray-600" />
                  Skills ({currentRecord.skills.length})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {currentRecord.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <FolderOpen className="h-3 w-3 mr-1 text-gray-600" />
                  Projects ({currentRecord.projects.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentRecord.projects.map((project, index) => (
                    <div
                      key={index}
                      className="p-2 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="font-medium text-xs text-green-800">
                        {project}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created:{" "}
                    {new Date(currentRecord.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Updated:{" "}
                    {new Date(currentRecord.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Aggregated Data */}
            <motion.div
              className="bg-white border border-gray-200 rounded-lg p-5 relative overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/15 blur-xl"></div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
                Aggregated Overview
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* All Unique Skills */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <Code className="h-3 w-3 mr-1 text-gray-600" />
                    All Unique Skills ({preferences.aggregated.allSkills.length}
                    )
                  </h4>
                  <div className="max-h-40 overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                    <div className="flex flex-wrap gap-1">
                      {preferences.aggregated.allSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* All Projects */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <FolderOpen className="h-3 w-3 mr-1 text-gray-600" />
                    All Projects ({preferences.aggregated.allProjects.length})
                  </h4>
                  <div className="max-h-40 overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50/50 space-y-1.5">
                    {preferences.aggregated.allProjects.map(
                      (project, index) => (
                        <div
                          key={index}
                          className="p-2 bg-white rounded text-xs text-gray-700 border border-gray-200"
                        >
                          {project}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Latest Summary */}
              <div className="mt-5">
                <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <FileText className="h-3 w-3 mr-1 text-gray-600" />
                  Latest Summary
                </h4>
                <p className="text-xs text-gray-700 bg-gradient-to-r from-gray-50 to-blue-50/30 p-3 rounded-lg border border-gray-200">
                  {preferences.aggregated.latestSummary ||
                    "No summary available"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrefPage;
