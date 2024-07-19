import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import axiosInstance from '@/DBConnect/axiosInstance';

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

interface MonthData {
  income: number;
  savings: number;
  weekPlans: WeekPlan[];
}

interface PlannerState {
  years: Record<number, Record<number, MonthData>>;
  currentYear: number;
  currentMonth: number;
  income: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PlannerState = {
  years: {},
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,
  income: 0,
  status: 'idle',
  error: null,
};

export const fetchPlannerData = createAsyncThunk('planner/fetchPlannerData', async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get('/api/planner', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.data;
});
export const updatePlannerData = createAsyncThunk(
  'planner/updatePlannerData',
  async (data: { year: number; month: number; income?: number; savings?: number; weekPlans?: WeekPlan[] }) => {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.post('/api/planner', data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  }
);


export const fetchUserIncome = createAsyncThunk(
  'planner/fetchUserIncome',
  async (_, { getState }) => {
    const state:any = getState() as RootState;
    const userId = state.auth.userId;
    const response = await axiosInstance.get(`/api/user/${userId}/income`);
    return response.data.income;
  }
);

export const updateSavings = createAsyncThunk(
  'planner/updateSavings',
  async (data: { year: number; month: number; savings: number }, { getState, dispatch }) => {
    const state:any = getState() as RootState;
    const userId = state.auth.userId;
    await axiosInstance.post(`/api/user/${userId}/savings`, data);
    dispatch(setSavings(data));
  }
);

const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    setCurrentDate: (state, action: PayloadAction<{ year: number; month: number }>) => {
      state.currentYear = action.payload.year;
      state.currentMonth = action.payload.month;
    },
    initializeMonthData: (state, action: PayloadAction<{ year: number; month: number }>) => {
      const { year, month } = action.payload;
      state.years[year] = state.years[year] || {};
      state.years[year][month] = state.years[year][month] || { income: 0, savings: 0, weekPlans: [] };
    },
    setIncome: (state, action: PayloadAction<{ year: number; month: number; income: number }>) => {
      const { year, month, income } = action.payload;
      if (state.years[year]?.[month]) {
        state.years[year][month].income = income;
      }
    },
    setSavings: (state, action: PayloadAction<{ year: number; month: number; savings: number }>) => {
      const { year, month, savings } = action.payload;
      if (state.years[year]?.[month]) {
        state.years[year][month].savings = savings;
      }
    },
    setWeekPlans: (state, action: PayloadAction<{ year: number; month: number; weekPlans: WeekPlan[] }>) => {
      const { year, month, weekPlans } = action.payload;
      if (state.years[year]?.[month]) {
        state.years[year][month].weekPlans = weekPlans;
      }
    },
    updateWeekPlan: (state, action: PayloadAction<{ year: number; month: number; weekIndex: number; updatedWeek: WeekPlan }>) => {
      const { year, month, weekIndex, updatedWeek } = action.payload;
      if (state.years[year]?.[month]?.weekPlans[weekIndex]) {
        state.years[year][month].weekPlans[weekIndex] = updatedWeek;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlannerData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlannerData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.years = action.payload;
      })
      .addCase(fetchPlannerData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch planner data';
      })
      .addCase(updatePlannerData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePlannerData.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updatePlannerData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update planner data';
      })
      .addCase(fetchUserIncome.fulfilled, (state, action) => {
        state.income = action.payload;
      })
      .addCase(updateSavings.fulfilled, (state) => {
        state.status = 'succeeded';
      });
  },
});

export const { 
  setCurrentDate, 
  initializeMonthData, 
  setIncome, 
  setSavings, 
  setWeekPlans, 
  updateWeekPlan 
} = plannerSlice.actions;

export default plannerSlice.reducer;