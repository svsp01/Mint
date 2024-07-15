import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface MonthData {
  income: number;
  savings: number;
  weekPlans: WeekPlan[];
}

interface YearData {
  [month: number]: MonthData;
}

interface PlannerState {
  years: {
    [year: number]: YearData;
  };
  currentYear: number;
  currentMonth: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface WeekPlan {
  id: number;
  startDate: Date;
  endDate: Date;
  budget: number;
  expenses: { [key: string]: { emoji: string; value: number }[] };
}

const initialState: PlannerState = {
  years: {},
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,
  status: 'idle',
  error: null,
};

export const fetchPlannerData = createAsyncThunk('planner/fetchPlannerData', async () => {
  try {
    const response = await axios.get('/api/planner');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch planner data');
  }
});

export const updatePlannerData = createAsyncThunk(
  'planner/updatePlannerData',
  async ({ year, month, income, savings, weekPlans }: { year: number; month: number; income?: number; savings?: number; weekPlans?: WeekPlan[] }) => {
    try {
      const response = await axios.post('/api/planner', { year, month, income, savings, weekPlans });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update planner data');
    }
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
      if (!state.years[year]) {
        state.years[year] = {};
      }
      if (!state.years[year][month]) {
        state.years[year][month] = {
          income: 0,
          savings: 0,
          weekPlans: [],
        };
      }
    },
    setIncome: (state, action: PayloadAction<{ year: number; month: number; income: number }>) => {
      const { year, month, income } = action.payload;
      if (state.years[year] && state.years[year][month]) {
        state.years[year][month].income = income;
      }
    },
    setSavings: (state, action: PayloadAction<{ year: number; month: number; savings: number }>) => {
      const { year, month, savings } = action.payload;
      if (state.years[year] && state.years[year][month]) {
        state.years[year][month].savings = savings;
      }
    },
    setWeekPlans: (state, action: PayloadAction<{ year: number; month: number; weekPlans: WeekPlan[] }>) => {
      const { year, month, weekPlans } = action.payload;
      if (state.years[year] && state.years[year][month]) {
        state.years[year][month].weekPlans = weekPlans;
      }
    },
    updateWeekPlan: (state, action: PayloadAction<{ year: number; month: number; weekIndex: number; updatedWeek: WeekPlan }>) => {
      const { year, month, weekIndex, updatedWeek } = action.payload;
      if (state.years[year] && state.years[year][month] && state.years[year][month].weekPlans[weekIndex]) {
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
        state.error = action.error.message ?? 'Failed to fetch planner data';
      })
      .addCase(updatePlannerData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePlannerData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // You may handle state updates after a successful update if needed
      })
      .addCase(updatePlannerData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to update planner data';
      });
  },
});

export const { setCurrentDate, initializeMonthData, setIncome, setSavings, setWeekPlans, updateWeekPlan } = plannerSlice.actions;
export default plannerSlice.reducer;
