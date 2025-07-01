import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import api from "../utils/api";
import { useSocket } from "./SocketContext";

const DashbaordContext = createContext();

export const DashbaordProvider = ({ children }) => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [comparison, setComparison] = useState(null);
    const [preferences, setPreferences] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const { socket, isConnected } = useSocket();

    // Single comprehensive fetch function using the unified endpoint
    const fetchDashboardData = useCallback(async (limit = 10) => {
        // Don't fetch if auth is still loading or user is not authenticated
        if (authLoading || !isAuthenticated || !user) {
            console.log('Skipping fetch - auth loading:', authLoading, 'authenticated:', isAuthenticated, 'user:', !!user);
            return;
        }
        
        console.log('Starting dashboard data fetch for user:', user.email || user.id);
        setLoading(true);
        setError(null);
        
        try {
            // Single API call to get all dashboard data
            const response = await api.get(`/user/all-stats?limit=${limit}`);

            console.log('API Response:', response.data);

            if (response.data.success) {
                const data = response.data.data;
                
                // Extract different sections from the unified response
                setStats({
                    user: data.user,
                    resumes: data.resumes,
                    emails: data.emails,
                    linkedIn: data.linkedIn,
                    global: data.global
                });
                
                setActivity(data.activityTimeline || []);
                setComparison(data.comparison || null);
                setPreferences(data.preferences || null);
                setLastUpdated(new Date().toISOString());
                
                console.log('Dashboard data fetch completed successfully');
            } else {
                console.warn('Stats fetch failed:', response.data.message || response.data.error);
                setError(response.data.message || 'Failed to fetch dashboard data');
            }

        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    }, [authLoading, isAuthenticated, user]);

    // Socket event listeners for live updates
    useEffect(() => {
        if (!socket || !isConnected) return;

        console.log('Setting up dashboard socket listeners...');

        const handleStatsUpdate = (data) => {
            console.log('Received live stats update:', data);
            if (data.type === 'stats_dashboard' && data.data) {
                const statsData = data.data;
                
                // Update all sections from the unified stats data
                if (statsData.user || statsData.resumes || statsData.emails || statsData.linkedIn || statsData.global) {
                    setStats({
                        user: statsData.user,
                        resumes: statsData.resumes,
                        emails: statsData.emails,
                        linkedIn: statsData.linkedIn,
                        global: statsData.global
                    });
                }
                
                if (statsData.activityTimeline) {
                    setActivity(statsData.activityTimeline);
                }
                
                if (statsData.comparison) {
                    setComparison(statsData.comparison);
                }
                
                if (statsData.preferences) {
                    setPreferences(statsData.preferences);
                }
                
                setLastUpdated(data.timestamp || new Date().toISOString());
            }
        };

        // Keep individual listeners for compatibility with existing socket events
        const handleActivityUpdate = (data) => {
            console.log('Received live activity update:', data);
            if (data.type === 'activity_dashboard' && data.data) {
                setActivity(data.data);
            }
        };

        const handleComparisonUpdate = (data) => {
            console.log('Received live comparison update:', data);
            if (data.type === 'comparison_dashboard' && data.data) {
                setComparison(data.data);
            }
        };

        const handlePreferencesUpdate = (data) => {
            console.log('Received live preferences update:', data);
            if (data.type === 'preferences_dashboard' && data.data) {
                setPreferences(data.data);
            }
        };

        socket.on('stats_dashboard', handleStatsUpdate);
        socket.on('activity_dashboard', handleActivityUpdate);
        socket.on('comparison_dashboard', handleComparisonUpdate);
        socket.on('preferences_dashboard', handlePreferencesUpdate);

        socket.on('dashboard_update', (data) => {
            console.log('Received dashboard update:', data);
            switch (data.type) {
                case 'stats':
                    setStats(data.data);
                    break;
                case 'activity':
                    setActivity(data.data);
                    break;
                case 'comparison':
                    setComparison(data.data);
                    break;
                case 'preferences':
                    setPreferences(data.data);
                    break;
                default:
                    console.log('Unknown dashboard update type:', data.type);
            }
            setLastUpdated(data.timestamp || new Date().toISOString());
        });

        return () => {
            console.log('Cleaning up dashboard socket listeners...');
            socket.off('stats_dashboard', handleStatsUpdate);
            socket.off('activity_dashboard', handleActivityUpdate);
            socket.off('comparison_dashboard', handleComparisonUpdate);
            socket.off('preferences_dashboard', handlePreferencesUpdate);
            socket.off('dashboard_update');
        };
    }, [socket, isConnected]);

    // Main effect to fetch data when authentication is ready
    useEffect(() => {
        console.log('Auth state changed:', {
            authLoading,
            isAuthenticated,
            hasUser: !!user,
            userEmail: user?.email
        });

        if (!authLoading && isAuthenticated && user) {
            console.log('Auth ready, fetching dashboard data...');
            fetchDashboardData();
        }
    }, [authLoading, isAuthenticated, user, fetchDashboardData]);

    // Individual refresh functions now all use the unified endpoint
    const refreshStats = useCallback(async () => {
        await fetchDashboardData();
    }, [fetchDashboardData]);

    const refreshActivity = useCallback(async () => {
        await fetchDashboardData();
    }, [fetchDashboardData]);

    const refreshComparison = useCallback(async () => {
        await fetchDashboardData();
    }, [fetchDashboardData]);

    const refreshPreferences = useCallback(async () => {
        await fetchDashboardData();
    }, [fetchDashboardData]);

    // New function to refresh with custom limit
    const refreshDashboardData = useCallback(async (limit = 10) => {
        await fetchDashboardData(limit);
    }, [fetchDashboardData]);

    const value = {
        // Data
        stats,
        activity,
        comparison,
        preferences,
        lastUpdated,
        
        // Loading states
        loading: loading || authLoading, // Include auth loading
        error,
        
        // Socket status
        isLive: isConnected,
        
        // Actions - all now use the unified endpoint
        fetchDashboardData,
        refreshStats,
        refreshActivity,
        refreshComparison,
        refreshPreferences,
        refreshDashboardData, // New function with custom limit
        
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