import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Edit3,
  Save,
  X,
  Plus,
  Loader2,
  Info,
  Lock,
} from "lucide-react";
import { useResumes } from "../context/ResumeContext";

// Title Restriction Modal Component
const TitleRestrictionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-4"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Title Cannot Be Edited
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              The preference title is automatically linked to your resume title and is used for generating personalized emails.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start">
                <Info className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-xs text-amber-800">
                  <p className="font-medium mb-1">Why can't I edit the title?</p>
                  <p>This ensures consistency between your resume and email generation, maintaining professional accuracy across all communications.</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Got it
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Skills Modal Component
const SkillsModal = ({ isOpen, onClose, currentSkills, onSave, isLoading }) => {
  const [skillsInput, setSkillsInput] = useState("");

  const handleSave = () => {
    if (skillsInput.trim()) {
      const newSkills = skillsInput
        .split(",")
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      
      onSave(newSkills);
      setSkillsInput("");
    }
  };

  const handleClose = () => {
    setSkillsInput("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Code className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
              Add Skills
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter skills separated by commas
            </label>
            <textarea
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, Node.js, Python, JavaScript, etc."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple skills with commas
            </p>
          </div>

          {/* Current Skills Preview */}
          {currentSkills.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Skills
              </label>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {currentSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleSave}
              disabled={isLoading || !skillsInput.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add Skills</span>
                </>
              )}
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Projects Modal Component
const ProjectsModal = ({ isOpen, onClose, currentProjects, onSave, isLoading }) => {
  const [projectsInput, setProjectsInput] = useState("");

  const handleSave = () => {
    if (projectsInput.trim()) {
      const newProjects = projectsInput
        .split(",")
        .map(project => project.trim())
        .filter(project => project.length > 0);
      
      onSave(newProjects);
      setProjectsInput("");
    }
  };

  const handleClose = () => {
    setProjectsInput("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <FolderOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
              Add Projects
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter projects separated by commas
            </label>
            <textarea
              value={projectsInput}
              onChange={(e) => setProjectsInput(e.target.value)}
              placeholder="E-commerce Platform, Mobile App, Portfolio Website, etc."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple projects with commas
            </p>
          </div>

          {/* Current Projects Preview */}
          {currentProjects.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Projects
              </label>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {currentProjects.map((project, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                  >
                    {project}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleSave}
              disabled={isLoading || !projectsInput.trim()}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add Projects</span>
                </>
              )}
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const PrefPage = () => {
  const { preferences, loading, error, refreshPreferences, isSocketConnected } =
    useDashboard();
  const { updatePreferences } = useResumes();
  const [selectedRecord, setSelectedRecord] = useState(0);
  const { lastUpdated, isLive } = useDashboard();
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Modal states
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showTitleRestrictionModal, setShowTitleRestrictionModal] = useState(false);
  const [isAddingSkills, setIsAddingSkills] = useState(false);
  const [isAddingProjects, setIsAddingProjects] = useState(false);

  // Initialize edit data when editing starts
  const startEditing = () => {
    const currentRecord = preferences.records[selectedRecord];
    setEditData({
      preferences: typeof currentRecord.preferences === 'string' 
        ? currentRecord.preferences 
        : JSON.stringify(currentRecord.preferences) || "",
      summary: currentRecord.summary || "",
      skills: [...(currentRecord.skills || [])],
      projects: [...(currentRecord.projects || [])]
    });
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditData({});
  };

  // Save preferences - preserve selected record
  const savePreferences = async () => {
    const currentSelectedIndex = selectedRecord; // Store current selection index
    console.log(preferences.records[selectedRecord]._id);
    setIsSaving(true);
    try {
      await updatePreferences(editData, preferences.records[selectedRecord]._id);
      setIsEditing(false);
      setEditData({});
      // Refresh preferences to get updated data
      await refreshPreferences();
      // Restore the selected record after refresh
      setSelectedRecord(currentSelectedIndex);
    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle adding skills from modal
  const handleAddSkills = async (newSkills) => {
    setIsAddingSkills(true);
    try {
      const updatedSkills = [...editData.skills, ...newSkills];
      setEditData(prev => ({
        ...prev,
        skills: updatedSkills
      }));
      setShowSkillsModal(false);
    } catch (error) {
      console.error('Error adding skills:', error);
    } finally {
      setIsAddingSkills(false);
    }
  };

  // Handle adding projects from modal
  const handleAddProjects = async (newProjects) => {
    setIsAddingProjects(true);
    try {
      const updatedProjects = [...editData.projects, ...newProjects];
      setEditData(prev => ({
        ...prev,
        projects: updatedProjects
      }));
      setShowProjectsModal(false);
    } catch (error) {
      console.error('Error adding projects:', error);
    } finally {
      setIsAddingProjects(false);
    }
  };

  // Remove skill
  const removeSkill = (index) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Remove project
  const removeProject = (index) => {
    setEditData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="relative px-4 sm:px-6 lg:px-8">
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
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="text-red-600 text-sm font-medium">{error}</div>
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
      <div className="relative px-4 sm:px-6 lg:px-8">
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

  // Helper function to safely render preference title
  const renderPreferenceTitle = (preferences) => {
    if (typeof preferences === 'string') {
      return preferences;
    } else if (typeof preferences === 'object' && preferences !== null) {
      return JSON.stringify(preferences);
    }
    return "Untitled Preference";
  };

  return (
    <div className="relative px-4 sm:px-6 lg:px-8">
      {/* Background gradient blobs */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-10 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-8 blur-2xl -z-10"></div>
      <div className="absolute top-32 left-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 opacity-6 blur-xl -z-10"></div>

      {/* Modals */}
      <TitleRestrictionModal
        isOpen={showTitleRestrictionModal}
        onClose={() => setShowTitleRestrictionModal(false)}
      />

      <SkillsModal
        isOpen={showSkillsModal}
        onClose={() => setShowSkillsModal(false)}
        currentSkills={editData.skills || []}
        onSave={handleAddSkills}
        isLoading={isAddingSkills}
      />

      <ProjectsModal
        isOpen={showProjectsModal}
        onClose={() => setShowProjectsModal(false)}
        currentProjects={editData.projects || []}
        onSave={handleAddProjects}
        isLoading={isAddingProjects}
      />

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
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
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
              className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded border border-blue-200 hover:border-blue-300 transition-colors self-start sm:self-auto"
            >
              Refresh
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs text-gray-600">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Records Sidebar */}
          <motion.div className="lg:col-span-1 order-2 lg:order-1" variants={itemVariants}>
            <div className="bg-white border border-gray-200 rounded-lg p-4 relative overflow-hidden">
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-200/15 blur-md"></div>

              <h3 className="text-sm font-semibold mb-3 flex items-center text-gray-800">
                <Layers className="h-4 w-4 mr-2 text-gray-600" />
                Preference Records
              </h3>
              <div className="space-y-2 max-h-64 lg:max-h-96 overflow-y-auto">
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
                      {renderPreferenceTitle(record.preferences) || "Untitled"}
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
          <div className="lg:col-span-3 order-1 lg:order-2 space-y-4">
            {/* Current Record Details */}
            <motion.div
              className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 relative overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gradient-to-br from-green-200/20 to-blue-200/15 blur-lg"></div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-3 sm:space-y-0">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center flex-1">
                  <Target className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                  <button
                    onClick={() => setShowTitleRestrictionModal(true)}
                    className="text-left hover:text-blue-600 transition-colors cursor-pointer truncate"
                    title="Click to learn why this cannot be edited"
                  >
                    {renderPreferenceTitle(currentRecord.preferences) || "Untitled Preference"}
                  </button>
                  <Lock className="h-3 w-3 ml-2 text-gray-400 flex-shrink-0" />
                </h2>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                    Record {selectedRecord + 1} of {preferences.records.length}
                  </span>
                  
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={savePreferences}
                        disabled={isSaving}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs flex items-center space-x-1 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-3 w-3" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs flex items-center space-x-1"
                      >
                        <X className="h-3 w-3" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={startEditing}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs flex items-center space-x-1"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <FileText className="h-3 w-3 mr-1 text-gray-600" />
                  Summary
                </h3>
                {isEditing ? (
                  <textarea
                    value={editData.summary || ""}
                    onChange={(e) => setEditData(prev => ({ ...prev, summary: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-3 text-xs text-gray-700 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter your professional summary"
                  />
                ) : (
                  <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {currentRecord.summary || "No summary provided"}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div className="mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                  <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                    <Code className="h-3 w-3 mr-1 text-gray-600" />
                    Skills ({isEditing ? (editData.skills || []).length : (currentRecord.skills || []).length})
                  </h3>
                  {isEditing && (
                    <button
                      onClick={() => setShowSkillsModal(true)}
                      className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors flex items-center space-x-1 self-start sm:self-auto"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Skills</span>
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(isEditing ? (editData.skills || []) : (currentRecord.skills || [])).map((skill, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium ${
                        isEditing ? 'flex items-center space-x-1' : ''
                      }`}
                    >
                      <span>{skill}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(index)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                  <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                    <FolderOpen className="h-3 w-3 mr-1 text-gray-600" />
                    Projects ({isEditing ? (editData.projects || []).length : (currentRecord.projects || []).length})
                  </h3>
                  {isEditing && (
                    <button
                      onClick={() => setShowProjectsModal(true)}
                      className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full hover:bg-green-200 transition-colors flex items-center space-x-1 self-start sm:self-auto"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Projects</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(isEditing ? (editData.projects || []) : (currentRecord.projects || [])).map((project, index) => (
                    <div
                      key={index}
                      className={`p-2 bg-green-50 border border-green-200 rounded-lg ${
                        isEditing ? 'flex items-center justify-between' : ''
                      }`}
                    >
                      <div className="font-medium text-xs text-green-800 flex-1">
                        {project}
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => removeProject(index)}
                          className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created: {new Date(currentRecord.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Updated: {new Date(currentRecord.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Aggregated Data */}
            <motion.div
              className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 relative overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/15 blur-xl"></div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
                Aggregated Overview
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* All Unique Skills */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <Code className="h-3 w-3 mr-1 text-gray-600" />
                    All Unique Skills ({preferences.aggregated.allSkills.length})
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
                    {preferences.aggregated.allProjects.map((project, index) => (
                      <div
                        key={index}
                        className="p-2 bg-white rounded text-xs text-gray-700 border border-gray-200"
                      >
                        {project}
                      </div>
                    ))}
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
                  {preferences.aggregated.latestSummary || "No summary available"}
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
