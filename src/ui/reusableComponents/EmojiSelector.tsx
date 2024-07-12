import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store'; 

interface EmojiSelectorProps {
  category: string;
  onSelect: (emoji: string, name: string) => void;
}

export default function EmojiSelector({ category, onSelect }: EmojiSelectorProps) {
  const emojis: any = useSelector((state: RootState) => state.emojiCategory[category]);
  const [selectedEmoji, setSelectedEmoji] = useState<{ emoji: string; name: string } | null>(null);
  const [tooltipEmoji, setTooltipEmoji] = useState<string | null>(null);

  const handleEmojiClick = (emoji: string, name: string) => {
    setSelectedEmoji({ emoji, name });
    onSelect(emoji, name);
  };

  const handleMouseEnter = (emoji: string) => {
    setTooltipEmoji(emoji);
  };

  const handleMouseLeave = () => {
    setTooltipEmoji(null);
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold">Select Emoji</label>
      <div className="grid grid-cols-5 gap-2">
        {emojis.map(({ emoji, name }: any) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleEmojiClick(emoji, name)}
            onMouseEnter={() => handleMouseEnter(emoji)}
            onMouseLeave={handleMouseLeave}
            className={`text-2xl p-2 rounded-full transition-colors relative ${
              selectedEmoji?.emoji === emoji ? 'bg-indigo-100' : 'hover:bg-gray-100'
            }`}
          >
            {emoji}
            {(tooltipEmoji === emoji || selectedEmoji?.emoji === emoji) && (
              <span className="tooltip-text bg-blue-600 text-white text-xs py-1 px-2 rounded-md absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-2">
                {name}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
