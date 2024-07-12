import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getMotivationalMessage } from '@/lib/utils';

const PlannerHeader: React.FC = () => {
  const { currentYear, currentMonth, years } = useSelector((state: RootState) => state.planner);
  const currentMonthData = years[currentYear]?.[currentMonth] || { income: 0, savings: 0 };
  const { income, savings } = currentMonthData;
  const motivationalMessage = getMotivationalMessage(savings);

  function formatToINR(amount: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 1,
    }).format(amount);
  }

  return (
    <div className='w-full bg-blue-600 text-white rounded-lg shadow-lg p-6 mb-8 animate-fade-in'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className="md:col-span-2 space-y-2 animate-slide-up">
          <h3 className="text-lg font-semibold">Monthly Income</h3>
          <div className='bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-3 hover:bg-opacity-30 transition-all duration-300'>
            <p className="text-2xl md:text-3xl font-mono">{formatToINR(income)}</p>
          </div>
        </div>
        <div className="md:col-span-2 space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-semibold">Monthly Savings</h3>
          <div className='bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-3 hover:bg-opacity-30 transition-all duration-300'>
            <p className="text-2xl md:text-3xl font-mono">{formatToINR(savings)}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className='bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-3 hover:bg-opacity-30 transition-all duration-300'>
          <p className="text-sm md:text-base italic text-right">{motivationalMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default PlannerHeader;