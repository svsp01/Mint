// src/app/redux/features/expensesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Expense {
  id: string;
  category: string;
  subCategory: string;
  description: string;
  amount: number;
  date: string;
}

interface ExpensesState {
  expenses: Record<string, Expense[]>;
}

const initialState: ExpensesState = {
  expenses: {},
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense(state, action: PayloadAction<Expense>) {
      const dateKey = action.payload.date.split('T')[0];
      if (!state.expenses[dateKey]) {
        state.expenses[dateKey] = [];
      }
      state.expenses[dateKey].push(action.payload);
    },
  },
});

export const { addExpense } = expensesSlice.actions;
export default expensesSlice.reducer;
