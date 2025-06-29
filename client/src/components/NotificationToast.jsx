import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const NotificationToast = () => {
  const { notifications, clearNotifications } = useSocket();

  const getIcon = (type) => {
    switch (type) {
      case 'resume_created':
      case 'resume_updated':
      case 'email_sent':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'email_created':
      case 'post_created':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.slice(0, 3).map((notification, index) => (
          <motion.div
            key={notification.timestamp}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="bg-white rounded-lg shadow-lg border border-gray-200 p-4"
          >
            <div className="flex items-start space-x-3">
              {getIcon(notification.type)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.message || 'Notification'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => {
                  // Remove this specific notification
                  clearNotifications();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast; 