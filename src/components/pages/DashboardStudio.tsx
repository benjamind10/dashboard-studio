'use client';
import { useState } from 'react';
import SampleDashboardPage from './DashboardPage';
import Dashboard from './Dashboard';
import { LoggingControl } from '../ui/LoggingControl';

type PageType = 'sample' | 'dashboard';

export default function DashboardStudio() {
  const [currentPage, setCurrentPage] = useState<PageType>('sample');

  const renderPage = () => {
    switch (currentPage) {
      case 'sample':
        return <SampleDashboardPage />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <SampleDashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">
                Dashboard Studio
              </h1>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage('sample')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 'sample'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Sample Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">MQTT Connected</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative">
        {renderPage()}
        <LoggingControl />
      </div>
    </div>
  );
}
