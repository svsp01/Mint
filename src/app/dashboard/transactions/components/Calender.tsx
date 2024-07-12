import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {  getFormatedDate } from '@/lib/utils';

interface CalendarProps {
  days: Date[];
  onDateClick: (date: Date) => void;
  expenses: Record<string, Array<{ category: string; amount: number }>>;
}

export default function Calendar({
  days,
  onDateClick,
  expenses,
}: CalendarProps) {
  const weekdays = useMemo(
    () => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    []
  );
  const emojiMap: any = useSelector((state: RootState) => state.emojiMap);

  const getCategoryEmoji = (category: string) => {
    return emojiMap[category.toLowerCase()] || emojiMap.default;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const firstDayOfMonth = new Date(
    Date.UTC(days[0].getFullYear(), days[0].getMonth(), 1)
  );
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const emptyCells = Array(startingDayOfWeek).fill(null);
  return (
    <div className="grid grid-cols-7  gap-1 sm:gap-2">
      {weekdays.map((day) => (
        <div
          key={day}
          className="text-center font-bold p-1 sm:p-2 text-xs sm:text-sm"
        >
          {day}
        </div>
      ))}
      {emptyCells.map((_, index) => (
        <div
          key={`empty-${index}`}
          className="border p-1 sm:p-2 min-h-[60px] sm:min-h-[80px]"
        ></div>
      ))}
      {days.map((day) => {
        const dateKey = getFormatedDate(day)
        const dayExpenses = expenses[dateKey] || [];
        const categories = dayExpenses.reduce((acc, expense) => {
          if (!acc[expense.category]) {
            acc[expense.category] = 0;
          }
          acc[expense.category] += expense.amount;
          return acc;
        }, {} as Record<string, number>);

        return (
          <div
            key={dateKey}
            className="border  animate-slide-up p-1 sm:p-2 min-h-[60px] sm:min-h-[80px] cursor-pointer hover:bg-gray-100 transition-colors duration-200 overflow-hidden"
            onClick={() => onDateClick(day)}
          >
            <div className="font-semibold text-xs sm:text-sm mb-1">
              {day.getDate()}
            </div>
            <div className="text-xs space-y-1">
              {Object.entries(categories).map(([category, amount]) => (
                <div
                  key={category}
                  className="flex items-center justify-between"
                >
                  <span>{getCategoryEmoji(category)}</span>
                  <span>{formatAmount(amount)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

     
    </div>
  );
}
