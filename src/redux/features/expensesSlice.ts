import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/DBConnect/axiosInstance';

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

export const addExpense:any = createAsyncThunk(
  'expenses/addExpense',
  async (expenseData: ExpensesState) => {
    const response = await axiosInstance.post('/api/expense', expenseData);
    return response.data; 
  }
);

export const getExpense:any = createAsyncThunk(
  'expenses/getExpense',
  async () => {
    const response = await axiosInstance.get('/api/expense');
    return response.data;
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addExpense.pending, (state) => {
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        const { date } = action.payload; // Assuming action.payload is an Expense object
        const dateKey = date.split('T')[0];
        if (!state.expenses[dateKey]) {
          state.expenses[dateKey] = [];
        }
        state.expenses[dateKey].push(action.payload);
      })
      .addCase(addExpense.rejected, (state, action) => {
        // Handle rejected state if needed
      })
      .addCase(getExpense.pending, (state) => {
        // Handle pending state if needed
      })
      .addCase(getExpense.fulfilled, (state, action) => {
        if (action.payload && action.payload.expenses.length > 0) {
          action.payload.expenses.forEach((expense: Expense) => {
            const { date } = expense;
            const dateKey = date.split('T')[0];
            if (!state.expenses[dateKey]) {
              state.expenses[dateKey] = [];
            }
            state.expenses[dateKey].push(expense);
          });
        }  
      })
      .addCase(getExpense.rejected, (state, action) => {
        // Handle rejected state if needed
      });
  },
});

export default expensesSlice.reducer;
