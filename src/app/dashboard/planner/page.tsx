'use client';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import YearMonthSelector from '@/ui/reusableComponents/YearMonthSelector';
import PlannerHeader from './components/PlannerHeader';
import MonthPlan from './components/MonthPlan';
import { AppDispatch, RootState } from '@/redux/store';
import { setCurrentDate, initializeMonthData, fetchPlannerData } from '@/redux/features/plannerSlice';

const Page: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentYear, currentMonth, years } = useSelector((state: RootState) => state.planner);

  const handleSelect = (year: number, month: number) => {
    dispatch(setCurrentDate({ year, month }));
    dispatch(initializeMonthData({ year, month }));
  };

  useEffect(() => {
    dispatch(fetchPlannerData());
  }, [dispatch]);
  useEffect(() => {
    dispatch(initializeMonthData({ year: currentYear, month: currentMonth }));
  }, [dispatch, currentYear, currentMonth]);

  const currentMonthData = years[currentYear]?.[currentMonth] || { income: 0, savings: 0, weekPlans: [] };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <PlannerHeader />
      
      <div className='w-full mb-8' style={{ animationDelay: '0.3s' }}>
        <YearMonthSelector onSelect={handleSelect} />
      </div>

      <div className="" style={{ animationDelay: '0.6s' }}>
        <MonthPlan
          
        />
      </div>
    </div>
  );
};

export default Page;
