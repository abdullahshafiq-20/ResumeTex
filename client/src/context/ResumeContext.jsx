import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getUserId } = useAuth();
  const { socket, isConnected, onEvent } = useSocket();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Memoize userId to prevent unnecessary re-renders
  const userId = useMemo(() => getUserId(), [getUserId]);

  // Fetch resumes from API - fix dependency array
  const fetchResumes = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await api.get(`${apiUrl}/resume/${userId}`);
      setResumes(response.data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, apiUrl]); // Remove getUserId from dependencies

  // Create resume with socket emission
  const createResume = useCallback(async (resumeData) => {
    setLoading(true);
    try {
      const response = await api.post(`${apiUrl}/resume`, resumeData);
      return response.data;
    } catch (error) {
      console.error("Error creating resume:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  // Update resume with socket emission
  const updateResume = useCallback(async (resumeId, resumeData) => {
    setLoading(true);
    try {
      const response = await api.put(`${apiUrl}/resume/${resumeId}`, resumeData);
      return response.data;
    } catch (error) {
      console.error("Error updating resume:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  // Delete resume with socket emission
  const deleteResume = useCallback(async (resumeId) => {
    setLoading(true);
    try {
      await api.delete(`${apiUrl}/resume/${resumeId}`);
      return true;
    } catch (error) {
      console.error("Error deleting resume:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  // Socket event handlers - fix to prevent recreation
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Handle resume created event
    const handleResumeCreated = (data) => {
      console.log('Resume created via socket:', data);
      setResumes(prev => [...prev, data.data]);
    };

    // Handle resume updated event
    const handleResumeUpdated = (data) => {
      console.log('Resume updated via socket:', data);
      setResumes(prev => 
        prev.map(resume => 
          resume._id === data.data._id ? data.data : resume
        )
      );
    };

    // Handle resume deleted event
    const handleResumeDeleted = (data) => {
      console.log('Resume deleted via socket:', data);
      setResumes(prev => 
        prev.filter(resume => resume._id !== data.data.resumeId)
      );
    };

    // Register event listeners
    const cleanupCreated = onEvent('resume_created', handleResumeCreated);
    const cleanupUpdated = onEvent('resume_updated', handleResumeUpdated);
    const cleanupDeleted = onEvent('resume_deleted', handleResumeDeleted);

    // Cleanup function
    return () => {
      if (cleanupCreated) cleanupCreated();
      if (cleanupUpdated) cleanupUpdated();
      if (cleanupDeleted) cleanupDeleted();
    };
  }, [socket, isConnected, onEvent]);

  // Initial fetch on mount - only run once when userId is available
  useEffect(() => {
    if (userId) {
      fetchResumes();
    }
  }, [userId]); // Remove fetchResumes from dependencies

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    resumes,
    loading,
    createResume,
    updateResume,
    deleteResume,
    fetchResumes,
    isSocketConnected: isConnected
  }), [resumes, loading, createResume, updateResume, deleteResume, fetchResumes, isConnected]);

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumes = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResumes must be used within a ResumeProvider');
  }
  return context;
};