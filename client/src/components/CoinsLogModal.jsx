import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, ArrowDown, ArrowUp, Clock, Info, Loader, Gift } from 'lucide-react';
import { format } from 'date-fns';
import { useDashboard } from "../context/DashbaordContext";
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const CoinsLogModal = ({ isOpen, onClose }) => {
  // Use dashboard context to get coins and coinsLog
  const { coins, coinsLog, loading, fetchCoins } = useDashboard();
  const { setNotifications } = useSocket();
  const [isRequesting, setIsRequesting] = useState(false);

  // Manual notification function
  const addNotification = (message, type = 'success') => {
    const notification = {
      message,
      type,
      timestamp: Date.now()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 9)]);
  };

  const handleCoinRequest = async () => {
    setIsRequesting(true);
    try {
      const response = await api.post('/coin/coin-request');
      console.log(response);
      
      if (response.status === 200) {
        toast.success('Coin request sent successfully! Check your email for confirmation.');
        // Refresh coins data
        if (fetchCoins) {
          fetchCoins();
        }
      }
    } catch (error) {
      console.error('Error requesting coins:', error);
      
      // Handle specific error responses
      if (error.response?.status === 400 && error.response?.data?.message === "Already enough coins") {
        toast.error('You already have enough coins');
      } else {
        toast.error(
          error.response?.data?.message || 'Failed to request coins. Please try again.'
        );
      }
    } finally {
      setIsRequesting(false);
    }
  };

  if (!isOpen) return null;

  // Helper function to format dates
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy • h:mm a");
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  // Helper function to get action icon and color
  const getActionDetails = (action, amount) => {
    const baseClass = amount > 0 ? "text-green-500" : "text-red-500";
    const bgClass = amount > 0 ? "bg-green-100" : "bg-red-100";

    return {
      icon: amount > 0 ? <ArrowUp className={`h-3 w-3 sm:h-4 sm:w-4 ${baseClass}`} />
                       : <ArrowDown className={`h-3 w-3 sm:h-4 sm:w-4 ${baseClass}`} />,
      bgClass
    };
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-xl p-3 sm:p-4 w-full max-w-xs sm:max-w-md mx-2 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Compact Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mr-2">
                <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                  Your Coins
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Coin Balance Card */}
          <div className="mb-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-3 border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-800 font-medium">Current Balance</p>
                {loading ? (
                  <div className="flex items-center h-6">
                    <Loader className="h-4 w-4 text-amber-700 animate-spin" />
                  </div>
                ) : (
                  <p className="text-lg sm:text-xl font-bold text-amber-700 flex items-center">
                    <Coins className="h-4 w-4 mr-1 inline" />
                    {coins} coins
                  </p>
                )}
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full flex items-center justify-center">
                <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-amber-800" />
              </div>
            </div>
          </div>

          {/* Request Free Coins Button */}
          <div className="mb-3">
            <button
              onClick={handleCoinRequest}
              disabled={isRequesting}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2.5 px-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-xs sm:text-sm"
            >
              {isRequesting ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Gift className="h-4 w-4" />
              )}
              <span>
                {isRequesting ? 'Requesting...' : 'Request 20 Free Coins'}
              </span>
            </button>
          </div>

          {/* Information Box */}
          <div className="mb-3">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-2.5">
              <div className="flex items-start">
                <Info className="h-3 w-3 text-blue-600 mt-0.5 mr-1.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">About Coins:</p>
                  <ul className="space-y-0.5 list-disc list-inside text-xs">
                    <li><strong>Resume Upload:</strong> -3 coins</li>
                    <li><strong>AI Email:</strong> -2 coins</li>
                    <li><strong>AI Resume:</strong> -5 coins</li>
                    <li><strong>Weekly bonus:</strong> +20 coins</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="mb-3">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Transaction History
            </h4>

            {loading ? (
              <div className="flex justify-center py-4">
                <Loader className="h-5 w-5 text-blue-500 animate-spin" />
              </div>
            ) : coinsLog && coinsLog.length > 0 ? (
              <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto pr-1">
                {coinsLog.map((log) => {
                  const { icon, bgClass } = getActionDetails(log.action, log.amount);
                  return (
                    <div key={log._id} className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded-full ${bgClass}`}>
                            {icon}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-900">{log.description}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-2.5 w-2.5 mr-1 inline" />
                              {formatDate(log.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className={`text-xs font-semibold ${log.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {log.amount > 0 ? '+' : ''}{log.amount} 🪙
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="mx-auto w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <Coins className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">No transaction history yet</p>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div>
            <button
              onClick={onClose}
              className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CoinsLogModal;