'use client'
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import DashboardHeader from './components/DashboardHeader';
import DashboardModal from './components/DashboardModal';

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<'profile' | 'settings' | null>(null);

  const handleOpenModal = (content: 'profile' | 'settings') => {
    setModalContent(content);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100">
        <DashboardHeader onOpenModal={handleOpenModal} />
        <main className="container mx-auto mt-8 p-4">
          <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h2>
        </main>
        <DashboardModal isOpen={modalOpen} onClose={handleCloseModal} content={modalContent} />
      </div>
    </Provider>
  );
}