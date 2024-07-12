import React, { useState, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface DateSelectorProps {
  onSelect: (year: number, month: number) => void;
  initialYear?: number;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  onSelect,
  initialYear,
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | null>(initialYear || currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    setIsOpen(false);
    setSelectedMonth(null);
  };

  const handleMonthClick = (month: number) => {
    setSelectedMonth(month);
    setIsOpen(false);
    if (selectedYear) {
      onSelect(selectedYear, month);
    }
  };

  return (
    <div className="max-w-sm relative animate-slide-up">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex justify-between items-center p-4 bg-gray-100 text-black rounded-lg cursor-pointer"
      >
        <span>{selectedMonth ? `${months[selectedMonth - 1]} ${selectedYear}` : (selectedYear || "Select Year")}</span>
        <ChevronDownIcon className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-3 gap-2 p-4">
            {(selectedYear && !selectedMonth ? months : years).map((item, index) => (
              <div
                key={item}
                onClick={() => selectedYear && !selectedMonth ? handleMonthClick(index + 1) : handleYearClick(item as number)}
                className="p-2 bg-blue-100 rounded-lg text-center cursor-pointer hover:bg-blue-200 transition-all duration-300 transform hover:scale-105"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;