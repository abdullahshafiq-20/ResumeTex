import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import api from "../utils/api";

const DashbaordContext = createContext();

export const DashbaordProvider = ({ children }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [comparison, setComparison] = useState(null);
    const [preferences, setPreferences] = useState(null);

    // Fetch user statistics
    const fetchStats = async () => {
        try {
            const response = await api.get('/user/stats');
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
            throw err;
        }
    };

    // Fetch user activity
    const fetchActivity = async () => {
        try {
            const response = await api.get('/user/activity');
            if (response.data.success) {
                setActivity(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching activity:', err);
            throw err;
        }
    };

    // Fetch comparison data
    const fetchComparison = async () => {
        try {
            const response = await api.get('/user/comparison');
            if (response.data.success) {
                setComparison(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching comparison:', err);
            throw err;
        }
    };

    // Fetch user preferences
    const fetchPreferences = async () => {
        try {
            const response = await api.get('/user/preferences');
            if (response.data.success) {
                setPreferences(response.data.data);
            }
            else {
                console.warn('Failed to fetch preferences:', response.data.message);
            }
        } catch (err) {
            console.error('Error fetching preferences:', err.message);
            throw err;
        }
    };

    // Fetch all dashboard data
    const fetchDashboardData = async () => {
        if (!user) return;
        
        setLoading(true);
        setError(null);
        
        try {
            await Promise.all([
                fetchStats(),
                fetchActivity(), 
                fetchComparison(),
                fetchPreferences()
            ]);
        } catch (err) {
            setError(err.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Refresh individual data sections
    const refreshStats = async () => {
        try {
            await fetchStats();
        } catch (err) {
            setError(err.message || 'Failed to refresh stats');
        }
    };

    const refreshActivity = async () => {
        try {
            await fetchActivity();
        } catch (err) {
            setError(err.message || 'Failed to refresh activity');
        }
    };

    const refreshComparison = async () => {
        try {
            await fetchComparison();
        } catch (err) {
            setError(err.message || 'Failed to refresh comparison');
        }
    };

    const refreshPreferences = async () => {
        try {
            await fetchPreferences();
        } catch (err) {
            setError(err.message || 'Failed to refresh preferences');
        }
    };

    // Fetch data when user is available
    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const value = {
        // Data
        stats,
        activity,
        comparison,
        preferences,
        
        // Loading states
        loading,
        error,
        
        // Actions
        fetchDashboardData,
        refreshStats,
        refreshActivity,
        refreshComparison,
        refreshPreferences,
        
        // Clear error
        clearError: () => setError(null)
    };

    return (
        <DashbaordContext.Provider value={value}>
            {children}
        </DashbaordContext.Provider>
    );
}

export const useDashboard = () => {
    const context = useContext(DashbaordContext);
    if (!context) {
        throw new Error("useDashboard must be used within a DashbaordProvider");
    }
    return context;
}