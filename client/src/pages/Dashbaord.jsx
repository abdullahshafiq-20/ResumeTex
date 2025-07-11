import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../context/DashbaordContext';
import { 
  BarChart3, 
  FileText, 
  Mail, 
  MessageSquare,
  TrendingUp,
  Calendar,
  Users,
  Star,
  AlertTriangle,
  Activity,
  PieChart,
  Target,
  ArrowUpRight
} from 'lucide-react';

const Dashboard = () => {
  const { 
    stats, 
    activity, 
    comparison, 
    preferences,
    loading, 
    error, 
    fetchDashboardData, 
    isLive, 
    lastUpdated 
  } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-sm text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
          <p className="text-sm text-red-800">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'email':
        return <Mail className="h-3 w-3" />;
      case 'linkedin':
        return <MessageSquare className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  // Simple chart component for visual data representation
  const MiniChart = ({ data, color = 'blue', type = 'bar' }) => {
    const maxValue = Math.max(...data);
    
    return (
      <div className="flex items-end space-x-1 h-8">
        {data.map((value, index) => (
          <div
            key={index}
            className={`w-2 bg-${color}-500 rounded-t-sm`}
            style={{ height: `${(value / maxValue) * 100}%` }}
          />
        ))}
      </div>
    );
  };

  const CircularProgress = ({ percentage, size = 40, color = 'blue' }) => {
    const radius = (size - 4) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={strokeDasharray}
            className={`text-${color}-500`}
          />
        </svg>
        <span className={`absolute text-xs font-medium text-${color}-600`}>
          {percentage}%
        </span>
      </div>
    );
  };

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
      {/* Gradient background blobs */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-15 blur-2xl -z-10"></div>
      <div className="absolute top-32 left-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 opacity-10 blur-xl -z-10"></div>

      {/* Live Status Indicator */}
      <motion.div
        className="mb-3 sm:mb-6 p-2 sm:p-3 rounded-lg border border-gray-200 bg-white relative overflow-hidden"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}></div>
            <span className={`text-xs sm:text-sm font-medium ${isLive ? "text-green-700" : "text-yellow-700"}`}>
              Live Update
            </span>
            {lastUpdated && (
              <span className="text-[10px] sm:text-xs text-gray-500">
                • {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </div>
          <button 
            onClick={fetchDashboardData}
            className="text-blue-600 hover:text-blue-800 text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border border-blue-200 hover:border-blue-300 transition-colors"
          >
            Refresh
          </button>
        </div>
      </motion.div>
      {/* Header - More compact for mobile */}
      <motion.div 
        className="mb-4 sm:mb-6"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
          Welcome back, {stats?.user?.name}!
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Member since {stats?.user?.memberSince && formatDate(stats.user.memberSince)}
        </p>
      </motion.div>

      {/* User Status Cards - Mobile 2x2, Desktop 4x1 */}
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Activity Score */}
        <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-4 relative overflow-hidden">
          <div className="absolute top-1 right-1 w-6 h-6 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-30 blur-lg"></div>
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-2 lg:mb-0">
              <p className="text-gray-600 text-[10px] sm:text-xs font-medium">Activity Score</p>
              <p className="text-sm sm:text-xl font-bold text-gray-800">{stats?.user?.activityScore}%</p>
            </div>
            <div className="self-end lg:self-auto flex items-center space-x-1">
              <ArrowUpRight className="h-6 w-6 sm:h-6 sm:w-6 text-blue-600" /> 
              {/* <span className="text-sm sm:text-xl font-bold text-gray-800">{`${stats?.user?.activityScore}%` || 0}</span> */}
            </div>
          </div>
        </div>

        {/* Total Resumes */}
        <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-4 relative overflow-hidden">
          <div className="absolute top-1 right-1 w-6 h-6 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-200 to-green-300 opacity-30 blur-lg"></div>
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-2 lg:mb-0">
              <p className="text-gray-600 text-[10px] sm:text-xs font-medium">Total Resumes</p>
              <p className="text-sm sm:text-xl font-bold text-gray-800">{stats?.resumes?.total || 0}</p>
            </div>
            <div className="self-end lg:self-auto">
              <FileText className="h-6 w-6 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Emails Generated */}
        <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-4 relative overflow-hidden">
          <div className="absolute top-1 right-1 w-6 h-6 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-30 blur-lg"></div>
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-2 lg:mb-0">
              <p className="text-gray-600 text-[10px] sm:text-xs font-medium">Emails Generated</p>
              <p className="text-sm sm:text-xl font-bold text-gray-800">{stats?.emails?.generated || 0}</p>
            </div>
            <div className="self-end lg:self-auto">
              <Mail className="h-6 w-6 sm:h-6 sm:w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* LinkedIn Posts */}
        <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-4 relative overflow-hidden">
          <div className="absolute top-1 right-1 w-6 h-6 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 opacity-30 blur-lg"></div>
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-2 lg:mb-0">
              <p className="text-gray-600 text-[10px] sm:text-xs font-medium">LinkedIn Posts</p>
              <p className="text-sm sm:text-xl font-bold text-gray-800">{stats?.linkedIn?.totalPosts || 0}</p>
            </div>
            <div className="self-end lg:self-auto">
              <MessageSquare className="h-6 w-6 sm:h-6 sm:w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid - More compact for mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
        
        {/* Statistics Section */}
        <motion.div 
          className="lg:col-span-2 space-y-3 sm:space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Email Performance - Compact */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5 relative overflow-hidden">
            <div className="absolute top-2 right-2 w-8 h-8 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-20 blur-xl"></div>
            <div className="relative">
              <h3 className="font-medium text-sm sm:text-base mb-3 sm:mb-4 flex items-center text-gray-800">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-600" />
                Email Performance
                <div className="ml-auto hidden sm:block">
                  <MiniChart data={[12, 8, 15, 10, 18, 14, 20]} color="purple" />
                </div>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <div className="text-center">
                  <p className="text-sm sm:text-lg font-bold text-blue-600">{stats?.emails?.total}</p>
                  <p className="text-[10px] sm:text-xs text-gray-600">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-sm sm:text-lg font-bold text-green-600">{stats?.emails?.sent}</p>
                  <p className="text-[10px] sm:text-xs text-gray-600">Sent</p>
                </div>
                <div className="text-center">
                  <p className="text-sm sm:text-lg font-bold text-purple-600">{stats?.emails?.successRate}%</p>
                  <p className="text-[10px] sm:text-xs text-gray-600">Success Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-sm sm:text-lg font-bold text-orange-600">{stats?.linkedIn?.extractedEmails}</p>
                  <p className="text-[10px] sm:text-xs text-gray-600">Extracted</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completeness - Compact */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5 relative overflow-hidden">
            <div className="absolute bottom-2 left-2 w-8 h-8 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-green-200 to-cyan-200 opacity-25 blur-lg"></div>
            <div className="relative">
              <h3 className="font-medium text-sm sm:text-base mb-3 sm:mb-4 flex items-center text-gray-800">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-600" />
                Profile Status
                <Target className="h-3 w-3 sm:h-4 sm:w-4 ml-auto text-gray-400" />
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Skills Added</span>
                  <span className="font-semibold text-xs sm:text-sm">{preferences?.skillsCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Projects</span>
                  <span className="font-semibold text-xs sm:text-sm">{preferences?.projectsCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Summary</span>
                  <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${preferences?.hasSummary ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                    {preferences?.hasSummary ? 'Complete' : 'Missing'}
                  </span>
                </div>
                {!preferences?.hasPreferences && (
                  <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-[10px] sm:text-xs text-blue-700">
                      Set up your preferences to personalize your experience.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Performance Comparison - Compact */}
          {comparison && (
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5 relative overflow-hidden">
              <div className="absolute top-2 left-2 w-6 h-6 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-200 to-blue-200 opacity-30 blur-lg"></div>
              <div className="relative">
                <h3 className="font-medium text-sm sm:text-base mb-3 sm:mb-4 flex items-center text-gray-800">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-600" />
                  Performance vs Others
                  <PieChart className="h-3 w-3 sm:h-4 sm:w-4 ml-auto text-gray-400" />
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="text-center">
                    <CircularProgress percentage={comparison.resumes?.percentile || 0} size={35} color="blue" />
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-1 sm:mt-2">Resumes</p>
                    <p className="text-[9px] sm:text-xs text-gray-500">{comparison.resumes?.user} vs {comparison.resumes?.average}</p>
                  </div>
                  <div className="text-center">
                    <CircularProgress percentage={comparison.emails?.percentile || 0} size={35} color="green" />
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-1 sm:mt-2">Emails</p>
                    <p className="text-[9px] sm:text-xs text-gray-500">{comparison.emails?.user} vs {comparison.emails?.average}</p>
                  </div>
                  <div className="text-center">
                    <CircularProgress percentage={comparison.posts?.percentile || 0} size={35} color="purple" />
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-1 sm:mt-2">Posts</p>
                    <p className="text-[9px] sm:text-xs text-gray-500">{comparison.posts?.user} vs {comparison.posts?.average}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Activity Timeline - Compact */}
        <motion.div 
          className="space-y-3 sm:space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 relative overflow-hidden">
            <div className="absolute top-1 right-1 w-4 h-4 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-cyan-200 to-blue-200 opacity-30 blur-md"></div>
            <div className="relative">
              <h3 className="font-medium text-xs sm:text-sm mb-2 sm:mb-3 flex items-center text-gray-800">
                <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2 text-gray-600" />
                Recent Activity
                <Activity className="h-3 w-3 sm:h-3.5 sm:w-3.5 ml-auto text-gray-400" />
              </h3>
              <div className="space-y-1.5 sm:space-y-2 max-h-60 sm:max-h-72 overflow-y-auto custom-scrollbar">
                {activity?.slice(0, 12).map((item, index) => (
                  <div key={index} className="flex items-start space-x-2 sm:space-x-2.5 p-1.5 sm:p-2.5 bg-gray-50/80 rounded-md border border-gray-100/80 hover:bg-gray-50 transition-colors">
                    <div className={`p-0.5 sm:p-1 rounded-full shrink-0 ${
                      item.type === 'email' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {getActivityIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs font-medium text-gray-900 truncate leading-tight">
                        {item.title}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5">
                        {formatDate(item.date)}
                      </p>
                      {item.metadata?.recipient && (
                        <p className="text-[9px] sm:text-[10px] text-gray-400 truncate mt-0.5">
                          To: {item.metadata.recipient}
                        </p>
                      )}
                      {item.metadata?.sent && (
                        <span className="inline-flex items-center px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-full text-[8px] sm:text-[9px] bg-green-50 text-green-600 border border-green-200 mt-1">
                          <Star className="h-1 w-1 sm:h-1.5 sm:w-1.5 mr-0.5 sm:mr-1" />
                          Sent
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {(!activity || activity.length === 0) && (
                  <div className="text-center py-4 sm:py-6">
                    <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-[10px] sm:text-xs text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats - Compact */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 relative overflow-hidden">
            <div className="absolute bottom-1 right-1 w-3 h-3 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 opacity-30 blur-sm"></div>
            <div className="relative">
              <h3 className="font-medium text-xs sm:text-sm mb-2 sm:mb-3 text-gray-800">Quick Stats</h3>
              <div className="space-y-1.5 sm:space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] sm:text-xs text-gray-600">Total Users</span>
                  <span className="font-semibold text-[10px] sm:text-xs text-gray-800">{stats?.global?.totalUsers?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] sm:text-xs text-gray-600">Job Titles Found</span>
                  <span className="font-semibold text-[10px] sm:text-xs text-gray-800">{stats?.linkedIn?.uniqueJobTitles}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] sm:text-xs text-gray-600">Hashtags Extracted</span>
                  <span className="font-semibold text-[10px] sm:text-xs text-gray-800">{stats?.linkedIn?.totalHashtags}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] sm:text-xs text-gray-600">URLs Found</span>
                  <span className="font-semibold text-[10px] sm:text-xs text-gray-800">{stats?.linkedIn?.totalUrls}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;