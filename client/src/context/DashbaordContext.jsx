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

    // Single comprehensive fetch function
    const fetchDashboardData = useCallback(async () => {
        // Don't fetch if auth is still loading or user is not authenticated
        if (authLoading || !isAuthenticated || !user) {
            console.log('Skipping fetch - auth loading:', authLoading, 'authenticated:', isAuthenticated, 'user:', !!user);
            return;
        }
        
        console.log('Starting dashboard data fetch for user:', user.email || user.id);
        setLoading(true);
        setError(null);
        
        try {
            // Make all API calls in parallel
            const [statsRes, activityRes, comparisonRes, preferencesRes] = await Promise.all([
                api.get('/user/stats').catch(err => {
                    console.error('Stats API error:', err);
                    return { data: { success: false, error: err.message } };
                }),
                api.get('/user/activity').catch(err => {
                    console.error('Activity API error:', err);
                    return { data: { success: false, error: err.message } };
                }),
                api.get('/user/comparison').catch(err => {
                    console.error('Comparison API error:', err);
                    return { data: { success: false, error: err.message } };
                }),
                api.get('/user/preferences').catch(err => {
                    console.error('Preferences API error:', err);
                    return { data: { success: false, error: err.message } };
                })
            ]);

            console.log('API Responses:', {
                stats: statsRes.data,
                activity: activityRes.data,
                comparison: comparisonRes.data,
                preferences: preferencesRes.data
            });

            // Process responses
            if (statsRes.data.success) {
                console.log('Setting stats data:', statsRes.data.data);
                setStats(statsRes.data.data);
                setLastUpdated(new Date().toISOString());
            } else {
                console.warn('Stats fetch failed:', statsRes.data.message || statsRes.data.error);
            }

            if (activityRes.data.success) {
                setActivity(activityRes.data.data);
            }

            if (comparisonRes.data.success) {
                setComparison(comparisonRes.data.data);
            }

            if (preferencesRes.data.success) {
                setPreferences(preferencesRes.data.data);
            }

            console.log('Dashboard data fetch completed successfully');
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
                setStats(data.data);
                setLastUpdated(data.timestamp);
            }
        };

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

    // Individual refresh functions for manual refresh
    const refreshStats = useCallback(async () => {
        if (!isAuthenticated || !user) return;
        try {
            const response = await api.get('/user/stats');
            if (response.data.success) {
                setStats(response.data.data);
                setLastUpdated(new Date().toISOString());
            }
        } catch (err) {
            setError(err.message || 'Failed to refresh stats');
        }
    }, [isAuthenticated, user]);

    const refreshActivity = useCallback(async () => {
        if (!isAuthenticated || !user) return;
        try {
            const response = await api.get('/user/activity');
            if (response.data.success) {
                setActivity(response.data.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to refresh activity');
        }
    }, [isAuthenticated, user]);

    const refreshComparison = useCallback(async () => {
        if (!isAuthenticated || !user) return;
        try {
            const response = await api.get('/user/comparison');
            if (response.data.success) {
                setComparison(response.data.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to refresh comparison');
        }
    }, [isAuthenticated, user]);

    const refreshPreferences = useCallback(async () => {
        if (!isAuthenticated || !user) return;
        try {
            const response = await api.get('/user/preferences');
            if (response.data.success) {
                setPreferences(response.data.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to refresh preferences');
        }
    }, [isAuthenticated, user]);

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