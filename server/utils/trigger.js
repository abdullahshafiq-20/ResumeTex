export const triggerStatsUpdate = async (userId) => {
    try {
        // Import here to avoid circular dependencies
        const { getAllUserStats } = await import('../controllers/statsController.js');
        
        const mockReq = {
            user: { id: userId },
            query: { limit: 10 }
        };
        
        const mockRes = {
            status: () => mockRes,
            json: () => mockRes
        };
        
        await getAllUserStats(mockReq, mockRes);
        console.log('Stats dashboard updated for user:', userId);
    } catch (error) {
        console.error('Error triggering stats update:', error);
    }
};