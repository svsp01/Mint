// src/app/pages/transaction.tsx
'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { RootState } from '@/redux/store';
import { addExpense, getExpense } from '@/redux/features/expensesSlice';
import { getMonthDays, getFormatedDate } from '@/lib/utils';
import MonthYearPicker from './components/MonthYearPicker';
import Calendar from './components/Calender';
import ExpenseModal from './components/ExpenseModal';
import CalendarHeader from './components/CalenderHeader';
import axiosInstance from '@/DBConnect/axiosInstance';
import { Expense } from '@/models/ExpenseModel';

export default function TransactionsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const dispatch = useDispatch();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    
  };

 

  const handleCloseModal = () => {
    setSelectedDate(null);
  };

  const handleAddExpense = (expense: any) => {
    const dateKey = getFormatedDate(selectedDate)  ?? '';
    
    dispatch(addExpense({ ...expense, date: dateKey }));
    handleCloseModal();
  };

  const monthDays = getMonthDays(currentDate.getFullYear(), currentDate.getMonth());

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 bg-gray-50 rounded-lg min-h-screen">
      <CalendarHeader currentDate={currentDate} expenses={expenses} />
      <div className="mb-4 z-10">
        <MonthYearPicker currentDate={currentDate} onDateChange={setCurrentDate} />
      </div>
      <Calendar days={monthDays} onDateClick={handleDateClick} expenses={expenses} />
      {selectedDate && (
        <ExpenseModal date={selectedDate} onClose={handleCloseModal} onAddExpense={handleAddExpense} />
      )}
    </div>
  );
}
