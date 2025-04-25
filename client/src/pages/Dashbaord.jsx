import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-4 flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none lg:hidden"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6H20M4 12H20M4 18H11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-700 ml-2">Dashboard</h1>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Welcome to your Resume Dashboard</h2>
            
            {/* Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white shadow rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">My Resumes</h3>
                <p className="text-gray-600">Manage all your created resumes</p>
              </div>
              
              <div className="bg-white shadow rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Templates</h3>
                <p className="text-gray-600">Browse available resume templates</p>
              </div>
              
              <div className="bg-white shadow rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Profile</h3>
                <p className="text-gray-600">Update your personal information</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;