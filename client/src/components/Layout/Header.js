// client/src/components/Layout/Header.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react';

export const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 ml-2">Support Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {user?.name}
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};