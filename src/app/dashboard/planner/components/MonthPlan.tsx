import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { initializeMonthData, setWeekPlans, updatePlannerData, updateWeekPlan } from '@/redux/features/plannerSlice';
import EmojiModal from '@/ui/reusableComponents/EmojiModal';

interface MonthPlanProps {
  year: number;
  month: number;
}

interface Expense {
  emoji: string;
  value: number;
}

interface WeekPlan {
  id: number;
  startDate: Date;
  endDate: Date;
  budget: number;
  expenses: Record<string, Expense[]>;
}

const MonthPlan: React.FC<MonthPlanProps> = ({ year, month }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { years } = useSelector((state: RootState) => state.planner);
  const { income = 0, weekPlans = [] } = years[year]?.[month] || {};

  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [animateWeek, setAnimateWeek] = useState(false);

  const categories = ['Food', 'Transport', 'Entertainment', 'Others'];

  const getWeeksInMonth = useCallback(() => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const weeks: { start: Date; end: Date }[] = [];

    for (let currentWeekStart = new Date(firstDay); currentWeekStart <= lastDay; currentWeekStart.setDate(currentWeekStart.getDate() + 7)) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weeks.push({ start: new Date(currentWeekStart), end: weekEnd > lastDay ? lastDay : weekEnd });
    }
    return weeks;
  }, [year, month]);

  useEffect(() => {
    const weeks = getWeeksInMonth();
    const weeklyBudget = income / weeks.length;
    const newWeekPlans: WeekPlan[] = weeks.map((week, index) => ({
      id: index,
      startDate: week.start,
      endDate: week.end,
      budget: weeklyBudget,
      expenses: {},
    }));
    dispatch(initializeMonthData({ year, month }));
    dispatch(setWeekPlans({ year, month, weekPlans: newWeekPlans }));
    dispatch(updatePlannerData({ year, month, weekPlans: newWeekPlans }));
  }, [year, month, income, dispatch, getWeeksInMonth]);

  const updateWeek = useCallback((updatedWeek: WeekPlan) => {
    dispatch(updateWeekPlan({ year, month, weekIndex: currentWeekIndex, updatedWeek }));
    dispatch(updatePlannerData({ year, month, weekPlans: weekPlans.map((week, idx) => idx === currentWeekIndex ? updatedWeek : week) }));
  }, [year, month, currentWeekIndex, weekPlans, dispatch]);

  const handleExpenseChange = useCallback((category: string, index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const updatedWeek = {
      ...weekPlans[currentWeekIndex],
      expenses: {
        ...weekPlans[currentWeekIndex].expenses,
        [category]: (weekPlans[currentWeekIndex].expenses[category] || []).map((expense, i) => i === index ? { ...expense, value: numValue } : expense),
      },
    };
    updateWeek(updatedWeek);
  }, [weekPlans, currentWeekIndex, updateWeek]);

  const handleEmojiSelection = useCallback((emoji: string, averageValue: number) => {
    if (selectedCategory) {
      const updatedWeek = {
        ...weekPlans[currentWeekIndex],
        expenses: {
          ...weekPlans[currentWeekIndex].expenses,
          [selectedCategory]: [...(weekPlans[currentWeekIndex].expenses[selectedCategory] || []), { emoji, value: averageValue }],
        },
      };
      updateWeek(updatedWeek);
    }
    setModalVisible(false);
    setSelectedCategory(null);
  }, [selectedCategory, weekPlans, currentWeekIndex, updateWeek]);

  const handleRemoveExpense = useCallback((category: string, index: number) => {
    const updatedWeek = {
      ...weekPlans[currentWeekIndex],
      expenses: {
        ...weekPlans[currentWeekIndex].expenses,
        [category]: weekPlans[currentWeekIndex].expenses[category].filter((_, i) => i !== index),
      },
    };
    updateWeek(updatedWeek);
  }, [weekPlans, currentWeekIndex, updateWeek]);

  const calculateCategoryTotal = useCallback((category: string) => 
    (weekPlans[currentWeekIndex]?.expenses[category] || []).reduce((total, expense) => total + expense.value, 0).toFixed(2),
  [weekPlans, currentWeekIndex]);

  const calculateTotalExpenses = useCallback(() => 
    weekPlans.reduce((total, week) => 
      total + Object.values(week.expenses).reduce((weekTotal, category) => 
        weekTotal + category.reduce((categoryTotal, expense) => categoryTotal + expense.value, 0), 0), 0),
  [weekPlans]);

  const formatDate = (date: Date) => date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  const changeWeek = (direction: 'prev' | 'next') => {
    setAnimateWeek(true);
    setTimeout(() => {
      setCurrentWeekIndex(prev => direction === 'prev' ? Math.max(0, prev - 1) : Math.min(weekPlans.length - 1, prev + 1));
      setAnimateWeek(false);
    }, 300);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 max-w-full sm:max-w-3xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-blue-500">Monthly Plan</h2>
      {weekPlans[currentWeekIndex] && (
        <div className={`transition-opacity duration-300 ${animateWeek ? 'opacity-0' : 'opacity-100'}`}>
          <h3 className="text-xl sm:text-2xl mb-2 sm:mb-4 font-semibold text-blue-500">
            Week {currentWeekIndex + 1}: {formatDate(weekPlans[currentWeekIndex].startDate)} - {formatDate(weekPlans[currentWeekIndex].endDate)}
          </h3>
          <div className='flex justify-between'>
            <p className="mb-4 sm:mb-6 text-base sm:text-lg font-medium text-blue-700">Budget: ₹{weekPlans[currentWeekIndex].budget.toFixed(2)}</p>
            <p className="mb-4 sm:mb-6 text-base sm:text-lg font-medium text-gray-700">Total Expenses: ₹{calculateTotalExpenses().toFixed(2)}</p>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {categories.map((category) => (
              <div key={category} className="bg-gray-100 p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <label className="text-lg sm:text-xl font-semibold text-blue-500 cursor-pointer hover:text-blue-700 transition-colors" onClick={() => { setSelectedCategory(category); setModalVisible(true); }}>
                  {category}:
                </label>
                <div className="flex flex-wrap mt-2">
                  {(weekPlans[currentWeekIndex].expenses[category] || []).map((expense, index) => (
                    <div key={index} className="flex items-center bg-white rounded-full px-2 sm:px-3 py-1 sm:py-2 mr-2 mb-2 shadow-sm hover:shadow-md transition-shadow">
                      <span className="mr-1 sm:mr-2 text-lg sm:text-xl">{expense.emoji}</span>
                      <input
                        type="number"
                        value={expense.value}
                        onChange={(e) => handleExpenseChange(category, index, e.target.value)}
                        className="w-16 sm:w-20 p-1 bg-transparent border-none focus:outline-none text-gray-700 text-sm sm:text-base"
                      />
                      <button onClick={() => handleRemoveExpense(category, index)} className="ml-1 sm:ml-2 text-red-500 hover:text-red-700 transition-colors">×</button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-right text-base sm:text-lg font-medium text-blue-500">Total: ₹{calculateCategoryTotal(category)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-between mt-6 sm:mt-8">
        <button
          onClick={() => changeWeek('prev')}
          disabled={currentWeekIndex === 0}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white text-sm sm:text-base rounded-full font-semibold shadow-md hover:bg-blue-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <button
          onClick={() => changeWeek('next')}
          disabled={currentWeekIndex === weekPlans.length - 1}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white text-sm sm:text-base rounded-full font-semibold shadow-md hover:bg-blue-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
      {modalVisible && (
        <EmojiModal
          category={selectedCategory}
          onSelect={handleEmojiSelection}
          onClose={() => setModalVisible(false)}
        />
      )}
    </div>
  );
};

export default MonthPlan;