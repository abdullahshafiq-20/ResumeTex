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
  Target
} from 'lucide-react';

const Dashboard = () => {
  const { 
    stats, 
    activity, 
    comparison, 
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
            onClick={fetchDashboardData}
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
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Welcome back, {stats?.user?.name}!
        </h2>
        <p className="text-sm text-gray-600">
          Member since {stats?.user?.memberSince && formatDate(stats.user.memberSince)}
        </p>
      </motion.div>

      {/* User Status Cards */}
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
              <p className="text-gray-600 text-xs font-medium">Activity Score</p>
              <p className="text-xl font-bold text-gray-800">{stats?.user?.activityScore}%</p>
            </div>
            <CircularProgress percentage={stats?.user?.activityScore || 0} color="blue" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 relative overflow-hidden">
          <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-green-200 to-green-300 opacity-30 blur-lg"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Total Resumes</p>
              <p className="text-xl font-bold text-gray-800">{stats?.resumes?.total || 0}</p>
            </div>
            <FileText className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 relative overflow-hidden">
          <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-30 blur-lg"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Emails Generated</p>
              <p className="text-xl font-bold text-gray-800">{stats?.emails?.generated || 0}</p>
            </div>
            <Mail className="h-6 w-6 text-purple-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 relative overflow-hidden">
          <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 opacity-30 blur-lg"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">LinkedIn Posts</p>
              <p className="text-xl font-bold text-gray-800">{stats?.linkedIn?.totalPosts || 0}</p>
            </div>
            <MessageSquare className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Statistics Section */}
        <motion.div 
          className="lg:col-span-2 space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Email Performance */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-20 blur-xl"></div>
            <div className="relative">
              <h3 className="font-medium text-base mb-4 flex items-center text-gray-800">
                <Mail className="h-4 w-4 mr-2 text-gray-600" />
                Email Performance
                <div className="ml-auto">
                  <MiniChart data={[12, 8, 15, 10, 18, 14, 20]} color="purple" />
                </div>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{stats?.emails?.total}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{stats?.emails?.sent}</p>
                  <p className="text-xs text-gray-600">Sent</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">{stats?.emails?.successRate}%</p>
                  <p className="text-xs text-gray-600">Success Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-orange-600">{stats?.linkedIn?.extractedEmails}</p>
                  <p className="text-xs text-gray-600">Extracted</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completeness */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute bottom-4 left-4 w-14 h-14 rounded-full bg-gradient-to-br from-green-200 to-cyan-200 opacity-25 blur-lg"></div>
            <div className="relative">
              <h3 className="font-medium text-base mb-4 flex items-center text-gray-800">
                <Users className="h-4 w-4 mr-2 text-gray-600" />
                Profile Status
                <Target className="h-4 w-4 ml-auto text-gray-400" />
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Skills Added</span>
                  <span className="font-semibold text-sm">{stats?.preferences?.skillsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Projects</span>
                  <span className="font-semibold text-sm">{stats?.preferences?.projectsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Summary</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${stats?.preferences?.hasSummary ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                    {stats?.preferences?.hasSummary ? 'Complete' : 'Missing'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Comparison */}
          {comparison && (
            <div className="bg-white border border-gray-200 rounded-lg p-5 relative overflow-hidden">
              <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-200 to-blue-200 opacity-30 blur-lg"></div>
              <div className="relative">
                <h3 className="font-medium text-base mb-4 flex items-center text-gray-800">
                  <BarChart3 className="h-4 w-4 mr-2 text-gray-600" />
                  Performance vs Others
                  <PieChart className="h-4 w-4 ml-auto text-gray-400" />
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <CircularProgress percentage={comparison.resumes?.percentile || 0} size={50} color="blue" />
                    <p className="text-xs text-gray-600 mt-2">Resumes</p>
                    <p className="text-xs text-gray-500">{comparison.resumes?.user} vs {comparison.resumes?.average}</p>
                  </div>
                  <div className="text-center">
                    <CircularProgress percentage={comparison.emails?.percentile || 0} size={50} color="green" />
                    <p className="text-xs text-gray-600 mt-2">Emails</p>
                    <p className="text-xs text-gray-500">{comparison.emails?.user} vs {comparison.emails?.average}</p>
                  </div>
                  <div className="text-center">
                    <CircularProgress percentage={comparison.posts?.percentile || 0} size={50} color="purple" />
                    <p className="text-xs text-gray-600 mt-2">Posts</p>
                    <p className="text-xs text-gray-500">{comparison.posts?.user} vs {comparison.posts?.average}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Activity Timeline */}
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white border border-gray-200 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute top-2 right-2 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-200 to-blue-200 opacity-25 blur-md"></div>
            <div className="relative">
              <h3 className="font-medium text-base mb-4 flex items-center text-gray-800">
                <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                Recent Activity
                <Activity className="h-4 w-4 ml-auto text-gray-400" />
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {activity?.slice(0, 10).map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className={`p-1.5 rounded-full ${
                      item.type === 'email' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {getActivityIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(item.date)}
                      </p>
                      {item.metadata?.recipient && (
                        <p className="text-xs text-gray-400 truncate">
                          To: {item.metadata.recipient}
                        </p>
                      )}
                      {item.metadata?.sent && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 border border-green-200 mt-1">
                          <Star className="h-2 w-2 mr-1" />
                          Sent
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 opacity-30 blur-sm"></div>
            <div className="relative">
              <h3 className="font-medium text-base mb-4 text-gray-800">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Users</span>
                  <span className="font-semibold text-sm text-gray-800">{stats?.global?.totalUsers?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Job Titles Found</span>
                  <span className="font-semibold text-sm text-gray-800">{stats?.linkedIn?.uniqueJobTitles}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hashtags Extracted</span>
                  <span className="font-semibold text-sm text-gray-800">{stats?.linkedIn?.totalHashtags}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">URLs Found</span>
                  <span className="font-semibold text-sm text-gray-800">{stats?.linkedIn?.totalUrls}</span>
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