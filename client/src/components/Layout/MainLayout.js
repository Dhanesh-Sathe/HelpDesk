// client/src/components/Layout/MainLayout.js
import React from 'react';
// import { Sidebar } from './Sidebar';

export const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <Sidebar /> */}
      <main className="flex-1 ml-16 md:ml-64 p-4">
        {children}
      </main>
    </div>
  );
};