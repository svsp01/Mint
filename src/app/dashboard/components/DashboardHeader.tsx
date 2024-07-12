import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

interface DashboardHeaderProps {
  onOpenModal: (content: 'profile' | 'settings') => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenModal }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { username } = useSelector((state: RootState) => state.user);

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <button className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
        </button>
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
            <img src="/avatar.jpg" alt="User Avatar" className="w-8 h-8 rounded-full" />
            <span>{username}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-fadeIn">
              <button onClick={() => { onOpenModal('profile'); setDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white w-full text-left">View Profile</button>
              <button onClick={() => { onOpenModal('settings'); setDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white w-full text-left">Settings</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

