import { emitStatsDashboard, emitPreferencesDashboard } from '../config/socketConfig.js';

export const triggerDashboardUpdate = async (userId) => {
    try {
        // Dynamic imports to avoid circular dependencies
        const { getUserStats, getUserActivityTimeline, getComparisonStats } = 
            await import('../controllers/statsController.js');
        const { getUserPreferences } = 
            await import('../controllers/Prefrences/prefrencesController.js');
        
        // Helper to create mock response that captures data
        const createMockRes = () => {
            let data = null;
            return {
                status: () => ({ json: (result) => { data = result; } }),
                json: (result) => { data = result; },
                getData: () => data
            };
        };

        const mockReq = { user: { id: userId }, query: {} };

        // Get fresh stats
        const statsRes = createMockRes();
        await getUserStats(mockReq, statsRes);
        const statsData = statsRes.getData();

        // Get fresh preferences  
        const prefsRes = createMockRes();
        await getUserPreferences(mockReq, prefsRes);
        const prefsData = prefsRes.getData();

        // Emit updates
        if (statsData?.success) {
            emitStatsDashboard(userId, statsData.data);
            console.log('Dashboard stats updated for user:', userId);
        }
        
        if (prefsData?.success) {
            emitPreferencesDashboard(userId, prefsData.data);
            console.log('Dashboard preferences updated for user:', userId);
        }
        
    } catch (error) {
        console.error('Error triggering dashboard update:', error);
    }
}; 