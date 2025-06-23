import React from 'react';
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
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const { stats, activity, comparison, loading, error, fetchDashboardData } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-800">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="ml-auto text-red-600 hover:text-red-800 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
        return <Mail className="h-4 w-4" />;
      case 'linkedin':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Welcome back, {stats?.user?.name}!
        </h2>
        <p className="text-gray-600">
          Member since {stats?.user?.memberSince && formatDate(stats.user.memberSince)}
        </p>
      </motion.div>

      {/* User Status Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Activity Score</p>
              <p className="text-2xl font-bold">{stats?.user?.activityScore}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Resumes</p>
              <p className="text-2xl font-bold">{stats?.resumes?.total || 0}</p>
            </div>
            <FileText className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Emails Generated</p>
              <p className="text-2xl font-bold">{stats?.emails?.generated || 0}</p>
            </div>
            <Mail className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">LinkedIn Posts</p>
              <p className="text-2xl font-bold">{stats?.linkedIn?.totalPosts || 0}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Statistics Section */}
        <motion.div 
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Email Performance */}
          <div className="bg-white shadow rounded-lg p-6 border border-gray-200/60">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-gray-600" />
              Email Performance
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats?.emails?.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats?.emails?.sent}</p>
                <p className="text-sm text-gray-600">Sent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{stats?.emails?.successRate}%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{stats?.linkedIn?.extractedEmails}</p>
                <p className="text-sm text-gray-600">Extracted</p>
              </div>
            </div>
          </div>

          {/* Profile Completeness */}
          <div className="bg-white shadow rounded-lg p-6 border border-gray-200/60">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-gray-600" />
              Profile Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Skills Added</span>
                <span className="font-semibold">{stats?.preferences?.skillsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Projects</span>
                <span className="font-semibold">{stats?.preferences?.projectsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Summary</span>
                <span className={`px-2 py-1 rounded-full text-xs ${stats?.preferences?.hasSummary ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {stats?.preferences?.hasSummary ? 'Complete' : 'Missing'}
                </span>
              </div>
              {/* <div className="flex items-center justify-between">
                <span className="text-gray-600">Extension Connected</span>
                <span className={`px-2 py-1 rounded-full text-xs ${stats?.user?.extensionConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {stats?.user?.extensionConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div> */}
            </div>
          </div>

          {/* Performance Comparison */}
          {comparison && (
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200/60">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-gray-600" />
                Performance vs Others
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{comparison.resumes?.percentile}%</p>
                  <p className="text-sm text-gray-600">Resumes Percentile</p>
                  <p className="text-xs text-gray-500">{comparison.resumes?.user} vs {comparison.resumes?.average} avg</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{comparison.emails?.percentile}%</p>
                  <p className="text-sm text-gray-600">Emails Percentile</p>
                  <p className="text-xs text-gray-500">{comparison.emails?.user} vs {comparison.emails?.average} avg</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{comparison.posts?.percentile}%</p>
                  <p className="text-sm text-gray-600">Posts Percentile</p>
                  <p className="text-xs text-gray-500">{comparison.posts?.user} vs {comparison.posts?.average} avg</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Activity Timeline */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-white shadow rounded-lg p-6 border border-gray-200/60">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-600" />
              Recent Activity
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activity?.slice(0, 10).map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
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
                      <p className="text-xs text-gray-400">
                        To: {item.metadata.recipient}
                      </p>
                    )}
                    {item.metadata?.sent && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 mt-1">
                        <Star className="h-3 w-3 mr-1" />
                        Sent
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white shadow rounded-lg p-6 border border-gray-200/60">
            <h3 className="font-semibold text-lg mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Users</span>
                <span className="font-semibold">{stats?.global?.totalUsers?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Job Titles Found</span>
                <span className="font-semibold">{stats?.linkedIn?.uniqueJobTitles}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hashtags Extracted</span>
                <span className="font-semibold">{stats?.linkedIn?.totalHashtags}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">URLs Found</span>
                <span className="font-semibold">{stats?.linkedIn?.totalUrls}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;