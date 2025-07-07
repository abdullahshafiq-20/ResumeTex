import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJobs } from '../context/LinkedinJobs';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ExternalLink,
  Filter,
  RefreshCw,
  TrendingUp,
  Target,
  BarChart3,
  AlertTriangle,
  Clock,
  Star,
  Building2,
  Search,
  ChevronDown,
  ChevronUp,
  Code,
  FileText,
  Users
} from 'lucide-react';
import { useDashboard } from '../context/DashbaordContext';

const JobPage = () => {
  const {
    jobs,
    jobsData,
    loading,
    error,
    jobFilters,
    refreshJobs,
    updateJobFilters,
    fetchJobs,
    getScoreColor,
    summary,
    scoreDistribution,
    preferenceResults
  } = useJobs();

  const { lastUpdated, isLive } = useDashboard();
  const [showFilters, setShowFilters] = useState(false);
  const [expandedJob, setExpandedJob] = useState(null);
  const [localFilters, setLocalFilters] = useState(jobFilters);
  const [isSearching, setIsSearching] = useState(false);

  // Handle local filter changes (doesn't trigger search)
  const handleFilterChange = (newFilters) => {
    setLocalFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Handle search with current local filters
  const handleSearch = async () => {
    setIsSearching(true);
    try {
      // Update the context filters and trigger search
      updateJobFilters(localFilters);
      await fetchJobs(localFilters);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Reset filters to default
  const resetFilters = () => {
    const defaultFilters = {
      limit: 10,
      limitPerPreference: 10,
      ago: '1d',
      remoteFilter: 'remote'
    };
    setLocalFilters(defaultFilters);
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative">
        {/* Background gradient blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-20 blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-15 blur-2xl -z-10"></div>
        
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border border-blue-600 border-t-transparent"></div>
            <p className="text-sm text-gray-600">Finding your perfect opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
            <p className="text-sm text-red-800">{error}</p>
            <button 
              onClick={refreshJobs}
              className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            onClick={refreshJobs}
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
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Smart Job Matching</h2>
        <p className="text-sm text-gray-600">
          AI-powered job recommendations based on your preferences
        </p>
      </motion.div>

      {/* Summary Cards */}
      {summary && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white border border-gray-200 rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-30 blur-lg"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Total Jobs</p>
                <p className="text-xl font-bold text-gray-800">{summary.totalJobsFound}</p>
              </div>
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-green-200 to-green-300 opacity-30 blur-lg"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Average Score</p>
                <p className="text-xl font-bold text-gray-800">{summary.averageScore}%</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-30 blur-lg"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Preferences</p>
                <p className="text-xl font-bold text-gray-800">{summary.totalPreferencesSearched}</p>
              </div>
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 opacity-30 blur-lg"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Highest Score</p>
                <p className="text-xl font-bold text-gray-800">{summary.highestScore}%</p>
              </div>
              <Star className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div 
        className="bg-white border border-gray-200 rounded-lg p-4 mb-6 relative overflow-hidden"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-20 blur-xl"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-800 flex items-center">
              <Filter className="h-4 w-4 mr-2 text-gray-600" />
              Search Filters
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
            >
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Limit</label>
                    <input
                      type="number"
                      value={localFilters.limit}
                      onChange={(e) => handleFilterChange({ limit: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Per Preference</label>
                    <input
                      type="number"
                      value={localFilters.limitPerPreference}
                      onChange={(e) => handleFilterChange({ limitPerPreference: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                    <select
                      value={localFilters.ago}
                      onChange={(e) => handleFilterChange({ ago: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1h">Last hour</option>
                      <option value="1d">Last day</option>
                      <option value="3d">Last 3 days</option>
                      <option value="1w">Last week</option>
                      <option value="1m">Last month</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remote Filter</label>
                    <select
                      value={localFilters.remoteFilter}
                      onChange={(e) => handleFilterChange({ remoteFilter: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All jobs</option>
                      <option value="remote">Remote only</option>
                      <option value="onsite">On-site only</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                {/* Search Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={resetFilters}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Reset Filters
                  </button>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={refreshJobs}
                      className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition-colors"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Quick Refresh
                    </button>
                    
                    <button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSearching ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-2"></div>
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-3 w-3 mr-2" />
                          Search Jobs
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Preference Results */}
      {preferenceResults && preferenceResults.length > 0 && (
        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-4 mb-6 relative overflow-hidden"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute bottom-4 left-4 w-14 h-14 rounded-full bg-gradient-to-br from-green-200 to-cyan-200 opacity-25 blur-lg"></div>
          <div className="relative">
            <h3 className="text-base font-medium text-gray-800 mb-4 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-gray-600" />
              Preference Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {preferenceResults.map((pref, index) => (
                <div key={index} className="bg-gray-50 border border-gray-100 rounded p-3">
                  <h4 className="font-medium text-sm text-gray-800 mb-2">{pref.preference}</h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Jobs: {pref.jobsFound}</span>
                    <span className="text-blue-600 font-medium">Avg: {pref.averageScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Jobs Grid */}
      {(!jobs || jobs.length === 0) ? (
        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-8 text-center"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-base font-medium text-gray-700 mb-2">No Jobs Found</h3>
          <p className="text-sm text-gray-500 mb-4">
            We couldn't find any jobs matching your current preferences and filters.
          </p>
          <button 
            onClick={refreshJobs}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Search
          </button>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="text-base font-medium text-gray-800 flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-gray-600" />
            Matched Opportunities ({jobs.length})
          </h3>

          {/* Jobs Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {jobs.map((job, index) => (
                <JobCard 
                  key={`${job.jobUrl}-${index}`}
                  job={job}
                  index={index}
                  getScoreColor={getScoreColor}
                  expanded={expandedJob === job.jobUrl}
                  onToggleExpand={() => setExpandedJob(expandedJob === job.jobUrl ? null : job.jobUrl)}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Job Card Component (Redesigned for Grid Layout)
const JobCard = ({ job, index, getScoreColor, expanded, onToggleExpand }) => (
  <motion.div
    className="bg-white border border-gray-200 rounded-lg p-4 relative overflow-hidden hover:border-gray-300 transition-all duration-300 h-fit"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -2 }}
  >
    <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-200 to-blue-200 opacity-30 blur-md"></div>
    
    <div className="relative">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-medium text-gray-800 mb-2 line-clamp-2 leading-tight">{job.position}</h4>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Building2 className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{job.company}</span>
            </div>
          </div>
          
          {job.companyLogo && (
            <img 
              src={job.companyLogo} 
              alt={job.company}
              className="w-10 h-10 rounded border border-gray-200 object-cover flex-shrink-0 ml-3"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>

        {/* Score and Rank */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(job.matchScore)}`}>
            {job.matchScore}% Match
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <Star className="h-3 w-3 mr-1 text-yellow-500" />
            Rank #{job.rank}
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center text-gray-600">
          <MapPin className="h-3 w-3 mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="h-3 w-3 mr-2 text-gray-400 flex-shrink-0" />
          <span>{job.date}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="h-3 w-3 mr-2 text-gray-400 flex-shrink-0" />
          <span>{job.agoTime}</span>
        </div>
      </div>

      {/* Match Info */}
      <div className="mb-4">
        <div className="flex items-center mb-2 text-sm">
          <Target className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" />
          <span className="text-gray-600 truncate">
            Via: <span className="text-blue-600 font-medium">{job.preferenceUsed}</span>
          </span>
        </div>
        
        {job.matchReasons && (
          <div className="flex flex-wrap gap-1">
            {job.matchReasons.slice(0, 2).map((reason, idx) => (
              <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
                {reason}
              </span>
            ))}
            {job.matchReasons.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{job.matchReasons.length - 2} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 pb-4 border-b border-gray-100"
          >
            {job.skillsFromProfile && job.skillsFromProfile.length > 0 && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                  <Code className="h-3 w-3 mr-1 text-gray-500" />
                  Skills Match
                </h5>
                <div className="flex flex-wrap gap-1">
                  {job.skillsFromProfile.slice(0, 6).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200">
                      {skill}
                    </span>
                  ))}
                  {job.skillsFromProfile.length > 6 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{job.skillsFromProfile.length - 6}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="text-sm space-y-1">
              <div>
                <span className="font-medium text-gray-700">Keywords:</span>
                <p className="text-gray-600 text-xs">{job.searchKeywords}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Salary:</span>
                <p className="text-gray-600 text-xs">{job.salary}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onToggleExpand}
          className="text-gray-600 hover:text-gray-800 text-sm flex items-center"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              More
            </>
          )}
        </button>

        <a
          href={job.jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          View Job
        </a>
      </div>
    </div>
  </motion.div>
);

export default JobPage;