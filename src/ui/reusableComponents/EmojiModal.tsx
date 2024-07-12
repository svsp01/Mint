import React, { useState } from 'react';

interface EmojiModalProps {
  category: string | null;
  onSelect: (emoji: string, averageValue: number) => void;
  onClose: () => void;
}

const emojis: any = {
  Food: [
    { emoji: '🍏', label: 'Groceries', averageValue: 1000 },
    { emoji: '🍔', label: 'Hotel Food', averageValue: 2000 },
    { emoji: '🍿', label: 'Snacks', averageValue: 500 },
    { emoji: '🍕', label: 'Pizza', averageValue: 800 },
    { emoji: '🍜', label: 'Noodles', averageValue: 600 },
    { emoji: '☕', label: 'Coffee', averageValue: 200 },
    { emoji: '🍱', label: 'Bento', averageValue: 1200 },
    { emoji: '🥗', label: 'Salad', averageValue: 700 },
    { emoji: '🍳', label: 'Breakfast', averageValue: 400 },
  ],
  Transport: [
    { emoji: '🚌', label: 'Bus', averageValue: 300 },
    { emoji: '⛽', label: 'Petrol', averageValue: 2000 },
    { emoji: '🚕', label: 'Taxi', averageValue: 500 },
    { emoji: '🚉', label: 'Train', averageValue: 400 },
    { emoji: '🚲', label: 'Bicycle', averageValue: 100 },
    { emoji: '🛵', label: 'Scooter', averageValue: 300 },
    { emoji: '✈️', label: 'Plane', averageValue: 5000 },
  ],
  Entertainment: [
    { emoji: '🎬', label: 'Movies', averageValue: 500 },
    { emoji: '🎮', label: 'Games', averageValue: 1000 },
    { emoji: '🎵', label: 'Music', averageValue: 300 },
    { emoji: '🎨', label: 'Art', averageValue: 800 },
    { emoji: '🍻', label: 'Bar', averageValue: 1500 },
    { emoji: '🎭', label: 'Theatre', averageValue: 1200 },
    { emoji: '📚', label: 'Books', averageValue: 600 },
  ],
  Others: [
    { emoji: '🛍️', label: 'Shopping', averageValue: 1500 },
    { emoji: '💼', label: 'Business', averageValue: 2000 },
    { emoji: '💊', label: 'Healthcare', averageValue: 1000 },
    { emoji: '🏋️', label: 'Gym', averageValue: 800 },
    { emoji: '🎁', label: 'Gifts', averageValue: 1200 },
    { emoji: '📱', label: 'Phone Bill', averageValue: 500 },
    { emoji: '🏠', label: 'Rent', averageValue: 5000 },
    { emoji: '🧾', label: 'Utilities', averageValue: 1500 },
  ],
};

const EmojiModal: React.FC<EmojiModalProps> = ({ category, onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!category) return null;

  const filteredEmojis = emojis[category].filter((item: any) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6">
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl sm:text-3xl mb-3 sm:mb-4 font-bold text-indigo-700">Select {category} Type</h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-3 sm:mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
      />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4">
        {filteredEmojis.map((item: any) => (
          <button
            key={item.label}
            onClick={() => onSelect(item.emoji, item.averageValue)}
            className="flex flex-col items-center space-y-1 sm:space-y-2 p-2 sm:p-3 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <span className="text-2xl sm:text-4xl">{item.emoji}</span>
            <span className="text-xs sm:text-sm text-center">{item.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={onClose}
        className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white rounded-full font-semibold shadow-md hover:bg-red-600 transition-colors w-full text-sm sm:text-base"
      >
        Close
      </button>
    </div>
  </div>
  );
};

export default EmojiModal;