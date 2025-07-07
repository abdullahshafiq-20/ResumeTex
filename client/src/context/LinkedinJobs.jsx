import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";
import api from "../utils/api";

const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [jobsData, setJobsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getUserId } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Memoize userId to prevent unnecessary re-renders
  const userId = useMemo(() => getUserId(), [getUserId]);

  // Default parameters for jobs API
  const [jobFilters, setJobFilters] = useState({
    limit: 10,
    limitPerPreference: 10,
    ago: '1d',
    remoteFilter: 'remote'
  });

  // Fetch jobs from the new API endpoint
  const fetchJobs = useCallback(async (filters = jobFilters) => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`${apiUrl}/jobs-all-preferences-sorted?${queryParams}`);
      
      setJobsData(response.data);
      setJobs(response.data?.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError(error.response?.data?.message || "Failed to fetch jobs");
      setJobs([]);
      setJobsData(null);
    } finally {
      setLoading(false);
    }
  }, [userId, apiUrl, jobFilters]);

  // Update job filters
  const updateJobFilters = useCallback((newFilters) => {
    setJobFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Refresh jobs with current filters
  const refreshJobs = useCallback(() => {
    fetchJobs(jobFilters);
  }, [fetchJobs, jobFilters]);

  // Get score category for a job
  const getScoreCategory = useCallback((score) => {
    if (score >= 70) return 'excellent';
    if (score >= 50) return 'good';
    if (score >= 30) return 'fair';
    return 'poor';
  }, []);

  // Get score color for UI
  const getScoreColor = useCallback((score) => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-blue-600 bg-blue-100';
    if (score >= 30) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    if (userId) {
      fetchJobs();
    }
  }, [userId, fetchJobs]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    jobs,
    jobsData,
    loading,
    error,
    jobFilters,
    fetchJobs,
    refreshJobs,
    updateJobFilters,
    getScoreCategory,
    getScoreColor,
    // Computed values from jobsData
    summary: jobsData?.summary || null,
    scoreDistribution: jobsData?.scoreDistribution || null,
    preferenceDistribution: jobsData?.preferenceDistribution || null,
    preferenceResults: jobsData?.preferenceResults || []
  }), [
    jobs, 
    jobsData, 
    loading, 
    error, 
    jobFilters, 
    fetchJobs, 
    refreshJobs, 
    updateJobFilters, 
    getScoreCategory, 
    getScoreColor
  ]);

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};

export default JobsContext;


